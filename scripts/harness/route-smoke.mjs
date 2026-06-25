import fs from "node:fs";
import path from "node:path";

const baseUrl = process.env.BOBOB_BASE_URL || "http://localhost:3000";
const root = process.cwd();
const registry = fs.readFileSync(path.join(root, "apps/main/src/features/tools/registry.ts"), "utf8");
const guides = fs.readFileSync(path.join(root, "apps/main/src/features/guides/registry.ts"), "utf8");
const blogDir = path.join(root, "content/blog");
const playDir = path.join(root, "content/play");
const smokeHeaders = {
  "user-agent": process.env.BOBOB_ROUTE_USER_AGENT || "Googlebot",
  "accept-language": process.env.BOBOB_ROUTE_ACCEPT_LANGUAGE || "en-US,en;q=0.9",
};

const toolSlugs = Array.from(registry.matchAll(/slug:\s+"([^"]+)"/g)).map((match) => match[1]);
const guideSlugs = Array.from(guides.matchAll(/slug:\s+"([^"]+)"/g)).map((match) => match[1]);
const blogSlugs = fs
  .readdirSync(blogDir)
  .filter((file) => file.endsWith(".mdx") || file.endsWith(".md"))
  .map((file) => {
    const source = fs.readFileSync(path.join(blogDir, file), "utf8");
    const match = source.match(/^slug:\s*(.+)$/m);
    return match?.[1]?.trim().replace(/^"|"$/g, "");
  })
  .filter(Boolean);
const playSlugs = fs
  .readdirSync(playDir)
  .filter((file) => file.endsWith(".json"))
  .map((file) => JSON.parse(fs.readFileSync(path.join(playDir, file), "utf8")).slug)
  .filter(Boolean);
const expectedSitemapUrlCount = blogSlugs.length + playSlugs.length + 5;
const expectedFeedItemCount = blogSlugs.length + playSlugs.length;

const paths = [
  "/",
  "/blog",
  ...blogSlugs.map((slug) => `/blog/${slug}`),
  "/play",
  ...playSlugs.map((slug) => `/play/${slug}`),
  "/search",
  "/search?q=prompt",
  "/tools",
  "/tools?q=json",
  ...toolSlugs.map((slug) => `/tools/${slug}`),
  "/guides",
  ...guideSlugs.map((slug) => `/guides/${slug}`),
  "/ko",
  "/ko/tools",
  "/ko/tools/json-formatter",
  "/ar/tools",
  "/ja/tools/regex-tester",
  "/es/guides/developer-utility-workflow",
  "/about",
  "/contact",
  "/ko/about",
  "/ko/contact",
  "/ar/about",
  "/ar/contact",
  "/privacy",
  "/terms",
  "/robots.txt",
  "/llms.txt",
  "/feed.xml",
  "/opensearch.xml",
  "/sitemap.xml",
  "/sitemaps/en",
  "/ads.txt",
];

const redirects = [
  ["/iframe-viewer", "/tools/iframe-viewer"],
  ["/regax", "/tools/regex-tester"],
  ["/cron-generator", "/tools/cron-generator"],
  ["/meta-generator", "/tools/meta-tag-generator"],
  ["/lorem-generator", "/tools/lorem-ipsum-generator"],
];

const structuredDataPaths = [
  "/tools/json-formatter",
  "/ko/tools/json-formatter",
  "/ar/tools/json-formatter",
];

const directoryStructuredDataPaths = [
  ["/tools", '"inLanguage":"en"'],
  ["/ko/tools", '"inLanguage":"ko"'],
  ["/ar/tools", '"inLanguage":"ar"'],
];

const failures = [];

for (const routePath of paths) {
  const response = await fetch(`${baseUrl}${routePath}`, { redirect: "manual", headers: smokeHeaders });
  if (response.status < 200 || response.status >= 400) {
    failures.push(`${routePath} returned ${response.status}`);
  }
}

for (const [source, destination] of redirects) {
  const response = await fetch(`${baseUrl}${source}`, { redirect: "manual", headers: smokeHeaders });
  if (![301, 308].includes(response.status)) {
    failures.push(`${source} should be a permanent redirect, got ${response.status}`);
    continue;
  }
  const location = response.headers.get("location") ?? "";
  if (!location.endsWith(destination)) {
    failures.push(`${source} redirects to ${location}, expected ${destination}`);
  }
}

for (const routePath of structuredDataPaths) {
  const response = await fetch(`${baseUrl}${routePath}`, { headers: smokeHeaders });
  const html = await response.text();
  for (const fragment of ['"@type":"SoftwareApplication"', '"@type":"FAQPage"', '"@type":"BreadcrumbList"', '"mainEntity"', '"itemListElement"']) {
    if (!html.includes(fragment)) failures.push(`${routePath} missing structured data fragment ${fragment}`);
  }
  if (html.includes("aggregateRating") || html.includes("reviewRating")) {
    failures.push(`${routePath} must not include fabricated rating or review schema`);
  }
}

for (const [routePath, localeFragment] of directoryStructuredDataPaths) {
  const response = await fetch(`${baseUrl}${routePath}`, { headers: smokeHeaders });
  const html = await response.text();
  for (const fragment of [
    '"@type":"CollectionPage"',
    '"@type":"ItemList"',
    '"@type":"SearchAction"',
    '"@type":"BreadcrumbList"',
    '"@type":"SoftwareApplication"',
    '"numberOfItems":',
    '"mainEntity"',
    '"itemListElement"',
    localeFragment,
  ]) {
    if (!html.includes(fragment)) failures.push(`${routePath} missing directory structured data fragment ${fragment}`);
  }
}

const homeHtml = await (await fetch(`${baseUrl}/`, { headers: smokeHeaders })).text();
for (const fragment of [
  'name="google-adsense-account" content="ca-pub-2620992505263949"',
  "pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2620992505263949",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
  'rel="search" type="application/opensearchdescription+xml"',
  "https://www.bobob.app/opensearch.xml",
]) {
  if (!homeHtml.includes(fragment)) failures.push(`home page missing approval readiness fragment: ${fragment}`);
}

const blogHtml = await (await fetch(`${baseUrl}/blog`, { headers: smokeHeaders })).text();
for (const fragment of [
  "data-blog-categories",
  'data-blog-category="일기"',
  'data-blog-category="요즘 관심사"',
  'data-blog-category="AI"',
  'data-blog-category="개발"',
  'data-blog-category="운영 기록"',
  "그냥 글만 남긴 기록입니다",
]) {
  if (!blogHtml.includes(fragment)) failures.push(`/blog missing source-locale category fragment: ${fragment}`);
}

const adsTxtResponse = await fetch(`${baseUrl}/ads.txt`, { headers: smokeHeaders });
const adsTxtBody = await adsTxtResponse.text();
if (!adsTxtBody.includes("google.com, pub-2620992505263949, DIRECT, f08c47fec0942fa0")) {
  failures.push("/ads.txt missing Google publisher line");
}

const sitemapIndexBody = await (await fetch(`${baseUrl}/sitemap.xml`, { headers: smokeHeaders })).text();
if (!sitemapIndexBody.includes("<sitemapindex") || !sitemapIndexBody.includes("https://www.bobob.app/sitemaps/en")) {
  failures.push("/sitemap.xml missing canonical reduced sitemap index entry");
}

const reducedSitemapBody = await (await fetch(`${baseUrl}/sitemaps/en`, { headers: smokeHeaders })).text();
const reducedSitemapUrlCount = (reducedSitemapBody.match(/<url>/g) ?? []).length;
if (reducedSitemapUrlCount !== expectedSitemapUrlCount) {
  failures.push(`/sitemaps/en should expose ${expectedSitemapUrlCount} reduced Blog + Play MVP URLs, found ${reducedSitemapUrlCount}`);
}
for (const fragment of [
  "<loc>https://www.bobob.app/search</loc>",
  "<loc>https://www.bobob.app/blog/ai-side-project-realistic-order</loc>",
  "<loc>https://www.bobob.app/blog/small-reset-note</loc>",
  "<loc>https://www.bobob.app/play/prompt-cleanup</loc>",
  "<loc>https://www.bobob.app/tools</loc>",
  "<lastmod>2026-06-25</lastmod>",
  'hreflang="x-default"',
]) {
  if (!reducedSitemapBody.includes(fragment)) failures.push(`/sitemaps/en missing discovery fragment: ${fragment}`);
}

const feedBody = await (await fetch(`${baseUrl}/feed.xml`, { headers: smokeHeaders })).text();
const feedItemCount = (feedBody.match(/<item>/g) ?? []).length;
if (feedItemCount !== expectedFeedItemCount) {
  failures.push(`/feed.xml should expose ${expectedFeedItemCount} Blog + Play feed items, found ${feedItemCount}`);
}
for (const fragment of [
  "<title>bobob.app Blog and Play Lab</title>",
  "<link>https://www.bobob.app/blog/small-reset-note</link>",
  "<link>https://www.bobob.app/blog/ai-side-project-realistic-order</link>",
  "<link>https://www.bobob.app/play/prompt-cleanup</link>",
  "<lastBuildDate>",
]) {
  if (!feedBody.includes(fragment)) failures.push(`/feed.xml missing discovery fragment: ${fragment}`);
}

const llmsResponse = await fetch(`${baseUrl}/llms.txt`, { headers: smokeHeaders });
const llmsBody = await llmsResponse.text();
if (!llmsResponse.headers.get("content-type")?.includes("text/plain")) {
  failures.push("/llms.txt must return text/plain");
}
for (const fragment of [
  "# bobob.app",
  "## Play",
  "## Blog",
  "## Discovery",
  "[퇴근 생존기](https://www.bobob.app/play/office-survival)",
  "[AI로 사이드프로젝트를 만들 때, 사실 코드는 먼저가 아니었다](https://www.bobob.app/blog/ai-side-project-realistic-order)",
  "[다시 작게 시작하기로 한 날](https://www.bobob.app/blog/small-reset-note)",
  "[Sitemap index](https://www.bobob.app/sitemap.xml)",
  "[OpenSearch descriptor](https://www.bobob.app/opensearch.xml)",
]) {
  if (!llmsBody.includes(fragment)) failures.push(`/llms.txt missing discovery fragment: ${fragment}`);
}

const openSearchResponse = await fetch(`${baseUrl}/opensearch.xml`, { headers: smokeHeaders });
const openSearchBody = await openSearchResponse.text();
if (!openSearchResponse.headers.get("content-type")?.includes("application/opensearchdescription+xml")) {
  failures.push("/opensearch.xml must return application/opensearchdescription+xml");
}
for (const fragment of [
  "<OpenSearchDescription",
  "<ShortName>bobob.app</ShortName>",
  "Search bobob.app Blog, Play, and archived developer tools.",
  'template="https://www.bobob.app/search?q={searchTerms}"',
]) {
  if (!openSearchBody.includes(fragment)) failures.push(`/opensearch.xml missing discovery fragment: ${fragment}`);
}

const httpStatusResponse = await fetch(`${baseUrl}/api/http-status?url=${encodeURIComponent("https://www.google.com")}`);
const httpStatusBody = await httpStatusResponse.json().catch(() => null);
if (httpStatusResponse.status !== 200) {
  failures.push(`/api/http-status should accept public URLs, got ${httpStatusResponse.status}`);
} else if (!Array.isArray(httpStatusBody?.redirectChain) || !httpStatusBody.redirectChain.length) {
  failures.push("/api/http-status response missing redirectChain array");
} else {
  const firstHop = httpStatusBody.redirectChain[0];
  for (const field of ["url", "status", "statusText", "contentType", "cacheControl", "elapsedMs"]) {
    if (!(field in firstHop)) failures.push(`/api/http-status redirectChain hop missing ${field}`);
  }
  if (!Array.isArray(httpStatusBody?.finalResponseHeaders)) {
    failures.push("/api/http-status response missing finalResponseHeaders array");
  }
}

const privateStatusResponse = await fetch(`${baseUrl}/api/http-status?url=${encodeURIComponent("http://localhost:3000")}`);
if (privateStatusResponse.status !== 400) {
  failures.push(`/api/http-status should reject private or local URLs, got ${privateStatusResponse.status}`);
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`Route smoke passed for ${paths.length} paths at ${baseUrl}.`);
process.exit(0);
