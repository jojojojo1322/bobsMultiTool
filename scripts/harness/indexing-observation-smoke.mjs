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
  "## 2026-06-26",
  "`bobob935` Google account",
  "Chrome profile/session signed in as `bobob935@gmail.com`",
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
  "Browser/session guard: use the Chrome profile/session signed in as `bobob935@gmail.com`; do not use another signed-in Chrome profile for Search Console.",
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
  "Search Console action: submitted `/sitemaps/en` again",
  "Search Console sitemap row after submission: `/sitemaps/en`, status `성공`, discovered pages `52`.",
  "Representative URL inspection: `https://www.bobob.app/blog/boring-maintenance-is-content-too`",
  "Representative URL indexing request confirmation: `색인 생성 요청됨`",
  "Post-AI-review Play expansion registration:",
  "Play now has `7` entries while Blog remains `36` posts",
  "Live discovery check: `NODE_TLS_REJECT_UNAUTHORIZED=0 npm run harness:live-discovery` passed with sitemap URLs `53`, feed items `43`, Blog posts `36`, Play entries `7`.",
  "Search Console confirmation: `사이트맵이 제출됨`",
  "Search Console sitemap row after resubmission: `/sitemaps/en`, status `성공`, discovered pages `53`.",
  "Same-day Search Console observation after metadata/feed deployment:",
  "Verified account surface: `Google 계정: 조현재 (bobob935@gmail.com)`",
  "Total impressions: `3`",
  "Indexed pages: `0`",
  "Not indexed pages: `5`",
  "Interpretation: impressions have appeared, but page indexing is still not solved because indexed pages remain `0`.",
  "Bing follow-up attempt:",
  "Bing Webmaster Tools URL opened: `https://www.bing.com/webmasters/home?siteUrl=https%3A%2F%2Fwww.bobob.app`",
  "site-specific recommendation classes were not visible without signing in.",
  "Public Bing search attempted: `site:www.bobob.app`",
  "Bing showed a `계속하려면 아래 과제 해결` challenge",
  "IndexNow submission is still the only confirmed Bing-compatible discovery evidence",
  "IndexNow submitted URL count: `53`",
  "Search Console sitemap discovery check:",
  "Google Search Console account surface: `Google 계정: 조현재 (bobob935@gmail.com)`",
  "`/sitemaps/en`: submitted `2026. 6. 26.`, last read `2026. 6. 26.`, status `성공`, discovered pages `66`",
  "Live `/sitemaps/en` URL count: `68`",
  "Search Console has applied the newer sitemap beyond the old `53` discovered-page state",
  "No Search Console resubmission or IndexNow submission was performed in this pass.",
  "Post-arcade Play deployment registration:",
  "Commit: `23b5f8b`",
  "Play set to `22` entries",
  "Live discovery check: `NODE_TLS_REJECT_UNAUTHORIZED=0 npm run harness:live-discovery` passed with sitemap URLs `68`, feed items `58`, Blog posts `36`, Play entries `22`.",
  "IndexNow submitted URL count: `68`",
  "WebSub feed item counts: `58`, `58`",
  "Post-arcade Search Console sitemap resubmission:",
  "Search Console confirmation: `사이트맵이 제출됨`",
  "Search Console sitemap row after resubmission: `/sitemaps/en`, submitted `2026. 6. 26.`, last read `2026. 6. 26.`, status `성공`, discovered pages `68`.",
  "Post-info Blog expansion registration:",
  "Blog set to `39` posts",
  "Live discovery check: `NODE_TLS_REJECT_UNAUTHORIZED=0 npm run harness:live-discovery` passed with sitemap URLs `72`, feed items `61`, Blog posts `39`, Play entries `22`.",
  "IndexNow submitted URL count: `72`",
  "WebSub feed item counts: `61`, `61`",
  "Search Console discovered pages still need a signed-in follow-up against the new `72` URL sitemap.",
  "Next observation windows:",
  "Codex heartbeat automation id: `bobob-indexing-observation`",
  "Schedule: starts `2026-07-02 10:00`, weekly, `2` runs.",
  "`2026-07-02`",
  "Scheduled Search Console/Bing/Naver observation:",
  "Performance last updated: `8.5시간 전`",
  "Total impressions: `18`",
  "Average position: `1.1`",
  "Search Console sitemap row after resubmission: `/sitemaps/en`, submitted `2026. 7. 2.`, last read `2026. 6. 26.`, status `성공`, discovered pages `68`, discovered videos `0`.",
  "`https://www.bobob.app/`: `URL이 Google에 등록되어 있음`; page indexing `페이지 색인이 생성됨`.",
  "`https://www.bobob.app/blog`: `URL이 Google에 등록되어 있지 않음`; page indexing reason `크롤링됨 - 현재 색인이 생성되지 않음`",
  "`https://www.bobob.app/play`: `URL이 Google에 등록되어 있지 않음`; page indexing reason `크롤링됨 - 현재 색인이 생성되지 않음`",
  "`https://www.bobob.app/blog/ai-side-project-realistic-order`: `URL이 Google에 등록되어 있지 않음`; page indexing reason `발견됨 - 현재 색인이 생성되지 않음`",
  "`https://www.bobob.app/play/office-survival`: `URL이 Google에 등록되어 있지 않음`; page indexing reason `크롤링됨 - 현재 색인이 생성되지 않음`",
  "Homepage indexing and 18 impressions are concrete progress",
  "Signed-in Search Advisor surface opened for `https://www.bobob.app`.",
  "`sitemaps/en` was not visible in the submitted sitemap list.",
  "`2026-07-09`",
  "Completion guard:",
  "should not be treated as indexed or search-ready only because deployment, sitemap fetch, live discovery, or IndexNow submission passed",
  "WebSub publish and repeated Search Console sitemap submission are discovery hints, not indexing proof.",
  "Bing Webmaster recommendations",
  "npm run harness:seo-opportunities",
  "2026-07-03 76-URL Deployment Registration",
  "Live discovery check: `NODE_TLS_REJECT_UNAUTHORIZED=0 npm run harness:live-discovery` passed with sitemap URLs `76`, feed items `61`, Blog posts `35`, Play entries `26`.",
  "Search Console sitemap visible row after 76-URL resubmission: `/sitemaps/en`, submitted `2026. 7. 3.`, last read `2026. 7. 3.`, status `성공`, discovered pages `76`, discovered videos `0`.",
  "Pillar URL indexing request confirmation: `색인 생성 요청됨`; queue message `URL이 우선순위 크롤링 대기열에 추가되었습니다`.",
  "IndexNow submitted URL count: `76`",
  "IndexNow response status: `200`",
  "WebSub feed item counts: `61`, `61`",
  "WebSub response statuses: `204`, `204`",
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
const latestLoggedLiveSitemapUrlCount = Array.from(log.matchAll(/(?:Live `?\/sitemaps\/en`? URL count|Representative sitemap URL target): `(\d+)`/g))
  .map((match) => Number.parseInt(match[1], 10))
  .filter(Number.isFinite)
  .at(-1);
if (!latestLoggedLiveSitemapUrlCount) failures.push("Could not parse latest logged live sitemap URL count");
const latestSearchConsoleDiscoveredPages = Array.from(log.matchAll(/\/sitemaps\/en[^\n]*discovered pages `(\d+)`/g))
  .map((match) => Number.parseInt(match[1], 10))
  .filter(Number.isFinite)
  .at(-1);
if (!latestSearchConsoleDiscoveredPages) failures.push("Could not parse latest Search Console discovered pages");
const discoveredPages = numberAfter(log, /\/sitemaps\/en`: submitted `2026-06-25`, last read `2026-06-25`, status `성공`, discovered pages `(\d+)`/, "/sitemaps/en discovered pages");
const hasPendingSourceTargetPrune =
  log.includes("Source Target") &&
  /latest external Search Console discovery evidence remains the previous `\d+` discovered pages until the \d+-URL target is deployed/.test(log);

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

if (liveSitemapUrlCount !== null && latestLoggedLiveSitemapUrlCount && liveSitemapUrlCount !== latestLoggedLiveSitemapUrlCount && !hasPendingSourceTargetPrune) {
  failures.push(`Live /sitemaps/en URL count ${liveSitemapUrlCount} should match latest logged live sitemap URL count ${latestLoggedLiveSitemapUrlCount}`);
}
if (
  liveSitemapUrlCount !== null &&
  latestSearchConsoleDiscoveredPages &&
  latestSearchConsoleDiscoveredPages > liveSitemapUrlCount &&
  !hasPendingSourceTargetPrune
) {
  failures.push(
    `Latest Search Console discovered pages ${latestSearchConsoleDiscoveredPages} should not exceed live sitemap URL count ${liveSitemapUrlCount}`,
  );
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(
  `Indexing observation smoke passed. Baseline submitted URLs: ${submittedUrlCount}; latest IndexNow submitted URLs: ${latestSubmittedUrlCount}; Search Console discovered pages: ${latestSearchConsoleDiscoveredPages}; live sitemap URLs: ${liveSitemapUrlCount}.`,
);
