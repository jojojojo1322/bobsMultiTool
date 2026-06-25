import { getBlogPosts } from "@/features/content/blog";
import { getPlayContents } from "@/features/content/play";

const siteUrl = "https://www.bobob.app";

type FeedItem = {
  title: string;
  description: string;
  url: string;
  date: string;
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

function blogFeedItems(): FeedItem[] {
  return getBlogPosts().map((post) => ({
    title: post.title,
    description: post.description,
    url: `${siteUrl}/blog/${post.slug}`,
    date: `${post.date}T00:00:00+09:00`,
  }));
}

function playFeedItems(): FeedItem[] {
  return getPlayContents().map((content) => ({
    title: content.title,
    description: content.description,
    url: `${siteUrl}/play/${content.slug}`,
    date: `${content.updatedAt}T00:00:00+09:00`,
  }));
}

export function rssFeedXml() {
  const feedItems = [...blogFeedItems(), ...playFeedItems()];
  const items = feedItems
    .sort((a, b) => b.date.localeCompare(a.date))
    .map((item) =>
      [
        "<item>",
        `<title>${escapeXml(item.title)}</title>`,
        `<link>${escapeXml(item.url)}</link>`,
        `<guid isPermaLink="true">${escapeXml(item.url)}</guid>`,
        `<description>${escapeXml(item.description)}</description>`,
        `<pubDate>${escapeXml(rfc822(item.date))}</pubDate>`,
        "</item>",
      ].join(""),
    )
    .join("");

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0">',
    "<channel>",
    "<title>bobob.app Blog and Play Lab</title>",
    `<link>${siteUrl}/</link>`,
    "<description>Development and AI notes plus lightweight static web Play experiments.</description>",
    "<language>ko</language>",
    `<lastBuildDate>${escapeXml(rfc822(latestItemDate(feedItems)))}</lastBuildDate>`,
    items,
    "</channel>",
    "</rss>",
  ].join("");
}
