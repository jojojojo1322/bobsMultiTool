import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const registryPath = path.join(root, "apps/main/src/features/tools/registry.ts");
const guideRegistryPath = path.join(root, "apps/main/src/features/guides/registry.ts");
const sitemapSourcePath = path.join(root, "apps/main/src/features/seo/sitemaps.ts");
const blogContentDir = path.join(root, "content/blog");
const playContentDir = path.join(root, "content/play");
const sitemapIndexRoutePath = path.join(root, "apps/main/src/app/sitemap.xml/route.ts");
const localizedSitemapRoutePath = path.join(root, "apps/main/src/app/sitemaps/[locale]/route.ts");
const searchPagePath = path.join(root, "apps/main/src/app/search/page.tsx");
const blogIndexPath = path.join(root, "apps/main/src/app/blog/page.tsx");
const blogCategoryDefinitionPath = path.join(root, "apps/main/src/features/content/blog-categories.ts");
const blogCategoryPagePath = path.join(root, "apps/main/src/app/blog/category/[category]/page.tsx");
const blogDetailPath = path.join(root, "apps/main/src/app/blog/[slug]/page.tsx");
const playIndexPath = path.join(root, "apps/main/src/app/play/page.tsx");
const playDetailPath = path.join(root, "apps/main/src/app/play/[slug]/page.tsx");
const playResultLinksPath = path.join(root, "apps/main/src/features/play/result-links.tsx");
const toolsIndexPath = path.join(root, "apps/main/src/app/tools/page.tsx");
const localizedToolsIndexPath = path.join(root, "apps/main/src/app/[locale]/tools/page.tsx");
const toolDetailPath = path.join(root, "apps/main/src/app/tools/[slug]/page.tsx");
const localizedToolDetailPath = path.join(root, "apps/main/src/app/[locale]/tools/[slug]/page.tsx");
const toolStructuredDataPath = path.join(root, "apps/main/src/features/tools/structured-data.ts");
const contentStructuredDataPath = path.join(root, "apps/main/src/features/content/structured-data.ts");
const i18nConfigPath = path.join(root, "apps/main/src/features/i18n/config.ts");
const registry = fs.readFileSync(registryPath, "utf8");
const guideRegistry = fs.readFileSync(guideRegistryPath, "utf8");
const sitemapSource = fs.readFileSync(sitemapSourcePath, "utf8");
const i18nConfig = fs.readFileSync(i18nConfigPath, "utf8");
const searchPage = fs.readFileSync(searchPagePath, "utf8");
const blogIndex = fs.readFileSync(blogIndexPath, "utf8");
const blogCategoryDefinition = fs.readFileSync(blogCategoryDefinitionPath, "utf8");
const blogCategoryPage = fs.readFileSync(blogCategoryPagePath, "utf8");
const blogDetail = fs.readFileSync(blogDetailPath, "utf8");
const playIndex = fs.readFileSync(playIndexPath, "utf8");
const playDetail = fs.readFileSync(playDetailPath, "utf8");
const playResultLinks = fs.readFileSync(playResultLinksPath, "utf8");
const toolDetail = fs.readFileSync(toolDetailPath, "utf8");
const localizedToolDetail = fs.readFileSync(localizedToolDetailPath, "utf8");
const toolStructuredData = fs.readFileSync(toolStructuredDataPath, "utf8");
const contentStructuredData = fs.readFileSync(contentStructuredDataPath, "utf8");
const failures = [];
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
const requiredPlaySlugs = [
  "office-survival",
  "prompt-cleanup",
  "meeting-escape",
  "priority-sorter",
  "bug-clicker",
];
const requiredBlogCategories = ["일기", "요즘 관심사", "AI", "개발", "운영 기록", "정보"];
const priorityDetailSlugs = [
  "regex-tester",
  "json-formatter",
  "json-escape-unescape",
  "yaml-validator",
  "env-parser-validator",
  "jwt-decoder",
  "base64-tool",
  "cron-generator",
  "uuid-generator",
  "hash-generator",
  "password-generator",
  "qr-code-generator",
  "dns-lookup",
  "http-status-checker",
  "color-converter",
  "sql-formatter",
  "css-formatter",
  "javascript-formatter",
];

const toolBlocks = Array.from(registry.matchAll(/slug:\s+"([^"]+)"[\s\S]*?relatedTools:\s+\[([^\]]*)\]/g));
const slugs = toolBlocks.map((match) => match[1]);
const uniqueSlugs = new Set(slugs);
const localesMatch = i18nConfig.match(/export const locales = \[([\s\S]*?)\] as const/);
const locales = localesMatch ? Array.from(localesMatch[1].matchAll(/"([^"]+)"/g)).map((match) => match[1]) : [];

function toolSourceFor(slug) {
  const start = registry.indexOf(`slug: "${slug}"`);
  if (start === -1) return "";
  const nextTool = registry.indexOf("\n  tool({", start + 1);
  const nextObject = registry.indexOf("\n  {\n    slug:", start + 1);
  const candidates = [nextTool, nextObject].filter((index) => index > start).sort((a, b) => a - b);
  return registry.slice(start, candidates[0] ?? registry.indexOf("\n];", start));
}

function inputExampleCount(source) {
  const inputStart = source.indexOf("inputExamples:");
  if (inputStart === -1) return 0;
  const nextFieldCandidates = ["\n    contentCluster:", "\n    supportedLocales:", "\n    sample:"]
    .map((field) => source.indexOf(field, inputStart))
    .filter((index) => index > inputStart)
    .sort((a, b) => a - b);
  const inputSource = source.slice(inputStart, nextFieldCandidates[0] ?? source.length);
  const rawTemplateCount = (inputSource.match(/String\.raw`/g) ?? []).length;
  const quotedCount = (inputSource.match(/"(?:(?:\\")|[^"])*"/g) ?? []).filter((value) => value !== '"inputExamples"').length;
  return rawTemplateCount + quotedCount;
}

function quotedLiteralCount(source) {
  return (source.match(/"(?:(?:\\")|[^"])*"/g) ?? []).length;
}

function priorityDemandDetailCounts(slug) {
  const priorityStart = registry.indexOf("const priorityDemandDetails");
  const priorityEnd = registry.indexOf("\n};", priorityStart);
  const prioritySource = registry.slice(priorityStart, priorityEnd);
  const detailMatch = prioritySource.match(new RegExp(`"${slug}": demandDetails\\(\\s*\\[([\\s\\S]*?)\\]\\s*,\\s*\\[([\\s\\S]*?)\\]`, "m"));
  if (!detailMatch) return { failureCases: 0, preCopyChecklist: 0 };
  return {
    failureCases: quotedLiteralCount(detailMatch[1]),
    preCopyChecklist: quotedLiteralCount(detailMatch[2]),
  };
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

const blogEntries = fs
  .readdirSync(blogContentDir)
  .filter((file) => file.endsWith(".mdx") || file.endsWith(".md"))
  .map((file) => {
    const frontmatter = parseFrontmatter(fs.readFileSync(path.join(blogContentDir, file), "utf8"));
    return {
      file,
      slug: frontmatter.slug,
      title: frontmatter.title,
      description: frontmatter.description,
      date: frontmatter.date,
      category: frontmatter.category,
      indexPolicy: frontmatter.indexPolicy,
      relatedPlaySlugs: frontmatter.relatedPlay ? frontmatter.relatedPlay.split(",").map((item) => item.trim()).filter(Boolean) : [],
    };
  });
const playEntries = fs
  .readdirSync(playContentDir)
  .filter((file) => file.endsWith(".json"))
  .map((file) => ({ file, ...JSON.parse(fs.readFileSync(path.join(playContentDir, file), "utf8")) }));
const blogContentSlugs = new Set(blogEntries.map((entry) => entry.slug).filter(Boolean));
const playContentSlugs = new Set(playEntries.map((entry) => entry.slug).filter(Boolean));
const indexableBlogEntries = blogEntries.filter((entry) => entry.indexPolicy === "index");

if (slugs.length < 40) failures.push(`expected at least 40 tools, found ${slugs.length}`);
if (uniqueSlugs.size !== slugs.length) failures.push("duplicate tool slugs detected");
if (locales.length < 14) failures.push(`expected at least 14 locales, found ${locales.length}`);
if (blogEntries.length < 24) failures.push(`Blog + Play MVP needs at least 24 blog posts after the category expansion, found ${blogEntries.length}`);
if (playEntries.length < 5) failures.push(`Blog + Play MVP needs at least 5 Play entries, found ${playEntries.length}`);
for (const slug of requiredBlogSlugs) {
  if (!blogContentSlugs.has(slug)) failures.push(`required Blog MVP post missing: ${slug}`);
}
for (const slug of requiredPlaySlugs) {
  if (!playContentSlugs.has(slug)) failures.push(`required Play MVP content missing: ${slug}`);
}
for (const type of ["micro-sim", "tap-game", "sort-match-game"]) {
  if (!playEntries.some((entry) => entry.type === type)) failures.push(`Play MVP missing ${type} engine content`);
}
for (const category of requiredBlogCategories) {
  const categoryPostCount = blogEntries.filter((entry) => entry.category === category).length;
  if (!categoryPostCount) failures.push(`Blog category missing from content: ${category}`);
  if (categoryPostCount < 2) failures.push(`Blog category should have at least two posts: ${category}`);
  if (!blogCategoryDefinition.includes(`label: "${category}"`)) failures.push(`Blog category registry missing label: ${category}`);
}
for (const slug of ["diary", "interests", "ai", "development", "operations", "info"]) {
  if (!blogCategoryDefinition.includes(`slug: "${slug}"`)) failures.push(`Blog category registry missing slug: ${slug}`);
}
for (const fragment of ["data-blog-categories", "data-blog-category", "글만 남긴 기록입니다", "blogCategoryPath(group.slug)"]) {
  if (!blogIndex.includes(fragment)) failures.push(`/blog index missing category or standalone Blog fragment: ${fragment}`);
}
for (const fragment of ["generateStaticParams", "blogCategoryStructuredData(", "data-blog-category-page", "getBlogCategoryBySlug", "notFound()"]) {
  if (!blogCategoryPage.includes(fragment)) failures.push(`Blog category page missing ${fragment}`);
}
for (const entry of blogEntries) {
  if (!entry.slug || !entry.title || !entry.description || !entry.date || !entry.category) failures.push(`${entry.file} missing required blog frontmatter`);
  if (entry.date && !/^\d{4}-\d{2}-\d{2}$/.test(entry.date)) failures.push(`${entry.slug ?? entry.file} has invalid Blog date: ${entry.date}`);
  for (const playSlug of entry.relatedPlaySlugs) {
    if (!playContentSlugs.has(playSlug)) failures.push(`${entry.slug ?? entry.file} references missing Play content: ${playSlug}`);
  }
}
const standaloneBlogEntries = blogEntries.filter((entry) => !entry.relatedPlaySlugs.length);
if (standaloneBlogEntries.length < 3) {
  failures.push(`Blog should keep standalone writing that is not forced into Play links, found ${standaloneBlogEntries.length}`);
}
for (const entry of playEntries) {
  if (!entry.slug || !entry.title || !entry.description || !entry.type || !entry.updatedAt) failures.push(`${entry.file} missing required Play fields`);
  if (entry.updatedAt && !/^\d{4}-\d{2}-\d{2}$/.test(entry.updatedAt)) failures.push(`${entry.slug ?? entry.file} has invalid Play updatedAt: ${entry.updatedAt}`);
  if (!entry.relatedBlogSlugs?.length) failures.push(`${entry.slug ?? entry.file} must link to at least one related Blog`);
  if (!entry.relatedPlaySlugs?.length) failures.push(`${entry.slug ?? entry.file} must recommend at least one related Play`);
  for (const blogSlug of entry.relatedBlogSlugs ?? []) {
    if (!blogContentSlugs.has(blogSlug)) failures.push(`${entry.slug ?? entry.file} references missing Blog post: ${blogSlug}`);
  }
  for (const playSlug of entry.relatedPlaySlugs ?? []) {
    if (!playContentSlugs.has(playSlug)) failures.push(`${entry.slug ?? entry.file} references missing related Play: ${playSlug}`);
  }
}
for (const fragment of ["relatedBlogLinks", "relatedPlayLinks", "getBlogPostBySlug", "getPlayContentBySlug"]) {
  if (!playDetail.includes(fragment)) failures.push(`Play detail page missing result-link data flow: ${fragment}`);
}
for (const fragment of ["data-play-result-links", "data-play-related-play", "data-play-related-blog", "relatedPlayLinks.slice", "relatedBlogLinks.slice"]) {
  if (!playResultLinks.includes(fragment)) failures.push(`Play result links component missing ${fragment}`);
}
for (const entry of indexableBlogEntries) {
  for (const playSlug of entry.relatedPlaySlugs) {
    const playEntry = playEntries.find((play) => play.slug === playSlug);
    if (playEntry && !playEntry.relatedBlogSlugs?.includes(entry.slug)) {
      failures.push(`${playSlug} must link back to related Blog post: ${entry.slug}`);
    }
  }
}
for (const fragment of ["data-blog-related-play-bottom", "relatedPlays.map", "/play/${play.slug}"]) {
  if (!blogDetail.includes(fragment)) failures.push(`Blog detail page missing related Play bottom flow fragment: ${fragment}`);
}
for (const [source, name, fragment] of [
  [searchPage, "/search", "searchPageStructuredData("],
  [blogIndex, "/blog index", "blogIndexStructuredData("],
  [playIndex, "/play index", "playIndexStructuredData("],
  [blogDetail, "Blog detail", "blogPostStructuredData("],
  [playDetail, "Play detail", "playDetailStructuredData("],
]) {
  if (!source.includes(fragment)) failures.push(`${name} must render shared Blog + Play structured data: ${fragment}`);
}
for (const fragment of [
  "blogIndexStructuredData",
  "blogCategoryStructuredData",
  "playIndexStructuredData",
  "blogPostStructuredData",
  "playDetailStructuredData",
  "searchPageStructuredData",
  "SearchResultsPage",
  "CollectionPage",
  "ItemList",
  "BlogPosting",
  "Game",
  "BreadcrumbList",
  "mainEntity",
  "numberOfItems",
  "isAccessibleForFree",
]) {
  if (!contentStructuredData.includes(fragment)) failures.push(`Blog + Play structured data missing ${fragment}`);
}
if (contentStructuredData.includes("aggregateRating") || contentStructuredData.includes("reviewRating")) {
  failures.push("Blog + Play structured data must not include fabricated rating or review schema");
}
if (fs.existsSync(path.join(root, "apps/main/public/sitemap.xml"))) failures.push("static public sitemap.xml must not shadow dynamic sitemap index");
for (const legacyPath of [
  "packages/ui",
  "apps/cron-generator",
  "apps/iframe-viewer",
  "apps/lorem-generator",
  "apps/meta-generator",
  "apps/regax",
  "apps/main/src/app/iframe-viewer",
  "turbo.json",
]) {
  if (fs.existsSync(path.join(root, legacyPath))) failures.push(`${legacyPath} should not be restored`);
}
if (!fs.existsSync(sitemapIndexRoutePath)) failures.push("sitemap index route missing");
if (!fs.existsSync(localizedSitemapRoutePath)) failures.push("localized sitemap route missing");
if (!fs.existsSync(searchPagePath)) failures.push("content search page missing");
if (!fs.existsSync(toolsIndexPath) || !fs.readFileSync(toolsIndexPath, "utf8").includes("ToolDirectory")) failures.push("/tools index directory page missing");
if (!fs.existsSync(localizedToolsIndexPath) || !fs.readFileSync(localizedToolsIndexPath, "utf8").includes("ToolDirectory")) failures.push("localized tools index directory page missing");
if (!fs.readFileSync(toolsIndexPath, "utf8").includes("toolDirectoryStructuredData(")) failures.push("/tools index must render shared directory structured data");
if (!fs.readFileSync(localizedToolsIndexPath, "utf8").includes("toolDirectoryStructuredData(")) failures.push("localized tools index must render shared directory structured data");
for (const [source, name] of [
  [toolDetail, "default tool detail"],
  [localizedToolDetail, "localized tool detail"],
]) {
  if (!source.includes("toolStructuredData(")) failures.push(`${name} must render shared tool structured data`);
}
for (const fragment of ["toolDirectoryStructuredData", "CollectionPage", "ItemList", "SearchAction", "numberOfItems"]) {
  if (!toolStructuredData.includes(fragment)) failures.push(`tool directory structured data missing ${fragment}`);
}
for (const fragment of ["SoftwareApplication", "FAQPage", "BreadcrumbList", "mainEntity", "itemListElement", "isAccessibleForFree", "featureList"]) {
  if (!toolStructuredData.includes(fragment)) failures.push(`tool structured data missing ${fragment}`);
}
if (toolStructuredData.includes("aggregateRating") || toolStructuredData.includes("reviewRating")) {
  failures.push("tool structured data must not include fabricated rating or review schema");
}
for (const fragment of ["priorityDemandDetails", "fallbackDemandDetails", "withDemandDetails", "failureCases", "preCopyChecklist"]) {
  if (!registry.includes(fragment)) failures.push(`registry missing demand detail support: ${fragment}`);
}
for (const slug of priorityDetailSlugs) {
  if (!registry.includes(`"${slug}": demandDetails(`)) failures.push(`${slug} missing priority demand detail override`);
  const detailCounts = priorityDemandDetailCounts(slug);
  if (detailCounts.failureCases < 3) failures.push(`${slug} should define at least three priority failure cases, found ${detailCounts.failureCases}`);
  if (detailCounts.preCopyChecklist < 3) failures.push(`${slug} should define at least three priority pre-copy checklist items, found ${detailCounts.preCopyChecklist}`);
  const source = toolSourceFor(slug);
  if (!source.includes("inputExamples:")) {
    failures.push(`${slug} must define explicit inputExamples for the quick-start panel`);
  } else if (inputExampleCount(source) < 3) {
    failures.push(`${slug} should define at least three real inputExamples, found ${inputExampleCount(source)}`);
  }
}

for (const [fullBlock, slug, relatedSource] of toolBlocks) {
  const generatedByHelper = fullBlock.includes("keywords:") && fullBlock.includes("guideSlug:");
  for (const fragment of ["seo:", "examples:", "faqs:", "guides:", "demandTier:", "searchIntents:", "aliases:", "useCases:", "inputExamples:", "contentCluster:", "monetizationTier:", "supportedLocales:", "privacyMode:", "requiresServer:"]) {
    if (!fullBlock.includes(fragment) && !generatedByHelper) failures.push(`${slug} missing ${fragment}`);
  }
  if (generatedByHelper) {
    for (const helperFragment of ["seo: seo(", "examples: examples(", "supportedLocales: allLocales", "searchIntents: keywords", "aliases", "useCases", "inputExamples", "contentCluster", "monetizationTier", "privacyMode", "requiresServer"]) {
      if (!registry.includes(helperFragment)) failures.push(`tool helper missing ${helperFragment}`);
    }
  }
  const relatedSlugs = Array.from(relatedSource.matchAll(/"([^"]+)"/g)).map((item) => item[1]);
  if (!relatedSlugs.length) failures.push(`${slug} has no related tools`);
  for (const relatedSlug of relatedSlugs) {
    if (!uniqueSlugs.has(relatedSlug)) failures.push(`${slug} references missing related tool: ${relatedSlug}`);
  }
}

for (const slug of ["css-unit-converter", "css-clamp-generator"]) {
  const block = toolBlocks.find((match) => match[1] === slug)?.[0] ?? "";
  if (!block.includes('category: "Code"')) {
    failures.push(`${slug} must stay in Code category so localized copy does not describe it as color work`);
  }
}

const guideSlugs = new Set([
  ...Array.from(registry.matchAll(/guide\("([^"]+)"/g)).map((match) => match[1]),
  ...Array.from(registry.matchAll(/guideSlug:\s+"([^"]+)"/g)).map((match) => match[1]),
]);

for (const slug of guideSlugs) {
  if (!guideRegistry.includes(`slug: "${slug}"`)) failures.push(`guide slug is not registered: ${slug}`);
}

for (const fragment of [
  "sitemapIndexXml",
  "localizedSitemapXml",
  "blogCategoryDefinitions",
  "blogCategoryPath",
  "xmlns:xhtml",
  "hreflang=\"x-default\"",
  "getIndexableBlogPosts",
  "getPlayContents",
  'path: "/"',
  'path: "/search"',
  'path: "/blog"',
  'path: "/play"',
  'path: "/tools"',
  "sitemapLocales",
  "sitemapSubmissionLocales",
]) {
  if (!sitemapSource.includes(fragment)) failures.push(`sitemap source missing ${fragment}`);
}

const reducedSitemapCountMatch = sitemapSource.match(/function basePaths\(\)[\s\S]*?\r?\n}\r?\n\r?\nfunction alternateLinks/);
if (!reducedSitemapCountMatch?.[0]?.includes("getPlayContents().map")) {
  failures.push("reduced content sitemap should include registered Play pages");
}

const packageJson = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
if (JSON.stringify(packageJson.workspaces) !== JSON.stringify(["apps/main"])) failures.push("root workspaces must stay apps/main only");
if (packageJson.devDependencies?.turbo || packageJson.scripts?.clean?.includes("turbo")) failures.push("turbo dependency/script should not be restored");

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`Registry harness passed for ${slugs.length} tools, ${guideSlugs.size} guides, ${locales.length} configured locales, and the reduced web-operations + Blog + Play sitemap policy.`);
