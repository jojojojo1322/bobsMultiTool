import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const registryPath = path.join(root, "apps/main/src/features/tools/registry.ts");
const guideRegistryPath = path.join(root, "apps/main/src/features/guides/registry.ts");
const sitemapSourcePath = path.join(root, "apps/main/src/features/seo/sitemaps.ts");
const sitemapIndexRoutePath = path.join(root, "apps/main/src/app/sitemap.xml/route.ts");
const localizedSitemapRoutePath = path.join(root, "apps/main/src/app/sitemaps/[locale]/route.ts");
const toolsIndexPath = path.join(root, "apps/main/src/app/tools/page.tsx");
const localizedToolsIndexPath = path.join(root, "apps/main/src/app/[locale]/tools/page.tsx");
const toolDetailPath = path.join(root, "apps/main/src/app/tools/[slug]/page.tsx");
const localizedToolDetailPath = path.join(root, "apps/main/src/app/[locale]/tools/[slug]/page.tsx");
const toolStructuredDataPath = path.join(root, "apps/main/src/features/tools/structured-data.ts");
const i18nConfigPath = path.join(root, "apps/main/src/features/i18n/config.ts");
const registry = fs.readFileSync(registryPath, "utf8");
const guideRegistry = fs.readFileSync(guideRegistryPath, "utf8");
const sitemapSource = fs.readFileSync(sitemapSourcePath, "utf8");
const i18nConfig = fs.readFileSync(i18nConfigPath, "utf8");
const toolDetail = fs.readFileSync(toolDetailPath, "utf8");
const localizedToolDetail = fs.readFileSync(localizedToolDetailPath, "utf8");
const toolStructuredData = fs.readFileSync(toolStructuredDataPath, "utf8");
const failures = [];
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

if (slugs.length < 40) failures.push(`expected at least 40 tools, found ${slugs.length}`);
if (uniqueSlugs.size !== slugs.length) failures.push("duplicate tool slugs detected");
if (locales.length < 14) failures.push(`expected at least 14 locales, found ${locales.length}`);
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
  "xmlns:xhtml",
  "hreflang=\"x-default\"",
  "tools.map",
  "guides.map",
  "sitemapLocales",
]) {
  if (!sitemapSource.includes(fragment)) failures.push(`sitemap source missing ${fragment}`);
}

const urlsPerLocale = slugs.length + guideSlugs.size + 4;
const totalLocalizedUrls = urlsPerLocale * locales.length;
if (totalLocalizedUrls < 900) failures.push(`expected at least 900 localized sitemap URLs, found ${totalLocalizedUrls}`);

const packageJson = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
if (JSON.stringify(packageJson.workspaces) !== JSON.stringify(["apps/main"])) failures.push("root workspaces must stay apps/main only");
if (packageJson.devDependencies?.turbo || packageJson.scripts?.clean?.includes("turbo")) failures.push("turbo dependency/script should not be restored");

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`Registry harness passed for ${slugs.length} tools, ${guideSlugs.size} guides, ${locales.length} locale sitemaps, and ${totalLocalizedUrls} localized sitemap URLs.`);
