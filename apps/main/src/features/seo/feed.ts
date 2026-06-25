import { getBlogPosts } from "@/features/content/blog";
import { blogPostKeywords, playContentKeywords } from "@/features/content/discovery";
import { getPlayContents } from "@/features/content/play";

const siteUrl = "https://www.bobob.app";

type FeedItem = {
  title: string;
  description: string;
  url: string;
  date: string;
  categories: string[];
};

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function rfc822(date: string) {
  return new Date(date).toUTCString();
}

function latestItemDate(items: FeedItem[]) {
  return items.map((item) => item.date).sort((left, right) => right.localeCompare(left))[0] ?? "2026-06-25T00:00:00+09:00";
}

function isoDate(date: string) {
  return new Date(date).toISOString();
}

function blogFeedItems(): FeedItem[] {
  return getBlogPosts().map((post) => ({
    title: post.title,
    description: post.description,
    url: `${siteUrl}/blog/${post.slug}`,
    date: `${post.date}T00:00:00+09:00`,
    categories: blogPostKeywords(post).slice(0, 8),
  }));
}

function playFeedItems(): FeedItem[] {
  return getPlayContents().map((content) => ({
    title: content.title,
    description: content.description,
    url: `${siteUrl}/play/${content.slug}`,
    date: `${content.updatedAt}T00:00:00+09:00`,
    categories: playContentKeywords(content).slice(0, 8),
  }));
}

function feedItems() {
  return [...blogFeedItems(), ...playFeedItems()].sort((a, b) => b.date.localeCompare(a.date));
}

export function rssFeedXml() {
  const items = feedItems();
  const itemXml = items
    .map((item) => {
      const categories = item.categories.map((category) => `<category>${escapeXml(category)}</category>`).join("");

      return [
        "<item>",
        `<title>${escapeXml(item.title)}</title>`,
        `<link>${escapeXml(item.url)}</link>`,
        `<guid isPermaLink="true">${escapeXml(item.url)}</guid>`,
        `<description>${escapeXml(item.description)}</description>`,
        `<pubDate>${escapeXml(rfc822(item.date))}</pubDate>`,
        categories,
        "</item>",
      ].join("");
    })
    .join("");

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0">',
    "<channel>",
    "<title>bobob.app Blog and Play Lab</title>",
    `<link>${siteUrl}/</link>`,
    "<description>Development and AI notes plus lightweight static web Play experiments.</description>",
    "<language>ko</language>",
    `<lastBuildDate>${escapeXml(rfc822(latestItemDate(items)))}</lastBuildDate>`,
    itemXml,
    "</channel>",
    "</rss>",
  ].join("");
}

export function atomFeedXml() {
  const items = feedItems();
  const entries = items
    .map((item) => {
      const categories = item.categories.map((category) => `<category term="${escapeXml(category)}" />`).join("");

      return [
        "<entry>",
        `<title>${escapeXml(item.title)}</title>`,
        `<link href="${escapeXml(item.url)}" />`,
        `<id>${escapeXml(item.url)}</id>`,
        `<published>${escapeXml(isoDate(item.date))}</published>`,
        `<updated>${escapeXml(isoDate(item.date))}</updated>`,
        `<summary>${escapeXml(item.description)}</summary>`,
        categories,
        "</entry>",
      ].join("");
    })
    .join("");

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<feed xmlns="http://www.w3.org/2005/Atom">',
    "<title>bobob.app Blog and Play Lab</title>",
    `<id>${siteUrl}/</id>`,
    `<link href="${siteUrl}/" />`,
    `<link rel="self" href="${siteUrl}/atom.xml" />`,
    "<subtitle>Development and AI notes plus lightweight static web Play experiments.</subtitle>",
    `<updated>${escapeXml(isoDate(latestItemDate(items)))}</updated>`,
    entries,
    "</feed>",
  ].join("");
}

export function jsonFeed() {
  const items = feedItems();

  return {
    version: "https://jsonfeed.org/version/1.1",
    title: "bobob.app Blog and Play Lab",
    home_page_url: `${siteUrl}/`,
    feed_url: `${siteUrl}/feed.json`,
    description: "Development and AI notes plus lightweight static web Play experiments.",
    language: "ko",
    items: items.map((item) => ({
      id: item.url,
      url: item.url,
      title: item.title,
      summary: item.description,
      content_text: item.description,
      date_published: isoDate(item.date),
      date_modified: isoDate(item.date),
      tags: item.categories,
    })),
  };
}
