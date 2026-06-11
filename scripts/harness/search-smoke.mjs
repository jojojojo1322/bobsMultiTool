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
const workflows = fs.readFileSync(path.join(root, "apps/main/src/features/tools/workflows.ts"), "utf8");

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
if (!localizedContent.includes("const toolBySlug = new Map") || !localizedContent.includes(".map((slug) => toolBySlug.get(slug))")) {
  failures.push("localized related tools must preserve registry relatedTools order");
}
if (!searchPanel.includes("getLocalizedTools(")) failures.push("tool search panel does not localize empty-query results");
if (!searchPanel.includes("function getSearchMatchSignals")) failures.push("tool search panel missing match-signal extraction");
if (!searchPanel.includes("data-search-match-signals")) failures.push("tool search panel must expose stable match-signal chips");
for (const fragment of ["tool.inputExamples", "tool.failureCases", "tool.preCopyChecklist", "tool.aliases", "tool.searchIntents", "tool.seo.keywords", "tool.faqs.flatMap", "tool.guides.map", "relatedTools.flatMap"]) {
  if (!searchPanel.includes(fragment)) failures.push(`tool search match signals missing ${fragment}`);
}
if (!searchPanel.includes("getLocalizedRelatedTools(")) failures.push("tool search panel must expose related next-action links");
if (!searchPanel.includes("related.useCases[0]")) failures.push("tool search panel related links must expose localized use-case context");
if (!searchPanel.includes("initialQuery")) failures.push("tool search panel does not accept initial URL query");
if (!searchPanel.includes("url.searchParams.set(\"q\"")) failures.push("tool search panel does not sync q search param");
if (!layout.includes("https://www.bobob.app/tools?q={search_term_string}")) failures.push("SearchAction target is not aligned to /tools?q=");
if (!toolDirectory.includes("acquisitionClusterSlugs")) failures.push("tool directory missing acquisition workflow clusters");
if (!toolDirectory.includes("data-acquisition-clusters")) failures.push("tool directory acquisition clusters need a stable QA attribute");
if (!toolDirectory.includes("dictionary.tool.nextActionPrefix")) failures.push("tool directory clusters must expose next-action links");
if (!toolDirectory.includes("tool.useCases[0]")) failures.push("tool directory clusters must expose localized use-case context");
if (!workflows.includes("workflowRecipes") || !workflows.includes("getWorkflowRecipesForTool") || !workflows.includes("getLocalizedWorkflowRecipes")) {
  failures.push("workflow recipe registry must expose localized recipe helpers");
}
if (!toolDirectory.includes("data-workflow-recipes") || !toolDirectory.includes("WorkflowRecipeCard")) {
  failures.push("tool directory must expose workflow recipe cards for session-depth entry paths");
}
if (!searchPanel.includes("data-search-workflow-recipes") || !searchPanel.includes("workflowRecipeMatches")) {
  failures.push("tool search panel must surface workflow recipe matches for task-shaped queries");
}
if (!searchPanel.includes("scoreWorkflowRecipeSearch") || !searchPanel.includes(".sort((a, b) => b.score - a.score")) {
  failures.push("tool search panel must rank workflow recipe matches by exact title and intent score");
}
if (!workspace.includes("data-tool-workflow-recipes") || !workspace.includes("getWorkflowRecipesForTool")) {
  failures.push("tool detail pages must surface workflow recipes connected to the active tool");
}
for (const recipeSlug of ["format-api-response", "extract-json-field", "decode-api-token", "debug-redirect", "inspect-image-data-url", "check-dns-deployment", "create-wifi-qr", "generate-secure-token", "review-security-headers", "validate-deploy-config", "clean-csv-for-api"]) {
  if (!workflows.includes(`slug: "${recipeSlug}"`)) failures.push(`workflow recipe registry missing ${recipeSlug}`);
}
for (const intent of ["api response formatter", "json field extractor", "json path extractor", "recursive jsonpath", "jwt exp checker", "redirect chain checker", "base64 image decoder", "data url decoder", "dns propagation checklist", "wifi qr code generator", "csrf token generator", "security headers checker", "content security policy generator", "docker compose validator", "deployment config checker", "csv cleaner", "markdown table generator"]) {
  if (!workflows.includes(intent)) failures.push(`workflow recipe search intent missing ${intent}`);
}
for (const slug of ["json-formatter", "jwt-decoder", "http-status-checker", "color-converter", "uuid-generator", "regex-tester"]) {
  if (!toolDirectory.includes(`"${slug}"`)) failures.push(`tool directory acquisition clusters missing ${slug}`);
}
for (const fragment of [
  "commonFailureCases",
  "commonPreCopyChecklist",
  "dictionary.tool.failureCases",
  "dictionary.tool.preCopyChecklist",
  "dictionary.tool.nextActionPrefix",
  "related.useCases[0]",
]) {
  if (!workspace.includes(fragment)) failures.push(`tool workspace missing retention detail ${fragment}`);
}

if (!home.includes("readSearchQuery")) failures.push("default home does not read ?q=");
if (!localizedHome.includes("readSearchQuery")) failures.push("localized home does not read ?q=");
if (!toolsIndex.includes("readSearchQuery") || !localizedToolsIndex.includes("readSearchQuery")) failures.push("tools directory pages do not read ?q=");
if (!toolsIndex.includes("ToolDirectory") || !localizedToolsIndex.includes("ToolDirectory")) failures.push("tools directory pages do not use shared ToolDirectory");
if (home.includes("readOnly") || localizedHome.includes("readOnly")) failures.push("home search must not be read-only");
if (!registry.includes("regexp tester")) failures.push("core alias sample missing");
for (const intent of ["email regex", "url regex", "uuid regex", "ipv4 regex", "hex color regex", "slug regex"]) {
  if (!registry.includes(intent)) failures.push(`Regex Tester search intent missing ${intent}`);
}
for (const intent of ["base64 image decoder", "base64 to png", "data url decoder", "image data url preview"]) {
  if (!registry.includes(intent)) failures.push(`Base64 search intent missing ${intent}`);
}
for (const intent of ["json path extractor", "json field extractor", "jsonpath wildcard", "recursive jsonpath", "extract json value"]) {
  if (!registry.includes(intent)) failures.push(`JSONPath Tester search intent missing ${intent}`);
}
if (!registry.includes("docker compose validator") || !registry.includes("compose yaml validator")) failures.push("YAML Validator search intents must cover Docker Compose queries");
if (!registry.includes("csrf token generator") || !registry.includes("api key generator") || !registry.includes("url safe token generator")) failures.push("Random Token search intents must cover CSRF, API key, and URL-safe token queries");
if (!registry.includes("hmac sha256 generator") || !registry.includes("webhook signature generator") || !registry.includes("webhook hmac")) failures.push("Hash Generator search intents must cover HMAC and webhook signature queries");
if (!registry.includes("passphrase generator") || !registry.includes("memorable password generator") || !registry.includes("secure passphrase generator")) failures.push("Password Generator search intents must cover passphrase and memorable password queries");
if (!registry.includes("wifi qr code generator") || !registry.includes("free qr code generator") || !registry.includes("contact qr code generator")) failures.push("QR Code Generator search intents must cover Wi-Fi, free QR, and contact QR queries");
if (!registry.includes("monetizationTier")) failures.push("monetization tier field missing");

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("Search smoke passed.");
