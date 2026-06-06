import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const registryPath = path.join(root, "apps/main/src/features/tools/registry.ts");
const guideRegistryPath = path.join(root, "apps/main/src/features/guides/registry.ts");
const sitemapPath = path.join(root, "apps/main/public/sitemap.xml");
const registry = fs.readFileSync(registryPath, "utf8");
const guideRegistry = fs.readFileSync(guideRegistryPath, "utf8");
const sitemap = fs.readFileSync(sitemapPath, "utf8");
const failures = [];

const toolBlocks = Array.from(registry.matchAll(/slug:\s+"([^"]+)"[\s\S]*?relatedTools:\s+\[([^\]]*)\]/g));
const slugs = toolBlocks.map((match) => match[1]);
const uniqueSlugs = new Set(slugs);

if (slugs.length < 40) failures.push(`expected at least 40 tools, found ${slugs.length}`);
if (uniqueSlugs.size !== slugs.length) failures.push("duplicate tool slugs detected");

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
  if (!sitemap.includes(`https://www.bobob.app/tools/${slug}`)) failures.push(`${slug} missing default sitemap URL`);
  const relatedSlugs = Array.from(relatedSource.matchAll(/"([^"]+)"/g)).map((item) => item[1]);
  if (!relatedSlugs.length) failures.push(`${slug} has no related tools`);
  for (const relatedSlug of relatedSlugs) {
    if (!uniqueSlugs.has(relatedSlug)) failures.push(`${slug} references missing related tool: ${relatedSlug}`);
  }
}

const guideSlugs = new Set([
  ...Array.from(registry.matchAll(/guide\("([^"]+)"/g)).map((match) => match[1]),
  ...Array.from(registry.matchAll(/guideSlug:\s+"([^"]+)"/g)).map((match) => match[1]),
]);

for (const slug of guideSlugs) {
  if (!guideRegistry.includes(`slug: "${slug}"`)) failures.push(`guide slug is not registered: ${slug}`);
  if (!sitemap.includes(`https://www.bobob.app/guides/${slug}`)) failures.push(`guide missing from sitemap: ${slug}`);
}

const sitemapUrls = Array.from(sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)).map((match) => match[1]);
if (sitemapUrls.length > 200) failures.push(`sitemap must stay at or below 200 URLs, found ${sitemapUrls.length}`);
if (!sitemap.includes("https://www.bobob.app/ko/tools/json-formatter")) failures.push("localized sitemap sample missing: ko json formatter");
if (!sitemap.includes("https://www.bobob.app/ja/tools/regex-tester")) failures.push("localized sitemap sample missing: ja regex tester");

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`Registry harness passed for ${slugs.length} tools, ${guideSlugs.size} guides, and ${sitemapUrls.length} sitemap URLs.`);
