import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const baseUrl = (process.env.BOBOB_DISCOVERY_REGISTRATION_BASE_URL || "https://www.bobob.app").replace(/\/$/, "");
const requestTimeoutMs = Number.parseInt(process.env.BOBOB_DISCOVERY_REGISTRATION_TIMEOUT_MS || "15000", 10);
const matrixPath = path.join(root, "docs/search-discovery-registration.md");
const observationLogPath = path.join(root, "docs/search-indexing-observation-log.md");
const blogDir = path.join(root, "content/blog");
const playDir = path.join(root, "content/play");
const blogCategoryPath = path.join(root, "apps/main/src/features/content/blog-categories.ts");
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

function assertIncludes(source, fragment, label) {
  if (!source.includes(fragment)) failures.push(`${label} missing fragment: ${fragment}`);
}

async function fetchText(routePath, accept = "*/*") {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), requestTimeoutMs);
  try {
    const response = await fetch(`${baseUrl}${routePath}`, {
      headers: {
        "user-agent": "BobobSearchDiscoveryRegistrationSmoke/1.0",
        accept,
      },
      signal: controller.signal,
    });
    if (!response.ok) {
      failures.push(`${routePath} returned ${response.status}`);
      return { body: "", contentType: response.headers.get("content-type") ?? "" };
    }
    return {
      body: await response.text(),
      contentType: response.headers.get("content-type") ?? "",
    };
  } catch (error) {
    failures.push(`${routePath} request failed: ${error instanceof Error ? error.message : String(error)}`);
    return { body: "", contentType: "" };
  } finally {
    clearTimeout(timeout);
  }
}

const matrix = read(matrixPath);
const observationLog = read(observationLogPath);
const blogEntries = fs
  .readdirSync(blogDir)
  .filter((file) => file.endsWith(".mdx") || file.endsWith(".md"))
  .map((file) => parseFrontmatter(read(path.join(blogDir, file))));
const playEntries = fs
  .readdirSync(playDir)
  .filter((file) => file.endsWith(".json"))
  .map((file) => JSON.parse(read(path.join(playDir, file))));
const categorySlugs = Array.from(read(blogCategoryPath).matchAll(/slug:\s+"([^"]+)"/g)).map((match) => match[1]);
const expectedSitemapUrlCount = blogEntries.length + playEntries.length + categorySlugs.length + 5;
const expectedFeedItemCount = blogEntries.length + playEntries.length;

for (const fragment of [
  "# bobob.app Search Discovery Registration Matrix",
  "It is not indexing proof",
  `Current submitted sitemap URL count: \`${expectedSitemapUrlCount}\``,
  `Current feed item count: \`${expectedFeedItemCount}\``,
  `Current Blog count: \`${blogEntries.length}\``,
  `Current Play count: \`${playEntries.length}\``,
  "Google Search Console sitemap",
  "`bobob935@gmail.com`",
  "Chrome profile/session signed in as `bobob935@gmail.com`",
  "Latest `bobob935@gmail.com` resubmission confirmed `사이트맵이 제출됨`; submitted/read `2026. 6. 26.`, status `성공`, discovered pages `68`, matching the prior live XML count before the 정보 expansion",
  "Google Search Console performance",
  "Latest `bobob935@gmail.com` check showed clicks `0`, impressions `3`, CTR `0%` for `3개월`",
  "Google Search Console page indexing",
  "Latest `bobob935@gmail.com` check showed indexed pages `0`, not-indexed pages `5`",
  "Google URL Inspection",
  "Bing and IndexNow",
  `Latest response status \`200\`; submitted URL count \`${expectedSitemapUrlCount}\` after the Play canvas upgrade`,
  "Bing Webmaster Tools",
  "Latest browser check reached the public landing page with `Sign In`",
  "Public Bing search",
  "Latest browser check hit a `계속하려면 아래 과제 해결` challenge",
  "RSS feed",
  "Atom feed",
  "JSON Feed",
  "WebSub",
  `Latest publish responses \`204\`, \`204\` with feed item counts \`${expectedFeedItemCount}\`, \`${expectedFeedItemCount}\``,
  "robots.txt",
  "OpenSearch",
  "llms.txt",
  "Public search spot check",
  "`2026-07-02`",
  "`2026-07-09`",
  "Do not mark the active Blog + Play goal complete",
  "docs/search-indexing-observation-log.md",
]) {
  assertIncludes(matrix, fragment, matrixPath);
}

for (const fragment of [
  "Search Console sitemap row after resubmission: `/sitemaps/en`, status `성공`, discovered pages `53`.",
  "Representative URL indexing request confirmation: `색인 생성 요청됨`",
  `IndexNow submitted URL count: \`${expectedSitemapUrlCount}\``,
  `Live \`/sitemaps/en\` URL count: \`${expectedSitemapUrlCount}\``,
  "Search Console sitemap row after resubmission: `/sitemaps/en`, submitted `2026. 6. 26.`, last read `2026. 6. 26.`, status `성공`, discovered pages `68`.",
  "Bing Webmaster Tools still needs a signed-in pass.",
  `WebSub feed item counts: \`${expectedFeedItemCount}\`, \`${expectedFeedItemCount}\``,
  "WebSub response statuses: `204`, `204`",
  "Total impressions: `3`",
  "Indexed pages: `0`",
  "Not indexed pages: `5`",
  "Codex heartbeat automation id: `bobob-indexing-observation`",
]) {
  assertIncludes(observationLog, fragment, observationLogPath);
}

const [robots, sitemapIndex, sitemap, rss, atom, jsonFeedResponse, opensearch, llms, indexNowKey] = await Promise.all([
  fetchText("/robots.txt", "text/plain,*/*"),
  fetchText("/sitemap.xml", "application/xml,text/xml,*/*"),
  fetchText("/sitemaps/en", "application/xml,text/xml,*/*"),
  fetchText("/feed.xml", "application/rss+xml,application/xml,text/xml,*/*"),
  fetchText("/atom.xml", "application/atom+xml,application/xml,text/xml,*/*"),
  fetchText("/feed.json", "application/json,*/*"),
  fetchText("/opensearch.xml", "application/opensearchdescription+xml,application/xml,text/xml,*/*"),
  fetchText("/llms.txt", "text/plain,*/*"),
  fetchText("/ac3d32921a2fa361bd499222bff28abf.txt", "text/plain,*/*"),
]);

assertIncludes(robots.body, `Sitemap: ${baseUrl}/sitemap.xml`, "/robots.txt");
assertIncludes(sitemapIndex.body, `<loc>${baseUrl}/sitemaps/en</loc>`, "/sitemap.xml");
const sitemapUrlCount = (sitemap.body.match(/<url>/g) ?? []).length;
if (sitemapUrlCount !== expectedSitemapUrlCount) failures.push(`/sitemaps/en URL count ${sitemapUrlCount} should be ${expectedSitemapUrlCount}`);
for (const loc of [`${baseUrl}/`, `${baseUrl}/search`, `${baseUrl}/blog`, `${baseUrl}/play`, `${baseUrl}/tools`]) {
  if (!xmlLocs(sitemap.body).includes(loc)) failures.push(`/sitemaps/en missing ${loc}`);
}

const rssItemCount = (rss.body.match(/<item>/g) ?? []).length;
const atomEntryCount = (atom.body.match(/<entry>/g) ?? []).length;
let jsonFeedItemCount = 0;
try {
  const jsonFeed = JSON.parse(jsonFeedResponse.body);
  jsonFeedItemCount = Array.isArray(jsonFeed.items) ? jsonFeed.items.length : 0;
  if (!jsonFeed.hubs?.some((hub) => hub.type === "WebSub" && hub.url === "https://pubsubhubbub.appspot.com/")) {
    failures.push("/feed.json missing WebSub hub metadata");
  }
} catch (error) {
  failures.push(`/feed.json parse failed: ${error instanceof Error ? error.message : String(error)}`);
}

if (rssItemCount !== expectedFeedItemCount) failures.push(`/feed.xml item count ${rssItemCount} should be ${expectedFeedItemCount}`);
if (atomEntryCount !== expectedFeedItemCount) failures.push(`/atom.xml entry count ${atomEntryCount} should be ${expectedFeedItemCount}`);
if (jsonFeedItemCount !== expectedFeedItemCount) failures.push(`/feed.json item count ${jsonFeedItemCount} should be ${expectedFeedItemCount}`);
assertIncludes(rss.body, '<atom:link rel="hub" href="https://pubsubhubbub.appspot.com/" />', "/feed.xml");
assertIncludes(atom.body, '<link rel="hub" href="https://pubsubhubbub.appspot.com/" />', "/atom.xml");
assertIncludes(opensearch.body, `template="${baseUrl}/search?q={searchTerms}"`, "/opensearch.xml");
assertIncludes(llms.body, `[Sitemap index](${baseUrl}/sitemap.xml)`, "/llms.txt");
assertIncludes(llms.body, `[OpenSearch descriptor](${baseUrl}/opensearch.xml)`, "/llms.txt");
if (indexNowKey.body.trim() !== "ac3d32921a2fa361bd499222bff28abf") failures.push("IndexNow key file body mismatch");

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(
  `Search discovery registration smoke passed: ${expectedSitemapUrlCount} sitemap URLs, ${expectedFeedItemCount} feed items, ${blogEntries.length} Blog posts, ${playEntries.length} Play entries.`,
);
