import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

const localizedContent = read("apps/main/src/features/i18n/localized-content.ts");
const dictionaries = read("apps/main/src/features/i18n/dictionaries.ts");
const legalContent = read("apps/main/src/features/i18n/legal-content.ts");
const localizedHome = read("apps/main/src/app/[locale]/page.tsx");
const localizedToolPage = read("apps/main/src/app/[locale]/tools/[slug]/page.tsx");
const defaultToolPage = read("apps/main/src/app/tools/[slug]/page.tsx");
const localizedGuidePage = read("apps/main/src/app/[locale]/guides/[slug]/page.tsx");
const defaultGuidePage = read("apps/main/src/app/guides/[slug]/page.tsx");
const localizedGuidesIndex = read("apps/main/src/app/[locale]/guides/page.tsx");
const localizedPrivacyPage = read("apps/main/src/app/[locale]/privacy/page.tsx");
const localizedTermsPage = read("apps/main/src/app/[locale]/terms/page.tsx");
const toolDirectory = read("apps/main/src/features/tools/tool-directory.tsx");
const toolWorkspace = read("apps/main/src/features/tools/tool-workspace.tsx");
const toolSearch = read("apps/main/src/features/tools/tool-search-panel.tsx");
const toolComponents = read("apps/main/src/features/tools/tool-components.tsx");
const toolRegistry = read("apps/main/src/features/tools/registry.ts");

const failures = [];
const nonEnglishLocales = ["ko", "ja", "zh-CN", "zh-TW", "es", "pt-BR", "de", "fr", "hi", "id", "vi", "th", "ar"];
const longTailLocales = ["zh-CN", "zh-TW", "pt-BR", "fr", "hi", "id", "vi", "th", "ar"];

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
  "priorityToolIntents",
  "longTailPriorityToolIntents",
  "priorityGuideDescriptions",
]) {
  if (!localizedContent.includes(fragment)) failures.push(`localized-content missing ${fragment}`);
}

const registrySlugs = Array.from(toolRegistry.matchAll(/slug: "([^"]+)"/g)).map((match) => match[1]);
const longTailIntentSource = localizedContent.match(/const longTailPriorityToolIntents:[\s\S]*?= \{([\s\S]*?)\n\};\n\nconst priorityGuideDescriptions/)?.[1] ?? "";
for (const slug of registrySlugs) {
  const toolSource = longTailIntentSource.match(new RegExp(`\\n  "${slug}": \\{([\\s\\S]*?)\\n  \\},`))?.[1];
  if (!toolSource) {
    failures.push(`long-tail localized intent missing tool slug: ${slug}`);
    continue;
  }
  for (const locale of longTailLocales) {
    if (!toolSource.includes(`${locale}:`) && !toolSource.includes(`"${locale}":`)) {
      failures.push(`long-tail localized intent missing ${locale} for ${slug}`);
    }
  }
}

for (const fragment of [
  "getLocalizedLegalContent",
  "개인정보 처리방침",
  "プライバシーポリシー",
  "隐私政策",
  "Politica de privacidad",
  "Datenschutzerklaerung",
  "गोपनीयता नीति",
  "นโยบายความเป็นส่วนตัว",
  "سياسة الخصوصية",
]) {
  if (!legalContent.includes(fragment)) failures.push(`localized legal content missing ${fragment}`);
}

const pageChecks = [
  [localizedHome, "localized home", "ToolDirectory"],
  [toolDirectory, "tool directory", "getLocalizedTools"],
  [localizedToolPage, "localized tool page", "getLocalizedTool"],
  [localizedGuidePage, "localized guide page", "getLocalizedGuide"],
  [localizedGuidePage, "localized guide related tools", "getLocalizedRelatedTools"],
  [localizedGuidesIndex, "localized guides index", "getLocalizedGuides"],
  [localizedPrivacyPage, "localized privacy page", "getLocalizedLegalContent"],
  [localizedTermsPage, "localized terms page", "getLocalizedLegalContent"],
  [toolWorkspace, "tool workspace search", "searchLocalizedTools"],
  [toolWorkspace, "tool workspace related", "getLocalizedRelatedTools"],
  [toolSearch, "home search panel", "searchLocalizedTools"],
];

for (const [source, label, fragment] of pageChecks) {
  if (!source.includes(fragment)) failures.push(`${label} does not use ${fragment}`);
}

for (const [source, label] of [
  [localizedGuidePage, "localized guide page"],
  [defaultGuidePage, "default guide page"],
]) {
  if (!source.includes("description: guide.description")) {
    failures.push(`${label} metadata must use guide.description instead of a generic template`);
  }
  if (!source.includes("openGraph")) {
    failures.push(`${label} metadata must include OpenGraph based on guide.description`);
  }
  if (!source.includes("twitter")) {
    failures.push(`${label} metadata must include Twitter card values based on guide.description`);
  }
}

for (const [source, label] of [
  [localizedToolPage, "localized tool page"],
  [defaultToolPage, "default tool page"],
]) {
  if (!source.includes("twitter")) {
    failures.push(`${label} metadata must include page-specific Twitter card values`);
  }
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
  "Privacy policy for Bob's Multi Tool developer utilities.",
  "Terms of service for Bob's Multi Tool developer utilities.",
  "Back to tools",
  'seoTitle: (title, category) => `${title} - free online ${category} tool`',
  "Does UUID Generator upload my input?",
  "Generate UUID v4 values in bulk for fixtures",
  "Markdown 미리보기er",
  "Markdown プレビューer",
]) {
  if (localizedContent.includes(englishFragment)) {
    failures.push(`localized content should not copy exact English fragment: ${englishFragment}`);
  }
  if (localizedPrivacyPage.includes(englishFragment) || localizedTermsPage.includes(englishFragment)) {
    failures.push(`localized legal page should not hardcode English fragment: ${englishFragment}`);
  }
}

function commonTextBlock(locale) {
  const marker = `  ${locale.includes("-") ? `"${locale}"` : locale}: {\n    nav:`;
  const start = dictionaries.indexOf(marker);
  if (start === -1) return "";
  const nextStart = nonEnglishLocales
    .map((nextLocale) => `\n  ${nextLocale.includes("-") ? `"${nextLocale}"` : nextLocale}: {\n    nav:`)
    .map((nextMarker) => dictionaries.indexOf(nextMarker, start + marker.length))
    .filter((index) => index > start)
    .sort((a, b) => a - b)[0];
  return dictionaries.slice(start, nextStart === -1 ? undefined : nextStart);
}

for (const locale of nonEnglishLocales) {
  const block = commonTextBlock(locale);
  for (const englishFragment of [
    "genereez",
    'faqDescription: "Common implementation details"',
    "homeTitle: \"Bob's Multi Tool - Practical Developer Utilities\"",
    'theme: { light: "Light", dark: "Dark", system: "System" }',
    'privacy: "Privacy"',
    'serverRequired: "Server route"',
    'localOnly: "Browser local"',
  ]) {
    if (block.includes(englishFragment)) failures.push(`${locale} dictionary should not copy exact English fragment: ${englishFragment}`);
  }
}

for (const fragment of [
  'localChip: "Browser local"',
  "privacy badge",
  "route server",
  "route خادم",
  "서버 route",
]) {
  if (localizedContent.includes(fragment)) failures.push(`localized content should avoid mixed untranslated visible fragment: ${fragment}`);
  if (legalContent.includes(fragment)) failures.push(`localized legal content should avoid mixed untranslated visible fragment: ${fragment}`);
}

for (const fragment of [
  '"Markdown Previewer": "Markdown 미리보기"',
  '"Text Sort and Dedupe": "텍스트 정렬/중복 제거"',
  '"Word Character Counter": "단어/문자 카운터"',
  '"CSS Unit Converter": "CSS 단위 변환기"',
  '"CSS Clamp Generator": "CSS Clamp 생성기"',
  '"Password Generator": "पासवर्ड जनरेटर"',
  '"Markdown Previewer": "Markdown प्रीव्यू"',
]) {
  if (!localizedContent.includes(fragment)) failures.push(`localized title override missing: ${fragment}`);
}

for (const fragment of [
  '"json-formatter"',
  '"http-status-checker"',
  '"css-clamp-generator"',
  '"zh-CN": "整理 API 响应',
  '"pt-BR": "Formate JSON',
  'fr: "Formatez le JSON',
  'hi: "API response',
  'id: "Rapikan JSON',
  'vi: "Dinh dang JSON',
  'th: "จัดรูปแบบ JSON',
  'ar: "نسق JSON',
]) {
  if (!localizedContent.includes(fragment)) failures.push(`long-tail priority locale prose missing: ${fragment}`);
}

for (const fragment of [
  "说明 JSON、YAML、CSV 转换时如何检查结构丢失",
  "Criterios para gerar senhas, tokens, UUIDs e ULIDs",
  "HTTP status aur DNS records se public deploy",
  "คู่มือใช้ CSS formatter, minifier, unit conversion",
  "دليل لاستخدام CSS formatting وminification",
  "整理表单验证、route matching",
  "Five-field cron se minute",
  "Guia dos meta tags que importam",
  "MD5, SHA-1, SHA-256 aur SHA-512",
  "workflow Web SEO สำหรับ robots.txt",
  "سير عمل لترتيب النص وإزالة التكرار",
]) {
  if (!localizedContent.includes(fragment)) failures.push(`long-tail priority guide description missing: ${fragment}`);
}

for (const fragment of [
  "व्यावहारिक developer utilities",
  "เครื่องมือ developer ที่ใช้งานจริง",
  "أدوات مطور عملية",
]) {
  if (!dictionaries.includes(fragment)) failures.push(`localized metadata override missing: ${fragment}`);
}

for (const fragment of ["Sicherer Generator-Workflow", "安全なランダム生成フロー", "보안 랜덤 생성 흐름", "سير عمل generator آمن"]) {
  if (!localizedContent.includes(fragment)) failures.push(`localized guide topic sample missing: ${fragment}`);
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("Localization smoke passed.");
