import fs from "node:fs";
import path from "node:path";

const baseUrl = process.env.BOBOB_BASE_URL || "http://localhost:3000";
const root = process.cwd();
const registry = fs.readFileSync(path.join(root, "apps/main/src/features/tools/registry.ts"), "utf8");
const guides = fs.readFileSync(path.join(root, "apps/main/src/features/guides/registry.ts"), "utf8");
const blogCategories = fs.readFileSync(path.join(root, "apps/main/src/features/content/blog-categories.ts"), "utf8");
const blogDir = path.join(root, "content/blog");
const playDir = path.join(root, "content/play");
const smokeHeaders = {
  "user-agent": process.env.BOBOB_ROUTE_USER_AGENT || "Googlebot",
  "accept-language": process.env.BOBOB_ROUTE_ACCEPT_LANGUAGE || "en-US,en;q=0.9",
};

const toolSlugs = Array.from(registry.matchAll(/slug:\s+"([^"]+)"/g)).map((match) => match[1]);
const guideSlugs = Array.from(guides.matchAll(/slug:\s+"([^"]+)"/g)).map((match) => match[1]);
const blogCategorySlugs = Array.from(blogCategories.matchAll(/slug:\s+"([^"]+)"/g)).map((match) => match[1]);
const blogSlugs = fs
  .readdirSync(blogDir)
  .filter((file) => file.endsWith(".mdx") || file.endsWith(".md"))
  .map((file) => {
    const source = fs.readFileSync(path.join(blogDir, file), "utf8");
    const slug = source.match(/^slug:\s*(.+)$/m)?.[1]?.trim().replace(/^"|"$/g, "");
    const title = source.match(/^title:\s*(.+)$/m)?.[1]?.trim().replace(/^"|"$/g, "");
    const indexPolicy = source.match(/^indexPolicy:\s*(.+)$/m)?.[1]?.trim().replace(/^"|"$/g, "");
    return { slug, title, indexPolicy };
  })
  .filter((entry) => entry.slug);
const archivedBlogEntries = blogSlugs.filter((entry) => entry.indexPolicy === "noindex");
const submittedBlogSlugs = blogSlugs
  .filter((entry) => entry.indexPolicy === "index")
  .map((entry) => entry.slug)
  .filter(Boolean);
const allBlogSlugs = blogSlugs.map((entry) => entry.slug).filter(Boolean);
const playSlugs = fs
  .readdirSync(playDir)
  .filter((file) => file.endsWith(".json"))
  .map((file) => JSON.parse(fs.readFileSync(path.join(playDir, file), "utf8")).slug)
  .filter(Boolean);
const expectedBaseSitemapUrlCount = 9; // /, search, four trust/legal pages, blog, play, and tools.
const expectedSitemapUrlCount = submittedBlogSlugs.length + playSlugs.length + blogCategorySlugs.length + expectedBaseSitemapUrlCount;
const expectedFeedItemCount = submittedBlogSlugs.length + playSlugs.length;

const paths = [
  "/",
  "/blog",
  ...blogCategorySlugs.map((slug) => `/blog/category/${slug}`),
  ...allBlogSlugs.map((slug) => `/blog/${slug}`),
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
  "/atom.xml",
  "/feed.json",
  "/opensearch.xml",
  "/og-image?kind=home&title=bobob.app",
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

const contentStructuredDataPaths = [
  [
    "/blog/ai-side-project-realistic-order",
    ['"@type":"BlogPosting"', '"keywords":[', '"about":[', '"articleSection":"AI"', '"mentions":['],
  ],
  [
    "/play/prompt-cleanup",
    ['"@type":"Game"', '"keywords":[', '"about":[', '"mainEntityOfPage"', '"subjectOf":['],
  ],
];

const failures = [];
const blogDetailHtmlByPath = new Map();
const robotsNoindexPattern = /<meta\b(?=[^>]*\bname=["']robots["'])(?=[^>]*\bcontent=["'][^"']*noindex)/i;

for (const routePath of paths) {
  const response = await fetch(`${baseUrl}${routePath}`, { redirect: "manual", headers: smokeHeaders });
  if (response.status < 200 || response.status >= 400) {
    failures.push(`${routePath} returned ${response.status}`);
  }
  if (response.status >= 200 && response.status < 400 && routePath.startsWith("/blog/") && !routePath.startsWith("/blog/category/")) {
    blogDetailHtmlByPath.set(routePath, await response.text());
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

for (const [routePath, fragments] of contentStructuredDataPaths) {
  const response = await fetch(`${baseUrl}${routePath}`, { headers: smokeHeaders });
  const html = await response.text();
  for (const fragment of fragments) {
    if (!html.includes(fragment)) failures.push(`${routePath} missing content discovery structured data fragment ${fragment}`);
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
  'rel="alternate" type="application/atom+xml"',
  'rel="alternate" type="application/feed+json"',
  'property="og:image"',
  'property="og:image:width" content="1200"',
  'property="og:image:height" content="630"',
  'name="twitter:image"',
  "/og-image?",
  "https://www.bobob.app/opensearch.xml",
  "https://www.bobob.app/atom.xml",
  "https://www.bobob.app/feed.json",
  'name="keywords"',
  "작은 웹게임",
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
  'data-blog-category="정보"',
  "글만 남긴 기록입니다.",
  "AI 유료 플랜, 누가 무엇을 고르면 좋을까",
  "콘텐츠 품질과 색인 상태를 다시 보기 전에 정리한 체크리스트",
  "작은 게임에서 점수보다 먼저 보여야 하는 것",
  "바로 해보기:",
  "주소 대기표 도장 찍기",
  "회의록 닫기 도장판",
  "/blog/category/diary",
  "/blog/category/interests",
  "/blog/category/ai",
  "/blog/category/development",
  "/blog/category/operations",
  "/blog/category/info",
]) {
  if (!blogHtml.includes(fragment)) failures.push(`/blog missing source-locale category fragment: ${fragment}`);
}
for (const entry of archivedBlogEntries) {
  if (blogHtml.includes(`href="/blog/${entry.slug}"`) || (entry.title && blogHtml.includes(entry.title))) {
    failures.push(`/blog should not promote noindex/archive Blog post ${entry.slug}`);
  }
}

const searchHtml = await (await fetch(`${baseUrl}/search`, { headers: smokeHeaders })).text();
for (const entry of archivedBlogEntries) {
  if (searchHtml.includes(`href="/blog/${entry.slug}"`) || (entry.title && searchHtml.includes(entry.title))) {
    failures.push(`/search should not show noindex/archive Blog post ${entry.slug} in default results`);
  }
}
for (const entry of archivedBlogEntries) {
  const query = entry.title || entry.slug;
  const archiveSearchHtml = await (await fetch(`${baseUrl}/search?q=${encodeURIComponent(query)}`, { headers: smokeHeaders })).text();
  if (archiveSearchHtml.includes(`href="/blog/${entry.slug}"`)) {
    failures.push(`/search?q=${query} should not return noindex/archive Blog post ${entry.slug}`);
  }
}
for (const categorySlug of blogCategorySlugs) {
  const categoryHtml = await (await fetch(`${baseUrl}/blog/category/${categorySlug}`, { headers: smokeHeaders })).text();
  for (const entry of archivedBlogEntries) {
    if (categoryHtml.includes(`href="/blog/${entry.slug}"`) || (entry.title && categoryHtml.includes(entry.title))) {
      failures.push(`/blog/category/${categorySlug} should not promote noindex/archive Blog post ${entry.slug}`);
    }
  }
}
for (const entry of archivedBlogEntries) {
  const blogPath = `/blog/${entry.slug}`;
  const archiveDetailHtml = blogDetailHtmlByPath.get(blogPath) ?? "";
  if (!archiveDetailHtml.includes("제작 메모 보관")) {
    failures.push(`${blogPath} should show archive/noindex badge`);
  }
  if (!robotsNoindexPattern.test(archiveDetailHtml)) {
    failures.push(`${blogPath} should render noindex robots metadata`);
  }
}
for (const slug of submittedBlogSlugs) {
  const blogPath = `/blog/${slug}`;
  const submittedDetailHtml = blogDetailHtmlByPath.get(blogPath) ?? "";
  if (submittedDetailHtml.includes("제작 메모 보관")) {
    failures.push(`${blogPath} should not show archive/noindex badge`);
  }
  if (robotsNoindexPattern.test(submittedDetailHtml)) {
    failures.push(`${blogPath} should not render noindex robots metadata`);
  }
}

const adsTxtResponse = await fetch(`${baseUrl}/ads.txt`, { headers: smokeHeaders });
const adsTxtBody = await adsTxtResponse.text();
if (!adsTxtBody.includes("google.com, pub-2620992505263949, DIRECT, f08c47fec0942fa0")) {
  failures.push("/ads.txt missing Google publisher line");
}

const ogImageResponse = await fetch(`${baseUrl}/og-image?kind=home&title=bobob.app`, { headers: smokeHeaders });
if (!ogImageResponse.headers.get("content-type")?.includes("image/png")) {
  failures.push("/og-image must return image/png");
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
  "<loc>https://www.bobob.app/blog/category/diary</loc>",
  "<loc>https://www.bobob.app/blog/category/development</loc>",
  "<loc>https://www.bobob.app/blog/category/info</loc>",
  "<loc>https://www.bobob.app/blog/ai-plan-price-comparison-2026-06-26</loc>",
  "<loc>https://www.bobob.app/blog/ai-side-project-realistic-order</loc>",
  "<loc>https://www.bobob.app/blog/content-indexing-checklist-before-resubmission</loc>",
  "<loc>https://www.bobob.app/play/prompt-cleanup</loc>",
  "<loc>https://www.bobob.app/about</loc>",
  "<loc>https://www.bobob.app/contact</loc>",
  "<loc>https://www.bobob.app/privacy</loc>",
  "<loc>https://www.bobob.app/terms</loc>",
  "<loc>https://www.bobob.app/tools</loc>",
  "<lastmod>2026-07-03</lastmod>",
  'hreflang="x-default"',
]) {
  if (!reducedSitemapBody.includes(fragment)) failures.push(`/sitemaps/en missing discovery fragment: ${fragment}`);
}
for (const entry of archivedBlogEntries) {
  if (reducedSitemapBody.includes(`/blog/${entry.slug}`)) {
    failures.push(`/sitemaps/en should exclude noindex/archive Blog post ${entry.slug}`);
  }
}

const feedBody = await (await fetch(`${baseUrl}/feed.xml`, { headers: smokeHeaders })).text();
const feedItemCount = (feedBody.match(/<item>/g) ?? []).length;
if (feedItemCount !== expectedFeedItemCount) {
  failures.push(`/feed.xml should expose ${expectedFeedItemCount} Blog + Play feed items, found ${feedItemCount}`);
}
for (const fragment of [
  "<title>bobob.app - 개발/AI 기록과 짧은 Play</title>",
  'xmlns:atom="http://www.w3.org/2005/Atom"',
  '<atom:link rel="hub" href="https://pubsubhubbub.appspot.com/" />',
  '<atom:link rel="self" href="https://www.bobob.app/feed.xml" />',
  "<link>https://www.bobob.app/blog/content-indexing-checklist-before-resubmission</link>",
  "<link>https://www.bobob.app/blog/ai-side-project-realistic-order</link>",
  "<link>https://www.bobob.app/play/prompt-cleanup</link>",
  "<category>AI</category>",
  "<category>Play</category>",
  "<lastBuildDate>",
]) {
  if (!feedBody.includes(fragment)) failures.push(`/feed.xml missing discovery fragment: ${fragment}`);
}
for (const entry of archivedBlogEntries) {
  if (feedBody.includes(`/blog/${entry.slug}`)) {
    failures.push(`/feed.xml should exclude noindex/archive Blog post ${entry.slug}`);
  }
}

const atomResponse = await fetch(`${baseUrl}/atom.xml`, { headers: smokeHeaders });
const atomBody = await atomResponse.text();
if (!atomResponse.headers.get("content-type")?.includes("application/atom+xml")) {
  failures.push("/atom.xml must return application/atom+xml");
}
const atomEntryCount = (atomBody.match(/<entry>/g) ?? []).length;
if (atomEntryCount !== expectedFeedItemCount) {
  failures.push(`/atom.xml should expose ${expectedFeedItemCount} Blog + Play feed items, found ${atomEntryCount}`);
}
for (const fragment of [
  "<title>bobob.app - 개발/AI 기록과 짧은 Play</title>",
  '<link rel="hub" href="https://pubsubhubbub.appspot.com/" />',
  '<link rel="self" href="https://www.bobob.app/atom.xml" />',
  "<id>https://www.bobob.app/blog/content-indexing-checklist-before-resubmission</id>",
  "<id>https://www.bobob.app/play/prompt-cleanup</id>",
  '<category term="AI" />',
  '<category term="Play" />',
]) {
  if (!atomBody.includes(fragment)) failures.push(`/atom.xml missing discovery fragment: ${fragment}`);
}
for (const entry of archivedBlogEntries) {
  if (atomBody.includes(`/blog/${entry.slug}`)) {
    failures.push(`/atom.xml should exclude noindex/archive Blog post ${entry.slug}`);
  }
}

const jsonFeedResponse = await fetch(`${baseUrl}/feed.json`, { headers: smokeHeaders });
const jsonFeedBody = await jsonFeedResponse.json().catch(() => null);
if (!jsonFeedResponse.headers.get("content-type")?.includes("application/json")) {
  failures.push("/feed.json must return application/json");
}
if (jsonFeedBody?.version !== "https://jsonfeed.org/version/1.1") {
  failures.push("/feed.json missing JSON Feed 1.1 version");
}
if (!jsonFeedBody?.hubs?.some((hub) => hub.type === "WebSub" && hub.url === "https://pubsubhubbub.appspot.com/")) {
  failures.push("/feed.json missing WebSub hub");
}
if (jsonFeedBody?.items?.length !== expectedFeedItemCount) {
  failures.push(`/feed.json should expose ${expectedFeedItemCount} Blog + Play feed items, found ${jsonFeedBody?.items?.length ?? "none"}`);
}
for (const url of [
  "https://www.bobob.app/blog/content-indexing-checklist-before-resubmission",
  "https://www.bobob.app/blog/ai-side-project-realistic-order",
  "https://www.bobob.app/play/prompt-cleanup",
]) {
  if (!jsonFeedBody?.items?.some((item) => item.url === url)) failures.push(`/feed.json missing item URL: ${url}`);
}
for (const entry of archivedBlogEntries) {
  if (jsonFeedBody?.items?.some((item) => item.url === `https://www.bobob.app/blog/${entry.slug}`)) {
    failures.push(`/feed.json should exclude noindex/archive Blog post ${entry.slug}`);
  }
}
if (!jsonFeedBody?.items?.some((item) => item.url === "https://www.bobob.app/blog/ai-side-project-realistic-order" && item.tags?.includes("AI"))) {
  failures.push("/feed.json missing Blog category tags");
}
if (!jsonFeedBody?.items?.some((item) => item.url === "https://www.bobob.app/play/prompt-cleanup" && item.tags?.includes("Play"))) {
  failures.push("/feed.json missing Play tags");
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
  "## Blog Categories",
  "## Discovery",
  "[일기](https://www.bobob.app/blog/category/diary)",
  "[개발](https://www.bobob.app/blog/category/development)",
  "[퇴근 전 일더미 줄이기](https://www.bobob.app/play/office-survival)",
  "[AI로 사이드프로젝트를 만들 때, 사실 코드는 먼저가 아니었다](https://www.bobob.app/blog/ai-side-project-realistic-order)",
  "[콘텐츠 품질과 색인 상태를 다시 보기 전에 정리한 체크리스트](https://www.bobob.app/blog/content-indexing-checklist-before-resubmission)",
  "[Sitemap index](https://www.bobob.app/sitemap.xml)",
  "[Atom feed](https://www.bobob.app/atom.xml)",
  "[JSON feed](https://www.bobob.app/feed.json)",
  "[OpenSearch descriptor](https://www.bobob.app/opensearch.xml)",
]) {
  if (!llmsBody.includes(fragment)) failures.push(`/llms.txt missing discovery fragment: ${fragment}`);
}
for (const entry of archivedBlogEntries) {
  if (llmsBody.includes(`/blog/${entry.slug}`)) {
    failures.push(`/llms.txt should exclude noindex/archive Blog post ${entry.slug}`);
  }
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
