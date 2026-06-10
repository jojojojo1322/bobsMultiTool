---
name: bobob-tool-addition
description: Use when adding, renaming, removing, or reorganizing Bob's Multi Tool utilities.
---

# Bobob Tool Addition

1. Add or update the tool metadata in `apps/main/src/features/tools/registry.ts`.
2. Add the component key type in `apps/main/src/features/tools/types.ts`.
3. Implement the client component in `apps/main/src/features/tools/tool-components.tsx`.
4. Set demandTier, searchIntents, aliases, useCases, inputExamples, contentCluster, monetizationTier, supportedLocales, privacyMode, and requiresServer.
5. Ensure the tool metadata supports failure cases, pre-copy checklist, and related next actions through `failureCases`, `preCopyChecklist`, useCases, inputExamples, searchIntents, relatedTools, and localized labels. Core acquisition tools need at least two real `inputExamples`, not only a single fallback sample.
6. Add localized visible prose for every non-English locale through the localized content resolver: description, SEO title/description, keyword chips, use cases, examples, FAQ, guide title, and related display labels.
7. Add slug-specific long-tail visible descriptions for `zh-CN`, `zh-TW`, `pt-BR`, `fr`, `hi`, `id`, `vi`, `th`, and `ar`; do not rely on generic translated templates for new tools.
8. Add guide links that resolve under `/guides/{slug}` and localized routes.
9. Add related tools that resolve to registered slugs.
10. Confirm the dynamic sitemap index and `/sitemaps/{locale}` coverage include the tool. Do not add a static `apps/main/public/sitemap.xml`.
11. Keep `apps/main` as the only app workspace. Do not add standalone app packages for individual tools; use registry entries and old-path redirects instead.
12. Update AGENTS.md or this skill when the tool-addition policy changes.
13. Run `npm run harness:registry`, `npm run harness:localization`, `npm run harness:search`, `npm run harness:tools`, `npm run harness:agents`, and `npm run harness:legacy`.

Every tool must include title, category, description, component key, SEO title/description/keywords, examples, FAQs, guides, related tools, demandTier, searchIntents, aliases, useCases, inputExamples, failureCases, preCopyChecklist, contentCluster, monetizationTier, supportedLocales, privacyMode, and requiresServer.
Locale routes must not fall back to raw English registry prose for sentence copy.
The `/tools` and `/{locale}/tools` directory pages must stay real indexable pages when tools change.
Legacy entry paths should be redirects in `apps/main/next.config.ts`, not restored standalone apps.
After package or architecture changes, run `npm run harness:legacy` so legacy standalone app packages stay archived/deleted.
