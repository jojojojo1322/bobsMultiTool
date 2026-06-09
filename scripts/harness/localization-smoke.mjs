import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

const localizedContent = read("apps/main/src/features/i18n/localized-content.ts");
const dictionaries = read("apps/main/src/features/i18n/dictionaries.ts");
const localizedHome = read("apps/main/src/app/[locale]/page.tsx");
const localizedToolPage = read("apps/main/src/app/[locale]/tools/[slug]/page.tsx");
const localizedGuidePage = read("apps/main/src/app/[locale]/guides/[slug]/page.tsx");
const localizedGuidesIndex = read("apps/main/src/app/[locale]/guides/page.tsx");
const toolWorkspace = read("apps/main/src/features/tools/tool-workspace.tsx");
const toolSearch = read("apps/main/src/features/tools/tool-search-panel.tsx");
const toolComponents = read("apps/main/src/features/tools/tool-components.tsx");

const failures = [];
const nonEnglishLocales = ["ko", "ja", "zh-CN", "zh-TW", "es", "pt-BR", "de", "fr", "hi", "id", "vi", "th", "ar"];

for (const locale of nonEnglishLocales) {
  if (!localizedContent.includes(`${locale}:`) && !localizedContent.includes(`"${locale}":`)) {
    failures.push(`localized content pack missing locale: ${locale}`);
  }
  if (!dictionaries.includes(`${locale}:`) && !dictionaries.includes(`"${locale}":`)) {
    failures.push(`dictionary visible UI override missing locale: ${locale}`);
  }
}

for (const fragment of [
  "getLocalizedTool",
  "getLocalizedTools",
  "getLocalizedGuide",
  "getLocalizedGuides",
  "getLocalizedRelatedTools",
  "searchLocalizedTools",
  "localizedGuideTopics",
  "localizedGuideTopic",
  "localFaqQuestion",
  "serverFaqQuestion",
  "guideSections",
  "seoDescription",
]) {
  if (!localizedContent.includes(fragment)) failures.push(`localized-content missing ${fragment}`);
}

const pageChecks = [
  [localizedHome, "localized home", "getLocalizedTools"],
  [localizedToolPage, "localized tool page", "getLocalizedTool"],
  [localizedGuidePage, "localized guide page", "getLocalizedGuide"],
  [localizedGuidePage, "localized guide related tools", "getLocalizedRelatedTools"],
  [localizedGuidesIndex, "localized guides index", "getLocalizedGuides"],
  [toolWorkspace, "tool workspace search", "searchLocalizedTools"],
  [toolWorkspace, "tool workspace related", "getLocalizedRelatedTools"],
  [toolSearch, "home search panel", "searchLocalizedTools"],
];

for (const [source, label, fragment] of pageChecks) {
  if (!source.includes(fragment)) failures.push(`${label} does not use ${fragment}`);
}

for (const fragment of [
  "dictionary.toolUi",
  "copyReadyOutput",
  "jsonInput",
  "formattedJson",
  "count",
  "generate",
  "commonInput",
  "typicalOutput",
  "extensionOrMimeType",
  "httpStatus",
  "dnsRecords",
  "localizedNoOutput",
]) {
  if (!toolComponents.includes(fragment) && !dictionaries.includes(fragment)) {
    failures.push(`tool component/dictionary localization missing ${fragment}`);
  }
}

if (dictionaries.includes("...en.tool,\\n      developerWorkbench")) {
  failures.push("locale dictionary override must not re-spread en.tool over common localized tool text");
}

for (const fragment of [
  "<Button onClick={lookup}>Lookup</Button>",
  "title=\"DNS records\"",
  "title=\"HTTP status\"",
  "Output will appear here.",
]) {
  if (toolComponents.includes(fragment)) failures.push(`tool component still hardcodes visible English: ${fragment}`);
}

for (const englishFragment of [
  "Starting points for this utility",
  "Common implementation details",
  "Does UUID Generator upload my input?",
  "Generate UUID v4 values in bulk for fixtures",
]) {
  if (localizedContent.includes(englishFragment)) {
    failures.push(`localized content should not copy exact English fragment: ${englishFragment}`);
  }
}

for (const fragment of ["Sicherer Generator-Workflow", "安全なランダム生成フロー", "보안 랜덤 생성 흐름", "سير عمل generator آمن"]) {
  if (!localizedContent.includes(fragment)) failures.push(`localized guide topic sample missing: ${fragment}`);
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("Localization smoke passed.");
