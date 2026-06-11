---
name: bobob-verification
description: Use before handing off Bob's Multi Tool changes, especially route, registry, sitemap, build, lint, and UI verification.
---

# Bobob Verification

Run the narrow checks first:

```bash
npm run harness:registry
npm run harness:tools
npm run harness:i18n
npm run harness:localization
npm run harness:theme
npm run harness:search
npm run harness:layout
npm run harness:visual
npm run harness:agents
npm run harness:legacy
npm run harness:seo-opportunities
npm run harness:seo-opportunities:smoke
npm run harness:seo-templates
npm run seo:export-packet
npm run seo:report
npm run harness:deployment-status
```

Then run implementation checks:

```bash
npm install
npm run lint
npm run build
```

For deployment-sensitive changes, also verify a clean install/build path rather than relying on local caches:

```bash
npm ci
npm run build
```

Do not reintroduce `next/font/google` or build-time external font fetches. The build must not depend on Google Fonts network access.

For a running local server, run:

```bash
BOBOB_BASE_URL=http://localhost:3000 npm run harness:routes
BOBOB_BASE_URL=http://localhost:3000 npm run harness:visual
```

Before handoff, inspect desktop and mobile layouts for the home page and at least three representative tools.

Include:

- Light/Dark/System theme toggle behavior.
- Default English and at least two localized routes.
- Root `<html lang>` and `<html dir>` must match the active locale; route-level `main` attributes alone are insufficient.
- Localized visible prose for home, tool detail, sidebar search results, examples, FAQ, guide sections, and metadata.
- Every guide should have topic-specific long-tail guide lead sections for `zh-CN`, `zh-TW`, `pt-BR`, `fr`, `hi`, `id`, `vi`, `th`, and `ar`, rather than reusing the same generic opening paragraph.
- Guide detail meta description and OpenGraph description must match the localized `guide.description`, not a generic title-based template.
- Tool and guide detail pages must expose page-specific OpenGraph and Twitter title/description values, not root default social metadata.
- Tool detail pages should include registry-backed `SoftwareApplication`, `FAQPage`, and `BreadcrumbList` structured data without fabricated rating or review fields.
- Localized privacy and terms prose plus metadata through `getLocalizedLegalContent`.
- Non-English common labels and chips, including privacy/server/local indicators, should be localized and should not show English fallback fragments outside the English source route.
- Arabic RTL route and visible prose.
- Sitemap index at `/sitemap.xml`, per-locale sitemaps at `/sitemaps/en`, `/sitemaps/ko`, `/sitemaps/ar`, and full locale URL coverage without the old 200 URL static cap.
- Sitemap `lastmod` should be current for the latest tool, guide, route, or locale content commit.
- Home, `/tools`, localized tool directories, and workbench shared search behavior, including `?q=` URL state and SearchAction schema alignment.
- `/tools` and localized tool directories should expose acquisition workflow clusters with localized tool copy and next-action links.
- Tool directory and tool detail pages should expose local-first workflow recipe cards for task paths such as API response formatting, API token debugging, redirect debugging, DNS deployment checks, Wi-Fi QR creation, and secure token generation.
- Search results should surface workflow recipe matches for task-shaped queries and show localized recipe title, description, step chips, and step reasons. task-shaped search query recipe results must be checked in the search panel.
- Tool detail center panels should expose the working tool surface before registry-backed quick-start input examples, use cases, localized failure cases, and pre-copy checklist items. Core acquisition tools should have at least three real `inputExamples`, three priority `failureCases`, and three priority `preCopyChecklist` items.
- Tool detail support sections should render below the primary input/output surface, not only in the right reference panel and not above the tool.
- Core tool working surfaces should expose task-specific result summaries before raw JSON. Regex should show presets, high-use regex snippets, match count, effective flags, positions, capture groups, and a regex-from-examples generator with positive/negative examples, suggested pattern, confidence, warning, and apply action. JSON Formatter should show example payload buttons, root type, top-level count, nesting depth, root structure, JSON path preview with copyable paths, copy formatted/minified actions, and parse error position details. JSON Escape should show examples, string metrics, and escape/unescape warnings. YAML Validator should show examples, document metrics, indentation/boolean warnings, parsed preview, formatted YAML, and Docker Compose service/image/build/port/volume/environment/dependency diagnostics. ENV Parser Validator should show examples, variable/duplicate/malformed/secret metrics, localized warnings, structured variable preview, and parsed JSON. CSV JSON Converter should show CSV/JSON examples, CSV Cleaner options, row/column/empty/duplicate metrics, preview rows, localized warnings, and converted output. JWT Decoder should show example tokens, algorithm, token type, active/expired/not-before status, iat/nbf/exp/lifetime time-window summary, identity claims, signature presence, and signature-not-verified warnings. Base64 should show examples, standard and URL-safe variants, byte/character counts, padding state, normalized decode handling, decoded content shape, JSON key count, JWT segment signal, image/data URL preview, copyable data URL output for detected images, secret-like keyword warning, control-character count, and decoded JSON/binary/image warnings. Cron should show localized presets, five-field breakdown, allowed value counts, selectable day-of-month/day-of-week OR/AND semantics, browser timezone runtime context, next run estimates, copy action, timezone warning, every-minute warning, and day-overlap mode warning. UUID should show count presets, format options, generated/unique counts, version/variant checks, and compact/bulk warnings. Hash should show example inputs, digest/HMAC mode selection, HMAC secret byte diagnostics, input byte/line counts, per-algorithm notes, HMAC signature output, and password/JSON/whitespace/secret warnings. Password should show random-password and passphrase modes, configurable character groups, ambiguous-character exclusion, passphrase word count/separator/number controls, entropy, charset or word-list size, local-generation status, and storage/length/passphrase compatibility warnings. Random Token should show session/API/CSRF/webhook presets, byte length, token format, entropy, encoded length, URL-safe status, padding status, intended use, local-generation status, and storage/format warnings. QR Code should show URL, Wi-Fi, email, and vCard examples plus payload builder fields, error correction, byte/character counts, payload type, destination host, tracking parameter count, scan density, PNG actions, and protocol/Wi-Fi/vCard/email/tracking/long-content warnings. Color should support HEX, RGB, and HSL input and show examples, swatches, WCAG contrast status, AA/AAA diagnostics, alpha limitations, luminance gap, and warnings. DNS should show record examples, status summary, record-type diagnostics, readable records, public-host/server-route warnings, and raw JSON after structured output. SQL/CSS/JavaScript formatters should show realistic examples, input/output metrics, known limitation warnings, and risky pattern warnings before users copy formatted code. SQL formatter verification must include query type, table-reference chips, JOIN/subquery/parameter counts, WHERE/LIMIT clause checks, sensitive-field signals, schema-change warning, and mutation-without-WHERE warning. CSS formatter/minifier verification must include selector preview, custom property count, color token count, at-rule count, compression ratio, duplicate selector warning, ID specificity warning, and comment-removal warning. JavaScript formatter/minifier verification must include import/export count, async/await count, browser API signals, fetch warning, console warning, compression ratio, TODO warning, eval warning, and comment-removal warning.
- JSONPath Tester should show examples, supported syntax, result metrics, matched paths, and warnings, including matched values, copy matched paths, no-match warnings, and truncation warnings before the copy-ready result.
- Tool detail pages should show registry-backed failure cases, pre-copy checklist, and related next actions without exposing raw demand wording.
- Mobile tool detail pages should show the primary tool surface before support/reference material, collapse reference content into the mobile accordion, keep the sticky mobile action bar visible, and avoid exposing unsupported fake copy/download actions.
- Search results should expose compact match-signal chips from localized title, description, use cases, examples, failure cases, pre-copy checklist items, aliases, intents, keywords, FAQ, guide titles, and related next-action context so query intent is visible before navigation.
- Search results, center tool panel, and right reference panel should all offer related next-action links for session-depth growth.
- Related next-action links should preserve registry `relatedTools` order and show localized use-case context from the related tool.
- Recent/favorite/tool-session repeat-usage sections should be local-only, localized, and backed by `localStorage`, not analytics, account state, or server persistence. Verify `data-recent-tools`, `data-favorite-tools`, `data-tool-session`, localized favorite labels, restore-last-work labels, clear-local-history labels, and save/remove action labels.
- Core acquisition tools in Korean, Japanese, Spanish, and German should have slug-specific priority descriptions for JSON, Regex, JWT, Base64, Cron, UUID, Hash, Password, QR, DNS, HTTP, Color, SQL, CSS, and JavaScript.
- Core acquisition tools in Korean, Japanese, Spanish, and German should have slug-specific localized priority failure cases and pre-copy checklist items for the central review strip, not only generic localized fallback support prose.
- Acquisition-cluster and first-step related tools should also have Korean, Japanese, Spanish, and German priority intent copy so next-action links avoid generic fallback prose.
- Markdown Previewer should expose the Markdown Table Generator workflow with CSV/TSV/pipe examples, delimiter selection, row/column/empty/uneven metrics, localized warnings, copy-ready table output, and preview insertion without a separate thin page.
- Pointer-reactive background motion should stay subtle, respect reduced motion, render on home/tool directory, tool detail, guide directory, and guide detail pages, use requestAnimationFrame-driven CSS variable smoothing with depth offset and ray opacity variables, and avoid `ogl`, `framer-motion`, or other heavy animation dependencies.
- Run `npm run harness:pointer-background` after pointer background changes to prove CSS variables change on real mouse movement.
- Search Console/AdSense opportunity report behavior. Without CSV inputs it should keep registry metadata warnings at zero when metadata is healthy; with CSV inputs it should report high-impression low-CTR tool and guide pages, low-RPM pages, and `titleDescriptionRecommendations`.
- SEO measured exports can be provided through env vars or default local files at `reports/search-console.csv`, `reports/search-console.tsv`, `reports/adsense.csv`, and `reports/adsense.tsv`; measured CSV/TSV files and generated markdown reports must stay untracked.
- SEO reports should include `measurementBacklog`, `measuredExportPlan`, and `measuredExportPlan.copyTargets` for unmeasured or partially measured core pages, and verification should confirm none of these fields is used as a direct title/description rewrite signal.
- SEO reports should include `metadataRewriteReadiness`; public title/description edits are not ready unless `canRewritePublicMetadata` is true and measured query recommendations exist.
- SEO report `inputWarnings` should flag missing required or recommended Search Console/AdSense CSV headers so empty measured results are not silently trusted.
- `npm run harness:seo-measured` should be used for post-deploy measured SEO work. It sets `BOBOB_REQUIRE_MEASURED_SEO=1` and should fail until required core pages have both Search Console and AdSense rows.
- `BOBOB_REQUIRED_MEASURED_PATHS` is acceptable for a targeted page review, but should not be used to claim final core-page measured readiness.
- SEO opportunity report smoke should prove valid measured CSV fixtures create opportunities and malformed CSV fixtures create `inputWarnings`.
- Export-packet SEO report behavior with `npm run seo:export-packet` should produce a short Search Console/AdSense collection handoff with page regex, canonical URL batch, CSV headers, focused gate command, metadata rewrite stop rule, and long-tail search intent seeds for feature-specific queries such as Regex snippets.
- Markdown SEO report behavior with `npm run seo:report` should produce a reviewable title/description recommendations table, measured export CSV templates, and metadata rewrite readiness when CSV inputs are present.
- Safe measured export instructions and sample headers should stay tracked in `reports/README.md` and `reports/templates/*.example.csv`, while real Search Console/AdSense CSV or TSV exports stay untracked.
- Desktop left and right sidebar resizing, single-shell panel alignment, clamped panel widths with no horizontal overflow at narrow desktop widths, top brand/home link, preserved sidebar scroll when clicking tool navigation, plus mobile Sheet fallback.
- Canonical host behavior: `bobob.app` should use a 308 redirect to `www.bobob.app` before any locale redirect, while explicit locale URLs remain final 200 pages.
- No visible demand wording or raw `core` / `growth` / `long-tail` demand badges in home cards, search results, or tool detail headers.
- No public UI, dictionary, legal, or support copy should expose AdSense, approval/review-status, monetization, fake ad placeholder, or demand-tier wording to users.
- No raw `contentCluster` slugs such as `data-conversion` or `code-formatting` in visible badges or section descriptions.
- A local-only tool and a server route tool.
- Server route tools reject private/reserved hosts, validate redirect targets, and rate-limit repeated requests. HTTP status checks should expose a `redirectChain` array with hop URL, status, location, content-type, cache-control, and elapsed-time fields, plus allowlisted `finalResponseHeaders`.
- HTTP Status Checker UI should render a status summary, ordered redirect chain, hop timing/cache details, redirect diagnostics, allowlisted final response headers, a local HTTP header parser for pasted header blocks, a CSP generator with warnings and parser handoff, and raw JSON response.
- No unused ad placeholder components, fake publisher IDs, visible disabled ad placeholders, or ad preview blocks remain in the public app. Real in-flow ad units must be opt-in, slot-id gated, and placed away from input/output controls.
- No standalone legacy app directories, `packages/ui`, `turbo.json`, `turbo` dependency, or stale legacy workspace entries in `package-lock.json` remain. Old public entry paths should be verified as permanent redirects to `/tools/{slug}`, with rationale recorded in `docs/legacy-apps-archive.md`.
- Deployment status should show `Vercel – bobs-multi-tool-main` as successful or use the Vercel project API fallback with `VERCEL_TOKEN` and `BOBOB_REQUIRE_MAIN_VERCEL=1`. Stale legacy Vercel project statuses are external cleanup work; after deletion or Git unlinking, `BOBOB_REQUIRE_NO_LEGACY_VERCEL=1 npm run harness:deployment-status` should pass.
- If the latest commit only changes docs, harnesses, or skills and Vercel does not redeploy, use `BOBOB_DEPLOY_SHA` to verify the latest app-affecting production deployment.
- Clean build behavior with no build-time external font downloads.
- The agent-skills-sync gate whenever feature, policy, SEO, theme, or i18n rules changed.
