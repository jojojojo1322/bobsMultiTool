import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const canonicalBaseUrl = (process.env.BOBOB_SUBMITTED_URL_HEALTH_CANONICAL_BASE_URL || "https://www.bobob.app").replace(/\/$/, "");
const fetchBaseUrl = (process.env.BOBOB_SUBMITTED_URL_HEALTH_BASE_URL || canonicalBaseUrl).replace(/\/$/, "");
const requestTimeoutMs = Number.parseInt(process.env.BOBOB_SUBMITTED_URL_HEALTH_TIMEOUT_MS || "15000", 10);
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
        return [line.slice(0, separatorIndex).trim(), line.slice(separatorIndex + 1).trim().replace(/^"|"$/g, "")];
      }),
  );
}

function xmlLocs(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
}

function tags(source, tagName) {
  return [...source.matchAll(new RegExp(`<${tagName}\\s+[^>]*>`, "gi"))].map((match) => match[0]);
}

function attr(tag, name) {
  const match = tag.match(new RegExp(`${name}=(["'])(.*?)\\1`, "i"));
  return match?.[2] ?? "";
}

function metaContent(html, key, value) {
  const tag = tags(html, "meta").find((candidate) => attr(candidate, key).toLowerCase() === value.toLowerCase());
  return tag ? attr(tag, "content") : "";
}

function canonicalHref(html) {
  const tag = tags(html, "link").find((candidate) => attr(candidate, "rel").toLowerCase() === "canonical");
  return tag ? attr(tag, "href") : "";
}

function normalizeCanonical(url) {
  const parsed = new URL(url);
  const pathname = parsed.pathname === "/" ? "" : parsed.pathname.replace(/\/$/, "");
  return `${parsed.origin}${pathname}${parsed.search}`;
}

async function fetchText(url, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), requestTimeoutMs);
  try {
    const response = await fetch(url, {
      redirect: options.redirect ?? "follow",
      headers: {
        "user-agent": "Googlebot",
        accept: options.accept ?? "*/*",
      },
      signal: controller.signal,
    });
    const body = await response.text();
    return {
      body,
      contentType: response.headers.get("content-type") ?? "",
      location: response.headers.get("location") ?? "",
      status: response.status,
    };
  } finally {
    clearTimeout(timeout);
  }
}

const blogCount = fs
  .readdirSync(blogDir)
  .filter((file) => file.endsWith(".mdx") || file.endsWith(".md"))
  .map((file) => parseFrontmatter(read(path.join(blogDir, file))))
  .filter((frontmatter) => frontmatter.indexPolicy === "index").length;
const playCount = fs.readdirSync(playDir).filter((file) => file.endsWith(".json")).length;
const categoryCount = Array.from(read(blogCategoryPath).matchAll(/slug:\s+"([^"]+)"/g)).length;
const operationalToolCount = Array.from(read(operationalSurfacePath).matchAll(/"([^"]+)"/g)).length;
const expectedSitemapUrlCount = blogCount + playCount + categoryCount + 9 + operationalToolCount;

function fetchUrlFor(canonicalUrl) {
  if (fetchBaseUrl === canonicalBaseUrl) return canonicalUrl;
  return canonicalUrl.replace(canonicalBaseUrl, fetchBaseUrl);
}

const sitemapIndex = await fetchText(`${fetchBaseUrl}/sitemap.xml`, { accept: "application/xml,text/xml,*/*" });
if (sitemapIndex.status !== 200) failures.push(`/sitemap.xml returned ${sitemapIndex.status}`);
const sitemapLocations = xmlLocs(sitemapIndex.body);
if (!sitemapLocations.includes(`${canonicalBaseUrl}/sitemaps/en`)) failures.push("/sitemap.xml missing /sitemaps/en");

const sitemap = await fetchText(`${fetchBaseUrl}/sitemaps/en`, { accept: "application/xml,text/xml,*/*" });
if (sitemap.status !== 200) failures.push(`/sitemaps/en returned ${sitemap.status}`);
const submittedUrls = xmlLocs(sitemap.body);
if (submittedUrls.length !== expectedSitemapUrlCount) {
  failures.push(`/sitemaps/en should contain ${expectedSitemapUrlCount} submitted URLs, found ${submittedUrls.length}`);
}

const seenTitles = new Map();
const seenDescriptions = new Map();
let checkedHtmlPages = 0;

for (const url of submittedUrls) {
  if (!url.startsWith(`${canonicalBaseUrl}/`) && url !== canonicalBaseUrl) {
    failures.push(`submitted URL is outside canonical host: ${url}`);
    continue;
  }

  let response;
  try {
    response = await fetchText(fetchUrlFor(url), { redirect: "manual", accept: "text/html,*/*" });
  } catch (error) {
    failures.push(`${url} request failed: ${error instanceof Error ? error.message : String(error)}`);
    continue;
  }

  if (response.status !== 200) {
    failures.push(`${url} should return final 200 without redirect, got ${response.status}${response.location ? ` -> ${response.location}` : ""}`);
    continue;
  }
  if (!response.contentType.includes("text/html")) {
    failures.push(`${url} should return text/html, got ${response.contentType || "(empty)"}`);
    continue;
  }

  checkedHtmlPages += 1;
  const html = response.body;
  const title = html.match(/<title>(.*?)<\/title>/i)?.[1]?.trim() ?? "";
  const description = metaContent(html, "name", "description").trim();
  const canonical = canonicalHref(html).trim();
  const robots = [metaContent(html, "name", "robots"), metaContent(html, "name", "googlebot")].filter(Boolean).join(" | ");
  const h1Count = (html.match(/<h1\b/gi) ?? []).length;
  const ogTitle = metaContent(html, "property", "og:title").trim();
  const ogDescription = metaContent(html, "property", "og:description").trim();
  const twitterTitle = metaContent(html, "name", "twitter:title").trim();
  const twitterDescription = metaContent(html, "name", "twitter:description").trim();

  if (h1Count !== 1) failures.push(`${url} should render exactly one h1, found ${h1Count}`);
  if (title.length < 10) failures.push(`${url} title is too short or missing`);
  if (description.length < 50) failures.push(`${url} meta description is too short or missing`);
  if (!canonical) {
    failures.push(`${url} missing canonical link`);
  } else if (normalizeCanonical(canonical) !== normalizeCanonical(url)) {
    failures.push(`${url} canonical mismatch: ${canonical}`);
  }
  if (/noindex/i.test(robots)) failures.push(`${url} has noindex robots metadata: ${robots}`);
  if (!/index/i.test(robots)) failures.push(`${url} robots metadata should explicitly include index`);
  if (!ogTitle || !ogDescription) failures.push(`${url} missing OpenGraph title/description`);
  if (!twitterTitle || !twitterDescription) failures.push(`${url} missing Twitter title/description`);

  const titleKey = title.toLowerCase();
  const descriptionKey = description.toLowerCase();
  if (seenTitles.has(titleKey)) failures.push(`duplicate title between ${seenTitles.get(titleKey)} and ${url}: ${title}`);
  else seenTitles.set(titleKey, url);
  if (seenDescriptions.has(descriptionKey)) failures.push(`duplicate description between ${seenDescriptions.get(descriptionKey)} and ${url}: ${description}`);
  else seenDescriptions.set(descriptionKey, url);
}

if (checkedHtmlPages !== submittedUrls.length) {
  failures.push(`checked ${checkedHtmlPages} HTML pages from sitemap, expected ${submittedUrls.length}`);
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`Submitted URL health smoke passed: ${checkedHtmlPages} final 200 sitemap URLs with unique title/description, canonical, h1, and indexable robots metadata.`);
