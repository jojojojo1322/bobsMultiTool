import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const auditPath = path.join(root, "docs/blog-play-goal-audit.md");
const observationLogPath = path.join(root, "docs/search-indexing-observation-log.md");
const discoveryRegistrationPath = path.join(root, "docs/search-discovery-registration.md");
const blogDir = path.join(root, "content/blog");
const playDir = path.join(root, "content/play");
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

function assertIncludes(source, fragment, label) {
  if (!source.includes(fragment)) failures.push(`${label} missing fragment: ${fragment}`);
}

function backtickNumber(source, label) {
  const match = source.match(new RegExp(`${label}: \`(\\d+)\``));
  return match ? Number(match[1]) : null;
}

const audit = read(auditPath);
const observationLog = read(observationLogPath);
const discoveryRegistration = read(discoveryRegistrationPath);
const blogEntries = fs
  .readdirSync(blogDir)
  .filter((file) => file.endsWith(".mdx") || file.endsWith(".md"))
  .map((file) => {
    const frontmatter = parseFrontmatter(read(path.join(blogDir, file)));
    return {
      slug: frontmatter.slug,
      date: frontmatter.date,
      category: frontmatter.category,
      publicationTier: frontmatter.publicationTier,
      indexPolicy: frontmatter.indexPolicy,
      relatedPlaySlugs: frontmatter.relatedPlay ? frontmatter.relatedPlay.split(",").map((item) => item.trim()).filter(Boolean) : [],
    };
  });
const playEntries = fs
  .readdirSync(playDir)
  .filter((file) => file.endsWith(".json"))
  .map((file) => JSON.parse(read(path.join(playDir, file))));

const requiredBlogSlugs = [
  "ai-side-project-realistic-order",
  "cursor-codex-web-service-bottlenecks",
  "search-console-misreads-for-indie-devs",
  "small-web-games-retention",
  "vercel-sitemap-canonical-log",
  "human-decisions-in-ai-coding",
  "why-bobob-shifted-to-content-lab",
  "static-micro-games-architecture",
];
const requiredPlaySlugs = ["office-survival", "prompt-cleanup", "meeting-escape", "priority-sorter", "bug-clicker", "ai-review-tap"];
const requiredCategories = ["일기", "요즘 관심사", "AI", "개발", "운영 기록"];
const informationCategory = "정보";
const requiredPlayTypes = ["micro-sim", "tap-game", "sort-match-game", "arcade-game"];

const blogSlugs = new Set(blogEntries.map((entry) => entry.slug));
const representativeBlogEntries = blogEntries.filter((entry) => entry.indexPolicy === "index");
const archivedBlogEntries = blogEntries.filter((entry) => entry.indexPolicy === "noindex");
const playSlugs = new Set(playEntries.map((entry) => entry.slug));
const playTypes = new Set(playEntries.map((entry) => entry.type));
const blogDates = blogEntries.map((entry) => entry.date).filter(Boolean).sort();
const categoryCounts = Object.fromEntries(requiredCategories.map((category) => [category, blogEntries.filter((entry) => entry.category === category).length]));
const standaloneBlogCount = blogEntries.filter((entry) => entry.relatedPlaySlugs.length === 0).length;
const representativeStandaloneBlogCount = representativeBlogEntries.filter((entry) => entry.relatedPlaySlugs.length === 0).length;
const informationCategoryCount = blogEntries.filter((entry) => entry.category === informationCategory).length;
const representativeInformationCategoryCount = representativeBlogEntries.filter((entry) => entry.category === informationCategory).length;
const currentSubmittedSitemapCount = backtickNumber(discoveryRegistration, "Current submitted sitemap source target URL count");
const currentFeedItemCount = backtickNumber(discoveryRegistration, "Current feed source target item count");
const currentRegisteredBlogCount = backtickNumber(discoveryRegistration, "Current Blog count");
const currentRepresentativeBlogCount = backtickNumber(discoveryRegistration, "Current representative Blog count");
const latestExternalSitemapCount = backtickNumber(discoveryRegistration, "Latest external sitemap discovery count") ?? currentSubmittedSitemapCount;
const latestIndexNowSubmissionCount = backtickNumber(discoveryRegistration, "Latest IndexNow representative submission count") ?? currentSubmittedSitemapCount;
const latestExternalFeedItemCount = backtickNumber(discoveryRegistration, "Latest external feed publish item count") ?? currentFeedItemCount;
const searchConsoleDiscoveryStatusFragment =
  latestExternalSitemapCount === currentSubmittedSitemapCount
    ? `Search Console sitemap discovery now matches the current live/source representative sitemap URL count (\`${latestExternalSitemapCount}\`)`
    : `Search Console sitemap discovery still matches the previous externally submitted representative sitemap URL count (\`${latestExternalSitemapCount}\`)`;

if (blogEntries.length < 39) failures.push(`audit expects at least 39 Blog posts, found ${blogEntries.length}`);
if (representativeBlogEntries.length < 30 || representativeBlogEntries.length > 45) {
  failures.push(`audit expects 30-45 representative Blog posts, found ${representativeBlogEntries.length}`);
}
if (archivedBlogEntries.length < 20) failures.push(`audit expects noindex archive candidates, found ${archivedBlogEntries.length}`);
if (playEntries.length < 24) failures.push(`audit expects at least 24 Play entries, found ${playEntries.length}`);
if (standaloneBlogCount < 13) failures.push(`audit expects at least 13 standalone Blog posts, found ${standaloneBlogCount}`);
if (blogDates[0] !== "2026-01-05") {
  failures.push(`audit expects Blog date range to start 2026-01-05, found ${blogDates[0]}`);
}

for (const slug of requiredBlogSlugs) {
  if (!blogSlugs.has(slug)) failures.push(`missing required Blog slug: ${slug}`);
}
for (const slug of requiredPlaySlugs) {
  if (!playSlugs.has(slug)) failures.push(`missing required Play slug: ${slug}`);
}
for (const type of requiredPlayTypes) {
  if (!playTypes.has(type)) failures.push(`missing required Play type: ${type}`);
}
for (const [category, count] of Object.entries(categoryCounts)) {
  if (count < 7) failures.push(`category ${category} should have at least 7 posts, found ${count}`);
}
if (informationCategoryCount < 3) failures.push(`category ${informationCategory} should have at least 3 posts, found ${informationCategoryCount}`);
if (currentSubmittedSitemapCount === null) failures.push(`${discoveryRegistrationPath} missing current submitted sitemap count`);
if (currentFeedItemCount === null) failures.push(`${discoveryRegistrationPath} missing current feed item count`);
if (currentRegisteredBlogCount !== blogEntries.length) {
  failures.push(`${discoveryRegistrationPath} current Blog count should match source Blog count ${blogEntries.length}, found ${currentRegisteredBlogCount}`);
}
if (currentRepresentativeBlogCount !== representativeBlogEntries.length) {
  failures.push(`${discoveryRegistrationPath} representative Blog count should match indexable Blog count ${representativeBlogEntries.length}, found ${currentRepresentativeBlogCount}`);
}

for (const fragment of [
  "This audit tracks the active first-pass goal. It is not a completion certificate.",
  `Current count: \`${blogEntries.length}\` Blog posts.`,
  `Representative submitted count: \`${representativeBlogEntries.length}\` Blog posts.`,
  `Archive/noindex candidate count: \`${archivedBlogEntries.length}\` Blog posts.`,
  `Date range: \`${blogDates[0]}\` through \`${blogDates[blogDates.length - 1]}\``,
  `Date-sensitive information lane: \`${informationCategoryCount}\` posts live under \`정보\``,
  `Representative information lane: \`${representativeInformationCategoryCount}\` posts remain submitted under \`정보\``,
  `Standalone Blog lane: \`${standaloneBlogCount}\` posts have no forced \`relatedPlay\``,
  `Representative standalone lane: \`${representativeStandaloneBlogCount}\` submitted posts have no forced \`relatedPlay\``,
  "Cross-game feedback consolidation: `game-feedback-before-score-note` now absorbs smaller noindex cue notes",
  `Current count: \`${playEntries.length}\` Play entries.`,
  "`arcade-game`",
  "Homepage evidence surface: `apps/main/src/app/page.tsx` now opens with `data-ops-workflows`",
  "`small-web-games-retention` was deepened from a short retention argument into an 800+ word Blog + Play operating note",
  "`search-console-misreads-for-indie-devs` was deepened from a short Search Console warning into an 800+ word observation workflow",
  "`cursor-codex-web-service-bottlenecks` was deepened from a short AI-tool bottleneck note into an 800+ word development operations article",
  "`human-decisions-in-ai-coding` was deepened from a short AI judgment note into an 800+ word product-decision article",
  "`vercel-sitemap-canonical-log` was deepened from a short canonical cleanup note into a 1,300+ word web-operations article",
  "`ai-side-project-realistic-order` was deepened from a short AI side-project note into a 1,400+ word product-scope article",
  "`first-small-web-note` was deepened from a smaller diary entry into a 900+ word owner-note article",
  "`why-small-web-toys-return` was deepened from a smaller interest note into a near-900 word Blog + Play article",
  "`deploy-stacker-build-log` was deepened from an 860-word archive absorption note into a 1,200+ word release-rail production log",
  "`lottery-endless-stage-loop-note` now absorbs `lottery-scratch-stage-note` into a 1,100+ word representative Play-safety build log",
  "Retired sitemap route cleanup: known non-submitted locale sitemap paths such as `/sitemaps/ar`, `/sitemaps/th`, and `/sitemaps/zh-CN` now 308 redirect to `/sitemaps/en`",
  `Sitemap URLs: \`${currentSubmittedSitemapCount}\``,
  `Feed items: \`${currentFeedItemCount}\``,
  `Search Console sitemap resubmission for the latest externally submitted ${latestExternalSitemapCount}-URL sitemap showed \`사이트맵이 제출됨\`.`,
  "Property: `sc-domain:bobob.app` for the user's Search Console link",
  `discovered pages \`${latestExternalSitemapCount}\``,
  "The same-day `sc-domain:bobob.app` recheck initially showed the older `84`-page `/sitemaps/en` row from `2026. 7. 6.`",
  "This is discovery evidence, not indexing proof.",
  "Latest performance observation showed total clicks `1`, total impressions `28`, CTR `3.6%`, and average position `3.5`",
  "Latest page indexing report now shows indexed pages `1` and not-indexed pages `32`, with last update `2026. 6. 30`.",
  "`크롤링됨 - 현재 색인이 생성되지 않음`: `24`",
  "URL Inspection now shows `https://www.bobob.app/` as `URL이 Google에 등록되어 있음` and `페이지 색인이 생성됨`; a recrawl/indexing request was submitted",
  "Representative Blog/Play URL indexing request confirmation: `색인 생성 요청됨`",
  "security-header-report-before-copying-devtools",
  "fresh `색인 생성 요청됨` confirmation",
  "Post-77-URL pillar URL Inspection checked `https://www.bobob.app/blog/why-bobob-shifted-to-content-lab`",
  "Both pillar URLs were `URL이 Google에 등록되어 있지 않음`",
  "크롤링됨 - 현재 색인이 생성되지 않음",
  "Both pillar URL indexing request confirmations showed `색인 생성 요청됨`",
  `Latest submitted URL count: \`${latestIndexNowSubmissionCount}\``,
  `The latest deployed ${latestIndexNowSubmissionCount}-URL representative sitemap set has been submitted to IndexNow with response status \`200\`.`,
  "Crawler-profile evidence surface: `/tools/http-status-checker` now supports fixed `public`, `Googlebot Smartphone`, and `Google InspectionTool mobile` request profiles",
  "HTTP crawler-profile source target:",
  "This source change is deployed in commit `946fe35b`",
  "This is public reachability and request-context evidence only",
  "Bing Webmaster Tools reached the public landing page with `Sign In`",
  "Public Bing `site:www.bobob.app` search was blocked",
  "Latest response statuses: `204`, `204`",
  `Latest published feed item counts: \`${latestExternalFeedItemCount}\`, \`${latestExternalFeedItemCount}\`.`,
  "Discovery registration matrix:",
  "`docs/search-discovery-registration.md` tracks Google Search Console, Bing/IndexNow, Naver Search Advisor, feeds, WebSub, robots.txt, OpenSearch, llms.txt, current counts, and the stop rule",
  "Submitted URL health:",
  "`npm run harness:submitted-url-health` verifies every submitted `/sitemaps/en` URL",
  "Still Not Complete",
  "Search Console has started showing impressions (`28`) and one click",
  "Google URL Inspection proves the homepage itself is indexed.",
  "Search Console page indexing is still unresolved: indexed pages `1`, not-indexed pages `32`",
  searchConsoleDiscoveryStatusFragment,
  "The two new pillar posts have `색인 생성 요청됨` confirmations, but they are still not indexed after the latest inspection.",
  "Bing Webmaster recommendation classes still need a signed-in follow-up pass",
  "Naver Search Advisor still needs a follow-up pass for visible `sitemaps/en` registration or proof that Naver reread the redirected retired sitemap rows",
  "Automation id: `bobob-indexing-observation`",
  "Do not mark the active goal complete",
]) {
  assertIncludes(audit, fragment, auditPath);
}

for (const fragment of [
  `Current submitted sitemap source target URL count: \`${currentSubmittedSitemapCount}\``,
  `Current feed source target item count: \`${currentFeedItemCount}\``,
  "Google Search Console sitemap",
  "Bing and IndexNow",
  "Naver Search Advisor",
  "Do not mark the active web-operations + Blog + Play goal complete",
]) {
  assertIncludes(discoveryRegistration, fragment, discoveryRegistrationPath);
}

for (const fragment of [
  "Search Console sitemap row after resubmission: `/sitemaps/en`, status `성공`, discovered pages `53`.",
  "Representative URL indexing request confirmation: `색인 생성 요청됨`",
  "Post-pruning Search Console resubmission and pillar live tests:",
  "Trust-page Search Console resubmission and pillar inspections:",
  "76-URL Deployment Registration",
  "Information Representative Prune Source Target",
  "Search Console confirmation: `사이트맵이 제출됨`",
  "Search Console sitemap visible row after 76-URL resubmission: `/sitemaps/en`, submitted `2026. 7. 3.`, last read `2026. 7. 3.`, status `성공`, discovered pages `76`, discovered videos `0`.",
  `Representative sitemap URL target: \`${currentSubmittedSitemapCount}\``,
  `Representative feed item target: \`${currentFeedItemCount}\``,
  "Pillar live URL test result: tested `2026. 7. 3. 오전 12:39`; `URL을 Google에 등록할 수 있음`",
  "Pillar live URL test result: tested `2026. 7. 3. 오전 12:38`; `URL을 Google에 등록할 수 있음`",
  "Pillar URL indexing request confirmation: `색인 생성 요청됨`; queue message `URL이 우선순위 크롤링 대기열에 추가되었습니다`.",
  "Codex heartbeat automation id: `bobob-indexing-observation`",
  "Bing Webmaster recommendations",
  "Naver ownership is confirmed",
  "2026-07-09 HTTP Crawler Profile Production Deployment",
  "Commit: `946fe35b`",
  "Live API verification: a production `/api/http-status` request with `requestProfile=google-inspection-mobile` returned final `200`",
]) {
  assertIncludes(observationLog, fragment, observationLogPath);
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(
  `Blog + Play goal audit smoke passed: ${representativeBlogEntries.length}/${blogEntries.length} Blog posts, ${representativeStandaloneBlogCount} representative standalone, ${playEntries.length} Play entries.`,
);
