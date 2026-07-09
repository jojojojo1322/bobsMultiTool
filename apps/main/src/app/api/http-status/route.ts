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
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "HTTP check failed.";
    return NextResponse.json({ error: message }, { status: isInputError(error) ? 400 : 502 });
  } finally {
    clearTimeout(timeout);
  }
}
