import { NextRequest, NextResponse } from "next/server";
import { countryLocaleMap, defaultLocale, isLocale, normalizeLocale, pathHasLocale, type Locale } from "@/features/i18n/config";

const PUBLIC_FILE = /\.(.*)$/;
const apexHost = "bobob.app";
const canonicalHost = "www.bobob.app";
const skippedPrefixes = ["/_next", "/api", "/sitemaps"];
const contentExperimentPrefixes = ["/blog", "/play"];
const searchCrawlerPattern =
  /googlebot|bingbot|bingpreview|duckduckbot|slurp|baiduspider|yandexbot|applebot|petalbot|seznambot|facebookexternalhit|twitterbot|linkedinbot/i;

function localeFromCookie(request: NextRequest): Locale | undefined {
  return normalizeLocale(request.cookies.get("NEXT_LOCALE")?.value);
}

function localeFromAcceptLanguage(request: NextRequest): Locale | undefined {
  const header = request.headers.get("accept-language");
  if (!header) return undefined;
  const candidates = header
    .split(",")
    .map((item) => item.split(";")[0]?.trim())
    .filter(Boolean);

  for (const candidate of candidates) {
    const locale = normalizeLocale(candidate);
    if (locale) return locale;
  }

  return undefined;
}

function localeFromCountry(request: NextRequest): Locale | undefined {
  const country = request.headers.get("x-vercel-ip-country") ?? request.headers.get("cf-ipcountry");
  if (!country) return undefined;
  return countryLocaleMap[country.toUpperCase()];
}

function preferredLocale(request: NextRequest): Locale {
  return localeFromCookie(request) ?? localeFromAcceptLanguage(request) ?? localeFromCountry(request) ?? defaultLocale;
}

function isSearchCrawler(request: NextRequest) {
  return searchCrawlerPattern.test(request.headers.get("user-agent") ?? "");
}

function isContentExperimentPath(pathname: string) {
  return pathname === "/" || contentExperimentPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

function nextWithLocale(request: NextRequest, locale: Locale) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-bobob-locale", locale);
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

function canonicalHostRedirect(request: NextRequest) {
  const host = request.headers.get("host")?.split(":")[0]?.toLowerCase();
  if (host !== apexHost) return null;

  const url = request.nextUrl.clone();
  url.protocol = "https";
  url.hostname = canonicalHost;
  return NextResponse.redirect(url, 308);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hostRedirect = canonicalHostRedirect(request);
  if (hostRedirect) return hostRedirect;

  if (skippedPrefixes.some((prefix) => pathname.startsWith(prefix)) || PUBLIC_FILE.test(pathname)) {
    return NextResponse.next();
  }

  const firstSegment = pathname.split("/").filter(Boolean)[0];
  if (isLocale(firstSegment)) {
    const response = nextWithLocale(request, firstSegment);
    response.cookies.set("NEXT_LOCALE", firstSegment, { path: "/", maxAge: 31_536_000, sameSite: "lax" });
    return response;
  }

  if (pathHasLocale(pathname)) return nextWithLocale(request, firstSegment as Locale);

  if (isContentExperimentPath(pathname)) return nextWithLocale(request, "ko");

  if (isSearchCrawler(request)) return nextWithLocale(request, defaultLocale);

  preferredLocale(request);
  return nextWithLocale(request, defaultLocale);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|sitemaps|ads.txt).*)"],
};
