import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const files = {
  agents: read("AGENTS.md"),
  tool: read(".codex/skills/bobob-tool-addition/SKILL.md"),
  design: read(".codex/skills/bobob-design-system/SKILL.md"),
  seo: read(".codex/skills/bobob-adsense-seo/SKILL.md"),
  verification: read(".codex/skills/bobob-verification/SKILL.md"),
  localization: read(".codex/skills/bobob-localization-quality/SKILL.md"),
  product: read(".codex/skills/bobob-product-strategy/SKILL.md"),
};

const failures = [];
const checks = [
  ["agents", "features, tool policy, SEO/AdSense policy, i18n, or theme rules change"],
  ["agents", "skills must be updated"],
  ["agents", "build-time external font fetches"],
  ["agents", "aliases, useCases, inputExamples, contentCluster, and monetizationTier"],
  ["agents", "real resizable left and right sidebars"],
  ["agents", "clamped to the workbench container"],
  ["agents", "preserve the sidebar scroll position"],
  ["agents", "Demand tier is an internal prioritization"],
  ["agents", "visible prose must pass through localized content resolvers"],
  ["agents", "guide.description"],
  ["agents", "Twitter title/description"],
  ["agents", "Long-tail acquisition locales"],
  ["agents", "every registered tool"],
  ["agents", "Long-tail guide descriptions"],
  ["agents", "root `<html lang>`"],
  ["agents", "getLocalizedLegalContent"],
  ["agents", "one aligned shell"],
  ["agents", "x-default"],
  ["agents", "sitemap index"],
  ["agents", "full per-locale URL coverage"],
  ["agents", "/{locale}/tools"],
  ["agents", "SearchAction schema"],
  ["agents", "harness:seo-opportunities"],
  ["agents", "titleDescriptionRecommendations"],
  ["agents", "inputWarnings"],
  ["agents", "BOBOB_SEO_REPORT_FORMAT"],
  ["agents", "visual screenshot smoke"],
  ["agents", "unused AdSense placeholder"],
  ["agents", "legacy standalone app directories"],
  ["agents", "Do not reintroduce `packages/ui`, `turbo`"],
  ["agents", "docs/legacy-apps-archive.md"],
  ["tool", "demandTier"],
  ["tool", "aliases"],
  ["tool", "monetizationTier"],
  ["tool", "supportedLocales"],
  ["tool", "privacyMode"],
  ["tool", "requiresServer"],
  ["tool", "slug-specific long-tail visible descriptions"],
  ["tool", "/{locale}/tools"],
  ["tool", "Do not add a static"],
  ["tool", "only app workspace"],
  ["design", "Light/Dark"],
  ["design", "ThemeToggle"],
  ["design", "resizable left and right sidebars"],
  ["design", "clamp to the workbench container"],
  ["design", "one aligned workbench shell"],
  ["design", "preserve sidebar scroll position"],
  ["design", "Demand tier is not a user-facing label"],
  ["design", "harness:layout"],
  ["design", "harness:visual"],
  ["localization", "getLocalizedTool"],
  ["localization", "getLocalizedGuide"],
  ["localization", "harness:localization"],
  ["localization", "raw English registry prose"],
  ["localization", "empty-output placeholders"],
  ["localization", "must not re-spread English nested objects"],
  ["localization", "slug-specific descriptions"],
  ["localization", "Long-tail acquisition locales"],
  ["localization", "every registered tool"],
  ["localization", "Long-tail guide descriptions"],
  ["localization", "root `<html lang>`"],
  ["localization", "getLocalizedLegalContent"],
  ["localization", "guide.description"],
  ["localization", "Twitter title/description"],
  ["seo", "hreflang"],
  ["seo", "x-default"],
  ["seo", "root `<html lang>`"],
  ["seo", "sitemap index"],
  ["seo", "/sitemaps/{locale}"],
  ["seo", "RTL"],
  ["seo", "country"],
  ["seo", "SearchAction schema"],
  ["seo", "harness:seo-opportunities"],
  ["seo", "titleDescriptionRecommendations"],
  ["seo", "inputWarnings"],
  ["seo", "BOBOB_SEO_REPORT_FORMAT"],
  ["seo", "tool and guide pages"],
  ["seo", "guide.description"],
  ["seo", "Twitter title/description"],
  ["seo", "unused AdSense preview"],
  ["seo", "Legacy standalone apps must not be restored"],
  ["verification", "harness:i18n"],
  ["verification", "harness:localization"],
  ["verification", "Root `<html lang>`"],
  ["verification", "getLocalizedLegalContent"],
  ["verification", "guide.description"],
  ["verification", "Twitter title/description"],
  ["verification", "harness:theme"],
  ["verification", "harness:search"],
  ["verification", "harness:layout"],
  ["verification", "harness:visual"],
  ["verification", "harness:seo-opportunities"],
  ["verification", "titleDescriptionRecommendations"],
  ["verification", "inputWarnings"],
  ["verification", "BOBOB_SEO_REPORT_FORMAT"],
  ["verification", "tool and guide pages"],
  ["verification", "preserved sidebar scroll"],
  ["verification", "no horizontal overflow at narrow desktop widths"],
  ["verification", "No visible demand wording"],
  ["verification", "agent-skills-sync"],
  ["verification", "build-time external font fetches"],
  ["verification", "per-locale sitemaps"],
  ["verification", "private/reserved hosts"],
  ["verification", "fake publisher IDs"],
  ["verification", "No standalone legacy app directories"],
  ["product", "monetizationTier"],
  ["product", "Post-approval candidates"],
  ["product", "40+"],
  ["product", "localized tool directories"],
  ["product", "harness:seo-opportunities"],
  ["product", "titleDescriptionRecommendations"],
  ["product", "inputWarnings"],
  ["product", "BOBOB_SEO_REPORT_FORMAT"],
  ["product", "tool and guide pages"],
];

for (const [file, fragment] of checks) {
  if (!files[file].includes(fragment)) failures.push(`${file} missing ${fragment}`);
}

const forbidden = [
  ["tool", "Update `apps/main/public/sitemap.xml`"],
  ["tool", "below 200 final URLs"],
  ["agents", "Update `apps/main/public/sitemap.xml`"],
  ["agents", "below 200 final URLs"],
];

for (const [file, fragment] of forbidden) {
  if (files[file].includes(fragment)) failures.push(`${file} still contains forbidden stale policy: ${fragment}`);
}

for (const file of [
  "apps/main/src/components/AdContainer.tsx",
  "packages/ui",
  "apps/cron-generator",
  "apps/iframe-viewer",
  "apps/lorem-generator",
  "apps/meta-generator",
  "apps/regax",
  "apps/main/src/app/iframe-viewer",
  "turbo.json",
]) {
  if (fs.existsSync(path.join(root, file))) failures.push(`${file} should not exist as unused legacy surface`);
}

for (const file of [
  "apps/main/src",
]) {
  const entries = fs.existsSync(path.join(root, file)) ? fs.readdirSync(path.join(root, file), { recursive: true }) : [];
  for (const entry of entries) {
    const fullPath = path.join(root, file, String(entry));
    if (!fs.existsSync(fullPath) || fs.statSync(fullPath).isDirectory()) continue;
    const source = fs.readFileSync(fullPath, "utf8");
    if (source.includes("ca-pub-YOUR_ACTUAL_PUBLISHER_ID") || source.includes("Advertisement Space")) {
      failures.push(`${path.relative(root, fullPath)} contains fake AdSense placeholder copy`);
    }
    if (file === "apps/main/src" && (source.includes("ca-pub-XXXXXXXXXX") || source.includes("G-XXXXXXXXXX"))) {
      failures.push(`${path.relative(root, fullPath)} contains a fake analytics or AdSense fallback`);
    }
  }
}

for (const file of [
  "apps/main/src/app/tools/page.tsx",
  "apps/main/src/app/[locale]/tools/page.tsx",
]) {
  const source = read(file);
  if (source.includes("/tools/regex-tester")) failures.push(`${file} must stay an indexable tools directory, not redirect to the first tool`);
  if (!source.includes("ToolDirectory")) failures.push(`${file} must render the shared ToolDirectory`);
}

if (!fs.existsSync(path.join(root, "scripts/harness/visual-smoke.mjs"))) {
  failures.push("visual smoke harness missing");
}
if (!fs.existsSync(path.join(root, "scripts/harness/seo-opportunity-report.mjs"))) {
  failures.push("SEO opportunity report harness missing");
} else {
  const seoReport = read("scripts/harness/seo-opportunity-report.mjs");
  for (const fragment of ["inventoryCount", "toolInventoryCount", "guideInventoryCount", "inputWarnings", "titleDescriptionRecommendations", "measuredMetadataSuggestion", "canonicalContentPath", "readCsvTable", "formatMarkdownReport", "BOBOB_SEO_REPORT_FORMAT", "BOBOB_SEO_REPORT_OUT"]) {
    if (!seoReport.includes(fragment)) failures.push(`SEO opportunity report missing ${fragment}`);
  }
}

const resizable = read("apps/main/src/components/ui/resizable.tsx");
for (const fragment of ["clampLayoutToAvailable", "ResizeObserver", "minmax(0,1fr)", "data-resizable-layout"]) {
  if (!resizable.includes(fragment)) failures.push(`resizable implementation missing ${fragment}`);
}

if (!fs.existsSync(path.join(root, "docs/legacy-apps-archive.md"))) {
  failures.push("legacy apps archive document missing");
} else {
  const legacyArchive = read("docs/legacy-apps-archive.md");
  for (const fragment of ["apps/main", "/regax", "/tools/regex-tester", "packages/ui", "turbo.json"]) {
    if (!legacyArchive.includes(fragment)) failures.push(`legacy apps archive missing ${fragment}`);
  }
}

const sourceFiles = [
  "apps/main/src/app/layout.tsx",
];

for (const file of sourceFiles) {
  if (read(file).includes("next/font/google")) {
    failures.push(`${file} must not use next/font/google`);
  }
}

const packageJson = JSON.parse(read("package.json"));
if (JSON.stringify(packageJson.workspaces) !== JSON.stringify(["apps/main"])) {
  failures.push("root workspaces must include only apps/main");
}
if (packageJson.devDependencies?.turbo || packageJson.scripts?.clean?.includes("turbo")) {
  failures.push("single-app workspace must not keep turbo dependency or turbo clean script");
}

const visibleDictionary = read("apps/main/src/features/i18n/dictionaries.ts");
if (visibleDictionary.includes("demand:")) {
  failures.push("visible dictionaries must not keep demand wording");
}

const localizedContent = read("apps/main/src/features/i18n/localized-content.ts");
if (localizedContent.includes("coreChip") || localizedContent.includes("growthChip") || localizedContent.includes("longTailChip")) {
  failures.push("localized content must not keep demand-tier chip copy");
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("Agent and skills sync smoke passed.");
