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
  ["agents", "registry-backed `inputExamples`, `useCases`, `failureCases`, `preCopyChecklist`, and related next actions"],
  ["agents", "compact review strip with localized failure cases and pre-copy checklist items"],
  ["agents", "Mobile tool detail pages must be task-first"],
  ["agents", "Core tool working surfaces should render structured"],
  ["agents", "Regex must show preset patterns, high-use regex snippets"],
  ["agents", "local regex-from-examples draft generator"],
  ["agents", "JSON Formatter must show practical examples"],
  ["agents", "JSON path preview with copyable paths"],
  ["agents", "JSONPath Tester must show example selectors"],
  ["agents", "wildcard and recursive key searches"],
  ["agents", "JWT Decoder must show example tokens"],
  ["agents", "iat/nbf/exp/lifetime time-window summary"],
  ["agents", "Base64 Encoder Decoder must show practical examples"],
  ["agents", "copyable data URL output for detected images"],
  ["agents", "decoded content shape, JSON key count, JWT segment signal"],
  ["agents", "Cron Expression Generator must show localized presets"],
  ["agents", "selectable day-of-month/day-of-week OR/AND matching semantics"],
  ["agents", "browser timezone runtime context"],
  ["agents", "UUID Generator must show count presets"],
  ["agents", "Hash Generator must show example inputs"],
  ["agents", "digest/HMAC mode selection"],
  ["agents", "HMAC secret diagnostics"],
  ["agents", "Password Generator must show random-password and passphrase modes"],
  ["agents", "passphrase word count/separator/number controls"],
  ["agents", "Random Token Generator must show session/API/CSRF/webhook presets"],
  ["agents", "QR Code Generator must show URL, Wi-Fi, email, and vCard examples"],
  ["agents", "payload builder for those payload types"],
  ["agents", "payload type, destination host, tracking parameter count, scan density"],
  ["agents", "Color Converter must actually support HEX, RGB, and HSL input"],
  ["agents", "AA/AAA diagnostics"],
  ["agents", "DNS Lookup must show record examples"],
  ["agents", "record-type diagnostics"],
  ["agents", "SQL, CSS, and JavaScript formatters must show realistic examples"],
  ["agents", "SQL surfaces must show query type"],
  ["agents", "table-reference chips"],
  ["agents", "CSS surfaces must also show selector previews"],
  ["agents", "JavaScript surfaces must show module syntax"],
  ["agents", "compression ratio"],
  ["agents", "JSON Escape, YAML Validator, and ENV Parser Validator must show realistic examples"],
  ["agents", "YAML Validator must also cover Docker Compose Validator/Formatter behavior"],
  ["agents", "CSV JSON Converter must also cover the CSV Cleaner workflow"],
  ["agents", "Markdown Previewer must also cover the Markdown Table Generator workflow"],
  ["agents", "Core acquisition tools need at least three real `inputExamples`"],
  ["agents", "three priority `failureCases`"],
  ["agents", "three priority `preCopyChecklist` items"],
  ["agents", "`json-escape-unescape`, `yaml-validator`, and `env-parser-validator` are approved data/config-cluster breadth additions"],
  ["agents", "Core acquisition tools in Korean, Japanese, Spanish, and German"],
  ["agents", "slug-specific localized priority failure cases and pre-copy checklist items"],
  ["agents", "Session-depth related tools"],
  ["agents", "Korean, Japanese, Spanish, and German priority intent copy"],
  ["agents", "Pointer-reactive visual effects"],
  ["agents", "restrained grid-line pointer background"],
  ["agents", "requestAnimationFrame-driven CSS variables"],
  ["agents", "harness:pointer-background"],
  ["agents", "avoid adding WebGL, `ogl`, or `framer-motion`"],
  ["agents", "real resizable left and right sidebars"],
  ["agents", "clamped to the workbench container"],
  ["agents", "preserve the sidebar scroll position"],
  ["agents", "hop timing/cache details"],
  ["agents", "allowlisted final response headers"],
  ["agents", "Demand tier is an internal prioritization"],
  ["agents", "`contentCluster` is an internal search/SEO grouping field"],
  ["agents", "Revenue operations are internal"],
  ["agents", "NEXT_PUBLIC_ENABLE_ADSENSE=true"],
  ["agents", "Do not enable bottom overlays"],
  ["agents", "visible prose must pass through localized content resolvers"],
  ["agents", "Non-English common dictionary prose"],
  ["agents", "Locale override blocks"],
  ["agents", "privacy/server/local chips"],
  ["agents", "Long-tail locale templates"],
  ["agents", "mixed-script accidents"],
  ["agents", "paste or enter input"],
  ["agents", "copy only after review"],
  ["agents", "Hindi acquisition copy"],
  ["agents", "Hindi reusable templates"],
  ["agents", "Indonesian reusable templates"],
  ["agents", "Vietnamese acquisition copy"],
  ["agents", "Locale switcher labels"],
  ["agents", "guide.description"],
  ["agents", "Twitter title/description"],
  ["agents", "SoftwareApplication`, `FAQPage`, and `BreadcrumbList`"],
  ["agents", "Long-tail acquisition locales"],
  ["agents", "every registered tool"],
  ["agents", "Long-tail guide descriptions"],
  ["agents", "Every guide needs topic-specific long-tail guide lead sections"],
  ["agents", "root `<html lang>`"],
  ["agents", "getLocalizedLegalContent"],
  ["agents", "one aligned shell"],
  ["agents", "x-default"],
  ["agents", "sitemap index"],
  ["agents", "Sitemap `lastmod`"],
  ["agents", "full per-locale URL coverage"],
  ["agents", "/{locale}/tools"],
  ["agents", "localized acquisition workflow clusters"],
  ["agents", "Workflow recipes must stay local-first"],
  ["agents", "workflow recipe cards"],
  ["agents", "task-shaped search queries"],
  ["agents", "Core feature additions inside acquisition tools"],
  ["agents", "Base64 image/data URL preview"],
  ["agents", "SearchAction schema"],
  ["agents", "related next-action links"],
  ["agents", "preserve the registry `relatedTools` order"],
  ["agents", "localized use-case context"],
  ["agents", "Recent, favorite, and tool session memory must stay local-only"],
  ["agents", "restore-last-work actions"],
  ["agents", "Favorite sections and save/remove actions"],
  ["agents", "Tool directory acquisition clusters"],
  ["agents", "Server route tools must reject private/reserved hosts"],
  ["agents", "`redirectChain` array"],
  ["agents", "HTTP Status Checker UI must render"],
  ["agents", "redirect diagnostics"],
  ["agents", "local HTTP header parser"],
  ["agents", "CSP generator"],
  ["agents", "harness:seo-opportunities"],
  ["agents", "harness:seo-measured"],
  ["agents", "BOBOB_REQUIRE_MEASURED_SEO"],
  ["agents", "BOBOB_REQUIRED_MEASURED_PATHS"],
  ["agents", "reports/search-console.csv"],
  ["agents", "reports/search-console.tsv"],
  ["agents", "harness:seo-opportunities:smoke"],
  ["agents", "titleDescriptionRecommendations"],
  ["agents", "inputWarnings"],
  ["agents", "measurementBacklog"],
  ["agents", "metadataRewriteReadiness"],
  ["agents", "export-packet"],
  ["agents", "npm run seo:export-packet"],
  ["agents", "long-tail search intent seeds"],
  ["agents", "npm run seo:report"],
  ["agents", "Search results must expose compact match-signal chips"],
  ["agents", "failure cases, pre-copy checklist items"],
  ["agents", "harness:seo-templates"],
  ["agents", "reports/templates/*.example.csv"],
  ["agents", "visual screenshot smoke"],
  ["agents", "unused AdSense placeholder"],
  ["agents", "legacy standalone app directories"],
  ["agents", "Do not reintroduce `packages/ui`, `turbo`"],
  ["agents", "package-lock.json"],
  ["agents", "harness:legacy"],
  ["agents", "harness:deployment-status"],
  ["agents", "Audit -> One Slice -> Harness -> Browser Check -> Stop"],
  ["agents", "BOBOB_REQUIRE_NO_LEGACY_VERCEL"],
  ["agents", "docs/legacy-apps-archive.md"],
  ["tool", "demandTier"],
  ["tool", "aliases"],
  ["tool", "monetizationTier"],
  ["tool", "supportedLocales"],
  ["tool", "privacyMode"],
  ["tool", "requiresServer"],
  ["tool", "failure cases"],
  ["tool", "Core acquisition tools need at least three real `inputExamples`"],
  ["tool", "three priority `failureCases`"],
  ["tool", "three priority `preCopyChecklist` items"],
  ["tool", "pre-copy checklist"],
  ["tool", "related next actions"],
  ["tool", "workflow recipe"],
  ["tool", "task-shaped search queries"],
  ["tool", "feature-specific intent"],
  ["tool", "Base64 image/data URL preview"],
  ["tool", "ordered as the intended next-action path"],
  ["tool", "localized next-action context"],
  ["tool", "Confirm mobile detail behavior stays task-first"],
  ["tool", "Do not add user-facing AdSense"],
  ["tool", "server route tools"],
  ["tool", "redirect-chain details"],
  ["tool", "cache-control, and elapsed time"],
  ["tool", "allowlisted final-response headers"],
  ["tool", "WCAG AA/AAA diagnostics"],
  ["tool", "data/config tools such as Base64, JSON Escape, YAML Validator, and ENV Parser Validator"],
  ["tool", "YAML Validator must also expose Docker Compose service/image/build/port/volume/environment/dependency diagnostics"],
  ["tool", "Base64-like tools must expose decoded content shape"],
  ["tool", "Random Token must expose session/API/CSRF/webhook presets"],
  ["tool", "QR-like tools must expose URL/Wi-Fi/email/vCard payload builders"],
  ["tool", "SQL formatter updates must include query type"],
  ["tool", "CSS formatter/minifier updates must include selector preview"],
  ["tool", "JavaScript formatter/minifier updates must include import/export count"],
  ["tool", "CSV Cleaner behavior belongs inside CSV JSON Converter"],
  ["tool", "Regex Generator from examples belongs inside Regex Tester"],
  ["tool", "HTTP Header Parser behavior belongs inside HTTP Status Checker"],
  ["tool", "CSP Generator behavior belongs inside HTTP Status Checker"],
  ["tool", "Markdown Table Generator behavior belongs inside Markdown Previewer"],
  ["tool", "Docker Compose Validator/Formatter behavior belongs inside YAML Validator"],
  ["tool", "slug-specific long-tail visible descriptions"],
  ["tool", "/{locale}/tools"],
  ["tool", "Do not add a static"],
  ["tool", "only app workspace"],
  ["tool", "harness:legacy"],
  ["design", "Light/Dark"],
  ["design", "ThemeToggle"],
  ["design", "Pointer-reactive background motion"],
  ["design", "restrained grid-line motion"],
  ["design", "requestAnimationFrame-driven smoothing"],
  ["design", "harness:pointer-background"],
  ["design", "no WebGL, `ogl`, or `framer-motion` dependency"],
  ["design", "compact quick-start row"],
  ["design", "compact review strip with localized failure cases and pre-copy checklist items"],
  ["design", "Core tool result summaries"],
  ["design", "Regex result details"],
  ["design", "regex-from-examples generator"],
  ["design", "JSON Formatter summaries"],
  ["design", "JSON path preview with copyable paths"],
  ["design", "JSONPath summaries"],
  ["design", "matched paths and values"],
  ["design", "JWT Decoder summaries"],
  ["design", "iat/nbf/exp/lifetime time-window summary"],
  ["design", "Base64 summaries"],
  ["design", "decoded content shape, JSON key count, JWT segment signal"],
  ["design", "Cron summaries"],
  ["design", "selectable day-of-month/day-of-week OR/AND semantics"],
  ["design", "browser timezone runtime context"],
  ["design", "UUID summaries"],
  ["design", "Hash summaries"],
  ["design", "digest/HMAC mode selection"],
  ["design", "HMAC secret diagnostics"],
  ["design", "Password summaries"],
  ["design", "passphrase word count/separator/number controls"],
  ["design", "Random Token summaries"],
  ["design", "QR Code summaries"],
  ["design", "payload builder fields"],
  ["design", "payload type, destination host, tracking parameter count, scan density"],
  ["design", "Color summaries"],
  ["design", "AA/AAA diagnostics"],
  ["design", "DNS summaries"],
  ["design", "record-type diagnostics"],
  ["design", "redirect diagnostics"],
  ["design", "hop timing/cache details"],
  ["design", "allowlisted final response headers"],
  ["design", "pasted-header parser"],
  ["design", "CSP generator"],
  ["design", "SQL/CSS/JavaScript formatter summaries"],
  ["design", "SQL formatter surfaces should include query type"],
  ["design", "CSS formatter and minifier surfaces should include selector preview"],
  ["design", "JavaScript formatter and minifier surfaces should include import/export count"],
  ["design", "JSON Escape, YAML Validator, and ENV Parser Validator working surfaces"],
  ["design", "YAML Validator should include Docker Compose Validator/Formatter checks"],
  ["design", "CSV JSON Converter should include the CSV Cleaner workflow"],
  ["design", "Markdown Previewer should include the Markdown Table Generator workflow"],
  ["design", "Tool directory acquisition clusters"],
  ["design", "workflow recipe cards"],
  ["design", "task-shaped search queries"],
  ["design", "resizable left and right sidebars"],
  ["design", "clamp to the workbench container"],
  ["design", "one aligned workbench shell"],
  ["design", "Search result match-signal chips"],
  ["design", "failure cases, pre-copy checklist items"],
  ["design", "Related next-action links"],
  ["design", "short localized use-case line"],
  ["design", "preserve sidebar scroll position"],
  ["design", "Recent, favorite, and tool session sections"],
  ["design", "restore-last-work/clear-local-history actions"],
  ["design", "Favorite save/remove actions"],
  ["design", "Demand tier is not a user-facing label"],
  ["design", "`contentCluster` is not a user-facing badge"],
  ["design", "Mobile tool detail pages are task-first"],
  ["design", "no AdSense/review-status/approval/monetization wording"],
  ["design", "harness:layout"],
  ["design", "harness:visual"],
  ["localization", "getLocalizedTool"],
  ["localization", "getLocalizedGuide"],
  ["localization", "harness:localization"],
  ["localization", "raw English registry prose"],
  ["localization", "Common dictionary prose"],
  ["localization", "Common override blocks"],
  ["localization", "privacy/server/local chips"],
  ["localization", "Long-tail locale templates"],
  ["localization", "mixed-script accidents"],
  ["localization", "paste or enter input"],
  ["localization", "copy only after review"],
  ["localization", "Hindi acquisition copy"],
  ["localization", "Hindi reusable templates"],
  ["localization", "Indonesian reusable templates"],
  ["localization", "Vietnamese acquisition copy"],
  ["localization", "Vietnamese, Thai, and Arabic reusable templates"],
  ["localization", "native language labels"],
  ["localization", "empty-output placeholders"],
  ["localization", "Tool-specific result labels"],
  ["localization", "`action`, and `result`"],
  ["localization", "JSON Escape example/metric/warning labels"],
  ["localization", "JSON path preview labels"],
  ["localization", "JSONPath example, supported syntax, match, and warning labels"],
  ["localization", "YAML Validator document/warning labels"],
  ["localization", "Docker Compose service/image/build/port/volume/environment/dependency labels and warnings"],
  ["localization", "ENV Parser warning/variable-preview labels"],
  ["localization", "CSV cleaner option/metric/warning labels"],
  ["localization", "Regex match details, regex snippets, and regex-from-examples generator labels"],
  ["localization", "Regex snippet labels and descriptions"],
  ["localization", "regex-from-examples generator labels"],
  ["localization", "JWT claim and status labels"],
  ["localization", "JWT claim, status, iat/nbf/exp/lifetime time-window labels"],
  ["localization", "Base64 variant and padding labels"],
  ["localization", "Base64 variant, padding, decoded shape, JSON key, JWT segment, image/data URL preview, secret-like warning, control-character labels, and decoded image warnings"],
  ["localization", "Cron preset/field/warning labels"],
  ["localization", "timezone and day-matching semantics labels"],
  ["localization", "Hash digest/HMAC mode labels"],
  ["localization", "HMAC secret diagnostics and warnings"],
  ["localization", "Password mode/passphrase word count/separator/number labels"],
  ["localization", "passphrase compatibility warnings"],
  ["localization", "Random Token entropy/encoding/URL-safe/padding/use warnings"],
  ["localization", "QR payload builder"],
  ["localization", "QR payload type, destination, tracking, scan density, and error-correction diagnostics"],
  ["localization", "HTTP redirect-chain timing/cache and redirect diagnostics labels"],
  ["localization", "DNS record-type diagnostics labels"],
  ["localization", "Color WCAG AA/AAA diagnostics"],
  ["localization", "CSS selector/token/compression diagnostics"],
  ["localization", "JavaScript module/runtime/compression diagnostics"],
  ["localization", "pasted-header parser labels"],
  ["localization", "CSP generator labels"],
  ["localization", "`failureCases`"],
  ["localization", "`preCopyChecklist`"],
  ["localization", "related next-action labels"],
  ["localization", "Search result match-signal chips are visible prose"],
  ["localization", "failure case, pre-copy checklist"],
  ["localization", "`favoriteTools`, `addFavorite`, `removeFavorite`, `localSessionTitle`, `localSessionBody`, `restoreLastWork`, and `clearLocalHistory`"],
  ["localization", "show localized use-case context"],
  ["localization", "acquisition-cluster or first-step related next actions"],
  ["localization", "workflow recipe titles, descriptions, and step reasons"],
  ["localization", "task-shaped search query recipe results"],
  ["localization", "Korean, Japanese, Spanish, and German priority intent copy"],
  ["localization", "The required acquisition set is JSON, Regex, JWT, Base64, Cron, UUID, Hash, Password, QR, DNS, HTTP, Color, SQL, CSS, and JavaScript"],
  ["localization", "SQL query type/table reference/clause check/sensitive-field diagnostics"],
  ["localization", "Markdown table generator example/delimiter/metric/warning labels"],
  ["localization", "slug-specific localized priority failure cases and pre-copy checklist items"],
  ["localization", "must not re-spread English nested objects"],
  ["localization", "slug-specific descriptions"],
  ["localization", "Long-tail acquisition locales"],
  ["localization", "every registered tool"],
  ["localization", "Long-tail guide descriptions"],
  ["localization", "Every guide needs topic-specific long-tail guide lead sections"],
  ["localization", "root `<html lang>`"],
  ["localization", "getLocalizedLegalContent"],
  ["localization", "guide.description"],
  ["localization", "Twitter title/description"],
  ["seo", "hreflang"],
  ["seo", "x-default"],
  ["seo", "root `<html lang>`"],
  ["seo", "sitemap index"],
  ["seo", "Refresh sitemap `lastmod`"],
  ["seo", "/sitemaps/{locale}"],
  ["seo", "RTL"],
  ["seo", "country"],
  ["seo", "SearchAction schema"],
  ["seo", "CSP Generator"],
  ["seo", "harness:seo-opportunities"],
  ["seo", "harness:seo-measured"],
  ["seo", "BOBOB_REQUIRE_MEASURED_SEO"],
  ["seo", "BOBOB_REQUIRED_MEASURED_PATHS"],
  ["seo", "reports/search-console.csv"],
  ["seo", "reports/search-console.tsv"],
  ["seo", "harness:seo-opportunities:smoke"],
  ["seo", "titleDescriptionRecommendations"],
  ["seo", "inputWarnings"],
  ["seo", "measurementBacklog"],
  ["seo", "metadataRewriteReadiness"],
  ["seo", "export-packet"],
  ["seo", "npm run seo:export-packet"],
  ["seo", "long-tail search intent seeds"],
  ["seo", "npm run seo:report"],
  ["seo", "harness:seo-templates"],
  ["seo", "reports/templates/*.example.csv"],
  ["seo", "tool and guide pages"],
  ["seo", "guide.description"],
  ["seo", "Twitter title/description"],
  ["seo", "SoftwareApplication`, `FAQPage`, and `BreadcrumbList`"],
  ["seo", "unused AdSense preview"],
  ["seo", "Public UI, dictionaries, legal pages"],
  ["seo", "NEXT_PUBLIC_ENABLE_ADSENSE=true"],
  ["seo", "bottom overlays"],
  ["seo", "harness:deployment-status"],
  ["seo", "BOBOB_REQUIRE_NO_LEGACY_VERCEL"],
  ["seo", "Legacy standalone apps must not be restored"],
  ["verification", "harness:i18n"],
  ["verification", "harness:localization"],
  ["verification", "Root `<html lang>`"],
  ["verification", "getLocalizedLegalContent"],
  ["verification", "privacy/server/local indicators"],
  ["verification", "guide.description"],
  ["verification", "Every guide should have topic-specific long-tail guide lead sections"],
  ["verification", "Twitter title/description"],
  ["verification", "SoftwareApplication`, `FAQPage`, and `BreadcrumbList`"],
  ["verification", "harness:theme"],
  ["verification", "harness:search"],
  ["verification", "harness:layout"],
  ["verification", "harness:visual"],
  ["verification", "AA/AAA diagnostics"],
  ["verification", "quick-start input examples and use cases"],
  ["verification", "localized review strip with failure cases and pre-copy checklist items"],
  ["verification", "Core acquisition tools should have at least three real `inputExamples`"],
  ["verification", "three priority `failureCases`"],
  ["verification", "three priority `preCopyChecklist` items"],
  ["verification", "acquisition workflow clusters"],
  ["verification", "workflow recipe cards"],
  ["verification", "task-shaped search query recipe results"],
  ["verification", "failure cases"],
  ["verification", "pre-copy checklist"],
  ["verification", "Core acquisition tools in Korean, Japanese, Spanish, and German"],
  ["verification", "slug-specific localized priority failure cases and pre-copy checklist items"],
  ["verification", "Acquisition-cluster and first-step related tools"],
  ["verification", "Pointer-reactive background motion"],
  ["verification", "requestAnimationFrame-driven CSS variable smoothing"],
  ["verification", "home/tool directory, tool detail, guide directory, and guide detail pages"],
  ["verification", "harness:pointer-background"],
  ["verification", "Search results, center tool panel, and right reference panel"],
  ["verification", "Search results should expose compact match-signal chips"],
  ["verification", "failure cases, pre-copy checklist items"],
  ["verification", "preserve registry `relatedTools` order"],
  ["verification", "localized use-case context"],
  ["verification", "harness:seo-opportunities"],
  ["verification", "harness:seo-measured"],
  ["verification", "BOBOB_REQUIRE_MEASURED_SEO"],
  ["verification", "BOBOB_REQUIRED_MEASURED_PATHS"],
  ["verification", "reports/search-console.csv"],
  ["verification", "reports/search-console.tsv"],
  ["verification", "harness:seo-opportunities:smoke"],
  ["verification", "titleDescriptionRecommendations"],
  ["verification", "inputWarnings"],
  ["verification", "measurementBacklog"],
  ["verification", "metadataRewriteReadiness"],
  ["verification", "export-packet"],
  ["verification", "npm run seo:export-packet"],
  ["verification", "long-tail search intent seeds"],
  ["verification", "npm run seo:report"],
  ["verification", "harness:seo-templates"],
  ["verification", "reports/templates/*.example.csv"],
  ["verification", "tool and guide pages"],
  ["verification", "preserved sidebar scroll"],
  ["verification", "no horizontal overflow at narrow desktop widths"],
  ["verification", "No visible demand wording"],
  ["verification", "Mobile tool detail pages should show the primary tool surface"],
  ["verification", "No public UI, dictionary, legal, or support copy"],
  ["verification", "No raw `contentCluster` slugs"],
  ["verification", "agent-skills-sync"],
  ["verification", "Core tool working surfaces should expose task-specific result summaries"],
  ["verification", "Regex should show presets, high-use regex snippets"],
  ["verification", "regex-from-examples generator"],
  ["verification", "JSON Formatter should show example payload buttons"],
  ["verification", "JSON path preview with copyable paths"],
  ["verification", "JSONPath Tester should show examples, supported syntax, result metrics, matched paths, and warnings"],
  ["verification", "JWT Decoder should show example tokens"],
  ["verification", "iat/nbf/exp/lifetime time-window summary"],
  ["verification", "Base64 should show examples"],
  ["verification", "decoded content shape, JSON key count, JWT segment signal"],
  ["verification", "image/data URL preview"],
  ["verification", "copyable data URL output for detected images"],
  ["verification", "Cron should show localized presets"],
  ["verification", "selectable day-of-month/day-of-week OR/AND semantics"],
  ["verification", "browser timezone runtime context"],
  ["verification", "UUID should show count presets"],
  ["verification", "Hash should show example inputs"],
  ["verification", "digest/HMAC mode selection"],
  ["verification", "HMAC secret byte diagnostics"],
  ["verification", "Password should show random-password and passphrase modes"],
  ["verification", "passphrase word count/separator/number controls"],
  ["verification", "Random Token should show session/API/CSRF/webhook presets"],
  ["verification", "QR Code should show URL, Wi-Fi, email, and vCard examples"],
  ["verification", "payload builder fields"],
  ["verification", "payload type, destination host, tracking parameter count, scan density"],
  ["verification", "Color should support HEX, RGB, and HSL input"],
  ["verification", "DNS should show record examples"],
  ["verification", "record-type diagnostics"],
  ["verification", "SQL/CSS/JavaScript formatters should show realistic examples"],
  ["verification", "SQL formatter verification must include query type"],
  ["verification", "CSS formatter/minifier verification must include selector preview"],
  ["verification", "JavaScript formatter/minifier verification must include import/export count"],
  ["verification", "Markdown Previewer should expose the Markdown Table Generator workflow"],
  ["verification", "JSON Escape should show examples"],
  ["verification", "YAML Validator should show examples"],
  ["verification", "Docker Compose service/image/build/port/volume/environment/dependency diagnostics"],
  ["verification", "ENV Parser Validator should show examples"],
  ["verification", "CSV JSON Converter should show CSV/JSON examples"],
  ["verification", "build-time external font fetches"],
  ["verification", "per-locale sitemaps"],
  ["verification", "Sitemap `lastmod`"],
  ["verification", "private/reserved hosts"],
  ["verification", "`redirectChain` array"],
  ["verification", "allowlisted `finalResponseHeaders`"],
  ["verification", "HTTP Status Checker UI should render"],
  ["verification", "hop timing/cache details"],
  ["verification", "allowlisted final response headers"],
  ["verification", "redirect diagnostics"],
  ["verification", "local HTTP header parser"],
  ["verification", "CSP generator with warnings"],
  ["verification", "Recent/favorite/tool-session repeat-usage sections"],
  ["verification", "`data-recent-tools`, `data-favorite-tools`, `data-tool-session`"],
  ["verification", "fake publisher IDs"],
  ["verification", "No standalone legacy app directories"],
  ["verification", "package-lock.json"],
  ["verification", "harness:legacy"],
  ["verification", "harness:deployment-status"],
  ["verification", "BOBOB_REQUIRE_MAIN_VERCEL"],
  ["verification", "BOBOB_DEPLOY_SHA"],
  ["verification", "BOBOB_REQUIRE_NO_LEGACY_VERCEL"],
  ["product", "monetizationTier"],
  ["product", "70/30 split"],
  ["product", "For mobile retention"],
  ["product", "registry-backed `inputExamples`, `useCases`, `failureCases`, `preCopyChecklist`, and related next actions"],
  ["product", "Core acquisition tools should have at least three real `inputExamples`"],
  ["product", "three priority `failureCases`"],
  ["product", "three priority `preCopyChecklist` items"],
  ["product", "`json-escape-unescape`, `yaml-validator`, and `env-parser-validator` are approved data/config-cluster breadth additions"],
  ["product", "Docker Compose Validator/Formatter are currently implemented"],
  ["product", "Markdown Table Generator"],
  ["product", "Post-approval candidates"],
  ["product", "session depth"],
  ["product", "search results should expose match-signal chips"],
  ["product", "SQL should expose query type"],
  ["product", "preserve the registry `relatedTools` order"],
  ["product", "localized use-case context"],
  ["product", "local-only recency/favorites"],
  ["product", "localized priority failure cases and pre-copy checklist items"],
  ["product", "Korean, Japanese, Spanish, and German priority intent copy"],
  ["product", "acquisition workflow clusters"],
  ["product", "workflow recipes"],
  ["product", "task-shaped search queries"],
  ["product", "feature-specific search surface"],
  ["product", "Base64 image/data URL preview"],
  ["product", "JSONPath field extraction"],
  ["product", "40+"],
  ["product", "localized tool directories"],
  ["product", "harness:seo-opportunities"],
  ["product", "harness:seo-measured"],
  ["product", "BOBOB_REQUIRE_MEASURED_SEO"],
  ["product", "BOBOB_REQUIRED_MEASURED_PATHS"],
  ["product", "reports/search-console.csv"],
  ["product", "reports/search-console.tsv"],
  ["product", "harness:seo-opportunities:smoke"],
  ["product", "titleDescriptionRecommendations"],
  ["product", "inputWarnings"],
  ["product", "measurementBacklog"],
  ["product", "metadataRewriteReadiness"],
  ["product", "npm run seo:export-packet"],
  ["product", "npm run seo:report"],
  ["product", "harness:seo-templates"],
  ["product", "reports/templates/*.example.csv"],
  ["product", "tool and guide pages"],
  ["product", "Audit -> One Slice -> Harness -> Browser Check -> Stop"],
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
if (!fs.existsSync(path.join(root, "apps/main/src/components/pointer-background.tsx"))) {
  failures.push("pointer background component missing");
} else {
  const pointerBackground = read("apps/main/src/components/pointer-background.tsx");
  for (const fragment of ["prefers-reduced-motion: reduce", "window.addEventListener(\"pointermove\"", "--bobob-pointer-x", "--bobob-parallax-x", "--bobob-depth-x", "--bobob-ray-rotation", "--bobob-ray-opacity"]) {
    if (!pointerBackground.includes(fragment)) failures.push(`pointer background missing ${fragment}`);
  }
}
const globalsCss = read("apps/main/src/app/globals.css");
for (const fragment of [".bobob-pointer-background", "@media (prefers-reduced-motion: reduce)", "color-mix", "--bobob-depth-x", "--bobob-ray-opacity"]) {
  if (!globalsCss.includes(fragment)) failures.push(`global CSS missing pointer background policy ${fragment}`);
}
const directorySource = read("apps/main/src/features/tools/tool-directory.tsx");
if (!directorySource.includes("<PointerBackground />")) {
  failures.push("tool directory hero missing pointer background");
}
const workspaceSource = read("apps/main/src/features/tools/tool-workspace.tsx");
for (const fragment of ["bobob:recent-tools", "data-recent-tools", "dictionary.nav.recentTools", "getLocalizedRelatedTools(recentSlugs, locale)"]) {
  if (!workspaceSource.includes(fragment)) failures.push(`tool workspace missing local-only recent tools behavior ${fragment}`);
}
for (const fragment of ["bobob:favorite-tools", "data-favorite-tools", "dictionary.nav.favoriteTools", "getLocalizedRelatedTools(favoriteSlugs, locale)", "writeFavoriteToolSlugs(locale, nextSlugs)"]) {
  if (!workspaceSource.includes(fragment)) failures.push(`tool workspace missing local-only favorite tools behavior ${fragment}`);
}
for (const fragment of ["bobob:tool-session", "data-tool-session", "restoreLastWork", "clearLocalHistory", "collectToolSession(root)", "applyToolSession(root, session)"]) {
  if (!workspaceSource.includes(fragment)) failures.push(`tool workspace missing local-only tool session behavior ${fragment}`);
}
for (const fragment of ["function MobileReferenceAccordion", "data-mobile-reference-sections", "function MobileActionBar", "data-mobile-action-bar", "id=\"tool-surface\"", "pb-20 lg:pb-0", "hidden min-h-0 lg:block"]) {
  if (!workspaceSource.includes(fragment)) failures.push(`tool workspace missing mobile task-first behavior ${fragment}`);
}
for (const file of [
  "apps/main/src/app/guides/page.tsx",
  "apps/main/src/app/[locale]/guides/page.tsx",
  "apps/main/src/app/guides/[slug]/page.tsx",
  "apps/main/src/app/[locale]/guides/[slug]/page.tsx",
]) {
  if (!read(file).includes("<PointerBackground />")) {
    failures.push(`${file} missing guide pointer background`);
  }
}
const httpStatusRoute = read("apps/main/src/app/api/http-status/route.ts");
  for (const fragment of ["redirectChain", "statusText", "contentType", "location", "cacheControl", "elapsedMs", "finalResponseHeaders", "finalHeaderAllowlist"]) {
    if (!httpStatusRoute.includes(fragment)) failures.push(`HTTP status route missing redirect chain field ${fragment}`);
  }
if (!fs.existsSync(path.join(root, "scripts/harness/seo-opportunity-report.mjs"))) {
  failures.push("SEO opportunity report harness missing");
} else {
  const seoReport = read("scripts/harness/seo-opportunity-report.mjs");
  for (const fragment of ["inventoryCount", "toolInventoryCount", "guideInventoryCount", "inputWarnings", "titleDescriptionRecommendations", "measurementBacklog", "measuredCoverage", "measuredExportPlan", "copyTargets", "csvTemplates", "metadataRewriteReadiness", "canRewritePublicMetadata", "searchConsolePageRegex", "requiredMeasuredPathsEnv", "measuredMetadataSuggestion", "canonicalContentPath", "readCsvTable", "formatMarkdownReport", "formatExportPacket", "export-packet", "BOBOB_SEO_REPORT_FORMAT", "BOBOB_SEO_REPORT_OUT", "BOBOB_REQUIRE_MEASURED_SEO", "BOBOB_REQUIRED_MEASURED_PATHS"]) {
    if (!seoReport.includes(fragment)) failures.push(`SEO opportunity report missing ${fragment}`);
  }
}
if (!fs.existsSync(path.join(root, "scripts/harness/seo-opportunity-report-smoke.mjs"))) {
  failures.push("SEO opportunity report smoke harness missing");
} else {
  const seoReportSmoke = read("scripts/harness/seo-opportunity-report-smoke.mjs");
  for (const fragment of ["search-console.csv", "adsense.csv", "inputWarnings", "titleDescriptionRecommendations", "measurementBacklog", "measuredCoverage", "measuredExportPlan", "copyTargets", "csvTemplates", "metadataRewriteReadiness", "canRewritePublicMetadata", "searchConsolePageRegex", "requiredMeasuredPathsEnv", "export-packet", "BOBOB_SEO_REPORT_FORMAT", "BOBOB_SEO_REPORT_OUT", "BOBOB_REQUIRE_MEASURED_SEO", "BOBOB_REQUIRED_MEASURED_PATHS"]) {
    if (!seoReportSmoke.includes(fragment)) failures.push(`SEO opportunity report smoke missing ${fragment}`);
  }
}
if (!fs.existsSync(path.join(root, "scripts/harness/seo-export-templates.mjs"))) {
  failures.push("SEO export templates harness missing");
} else {
  const seoExportTemplates = read("scripts/harness/seo-export-templates.mjs");
  for (const fragment of ["reports/README.md", "search-console.example.csv", "adsense.example.csv", "metadataRewriteReadiness.canRewritePublicMetadata", "measuredExportPlan.copyTargets.searchConsolePageRegex", "seo:export-packet", "seo:report"]) {
    if (!seoExportTemplates.includes(fragment)) failures.push(`SEO export templates harness missing ${fragment}`);
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
  for (const fragment of ["apps/main", "No archived source copy", "/regax", "/tools/regex-tester", "packages/ui", "turbo.json", "harness:legacy"]) {
    if (!legacyArchive.includes(fragment)) failures.push(`legacy apps archive missing ${fragment}`);
  }
}
if (!fs.existsSync(path.join(root, "docs/vercel-legacy-project-cleanup.md"))) {
  failures.push("Vercel legacy project cleanup document missing");
} else {
  const vercelCleanup = read("docs/vercel-legacy-project-cleanup.md");
  for (const fragment of ["bobs-multi-tool-main", "bobs-multi-tool-cron-generator", "BOBOB_REQUIRE_MAIN_VERCEL", "BOBOB_DEPLOY_SHA", "BOBOB_REQUIRE_NO_LEGACY_VERCEL", "harness:deployment-status"]) {
    if (!vercelCleanup.includes(fragment)) failures.push(`Vercel legacy cleanup doc missing ${fragment}`);
  }
}

const legacyHarness = read("scripts/harness/legacy-main-only.mjs");
for (const fragment of ["package-lock.json", "stale workspaces", "node_modules/turbo"]) {
  if (!legacyHarness.includes(fragment)) failures.push(`legacy harness missing ${fragment}`);
}
if (!fs.existsSync(path.join(root, "scripts/harness/deployment-status.mjs"))) {
  failures.push("deployment status harness missing");
} else {
  const deploymentStatusHarness = read("scripts/harness/deployment-status.mjs");
  for (const fragment of ["bobs-multi-tool-main", "bobs-multi-tool-cron-generator", "BOBOB_REQUIRE_MAIN_VERCEL", "BOBOB_REQUIRE_NO_LEGACY_VERCEL", "docs/vercel-legacy-project-cleanup.md"]) {
    if (!deploymentStatusHarness.includes(fragment)) failures.push(`deployment status harness missing ${fragment}`);
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
if (packageJson.scripts?.["harness:seo-opportunities:smoke"] !== "node scripts/harness/seo-opportunity-report-smoke.mjs") {
  failures.push("root package scripts must expose harness:seo-opportunities:smoke");
}
if (packageJson.scripts?.["harness:seo-templates"] !== "node scripts/harness/seo-export-templates.mjs") {
  failures.push("root package scripts must expose harness:seo-templates");
}
if (packageJson.scripts?.["harness:seo-measured"] !== "BOBOB_REQUIRE_MEASURED_SEO=1 node scripts/harness/seo-opportunity-report.mjs") {
  failures.push("root package scripts must expose harness:seo-measured");
}
if (packageJson.scripts?.["seo:export-packet"] !== "BOBOB_SEO_REPORT_FORMAT=export-packet BOBOB_SEO_REPORT_OUT=reports/seo-export-packet.md node scripts/harness/seo-opportunity-report.mjs") {
  failures.push("root package scripts must expose seo:export-packet");
}
if (packageJson.scripts?.["seo:report"] !== "BOBOB_SEO_REPORT_FORMAT=markdown BOBOB_SEO_REPORT_OUT=reports/seo-opportunities.md node scripts/harness/seo-opportunity-report.mjs") {
  failures.push("root package scripts must expose seo:report");
}
if (packageJson.scripts?.["harness:deployment-status"] !== "node scripts/harness/deployment-status.mjs") {
  failures.push("root package scripts must expose harness:deployment-status");
}
if (packageJson.devDependencies?.turbo || packageJson.scripts?.clean?.includes("turbo")) {
  failures.push("single-app workspace must not keep turbo dependency or turbo clean script");
}

const visibleDictionary = read("apps/main/src/features/i18n/dictionaries.ts");
if (visibleDictionary.includes("demand:")) {
  failures.push("visible dictionaries must not keep demand wording");
}
for (const [source, label] of [
  [visibleDictionary, "visible dictionaries"],
  [read("apps/main/src/features/i18n/legal-content.ts"), "localized legal content"],
  [read("apps/main/src/app/privacy/page.tsx"), "default privacy page"],
  [read("apps/main/src/app/terms/page.tsx"), "default terms page"],
]) {
  if (/Google AdSense|AdSense|after approval|approval\.|승인 후|심사와 검색|承認後|获得批准后|核准後|Tras la aprobacion|Apos aprovacao|Nach Genehmigung|Apres approbation|मंजूरी के बाद|Setelah disetujui|Sau khi được chấp thuận|หลังได้รับอนุมัติ|بعد الموافقة/.test(source)) {
    failures.push(`${label} must not expose AdSense, approval, or review-status wording to users`);
  }
}

const localizedContent = read("apps/main/src/features/i18n/localized-content.ts");
if (localizedContent.includes("coreChip") || localizedContent.includes("growthChip") || localizedContent.includes("longTailChip")) {
  failures.push("localized content must not keep demand-tier chip copy");
}
for (const fragment of ["priorityGuideLeadSections", "localizedGuideSections"]) {
  if (!localizedContent.includes(fragment)) failures.push(`localized content missing ${fragment}`);
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("Agent and skills sync smoke passed.");
