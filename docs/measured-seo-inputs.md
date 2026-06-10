# Measured SEO Inputs

Use measured exports before changing public title or description copy after deployment.

## Default local files

Put private exports here when reviewing opportunities locally:

- `reports/search-console.csv`
- `reports/search-console.tsv`
- `reports/adsense.csv`
- `reports/adsense.tsv`

These CSV/TSV files are gitignored. The harness auto-detects them, so this is enough:

```bash
npm run harness:seo-opportunities
```

## Explicit files

Use env vars when the exports live elsewhere:

```bash
BOBOB_SEARCH_CONSOLE_CSV=/path/to/search-console.csv \
BOBOB_ADSENSE_CSV=/path/to/adsense.csv \
npm run harness:seo-opportunities
```

The parser accepts comma CSV, tab-separated TSV, semicolon-separated CSV, UTF-8 BOM headers, percent CTR values, and decimal comma numbers such as `0,4`.

## Markdown review artifact

Generate a local review report when comparing title and description changes:

```bash
BOBOB_SEO_REPORT_FORMAT=markdown \
BOBOB_SEO_REPORT_OUT=reports/seo-opportunities.md \
npm run harness:seo-opportunities
```

`reports/seo-opportunities.md` is gitignored because it can include query, impression, CTR, RPM, and earnings data.

## Measurement backlog

When measured CSV exports are missing or only cover a few pages, the report includes `measurementBacklog`.
Use that list to decide which pages to export first from Search Console and AdSense. It is sorted toward core monetization pages, core demand pages, tools before guides, and server-backed checks when ties are close.

Do not rewrite public title or description copy from `measurementBacklog` alone. Use it to collect measured rows, then apply copy changes from `titleDescriptionRecommendations`.

## Measured export plan

The report also includes `measuredExportPlan`. This turns the backlog into a concrete export checklist:

- default local file destinations for Search Console and AdSense exports
- required and recommended columns for each export
- canonical URLs to include first, sorted by tool priority and missing measurement inputs
- commands for JSON report, Markdown report, and strict measured gate review

Use `measuredExportPlan.priorityPages` to collect the next batch of Search Console page/query rows and AdSense page rows. It is still not evidence for a title or description rewrite by itself; it only tells you which measured rows are missing.

## Strict measured gate

When a task is explicitly about post-deploy measured SEO improvement, run:

```bash
npm run harness:seo-measured
```

That command sets `BOBOB_REQUIRE_MEASURED_SEO=1` and fails until required core pages have both Search Console page/query rows and AdSense page/RPM rows. This is expected to fail before private exports exist.

For a focused review of a few pages, narrow the gate:

```bash
BOBOB_REQUIRE_MEASURED_SEO=1 \
BOBOB_REQUIRED_MEASURED_PATHS=/tools/json-formatter,/tools/dns-lookup \
npm run harness:seo-opportunities
```

Use focused paths only while reviewing a specific title/description change. Final core-page coverage should use the default tier-based gate.
