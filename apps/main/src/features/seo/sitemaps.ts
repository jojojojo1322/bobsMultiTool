import { guides } from "@/features/guides/registry";
import { defaultLocale, isLocale, locales, withLocale, type Locale } from "@/features/i18n/config";
import { tools } from "@/features/tools/registry";

const siteUrl = "https://www.bobob.app";
const lastmod = "2026-06-22";

type ChangeFrequency = "weekly" | "monthly" | "yearly";

type SitemapPath = {
  path: string;
  changefreq: ChangeFrequency;
  priority: string;
};

function absoluteUrl(path: string) {
  return path === "/" ? `${siteUrl}/` : `${siteUrl}${path}`;
}

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function basePaths(): SitemapPath[] {
  return [
    { path: "/", changefreq: "weekly", priority: "1.0" },
    { path: "/tools", changefreq: "weekly", priority: "0.9" },
    ...tools.map((tool) => ({
      path: `/tools/${tool.slug}`,
      changefreq: "weekly" as const,
      priority: tool.monetizationTier === "core" ? "0.9" : tool.monetizationTier === "growth" ? "0.8" : "0.7",
    })),
    { path: "/guides", changefreq: "monthly", priority: "0.7" },
    ...guides.map((guide) => ({
      path: `/guides/${guide.slug}`,
      changefreq: "monthly" as const,
      priority: "0.7",
    })),
    { path: "/about", changefreq: "yearly", priority: "0.4" },
    { path: "/contact", changefreq: "yearly", priority: "0.4" },
    { path: "/privacy", changefreq: "yearly", priority: "0.3" },
    { path: "/terms", changefreq: "yearly", priority: "0.3" },
  ];
}

function alternateLinks(path: string) {
  const xDefault = `<xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(absoluteUrl(withLocale(path, defaultLocale)))}" />`;
  const localeLinks = locales
    .map((locale) => {
      const href = absoluteUrl(withLocale(path, locale));
      return `<xhtml:link rel="alternate" hreflang="${locale}" href="${escapeXml(href)}" />`;
    })
    .join("");

  return `${xDefault}${localeLinks}`;
}

export function sitemapLocales() {
  return [...locales];
}

export function sitemapIndexXml() {
  const entries = sitemapLocales()
    .map((locale) => {
      const loc = `${siteUrl}/sitemaps/${locale}`;
      return `<sitemap><loc>${escapeXml(loc)}</loc><lastmod>${lastmod}</lastmod></sitemap>`;
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries}</sitemapindex>`;
}

export function localizedSitemapXml(locale: Locale) {
  const entries = basePaths()
    .map((entry) => {
      const loc = absoluteUrl(withLocale(entry.path, locale));
      return [
        "<url>",
        `<loc>${escapeXml(loc)}</loc>`,
        `<lastmod>${lastmod}</lastmod>`,
        `<changefreq>${entry.changefreq}</changefreq>`,
        `<priority>${entry.priority}</priority>`,
        alternateLinks(entry.path),
        "</url>",
      ].join("");
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${entries}</urlset>`;
}

export function isSitemapLocale(value: string): value is Locale {
  return isLocale(value);
}

export function sitemapUrlCountPerLocale() {
  return basePaths().length;
}
