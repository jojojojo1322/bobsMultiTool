import { defaultLocale, type Locale } from "@/features/i18n/config";
import { getBlogPosts } from "@/features/content/blog";

const siteUrl = "https://www.bobob.app";
const lastmod = "2026-06-24";
const sitemapSubmissionLocales = [defaultLocale] as const;

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
    { path: "/blog", changefreq: "weekly", priority: "0.8" },
    ...getBlogPosts().map((post) => ({
      path: `/blog/${post.slug}`,
      changefreq: "monthly" as const,
      priority: "0.7",
    })),
    { path: "/play", changefreq: "weekly", priority: "0.8" },
    { path: "/play/office-survival", changefreq: "weekly", priority: "0.9" },
    { path: "/tools", changefreq: "monthly", priority: "0.5" },
  ];
}

function alternateLinks(path: string) {
  return `<xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(absoluteUrl(path))}" />`;
}

export function sitemapLocales() {
  return [...sitemapSubmissionLocales];
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

export function localizedSitemapXml(_locale: Locale) {
  void _locale;
  const entries = basePaths()
    .map((entry) => {
      const loc = absoluteUrl(entry.path);
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
  return (sitemapSubmissionLocales as readonly string[]).includes(value);
}

export function sitemapUrlCountPerLocale() {
  return basePaths().length;
}
