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
- Do not restore legacy standalone app directories. The only app workspace is `apps/main`; old entry paths such as `/regax`, `/cron-generator`, `/meta-generator`, `/lorem-generator`, and `/iframe-viewer` should remain permanent redirects to `/tools/{slug}`.
- Public tool URLs must use `https://www.bobob.app/tools/{slug}`.
- `/tools` and `/{locale}/tools` must be real 200 tool directory pages with category links and shared search; do not redirect them to the first tool.
- Default English URLs stay unprefixed. Non-English routes use `/{locale}/tools/{slug}` and must keep canonical/hreflang behavior aligned.
- Do not add AI assistant features unless explicitly requested again.
- New tools must be registered in `apps/main/src/features/tools/registry.ts` and backed by a component key.
- Every tool needs SEO metadata, examples, FAQs, guide links, related tools, demandTier, searchIntents, supportedLocales, privacyMode, and requiresServer.
- Every tool also needs aliases, useCases, inputExamples, contentCluster, and monetizationTier so SEO, internal search, and monetization review stay tied to the registry.
- Keep the UI dense, neutral, and workbench-like. Avoid generic AI-generated landing-page patterns, especially raised colored top borders and decorative accent strips.
- Desktop tool pages must keep real resizable left and right sidebars with persisted localStorage widths: left 280px default / 220px min, right 340px default / 280px min, center 560px target min.
- Resizable panel widths must be clamped to the workbench container. Narrow desktop widths must not overflow horizontally; if the full target widths cannot fit, the center panel may shrink before the shell breaks.
- Tool navigation clicks must preserve the sidebar scroll position and must not force the document back to the top while moving between tool detail pages.
- Internal search must use the shared registry search index across home, `/tools`, locale tool directories, and tool workbench surfaces. URL query `?q=` must stay aligned with the SearchAction schema.
- Post-deploy title/description changes should be driven by Search Console and AdSense page/query CSV exports when available. Use `npm run harness:seo-opportunities` to identify high-impression low-CTR tool and guide pages, low-RPM pages, metadata length/intent issues, and `titleDescriptionRecommendations`.
- SEO measurement CSV reports must expose `inputWarnings` for missing required or recommended Search Console/AdSense headers; do not treat empty measured results as trustworthy until warnings are reviewed.
- `npm run harness:seo-opportunities:smoke` must keep valid measured CSV fixtures producing opportunities and malformed CSV fixtures producing `inputWarnings`.
- For measured SEO review handoff, use `BOBOB_SEO_REPORT_FORMAT=markdown` and optionally `BOBOB_SEO_REPORT_OUT=reports/seo-opportunities.md` to generate a readable recommendations artifact.
- Demand tier is an internal prioritization and ranking field. Do not expose demand wording or raw `core` / `growth` / `long-tail` demand badges in the UI.
- Locale alternates must include `x-default`; Arabic must keep RTL verification coverage.
- Sitemap exposure must use `/sitemap.xml` as a sitemap index and `/sitemaps/{locale}` for full per-locale URL coverage. Do not return to a capped static sitemap that drops locale tool pages.
- Sitemap `lastmod` must be refreshed when tool, guide, route, or locale content changes. The i18n harness compares it against the latest relevant content commit date.
- Non-English locale pages must not render raw English registry prose for descriptions, examples, FAQ, guide bodies, search results, or metadata. Route shells are not enough; visible prose must pass through localized content resolvers.
- Non-English common dictionary prose must include localized site descriptions, home descriptions, privacy/server/local chips, and legal page copy. Avoid leaving mixed visible fragments such as `Privacy`, `Server route`, `Browser local`, `privacy badge`, or `route server` outside the English source locale.
- Locale override blocks are part of visible prose. When common dictionary overrides or legal pages are changed, check that they do not reintroduce English scaffolding such as `Workbench`, `workflow`, `metadata`, `locale`, `smoke check`, or `tool/tools` where a local product phrase is already used.
- Long-tail locale templates must avoid English scaffolding terms in visible prose when a natural local alternative is available. Watch recurring fallback fragments such as `developer tool`, `workflow`, `Input`, `Copy`, `Generated output`, and `secret production` in Hindi, Indonesian, Vietnamese, Thai, and Arabic pages.
- Hindi acquisition copy should be Devanagari-first for sentence prose. Keep technical tokens like JSON, JWT, Regex, URL, CSS, and API when useful, but do not fall back to full romanized Hinglish templates for descriptions, FAQ, guide descriptions, empty states, or metadata.
- Vietnamese acquisition copy should use Vietnamese diacritics for sentence prose. Keep technical tokens when useful, but avoid full ASCII fallback templates such as `Dinh dang`, `Kiem tra`, `Huong dan`, `Cong cu`, `Dau vao`, or `Ket qua`.
- Locale switcher labels must use native language names such as `한국어`, `日本語`, `简体中文`, `हिन्दी`, `ไทย`, and `العربية`, not English-only language names for every locale.
- Guide detail metadata must use the same localized `guide.description` shown on the page, not a generic guide-title template.
- Tool and guide detail pages must set page-specific OpenGraph and Twitter title/description values instead of inheriting the root default social metadata.
- Long-tail acquisition locales (`zh-CN`, `zh-TW`, `pt-BR`, `fr`, `hi`, `id`, `vi`, `th`, `ar`) need slug-specific visible descriptions for every registered tool, not only generic translated templates.
- Long-tail guide descriptions should also be slug-specific for high-traffic workflows such as Regex, Cron, SEO meta tags, Hash, JSON/YAML/CSV, Network, CSS, Web SEO, and Text cleanup.
- Locale routes must set the root `<html lang>` and `<html dir>` through the middleware locale handoff; setting only nested page or main attributes is not enough for multilingual SEO.
- Localized privacy and terms pages must use `getLocalizedLegalContent`; non-English legal routes must not hardcode English policy or terms prose.
- Desktop workbench layout must use one aligned shell. Do not reintroduce separate rounded bordered left, center, and right cards around the resizable panels.
- Light/Dark/System theme behavior is a product feature. Do not replace it with only `prefers-color-scheme`.
- Do not use `next/font/google` or other build-time external font fetches. Vercel builds must pass from a clean install without depending on Google Fonts network access or local font cache.
- Do not keep unused AdSense placeholder components, `ca-pub-YOUR_ACTUAL_PUBLISHER_ID`, or visible ad preview blocks in the public app.
- Do not reintroduce `packages/ui`, `turbo`, or standalone legacy app packages unless the product direction explicitly changes and the related skills/harnesses are updated first. Keep the removal rationale in `docs/legacy-apps-archive.md`.
- Use visual screenshot smoke coverage for desktop, mobile, and Arabic RTL when layout, theme, localization, or workbench surfaces change.
- Run `npm run harness:localization` and `npm run harness:agents` whenever tool copy, guide copy, locale, layout, SEO, AdSense, or verification policy changes.
