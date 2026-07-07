import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const canonicalBaseUrl = (process.env.BOBOB_DISCOVERY_REGISTRATION_CANONICAL_BASE_URL || "https://www.bobob.app").replace(/\/$/, "");
const fetchBaseUrl = (process.env.BOBOB_DISCOVERY_REGISTRATION_BASE_URL || canonicalBaseUrl).replace(/\/$/, "");
const requestTimeoutMs = Number.parseInt(process.env.BOBOB_DISCOVERY_REGISTRATION_TIMEOUT_MS || "15000", 10);
const matrixPath = path.join(root, "docs/search-discovery-registration.md");
const observationLogPath = path.join(root, "docs/search-indexing-observation-log.md");
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

function assertIncludes(source, fragment, label) {
  if (!source.includes(fragment)) failures.push(`${label} missing fragment: ${fragment}`);
}

function backtickNumber(source, label) {
  const match = source.match(new RegExp(`${label}: \`(\\d+)\``));
  return match ? Number(match[1]) : null;
}

async function fetchText(routePath, accept = "*/*") {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), requestTimeoutMs);
  try {
    const response = await fetch(`${fetchBaseUrl}${routePath}`, {
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
const submittedBlogEntries = blogEntries.filter((entry) => entry.indexPolicy === "index");
const playEntries = fs
  .readdirSync(playDir)
  .filter((file) => file.endsWith(".json"))
  .map((file) => JSON.parse(read(path.join(playDir, file))));
const categorySlugs = Array.from(read(blogCategoryPath).matchAll(/slug:\s+"([^"]+)"/g)).map((match) => match[1]);
const operationalToolSlugs = Array.from(read(operationalSurfacePath).matchAll(/"([^"]+)"/g)).map((match) => match[1]);
const expectedSitemapUrlCount = submittedBlogEntries.length + playEntries.length + categorySlugs.length + 9 + operationalToolSlugs.length;
const expectedFeedItemCount = submittedBlogEntries.length + playEntries.length;
const latestExternalSitemapCount = backtickNumber(matrix, "Latest external sitemap discovery count") ?? expectedSitemapUrlCount;
const latestIndexNowSubmissionCount = backtickNumber(matrix, "Latest IndexNow representative submission count") ?? expectedSitemapUrlCount;
const latestExternalFeedItemCount = backtickNumber(matrix, "Latest external feed publish item count") ?? expectedFeedItemCount;

for (const fragment of [
  "# bobob.app Search Discovery Registration Matrix",
  "It is not indexing proof",
  `Current submitted sitemap source target URL count: \`${expectedSitemapUrlCount}\``,
  `Current feed source target item count: \`${expectedFeedItemCount}\``,
  `Current Blog count: \`${blogEntries.length}\``,
  `Current representative Blog count: \`${submittedBlogEntries.length}\``,
  `Current Play count: \`${playEntries.length}\``,
  "Retired known locale sitemap paths such as `/sitemaps/ar`, `/sitemaps/th`, and `/sitemaps/zh-CN` 308 redirect to `/sitemaps/en`",
  "Google Search Console sitemap",
  "`bobob935@gmail.com`",
  "Chrome profile/session signed in as `bobob935@gmail.com`",
  `Current source sitemap target after web-operations recovery: \`${expectedSitemapUrlCount}\` URLs`,
  `Latest external sitemap discovery count: \`${latestExternalSitemapCount}\``,
  `Latest IndexNow representative submission count: \`${latestIndexNowSubmissionCount}\``,
  `Latest external feed publish item count: \`${latestExternalFeedItemCount}\``,
  "Latest signed-in Search Console observation after resubmission",
  `submitted \`2026. 7. 7.\`, last read \`2026. 7. 7.\`, status \`성공\`, discovered pages \`${latestExternalSitemapCount}\`, videos \`0\``,
  `Google accepted, read, and discovered the latest externally submitted ${latestExternalSitemapCount}-URL canonical sitemap set`,
  "Google Search Console performance",
  "Latest `bobob935@gmail.com` check showed clicks `0`, impressions `18`, CTR `0%`, average position `1.1` for `3개월`",
  "Google Search Console page indexing",
  "Latest `bobob935@gmail.com` check showed indexed pages `1`, not-indexed pages `25`, last updated `2026. 6. 30`",
  "`크롤링됨 - 현재 색인이 생성되지 않음`: `20`",
  "Google URL Inspection",
  "Homepage `https://www.bobob.app/` is `URL이 Google에 등록되어 있음` and `페이지 색인이 생성됨`",
  "Post-77-URL pillar inspections for `why-bobob-shifted-to-content-lab` and `content-indexing-checklist-before-resubmission`",
  "reason `크롤링됨 - 현재 색인이 생성되지 않음`",
  "page fetch `성공`, indexing allowed `예`",
  "both have `색인 생성 요청됨` confirmations",
  "security-header-report-before-copying-devtools",
  "shows `발견됨 - 현재 색인이 생성되지 않음`",
  "Bing and IndexNow",
  `Latest IndexNow representative submission: \`${latestIndexNowSubmissionCount}\` URLs with response \`200\``,
  "Bing Webmaster Tools",
  "Latest `2026-07-07` browser check reached the public landing page with `Sign In`",
  "After clicking `Sign In`, the page still showed `Please sign in` and `Choose an account convenient to you`",
  "Public Bing search",
  "Latest browser check hit a `계속하려면 아래 과제 해결` challenge",
  "Naver Search Advisor",
  "Latest `2026-07-07` signed-in Search Advisor check reached the `풀꽃` account dashboard",
  "The sitemap-submit page shows only old broad locale rows from `26.06.16`",
  "`사이트맵을 찾을 수 없습니다`",
  "`sitemaps/en` and `/sitemaps/en` submission attempts through browser control did not visibly add a row",
  "Route cleanup now keeps retired known locale sitemap paths on 308 redirects to `/sitemaps/en` instead of 404s",
  "RSS feed",
  "Atom feed",
  "JSON Feed",
  "WebSub",
  `Current representative feed has \`${expectedFeedItemCount}\` Blog + Play items`,
  `Latest WebSub representative publish: \`${latestExternalFeedItemCount}\` RSS items and \`${latestExternalFeedItemCount}\` Atom entries with response statuses \`204\`, \`204\``,
  "robots.txt",
  "OpenSearch",
  "llms.txt",
  "Public search spot check",
  "`2026-07-02`",
  "`2026-07-09`",
  "Do not mark the active web-operations + Blog + Play goal complete",
  "docs/search-indexing-observation-log.md",
]) {
  assertIncludes(matrix, fragment, matrixPath);
}

for (const fragment of [
  "Search Console sitemap row after resubmission: `/sitemaps/en`, status `성공`, discovered pages `53`.",
  "Representative URL indexing request confirmation: `색인 생성 요청됨`",
  `Representative sitemap URL target: \`${expectedSitemapUrlCount}\``,
  `Representative feed item target: \`${expectedFeedItemCount}\``,
  "Search Console sitemap row after resubmission: `/sitemaps/en`, submitted `2026. 6. 26.`, last read `2026. 6. 26.`, status `성공`, discovered pages `68`.",
  "Bing Webmaster Tools still needs a signed-in pass.",
  "Post-representative Blog pruning source snapshot:",
  "Post-pruning Search Console resubmission and pillar live tests:",
  "Trust-page Search Console resubmission and pillar inspections:",
  "76-URL Deployment Registration",
  "Search Console confirmation: `사이트맵이 제출됨`",
  "Search Console sitemap visible row after 76-URL resubmission: `/sitemaps/en`, submitted `2026. 7. 3.`, last read `2026. 7. 3.`, status `성공`, discovered pages `76`, discovered videos `0`.",
  `Search Console sitemap visible row after ${latestExternalSitemapCount}-URL resubmission: \`/sitemaps/en\`, submitted \`2026. 7. 7.\`, last read \`2026. 7. 7.\`, status \`성공\`, discovered pages \`${latestExternalSitemapCount}\`, discovered videos \`0\`.`,
  "Pillar live URL test result: tested `2026. 7. 3. 오전 12:39`; `URL을 Google에 등록할 수 있음`",
  "Pillar live URL test result: tested `2026. 7. 3. 오전 12:38`; `URL을 Google에 등록할 수 있음`",
  "Pillar URL indexing request confirmation: `색인 생성 요청됨`; queue message `URL이 우선순위 크롤링 대기열에 추가되었습니다`.",
  "WebSub response statuses: `204`, `204`",
  "77-URL Deployment Discovery Refresh",
  `IndexNow submitted URL count: \`${latestIndexNowSubmissionCount}\``,
  `Search Console sitemap visible row after 77-URL resubmission`,
  "page indexing reason `크롤링됨 - 현재 색인이 생성되지 않음`",
  "Total impressions: `18`",
  "Indexed pages: `1`",
  "Not indexed pages: `25`",
  "New Blog URL indexing request confirmation: `색인 생성 요청됨`",
  "Google URL Inspection now proves the homepage itself is indexed",
  "2026-07-06 Web-Operations Recovery Source Target",
  "Naver ownership is confirmed",
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

assertIncludes(robots.body, `Sitemap: ${canonicalBaseUrl}/sitemap.xml`, "/robots.txt");
assertIncludes(sitemapIndex.body, `<loc>${canonicalBaseUrl}/sitemaps/en</loc>`, "/sitemap.xml");
const sitemapUrlCount = (sitemap.body.match(/<url>/g) ?? []).length;
if (sitemapUrlCount !== expectedSitemapUrlCount) failures.push(`/sitemaps/en URL count ${sitemapUrlCount} should be ${expectedSitemapUrlCount}`);
for (const loc of [
  `${canonicalBaseUrl}/`,
  `${canonicalBaseUrl}/search`,
  `${canonicalBaseUrl}/about`,
  `${canonicalBaseUrl}/contact`,
  `${canonicalBaseUrl}/privacy`,
  `${canonicalBaseUrl}/terms`,
  `${canonicalBaseUrl}/blog`,
  `${canonicalBaseUrl}/play`,
  `${canonicalBaseUrl}/tools`,
]) {
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
assertIncludes(opensearch.body, `template="${canonicalBaseUrl}/search?q={searchTerms}"`, "/opensearch.xml");
assertIncludes(llms.body, `[Sitemap index](${canonicalBaseUrl}/sitemap.xml)`, "/llms.txt");
assertIncludes(llms.body, `[OpenSearch descriptor](${canonicalBaseUrl}/opensearch.xml)`, "/llms.txt");
if (indexNowKey.body.trim() !== "ac3d32921a2fa361bd499222bff28abf") failures.push("IndexNow key file body mismatch");

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(
  `Search discovery registration smoke passed: ${expectedSitemapUrlCount} sitemap URLs, ${expectedFeedItemCount} feed items, ${submittedBlogEntries.length}/${blogEntries.length} Blog posts, ${playEntries.length} Play entries.`,
);
