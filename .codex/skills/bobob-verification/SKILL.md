---
name: bobob-verification
description: Use before handing off Bob's Multi Tool changes, especially route, registry, sitemap, build, lint, and UI verification.
---

# Bobob Verification

- Keep handoff/status text short unless the user explicitly asks for analysis.
- UI, CSS, layout, theme, localization, or background changes require real browser verification on `localhost` before handoff.
- Blog + Play MVP changes should verify `/`, `/blog`, `/play`, `/play/office-survival`, `/play/prompt-cleanup`, `/play/meeting-escape`, `/play/priority-sorter`, `/play/bug-clicker`, `/tools`, and the reduced sitemap index before handoff.
- If `npm run build` ran while a local server was already running, restart the server before browser verification so stale CSS/JS chunks do not create false visual failures.
- Do not expose access tokens or secrets in verification output. Pass deployment credentials as environment variables such as `VERCEL_TOKEN`.

Run the narrow checks first:

```bash
npm run harness:registry
npm run harness:blog-play-mvp
npm run harness:blog-play-quality
npm run harness:play-interaction
npm run harness:live-discovery
npm run harness:indexing-observation
npm run harness:tools
npm run harness:i18n
npm run harness:localization
npm run harness:theme
npm run harness:search
npm run harness:layout
npm run harness:visual
npm run harness:agents
npm run harness:legacy
npm run harness:adsense-content
npm run harness:rendered-content
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
BOBOB_BASE_URL=http://localhost:3000 npm run harness:blog-play-quality
BOBOB_BASE_URL=http://localhost:3000 npm run harness:play-interaction
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
- Default and localized about/contact trust pages through `getLocalizedTrustContent`, footer trust navigation, and sitemap inclusion.
- Non-English common labels and chips, including privacy/server/local indicators, should be localized and should not show English fallback fragments outside the English source route.
- Arabic RTL route and visible prose.
- Sitemap index at `/sitemap.xml` and the current reduced submitted sitemap at `/sitemaps/en`; old per-locale sitemaps are paused, and full per-locale URL coverage should not be restored until localized Blog/Play content exists.
- Sitemap `lastmod` should be current for the latest tool, guide, route, or locale content commit.
- Blog + Play discovery routes should expose current content dates: `/sitemaps/en` should include URL-specific `lastmod` from Blog dates and Play `updatedAt`, and `/feed.xml`, `/atom.xml`, and `/feed.json` should include the same canonical Blog + Play items with current item dates.
- Blog + Play rendered quality checks should cover `/blog`, `/play`, Blog category hubs, every Blog post, and every Play page for exactly one `h1`, unique document title and meta description, canonical URL, enough visible text, OpenGraph/Twitter metadata, and BlogPosting/Game/CollectionPage structured data fragments.
- Play interaction checks should click every Play entry through mobile and desktop completion and confirm `data-play-result`, `data-play-share`, `data-play-result-links`, `data-play-related-play`, and `data-play-related-blog`.
- Live discovery checks should confirm the deployed canonical host returns the apex-to-www redirect, reduced sitemap, feeds, OpenSearch descriptor, llms.txt, IndexNow key file, ads.txt, and representative Blog/Play structured data. If CLI TLS trust fails, pass temporary TLS overrides only at command time and do not store them.
- Search indexing observation checks should keep `docs/search-indexing-observation-log.md` tied to the `bobob935` Search Console baseline, the 1-2 week check dates, the IndexNow 200 submission, and the live `/sitemaps/en` URL count. Do not close indexing readiness from deployment or sitemap fetch alone.
- `/blog` should expose broad source-locale categories such as `일기`, `요즘 관심사`, `AI`, `개발`, and `운영 기록`; standalone Blog posts must remain allowed, and any post that declares `relatedPlay` should link to an existing Play page whose metadata links back without fake SEO padding.
- `/blog/category/{slug}` should return source-locale category hub pages with real posts, category-specific metadata, structured data, and sitemap coverage only for categories with content.
- Global `/search?q=` should render Blog, Play, and archived Tools results, and root WebSite SearchAction should target that route. Home, `/tools`, localized tool directories, and workbench shared tool search should keep `?q=` URL state for the archived tool registry.
- `/opensearch.xml` should return `application/opensearchdescription+xml`, point to `/search?q={searchTerms}`, and be discoverable through the root `rel="search"` head link.
- `/llms.txt` should return `text/plain`, include the canonical Blog + Play MVP links, discovery routes, trust pages, and selected archived tools, and must not broaden the submitted sitemap URL set.
- `/tools` and localized tool directories should expose acquisition workflow clusters with localized tool copy and next-action links.
- Tool directory and tool detail pages should expose local-first workflow recipe cards for task paths such as API response formatting, API token debugging, redirect debugging, DNS deployment checks, Wi-Fi QR creation, secure token generation, security-header review, deploy config validation, and CSV cleanup for API payloads.
- Search results should surface workflow recipe matches for task-shaped queries and show localized recipe title, description, step chips, and step reasons. task-shaped search query recipe results must be checked in the search panel.
- Task-shaped search should rank exact workflow recipe title and search-intent matches ahead of weaker step-tool matches.
- Tool detail center panels should expose the working tool surface before registry-backed quick-start input examples, use cases, localized failure cases, and pre-copy checklist items. The primary input/output surface must be visually dominant before examples, recipes, related tools, guides, or other support material. Core acquisition tools should have at least three real `inputExamples`, three priority `failureCases`, and three priority `preCopyChecklist` items.
- Tool detail support sections should render below the primary input/output surface, not only in the right reference panel and not above the tool.
- The primary input/output surface should be visually isolated with `data-primary-work-area` and `data-primary-work-content`; support material should be grouped under `data-tool-support-sections` and `data-desktop-support-accordion` so related tools and examples do not visually attach to the immediate work area.
- Common output cards and diagnostic cards should expose `data-tool-output-block`, `data-tool-metric-grid`, and `data-tool-warning-list`, and should remain visually stronger than examples/related/support sections.
- Explicit ad slots should be limited to the tool-result, reference-panel, and guide-content positions. The app shell must load the base Google advertising script without initializing page-level auto ads or overlays, and lazy ad initialization should keep slot loading deferred until the unit is near the viewport.
- Core tool working surfaces should expose task-specific result summaries before raw JSON. Regex should show presets, high-use regex snippets, match count, effective flags, positions, capture groups, and a regex-from-examples generator with positive/negative examples, suggested pattern, confidence, warning, and apply action. JSON Formatter should show example payload buttons, root type, top-level count, nesting depth, root structure, sensitive-looking key, empty value, duplicate key, and large array diagnostics, JSON path preview with copyable paths, inline path inspector, copy formatted/minified/extracted-value actions, parse error position details, line/column error context, and localized repair hints. JSON Escape should show examples, string metrics, and escape/unescape warnings. YAML Validator should show examples, document metrics, indentation/boolean warnings, parsed preview, formatted YAML, and Docker Compose service/image/build/port/volume/environment/dependency diagnostics. ENV Parser Validator should show examples, variable/duplicate/malformed/secret metrics, localized warnings, structured variable preview, and parsed JSON. CSV JSON Converter should show CSV/JSON examples, CSV Cleaner options, row/column/empty/duplicate metrics, preview rows, localized warnings, and converted output. JWT Decoder should show example tokens, algorithm, token type, active/expired/not-before status, iat/nbf/exp/lifetime time-window summary, expected issuer/audience/scope comparison, Authorization header/token/payload/redacted payload copy actions, registered/public/private claim inspector, sensitive claim detection, identity claims, signature presence, and signature-not-verified warnings. Base64 should show examples, standard and URL-safe variants, byte/character counts, padding state, normalized decode handling, decoded content shape, JSON key count, formatted JSON preview, JWT segment signal, image/data URL preview, image download, copyable data URL output for detected images, secret-like keyword warning, control-character count, and decoded JSON/binary/image warnings. Cron should show localized presets, five-field breakdown, allowed value counts, selectable day-of-month/day-of-week OR/AND semantics, browser timezone runtime context, selectable preview timezone, next run estimates, copy action, timezone warning, every-minute warning, and day-overlap mode warning. UUID should show count presets, format options, generated/unique counts, version/variant checks, and compact/bulk warnings. Hash should show example inputs, digest/HMAC mode selection, HMAC secret byte diagnostics, input byte/line counts, per-algorithm notes, HMAC signature output, and password/JSON/whitespace/secret warnings. Password should show random-password and passphrase modes, configurable character groups, ambiguous-character exclusion, passphrase word count/separator/number controls, entropy, charset or word-list size, local-generation status, and storage/length/passphrase compatibility warnings. Random Token should show session/API/CSRF/webhook presets, byte length, token format, entropy, encoded length, URL-safe status, padding status, intended use, local-generation status, and storage/format warnings. QR Code should show URL, Wi-Fi, email, and vCard examples plus payload builder fields, error correction, image size and quiet-zone controls, byte/character counts, payload type, destination host, tracking parameter count, scan density, PNG actions, and protocol/Wi-Fi/vCard/email/tracking/long-content warnings. Color should support HEX, RGB, and HSL input and show examples, swatches, WCAG contrast status, AA/AAA diagnostics, alpha limitations, luminance gap, and warnings. DNS should show record examples, status summary, record-type diagnostics, deployment checklist for A/AAAA/CNAME/NS/TXT/DMARC, readable records, public-host/server-route warnings, and raw JSON after structured output. SQL/CSS/JavaScript formatters should show realistic examples, input/output metrics, known limitation warnings, and risky pattern warnings before users copy formatted code. SQL formatter verification must include query type, table-reference chips, JOIN/subquery/parameter counts, WHERE/LIMIT clause checks, sensitive-field signals, schema-change warning, and mutation-without-WHERE warning. CSS formatter/minifier verification must include selector preview, custom property count, color token count, at-rule count, compression ratio, duplicate selector warning, ID specificity warning, and comment-removal warning. JavaScript formatter/minifier verification must include import/export count, async/await count, browser API signals, fetch warning, console warning, compression ratio, TODO warning, eval warning, and comment-removal warning.
- JSONPath Tester should show examples, supported syntax, result metrics, matched paths, and warnings, including matched values, copy matched paths, no-match warnings, and truncation warnings before the copy-ready result.
- URL Parser should show examples, URL structure metrics, query parameter rows, tracking parameter detection, clean URL copy, canonical candidate, HTTPS/local/private-host/credentials/hash warnings, and localized labels before raw JSON.
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
- Decorative WebGL and pointer-reactive backgrounds should stay absent. Do not reintroduce ReactBits, Light Rays, Galaxy, `ogl`, shader canvases, `data-reactbits-background`, or pointermove/requestAnimationFrame background listeners without explicit approval.
- Verify light and dark modes still keep enough workbench separation through static surface tokens, borders, shadows, and scrollbar styling after background changes.
- Run `npm run harness:pointer-background` after background changes to prove removed WebGL/pointer background assets stay absent.
- Search Console/AdSense opportunity report behavior. Without CSV inputs it should keep registry metadata warnings at zero when metadata is healthy; with CSV inputs it should report high-impression low-CTR tool and guide pages, low-RPM pages, and `titleDescriptionRecommendations`.
- SEO measured exports can be provided through env vars or default local files at `reports/search-console.csv`, `reports/search-console.tsv`, `reports/adsense.csv`, and `reports/adsense.tsv`; measured CSV/TSV files and generated markdown reports must stay untracked.
- SEO reports should include `measurementBacklog`, `measuredExportPlan`, and `measuredExportPlan.copyTargets` for unmeasured or partially measured core pages, and verification should confirm none of these fields is used as a direct title/description rewrite signal.
- SEO reports should include `metadataRewriteReadiness`; public title/description edits are not ready unless `canRewritePublicMetadata` is true and measured query recommendations exist.
- SEO report `inputWarnings` should flag missing required or recommended Search Console/AdSense CSV headers so empty measured results are not silently trusted.
- `npm run harness:seo-measured` should be used for post-deploy measured SEO work. It sets `BOBOB_REQUIRE_MEASURED_SEO=1` and should fail until required core pages have both Search Console and AdSense rows.
- `BOBOB_REQUIRED_MEASURED_PATHS` is acceptable for a targeted page review, but should not be used to claim final core-page measured readiness.
- SEO opportunity report smoke should prove valid measured CSV fixtures create opportunities and malformed CSV fixtures create `inputWarnings`.
- Export-packet SEO report behavior with `npm run seo:export-packet` should produce a short Search Console/AdSense collection handoff with page regex, canonical URL batch, CSV headers, focused gate command, metadata rewrite stop rule, registry search intents, and workflow recipe searchIntents for task queries such as CSP, Docker Compose, and CSV cleanup.
- Markdown SEO report behavior with `npm run seo:report` should produce a reviewable title/description recommendations table, measured export CSV templates, and metadata rewrite readiness when CSV inputs are present.
- Safe measured export instructions and sample headers should stay tracked in `reports/README.md` and `reports/templates/*.example.csv`, while real Search Console/AdSense CSV or TSV exports stay untracked.
- Desktop left and right sidebar resizing, right reference panel default-closed state plus localized open/close toggle, single-shell panel alignment, clamped panel widths with no horizontal overflow at narrow desktop widths, stable non-flashing divider handles without hover color transitions or duplicate center-panel inset side lines, top brand/home link, preserved sidebar scroll when clicking tool navigation, plus mobile Sheet fallback.
- Canonical host behavior: `bobob.app` should use a 308 redirect to `www.bobob.app` before any locale redirect, while explicit locale URLs remain final 200 pages.
- No visible demand wording or raw `core` / `growth` / `long-tail` demand badges in home cards, search results, or tool detail headers.
- No public UI, dictionary, or support copy should expose AdSense, approval/review-status, monetization, fake ad placeholder, or demand-tier wording to users. Legal pages may disclose third-party advertising, cookies, and Google advertising services without approval-status wording.
- `npm run harness:adsense-content` should pass after AdSense, guide, legal, trust, or visible-content changes; it guards against thin guide pages, fake ad placeholders, public approval-status wording, static sitemap regressions, and missing localized guide expansion sections.
- `BOBOB_BASE_URL=http://localhost:3000 npm run harness:rendered-content` should pass after low-value-content or visible-content changes; it checks rendered text length, public-policy wording, and horizontal overflow across default tools/guides plus representative localized pages.
- No raw `contentCluster` slugs such as `data-conversion` or `code-formatting` in visible badges or section descriptions.
- A local-only tool and a server route tool.
- Server route tools reject private/reserved hosts, validate redirect targets, and rate-limit repeated requests. HTTP status checks should expose a `redirectChain` array with hop URL, status, location, content-type, cache-control, and elapsed-time fields, plus allowlisted `finalResponseHeaders` and security header readiness UI.
- HTTP Status Checker UI should render a status summary, ordered redirect chain, hop timing/cache details, redirect diagnostics, allowlisted final response headers, a local HTTP header parser for pasted header blocks, security header readiness, a CSP generator with warnings and parser handoff, and raw JSON response.
- Meta Tag Generator and Open Graph Preview UIs should render title/description length, canonical/page host, image host, robots policy, HTTPS validation, local/private-host validation, noindex warning, and image-format warning before raw tag output.
- robots.txt and sitemap generator UIs should render crawl-readiness diagnostics before raw output, including sitemap URL validation, directive counts, URL counts, duplicate removal, mixed-host detection, non-HTTPS warnings, local/private-host warnings, and localized review labels.
- No unused ad placeholder components, fake publisher IDs, visible disabled ad placeholders, or ad preview blocks remain in the public app. The base Google advertising script should load with `ca-pub-2620992505263949` unless explicitly disabled, while real in-flow ad units remain slot-id gated and placed away from input/output controls.
- No standalone legacy app directories, `packages/ui`, `turbo.json`, `turbo` dependency, or stale legacy workspace entries in `package-lock.json` remain. Old public entry paths should be verified as permanent redirects to `/tools/{slug}`, with rationale recorded in `docs/legacy-apps-archive.md`.
- Deployment status should show `Vercel – bobs-multi-tool-main` as successful or use the Vercel project API fallback with `VERCEL_TOKEN` and `BOBOB_REQUIRE_MAIN_VERCEL=1`. Stale legacy Vercel project statuses are external cleanup work; after deletion or Git unlinking, `BOBOB_REQUIRE_NO_LEGACY_VERCEL=1 npm run harness:deployment-status` should pass.
- If the latest commit only changes docs, harnesses, or skills and Vercel does not redeploy, use `BOBOB_DEPLOY_SHA` to verify the latest app-affecting production deployment.
- Clean build behavior with no build-time external font downloads.
- The agent-skills-sync gate whenever feature, policy, SEO, theme, or i18n rules changed.
