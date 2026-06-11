import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const resizable = fs.readFileSync(path.join(root, "apps/main/src/components/ui/resizable.tsx"), "utf8");
const workspace = fs.readFileSync(path.join(root, "apps/main/src/features/tools/tool-workspace.tsx"), "utf8");
const toolComponents = fs.readFileSync(path.join(root, "apps/main/src/features/tools/tool-components.tsx"), "utf8");
const directory = fs.readFileSync(path.join(root, "apps/main/src/features/tools/tool-directory.tsx"), "utf8");
const dictionaries = fs.readFileSync(path.join(root, "apps/main/src/features/i18n/dictionaries.ts"), "utf8");
const localizedContent = fs.readFileSync(path.join(root, "apps/main/src/features/i18n/localized-content.ts"), "utf8");
const toolsIndex = fs.readFileSync(path.join(root, "apps/main/src/app/tools/page.tsx"), "utf8");
const localizedToolsIndex = fs.readFileSync(path.join(root, "apps/main/src/app/[locale]/tools/page.tsx"), "utf8");
const guideDetail = fs.readFileSync(path.join(root, "apps/main/src/app/guides/[slug]/page.tsx"), "utf8");
const localizedGuideDetail = fs.readFileSync(path.join(root, "apps/main/src/app/[locale]/guides/[slug]/page.tsx"), "utf8");
const rootLayout = fs.readFileSync(path.join(root, "apps/main/src/app/layout.tsx"), "utf8");
const googleAdsense = fs.readFileSync(path.join(root, "apps/main/src/components/GoogleAdsense.tsx"), "utf8");

const failures = [];
if (!rootLayout.includes("NEXT_PUBLIC_ENABLE_ADSENSE === \"true\"")) failures.push("AdSense script must require an explicit public enable flag");
if (!googleAdsense.includes("enabled = false")) failures.push("AdSense component must be disabled by default");
if (!googleAdsense.includes("export function GoogleAdUnit")) failures.push("GoogleAdUnit must exist for explicit in-flow ad placements");
if (!googleAdsense.includes("data-bobob-ad-slot")) failures.push("GoogleAdUnit must expose a stable non-visible QA slot attribute");
if (googleAdsense.includes("overlays:")) failures.push("AdSense auto overlay options must not be enabled from the app shell");
for (const fragment of [
  "bobob:workbench-layout",
  "defaultLeftWidth = 280",
  "defaultRightWidth = 340",
  "minLeftWidth = 220",
  "minRightWidth = 280",
  "minCenterWidth = 560",
  "localStorage",
  "ResizeObserver",
  "clampLayoutToAvailable",
  "Resize left sidebar",
  "Resize right sidebar",
  "role=\"separator\"",
  "data-resizable-handle",
  "lg:grid-cols-[var(--bobob-grid-columns)]",
  "minmax(0,1fr)",
]) {
  if (!resizable.includes(fragment)) failures.push(`resizable layout missing ${fragment}`);
}

if (!workspace.includes("<Sheet")) failures.push("mobile navigation Sheet fallback missing");
if (!directory.includes("ToolSearchPanel")) failures.push("tool directory must include shared search panel");
if (!directory.includes("toolCategories.map")) failures.push("tool directory must expose category sections");
if (!directory.includes("data-acquisition-clusters")) failures.push("tool directory acquisition clusters must expose a stable QA attribute");
if (toolsIndex.includes("redirect(") || localizedToolsIndex.includes("redirect(withLocale(\"/tools/regex-tester\"")) failures.push("tools directory pages must not redirect to a single tool");
if (!workspace.includes("rounded-lg border bg-background")) failures.push("single-shell workbench border missing");
if (!workspace.includes("bobob-workbench-shell")) failures.push("workbench shell must expose dark/light surface separation class");
if (!workspace.includes("bobob-primary-work-area")) failures.push("primary work area must expose dark/light surface separation class");
if (!workspace.includes("bobob-support-sections")) failures.push("support sections must expose dark/light surface separation class");
if (!workspace.includes("lg:h-[calc(100vh-7rem)]")) failures.push("desktop workbench shell must keep a fixed height with internal panel scroll");
if (!workspace.includes("h-full min-h-0")) failures.push("workbench panels must use min-h-0 for internal scrolling");
if (!workspace.includes("withLocale(\"/\", locale)")) failures.push("detail top bar home link missing");
if (!workspace.includes("function ToolQuickStart")) failures.push("tool detail central quick-start section missing");
if (!workspace.includes("data-tool-quick-start")) failures.push("tool detail quick-start section must expose a stable QA attribute");
if (!workspace.includes("tool.inputExamples.slice")) failures.push("tool detail quick-start must use registry inputExamples");
if (!workspace.includes("tool.useCases.slice")) failures.push("tool detail quick-start must use registry useCases");
if (!workspace.includes("function ToolReviewStrip")) failures.push("tool detail central review strip missing");
if (!workspace.includes("data-tool-review-strip")) failures.push("tool detail review strip must expose a stable QA attribute");
if (!workspace.includes("dictionary.tool.failureCases")) failures.push("tool detail review strip must expose failure cases");
if (!workspace.includes("dictionary.tool.preCopyChecklist")) failures.push("tool detail review strip must expose pre-copy checklist");
if (!workspace.includes("id=\"tool-surface\"") || !workspace.includes("data-tool-surface")) failures.push("mobile workbench must anchor the primary tool surface");
if (!workspace.includes("function PrimaryWorkArea")) failures.push("tool detail primary work area frame missing");
if (!workspace.includes("data-primary-work-area")) failures.push("primary input/output work area must expose a stable QA attribute");
if (!workspace.includes("data-primary-work-content")) failures.push("primary work area must isolate the working tool content");
if (!workspace.includes("dictionary.toolUi.input") || !workspace.includes("dictionary.toolUi.output")) failures.push("primary work area must label input/output with localized tool UI labels");
if (!workspace.includes("data-tool-support-sections")) failures.push("support sections must be grouped separately from the primary work area");
const toolSurfaceRenderIndex = workspace.indexOf("id=\"tool-surface\"");
const quickStartRenderIndex = workspace.indexOf("<ToolQuickStart tool={tool} dictionary={dictionary} />", toolSurfaceRenderIndex);
const reviewStripRenderIndex = workspace.indexOf("<ToolReviewStrip tool={tool} dictionary={dictionary} />", toolSurfaceRenderIndex);
const supportSectionsRenderIndex = workspace.indexOf("data-tool-support-sections", toolSurfaceRenderIndex);
const nextActionsRenderIndex = workspace.indexOf("<ToolNextActions tool={tool} locale={locale} dictionary={dictionary} />", toolSurfaceRenderIndex);
const sessionChildrenIndex = workspace.indexOf("{children}");
const sessionControlsIndex = workspace.indexOf("data-tool-session-controls");
if (toolSurfaceRenderIndex === -1 || quickStartRenderIndex === -1 || quickStartRenderIndex < toolSurfaceRenderIndex) failures.push("desktop quick-start support content must render after the primary tool surface");
if (toolSurfaceRenderIndex === -1 || reviewStripRenderIndex === -1 || reviewStripRenderIndex < toolSurfaceRenderIndex) failures.push("desktop review support content must render after the primary tool surface");
if (supportSectionsRenderIndex === -1 || supportSectionsRenderIndex < toolSurfaceRenderIndex) failures.push("support sections must render after the primary tool surface");
if (reviewStripRenderIndex === -1 || nextActionsRenderIndex === -1 || nextActionsRenderIndex < reviewStripRenderIndex) failures.push("related next actions should render after examples and review support sections");
if (sessionChildrenIndex === -1 || sessionControlsIndex === -1 || sessionControlsIndex < sessionChildrenIndex) failures.push("tool session utility controls must render after the working tool component");
if (!workspace.includes("NEXT_PUBLIC_ADSENSE_TOOL_RESULT_SLOT")) failures.push("tool result ad unit must be gated by an explicit slot env var");
if (!workspace.includes("NEXT_PUBLIC_ADSENSE_REFERENCE_SLOT")) failures.push("reference panel ad unit must be gated by an explicit slot env var");
if (!workspace.includes("position=\"tool-result\"")) failures.push("tool result ad position missing");
if (!workspace.includes("position=\"reference-panel\"")) failures.push("reference panel ad position missing");
if (!workspace.includes("function MobileReferenceAccordion")) failures.push("mobile compact reference accordion missing");
if (!workspace.includes("data-mobile-reference-sections")) failures.push("mobile reference accordion must expose a stable QA attribute");
if (!workspace.includes("function MobileActionBar")) failures.push("mobile sticky action bar missing");
if (!workspace.includes("data-mobile-action-bar")) failures.push("mobile sticky action bar must expose a stable QA attribute");
if (!workspace.includes("pb-20 lg:pb-0")) failures.push("mobile center panel must reserve space for the sticky action bar");
if (!workspace.includes("<MobileReferenceAccordion tool={tool} locale={locale} dictionary={dictionary} />")) failures.push("mobile reference accordion must render in the central flow after the tool surface");
if (!workspace.includes("<MobileActionBar tool={tool} locale={locale} dictionary={dictionary}")) failures.push("mobile action bar must render outside the workbench shell");
if (!workspace.includes("function ToolNextActions")) failures.push("tool detail center panel next-action strip missing");
if (!workspace.includes("data-tool-next-actions")) failures.push("tool detail next-action strip must expose a stable QA attribute");
if (!workspace.includes("related.useCases[0]")) failures.push("tool detail next-action links must expose localized use-case context");
if (!guideDetail.includes("withLocale(\"/\", defaultLocale)") || !guideDetail.includes("Bob&apos;s Multi Tool")) failures.push("default guide detail home link missing");
if (!localizedGuideDetail.includes("withLocale(\"/\", locale)") || !localizedGuideDetail.includes("Bob&apos;s Multi Tool")) failures.push("localized guide detail home link missing");
if (!workspace.includes("bobob:tool-nav-scroll")) failures.push("tool navigation scroll persistence missing");
if (!workspace.includes("data-tool-navigation-scroll")) failures.push("tool navigation scroll container should expose a stable QA attribute");
if (!workspace.includes("React.useLayoutEffect")) failures.push("tool navigation scroll restore must happen before paint");
if (!workspace.includes("onScroll={persistScroll}")) failures.push("tool navigation scroll position is not persisted");
if (!workspace.includes("saveCurrentScroll")) failures.push("tool navigation must save scroll immediately before navigation");
if (!workspace.includes("onPointerDown={saveCurrentScroll}")) failures.push("tool navigation pointer navigation must preserve scroll");
if (!workspace.includes("window.setTimeout(restore, 80)")) failures.push("tool navigation restore should retry after route hydration");
if (!workspace.includes("scroll={false}")) failures.push("tool navigation links must not reset document scroll");
if (!workspace.includes("bobob:recent-tools")) failures.push("local-only recent tools storage missing");
if (!workspace.includes("data-recent-tools")) failures.push("recent tools navigation section should expose a stable QA attribute");
if (!workspace.includes("getLocalizedRelatedTools(recentSlugs, locale)")) failures.push("recent tools should use localized tool labels");
if (!dictionaries.includes("recentTools")) failures.push("recent tools label missing from dictionary");
if (!workspace.includes("bobob:favorite-tools")) failures.push("local-only favorite tools storage missing");
if (!workspace.includes("data-favorite-tools")) failures.push("favorite tools navigation section should expose a stable QA attribute");
if (!workspace.includes("getLocalizedRelatedTools(favoriteSlugs, locale)")) failures.push("favorite tools should use localized tool labels");
if (!workspace.includes("writeFavoriteToolSlugs(locale, nextSlugs)")) failures.push("favorite tools must persist only through the local favorite writer");
if (!dictionaries.includes("favoriteTools")) failures.push("favorite tools label missing from dictionary");
if (!dictionaries.includes("addFavorite") || !dictionaries.includes("removeFavorite")) failures.push("favorite action labels missing from dictionary");
if (!workspace.includes("data-copy-tool-link")) failures.push("tool detail copy-link action should expose a stable QA attribute");
if (!workspace.includes("copyToolLink")) failures.push("tool detail copy-link action missing");
if (!workspace.includes("writeClipboardText(toolUrl)")) failures.push("tool detail copy-link action must use the shared clipboard helper");
if (!workspace.includes("navigator.clipboard?.writeText")) failures.push("copy-link action must use the Clipboard API when available");
if (!workspace.includes("document.execCommand(\"copy\")")) failures.push("copy-link action must keep a fallback for restricted clipboard environments");
if (!workspace.includes("dictionary.tool.copyLink") || !workspace.includes("dictionary.tool.copiedLink")) failures.push("copy-link action labels must be localized");
if (!dictionaries.includes("copyLink") || !dictionaries.includes("copiedLink")) failures.push("copy-link labels missing from dictionary");
if (!workspace.includes("bobob:tool-session")) failures.push("local-only tool session storage missing");
if (!workspace.includes("data-tool-session")) failures.push("tool session controls should expose a stable QA attribute");
if (!workspace.includes("restoreLastWork") || !workspace.includes("clearLocalHistory")) failures.push("tool session restore/clear labels missing from workspace");
if (!workspace.includes("initialSessionRef")) failures.push("tool session restore should use the entry-time saved snapshot");
if (workspace.includes("element.id || element.getAttribute(\"data-session-key\")")) failures.push("tool session keys must not prefer generated React ids over stable keys");
if (!dictionaries.includes("localSessionTitle") || !dictionaries.includes("localSessionBody") || !dictionaries.includes("restoreLastWork") || !dictionaries.includes("clearLocalHistory")) failures.push("tool session labels missing from dictionary");
if (workspace.includes("dictionary.tool.demand") || workspace.includes("demandLabel")) failures.push("tool detail must not expose demand wording");
if (workspace.includes("tool.contentCluster")) failures.push("tool detail must not expose internal contentCluster slugs");
if (directory.includes("tool.contentCluster")) failures.push("tool directory cards must not expose internal contentCluster slugs");
if (dictionaries.includes("demand:")) failures.push("visible dictionary must not keep a demand label");
for (const [source, label] of [
  [dictionaries, "visible dictionary"],
  [localizedContent, "localized content"],
  [fs.readFileSync(path.join(root, "apps/main/src/features/i18n/legal-content.ts"), "utf8"), "localized legal content"],
  [fs.readFileSync(path.join(root, "apps/main/src/app/privacy/page.tsx"), "utf8"), "default privacy page"],
  [fs.readFileSync(path.join(root, "apps/main/src/app/terms/page.tsx"), "utf8"), "default terms page"],
]) {
  if (/Google AdSense|AdSense|after approval|approval\.|승인 후|심사와 검색|承認後|获得批准后|核准後|Tras la aprobacion|Apos aprovacao|Nach Genehmigung|Apres approbation|मंजूरी के बाद|Setelah disetujui|Sau khi được chấp thuận|หลังได้รับอนุมัติ|بعد الموافقة/.test(source)) {
    failures.push(`${label} must not expose AdSense, approval, or review-status wording to users`);
  }
}
if (localizedContent.includes("coreChip") || localizedContent.includes("growthChip") || localizedContent.includes("longTailChip")) {
  failures.push("localized content must not keep demand-tier chip copy");
}
if (workspace.includes("rounded-lg border bg-card shadow-none")) failures.push("center panel still has separate outer rounded border");
if (workspace.includes("sticky top-4")) failures.push("desktop panels still use separate sticky card layout");
if (!resizable.includes("after:bg-border")) failures.push("resize handle missing single neutral divider policy");
if (resizable.includes("border-x border-transparent")) failures.push("resize handle still uses extra border columns");
for (const fragment of ["data-http-status-details", "data-http-redirect-chain", "data-http-redirect-diagnostics", "data-http-response-headers", "data-http-header-parser", "data-http-header-summary", "data-http-header-warnings", "data-http-header-json", "data-csp-generator", "data-csp-directives", "data-csp-warnings", "data-csp-output", "rawResponse", "finalResponseHeaders", "elapsedMs", "cacheControl"]) {
  if (!toolComponents.includes(fragment)) failures.push(`HTTP status detail UI missing ${fragment}`);
}
if (!dictionaries.includes("localizedHttpStatusToolUi")) failures.push("HTTP status tool UI labels must be localized");
if (!dictionaries.includes("redirectDiagnostics") || !dictionaries.includes("redirectCanonicalChangedWarning")) failures.push("HTTP redirect diagnostics labels must be localized");
if (!dictionaries.includes("localizedHttpRedirectAdvancedToolUi") || !dictionaries.includes("redirectTemporaryWarning")) failures.push("advanced HTTP redirect diagnostics labels must be localized");
if (!dictionaries.includes("localizedHttpHeaderToolUi")) failures.push("HTTP header parser UI labels must be localized");
if (!dictionaries.includes("localizedCspGeneratorToolUi")) failures.push("CSP generator UI labels must be localized");
for (const fragment of ["data-regex-presets", "data-regex-cheat-snippets", "data-regex-result-details", "data-regex-match-list", "data-regex-generator", "data-regex-generator-results", "localizedRegexToolUi", "localizedRegexGeneratorToolUi", "localizedRegexSnippetToolUi"]) {
  const source = fragment === "localizedRegexToolUi" || fragment === "localizedRegexGeneratorToolUi" || fragment === "localizedRegexSnippetToolUi" ? dictionaries : toolComponents;
  if (!source.includes(fragment)) failures.push(`Regex detail UI missing ${fragment}`);
}
for (const fragment of ["data-json-examples", "data-json-result-details", "data-json-structure", "data-json-error-details", "localizedJsonFormatterToolUi"]) {
  const source = fragment === "localizedJsonFormatterToolUi" ? dictionaries : toolComponents;
  if (!source.includes(fragment)) failures.push(`JSON Formatter detail UI missing ${fragment}`);
}
for (const fragment of ["data-jsonpath-examples", "data-jsonpath-supported-syntax", "data-jsonpath-result-details", "data-jsonpath-matches", "data-jsonpath-warnings", "localizedJsonPathToolUi"]) {
  const source = fragment === "localizedJsonPathToolUi" ? dictionaries : toolComponents;
  if (!source.includes(fragment)) failures.push(`JSONPath Tester detail UI missing ${fragment}`);
}
for (const fragment of ["data-json-escape-examples", "data-json-escape-result-details", "data-json-escape-warnings", "localizedJsonEscapeToolUi"]) {
  const source = fragment === "localizedJsonEscapeToolUi" ? dictionaries : toolComponents;
  if (!source.includes(fragment)) failures.push(`JSON Escape detail UI missing ${fragment}`);
}
for (const fragment of ["data-yaml-examples", "data-yaml-result-details", "data-yaml-warnings", "data-compose-diagnostics", "data-compose-service-preview", "data-compose-warnings", "localizedYamlValidatorToolUi", "localizedDockerComposeToolUi"]) {
  const source = fragment === "localizedYamlValidatorToolUi" || fragment === "localizedDockerComposeToolUi" ? dictionaries : toolComponents;
  if (!source.includes(fragment)) failures.push(`YAML Validator detail UI missing ${fragment}`);
}
for (const fragment of ["data-env-examples", "data-env-result-details", "data-env-entry-list", "data-env-warnings", "localizedEnvParserToolUi"]) {
  const source = fragment === "localizedEnvParserToolUi" ? dictionaries : toolComponents;
  if (!source.includes(fragment)) failures.push(`ENV Parser detail UI missing ${fragment}`);
}
for (const fragment of ["data-csv-examples", "data-csv-result-details", "data-csv-preview", "data-csv-warnings", "localizedCsvToolUi"]) {
  const source = fragment === "localizedCsvToolUi" ? dictionaries : toolComponents;
  if (!source.includes(fragment)) failures.push(`CSV JSON detail UI missing ${fragment}`);
}
for (const fragment of ["data-jwt-examples", "data-jwt-result-details", "data-jwt-time-window", "data-jwt-claims", "data-jwt-warnings", "localizedJwtToolUi"]) {
  const source = fragment === "localizedJwtToolUi" ? dictionaries : toolComponents;
  if (!source.includes(fragment)) failures.push(`JWT Decoder detail UI missing ${fragment}`);
}
for (const fragment of ["data-base64-examples", "base64PngDataUrlExample", "data-base64-result-details", "data-base64-variants", "data-base64-diagnostics", "data-base64-shape", "data-base64-image-preview", "data-base64-warnings", "localizedBase64ToolUi", "localizedBase64DiagnosticsToolUi", "localizedBase64ImageToolUi"]) {
  const source = fragment.startsWith("localizedBase64") ? dictionaries : toolComponents;
  if (!source.includes(fragment)) failures.push(`Base64 detail UI missing ${fragment}`);
}
if (!toolComponents.includes("result.imagePreview?.dataUrl")) failures.push("Base64 image decode should expose a copyable data URL instead of raw binary output");
for (const fragment of ["data-cron-presets", "data-cron-scheduler-semantics", "data-cron-result-details", "data-cron-fields", "data-cron-runtime-context", "data-cron-next-runs", "data-cron-warnings", "localizedCronToolUi", "localizedCronRuntimeToolUi", "cronDayOverlapOrWarning"]) {
  const source = fragment === "localizedCronToolUi" || fragment === "localizedCronRuntimeToolUi" || fragment === "cronDayOverlapOrWarning" ? dictionaries : toolComponents;
  if (!source.includes(fragment)) failures.push(`Cron detail UI missing ${fragment}`);
}
for (const fragment of ["data-uuid-examples", "data-uuid-result-details", "data-uuid-warnings"]) {
  if (!toolComponents.includes(fragment)) failures.push(`UUID Generator detail UI missing ${fragment}`);
}
for (const fragment of ["data-hash-examples", "data-hash-hmac-options", "data-hash-result-details", "data-hash-algorithms", "data-hash-warnings", "localizedHashHmacToolUi", "hmacSecretWarning"]) {
  const source = fragment === "localizedHashHmacToolUi" || fragment === "hmacSecretWarning" ? dictionaries : toolComponents;
  if (!source.includes(fragment)) failures.push(`Hash Generator detail UI missing ${fragment}`);
}
for (const fragment of ["data-password-mode", "data-password-options", "data-password-passphrase-options", "data-password-strength", "data-password-warnings", "passphraseWords"]) {
  const source = fragment === "passphraseWords" ? dictionaries : toolComponents;
  if (!source.includes(fragment)) failures.push(`Password Generator detail UI missing ${fragment}`);
}
if (!dictionaries.includes("localizedPasswordPassphraseToolUi") || !dictionaries.includes("passphraseCompatibilityWarning")) failures.push("Password passphrase UI labels must be localized");
for (const fragment of ["data-random-token-examples", "data-random-token-diagnostics", "data-random-token-warnings", "localizedRandomTokenToolUi"]) {
  const source = fragment === "localizedRandomTokenToolUi" ? dictionaries : toolComponents;
  if (!source.includes(fragment)) failures.push(`Random Token Generator detail UI missing ${fragment}`);
}
for (const fragment of ["data-qr-examples", "data-qr-payload-builder", "data-qr-builder-fields", "data-qr-result-details", "data-qr-diagnostics", "data-qr-payload-type", "data-qr-warnings", "localizedQrBuilderToolUi", "localizedQrDiagnosticsToolUi"]) {
  const source = fragment === "localizedQrBuilderToolUi" || fragment === "localizedQrDiagnosticsToolUi" ? dictionaries : toolComponents;
  if (!source.includes(fragment)) failures.push(`QR Code Generator detail UI missing ${fragment}`);
}
if (!dictionaries.includes("localizedGeneratorToolUi")) failures.push("generator/security tool detail UI labels must be localized");
for (const fragment of ["data-color-examples", "data-color-preview", "data-color-result-details", "data-color-diagnostics", "data-color-swatches", "data-color-warnings"]) {
  if (!toolComponents.includes(fragment)) failures.push(`Color Converter detail UI missing ${fragment}`);
}
for (const fragment of ["data-dns-examples", "data-dns-result-details", "data-dns-diagnostics", "data-dns-record-list", "data-dns-warnings"]) {
  if (!toolComponents.includes(fragment)) failures.push(`DNS Lookup detail UI missing ${fragment}`);
}
if (!dictionaries.includes("localizedColorDnsToolUi") || !dictionaries.includes("localizedColorDiagnosticsToolUi")) failures.push("Color and DNS detail UI labels must be localized");
for (const fragment of ["data-sql-examples", "data-sql-result-details", "data-sql-diagnostics", "data-sql-clause-checks", "data-sql-table-list", "data-sql-warnings"]) {
  if (!toolComponents.includes(fragment)) failures.push(`SQL Formatter detail UI missing ${fragment}`);
}
for (const fragment of ["data-css-examples", "data-css-result-details", "data-css-diagnostics", "data-css-selector-list", "data-css-warnings"]) {
  if (!toolComponents.includes(fragment)) failures.push(`CSS Formatter detail UI missing ${fragment}`);
}
for (const fragment of ["data-javascript-examples", "data-javascript-result-details", "data-javascript-diagnostics", "data-javascript-signal-list", "data-javascript-warnings"]) {
  if (!toolComponents.includes(fragment)) failures.push(`JavaScript Formatter detail UI missing ${fragment}`);
}
for (const fragment of ["data-markdown-tool", "data-markdown-table-generator", "data-markdown-table-examples", "data-markdown-table-details", "data-markdown-table-warnings", "data-markdown-preview"]) {
  if (!toolComponents.includes(fragment)) failures.push(`Markdown Previewer table workflow missing ${fragment}`);
}
if (!dictionaries.includes("localizedCodeFormatterToolUi") || !dictionaries.includes("localizedSqlDiagnosticsToolUi")) failures.push("SQL/CSS/JavaScript formatter labels must be localized");
if (!dictionaries.includes("localizedMarkdownToolUi")) failures.push("Markdown table generator labels must be localized");

for (const file of [
  "apps/main/src/features/tools/tool-search-panel.tsx",
  "apps/main/src/app/page.tsx",
  "apps/main/src/app/[locale]/page.tsx",
]) {
  const source = fs.readFileSync(path.join(root, file), "utf8");
  if (source.includes("tool.demandTier")) failures.push(`${file} exposes demand tier in the UI`);
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("Layout smoke passed.");
