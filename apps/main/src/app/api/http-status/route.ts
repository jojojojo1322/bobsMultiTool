import { NextRequest, NextResponse } from "next/server";
import { assertPublicHttpUrl, consumeRateLimit } from "@/features/server/network-guards";

async function fetchPublicUrl(value: string, signal: AbortSignal) {
  let url = await assertPublicHttpUrl(value);

  for (let redirectCount = 0; redirectCount <= 5; redirectCount += 1) {
    const response = await fetch(url, {
      method: "GET",
      redirect: "manual",
      signal,
      headers: {
        "user-agent": "BobobStatusChecker/1.0",
      },
    });

    if (![301, 302, 303, 307, 308].includes(response.status)) {
      return { response, finalUrl: url.toString(), redirectCount };
    }

    const location = response.headers.get("location");
    if (!location) return { response, finalUrl: url.toString(), redirectCount };
    url = await assertPublicHttpUrl(new URL(location, url));
  }

  throw new Error("Too many redirects.");
}

function isInputError(error: unknown) {
  return error instanceof TypeError || error instanceof Error && /public|private|reserved|credentials|protocol/i.test(error.message);
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
  if (!value) {
    return NextResponse.json({ error: "Use a public http or https URL." }, { status: 400 });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8_000);

  try {
    const { response, finalUrl, redirectCount } = await fetchPublicUrl(value, controller.signal);
    return NextResponse.json({
      inputUrl: value,
      finalUrl,
      redirectCount,
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
