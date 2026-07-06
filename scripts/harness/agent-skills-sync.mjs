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
  ["agents", "web-operations workbench first"],
  ["agents", "URL status, redirect chains, response headers, DNS"],
  ["agents", "fresh task branch"],
  ["agents", "harness:play-planning"],
  ["agents", "planningBrief"],
  ["agents", "web-search seed queries"],
  ["agents", "A lottery/chance game needs probability"],
  ["agents", "Play visual direction must also branch by game character"],
  ["agents", "Search Console/Bing/Naver"],
  ["agents", "old web mini-games"],
  ["agents", "either a `1분` run or a clearly endless `계속` loop"],
  ["agents", "overbearing caveat blocks"],
  ["agents", "features, tool policy, SEO/AdSense policy, i18n, or theme rules change"],
  ["agents", "skills must be updated"],
  ["agents", "build-time external font fetches"],
  ["agents", "explicit 308 canonical host redirect"],
  ["agents", "aliases, useCases, inputExamples, contentCluster, and monetizationTier"],
  ["agents", "registry-backed `inputExamples`, `useCases`, `failureCases`, `preCopyChecklist`, and related next actions"],
  ["agents", "Tool detail center panels must be task-first"],
  ["agents", "distinct primary work area"],
  ["agents", "common output cards"],
  ["agents", "diagnostic cards"],
  ["agents", "Mobile tool detail pages must be task-first"],
  ["agents", "Core tool working surfaces should render structured"],
  ["agents", "Regex must show preset patterns, high-use regex snippets"],
  ["agents", "local regex-from-examples draft generator"],
  ["agents", "JSON Formatter must show practical examples"],
  ["agents", "JSON diagnostics"],
  ["agents", "sensitive-looking keys/empty values/duplicate keys/large arrays"],
  ["agents", "JSON path preview with copyable paths"],
  ["agents", "inline path inspector"],
  ["agents", "line/column context"],
  ["agents", "localized repair hints"],
  ["agents", "JSONPath Tester must show example selectors"],
  ["agents", "wildcard and recursive key searches"],
  ["agents", "JWT Decoder must show example tokens"],
  ["agents", "iat/nbf/exp/lifetime time-window summary"],
  ["agents", "expected issuer/audience/scope comparison"],
  ["agents", "redacted payload"],
  ["agents", "registered/public/private claim inspection"],
  ["agents", "sensitive claim detection"],
  ["agents", "Base64 Encoder Decoder must show practical examples"],
  ["agents", "formatted JSON preview"],
  ["agents", "copyable data URL output for detected images"],
  ["agents", "decoded content shape, JSON key count, formatted JSON preview for decoded JSON, JWT segment signal"],
  ["agents", "Cron Expression Generator must show localized presets"],
  ["agents", "selectable day-of-month/day-of-week OR/AND matching semantics"],
  ["agents", "browser timezone runtime context"],
  ["agents", "selectable preview timezone"],
  ["agents", "UUID Generator must show count presets"],
  ["agents", "Hash Generator must show example inputs"],
  ["agents", "digest/HMAC mode selection"],
  ["agents", "HMAC secret diagnostics"],
  ["agents", "Password Generator must show random-password and passphrase modes"],
  ["agents", "passphrase word count/separator/number controls"],
  ["agents", "Random Token Generator must show session/API/CSRF/webhook presets"],
  ["agents", "QR Code Generator must show URL, Wi-Fi, email, and vCard examples"],
  ["agents", "payload builder for those payload types"],
  ["agents", "image size and quiet-zone controls"],
  ["agents", "payload type, destination host, tracking parameter count, scan density"],
  ["agents", "Color Converter must actually support HEX, RGB, and HSL input"],
  ["agents", "AA/AAA diagnostics"],
  ["agents", "DNS Lookup must show record examples"],
  ["agents", "record-type diagnostics"],
  ["agents", "deployment checklist"],
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
  ["agents", "layered surface tokens"],
  ["agents", "Scrollbars should stay modern and quiet"],
  ["agents", "Decorative WebGL and pointer-reactive backgrounds are disabled"],
  ["agents", "Do not reintroduce ReactBits, Light Rays, Galaxy, `ogl`"],
  ["agents", "shader canvases"],
  ["agents", "pointermove/requestAnimationFrame background listeners"],
  ["agents", "static and token-based"],
  ["agents", "harness:pointer-background"],
  ["agents", "Do not add `framer-motion`"],
  ["agents", "real resizable left and right sidebars"],
  ["agents", "right reference panel is closed by default"],
  ["agents", "one stable neutral divider line"],
  ["agents", "clamped to the workbench container"],
  ["agents", "preserve the sidebar scroll position"],
  ["agents", "hop timing/cache details"],
  ["agents", "allowlisted final response headers"],
  ["agents", "security header readiness"],
  ["agents", "Demand tier is an internal prioritization"],
  ["agents", "`contentCluster` is an internal search/SEO grouping field"],
  ["agents", "Revenue operations are internal"],
  ["agents", "Legal pages may describe third-party advertising"],
  ["agents", "real publisher id `ca-pub-2620992505263949` by default"],
  ["agents", "NEXT_PUBLIC_ENABLE_ADSENSE=false"],
  ["agents", "NEXT_PUBLIC_ADSENSE_TOOL_RESULT_SLOT"],
  ["agents", "NEXT_PUBLIC_ADSENSE_REFERENCE_SLOT"],
  ["agents", "NEXT_PUBLIC_ADSENSE_GUIDE_CONTENT_SLOT"],
  ["agents", "after the primary tool result area"],
  ["agents", "ad units should lazy-initialize"],
  ["agents", "Do not initialize page-level auto ads"],
  ["agents", "primary input/output surface visually dominant"],
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
  ["agents", "getLocalizedTrustContent"],
  ["agents", "one aligned shell"],
  ["agents", "x-default"],
  ["agents", "sitemap index"],
  ["agents", "Sitemap `lastmod`"],
  ["agents", "full per-locale URL coverage"],
  ["agents", "/{locale}/tools"],
  ["agents", "/about` and `/contact` are required trust pages"],
  ["agents", "localized trust content"],
  ["agents", "localized acquisition workflow clusters"],
  ["agents", "Workflow recipes must stay local-first"],
  ["agents", "workflow recipe cards"],
  ["agents", "task-shaped search queries"],
  ["agents", "exact localized title and search-intent matches"],
  ["agents", "security-header review"],
  ["agents", "deploy config validation"],
  ["agents", "CSV cleanup for API payloads"],
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
  ["agents", "Meta Tag Generator and Open Graph Preview must show SEO/social crawler readiness"],
  ["agents", "robots.txt Generator and Sitemap Generator must act as crawl-readiness tools"],
  ["agents", "URL Parser must show URL examples"],
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
  ["agents", "workflow recipe searchIntents"],
  ["agents", "CSP, Docker Compose, and CSV cleanup"],
  ["agents", "npm run seo:report"],
  ["agents", "Search results must expose compact match-signal chips"],
  ["agents", "failure cases, pre-copy checklist items"],
  ["agents", "harness:seo-templates"],
  ["agents", "reports/templates/*.example.csv"],
  ["agents", "visual screenshot smoke"],
  ["agents", "disabled ad placeholders"],
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
  ["tool", "DNS deployment checklist"],
  ["tool", "Base64 image/data URL preview"],
  ["tool", "JWT claim inspection"],
  ["tool", "JWT expected issuer/audience/scope comparison"],
  ["tool", "JWT sensitive-claim redaction"],
  ["tool", "QR image-size controls"],
  ["tool", "parse error position, line/column context, and localized repair hints"],
  ["tool", "ordered as the intended next-action path"],
  ["tool", "localized next-action context"],
  ["tool", "Confirm detail behavior stays task-first"],
  ["tool", "Do not add user-facing AdSense"],
  ["tool", "server route tools"],
  ["tool", "redirect-chain details"],
  ["tool", "security header readiness"],
  ["tool", "cache-control, and elapsed time"],
  ["tool", "allowlisted final-response headers"],
  ["tool", "meta/social preview tools"],
  ["tool", "title/description length"],
  ["tool", "robots.txt and sitemap generator tools"],
  ["tool", "crawl-readiness diagnostics before raw output"],
  ["tool", "WCAG AA/AAA diagnostics"],
  ["tool", "data/config tools such as JSON Formatter, Base64, JSON Escape, YAML Validator, and ENV Parser Validator"],
  ["tool", "diagnostics for sensitive-looking keys, empty values, duplicate keys, and large arrays"],
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
  ["design", "old web mini-games"],
  ["design", "planningBrief.initialVisualDirection"],
  ["design", "one shared game skin"],
  ["design", "starting metaphors"],
  ["product", "fresh task branch"],
  ["product", "harness:play-planning"],
  ["product", "external research"],
  ["product", "Lottery/chance games need probability"],
  ["verification", "harness:play-planning"],
  ["verification", "web-search seed queries"],
  ["verification", "should not freeze one correct genre taxonomy"],
  ["design", "Arcade entries should generally be `1분` score/time runs or clearly endless `계속` loops"],
  ["design", "ThemeToggle"],
  ["design", "visible workbench layers"],
  ["design", "Scrollbars should be thin"],
  ["design", "Decorative WebGL and pointer-reactive backgrounds are disabled"],
  ["design", "Do not reintroduce ReactBits, Light Rays, Galaxy, `ogl`"],
  ["design", "shader canvases"],
  ["design", "pointermove/requestAnimationFrame background listeners"],
  ["design", "static and token-based"],
  ["design", "harness:pointer-background"],
  ["design", "Do not add `framer-motion`"],
  ["design", "Tool detail center panels are task-first"],
  ["design", "data-primary-work-area"],
  ["design", "data-tool-support-sections"],
  ["design", "Quick-start and review sections"],
  ["design", "Core tool result summaries"],
  ["design", "Regex result details"],
  ["design", "regex-from-examples generator"],
  ["design", "JSON Formatter summaries"],
  ["design", "sensitive-looking key, empty value, duplicate key, and large array diagnostics"],
  ["design", "JSON path preview with copyable paths"],
  ["design", "inline path inspector"],
  ["design", "parse error line/column context"],
  ["design", "localized repair hints"],
  ["design", "JSONPath summaries"],
  ["design", "matched paths and values"],
  ["design", "JWT Decoder summaries"],
  ["design", "iat/nbf/exp/lifetime time-window summary"],
  ["design", "expected issuer/audience/scope comparison"],
  ["design", "redacted payload copy actions"],
  ["design", "registered/public/private claim inspection"],
  ["design", "sensitive claim detection"],
  ["design", "Base64 summaries"],
  ["design", "formatted JSON preview"],
  ["design", "decoded content shape, JSON key count, formatted JSON preview, JWT segment signal"],
  ["design", "Cron summaries"],
  ["design", "selectable day-of-month/day-of-week OR/AND semantics"],
  ["design", "browser timezone runtime context"],
  ["design", "selectable preview timezone"],
  ["design", "UUID summaries"],
  ["design", "Hash summaries"],
  ["design", "digest/HMAC mode selection"],
  ["design", "HMAC secret diagnostics"],
  ["design", "Password summaries"],
  ["design", "passphrase word count/separator/number controls"],
  ["design", "Random Token summaries"],
  ["design", "QR Code summaries"],
  ["design", "payload builder fields"],
  ["design", "image size and quiet-zone controls"],
  ["design", "payload type, destination host, tracking parameter count, scan density"],
  ["design", "Color summaries"],
  ["design", "AA/AAA diagnostics"],
  ["design", "DNS summaries"],
  ["design", "record-type diagnostics"],
  ["design", "deployment checklist"],
  ["design", "redirect diagnostics"],
  ["design", "hop timing/cache details"],
  ["design", "allowlisted final response headers"],
  ["design", "pasted-header parser"],
  ["design", "security header readiness"],
  ["design", "CSP generator"],
  ["design", "Meta Tag and Open Graph summaries"],
  ["design", "robots.txt and sitemap generator summaries"],
  ["design", "local/private hosts before raw output"],
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
  ["design", "security-header review"],
  ["design", "deploy config validation"],
  ["design", "CSV cleanup for API payloads"],
  ["design", "resizable left and right sidebars"],
  ["design", "right reference panel is closed by default"],
  ["design", "one stable neutral divider line"],
  ["design", "localized top-bar toggle"],
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
  ["design", "Real ad units may reserve space only with a valid publisher id and slot id"],
  ["design", "common result cards"],
  ["design", "diagnostic cards"],
  ["design", "primary input/output surface visually dominant"],
  ["design", "page-level auto ads"],
  ["design", "harness:layout"],
  ["design", "harness:visual"],
  ["localization", "getLocalizedTool"],
  ["localization", "generated-outline scaffolding"],
  ["localization", "Blog/Play prose harness"],
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
  ["localization", "URL Parser structure/query/tracking/canonical/warning labels"],
  ["localization", "JSON diagnostics for sensitive-looking keys, empty values, duplicate keys, and large arrays"],
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
  ["localization", "expected issuer/audience/scope comparison labels"],
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
  ["localization", "robots.txt/sitemap crawl-readiness labels and warnings"],
  ["localization", "Meta/Open Graph title, description, canonical, host, robots, HTTPS, noindex, and image-format labels"],
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
  ["localization", "`favoriteTools`, `addFavorite`, `removeFavorite`, `copyLink`, `copiedLink`, `localSessionTitle`, `localSessionBody`, `restoreLastWork`, and `clearLocalHistory`"],
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
  ["localization", "getLocalizedTrustContent"],
  ["localization", "guide.description"],
  ["localization", "Twitter title/description"],
  ["seo", "hreflang"],
  ["seo", "explicit 308 canonical host redirect"],
  ["seo", "x-default"],
  ["seo", "root `<html lang>`"],
  ["seo", "sitemap index"],
  ["seo", "Refresh sitemap `lastmod`"],
  ["seo", "/sitemaps/{locale}"],
  ["seo", "RTL"],
  ["seo", "country"],
  ["seo", "SearchAction schema"],
  ["seo", "Meta Tag Generator and Open Graph Preview pages"],
  ["seo", "noindex risk"],
  ["seo", "robots.txt and sitemap generator pages"],
  ["seo", "localized review messages before raw output"],
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
  ["seo", "workflow recipe searchIntents"],
  ["seo", "CSP, Docker Compose, and CSV cleanup"],
  ["seo", "npm run seo:report"],
  ["seo", "harness:seo-templates"],
  ["seo", "reports/templates/*.example.csv"],
  ["seo", "tool and guide pages"],
  ["seo", "guide.description"],
  ["seo", "Twitter title/description"],
  ["seo", "SoftwareApplication`, `FAQPage`, and `BreadcrumbList`"],
  ["seo", "unused AdSense preview"],
  ["seo", "Public UI, dictionaries, and support copy"],
  ["seo", "/about` and `/contact` are required trust pages"],
  ["seo", "real publisher id `ca-pub-2620992505263949` by default"],
  ["seo", "NEXT_PUBLIC_ENABLE_ADSENSE=false"],
  ["seo", "NEXT_PUBLIC_ADSENSE_TOOL_RESULT_SLOT"],
  ["seo", "NEXT_PUBLIC_ADSENSE_REFERENCE_SLOT"],
  ["seo", "NEXT_PUBLIC_ADSENSE_GUIDE_CONTENT_SLOT"],
  ["seo", "Allowed in-flow ad positions"],
  ["seo", "lazy-initialize"],
  ["seo", "page-level auto ads"],
  ["seo", "bottom overlays"],
  ["seo", "harness:deployment-status"],
  ["seo", "BOBOB_REQUIRE_NO_LEGACY_VERCEL"],
  ["seo", "Legacy standalone apps must not be restored"],
  ["verification", "harness:i18n"],
  ["verification", "harness:localization"],
  ["verification", "Root `<html lang>`"],
  ["verification", "getLocalizedLegalContent"],
  ["verification", "getLocalizedTrustContent"],
  ["verification", "ca-pub-2620992505263949"],
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
  ["verification", "working tool surface before registry-backed quick-start"],
  ["verification", "primary input/output surface must be visually dominant"],
  ["verification", "data-desktop-support-accordion"],
  ["verification", "guide-content"],
  ["verification", "lazy ad initialization"],
  ["verification", "support sections should render below the primary input/output surface"],
  ["verification", "data-primary-work-area"],
  ["verification", "data-tool-support-sections"],
  ["verification", "Core acquisition tools should have at least three real `inputExamples`"],
  ["verification", "three priority `failureCases`"],
  ["verification", "three priority `preCopyChecklist` items"],
  ["verification", "acquisition workflow clusters"],
  ["verification", "workflow recipe cards"],
  ["verification", "task-shaped search query recipe results"],
  ["verification", "exact workflow recipe title and search-intent matches"],
  ["verification", "security-header review"],
  ["verification", "deploy config validation"],
  ["verification", "CSV cleanup for API payloads"],
  ["verification", "failure cases"],
  ["verification", "pre-copy checklist"],
  ["verification", "Core acquisition tools in Korean, Japanese, Spanish, and German"],
  ["verification", "slug-specific localized priority failure cases and pre-copy checklist items"],
  ["verification", "Acquisition-cluster and first-step related tools"],
  ["verification", "Decorative WebGL and pointer-reactive backgrounds should stay absent"],
  ["verification", "Do not reintroduce ReactBits, Light Rays, Galaxy, `ogl`"],
  ["verification", "shader canvases"],
  ["verification", "pointermove/requestAnimationFrame background listeners"],
  ["verification", "static surface tokens"],
  ["verification", "harness:pointer-background"],
  ["verification", "Search results, center tool panel, and right reference panel"],
  ["verification", "right reference panel default-closed state"],
  ["verification", "stable non-flashing divider handles"],
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
  ["verification", "workflow recipe searchIntents"],
  ["verification", "CSP, Docker Compose, and CSV cleanup"],
  ["verification", "npm run seo:report"],
  ["verification", "harness:seo-templates"],
  ["verification", "reports/templates/*.example.csv"],
  ["verification", "tool and guide pages"],
  ["verification", "preserved sidebar scroll"],
  ["verification", "no horizontal overflow at narrow desktop widths"],
  ["verification", "No visible demand wording"],
  ["verification", "Mobile tool detail pages should show the primary tool surface"],
  ["verification", "No public UI, dictionary, or support copy"],
  ["verification", "No raw `contentCluster` slugs"],
  ["verification", "agent-skills-sync"],
  ["verification", "Core tool working surfaces should expose task-specific result summaries"],
  ["verification", "Regex should show presets, high-use regex snippets"],
  ["verification", "regex-from-examples generator"],
  ["verification", "JSON Formatter should show example payload buttons"],
  ["verification", "sensitive-looking key, empty value, duplicate key, and large array diagnostics"],
  ["verification", "JSON path preview with copyable paths"],
  ["verification", "inline path inspector"],
  ["verification", "line/column error context"],
  ["verification", "localized repair hints"],
  ["verification", "JSONPath Tester should show examples, supported syntax, result metrics, matched paths, and warnings"],
  ["verification", "JWT Decoder should show example tokens"],
  ["verification", "iat/nbf/exp/lifetime time-window summary"],
  ["verification", "expected issuer/audience/scope comparison"],
  ["verification", "redacted payload copy actions"],
  ["verification", "registered/public/private claim inspector"],
  ["verification", "sensitive claim detection"],
  ["verification", "Base64 should show examples"],
  ["verification", "formatted JSON preview"],
  ["verification", "decoded content shape, JSON key count, formatted JSON preview, JWT segment signal"],
  ["verification", "image/data URL preview"],
  ["verification", "copyable data URL output for detected images"],
  ["verification", "Cron should show localized presets"],
  ["verification", "selectable day-of-month/day-of-week OR/AND semantics"],
  ["verification", "browser timezone runtime context"],
  ["verification", "selectable preview timezone"],
  ["verification", "UUID should show count presets"],
  ["verification", "Hash should show example inputs"],
  ["verification", "digest/HMAC mode selection"],
  ["verification", "HMAC secret byte diagnostics"],
  ["verification", "Password should show random-password and passphrase modes"],
  ["verification", "passphrase word count/separator/number controls"],
  ["verification", "Random Token should show session/API/CSRF/webhook presets"],
  ["verification", "QR Code should show URL, Wi-Fi, email, and vCard examples"],
  ["verification", "payload builder fields"],
  ["verification", "image size and quiet-zone controls"],
  ["verification", "payload type, destination host, tracking parameter count, scan density"],
  ["verification", "Color should support HEX, RGB, and HSL input"],
  ["verification", "DNS should show record examples"],
  ["verification", "record-type diagnostics"],
  ["verification", "deployment checklist"],
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
  ["verification", "Canonical host behavior"],
  ["verification", "private/reserved hosts"],
  ["verification", "`redirectChain` array"],
  ["verification", "allowlisted `finalResponseHeaders`"],
  ["verification", "HTTP Status Checker UI should render"],
  ["verification", "security header readiness"],
  ["verification", "hop timing/cache details"],
  ["verification", "allowlisted final response headers"],
  ["verification", "redirect diagnostics"],
  ["verification", "local HTTP header parser"],
  ["verification", "CSP generator with warnings"],
  ["verification", "Meta Tag Generator and Open Graph Preview UIs"],
  ["verification", "image-format warning before raw tag output"],
  ["verification", "robots.txt and sitemap generator UIs"],
  ["verification", "URL Parser should show examples"],
  ["verification", "localized review labels"],
  ["verification", "Recent/favorite/tool-session repeat-usage sections"],
  ["verification", "`data-recent-tools`, `data-favorite-tools`, `data-tool-session`"],
  ["verification", "fake publisher IDs"],
  ["verification", "visible disabled ad placeholders"],
  ["verification", "No standalone legacy app directories"],
  ["verification", "package-lock.json"],
  ["verification", "harness:legacy"],
  ["verification", "harness:deployment-status"],
  ["verification", "generated-outline prose"],
  ["verification", "Naver Search Advisor checks"],
  ["verification", "Search Console/Bing/Naver"],
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
  ["product", "post-approval candidates"],
  ["product", "Real opt-in ad units may reserve space only with valid publisher and slot ids"],
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
  ["product", "exact localized title and search-intent matches"],
  ["product", "security-header review"],
  ["product", "deploy config validation"],
  ["product", "CSV cleanup for API payloads"],
  ["product", "feature-specific search surface"],
  ["product", "DNS deployment checklist"],
  ["product", "Base64 image/data URL preview"],
  ["product", "JWT claim inspection"],
  ["product", "JWT expected issuer/audience/scope comparison"],
  ["product", "JWT sensitive-claim redaction"],
  ["product", "HTTP security header readiness"],
  ["product", "QR image-size controls"],
  ["product", "JSON Formatter parse error line/column context"],
  ["product", "JSON Formatter sensitive-key/duplicate-key diagnostics"],
  ["product", "JSONPath field extraction"],
  ["product", "40+"],
  ["product", "localized tool directories"],
  ["product", "harness:seo-opportunities"],
  ["product", "harness:seo-measured"],
  ["product", "BOBOB_REQUIRE_MEASURED_SEO"],
  ["product", "BOBOB_REQUIRED_MEASURED_PATHS"],
  ["product", "reports/search-console.csv"],
  ["product", "reports/search-console.tsv"],
  ["product", "workflow recipe searchIntents"],
  ["product", "harness:seo-opportunities:smoke"],
  ["product", "titleDescriptionRecommendations"],
  ["product", "inputWarnings"],
  ["product", "web-operations workbench first"],
  ["product", "old-web-mini-game loops"],
  ["product", "generated outline"],
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
if (fs.existsSync(path.join(root, "apps/main/src/components/pointer-background.tsx"))) {
  failures.push("removed pointer background component should not exist");
}
const globalsCss = read("apps/main/src/app/globals.css");
for (const fragment of [".bobob-pointer-background", ".bobob-reactbits-light-rays", ".bobob-reactbits-galaxy", ".dark .bobob-reactbits-light-rays", ".dark .bobob-reactbits-galaxy", ".dark .bobob-reactbits-canvas", "--bobob-depth-x", "--bobob-ray-opacity"]) {
  if (globalsCss.includes(fragment)) failures.push(`global CSS still includes removed pointer background policy ${fragment}`);
}
for (const fragment of ["--bobob-surface-shell", "--bobob-surface-raised", "--bobob-border-strong", "--bobob-panel-shadow", "--bobob-scrollbar-thumb", "*::-webkit-scrollbar-thumb", "scrollbar-width: thin"]) {
  if (!globalsCss.includes(fragment)) failures.push(`global CSS missing surface/scrollbar policy ${fragment}`);
}
const directorySource = read("apps/main/src/features/tools/tool-directory.tsx");
if (directorySource.includes("PointerBackground") || directorySource.includes("backgroundVariant")) {
  failures.push("tool directory still includes removed pointer background");
}
for (const file of ["apps/main/src/app/page.tsx", "apps/main/src/app/[locale]/page.tsx"]) {
  const source = read(file);
  if (source.includes("PointerBackground") || source.includes("backgroundVariant")) failures.push(`${file} still includes removed home background`);
}
const workspaceSource = read("apps/main/src/features/tools/tool-workspace.tsx");
if (workspaceSource.includes("PointerBackground")) failures.push("tool workspace still includes removed pointer background");
for (const fragment of ["bobob:recent-tools", "data-recent-tools", "dictionary.nav.recentTools", "getLocalizedRelatedTools(recentSlugs, locale)"]) {
  if (!workspaceSource.includes(fragment)) failures.push(`tool workspace missing local-only recent tools behavior ${fragment}`);
}
for (const fragment of ["bobob:favorite-tools", "data-favorite-tools", "dictionary.nav.favoriteTools", "getLocalizedRelatedTools(favoriteSlugs, locale)", "writeFavoriteToolSlugs(locale, nextSlugs)"]) {
  if (!workspaceSource.includes(fragment)) failures.push(`tool workspace missing local-only favorite tools behavior ${fragment}`);
}
for (const fragment of ["data-copy-tool-link", "copyToolLink", "writeClipboardText(toolUrl)", "navigator.clipboard?.writeText", "document.execCommand(\"copy\")", "dictionary.tool.copyLink", "dictionary.tool.copiedLink"]) {
  if (!workspaceSource.includes(fragment)) failures.push(`tool workspace missing localized browser-only copy-link behavior ${fragment}`);
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
  if (read(file).includes("PointerBackground")) failures.push(`${file} still includes removed guide pointer background`);
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
for (const fragment of ["clampLayoutToAvailable", "ResizeObserver", "minmax(0,1fr)", "data-resizable-layout", "rightCollapsed", "data-right-panel-state", "React.useLayoutEffect", "after:bg-border"]) {
  if (!resizable.includes(fragment)) failures.push(`resizable implementation missing ${fragment}`);
}
if (resizable.includes("hover:after:") || resizable.includes("after:transition-colors")) {
  failures.push("resizable implementation must keep divider color stable without hover/transition flash");
}
const workspace = read("apps/main/src/features/tools/tool-workspace.tsx");
for (const fragment of ["React.useState(false)", "data-reference-panel-toggle", "rightCollapsed={!referencePanelOpen}", "data-reference-panel-state", "data-reference-panel", "dictionary.tool.openReferencePanel", "dictionary.tool.closeReferencePanel"]) {
  if (!workspace.includes(fragment)) failures.push(`tool workspace missing reference-panel toggle policy ${fragment}`);
}
if (workspace.includes("bobob:reference-panel")) failures.push("right reference panel open state must not persist; default should stay closed");
if (read("apps/main/src/components/ui/sidebar.tsx").includes("border-r")) failures.push("left sidebar must not render a duplicate border next to the resizable divider");
const googleAdsenseSource = read("apps/main/src/components/GoogleAdsense.tsx");
for (const fragment of ["IntersectionObserver", "rootMargin: '640px 0px'", "data-bobob-ad-loading"]) {
  if (!googleAdsenseSource.includes(fragment)) failures.push(`GoogleAdUnit missing lazy ad initialization policy ${fragment}`);
}
for (const fragment of ["bobob-ad-anchor", "position=\"tool-result\"", "position=\"reference-panel\""]) {
  if (!workspace.includes(fragment)) failures.push(`tool workspace missing non-intrusive ad anchor policy ${fragment}`);
}
const dictionaries = read("apps/main/src/features/i18n/dictionaries.ts");
for (const fragment of ["openReferencePanel", "closeReferencePanel"]) {
  if (!dictionaries.includes(fragment)) failures.push(`dictionary missing reference-panel label ${fragment}`);
}
for (const fragment of ["localizedSeoGeneratorToolUi", "robotsSitemapUrl", "robotsWarnings", "robotsLooksReady", "sitemapUrlList", "sitemapWarnings", "sitemapLooksReady"]) {
  if (!dictionaries.includes(fragment)) failures.push(`dictionary missing robots/sitemap localized label ${fragment}`);
}
for (const fragment of ["localizedMetaPreviewToolUi", "metaSeoReview", "metaLooksReady", "openGraphReview", "openGraphLooksReady", "titleLength", "descriptionLength", "canonicalHost", "imageHost", "robotsPolicy"]) {
  if (!dictionaries.includes(fragment)) failures.push(`dictionary missing Meta/Open Graph localized label ${fragment}`);
}
for (const fragment of ["localizedUrlParserToolUi", "urlStructure", "queryParameters", "trackingParameters", "canonicalCandidate", "urlReviewNotes", "urlTrackingWarning"]) {
  if (!dictionaries.includes(fragment)) failures.push(`dictionary missing URL Parser localized label ${fragment}`);
}
const toolComponentsSource = read("apps/main/src/features/tools/tool-components.tsx");
for (const fragment of ["data-tool-output-block", "bobob-tool-result-card", "data-tool-metric-grid", "bobob-diagnostic-card", "data-tool-warning-list"]) {
  if (!toolComponentsSource.includes(fragment)) failures.push(`tool components missing primary result/diagnostic separation ${fragment}`);
}
for (const fragment of ["data-url-parser-examples", "data-url-parser-diagnostics", "data-url-query-params", "data-url-canonical-review", "cleanUrlCandidate", "urlParserWarnings", "trackingParameterPattern"]) {
  if (!toolComponentsSource.includes(fragment)) failures.push(`tool components missing URL Parser readiness implementation ${fragment}`);
}
for (const fragment of ["data-robots-diagnostics", "data-sitemap-diagnostics", "escapeXml", "isPrivateOrLocalHostname", "parsePublicUrl", "robotsUnknownDirectiveWarning", "sitemapDuplicateUrlWarning", "sitemapMixedHostWarning"]) {
  if (!toolComponentsSource.includes(fragment)) failures.push(`tool components missing robots/sitemap crawl-readiness implementation ${fragment}`);
}
for (const fragment of ["data-meta-diagnostics", "data-og-diagnostics", "data-og-crawler-report", "data-og-crawler-report-preview", "buildOpenGraphCrawlerReport", "getImageExtensionSignal", "titleTooShortWarning", "descriptionTooLongWarning", "canonicalHashWarning", "noindexWarning", "ogTitleTooLongWarning"]) {
  if (!toolComponentsSource.includes(fragment)) failures.push(`tool components missing Meta/Open Graph readiness implementation ${fragment}`);
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
