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
  const match = source.match(/^---\n([\s\S]*?)\n---\n?/);
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
const requiredPlayTypes = ["micro-sim", "tap-game", "sort-match-game", "arcade-game"];

const blogSlugs = new Set(blogEntries.map((entry) => entry.slug));
const playSlugs = new Set(playEntries.map((entry) => entry.slug));
const playTypes = new Set(playEntries.map((entry) => entry.type));
const blogDates = blogEntries.map((entry) => entry.date).filter(Boolean).sort();
const categoryCounts = Object.fromEntries(requiredCategories.map((category) => [category, blogEntries.filter((entry) => entry.category === category).length]));
const standaloneBlogCount = blogEntries.filter((entry) => entry.relatedPlaySlugs.length === 0).length;

if (blogEntries.length !== 36) failures.push(`audit expects 36 Blog posts, found ${blogEntries.length}`);
if (playEntries.length !== 22) failures.push(`audit expects 22 Play entries, found ${playEntries.length}`);
if (standaloneBlogCount !== 10) failures.push(`audit expects 10 standalone Blog posts, found ${standaloneBlogCount}`);
if (blogDates[0] !== "2026-01-28" || blogDates[blogDates.length - 1] !== "2026-06-24") {
  failures.push(`audit expects Blog date range 2026-01-28 through 2026-06-24, found ${blogDates[0]} through ${blogDates[blogDates.length - 1]}`);
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

for (const fragment of [
  "This audit tracks the active first-pass goal. It is not a completion certificate.",
  "Current count: `36` Blog posts.",
  "Standalone Blog lane: `10` posts have no forced `relatedPlay`",
  "Current count: `22` Play entries.",
  "`arcade-game`",
  "Sitemap URLs: `68`",
  "Feed items: `58`",
  "Search Console sitemap row showed status `성공`, submitted `2026. 6. 26.`, last read `2026. 6. 26.`, and discovered pages `68`.",
  "Search Console sitemap discovery now matches the current live XML count.",
  "Latest performance observation showed total clicks `0` and total impressions `3`",
  "Latest page indexing observation still showed indexed pages `0` and not-indexed pages `5`.",
  "Representative URL indexing request confirmation: `색인 생성 요청됨`",
  "Latest submitted URL count: `68`",
  "The 68-URL live sitemap set was submitted after the arcade Play deployment.",
  "Bing Webmaster Tools reached the public landing page with `Sign In`",
  "Public Bing `site:www.bobob.app` search was blocked",
  "Latest response statuses: `204`, `204`",
  "Latest feed item counts: `58`, `58`",
  "Discovery registration matrix:",
  "`docs/search-discovery-registration.md` tracks Google Search Console, Bing/IndexNow, feeds, WebSub, robots.txt, OpenSearch, llms.txt, current counts, and the stop rule",
  "Submitted URL health:",
  "`npm run harness:submitted-url-health` verifies every submitted `/sitemaps/en` URL",
  "Still Not Complete",
  "Search Console has started showing impressions (`3`)",
  "Search Console page indexing is still unresolved: indexed pages `0`, not-indexed pages `5`.",
  "Search Console sitemap discovery now matches the live sitemap URL count (`68`), but indexing is still unresolved.",
  "Bing Webmaster recommendation classes still need a signed-in follow-up pass",
  "Automation id: `bobob-indexing-observation`",
  "Do not mark the active goal complete",
]) {
  assertIncludes(audit, fragment, auditPath);
}

for (const fragment of [
  "Current submitted sitemap URL count: `68`",
  "Current feed item count: `58`",
  "Google Search Console sitemap",
  "Bing and IndexNow",
  "Do not mark the active Blog + Play goal complete",
]) {
  assertIncludes(discoveryRegistration, fragment, discoveryRegistrationPath);
}

for (const fragment of [
  "Search Console sitemap row after resubmission: `/sitemaps/en`, status `성공`, discovered pages `53`.",
  "Representative URL indexing request confirmation: `색인 생성 요청됨`",
  "Codex heartbeat automation id: `bobob-indexing-observation`",
  "Bing Webmaster recommendations",
]) {
  assertIncludes(observationLog, fragment, observationLogPath);
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`Blog + Play goal audit smoke passed: ${blogEntries.length} Blog posts, ${standaloneBlogCount} standalone, ${playEntries.length} Play entries.`);
