import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];

function read(file) {
  return fs.readFileSync(path.join(root, file), "utf8");
}

function exists(file) {
  return fs.existsSync(path.join(root, file));
}

const packageJson = JSON.parse(read("package.json"));
const guideRegistry = read("apps/main/src/features/guides/registry.ts");
const localizedContent = read("apps/main/src/features/i18n/localized-content.ts");
const trustContent = read("apps/main/src/features/i18n/trust-content.ts");
const legalContent = read("apps/main/src/features/i18n/legal-content.ts");
const toolRegistry = read("apps/main/src/features/tools/registry.ts");
const blogDir = path.join(root, "content/blog");
const guidePage = read("apps/main/src/app/guides/[slug]/page.tsx");
const localizedGuidePage = read("apps/main/src/app/[locale]/guides/[slug]/page.tsx");
const guidesIndexPage = read("apps/main/src/app/guides/page.tsx");
const localizedGuidesIndexPage = read("apps/main/src/app/[locale]/guides/page.tsx");
const privacyPage = read("apps/main/src/app/privacy/page.tsx");
const termsPage = read("apps/main/src/app/terms/page.tsx");
const localizedPrivacyPage = read("apps/main/src/app/[locale]/privacy/page.tsx");
const localizedTermsPage = read("apps/main/src/app/[locale]/terms/page.tsx");
const appLayout = read("apps/main/src/app/layout.tsx");
const toolWorkspace = read("apps/main/src/features/tools/tool-workspace.tsx");
const googleAdsense = read("apps/main/src/components/GoogleAdsense.tsx");
const guideReviewSections = read("apps/main/src/features/guides/guide-review-sections.tsx");

const nonEnglishLocales = ["ko", "ja", "zh-CN", "zh-TW", "es", "pt-BR", "de", "fr", "hi", "id", "vi", "th", "ar"];
const publicSourceFiles = [
  "apps/main/src/features/guides/registry.ts",
  "apps/main/src/features/i18n/localized-content.ts",
  "apps/main/src/features/i18n/trust-content.ts",
  "apps/main/src/features/i18n/legal-content.ts",
  "apps/main/src/features/tools/registry.ts",
  "apps/main/src/app/guides/page.tsx",
  "apps/main/src/app/[locale]/guides/page.tsx",
  "apps/main/src/app/guides/[slug]/page.tsx",
  "apps/main/src/app/[locale]/guides/[slug]/page.tsx",
  "apps/main/src/app/privacy/page.tsx",
  "apps/main/src/app/terms/page.tsx",
  "apps/main/src/app/[locale]/privacy/page.tsx",
  "apps/main/src/app/[locale]/terms/page.tsx",
  "apps/main/src/features/guides/guide-review-sections.tsx",
  "apps/main/src/components/GoogleAdsense.tsx",
];

const publicRiskPattern =
  /ca-pub-YOUR|Advertisement Space|approval status|monetization tier|after approval|review-status|Coming soon|TODO placeholder/i;

for (const file of publicSourceFiles) {
  const source = read(file);
  if (publicRiskPattern.test(source)) {
    failures.push(`${file} contains public low-value, fake-ad, or approval-status wording`);
  }
}

for (const file of fs.readdirSync(blogDir).filter((entry) => entry.endsWith(".mdx"))) {
  const source = fs.readFileSync(path.join(blogDir, file), "utf8");
  if (/\bAdSense\b|애드센스/.test(source)) {
    failures.push(`content/blog/${file} should not expose AdSense review wording in public Blog copy`);
  }
}

if (exists("apps/main/public/sitemap.xml")) {
  failures.push("static apps/main/public/sitemap.xml must not shadow the dynamic sitemap index");
}

for (const legacyPath of [
  "apps/regax",
  "apps/cron-generator",
  "apps/meta-generator",
  "apps/iframe-viewer",
  "apps/lorem-generator",
  "apps/main/src/app/iframe-viewer",
  "packages/ui",
]) {
  if (exists(legacyPath)) failures.push(`${legacyPath} must not be restored as thin legacy inventory`);
}

if (packageJson.scripts?.["harness:adsense-content"] !== "node scripts/harness/adsense-content-smoke.mjs") {
  failures.push("package.json missing harness:adsense-content script");
}

if (!guideRegistry.includes("bullets?: string[]")) {
  failures.push("guide sections must support visible checklist bullets");
}

const guideSectionEntries = guideRegistry.match(/heading: "/g)?.length ?? 0;
const guideBulletEntries = guideRegistry.match(/bullets: \[/g)?.length ?? 0;
const guideSlugEntries = guideRegistry.match(/slug: "/g)?.length ?? 0;
if (guideSlugEntries < 16) failures.push(`expected at least 16 registered guides, found ${guideSlugEntries}`);
if (guideSectionEntries < guideSlugEntries * 5) {
  failures.push(`guides should average at least five unique sections each, found ${guideSectionEntries} headings for ${guideSlugEntries} guides`);
}
if (guideBulletEntries < guideSlugEntries * 5) {
  failures.push(`guides should expose checklist bullets for each section, found ${guideBulletEntries} bullet groups for ${guideSlugEntries} guides`);
}

for (const fragment of [
  "localizedGuideSupportSections",
  "localizedGuideExpansionSections",
  "priorityGuideExtraSections",
  "...localizedGuideSupportSections(localizedLocale, topic)",
  "...localizedGuideExpansionSections(localizedLocale, topic)",
  "...extraSections",
  "bullets:",
]) {
  if (!localizedContent.includes(fragment)) failures.push(`localized guide content missing ${fragment}`);
}

const expansionSource = localizedContent.match(/function localizedGuideExpansionSections[\s\S]*?\n}\n\nconst priorityGuideExtraSections/)?.[0] ?? "";
for (const locale of nonEnglishLocales) {
  if (!expansionSource.includes(`${locale}:`) && !expansionSource.includes(`"${locale}":`)) {
    failures.push(`localized guide expansion sections missing locale ${locale}`);
  }
}

for (const [source, label] of [
  [guidePage, "default guide detail"],
  [localizedGuidePage, "localized guide detail"],
]) {
  for (const fragment of ["section.bullets", "GuideReviewSections", "tool.description", "tool.useCases", "tool.examples[0]", "tool.faqs[0]"]) {
    if (!source.includes(fragment)) failures.push(`${label} missing visible guide support fragment: ${fragment}`);
  }
}

for (const fragment of ["data-guide-review-sections", "tool.failureCases", "tool.preCopyChecklist", "dictionary.tool.failureCases", "dictionary.tool.preCopyChecklist"]) {
  if (!guideReviewSections.includes(fragment)) failures.push(`guide review sections missing ${fragment}`);
}

for (const fragment of ["data-guide-workflow-map", "workflowTools", "dictionary.tool.nextActionPrefix"]) {
  if (!guideReviewSections.includes(fragment)) failures.push(`guide review sections missing visible workflow fragment: ${fragment}`);
}

for (const fragment of ["data-tool-workflow-summary", "data-tool-workflow-recipes-visible", "step.reason", "data-tool-related-summary", "data-tool-guide-summary"]) {
  if (!toolWorkspace.includes(fragment)) failures.push(`tool workspace missing always-visible workflow fragment: ${fragment}`);
}

for (const [source, label] of [
  [guidesIndexPage, "default guides index"],
  [localizedGuidesIndexPage, "localized guides index"],
]) {
  for (const fragment of ["guide.sections[0]?.body", "guide.sections[1]?.heading", ".flatMap((section) => section.bullets ?? [])"]) {
    if (!source.includes(fragment)) failures.push(`${label} must expose guide preview content, missing ${fragment}`);
  }
}

for (const [source, label] of [
  [privacyPage, "privacy page"],
  [termsPage, "terms page"],
  [localizedPrivacyPage, "localized privacy page"],
  [localizedTermsPage, "localized terms page"],
]) {
  if (!source.includes("{content.description}")) {
    failures.push(`${label} should render the localized page description in body content`);
  }
}

for (const fragment of [
  "About bobob.app",
  "bobob.app について",
  "Acerca de bobob.app",
  "حول bobob.app",
  "Representative writing",
  "Escritura representativa",
  "Play experiments",
  "Practical tools",
  "International coverage",
  "Review workflow before copying",
  "Public discovery surface",
  "Useful issue reports",
  "Response priorities",
  "What to include in content feedback",
  "Requests this inbox cannot handle",
  "trustUpdatedAt",
  "localizedTrustExpansionSections",
  "localizedTrustDepthSections",
  "...expansionSections",
  "...depthSections",
]) {
  if (!trustContent.includes(fragment)) failures.push(`trust content missing expanded trust section: ${fragment}`);
}

const trustExpansionSource = trustContent.match(/const localizedTrustExpansionSections[\s\S]*?export function getLocalizedTrustContent/)?.[0] ?? "";
for (const locale of nonEnglishLocales) {
  if (!trustExpansionSource.includes(`${locale}:`) && !trustExpansionSource.includes(`"${locale}":`)) {
    failures.push(`localized trust expansion sections missing locale ${locale}`);
  }
}

const trustDepthSource = trustContent.match(/const localizedTrustDepthSections[\s\S]*?export function getLocalizedTrustContent/)?.[0] ?? "";
for (const locale of ["ko", "ja", "zh-CN", "zh-TW", "ar"]) {
  if (!trustDepthSource.includes(`${locale}:`) && !trustDepthSource.includes(`"${locale}":`)) {
    failures.push(`localized trust depth sections missing locale ${locale}`);
  }
}

for (const fragment of [
  "Local utility inputs",
  "Public network checks",
  "Browser storage",
  "Data not suitable for this site",
  "Verification before use",
  "Network and security boundaries",
  "No account or professional service",
  "localizedLegalExpansionSections",
  "localizedLegalDepthSections",
  "...expansionSections",
  "...depthSections",
]) {
  if (!legalContent.includes(fragment)) failures.push(`legal content missing expanded policy section: ${fragment}`);
}

const legalExpansionSource = legalContent.match(/const localizedLegalExpansionSections[\s\S]*?export function getLocalizedLegalContent/)?.[0] ?? "";
for (const locale of nonEnglishLocales) {
  if (!legalExpansionSource.includes(`${locale}:`) && !legalExpansionSource.includes(`"${locale}":`)) {
    failures.push(`localized legal expansion sections missing locale ${locale}`);
  }
}

for (const fragment of [
  "color-converter",
  "sql-formatter",
  "yaml-validator",
  "env-parser-validator",
  "csv-json-converter",
  "jsonpath-tester",
  "css-formatter",
  "javascript-formatter",
  "meta-tag-generator",
  "url-parser",
  "robots-txt-generator",
  "sitemap-generator",
  "open-graph-preview",
]) {
  if (!toolRegistry.includes(`"${fragment}": {`)) {
    failures.push(`approval content boost missing ${fragment}`);
  }
}

const adsenseSource = [appLayout, toolWorkspace, guidePage, localizedGuidePage, googleAdsense].join("\n");
for (const fragment of ["ca-pub-2620992505263949", "enableAutoAds", "overlays", "anchor ads"]) {
  if (fragment === "ca-pub-2620992505263949") {
    if (!adsenseSource.includes(fragment)) failures.push("base Google advertising script must keep the real publisher id fallback");
  } else if (adsenseSource.includes(fragment)) {
    failures.push(`GoogleAdsense component should not initialize page-level auto-ad behavior: ${fragment}`);
  }
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`AdSense content smoke passed for ${guideSlugEntries} guides, ${nonEnglishLocales.length} localized guide packs, and ${publicSourceFiles.length} public source surfaces.`);
