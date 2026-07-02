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
const currentSubmittedSitemapCount = backtickNumber(discoveryRegistration, "Current submitted sitemap URL count");
const currentFeedItemCount = backtickNumber(discoveryRegistration, "Current feed item count");
const currentRegisteredBlogCount = backtickNumber(discoveryRegistration, "Current Blog count");
const currentRepresentativeBlogCount = backtickNumber(discoveryRegistration, "Current representative Blog count");

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
  "Homepage evidence surface: `apps/main/src/app/page.tsx` pins those three pillar posts in the `data-pillar-blog` first-read section",
  `Sitemap URLs: \`${currentSubmittedSitemapCount}\``,
  `Feed items: \`${currentFeedItemCount}\``,
  "Search Console sitemap resubmission after the 77-URL trust-page correction showed `사이트맵이 제출됨`.",
  "discovered pages `73`",
  `The representative sitemap is now intentionally reduced; Search Console still needs the discovered-pages count to converge from \`73\` to the current \`${currentSubmittedSitemapCount}\` URL count.`,
  "Latest performance observation showed total clicks `0`, total impressions `18`, CTR `0%`, and average position `1.1`",
  "Latest page indexing report still showed indexed pages `0` and not-indexed pages `5`, with last update `2026-06-12`.",
  "URL Inspection now shows `https://www.bobob.app/` as `URL이 Google에 등록되어 있음` and `페이지 색인이 생성됨`.",
  "Representative Blog/Play URL indexing request confirmation: `색인 생성 요청됨`",
  "Post-pruning pillar URL Inspection checked `https://www.bobob.app/blog/why-bobob-shifted-to-content-lab`",
  "Both pillar URLs were `URL이 Google에 등록되어 있지 않음`",
  "both live URL tests returned `URL을 Google에 등록할 수 있음`",
  `Current submitted URL target: \`${currentSubmittedSitemapCount}\``,
  `The current ${currentSubmittedSitemapCount}-URL representative sitemap target is ready for the next IndexNow, WebSub, and Search Console pass`,
  "Bing Webmaster Tools reached the public landing page with `Sign In`",
  "Public Bing `site:www.bobob.app` search was blocked",
  "Latest response statuses: `204`, `204`",
  `Current feed item target: \`${currentFeedItemCount}\``,
  "Discovery registration matrix:",
  "`docs/search-discovery-registration.md` tracks Google Search Console, Bing/IndexNow, Naver Search Advisor, feeds, WebSub, robots.txt, OpenSearch, llms.txt, current counts, and the stop rule",
  "Submitted URL health:",
  "`npm run harness:submitted-url-health` verifies every submitted `/sitemaps/en` URL",
  "Still Not Complete",
  "Search Console has started showing more impressions (`18`)",
  "Google URL Inspection proves the homepage itself is indexed.",
  "Search Console page indexing is still unresolved: indexed pages `0`, not-indexed pages `5`.",
  `Search Console sitemap discovery must be checked against the reduced representative sitemap URL count (\`${currentSubmittedSitemapCount}\`)`,
  "visible `/sitemaps/en` row now shows discovered pages `73`",
  "The two new pillar posts are live-test eligible for Google indexing, but they are still not indexed after the latest inspection.",
  "Bing Webmaster recommendation classes still need a signed-in follow-up pass",
  "Naver Search Advisor still needs a cleanup/pass for reduced sitemap registration and later collection/indexing state.",
  "Automation id: `bobob-indexing-observation`",
  "Do not mark the active goal complete",
]) {
  assertIncludes(audit, fragment, auditPath);
}

for (const fragment of [
  `Current submitted sitemap URL count: \`${currentSubmittedSitemapCount}\``,
  `Current feed item count: \`${currentFeedItemCount}\``,
  "Google Search Console sitemap",
  "Bing and IndexNow",
  "Naver Search Advisor",
  "Do not mark the active Blog + Play goal complete",
]) {
  assertIncludes(discoveryRegistration, fragment, discoveryRegistrationPath);
}

for (const fragment of [
  "Search Console sitemap row after resubmission: `/sitemaps/en`, status `성공`, discovered pages `53`.",
  "Representative URL indexing request confirmation: `색인 생성 요청됨`",
  "Post-pruning Search Console resubmission and pillar live tests:",
  "Trust-page Search Console resubmission and pillar inspections:",
  "Search Console confirmation: `사이트맵이 제출됨`",
  "Search Console sitemap visible row after trust-page correction resubmission: `/sitemaps/en`, submitted `2026. 7. 3.`, last read `2026. 7. 3.`, status `성공`, discovered pages `73`, discovered videos `0`.",
  "Pillar live URL test result: tested `2026. 7. 3. 오전 12:39`; `URL을 Google에 등록할 수 있음`",
  "Pillar live URL test result: tested `2026. 7. 3. 오전 12:38`; `URL을 Google에 등록할 수 있음`",
  "Codex heartbeat automation id: `bobob-indexing-observation`",
  "Bing Webmaster recommendations",
  "Naver ownership is confirmed",
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
