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
