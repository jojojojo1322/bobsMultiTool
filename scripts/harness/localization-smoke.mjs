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
  "priorityGuideLeadSections",
  "localizedGuideSections",
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
  "contrastRatio",
  "contrastPreviewText",
  "colorValues",
  "localizedResultToolUi",
  "validationResult",
  "labelKey",
  "getModeLabel",
  "textMetrics",
  "openGraphTags",
  "faviconMarkup",
  "convertedCssUnits",
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
  "<span className=\"text-sm font-medium\">Foreground</span>",
  "<span className=\"text-sm font-medium\">Background</span>",
  "        Preview text for contrast checking.",
  "title=\"Color values\"",
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
    'badge: "Developer workbench"',
    "Workbench developer",
    "Workbench lap trinh",
    "metadata, locale",
    "metadata、locale",
    "smoke check",
    "smoke checks",
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
  "เครื่องมือ developer",
  "व्यावहारिक developer utilities",
  "Browser यह",
  "developer tool है",
  "secret production",
  "workflow development",
  "Workflow utilitas",
  "Workflow tien",
  "workflow เครื่อง",
  "workflow ใช้",
  "workflow Web SEO",
  "Workbench de desenvolvimento",
  "developer utilities की",
  "Tool browser cepat",
  "ka input kahan process hota hai",
  "Output yahan dikhega",
  "Output यहां दिखेगा",
  "Output akan muncul",
  "Common MIME type nahi mila",
  "Common MIME type नहीं मिला",
  "Five-field cron se minute",
  "HTTP status aur DNS records se public deploy",
  "Development passwords",
  "मुफ्त online",
  "online upkaran",
  "input flow",
  "output shape",
  "Copy करने",
  "result verify",
  "छोटी practical guide",
  "Browser-based developer उपकरण",
  "Production secrets",
  "tool browser",
  "server endpoint",
  "Input umum",
  "Output umum",
  "alur input",
  "bentuk output",
  "input saya",
  "endpoint kecil",
  "secret produksi",
  "endpoint server",
  "Input kecil",
  "Browser tidak bisa",
  "बनाए गए output",
  "internal hostname या",
  "bí mật production",
  "hệ thống production",
  "output trước",
  "endpoint nhỏ",
  "hostname nội bộ",
  "flow อินพุต",
  "endpoint ขนาดเล็ก",
  "ข้อมูลลับ production",
  "ระบบ production",
  "hostname ภายใน",
  "เป็น draft",
  "ยืนยัน runtime",
  "endpoint صغير",
  "endpoint الخادم",
  "endpoint خادم",
  "endpoints البعيدة",
  "وFAQ",
  "Dinh dang JSON",
  "Kiem tra status code",
  "Page search और social preview",
  "Layout, cards, forms",
  "redirect chain",
  "URL components，用于 query strings",
  "URL components，用於 query strings",
  "Query strings, पुनर्निर्देशन params",
  "XML strings को format/minify",
  "XML strings को व्यवस्थित",
  "CSV rows और JSON arrays",
  "CSV rows dan JSON arrays",
  "CSV rows và JSON arrays",
  "CSV rows กับ JSON arrays",
  "docs, templates और सुरक्षित text display",
  "Open Graph title, description, URL और image fields preview",
  "User-agent string parse",
  "Same date/time",
  "Huong dan meta tags",
  "Dau vao cua",
  "Ket qua se hien thi tai day",
  "Chinh sach rieng tu",
  "Cong cu mien phi",
  "साफ 설명",
  "अलग 화면",
  "API response, config और log JSON",
  "sample text पर",
  "capture groups तुरंत",
  "temporary access के लिए",
  "seed development",
  "placeholder text có độ dài",
  "secret uji",
  "Sample JSON से",
  "sample JSON 推断",
  "sample JSON 推斷",
  "sample JSON para acelerar",
  "sample JSON pour accelerer",
  "sample JSON untuk mempercepat",
  "sample JSON để tạo nhanh",
  "sample JSON เพื่อสร้าง",
  "JSON payloads 运行 JSONPath-style selectors",
  "JSON payloads 執行 JSONPath-style selectors",
  "JSON payloads पर JSONPath-style selectors",
  "JSONPath-style selectors trên JSON payloads",
  "JSONPath-style selectors กับ JSON payloads",
  "compact HTML snippets",
  "HTML snippets compact",
  "Compact CSS rules",
  "compact CSS rules",
  "JavaScript snippets，让 functions",
  "JavaScript snippets，讓 functions",
  "Small JavaScript snippets",
  "JavaScript snippets nhỏ",
  "functions, objects और callbacks",
  "comments और whitespace",
  "Redirect debug के लिए",
  "Headers और upload checks",
  "robots.txt rules",
  "XML sitemap entries",
  "整理表单验证、route matching",
  "Five-field cron से minute",
  "Search snippets, social previews",
  "duplicate pages के लिए important meta tags की guide",
  "responsive preview में",
  "debug mạng",
  "debug เครือข่าย",
  "debug للشبكة",
  "SQL formatting का",
  "Text cleanup का",
  "Logs, fixtures",
  "sortable ULID identifiers",
  "छोटा output",
  "output compare",
  "CSS rules को format",
  "JavaScript अंशों को format",
]) {
  if (localizedContent.includes(fragment)) failures.push(`localized content should avoid mixed untranslated visible fragment: ${fragment}`);
  if (legalContent.includes(fragment)) failures.push(`localized legal content should avoid mixed untranslated visible fragment: ${fragment}`);
  if (dictionaries.includes(fragment)) failures.push(`localized dictionary should avoid mixed untranslated visible fragment: ${fragment}`);
}

for (const fragment of [
  '"Markdown Previewer": "Markdown 미리보기"',
  '"Text Sort and Dedupe": "텍스트 정렬/중복 제거"',
  '"Word Character Counter": "단어/문자 카운터"',
  '"CSS Unit Converter": "CSS 단위 변환기"',
  '"CSS Clamp Generator": "CSS Clamp 생성기"',
  '"Password Generator": "पासवर्ड जनरेटर"',
  '"Markdown Previewer": "Markdown प्रीव्यू"',
  '"Text Sort and Dedupe": "Sắp xếp và lọc trùng văn bản"',
  '"Word Character Counter": "Đếm từ và ký tự"',
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
  'hi: "API प्रतिक्रिया, सेटिंग और लॉग JSON',
  'id: "Rapikan JSON',
  'vi: "Định dạng JSON',
  'th: "จัดรูปแบบ JSON',
  'ar: "نسق JSON',
]) {
  if (!localizedContent.includes(fragment)) failures.push(`long-tail priority locale prose missing: ${fragment}`);
}

for (const fragment of [
  "说明 JSON、YAML、CSV 转换时如何检查结构丢失",
  "Criterios para gerar senhas, tokens, UUIDs e ULIDs",
  "HTTP स्थिति और DNS रिकॉर्ड से सार्वजनिक तैनाती",
  "คู่มือใช้การจัด CSS การย่อ การแปลงหน่วย",
  "دليل لاستخدام تنسيق CSS وتصغيره",
  "整理表单验证、路由匹配",
  "five-field cron से मिनट",
  "Guia dos meta tags que importam",
  "MD5, SHA-1, SHA-256 और SHA-512",
  "trạng thái HTTP cùng bản ghi DNS",
  "Hướng dẫn chuyển đổi JSON, YAML và CSV",
  "ขั้นตอน Web SEO สำหรับ robots.txt",
  "سير عمل لترتيب النص وإزالة التكرار",
  "डेटा की बनावट पहले तय करें",
  "Separe identificadores de credenciais reais",
  "Kiểm tra điểm thu thập dữ liệu trước",
  "จำกัดปัญหาด้วยสัญญาณสาธารณะ",
  "حدد هدف التخطيط اولا",
  "Simpan teks asli lebih dulu",
]) {
  if (!localizedContent.includes(fragment)) failures.push(`long-tail priority guide description missing: ${fragment}`);
}

for (const fragment of [
  "व्यावहारिक डेवलपर यूटिलिटी",
  "เครื่องมือนักพัฒนาที่ใช้งานจริง",
  "أدوات مطور عملية",
]) {
  if (!dictionaries.includes(fragment)) failures.push(`localized metadata override missing: ${fragment}`);
}

for (const fragment of ["Sicherer Generator-Ablauf", "安全なランダム生成フロー", "보안 랜덤 생성 흐름", "سير عمل مولد آمن"]) {
  if (!localizedContent.includes(fragment)) failures.push(`localized guide topic sample missing: ${fragment}`);
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("Localization smoke passed.");
