---
name: bobob-tool-addition
description: Use when adding, renaming, removing, or reorganizing Bob's Multi Tool utilities.
---

# Bobob Tool Addition

1. Add or update the tool metadata in `apps/main/src/features/tools/registry.ts`.
2. Add the component key type in `apps/main/src/features/tools/types.ts`.
3. Implement the client component in `apps/main/src/features/tools/tool-components.tsx`.
4. Set demandTier, searchIntents, aliases, useCases, inputExamples, contentCluster, monetizationTier, supportedLocales, privacyMode, and requiresServer.
5. Add localized visible prose for every non-English locale through the localized content resolver: description, SEO title/description, keyword chips, use cases, examples, FAQ, guide title, and related display labels.
6. Add guide links that resolve under `/guides/{slug}` and localized routes.
7. Add related tools that resolve to registered slugs.
8. Update `apps/main/public/sitemap.xml` while keeping it at or below 200 final URLs.
9. Update AGENTS.md or this skill when the tool-addition policy changes.
10. Run `npm run harness:registry`, `npm run harness:localization`, `npm run harness:search`, `npm run harness:tools`, and `npm run harness:agents`.

Every tool must include title, category, description, component key, SEO title/description/keywords, examples, FAQs, guides, related tools, demandTier, searchIntents, aliases, useCases, inputExamples, contentCluster, monetizationTier, supportedLocales, privacyMode, and requiresServer.
Locale routes must not fall back to raw English registry prose for sentence copy.
