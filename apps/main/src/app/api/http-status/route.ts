import { NextRequest, NextResponse } from "next/server";
import { assertPublicHttpUrl, consumeRateLimit } from "@/features/server/network-guards";

type RedirectHop = {
  url: string;
  status: number;
  statusText: string;
  location: string | null;
  contentType: string | null;
  cacheControl: string | null;
  elapsedMs: number;
};

type RequestProfileKey = "public" | "googlebot-smartphone" | "google-inspection-mobile";

type HtmlIndexabilitySignals = {
  checked: boolean;
  isHtml: boolean;
  htmlLang: string | null;
  title: string | null;
  titleLength: number;
  description: string | null;
  descriptionLength: number;
  canonicalHref: string | null;
  canonicalMatchesFinal: boolean | null;
  robots: string | null;
  googlebotRobots: string | null;
  noindex: boolean;
  h1Count: number;
};

const requestProfiles: Record<
  RequestProfileKey,
  {
    key: RequestProfileKey;
    label: string;
    userAgent: string;
    accept: string;
    acceptLanguage: string;
  }
> = {
  public: {
    key: "public",
    label: "Public checker",
    userAgent: "BobobStatusChecker/1.0",
    accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    acceptLanguage: "en-US,en;q=0.9",
  },
  "googlebot-smartphone": {
    key: "googlebot-smartphone",
    label: "Googlebot Smartphone",
    userAgent:
      "Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
    accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    acceptLanguage: "en-US,en;q=0.9",
  },
  "google-inspection-mobile": {
    key: "google-inspection-mobile",
    label: "Google InspectionTool mobile",
    userAgent:
      "Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36 (compatible; Google-InspectionTool/1.0;)",
    accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    acceptLanguage: "en-US,en;q=0.9",
  },
};

function normalizeRequestProfile(value: string | null): RequestProfileKey {
  const normalized = (value ?? "").trim().toLowerCase();
  if (["googlebot", "googlebot-smartphone", "googlebot-mobile"].includes(normalized)) return "googlebot-smartphone";
  if (["inspection", "google-inspection", "google-inspection-mobile", "url-inspection", "inspection-tool"].includes(normalized)) return "google-inspection-mobile";
  return "public";
}

const finalHeaderAllowlist = new Set([
  "age",
  "access-control-allow-origin",
  "cache-control",
  "cf-cache-status",
  "content-encoding",
  "content-language",
  "content-security-policy",
  "content-security-policy-report-only",
  "content-type",
  "etag",
  "expires",
  "last-modified",
  "location",
  "permissions-policy",
  "referrer-policy",
  "server",
  "strict-transport-security",
  "vary",
  "x-cache",
  "x-content-type-options",
  "x-frame-options",
  "x-vercel-cache",
]);

function collectFinalHeaders(headers: Headers) {
  return Array.from(headers.entries())
    .filter(([name]) => finalHeaderAllowlist.has(name.toLowerCase()))
    .map(([name, value]) => ({ name: name.toLowerCase(), value }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

function decodeHtmlText(value: string) {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function htmlAttribute(tag: string, name: string) {
  const unquotedAttribute = "[^\\s\"'=<>`]+";
  const match = tag.match(new RegExp(`${name}\\s*=\\s*("([^"]*)"|'([^']*)'|(${unquotedAttribute}))`, "i"));
  return match ? decodeHtmlText(match[2] ?? match[3] ?? match[4] ?? "") : null;
}

function findMetaContent(html: string, name: string) {
  const tags = html.match(/<meta\b[^>]*>/gi) ?? [];
  const expected = name.toLowerCase();
  for (const tag of tags) {
    const tagName = htmlAttribute(tag, "name")?.toLowerCase();
    if (tagName === expected) return htmlAttribute(tag, "content");
  }
  return null;
}

function findCanonicalHref(html: string, finalUrl: string) {
  const tags = html.match(/<link\b[^>]*>/gi) ?? [];
  for (const tag of tags) {
    const rel = htmlAttribute(tag, "rel")?.toLowerCase() ?? "";
    if (!rel.split(/\s+/).includes("canonical")) continue;
    const href = htmlAttribute(tag, "href");
    if (!href) return null;
    try {
      return new URL(href, finalUrl).toString();
    } catch {
      return href;
    }
  }
  return null;
}

function normalizeUrlForComparison(value: string) {
  try {
    const url = new URL(value);
    url.hash = "";
    return url.toString();
  } catch {
    return value.trim();
  }
}

function getCharset(contentType: string | null) {
  return contentType?.match(/charset=([^;]+)/i)?.[1]?.trim().replace(/^["']|["']$/g, "") || "utf-8";
}

function decodeHtmlPreview(bytes: Uint8Array, contentType: string | null) {
  try {
    return new TextDecoder(getCharset(contentType)).decode(bytes);
  } catch {
    return new TextDecoder("utf-8").decode(bytes);
  }
}

async function readHtmlPreview(response: Response, contentType: string | null, maxBytes = 300_000) {
  if (!response.body) return (await response.text()).slice(0, maxBytes);

  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let received = 0;

  try {
    while (received < maxBytes) {
      const { done, value } = await reader.read();
      if (done || !value) break;
      const remaining = maxBytes - received;
      const chunk = value.byteLength > remaining ? value.slice(0, remaining) : value;
      chunks.push(chunk);
      received += chunk.byteLength;
      if (value.byteLength > remaining) break;
    }
  } finally {
    await reader.cancel().catch(() => undefined);
  }

  const bytes = new Uint8Array(received);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return decodeHtmlPreview(bytes, contentType);
}

function parseHtmlIndexability(html: string, finalUrl: string, contentType: string | null): HtmlIndexabilitySignals {
  const title = decodeHtmlText(html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "");
  const description = findMetaContent(html, "description") ?? "";
  const canonicalHref = findCanonicalHref(html, finalUrl);
  const robots = findMetaContent(html, "robots");
  const googlebotRobots = findMetaContent(html, "googlebot");
  const combinedRobots = `${robots ?? ""},${googlebotRobots ?? ""}`.toLowerCase();
  const htmlTag = html.match(/<html\b[^>]*>/i)?.[0] ?? "";
  const htmlLang = htmlTag ? htmlAttribute(htmlTag, "lang") : null;

  return {
    checked: true,
    isHtml: Boolean(contentType?.toLowerCase().includes("html")),
    htmlLang,
    title: title || null,
    titleLength: title.length,
    description: description || null,
    descriptionLength: description.length,
    canonicalHref,
    canonicalMatchesFinal: canonicalHref ? normalizeUrlForComparison(canonicalHref) === normalizeUrlForComparison(finalUrl) : null,
    robots,
    googlebotRobots,
    noindex: combinedRobots.includes("noindex"),
    h1Count: html.match(/<h1\b/gi)?.length ?? 0,
  };
}

async function collectHtmlIndexability(response: Response, finalUrl: string): Promise<HtmlIndexabilitySignals | null> {
  const contentType = response.headers.get("content-type");
  if (!contentType?.toLowerCase().includes("html")) {
    return {
      checked: false,
      isHtml: false,
      htmlLang: null,
      title: null,
      titleLength: 0,
      description: null,
      descriptionLength: 0,
      canonicalHref: null,
      canonicalMatchesFinal: null,
      robots: null,
      googlebotRobots: null,
      noindex: false,
      h1Count: 0,
    };
  }

  try {
    const html = await readHtmlPreview(response, contentType);
    return parseHtmlIndexability(html, finalUrl, contentType);
  } catch {
    return null;
  }
}

async function fetchPublicUrl(value: string, signal: AbortSignal, requestProfileKey: RequestProfileKey) {
  let url = await assertPublicHttpUrl(value);
  const redirectChain: RedirectHop[] = [];
  const requestProfile = requestProfiles[requestProfileKey];

  for (let redirectCount = 0; redirectCount <= 5; redirectCount += 1) {
    const startedAt = performance.now();
    const response = await fetch(url, {
      method: "GET",
      redirect: "manual",
      signal,
      headers: {
        accept: requestProfile.accept,
        "accept-language": requestProfile.acceptLanguage,
        "user-agent": requestProfile.userAgent,
      },
    });
    const elapsedMs = Math.max(0, Math.round(performance.now() - startedAt));
    const location = response.headers.get("location");
    redirectChain.push({
      url: url.toString(),
      status: response.status,
      statusText: response.statusText,
      location,
      contentType: response.headers.get("content-type"),
      cacheControl: response.headers.get("cache-control"),
      elapsedMs,
    });

    if (![301, 302, 303, 307, 308].includes(response.status)) {
      return { response, finalUrl: url.toString(), redirectCount, redirectChain, finalResponseHeaders: collectFinalHeaders(response.headers), requestProfile };
    }

    if (!location) return { response, finalUrl: url.toString(), redirectCount, redirectChain, finalResponseHeaders: collectFinalHeaders(response.headers), requestProfile };
    url = await assertPublicHttpUrl(new URL(location, url));
  }

  throw new Error("Too many redirects.");
}

function isInputError(error: unknown) {
  return error instanceof Error && /invalid url|public|private|reserved|credentials|protocol/i.test(error.message);
}

export async function GET(request: NextRequest) {
  const rateLimit = consumeRateLimit(request, "http-status", 40);
  if (rateLimit) {
    return NextResponse.json(
      { error: "Too many requests. Try again shortly." },
      { status: 429, headers: { "Retry-After": String(rateLimit.retryAfterSeconds) } },
    );
  }

  const value = request.nextUrl.searchParams.get("url") ?? "";
  const requestProfileKey = normalizeRequestProfile(request.nextUrl.searchParams.get("profile") ?? request.nextUrl.searchParams.get("crawler"));
  if (!value) {
    return NextResponse.json({ error: "Use a public http or https URL." }, { status: 400 });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8_000);

  try {
    const { response, finalUrl, redirectCount, redirectChain, finalResponseHeaders, requestProfile } = await fetchPublicUrl(value, controller.signal, requestProfileKey);
    const indexability = await collectHtmlIndexability(response, finalUrl);
    return NextResponse.json({
      inputUrl: value,
      finalUrl,
      requestProfile: {
        key: requestProfile.key,
        label: requestProfile.label,
        userAgent: requestProfile.userAgent,
      },
      redirectCount,
      redirectChain,
      finalResponseHeaders,
      status: response.status,
      statusText: response.statusText,
      ok: response.status >= 200 && response.status < 300,
      contentType: response.headers.get("content-type"),
      cacheControl: response.headers.get("cache-control"),
      server: response.headers.get("server"),
      indexability,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "HTTP check failed.";
    return NextResponse.json({ error: message }, { status: isInputError(error) ? 400 : 502 });
  } finally {
    clearTimeout(timeout);
  }
}
