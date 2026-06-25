import fs from "node:fs";
import path from "node:path";

const baseUrl = process.env.BOBOB_BASE_URL || "http://localhost:3000";
const root = process.cwd();
const registry = fs.readFileSync(path.join(root, "apps/main/src/features/tools/registry.ts"), "utf8");
const guides = fs.readFileSync(path.join(root, "apps/main/src/features/guides/registry.ts"), "utf8");
const smokeHeaders = {
  "user-agent": process.env.BOBOB_ROUTE_USER_AGENT || "Googlebot",
  "accept-language": process.env.BOBOB_ROUTE_ACCEPT_LANGUAGE || "en-US,en;q=0.9",
};

const toolSlugs = Array.from(registry.matchAll(/slug:\s+"([^"]+)"/g)).map((match) => match[1]);
const guideSlugs = Array.from(guides.matchAll(/slug:\s+"([^"]+)"/g)).map((match) => match[1]);

const paths = [
  "/",
  "/blog",
  "/blog/office-survival-workday",
  "/blog/ai-side-project-realistic-order",
  "/blog/static-micro-games-architecture",
  "/play",
  "/play/office-survival",
  "/play/prompt-cleanup",
  "/play/meeting-escape",
  "/play/priority-sorter",
  "/play/bug-clicker",
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
  "/feed.xml",
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
]) {
  if (!homeHtml.includes(fragment)) failures.push(`home page missing approval readiness fragment: ${fragment}`);
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
if (reducedSitemapUrlCount !== 18) {
  failures.push(`/sitemaps/en should expose 18 reduced Blog + Play MVP URLs, found ${reducedSitemapUrlCount}`);
}
for (const fragment of [
  "<loc>https://www.bobob.app/blog/ai-side-project-realistic-order</loc>",
  "<loc>https://www.bobob.app/play/prompt-cleanup</loc>",
  "<loc>https://www.bobob.app/tools</loc>",
  "<lastmod>2026-06-25</lastmod>",
  'hreflang="x-default"',
]) {
  if (!reducedSitemapBody.includes(fragment)) failures.push(`/sitemaps/en missing discovery fragment: ${fragment}`);
}

const feedBody = await (await fetch(`${baseUrl}/feed.xml`, { headers: smokeHeaders })).text();
const feedItemCount = (feedBody.match(/<item>/g) ?? []).length;
if (feedItemCount !== 14) {
  failures.push(`/feed.xml should expose 14 Blog + Play feed items, found ${feedItemCount}`);
}
for (const fragment of [
  "<title>bobob.app Blog and Play Lab</title>",
  "<link>https://www.bobob.app/blog/ai-side-project-realistic-order</link>",
  "<link>https://www.bobob.app/play/prompt-cleanup</link>",
  "<lastBuildDate>",
]) {
  if (!feedBody.includes(fragment)) failures.push(`/feed.xml missing discovery fragment: ${fragment}`);
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
