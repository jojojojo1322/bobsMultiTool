# Measured SEO Export Workspace

This folder is for private Search Console and AdSense exports used by `npm run harness:seo-opportunities`.

Tracked files in this folder are safe templates and instructions only. Real exports are intentionally ignored by git:

- `reports/search-console.csv`
- `reports/search-console.tsv`
- `reports/adsense.csv`
- `reports/adsense.tsv`
- `reports/seo-opportunities*.md`

## Export Steps

1. Run `BOBOB_SEO_REPORT_FORMAT=export-packet npm run harness:seo-opportunities`.
2. Copy the Search Console page regex from the packet. It is the same value as `measuredExportPlan.copyTargets.searchConsolePageRegex`.
3. In Search Console, export Performance rows grouped by Page and Query for that page regex.
4. Save the export as `reports/search-console.csv` or `reports/search-console.tsv`.
5. In AdSense, export page URL rows for the packet's canonical URL batch.
6. Save the export as `reports/adsense.csv` or `reports/adsense.tsv`.
7. Rerun `npm run harness:seo-opportunities`.
8. Edit public title/description copy only when `metadataRewriteReadiness.canRewritePublicMetadata` is `true`.

Use `BOBOB_SEO_REPORT_FORMAT=markdown BOBOB_SEO_REPORT_OUT=reports/seo-opportunities.md npm run harness:seo-opportunities` after measured files exist and a human-readable review artifact is needed.

## Templates

Use these only as column references:

- `reports/templates/search-console.example.csv`
- `reports/templates/adsense.example.csv`

Do not rename template files to production export names unless the sample rows have been replaced with real measured rows.
