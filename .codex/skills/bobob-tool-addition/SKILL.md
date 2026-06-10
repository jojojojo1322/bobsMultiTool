---
name: bobob-tool-addition
description: Use when adding, renaming, removing, or reorganizing Bob's Multi Tool utilities.
---

# Bobob Tool Addition

1. Add or update the tool metadata in `apps/main/src/features/tools/registry.ts`.
2. Add the component key type in `apps/main/src/features/tools/types.ts`.
3. Implement the client component in `apps/main/src/features/tools/tool-components.tsx`.
4. Set demandTier, searchIntents, aliases, useCases, inputExamples, contentCluster, monetizationTier, supportedLocales, privacyMode, and requiresServer.
5. Ensure the tool metadata supports failure cases, pre-copy checklist, and related next actions through `failureCases`, `preCopyChecklist`, useCases, inputExamples, searchIntents, relatedTools, and localized labels. Core acquisition tools need at least three real `inputExamples`, three priority `failureCases`, and three priority `preCopyChecklist` items, not only single fallback samples.
6. Add localized visible prose for every non-English locale through the localized content resolver: description, SEO title/description, keyword chips, use cases, examples, FAQ, guide title, and related display labels.
7. Add slug-specific long-tail visible descriptions for `zh-CN`, `zh-TW`, `pt-BR`, `fr`, `hi`, `id`, `vi`, `th`, and `ar`; do not rely on generic translated templates for new tools.
8. Add guide links that resolve under `/guides/{slug}` and localized routes.
9. Add related tools that resolve to registered slugs, ordered as the intended next-action path.
10. Make sure related tool useCases are strong enough to appear as localized next-action context, not only as bare tool names.
11. If the tool fits an existing workflow recipe, add or update the local-first workflow recipe and localized step reason. Recipe matches should support task-shaped search queries and link to registered tools rather than standalone recipe pages.
12. If an existing core tool gains feature-specific intent such as Regex snippets, Base64 image/data URL preview, or JSONPath field extraction, update the registry keywords/aliases/useCases/inputExamples, workflow recipes when task-shaped, and search/SEO harnesses in the same slice.
13. Confirm the dynamic sitemap index and `/sitemaps/{locale}` coverage include the tool. Do not add a static `apps/main/public/sitemap.xml`.
14. Confirm mobile detail behavior stays task-first: the tool surface should appear before support/reference material, reference content should collapse into the mobile accordion, and any sticky mobile action must map to a real action or navigation target.
15. Do not add user-facing AdSense, approval/review-status, monetization, fake ad placeholder, or demand-tier wording in tool copy, legal/common copy, examples, FAQ, guides, or search snippets.
16. For server route tools, validate public-host input, block private/reserved hosts, use timeouts, rate-limit repeated requests, and provide actionable error copy.
17. For HTTP or redirect-related tools, expose redirect-chain details instead of only the final status. Each hop should include URL, status, location, content-type, cache-control, and elapsed time when available. The UI should render the chain, redirect diagnostics, and allowlisted final-response headers before the raw JSON response.
18. For generator/security tools, expose practical presets, input/result metrics, local-generation status, warnings, and copy/download actions before raw output. UUID, Hash, Password, Random Token, and QR surfaces are the baseline pattern. Password must cover random-password and passphrase modes, including word count, separator, optional number, word-list size, entropy, and compatibility warnings. Random Token must expose session/API/CSRF/webhook presets, entropy, encoded length, URL-safe status, padding status, intended use, and storage/format warnings. QR-like tools must expose URL/Wi-Fi/email/vCard payload builders, payload type, destination host, tracking parameter count, scan density, and error-correction meaning before PNG download.
19. For color or accessibility tools, support the formats promised in registry copy and show visual swatches, WCAG AA/AAA diagnostics, alpha limitations, luminance gap, and contrast warnings before raw values.
20. For DNS or network tools, show examples, structured records or hops, public-host/server-route warnings, and raw JSON only after the readable result.
21. For code formatter tools, show realistic examples, snippet metrics, formatter limitation warnings, and risky pattern warnings instead of exposing only a text box and output block. SQL formatter updates must include query type, table references, JOIN/subquery/parameter counts, WHERE/LIMIT clause checks, sensitive-field signals, schema-change warnings, mutation-without-WHERE warnings, and table-reference chips. CSS formatter/minifier updates must include selector preview, custom property count, color token count, at-rule count, compression ratio, duplicate selector warnings, ID specificity warnings, and comment-removal warnings. JavaScript formatter/minifier updates must include import/export count, async/await count, browser API signals, fetch warning, console warning, compression ratio, TODO warning, eval warning, and comment-removal warning.
22. For data/config tools such as Base64, JSON Escape, YAML Validator, and ENV Parser Validator, show realistic examples, input/result metrics, localized warnings, structured previews, and copy-ready output instead of exposing only a text box and raw result. Base64-like tools must expose decoded content shape, JSON key count, JWT segment signal, image/data URL preview, secret-like keyword warning, and control-character count before copying. YAML Validator must also expose Docker Compose service/image/build/port/volume/environment/dependency diagnostics and formatted YAML output.
23. Prefer strengthening existing cluster tools before adding thin pages. CSV Cleaner behavior belongs inside CSV JSON Converter unless there is measured search data proving a separate page is needed.
24. Regex Generator from examples belongs inside Regex Tester as a compact positive/negative example assistant unless measured search data proves a standalone page is needed.
25. HTTP Header Parser behavior belongs inside HTTP Status Checker as a pasted-header review panel unless measured search data proves a standalone page is needed.
26. CSP Generator behavior belongs inside HTTP Status Checker as a Content-Security-Policy draft/review panel unless measured search data proves a standalone page is needed.
27. Markdown Table Generator behavior belongs inside Markdown Previewer as a CSV/TSV/pipe-to-Markdown-table panel unless measured search data proves a standalone page is needed.
28. Docker Compose Validator/Formatter behavior belongs inside YAML Validator unless measured search data proves a standalone page is needed.
29. Keep `apps/main` as the only app workspace. Do not add standalone app packages for individual tools; use registry entries and old-path redirects instead.
30. Update AGENTS.md or this skill when the tool-addition policy changes.
31. Run `npm run harness:registry`, `npm run harness:localization`, `npm run harness:search`, `npm run harness:tools`, `npm run harness:agents`, and `npm run harness:legacy`.

Every tool must include title, category, description, component key, SEO title/description/keywords, examples, FAQs, guides, related tools, demandTier, searchIntents, aliases, useCases, inputExamples, failureCases, preCopyChecklist, contentCluster, monetizationTier, supportedLocales, privacyMode, and requiresServer.
Locale routes must not fall back to raw English registry prose for sentence copy.
The `/tools` and `/{locale}/tools` directory pages must stay real indexable pages when tools change.
Legacy entry paths should be redirects in `apps/main/next.config.ts`, not restored standalone apps.
After package or architecture changes, run `npm run harness:legacy` so legacy standalone app packages stay archived/deleted.
