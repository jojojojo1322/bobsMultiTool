import { NextRequest, NextResponse } from "next/server";

function isPublicHttpUrl(value: string) {
  try {
    const url = new URL(value);
    if (!["http:", "https:"].includes(url.protocol)) return false;
    const hostname = url.hostname.toLowerCase();
    if (hostname === "localhost" || hostname.endsWith(".local")) return false;
    if (/^(10|127|169\.254|172\.(1[6-9]|2\d|3[0-1])|192\.168)\./.test(hostname)) return false;
    return true;
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  const value = request.nextUrl.searchParams.get("url") ?? "";
  if (!isPublicHttpUrl(value)) {
    return NextResponse.json({ error: "Use a public http or https URL." }, { status: 400 });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8_000);

  try {
    const response = await fetch(value, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "user-agent": "BobobStatusChecker/1.0",
      },
    });
    return NextResponse.json({
      inputUrl: value,
      finalUrl: response.url,
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      contentType: response.headers.get("content-type"),
      cacheControl: response.headers.get("cache-control"),
      server: response.headers.get("server"),
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "HTTP check failed." }, { status: 502 });
  } finally {
    clearTimeout(timeout);
  }
}
