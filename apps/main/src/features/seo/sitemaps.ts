import { defaultLocale, type Locale } from "@/features/i18n/config";
import { blogCategoryDefinitions, blogCategoryPath } from "@/features/content/blog-categories";
import { getIndexableBlogPosts } from "@/features/content/blog";
import { getPlayContents } from "@/features/content/play";
import { operationalToolSlugs } from "@/features/tools/operational-surface";

const siteUrl = "https://www.bobob.app";
const archiveLastmod = "2026-07-09";
const sitemapSubmissionLocales = [defaultLocale] as const;

type ChangeFrequency = "weekly" | "monthly" | "yearly";

type SitemapPath = {
  path: string;
  changefreq: ChangeFrequency;
  priority: string;
  lastmod: string;
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

function latestDate(dates: string[]) {
  return dates.map((date) => date.slice(0, 10)).sort((left, right) => right.localeCompare(left))[0] ?? archiveLastmod;
}

function blogPostLastmod(post: { date: string; updatedAt?: string }) {
  return post.updatedAt ?? post.date;
}

function blogLastmod() {
  return latestDate(getIndexableBlogPosts().map(blogPostLastmod));
}

function playLastmod() {
  return latestDate(getPlayContents().map((content) => content.updatedAt));
}

function siteLastmod() {
  return latestDate([blogLastmod(), playLastmod(), archiveLastmod]);
}

function basePaths(): SitemapPath[] {
  const latestBlogLastmod = blogLastmod();
  const latestPlayLastmod = playLastmod();
  const latestSiteLastmod = siteLastmod();
  const posts = getIndexableBlogPosts();

  return [
    { path: "/", changefreq: "weekly", priority: "1.0", lastmod: latestSiteLastmod },
    { path: "/search", changefreq: "weekly", priority: "0.7", lastmod: latestSiteLastmod },
    { path: "/about", changefreq: "monthly", priority: "0.6", lastmod: archiveLastmod },
    { path: "/contact", changefreq: "monthly", priority: "0.5", lastmod: archiveLastmod },
    { path: "/privacy", changefreq: "monthly", priority: "0.5", lastmod: archiveLastmod },
    { path: "/terms", changefreq: "monthly", priority: "0.5", lastmod: archiveLastmod },
    { path: "/blog", changefreq: "weekly", priority: "0.8", lastmod: latestBlogLastmod },
    ...blogCategoryDefinitions
      .map((category) => ({
        category,
        posts: posts.filter((post) => post.category === category.label),
      }))
      .filter((group) => group.posts.length)
      .map((group) => ({
        path: blogCategoryPath(group.category.slug),
        changefreq: "weekly" as const,
        priority: "0.7",
        lastmod: latestDate(group.posts.map(blogPostLastmod)),
      })),
    ...posts.map((post) => ({
      path: `/blog/${post.slug}`,
      changefreq: "monthly" as const,
      priority: "0.7",
      lastmod: blogPostLastmod(post),
    })),
    { path: "/play", changefreq: "weekly", priority: "0.8", lastmod: latestPlayLastmod },
    ...getPlayContents().map((content) => ({
      path: `/play/${content.slug}`,
      changefreq: "weekly" as const,
      priority: content.type === "micro-sim" ? "0.9" : "0.8",
      lastmod: content.updatedAt,
    })),
    { path: "/tools", changefreq: "weekly", priority: "0.7", lastmod: archiveLastmod },
    ...operationalToolSlugs.map((slug) => ({
      path: `/tools/${slug}`,
      changefreq: "monthly" as const,
      priority: "0.7",
      lastmod: archiveLastmod,
    })),
  ];
}

function alternateLinks(path: string) {
  return `<xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(absoluteUrl(path))}" />`;
}

export function sitemapLocales() {
  return [...sitemapSubmissionLocales];
}

export function sitemapIndexXml() {
  const lastmod = siteLastmod();
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
        `<lastmod>${entry.lastmod}</lastmod>`,
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
