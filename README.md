# Bob's Multi Tool

Single-domain developer utility workbench for `www.bobob.app`.

## Current Direction

- `apps/main` is the public app. Tool pages live under `/tools/{slug}` with localized variants under `/{locale}/tools/{slug}`.
- Legacy standalone apps have been removed. Keep `apps/main` as the only workspace and preserve old public entry paths through permanent redirects to matching `/tools/{slug}` pages.
- `/tools` and `/{locale}/tools` are indexable tool directory pages, not redirects.
- SEO exposure uses a dynamic sitemap index at `/sitemap.xml` and per-locale sitemaps at `/sitemaps/{locale}`.
- Tools are local-first unless a browser cannot perform the check directly, such as HTTP status and DNS lookup.
- AI assistant features are intentionally excluded.

## Development

```bash
npm install
npm run dev --workspace @bobob/main
npm run build
npm run lint
```

`apps/main` runs on port `3000`.

## Harness

```bash
npm run harness:registry
npm run harness:i18n
npm run harness:localization
npm run harness:search
npm run harness:layout
npm run harness:theme
npm run harness:tools
npm run harness:agents
npm run harness:seo-opportunities
BOBOB_BASE_URL=http://localhost:3000 npm run harness:routes
BOBOB_BASE_URL=http://localhost:3000 npm run harness:visual
```

The visual harness uses Playwright and writes screenshots to a temporary directory unless `BOBOB_VISUAL_OUTPUT` is set.

For post-deploy measurement, export Search Console and AdSense page/query reports as CSV and run:

```bash
BOBOB_SEARCH_CONSOLE_CSV=/path/to/search-console.csv \
BOBOB_ADSENSE_CSV=/path/to/adsense.csv \
npm run harness:seo-opportunities
```

Search Console exports should come from the Performance report with page/query data and the filters you want to evaluate. AdSense exports should include page URL, impressions, page RPM, estimated earnings, and CTR where available.

Without CSV inputs, the report still checks registry metadata length and search-intent coverage. With CSV inputs, it covers tool pages and guide pages, warns through `inputWarnings` when expected CSV headers are missing, then reports `titleDescriptionRecommendations` before changing page titles or meta descriptions.

For a human-readable report:

```bash
BOBOB_SEARCH_CONSOLE_CSV=/path/to/search-console.csv \
BOBOB_ADSENSE_CSV=/path/to/adsense.csv \
BOBOB_SEO_REPORT_FORMAT=markdown \
BOBOB_SEO_REPORT_OUT=reports/seo-opportunities.md \
npm run harness:seo-opportunities
```

Reference docs: Search Console CSV export is documented by Google Search Console Help, and AdSense CSV export is documented by Google AdSense Help.

Legacy app removal is recorded in `docs/legacy-apps-archive.md`.

## Governance

- Update `AGENTS.md` and the relevant `.codex/skills/*/SKILL.md` whenever tool policy, SEO policy, i18n, theme, layout, or verification rules change.
- New tools must update registry metadata, localized visible prose, guides, related tools, sitemap coverage, search coverage, and smoke tests.
- Do not reintroduce static `public/sitemap.xml`, visible demand-tier wording, unused ad placeholders, or build-time external font fetches.
- Do not restore legacy standalone app directories, `packages/ui`, or `turbo` unless the product architecture changes and the related harnesses/skills are updated in the same change.
