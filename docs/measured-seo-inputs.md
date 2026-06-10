# Measured SEO Inputs

Use measured exports before changing public title or description copy after deployment.

## Default local files

Put private exports here when reviewing opportunities locally:

- `reports/search-console.csv`
- `reports/adsense.csv`

These CSV files are gitignored. The harness auto-detects them, so this is enough:

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

## Markdown review artifact

Generate a local review report when comparing title and description changes:

```bash
BOBOB_SEO_REPORT_FORMAT=markdown \
BOBOB_SEO_REPORT_OUT=reports/seo-opportunities.md \
npm run harness:seo-opportunities
```

`reports/seo-opportunities.md` is gitignored because it can include query, impression, CTR, RPM, and earnings data.
