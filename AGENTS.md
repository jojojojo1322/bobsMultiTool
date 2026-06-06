# Bob's Multi Tool Agent Harness

## Routing

- Use `bobob-product-strategy` when deciding monetization direction, tool priority, AdSense readiness, or content scope.
- Use `bobob-design-system` before changing layouts, visual style, shadcn/ui primitives, navigation, or responsive behavior.
- Use `bobob-tool-addition` before adding or renaming tools.
- Use `bobob-adsense-seo` before changing domains, redirects, metadata, sitemap, robots, ads.txt, privacy, or terms.
- Use `bobob-localization-quality` before changing visible prose, locale routing, tool copy, guide copy, metadata copy, or translation coverage.
- Use `bobob-verification` before final handoff.
- When features, tool policy, SEO/AdSense policy, i18n, or theme rules change, the matching skills must be updated in the same change.

## Hard Rules

- `apps/main` is the only public product app.
- Public tool URLs must use `https://www.bobob.app/tools/{slug}`.
- Default English URLs stay unprefixed. Non-English routes use `/{locale}/tools/{slug}` and must keep canonical/hreflang behavior aligned.
- Do not add AI assistant features unless explicitly requested again.
- New tools must be registered in `apps/main/src/features/tools/registry.ts` and backed by a component key.
- Every tool needs SEO metadata, examples, FAQs, guide links, related tools, demandTier, searchIntents, supportedLocales, privacyMode, and requiresServer.
- Every tool also needs aliases, useCases, inputExamples, contentCluster, and monetizationTier so SEO, internal search, and monetization review stay tied to the registry.
- Keep the UI dense, neutral, and workbench-like. Avoid generic AI-generated landing-page patterns, especially raised colored top borders and decorative accent strips.
- Desktop tool pages must keep real resizable left and right sidebars with persisted localStorage widths: left 280px default / 220px min, right 340px default / 280px min, center 560px min.
- Internal search must use the shared registry search index across home and tool workbench surfaces.
- Locale alternates must include `x-default`; Arabic must keep RTL verification coverage.
- Non-English locale pages must not render raw English registry prose for descriptions, examples, FAQ, guide bodies, search results, or metadata. Route shells are not enough; visible prose must pass through localized content resolvers.
- Desktop workbench layout must use one aligned shell. Do not reintroduce separate rounded bordered left, center, and right cards around the resizable panels.
- Light/Dark/System theme behavior is a product feature. Do not replace it with only `prefers-color-scheme`.
- Do not use `next/font/google` or other build-time external font fetches. Vercel builds must pass from a clean install without depending on Google Fonts network access or local font cache.
- Run `npm run harness:localization` and `npm run harness:agents` whenever tool copy, guide copy, locale, layout, SEO, AdSense, or verification policy changes.
