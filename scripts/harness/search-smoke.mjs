import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const registry = fs.readFileSync(path.join(root, "apps/main/src/features/tools/registry.ts"), "utf8");
const searchPanel = fs.readFileSync(path.join(root, "apps/main/src/features/tools/tool-search-panel.tsx"), "utf8");
const workspace = fs.readFileSync(path.join(root, "apps/main/src/features/tools/tool-workspace.tsx"), "utf8");
const localizedContent = fs.readFileSync(path.join(root, "apps/main/src/features/i18n/localized-content.ts"), "utf8");
const home = fs.readFileSync(path.join(root, "apps/main/src/app/page.tsx"), "utf8");
const localizedHome = fs.readFileSync(path.join(root, "apps/main/src/app/[locale]/page.tsx"), "utf8");
const layout = fs.readFileSync(path.join(root, "apps/main/src/app/layout.tsx"), "utf8");
const toolDirectory = fs.readFileSync(path.join(root, "apps/main/src/features/tools/tool-directory.tsx"), "utf8");
const toolsIndex = fs.readFileSync(path.join(root, "apps/main/src/app/tools/page.tsx"), "utf8");
const localizedToolsIndex = fs.readFileSync(path.join(root, "apps/main/src/app/[locale]/tools/page.tsx"), "utf8");

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
  "tool.failureCases",
  "tool.preCopyChecklist",
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
if (!searchPanel.includes("getLocalizedRelatedTools(")) failures.push("tool search panel must expose related next-action links");
if (!searchPanel.includes("initialQuery")) failures.push("tool search panel does not accept initial URL query");
if (!searchPanel.includes("url.searchParams.set(\"q\"")) failures.push("tool search panel does not sync q search param");
if (!layout.includes("https://www.bobob.app/tools?q={search_term_string}")) failures.push("SearchAction target is not aligned to /tools?q=");
if (!toolDirectory.includes("acquisitionClusterSlugs")) failures.push("tool directory missing acquisition workflow clusters");
if (!toolDirectory.includes("data-acquisition-clusters")) failures.push("tool directory acquisition clusters need a stable QA attribute");
if (!toolDirectory.includes("dictionary.tool.nextActionPrefix")) failures.push("tool directory clusters must expose next-action links");
for (const slug of ["json-formatter", "jwt-decoder", "http-status-checker", "color-converter", "uuid-generator", "regex-tester"]) {
  if (!toolDirectory.includes(`"${slug}"`)) failures.push(`tool directory acquisition clusters missing ${slug}`);
}
for (const fragment of [
  "commonFailureCases",
  "commonPreCopyChecklist",
  "dictionary.tool.failureCases",
  "dictionary.tool.preCopyChecklist",
  "dictionary.tool.nextActionPrefix",
]) {
  if (!workspace.includes(fragment)) failures.push(`tool workspace missing retention detail ${fragment}`);
}

if (!home.includes("readSearchQuery")) failures.push("default home does not read ?q=");
if (!localizedHome.includes("readSearchQuery")) failures.push("localized home does not read ?q=");
if (!toolsIndex.includes("readSearchQuery") || !localizedToolsIndex.includes("readSearchQuery")) failures.push("tools directory pages do not read ?q=");
if (!toolsIndex.includes("ToolDirectory") || !localizedToolsIndex.includes("ToolDirectory")) failures.push("tools directory pages do not use shared ToolDirectory");
if (home.includes("readOnly") || localizedHome.includes("readOnly")) failures.push("home search must not be read-only");
if (!registry.includes("regexp tester")) failures.push("core alias sample missing");
if (!registry.includes("monetizationTier")) failures.push("monetization tier field missing");

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("Search smoke passed.");
