---
name: bobob-adsense-seo
description: Use before changing Bob's Multi Tool AdSense, domain, redirect, sitemap, robots, metadata, schema, privacy, or terms behavior.
---

# Bobob AdSense SEO

- Canonical host is `https://www.bobob.app`.
- `bobob.app` should permanently redirect to `www.bobob.app`.
- Legacy standalone apps must not be restored. Legacy entry paths should redirect from `apps/main` to the matching `/tools/{slug}` page.
- `/sitemap.xml` must be a sitemap index. Per-locale sitemaps live at `/sitemaps/{locale}` and must include home, tools, guides, privacy, and terms for that locale.
- `/tools` and `/{locale}/tools` must return 200 as tool directory pages. They are SEO hub pages and must not redirect to a single tool.
- Sitemap entries must point only to final public URLs expected to return 200.
- English is the default unprefixed URL set. Non-English locales use path prefixes and require canonical plus hreflang alternates.
- Hreflang alternates must include `x-default` pointing to the canonical unprefixed English URL.
- Locale pages must render the correct root `<html lang>` and `<html dir>` via the middleware locale handoff, not only nested route attributes.
- Arabic locale routes must keep RTL layout coverage.
- Locale routing may use NEXT_LOCALE, Accept-Language, and country headers such as x-vercel-ip-country or cf-ipcountry.
- Do not cap localized sitemap coverage in a single static file. Use the sitemap index to expose every supported locale/tool/guide URL.
- Refresh sitemap `lastmod` whenever tool, guide, route, or locale content changes so crawlers receive a current update signal.
- Use registry search metadata and content clusters to strengthen tool-led SEO; avoid thin localized pages by improving core tool titles, descriptions, FAQ, and guide intros first.
- Localized metadata must use localized tool and guide content. Do not leave non-English title/description pages backed by raw English registry prose.
- Guide detail meta descriptions and OpenGraph descriptions must use the same localized `guide.description` shown in the page body.
- Tool and guide detail pages must set page-specific OpenGraph and Twitter title/description values instead of inheriting the root default social metadata.
- Do not add fabricated review, rating, pricing, or availability schema.
- SearchAction schema must point to a URL that actually accepts `?q=` and renders usable search results.
- For post-deploy title/description work, use Search Console and AdSense page/query CSV exports with `npm run harness:seo-opportunities`. Prioritize high-impression low-CTR tool and guide pages, low-RPM pages, metadata warnings, and `titleDescriptionRecommendations` before broad copy rewrites.
- The SEO opportunity harness auto-detects private local exports at `reports/search-console.csv`, `reports/search-console.tsv`, `reports/adsense.csv`, and `reports/adsense.tsv`; env vars `BOBOB_SEARCH_CONSOLE_CSV` and `BOBOB_ADSENSE_CSV` override those defaults.
- Review `inputWarnings` from the SEO opportunity report before trusting empty measured results; missing Search Console/AdSense CSV headers must be fixed or acknowledged before title/description edits.
- Use `measurementBacklog` and `measuredExportPlan` only to prioritize which core pages need Search Console/AdSense export coverage next. Use `measuredExportPlan.copyTargets` for Search Console page regex, canonical URL batches, and focused measured gate paths. Do not rewrite public title/description copy from backlog alone.
- Public title/description edits require `metadataRewriteReadiness.canRewritePublicMetadata=true`; if status is `needs-measured-data-first`, collect or fix measured exports before changing metadata.
- Use `npm run harness:seo-measured` or `BOBOB_REQUIRE_MEASURED_SEO=1` before claiming post-deploy measured SEO improvement is ready. The strict gate should fail until required core pages have both Search Console and AdSense rows.
- Use `BOBOB_REQUIRED_MEASURED_PATHS` only for targeted page reviews; final core coverage should rely on the default tier-based measured gate.
- Run `npm run harness:seo-opportunities:smoke` when changing the measured SEO report so valid CSV fixtures still create opportunities and malformed CSV fixtures still create `inputWarnings`.
- Use `BOBOB_SEO_REPORT_FORMAT=markdown` and `BOBOB_SEO_REPORT_OUT=reports/seo-opportunities.md` when a human review artifact is needed for measured title/description decisions. Keep measured CSVs and markdown reports out of git.
- Keep safe measured export instructions and sample headers in `reports/README.md` and `reports/templates/*.example.csv`; run `npm run harness:seo-templates` when Search Console/AdSense export headers, copy targets, or measured export instructions change.
- Do not keep unused AdSense preview components, fake publisher IDs, or placeholder ad slots in the public app.
- Keep privacy and terms pages aligned with the actual local-first utility behavior.
- If SEO, AdSense, locale, redirect, schema, or country detection policy changes, update AGENTS.md and this skill before handoff.
