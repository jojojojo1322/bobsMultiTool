# Measured SEO Export Workspace

This folder is for private Search Console and AdSense exports used by `npm run harness:seo-opportunities`.

Tracked files in this folder are safe templates and instructions only. Real exports are intentionally ignored by git:

- `reports/search-console.csv`
- `reports/search-console.tsv`
- `reports/adsense.csv`
- `reports/adsense.tsv`
- `reports/seo-opportunities*.md`
- `reports/seo-export*.md`
- `reports/indexing-followup*.md`

## Indexing Follow-up

Run `npm run seo:indexing-followup` before the next Search Console/Bing pass. It writes `reports/indexing-followup.md` with:

- the current live sitemap/feed/OpenSearch/robots snapshot
- the `bobob935@gmail.com` Search Console property link
- the representative URL inspection targets
- the Bing Webmaster recommendation checklist
- the stop rule that IndexNow/WebSub/sitemap success is not indexing proof

Use `npm run harness:indexing-followup` when only the live checks are needed without writing the report.

## Export Steps

1. Run `npm run seo:indexing-followup` for the manual indexing pass checklist.
2. Run `npm run seo:export-packet`.
3. Copy the Search Console page regex from the packet. It is the same value as `measuredExportPlan.copyTargets.searchConsolePageRegex`.
4. In Search Console, export Performance rows grouped by Page and Query for that page regex.
5. Save the export as `reports/search-console.csv` or `reports/search-console.tsv`.
6. In AdSense, export page URL rows for the packet's canonical URL batch.
7. Save the export as `reports/adsense.csv` or `reports/adsense.tsv`.
8. Rerun `npm run harness:seo-opportunities`.
9. Edit public title/description copy only when `metadataRewriteReadiness.canRewritePublicMetadata` is `true`.

Use `npm run seo:report` after measured files exist and a human-readable review artifact is needed.

## Templates

Use these only as column references:

- `reports/templates/search-console.example.csv`
- `reports/templates/adsense.example.csv`

Do not rename template files to production export names unless the sample rows have been replaced with real measured rows.
