import fs from "node:fs";
import path from "node:path";
import { validatePlayPlanningBriefs } from "./play-planning-rules.mjs";

const root = process.cwd();
const blogDir = path.join(root, "content/blog");
const playDir = path.join(root, "content/play");
const blogCategoryPath = path.join(root, "apps/main/src/features/content/blog-categories.ts");
const contentSearchPath = path.join(root, "apps/main/src/features/content/search.ts");
const contentStructuredDataPath = path.join(root, "apps/main/src/features/content/structured-data.ts");
const discoveryPath = path.join(root, "apps/main/src/features/content/discovery.ts");
const sitemapPath = path.join(root, "apps/main/src/features/seo/sitemaps.ts");
const feedPath = path.join(root, "apps/main/src/features/seo/feed.ts");
const llmsPath = path.join(root, "apps/main/src/features/seo/llms.ts");
const opensearchPath = path.join(root, "apps/main/src/features/seo/opensearch.ts");
const homePagePath = path.join(root, "apps/main/src/app/page.tsx");
const playDetailPath = path.join(root, "apps/main/src/app/play/[slug]/page.tsx");
const blogDetailPath = path.join(root, "apps/main/src/app/blog/[slug]/page.tsx");
const playResultLinksPath = path.join(root, "apps/main/src/features/play/result-links.tsx");
const playEngineDir = path.join(root, "apps/main/src/features/play");
const appSourceDir = path.join(root, "apps/main/src");

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
const requiredCategories = ["일기", "요즘 관심사", "AI", "개발", "운영 기록", "정보"];
const requiredPlayTypes = ["micro-sim", "tap-game", "sort-match-game", "arcade-game"];
const disallowedSupportLinkPatterns = [/buymeacoffee/i, /ko-fi/i, /paypal/i, /toss\.me/i, /후원\s*링크/, /커피값/];
const minBlogDescriptionLength = 50;
const minPlayDescriptionLength = 50;
const minCategoryDescriptionLength = 50;
const publicActionLimitPattern =
  /조작\s*횟수|행동\s*횟수|발사\s*횟수|횟수\s*제한|조작\s*제한|남은\s*조작|남은\s*횟수|\d+\s*턴\s*짜리|제한\s*없는\s*루프|action[-\s]*count|move[-\s]*count|action\s*limit|move\s*limit|actions?\s+left|moves?\s+left/i;
const publicPlayCountTonePattern = /몇\s*번\s*(?:흔들|헛발|멈칫|스쳤|꼬임|건드렸)/i;
const lotteryLimitScorePattern = /점수판|점수표|스코어|남은\s*시간|타이머|조작\s*횟수|횟수\s*제한|조작\s*제한/i;
const lotteryStagePattern = /종이[\s\S]*은색[\s\S]*금색[\s\S]*네온[\s\S]*잭팟/;
const playEngineCountTonePattern =
  /남은\s*후보|후보\s+\$\{|건넌\s*기록|방금\s*지나간\s*선택|오늘의\s*선택\s*로그|판단\s*로그|분류\s*로그|터치하거나\s*넘기면\s*판단\s*로그/i;
const infoReaderIntentPatterns = [
  /궁금/,
  /헷갈/,
  /먼저/,
  /실제/,
  /다시\s*확인|다시\s*봐|다시\s*눌러/,
  /가입\s*전|결제\s*전|구매\s*전|신청\s*전|해지/,
  /어디(?:부터|를)?/,
  /\?/,
];
const generatedOutlineBlogPattern =
  /(?:이\s*글에서는|이번\s*글에서는).{0,60}(?:알아봅니다|살펴봅니다|정리합니다)|(?:요약하면|정리하면)\s*다음과\s*같습니다|다음과\s*같습니다[:.]|완벽한\s*(?:가이드|정리)|필수\s*(?:가이드|체크리스트)/i;
const pastedInformationCaveatPattern =
  /정보\s*글은\s*가격,\s*할인율,\s*제품\s*라인업|숫자는\s*출발점이고\s*마지막\s*확인은\s*늘\s*공식\s*페이지/i;
const internalMakerExcusePattern =
  /사용자가\s*알\s*바\s*아닌\s*내부|내부\s*제작자의?\s*다짐|제작자\s*내부\s*사정|이\s*게임은\s*언젠가\s*접습니다|실험장이라서\s*대충/i;
const directArcadeControlPattern = /마우스|터치|드래그|클릭|키보드|방향키|WASD|Space|Enter|숫자키/i;

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
        const key = line.slice(0, separatorIndex).trim();
        const value = line.slice(separatorIndex + 1).trim().replace(/^"|"$/g, "");
        return [key, value];
      }),
  );
}

function bodyFromMdx(source) {
  return source.replace(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n)?/, "").trim();
}

function markdownLinkCount(value) {
  return Array.from(value.matchAll(/\[[^\]]+\]\(https?:\/\/[^)]+\)/g)).length;
}

function sectionHeadings(value) {
  return Array.from(value.matchAll(/^##\s+(.+)$/gm)).map((match) => match[1].trim());
}

function informationReaderIntentScore(value) {
  return infoReaderIntentPatterns.filter((pattern) => pattern.test(value)).length;
}

function dateDaysBetween(startDate, endDate) {
  const start = new Date(`${startDate}T00:00:00+09:00`);
  const end = new Date(`${endDate}T00:00:00+09:00`);
  return Math.round((end.getTime() - start.getTime()) / 86_400_000);
}

function normalizedTextLength(value) {
  return (value ?? "").replace(/\s+/g, " ").trim().length;
}

function listFiles(dir, extension) {
  return fs.readdirSync(dir).filter((file) => file.endsWith(extension)).sort();
}

function scanFiles(dir, predicate) {
  const matches = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      matches.push(...scanFiles(fullPath, predicate));
      continue;
    }
    if (predicate(fullPath)) matches.push(fullPath);
  }
  return matches;
}

const blogEntries = listFiles(blogDir, ".mdx").map((file) => {
  const filePath = path.join(blogDir, file);
  const source = read(filePath);
  const frontmatter = parseFrontmatter(source);
  const body = bodyFromMdx(source);

  return {
    file,
    source,
    body,
    bodyChars: body.replace(/\s+/g, " ").length,
    slug: frontmatter.slug,
    title: frontmatter.title,
    description: frontmatter.description,
    date: frontmatter.date,
    updatedAt: frontmatter.updatedAt,
    category: frontmatter.category,
    relatedPlaySlugs: frontmatter.relatedPlay ? frontmatter.relatedPlay.split(",").map((item) => item.trim()).filter(Boolean) : [],
  };
});
const playEntries = listFiles(playDir, ".json").map((file) => ({
  file,
  ...JSON.parse(read(path.join(playDir, file))),
}));
failures.push(...validatePlayPlanningBriefs(playEntries));
const blogBySlug = new Map(blogEntries.map((entry) => [entry.slug, entry]));
const playBySlug = new Map(playEntries.map((entry) => [entry.slug, entry]));
const categorySource = read(blogCategoryPath);
const categoryDefinitions = Array.from(categorySource.matchAll(/slug:\s+"([^"]+)"[\s\S]*?label:\s+"([^"]+)"[\s\S]*?description:\s+"([^"]+)"/g)).map(
  (match) => ({
    slug: match[1],
    label: match[2],
    description: match[3],
  }),
);
const categoryByLabel = new Map(categoryDefinitions.map((category) => [category.label, category]));

if (blogEntries.length < 32) failures.push(`expected at least 32 Blog posts for the expanded MVP, found ${blogEntries.length}`);
if (playEntries.length < 5) failures.push(`expected at least 5 Play entries, found ${playEntries.length}`);

for (const slug of requiredBlogSlugs) {
  if (!blogBySlug.has(slug)) failures.push(`missing required MVP Blog post: ${slug}`);
}
for (const slug of requiredPlaySlugs) {
  if (!playBySlug.has(slug)) failures.push(`missing required MVP Play entry: ${slug}`);
}
for (const type of requiredPlayTypes) {
  if (!playEntries.some((entry) => entry.type === type)) failures.push(`missing Play engine content type: ${type}`);
}

for (const category of requiredCategories) {
  const count = blogEntries.filter((entry) => entry.category === category).length;
  const categoryDefinition = categoryByLabel.get(category);
  if (count < 2) failures.push(`Blog category "${category}" should have at least 2 posts, found ${count}`);
  if (!categoryDefinition) {
    failures.push(`Blog category definition missing label: ${category}`);
  } else if (normalizedTextLength(categoryDefinition.description) < minCategoryDescriptionLength) {
    failures.push(
      `Blog category "${category}" description is too short for submitted URL metadata: ${normalizedTextLength(categoryDefinition.description)} chars`,
    );
  } else if (generatedOutlineBlogPattern.test(categoryDefinition.description) || pastedInformationCaveatPattern.test(categoryDefinition.description)) {
    failures.push(`Blog category "${category}" description should not use generated-outline prose or the overbearing information caveat block`);
  }
}
const dates = blogEntries.map((entry) => entry.date).filter(Boolean).sort();
if (dates.length !== blogEntries.length) failures.push("all Blog posts must have a date");
if (dates.length && dateDaysBetween(dates[0], dates[dates.length - 1]) < 90) {
  failures.push(`Blog dates should look gradually published across several months, found ${dates[0]} to ${dates[dates.length - 1]}`);
}
if (dates.length && dates[0] > "2026-01-15") {
  failures.push(`Blog dates should start near the beginning of 2026, found ${dates[0]}`);
}
const blogDateCounts = dates.reduce((counts, date) => counts.set(date, (counts.get(date) ?? 0) + 1), new Map());
const crowdedBlogDates = Array.from(blogDateCounts.entries()).filter(([, count]) => count > 3);
if (crowdedBlogDates.length) {
  failures.push(
    `Blog posts should not look dumped on one day; crowded dates: ${crowdedBlogDates.map(([date, count]) => `${date}=${count}`).join(", ")}`,
  );
}
const blogMonthCounts = dates.reduce((counts, date) => counts.set(date.slice(0, 7), (counts.get(date.slice(0, 7)) ?? 0) + 1), new Map());
const crowdedBlogMonths = Array.from(blogMonthCounts.entries()).filter(([, count]) => count > Math.max(24, Math.ceil(blogEntries.length * 0.24)));
if (blogMonthCounts.size < 6 || crowdedBlogMonths.length) {
  failures.push(
    `Blog dates should be spread across the first half of 2026; month counts: ${Array.from(blogMonthCounts.entries())
      .map(([month, count]) => `${month}=${count}`)
      .join(", ")}`,
  );
}

for (const entry of blogEntries) {
  const publicBlogCopy = [entry.title, entry.description, entry.body].filter(Boolean).join("\n");
  if (!entry.slug || !entry.title || !entry.description || !entry.category) failures.push(`${entry.file} is missing required Blog frontmatter`);
  if (entry.updatedAt && !/^\d{4}-\d{2}-\d{2}$/.test(entry.updatedAt)) failures.push(`${entry.slug ?? entry.file} has invalid Blog updatedAt: ${entry.updatedAt}`);
  if (entry.updatedAt && entry.date && entry.updatedAt < entry.date) failures.push(`${entry.slug ?? entry.file} updatedAt should not be earlier than date`);
  if (entry.description && normalizedTextLength(entry.description) < minBlogDescriptionLength) {
    failures.push(`${entry.slug ?? entry.file} description is too short for submitted URL metadata: ${normalizedTextLength(entry.description)} chars`);
  }
  if (entry.bodyChars < 450) failures.push(`${entry.slug ?? entry.file} body is too thin for MVP content: ${entry.bodyChars} chars`);
  if (!/^#{2}\s+/m.test(entry.body)) failures.push(`${entry.slug ?? entry.file} should include at least one section heading`);
  if (generatedOutlineBlogPattern.test(publicBlogCopy)) {
    failures.push(`${entry.slug ?? entry.file} should avoid generated-outline blog scaffolding and sound like a person wrote it`);
  }
  if (pastedInformationCaveatPattern.test(publicBlogCopy)) {
    failures.push(`${entry.slug ?? entry.file} should not reintroduce the overbearing information-category caveat block`);
  }
  if (internalMakerExcusePattern.test(publicBlogCopy)) {
    failures.push(`${entry.slug ?? entry.file} should avoid internal maker excuses that users do not need`);
  }
  if (entry.relatedPlaySlugs.length && publicActionLimitPattern.test([entry.title, entry.description, entry.body].filter(Boolean).join("\n"))) {
    failures.push(`${entry.slug ?? entry.file} should not describe related Play with action-count or move-limit wording`);
  }
  if (entry.category === "정보") {
    if (/^\d{4}년\s+\d{1,2}월(?:\s+\d{1,2}일)?\s+/.test(entry.title ?? "")) {
      failures.push(`${entry.slug ?? entry.file} information title should not start with a long date prefix; keep 기준일 in the body instead`);
    }
    if (/^\d{4}년\s+\d{1,2}월(?:\s+\d{1,2}일)?\s+/.test(entry.description ?? "")) {
      failures.push(`${entry.slug ?? entry.file} information description should not start with a long date prefix; keep 기준일 in the body instead`);
    }
    if (!/기준일은\s+\d{4}-\d{2}-\d{2}/.test(entry.body)) {
      failures.push(`${entry.slug ?? entry.file} information posts should state a concrete 기준일`);
    }
    const comparisonHeadingIndex = entry.body.search(/^##\s+한눈에 비교/m);
    if (comparisonHeadingIndex === -1 || !/^\|.+\|\s*\n\|[-:|\s]+\|/m.test(entry.body)) {
      failures.push(`${entry.slug ?? entry.file} information posts should include a near-top comparison table`);
    }
    if (comparisonHeadingIndex > 1600) {
      failures.push(`${entry.slug ?? entry.file} information comparison table should appear before long prose, not after the article is mostly done`);
    }
    const comparisonAndAfter = comparisonHeadingIndex >= 0 ? entry.body.slice(comparisonHeadingIndex) : entry.body;
    const followUpSections = sectionHeadings(comparisonAndAfter).filter((heading) => heading !== "한눈에 비교");
    if (followUpSections.length < 2) {
      failures.push(`${entry.slug ?? entry.file} information posts should expand after the table with reader-question or decision-flow sections`);
    }
    if (informationReaderIntentScore(comparisonAndAfter) < 2) {
      failures.push(`${entry.slug ?? entry.file} information posts should tune prose around reader questions, confusing points, and pre-purchase/pre-signup checks`);
    }
    if (!entry.body.includes("확인한 곳") || markdownLinkCount(entry.body) < 2) {
      failures.push(`${entry.slug ?? entry.file} information posts should name original confirmation paths, not only summarize a table`);
    }
  }
  for (const playSlug of entry.relatedPlaySlugs) {
    if (!playBySlug.has(playSlug)) failures.push(`${entry.slug ?? entry.file} references missing related Play: ${playSlug}`);
  }
}

const standaloneBlogs = blogEntries.filter((entry) => entry.relatedPlaySlugs.length === 0);
if (standaloneBlogs.length < 8) {
  failures.push(`standalone Blog posts should remain allowed and visible, found only ${standaloneBlogs.length}`);
}
const arcadeEntries = playEntries.filter((entry) => entry.type === "arcade-game");
if (arcadeEntries.length < Math.ceil(playEntries.length * 0.5)) {
  failures.push(`Play roadmap should prioritize direct canvas/JS arcade games, found ${arcadeEntries.length}/${playEntries.length}`);
}

for (const entry of playEntries) {
  if (!entry.slug || !entry.title || !entry.description || !entry.type || !entry.durationLabel || !entry.updatedAt || !entry.shareText) {
    failures.push(`${entry.file} is missing required Play metadata`);
  }
  const publicPlayCopy = [
    entry.title,
    entry.description,
    entry.durationLabel,
    entry.shareText,
    entry.arcade?.goal,
    entry.arcade?.controls,
    ...(entry.endings ?? []).flatMap((ending) => [ending.title, ending.description]),
  ]
    .filter(Boolean)
    .join("\n");
  if (publicActionLimitPattern.test(publicPlayCopy) || publicPlayCountTonePattern.test(publicPlayCopy)) {
    failures.push(`${entry.slug ?? entry.file} should not expose action-count, move-limit, or count-toned wording in public Play copy`);
  }
  if (entry.arcade?.variant === "sum-box" && /타이머/.test(publicPlayCopy)) {
    failures.push(`${entry.slug ?? entry.file} sum-box public copy should frame play as 1분 동안, not timer wording`);
  }
  if (entry.slug === "lucky-scratch") {
    if (entry.durationLabel !== "계속") failures.push("lucky-scratch should remain an endless lottery loop");
    if (lotteryLimitScorePattern.test(publicPlayCopy)) {
      failures.push("lucky-scratch public copy should avoid scoreboards, timers, or move-limit wording");
    }
    if (!lotteryStagePattern.test(publicPlayCopy)) {
      failures.push("lucky-scratch public copy should explain the staged lottery loop from paper through jackpot");
    }
  }
  if (entry.slug === "password-lock" && !/추천\s*번호로\s*바꿔\s*확인/.test(publicPlayCopy)) {
    failures.push("password-lock should explain that invalid keyboard confirmation applies a recommended candidate");
  }
  if (entry.description && normalizedTextLength(entry.description) < minPlayDescriptionLength) {
    failures.push(`${entry.slug ?? entry.file} description is too short for submitted URL metadata: ${normalizedTextLength(entry.description)} chars`);
  }
  if (!entry.relatedBlogSlugs?.length) failures.push(`${entry.slug ?? entry.file} should link to related Blog posts`);
  if (!entry.relatedPlaySlugs?.length) failures.push(`${entry.slug ?? entry.file} should recommend other Play entries`);
  for (const blogSlug of entry.relatedBlogSlugs ?? []) {
    if (!blogBySlug.has(blogSlug)) failures.push(`${entry.slug ?? entry.file} references missing Blog: ${blogSlug}`);
  }
  for (const playSlug of entry.relatedPlaySlugs ?? []) {
    if (!playBySlug.has(playSlug)) failures.push(`${entry.slug ?? entry.file} references missing related Play: ${playSlug}`);
  }
  if (entry.relatedPlaySlugs?.includes(entry.slug)) failures.push(`${entry.slug} should not recommend itself as related Play`);
}

const officeSurvival = playBySlug.get("office-survival");
if (officeSurvival?.type !== "micro-sim") {
  failures.push("office-survival must remain a micro-sim");
} else {
  if (officeSurvival.turns.length < 8 || officeSurvival.turns.length > 12) failures.push(`office-survival should have 8-12 turns, found ${officeSurvival.turns.length}`);
  if (officeSurvival.endings.length < 6 || officeSurvival.endings.length > 10) failures.push(`office-survival should have 6-10 endings, found ${officeSurvival.endings.length}`);
  for (const turn of officeSurvival.turns) {
    if (turn.choices.length < 2 || turn.choices.length > 4) failures.push(`office-survival turn ${turn.id} should have 2-4 choices`);
  }
}

for (const entry of playEntries.filter((item) => item.type === "tap-game")) {
  if (entry.targets.length < 8) failures.push(`${entry.slug} should have at least 8 tap targets`);
  if (!entry.targets.some((target) => target.kind === "target")) failures.push(`${entry.slug} needs target tap items`);
  if (!entry.targets.some((target) => target.kind === "decoy")) failures.push(`${entry.slug} needs decoy tap items`);
}
for (const entry of playEntries.filter((item) => item.type === "sort-match-game")) {
  if (entry.categories.length < 2) failures.push(`${entry.slug} should have at least 2 sort categories`);
  if (entry.items.length < 8) failures.push(`${entry.slug} should have at least 8 sortable items`);
}
for (const entry of playEntries.filter((item) => item.type === "arcade-game")) {
  const endlessArcadeVariant =
    entry.arcade?.variant === "lottery" || entry.arcade?.variant === "lottery-economy" || entry.arcade?.variant === "growth";
  if (!entry.arcade?.variant) failures.push(`${entry.slug} should declare an arcade variant`);
  if (!entry.arcade?.goal || normalizedTextLength(entry.arcade.goal) < 20) failures.push(`${entry.slug} should explain the arcade goal`);
  if (!entry.arcade?.controls || normalizedTextLength(entry.arcade.controls) < 20) failures.push(`${entry.slug} should explain keyboard controls`);
  if (!directArcadeControlPattern.test(entry.arcade?.controls ?? "")) {
    failures.push(`${entry.slug} should describe direct mouse/touch/keyboard control, not only a quiz-like choice loop`);
  }
  if (!endlessArcadeVariant && entry.durationLabel !== "1분") {
    failures.push(`${entry.slug} arcade games should use a 1분 run unless they are a clearly endless loop`);
  }
  if (endlessArcadeVariant && entry.durationLabel !== "계속") {
    failures.push(`${entry.slug} ${entry.arcade.variant}-style arcade games should be endless 계속 loops`);
  }
  if (!entry.arcade?.goodLabels?.length || !entry.arcade?.badLabels?.length) failures.push(`${entry.slug} should provide good and bad arcade labels`);
  if (!entry.endings?.length) failures.push(`${entry.slug} should provide arcade endings`);
}

for (const blog of blogEntries) {
  for (const playSlug of blog.relatedPlaySlugs) {
    const play = playBySlug.get(playSlug);
    if (play && !play.relatedBlogSlugs?.includes(blog.slug)) {
      failures.push(`${play.slug} should link back to Blog post ${blog.slug}`);
    }
  }
}

const playDetail = read(playDetailPath);
const blogDetail = read(blogDetailPath);
const resultLinks = read(playResultLinksPath);
const contentSearch = read(contentSearchPath);
const contentStructuredData = read(contentStructuredDataPath);
const discovery = read(discoveryPath);
const sitemap = read(sitemapPath);
const feed = read(feedPath);
const llms = read(llmsPath);
const opensearch = read(opensearchPath);
const homePage = read(homePagePath);
const playEngineSource = scanFiles(playEngineDir, (filePath) => filePath.endsWith(".tsx")).map(read).join("\n");

if (!homePage.includes("{playContents.map((content")) {
  failures.push("home Featured Play should render every current Play entry instead of capping the list");
}
if (homePage.includes("playContents.slice(0, 5).map")) {
  failures.push("home Featured Play should not be capped at the original five-entry MVP lineup");
}
for (const fragment of ["SurvivalPlayEngine", "TapGameEngine", "SortMatchEngine", "ArcadeGameEngine", "relatedBlogLinks", "relatedPlayLinks"]) {
  if (!playDetail.includes(fragment)) failures.push(`Play detail route missing ${fragment}`);
}
for (const fragment of ["data-play-result-links", "data-play-related-play", "data-play-related-blog"]) {
  if (!resultLinks.includes(fragment)) failures.push(`Play result links missing ${fragment}`);
}
for (const fragment of ["data-blog-related-play-bottom", "relatedPlays.map"]) {
  if (!blogDetail.includes(fragment)) failures.push(`Blog detail route missing ${fragment}`);
}
for (const fragment of ["getBlogPosts", "getPlayContents", "getLocalizedTools", "scoreBlogPost", "scorePlayContent", "scoreTool"]) {
  if (!contentSearch.includes(fragment)) failures.push(`global content search missing ${fragment}`);
}
for (const fragment of ["BlogPosting", "Game", "SearchResultsPage", "CollectionPage", "BreadcrumbList", "keywords", "about", "subjectOf"]) {
  if (!contentStructuredData.includes(fragment)) failures.push(`Blog + Play structured data missing ${fragment}`);
}
for (const fragment of ["blogPostKeywords", "playContentKeywords", "blogIndexKeywords", "playIndexKeywords", "homeContentKeywords"]) {
  if (!discovery.includes(fragment)) failures.push(`content discovery helper missing ${fragment}`);
}
for (const fragment of ["getBlogPosts", "getPlayContents", "sitemapSubmissionLocales", "/search", "/tools", "blogCategoryDefinitions"]) {
  if (!sitemap.includes(fragment)) failures.push(`reduced sitemap source missing ${fragment}`);
}
for (const fragment of ["rssFeedXml", "atomFeedXml", "jsonFeed", "tags", "<category>", "blogPostKeywords", "playContentKeywords"]) {
  if (!feed.includes(fragment)) failures.push(`Blog + Play feed source missing ${fragment}`);
}
for (const fragment of ["## Play", "## Blog", "## Blog Categories", "## Discovery", "OpenSearch descriptor"]) {
  if (!llms.includes(fragment)) failures.push(`llms.txt source missing ${fragment}`);
}
if (!opensearch.includes("/search?q={searchTerms}")) failures.push("OpenSearch should point to global /search");
if (/fetch\(|\/api\//.test(playEngineSource)) failures.push("Play engines should remain static/client-only and not call API routes");
if (playEngineCountTonePattern.test(playEngineSource)) {
  failures.push("Play engines should describe state, score, time, and flow instead of count-toned action or remaining-candidate wording");
}

const publicSources = scanFiles(appSourceDir, (filePath) => /\.(tsx?|jsx?)$/.test(filePath));
for (const filePath of publicSources) {
  const source = read(filePath);
  for (const pattern of disallowedSupportLinkPatterns) {
    if (pattern.test(source)) failures.push(`${path.relative(root, filePath)} contains a first-pass donation or coffee support link`);
  }
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(
  [
    `Blog + Play MVP smoke passed for ${blogEntries.length} Blog posts, ${standaloneBlogs.length} standalone posts, ${playEntries.length} Play entries.`,
    `Categories: ${requiredCategories.map((category) => `${category}=${blogEntries.filter((entry) => entry.category === category).length}`).join(", ")}`,
    `Required Play: ${requiredPlaySlugs.join(", ")}`,
  ].join("\n"),
);
