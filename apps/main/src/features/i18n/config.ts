export const defaultLocale = "en" as const;

export const locales = [
  "en",
  "ko",
  "ja",
  "zh-CN",
  "zh-TW",
  "es",
  "pt-BR",
  "de",
  "fr",
  "hi",
  "id",
  "vi",
  "th",
  "ar",
] as const;

export type Locale = (typeof locales)[number];

export const localeSet = new Set<string>(locales);

export const localeLabels: Record<Locale, string> = {
  en: "English",
  ko: "Korean",
  ja: "Japanese",
  "zh-CN": "Chinese (Simplified)",
  "zh-TW": "Chinese (Traditional)",
  es: "Spanish",
  "pt-BR": "Portuguese (Brazil)",
  de: "German",
  fr: "French",
  hi: "Hindi",
  id: "Indonesian",
  vi: "Vietnamese",
  th: "Thai",
  ar: "Arabic",
};

export const openGraphLocales: Record<Locale, string> = {
  en: "en_US",
  ko: "ko_KR",
  ja: "ja_JP",
  "zh-CN": "zh_CN",
  "zh-TW": "zh_TW",
  es: "es_ES",
  "pt-BR": "pt_BR",
  de: "de_DE",
  fr: "fr_FR",
  hi: "hi_IN",
  id: "id_ID",
  vi: "vi_VN",
  th: "th_TH",
  ar: "ar_SA",
};

export const countryLocaleMap: Record<string, Locale> = {
  KR: "ko",
  JP: "ja",
  CN: "zh-CN",
  TW: "zh-TW",
  HK: "zh-TW",
  MO: "zh-TW",
  BR: "pt-BR",
  PT: "pt-BR",
  ES: "es",
  MX: "es",
  AR: "es",
  CL: "es",
  CO: "es",
  PE: "es",
  DE: "de",
  AT: "de",
  CH: "de",
  FR: "fr",
  BE: "fr",
  IN: "hi",
  ID: "id",
  VN: "vi",
  TH: "th",
  SA: "ar",
  AE: "ar",
  EG: "ar",
  QA: "ar",
  KW: "ar",
};

export function isLocale(value: string | undefined): value is Locale {
  return Boolean(value && localeSet.has(value));
}

export function normalizeLocale(value: string | undefined): Locale | undefined {
  if (!value) return undefined;
  const trimmed = value.trim();
  if (isLocale(trimmed)) return trimmed;
  const lowered = trimmed.toLowerCase();
  if (lowered === "zh-cn" || lowered === "zh-hans" || lowered === "zh") return "zh-CN";
  if (lowered === "zh-tw" || lowered === "zh-hant" || lowered === "zh-hk") return "zh-TW";
  if (lowered === "pt-br" || lowered === "pt") return "pt-BR";
  return locales.find((locale) => locale.toLowerCase() === lowered || lowered.startsWith(`${locale.toLowerCase()}-`));
}

export function pathHasLocale(pathname: string) {
  const firstSegment = pathname.split("/").filter(Boolean)[0];
  return isLocale(firstSegment);
}

export function stripLocale(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  if (isLocale(segments[0])) {
    const stripped = `/${segments.slice(1).join("/")}`;
    return stripped === "/" ? "/" : stripped.replace(/\/$/, "");
  }
  return pathname || "/";
}

export function withLocale(pathname: string, locale: Locale) {
  const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  if (locale === defaultLocale) return normalizedPath;
  if (normalizedPath === "/") return `/${locale}`;
  return `/${locale}${normalizedPath}`;
}

export function languageAlternates(pathname: string) {
  const path = stripLocale(pathname);
  return {
    "x-default": `https://www.bobob.app${withLocale(path, defaultLocale)}`,
    ...Object.fromEntries(
      locales.map((locale) => [locale, `https://www.bobob.app${withLocale(path, locale)}`]),
    ),
  } as Record<string, string>;
}
