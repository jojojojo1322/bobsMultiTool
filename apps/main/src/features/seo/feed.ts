import { getBlogPosts } from "@/features/content/blog";
import { blogPostKeywords, playContentKeywords } from "@/features/content/discovery";
import { getPlayContents } from "@/features/content/play";

const siteUrl = "https://www.bobob.app";
const webSubHubUrl = "https://pubsubhubbub.appspot.com/";
const feedTitle = "bobob.app - 개발/AI 기록과 짧은 Play";
const feedDescription = "개발/AI 작업 기록과 브라우저에서 바로 해보는 짧은 Play를 함께 올립니다.";

type FeedItem = {
  title: string;
  description: string;
  url: string;
  publishedDate: string;
  modifiedDate: string;
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
  return items.map((item) => item.modifiedDate).sort((left, right) => right.localeCompare(left))[0] ?? "2026-06-25T00:00:00+09:00";
}

function isoDate(date: string) {
  return new Date(date).toISOString();
}

function blogFeedItems(): FeedItem[] {
  return getBlogPosts().map((post) => ({
    title: post.title,
    description: post.description,
    url: `${siteUrl}/blog/${post.slug}`,
    publishedDate: `${post.date}T00:00:00+09:00`,
    modifiedDate: `${post.updatedAt ?? post.date}T00:00:00+09:00`,
    categories: blogPostKeywords(post).slice(0, 8),
  }));
}

function playFeedItems(): FeedItem[] {
  return getPlayContents().map((content) => ({
    title: content.title,
    description: content.description,
    url: `${siteUrl}/play/${content.slug}`,
    publishedDate: `${content.updatedAt}T00:00:00+09:00`,
    modifiedDate: `${content.updatedAt}T00:00:00+09:00`,
    categories: playContentKeywords(content).slice(0, 8),
  }));
}

function feedItems() {
  return [...blogFeedItems(), ...playFeedItems()].sort((a, b) => b.modifiedDate.localeCompare(a.modifiedDate));
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
        `<pubDate>${escapeXml(rfc822(item.publishedDate))}</pubDate>`,
        categories,
        "</item>",
      ].join("");
    })
    .join("");

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    "<channel>",
    `<title>${escapeXml(feedTitle)}</title>`,
    `<link>${siteUrl}/</link>`,
    `<atom:link rel="hub" href="${webSubHubUrl}" />`,
    `<atom:link rel="self" href="${siteUrl}/feed.xml" />`,
    `<description>${escapeXml(feedDescription)}</description>`,
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
        `<published>${escapeXml(isoDate(item.publishedDate))}</published>`,
        `<updated>${escapeXml(isoDate(item.modifiedDate))}</updated>`,
        `<summary>${escapeXml(item.description)}</summary>`,
        categories,
        "</entry>",
      ].join("");
    })
    .join("");

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<feed xmlns="http://www.w3.org/2005/Atom">',
    `<title>${escapeXml(feedTitle)}</title>`,
    `<id>${siteUrl}/</id>`,
    `<link href="${siteUrl}/" />`,
    `<link rel="hub" href="${webSubHubUrl}" />`,
    `<link rel="self" href="${siteUrl}/atom.xml" />`,
    `<subtitle>${escapeXml(feedDescription)}</subtitle>`,
    `<updated>${escapeXml(isoDate(latestItemDate(items)))}</updated>`,
    entries,
    "</feed>",
  ].join("");
}

export function jsonFeed() {
  const items = feedItems();

  return {
    version: "https://jsonfeed.org/version/1.1",
    title: feedTitle,
    home_page_url: `${siteUrl}/`,
    feed_url: `${siteUrl}/feed.json`,
    description: feedDescription,
    language: "ko",
    hubs: [{ type: "WebSub", url: webSubHubUrl }],
    items: items.map((item) => ({
      id: item.url,
      url: item.url,
      title: item.title,
      summary: item.description,
      content_text: item.description,
      date_published: isoDate(item.publishedDate),
      date_modified: isoDate(item.modifiedDate),
      tags: item.categories,
    })),
  };
}
