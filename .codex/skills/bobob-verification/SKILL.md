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
- Localized privacy and terms prose plus metadata through `getLocalizedLegalContent`.
- Non-English common labels and chips, including privacy/server/local indicators, should be localized and should not show English fallback fragments outside the English source route.
- Arabic RTL route and visible prose.
- Sitemap index at `/sitemap.xml`, per-locale sitemaps at `/sitemaps/en`, `/sitemaps/ko`, `/sitemaps/ar`, and full locale URL coverage without the old 200 URL static cap.
- Sitemap `lastmod` should be current for the latest tool, guide, route, or locale content commit.
- Home, `/tools`, localized tool directories, and workbench shared search behavior, including `?q=` URL state and SearchAction schema alignment.
- Search Console/AdSense opportunity report behavior. Without CSV inputs it should keep registry metadata warnings at zero when metadata is healthy; with CSV inputs it should report high-impression low-CTR tool and guide pages, low-RPM pages, and `titleDescriptionRecommendations`.
- SEO measured exports can be provided through env vars or default local files at `reports/search-console.csv`, `reports/search-console.tsv`, `reports/adsense.csv`, and `reports/adsense.tsv`; measured CSV/TSV files and generated markdown reports must stay untracked.
- SEO reports should include `measurementBacklog`, `measuredExportPlan`, and `measuredExportPlan.copyTargets` for unmeasured or partially measured core pages, and verification should confirm none of these fields is used as a direct title/description rewrite signal.
- SEO reports should include `metadataRewriteReadiness`; public title/description edits are not ready unless `canRewritePublicMetadata` is true and measured query recommendations exist.
- SEO report `inputWarnings` should flag missing required or recommended Search Console/AdSense CSV headers so empty measured results are not silently trusted.
- `npm run harness:seo-measured` should be used for post-deploy measured SEO work. It sets `BOBOB_REQUIRE_MEASURED_SEO=1` and should fail until required core pages have both Search Console and AdSense rows.
- `BOBOB_REQUIRED_MEASURED_PATHS` is acceptable for a targeted page review, but should not be used to claim final core-page measured readiness.
- SEO opportunity report smoke should prove valid measured CSV fixtures create opportunities and malformed CSV fixtures create `inputWarnings`.
- Markdown SEO report behavior with `BOBOB_SEO_REPORT_FORMAT=markdown` should produce a reviewable title/description recommendations table, measured export CSV templates, and metadata rewrite readiness when CSV inputs are present.
- Safe measured export instructions and sample headers should stay tracked in `reports/README.md` and `reports/templates/*.example.csv`, while real Search Console/AdSense CSV or TSV exports stay untracked.
- Desktop left and right sidebar resizing, single-shell panel alignment, clamped panel widths with no horizontal overflow at narrow desktop widths, top brand/home link, preserved sidebar scroll when clicking tool navigation, plus mobile Sheet fallback.
- No visible demand wording or raw `core` / `growth` / `long-tail` demand badges in home cards, search results, or tool detail headers.
- A local-only tool and a server route tool.
- Server route tools reject private/reserved hosts, validate redirect targets, and rate-limit repeated requests.
- No unused ad placeholder components or fake publisher IDs remain in the public app.
- No standalone legacy app directories, `packages/ui`, `turbo.json`, `turbo` dependency, or stale legacy workspace entries in `package-lock.json` remain. Old public entry paths should be verified as permanent redirects to `/tools/{slug}`, with rationale recorded in `docs/legacy-apps-archive.md`.
- Deployment status should show `Vercel – bobs-multi-tool-main` as successful. Stale legacy Vercel project statuses are external cleanup work; after deletion or Git unlinking, `BOBOB_REQUIRE_NO_LEGACY_VERCEL=1 npm run harness:deployment-status` should pass.
- Clean build behavior with no build-time external font downloads.
- The agent-skills-sync gate whenever feature, policy, SEO, theme, or i18n rules changed.
