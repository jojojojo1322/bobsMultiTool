import fs from "node:fs";
import path from "node:path";

const baseUrl = process.env.BOBOB_BASE_URL || "http://localhost:3000";
const root = process.cwd();
const registry = fs.readFileSync(path.join(root, "apps/main/src/features/tools/registry.ts"), "utf8");
const guides = fs.readFileSync(path.join(root, "apps/main/src/features/guides/registry.ts"), "utf8");

const toolSlugs = Array.from(registry.matchAll(/slug:\s+"([^"]+)"/g)).map((match) => match[1]);
const guideSlugs = Array.from(guides.matchAll(/slug:\s+"([^"]+)"/g)).map((match) => match[1]);

const paths = [
  "/",
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
  "/privacy",
  "/terms",
  "/robots.txt",
  "/sitemap.xml",
  "/sitemaps/en",
  "/sitemaps/ko",
  "/sitemaps/ar",
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

const failures = [];

for (const routePath of paths) {
  const response = await fetch(`${baseUrl}${routePath}`, { redirect: "manual" });
  if (response.status < 200 || response.status >= 400) {
    failures.push(`${routePath} returned ${response.status}`);
  }
}

for (const [source, destination] of redirects) {
  const response = await fetch(`${baseUrl}${source}`, { redirect: "manual" });
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
  const response = await fetch(`${baseUrl}${routePath}`);
  const html = await response.text();
  for (const fragment of ['"@type":"SoftwareApplication"', '"@type":"FAQPage"', '"@type":"BreadcrumbList"', '"mainEntity"', '"itemListElement"']) {
    if (!html.includes(fragment)) failures.push(`${routePath} missing structured data fragment ${fragment}`);
  }
  if (html.includes("aggregateRating") || html.includes("reviewRating")) {
    failures.push(`${routePath} must not include fabricated rating or review schema`);
  }
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`Route smoke passed for ${paths.length} paths at ${baseUrl}.`);
