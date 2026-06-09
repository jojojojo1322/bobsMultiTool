import { NextRequest, NextResponse } from "next/server";
import { countryLocaleMap, defaultLocale, isLocale, normalizeLocale, pathHasLocale, withLocale, type Locale } from "@/features/i18n/config";

const PUBLIC_FILE = /\.(.*)$/;
const skippedPrefixes = ["/_next", "/api", "/sitemaps"];

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

function nextWithLocale(request: NextRequest, locale: Locale) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-bobob-locale", locale);
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
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

  const locale = preferredLocale(request);
  if (locale === defaultLocale) return nextWithLocale(request, defaultLocale);

  const url = request.nextUrl.clone();
  url.pathname = withLocale(pathname, locale);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|sitemaps|ads.txt).*)"],
};
