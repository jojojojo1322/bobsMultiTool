import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const registry = fs.readFileSync(path.join(root, "apps/main/src/features/tools/registry.ts"), "utf8");
const searchPanel = fs.readFileSync(path.join(root, "apps/main/src/features/tools/tool-search-panel.tsx"), "utf8");
const workspace = fs.readFileSync(path.join(root, "apps/main/src/features/tools/tool-workspace.tsx"), "utf8");
const localizedContent = fs.readFileSync(path.join(root, "apps/main/src/features/i18n/localized-content.ts"), "utf8");
const home = fs.readFileSync(path.join(root, "apps/main/src/app/page.tsx"), "utf8");
const localizedHome = fs.readFileSync(path.join(root, "apps/main/src/app/[locale]/page.tsx"), "utf8");

const failures = [];
for (const fragment of [
  "getToolSearchText",
  "scoreToolSearch",
  "searchTools",
  "tool.faqs.flatMap",
  "tool.guides.map",
  "tool.aliases",
  "tool.useCases",
  "tool.inputExamples",
  "demandWeight",
]) {
  if (!registry.includes(fragment)) failures.push(`registry search missing ${fragment}`);
}

for (const [source, name] of [
  [searchPanel, "tool search panel"],
  [workspace, "tool workspace"],
]) {
  if (!source.includes("searchLocalizedTools(")) failures.push(`${name} does not use localized shared search`);
}
if (!localizedContent.includes("searchTools(query)")) failures.push("localized search does not reuse registry search ranking");
if (!searchPanel.includes("getLocalizedTools(")) failures.push("tool search panel does not localize empty-query results");

if (!home.includes("<ToolSearchPanel")) failures.push("default home still lacks real search panel");
if (!localizedHome.includes("<ToolSearchPanel")) failures.push("localized home still lacks real search panel");
if (home.includes("readOnly") || localizedHome.includes("readOnly")) failures.push("home search must not be read-only");
if (!registry.includes("regexp tester")) failures.push("core alias sample missing");
if (!registry.includes("monetizationTier")) failures.push("monetization tier field missing");

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("Search smoke passed.");
