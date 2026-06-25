import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const logPath = path.join(root, "docs/search-indexing-observation-log.md");
const baseUrl = (process.env.BOBOB_INDEXING_OBSERVATION_BASE_URL || "https://www.bobob.app").replace(/\/$/, "");
const failures = [];

function assertIncludes(source, fragment, label) {
  if (!source.includes(fragment)) failures.push(`${label} missing required fragment: ${fragment}`);
}

function numberAfter(source, pattern, label) {
  const match = source.match(pattern);
  if (!match) {
    failures.push(`Could not parse ${label}`);
    return null;
  }
  return Number.parseInt(match[1], 10);
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: {
      "user-agent": "BobobIndexingObservationSmoke/1.0",
      accept: "application/xml,text/xml,text/plain,*/*",
    },
  });
  if (!response.ok) throw new Error(`${url} returned ${response.status}`);
  return response.text();
}

const log = fs.readFileSync(logPath, "utf8");

for (const fragment of [
  "# bobob.app Search Indexing Observation Log",
  "## 2026-06-25",
  "`bobob935` Google account",
  "Search Console URL-prefix property `https://www.bobob.app/`",
  "Total web search clicks: `0`",
  "Total impressions: `0`",
  "Indexed pages: `0`",
  "Not indexed pages: `5`",
  "`/sitemaps/en`: submitted `2026-06-25`, last read `2026-06-25`, status `성공`, discovered pages `44`",
  "Submitted URL count: `44`",
  "Response status: `200`",
  "Post-quality-update resubmission:",
  "Google Search Console account: `bobob935@gmail.com`",
  "Search Console action: submitted `sitemaps/en` again",
  "Search Console confirmation: `사이트맵이 제출됨`",
  "IndexNow submitted URL count: `44`",
  "IndexNow response status: `200`",
  "WebSub command: `NODE_TLS_REJECT_UNAUTHORIZED=0 npm run websub:submit`",
  "WebSub hub: `https://pubsubhubbub.appspot.com/`",
  "WebSub topics: `https://www.bobob.app/feed.xml`, `https://www.bobob.app/atom.xml`",
  "WebSub response statuses: `204`, `204`",
  "Post-standalone-blog expansion resubmission:",
  "Blog now has `36` posts, `12` standalone posts",
  "Live discovery check: `NODE_TLS_REJECT_UNAUTHORIZED=0 npm run harness:live-discovery` passed with sitemap URLs `52`, feed items `42`, Blog posts `36`, Play entries `6`.",
  "IndexNow submitted URL count: `52`",
  "WebSub feed item counts: `42`, `42`",
  "Next observation windows:",
  "`2026-07-02`",
  "`2026-07-09`",
  "Completion guard:",
  "should not be treated as indexed or search-ready only because deployment, sitemap fetch, live discovery, or IndexNow submission passed",
  "WebSub publish and repeated Search Console sitemap submission are discovery hints, not indexing proof.",
  "Bing Webmaster recommendations",
  "npm run harness:seo-opportunities",
]) {
  assertIncludes(log, fragment, logPath);
}

for (const url of [
  "https://www.bobob.app/",
  "https://www.bobob.app/blog",
  "https://www.bobob.app/play",
  "https://www.bobob.app/blog/ai-side-project-realistic-order",
  "https://www.bobob.app/play/office-survival",
]) {
  assertIncludes(log, url, logPath);
}

const submittedUrlCount = numberAfter(log, /Submitted URL count: `(\d+)`/, "IndexNow submitted URL count");
const latestSubmittedUrlCount = Array.from(log.matchAll(/(?:Submitted URL count|IndexNow submitted URL count): `(\d+)`/g))
  .map((match) => Number.parseInt(match[1], 10))
  .filter(Number.isFinite)
  .at(-1);
if (!latestSubmittedUrlCount) failures.push("Could not parse latest submitted URL count");
const discoveredPages = numberAfter(log, /\/sitemaps\/en`: submitted `2026-06-25`, last read `2026-06-25`, status `성공`, discovered pages `(\d+)`/, "/sitemaps/en discovered pages");

if (submittedUrlCount !== null && discoveredPages !== null && submittedUrlCount !== discoveredPages) {
  failures.push(`IndexNow submitted URL count ${submittedUrlCount} should match /sitemaps/en discovered pages ${discoveredPages}`);
}

let liveSitemapUrlCount = null;
try {
  const sitemapXml = await fetchText(`${baseUrl}/sitemaps/en`);
  liveSitemapUrlCount = (sitemapXml.match(/<url>/g) ?? []).length;
} catch (error) {
  failures.push(`Could not fetch live /sitemaps/en for observation smoke: ${error instanceof Error ? error.message : String(error)}`);
}

if (liveSitemapUrlCount !== null && latestSubmittedUrlCount && liveSitemapUrlCount !== latestSubmittedUrlCount) {
  failures.push(`Live /sitemaps/en URL count ${liveSitemapUrlCount} should match latest logged submitted URL count ${latestSubmittedUrlCount}`);
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`Indexing observation smoke passed. Baseline submitted URLs: ${submittedUrlCount}; latest submitted URLs: ${latestSubmittedUrlCount}; live sitemap URLs: ${liveSitemapUrlCount}.`);
