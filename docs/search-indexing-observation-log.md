# bobob.app Search Indexing Observation Log

This file records manual external checks for the Blog + Play migration. Keep private CSV exports out of git; use this only for high-level observed states that help decide the next crawl/indexing step.

## 2026-06-25

- Checked with the `bobob935` Google account on the Search Console URL-prefix property `https://www.bobob.app/`.
- Overview:
  - Total web search clicks: `0`
  - Not indexed pages: `5`
  - Indexed pages: `0`
- Performance report:
  - Range: `3개월`
  - Last updated: `37시간 전`
  - Total clicks: `0`
  - Total impressions: `0`
  - Average CTR: `0%`
  - Average position: `0`
  - Query table: no data
- Page indexing report:
  - Last updated: `2026-06-12`
  - Not indexed pages: `5`
  - Indexed pages: `0`
  - Reason rows:
    - `리디렉션이 포함된 페이지`: `3`, validation `시작됨`
    - `적절한 표준 태그가 포함된 대체 페이지`: `2`, validation `시작됨`
- Sitemaps report:
  - `/sitemaps/en`: submitted `2026-06-25`, last read `2026-06-25`, status `성공`, discovered pages `44`
  - `/sitemap.xml`: submitted `2026-06-25`, last read `2026-06-25`, status `성공`, discovered pages `0`
- Public search spot check:
  - A public search result for `site:www.bobob.app bobob.app` surfaced the homepage, but Search Console has not yet reflected indexed URL counts for the new Blog + Play set.

Decision:

- Do not broaden sitemap scope yet.
- Keep `/sitemaps/en` as the submitted canonical Blog + Play sitemap.
- Continue with a 1-2 week Search Console observation window before treating indexing as solved.
- Next check should compare indexed count, not-indexed count, sitemap discovered page count, and 3-month impressions against this baseline.
