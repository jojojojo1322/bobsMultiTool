import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const baseUrl = (process.env.BOBOB_LIVE_BASE_URL || "https://www.bobob.app").replace(/\/$/, "");
const apexUrl = process.env.BOBOB_LIVE_APEX_URL || "https://bobob.app";
const requestTimeoutMs = Number.parseInt(process.env.BOBOB_LIVE_DISCOVERY_TIMEOUT_MS || "15000", 10);
const headers = {
  "user-agent": process.env.BOBOB_LIVE_DISCOVERY_USER_AGENT || "Googlebot",
  accept: "*/*",
  "accept-language": "en-US,en;q=0.9,ko;q=0.8",
};

const blogDir = path.join(root, "content/blog");
const playDir = path.join(root, "content/play");
const blogCategoryPath = path.join(root, "apps/main/src/features/content/blog-categories.ts");
const operationalSurfacePath = path.join(root, "apps/main/src/features/tools/operational-surface.ts");

const failures = [];

function read(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function parseFrontmatter(source) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n)?/);
  if (!match) return {};

  return Object.fromEntries(
    match[1]
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const separatorIndex = line.indexOf(":");
        if (separatorIndex === -1) return [line, ""];
        const key = line.slice(0, separatorIndex).trim();
        const value = line.slice(separatorIndex + 1).trim().replace(/^"|"$/g, "");
        return [key, value];
      }),
  );
}

function listBlogSlugs() {
  return fs
    .readdirSync(blogDir)
    .filter((file) => file.endsWith(".mdx") || file.endsWith(".md"))
    .map((file) => parseFrontmatter(read(path.join(blogDir, file))))
    .filter((frontmatter) => frontmatter.indexPolicy === "index")
    .map((frontmatter) => frontmatter.slug)
    .filter(Boolean)
    .sort();
}

function listPlaySlugs() {
  return fs
    .readdirSync(playDir)
    .filter((file) => file.endsWith(".json"))
    .map((file) => JSON.parse(read(path.join(playDir, file))).slug)
    .filter(Boolean)
    .sort();
}

function listBlogCategorySlugs() {
  return Array.from(read(blogCategoryPath).matchAll(/slug:\s+"([^"]+)"/g)).map((match) => match[1]).sort();
}

function listOperationalToolSlugs() {
  return Array.from(read(operationalSurfacePath).matchAll(/"([^"]+)"/g)).map((match) => match[1]).sort();
}

async function fetchLive(url, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), requestTimeoutMs);
  try {
    return await fetch(url, {
      ...options,
      headers: { ...headers, ...(options.headers ?? {}) },
      signal: controller.signal,
    });
  } catch (error) {
    failures.push(`${url} request failed: ${error?.message ?? String(error)}`);
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

async function textFor(pathname, options = {}) {
  const response = await fetchLive(`${baseUrl}${pathname}`, options);
  if (!response) return null;
  if (response.status < 200 || response.status >= 300) {
    failures.push(`${pathname} returned ${response.status}`);
    return null;
  }
  return response.text();
}

async function jsonFor(pathname) {
  const response = await fetchLive(`${baseUrl}${pathname}`);
  if (!response) return null;
  if (response.status < 200 || response.status >= 300) {
    failures.push(`${pathname} returned ${response.status}`);
    return null;
  }
  if (!response.headers.get("content-type")?.includes("application/json")) {
    failures.push(`${pathname} should return application/json`);
  }
  return response.json().catch((error) => {
    failures.push(`${pathname} returned invalid JSON: ${error?.message ?? String(error)}`);
    return null;
  });
}

function assertIncludes(label, body, fragments) {
  if (body == null) return;
  for (const fragment of fragments) {
    if (!body.includes(fragment)) failures.push(`${label} missing discovery fragment: ${fragment}`);
  }
}

const blogSlugs = listBlogSlugs();
const playSlugs = listPlaySlugs();
const blogCategorySlugs = listBlogCategorySlugs();
const operationalToolSlugs = listOperationalToolSlugs();
const expectedSitemapUrlCount = blogSlugs.length + playSlugs.length + blogCategorySlugs.length + 9 + operationalToolSlugs.length;
const expectedFeedItemCount = blogSlugs.length + playSlugs.length;

const apexResponse = await fetchLive(`${apexUrl}/`, { redirect: "manual" });
if (apexResponse) {
  if (![301, 308].includes(apexResponse.status)) {
    failures.push(`${apexUrl}/ should be a permanent canonical redirect, got ${apexResponse.status}`);
  }
  const location = apexResponse.headers.get("location") ?? "";
  if (location !== `${baseUrl}/`) {
    failures.push(`${apexUrl}/ redirects to ${location || "(empty)"}, expected ${baseUrl}/`);
  }
}

const homeHtml = await textFor("/");
assertIncludes("home", homeHtml, [
  'rel="search" type="application/opensearchdescription+xml"',
  'rel="alternate" type="application/atom+xml"',
  'rel="alternate" type="application/feed+json"',
  'property="og:image"',
  'property="og:image:width" content="1200"',
  'property="og:image:height" content="630"',
  'name="twitter:image"',
  "/og-image?",
  'name="keywords"',
  '"@type":"WebSite"',
  '"@type":"SearchAction"',
  `${baseUrl}/search?q={search_term_string}`,
  "작은 웹게임",
  "Blog",
  "Play",
]);

const robotsTxt = await textFor("/robots.txt");
assertIncludes("/robots.txt", robotsTxt, ["Allow: /", `Sitemap: ${baseUrl}/sitemap.xml`]);

const ogImageResponse = await fetchLive(`${baseUrl}/og-image?kind=home&title=bobob.app`);
if (ogImageResponse && !ogImageResponse.headers.get("content-type")?.includes("image/png")) {
  failures.push("/og-image should return image/png");
}

const sitemapIndex = await textFor("/sitemap.xml");
assertIncludes("/sitemap.xml", sitemapIndex, ["<sitemapindex", `<loc>${baseUrl}/sitemaps/en</loc>`]);

const retiredSitemapResponse = await fetchLive(`${baseUrl}/sitemaps/ar`, { redirect: "manual" });
if (retiredSitemapResponse) {
  if (retiredSitemapResponse.status !== 308) {
    failures.push(`/sitemaps/ar should 308 redirect to the reduced sitemap, got ${retiredSitemapResponse.status}`);
  }
  const retiredSitemapLocation = retiredSitemapResponse.headers.get("location") ?? "";
  if (retiredSitemapLocation !== `${baseUrl}/sitemaps/en`) {
    failures.push(`/sitemaps/ar redirects to ${retiredSitemapLocation || "(empty)"}, expected ${baseUrl}/sitemaps/en`);
  }
}

const sitemap = await textFor("/sitemaps/en");
const sitemapUrlCount = (sitemap?.match(/<url>/g) ?? []).length;
if (sitemapUrlCount !== expectedSitemapUrlCount) {
  failures.push(`/sitemaps/en should expose ${expectedSitemapUrlCount} URLs, found ${sitemapUrlCount}`);
}
assertIncludes("/sitemaps/en", sitemap, [
  `<loc>${baseUrl}/</loc>`,
  `<loc>${baseUrl}/search</loc>`,
  `<loc>${baseUrl}/about</loc>`,
  `<loc>${baseUrl}/contact</loc>`,
  `<loc>${baseUrl}/privacy</loc>`,
  `<loc>${baseUrl}/terms</loc>`,
  `<loc>${baseUrl}/blog</loc>`,
  `<loc>${baseUrl}/blog/category/ai</loc>`,
  `<loc>${baseUrl}/blog/category/info</loc>`,
  `<loc>${baseUrl}/blog/ai-plan-price-comparison-2026-06-26</loc>`,
  `<loc>${baseUrl}/blog/ai-side-project-realistic-order</loc>`,
  `<loc>${baseUrl}/play</loc>`,
  `<loc>${baseUrl}/play/office-survival</loc>`,
  `<loc>${baseUrl}/tools</loc>`,
  `<loc>${baseUrl}/tools/http-status-checker</loc>`,
  `<loc>${baseUrl}/tools/dns-lookup</loc>`,
  `<loc>${baseUrl}/tools/sitemap-generator</loc>`,
  `<loc>${baseUrl}/tools/jwt-decoder</loc>`,
]);

const rssFeed = await textFor("/feed.xml");
const rssItemCount = (rssFeed?.match(/<item>/g) ?? []).length;
if (rssItemCount !== expectedFeedItemCount) {
  failures.push(`/feed.xml should expose ${expectedFeedItemCount} items, found ${rssItemCount}`);
}
assertIncludes("/feed.xml", rssFeed, [
  "<title>bobob.app - 웹 운영 점검 기록과 Play</title>",
  'xmlns:atom="http://www.w3.org/2005/Atom"',
  '<atom:link rel="hub" href="https://pubsubhubbub.appspot.com/" />',
  `<atom:link rel="self" href="${baseUrl}/feed.xml" />`,
  `<link>${baseUrl}/blog/ai-side-project-realistic-order</link>`,
  `<link>${baseUrl}/play/prompt-cleanup</link>`,
  "<category>AI</category>",
  "<category>Play</category>",
]);

const atomResponse = await fetchLive(`${baseUrl}/atom.xml`);
if (atomResponse) {
  if (!atomResponse.headers.get("content-type")?.includes("application/atom+xml")) {
    failures.push("/atom.xml should return application/atom+xml");
  }
  const atomFeed = await atomResponse.text();
  const atomEntryCount = (atomFeed.match(/<entry>/g) ?? []).length;
  if (atomEntryCount !== expectedFeedItemCount) {
    failures.push(`/atom.xml should expose ${expectedFeedItemCount} entries, found ${atomEntryCount}`);
  }
  assertIncludes("/atom.xml", atomFeed, [
    "<title>bobob.app - 웹 운영 점검 기록과 Play</title>",
    '<link rel="hub" href="https://pubsubhubbub.appspot.com/" />',
    `<link rel="self" href="${baseUrl}/atom.xml" />`,
    `<id>${baseUrl}/blog/ai-side-project-realistic-order</id>`,
    `<id>${baseUrl}/play/prompt-cleanup</id>`,
    '<category term="AI" />',
    '<category term="Play" />',
  ]);
}

const jsonFeed = await jsonFor("/feed.json");
if (jsonFeed) {
  if (jsonFeed.version !== "https://jsonfeed.org/version/1.1") failures.push("/feed.json missing JSON Feed 1.1 version");
  if (!jsonFeed.hubs?.some((hub) => hub.type === "WebSub" && hub.url === "https://pubsubhubbub.appspot.com/")) {
    failures.push("/feed.json missing WebSub hub");
  }
  if (jsonFeed.items?.length !== expectedFeedItemCount) {
    failures.push(`/feed.json should expose ${expectedFeedItemCount} items, found ${jsonFeed.items?.length ?? "none"}`);
  }
  for (const url of [`${baseUrl}/blog/ai-side-project-realistic-order`, `${baseUrl}/play/prompt-cleanup`]) {
    if (!jsonFeed.items?.some((item) => item.url === url)) failures.push(`/feed.json missing item URL: ${url}`);
  }
  if (!jsonFeed.items?.some((item) => item.url === `${baseUrl}/blog/ai-side-project-realistic-order` && item.tags?.includes("AI"))) {
    failures.push("/feed.json missing Blog category tags");
  }
  if (!jsonFeed.items?.some((item) => item.url === `${baseUrl}/play/prompt-cleanup` && item.tags?.includes("Play"))) {
    failures.push("/feed.json missing Play tags");
  }
}

const opensearchResponse = await fetchLive(`${baseUrl}/opensearch.xml`);
if (opensearchResponse) {
  if (!opensearchResponse.headers.get("content-type")?.includes("application/opensearchdescription+xml")) {
    failures.push("/opensearch.xml should return application/opensearchdescription+xml");
  }
  const opensearch = await opensearchResponse.text();
  assertIncludes("/opensearch.xml", opensearch, [
    "<OpenSearchDescription",
    "<ShortName>bobob.app</ShortName>",
    `template="${baseUrl}/search?q={searchTerms}"`,
  ]);
}

const llmsResponse = await fetchLive(`${baseUrl}/llms.txt`);
if (llmsResponse) {
  if (!llmsResponse.headers.get("content-type")?.includes("text/plain")) failures.push("/llms.txt should return text/plain");
  const llms = await llmsResponse.text();
  assertIncludes("/llms.txt", llms, [
    "## Blog",
    "## Play",
    "## Blog Categories",
    "## Discovery",
    "## Operational Tools",
    `[AI로 사이드프로젝트를 만들 때, 사실 코드는 먼저가 아니었다](${baseUrl}/blog/ai-side-project-realistic-order)`,
    `[퇴근 전 일더미 줄이기](${baseUrl}/play/office-survival)`,
    `[HTTP Status Checker](${baseUrl}/tools/http-status-checker)`,
    `[Sitemap index](${baseUrl}/sitemap.xml)`,
    `[OpenSearch descriptor](${baseUrl}/opensearch.xml)`,
  ]);
}

const indexNowKey = await textFor("/ac3d32921a2fa361bd499222bff28abf.txt");
assertIncludes("/ac3d32921a2fa361bd499222bff28abf.txt", indexNowKey?.trim(), ["ac3d32921a2fa361bd499222bff28abf"]);

const adsTxt = await textFor("/ads.txt");
assertIncludes("/ads.txt", adsTxt, ["google.com, pub-2620992505263949, DIRECT, f08c47fec0942fa0"]);

const blogDetail = await textFor("/blog/ai-side-project-realistic-order");
assertIncludes("/blog/ai-side-project-realistic-order", blogDetail, [
  '"@type":"BlogPosting"',
  '"keywords":[',
  '"about":[',
  '"articleSection":"AI"',
  "data-blog-related-play-bottom",
  `${baseUrl}/play/prompt-cleanup`,
]);

const playDetail = await textFor("/play/prompt-cleanup");
assertIncludes("/play/prompt-cleanup", playDetail, [
  '"@type":"Game"',
  '"keywords":[',
  '"about":[',
  '"subjectOf":[',
  'data-play-engine="prompt-cleanup"',
  `${baseUrl}/blog/ai-side-project-realistic-order`,
]);

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(
  [
    `Live discovery smoke passed at ${baseUrl}.`,
    `Sitemap URLs: ${sitemapUrlCount}; feed items: ${expectedFeedItemCount}; Blog posts: ${blogSlugs.length}; Play entries: ${playSlugs.length}.`,
  ].join("\n"),
);
