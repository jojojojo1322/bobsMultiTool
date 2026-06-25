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
  "Next observation windows:",
  "`2026-07-02`",
  "`2026-07-09`",
  "Completion guard:",
  "should not be treated as indexed or search-ready only because deployment, sitemap fetch, live discovery, or IndexNow submission passed",
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

if (liveSitemapUrlCount !== null && submittedUrlCount !== null && liveSitemapUrlCount !== submittedUrlCount) {
  failures.push(`Live /sitemaps/en URL count ${liveSitemapUrlCount} should match logged submitted URL count ${submittedUrlCount}`);
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`Indexing observation smoke passed. Logged submitted URLs: ${submittedUrlCount}; live sitemap URLs: ${liveSitemapUrlCount}.`);
