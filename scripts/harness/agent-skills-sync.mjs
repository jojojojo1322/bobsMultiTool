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
  ["agents", "preserve the sidebar scroll position"],
  ["agents", "Demand tier is an internal prioritization"],
  ["agents", "visible prose must pass through localized content resolvers"],
  ["agents", "one aligned shell"],
  ["agents", "x-default"],
  ["agents", "sitemap index"],
  ["agents", "full per-locale URL coverage"],
  ["tool", "demandTier"],
  ["tool", "aliases"],
  ["tool", "monetizationTier"],
  ["tool", "supportedLocales"],
  ["tool", "privacyMode"],
  ["tool", "requiresServer"],
  ["design", "Light/Dark"],
  ["design", "ThemeToggle"],
  ["design", "resizable left and right sidebars"],
  ["design", "one aligned workbench shell"],
  ["design", "preserve sidebar scroll position"],
  ["design", "Demand tier is not a user-facing label"],
  ["design", "harness:layout"],
  ["localization", "getLocalizedTool"],
  ["localization", "getLocalizedGuide"],
  ["localization", "harness:localization"],
  ["localization", "raw English registry prose"],
  ["localization", "empty-output placeholders"],
  ["localization", "must not re-spread English nested objects"],
  ["seo", "hreflang"],
  ["seo", "x-default"],
  ["seo", "sitemap index"],
  ["seo", "/sitemaps/{locale}"],
  ["seo", "RTL"],
  ["seo", "country"],
  ["verification", "harness:i18n"],
  ["verification", "harness:localization"],
  ["verification", "harness:theme"],
  ["verification", "harness:search"],
  ["verification", "harness:layout"],
  ["verification", "preserved sidebar scroll"],
  ["verification", "No visible demand wording"],
  ["verification", "agent-skills-sync"],
  ["verification", "build-time external font fetches"],
  ["verification", "per-locale sitemaps"],
  ["product", "monetizationTier"],
  ["product", "Post-approval candidates"],
  ["product", "40+"],
];

for (const [file, fragment] of checks) {
  if (!files[file].includes(fragment)) failures.push(`${file} missing ${fragment}`);
}

const sourceFiles = [
  "apps/main/src/app/layout.tsx",
  "apps/cron-generator/src/app/layout.tsx",
  "apps/iframe-viewer/src/app/layout.tsx",
  "apps/lorem-generator/src/app/layout.tsx",
  "apps/meta-generator/src/app/layout.tsx",
  "apps/regax/src/app/layout.tsx",
];

for (const file of sourceFiles) {
  if (read(file).includes("next/font/google")) {
    failures.push(`${file} must not use next/font/google`);
  }
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("Agent and skills sync smoke passed.");
