# bobob.app Search Discovery Registration Matrix

This matrix tracks the public discovery paths used for the Blog + Play migration. It is not indexing proof. Search readiness still needs later Search Console and Bing observation evidence.

## Current Discovery Set

- Canonical host: `https://www.bobob.app`
- Apex host: `https://bobob.app` should permanently redirect to the canonical host.
- Submitted sitemap index: `https://www.bobob.app/sitemap.xml`
- Current submitted sitemap: `https://www.bobob.app/sitemaps/en`
- Current submitted sitemap URL count: `130`
- Current feed item count: `119`
- Current Blog count: `95`
- Current Play count: `24`
- Current Blog categories in sitemap: `일기`, `요즘 관심사`, `AI`, `개발`, `운영 기록`, `정보`
- Sitemap scope: home, global search, Blog index, Blog category hubs with real posts, Blog posts, Play index, Play pages, and archived `/tools`.
- Submitted URL health: every `/sitemaps/en` URL should be a final 200 HTML response with matching canonical, one h1, unique title/description metadata, OpenGraph/Twitter title and description, and indexable robots metadata.
- Paused scope: broad locale sitemap expansion. Do not restore it until localized Blog/Play content exists and measured demand supports it.

## Registration And Discovery Channels

| Channel | Public target | Current status | What it proves | What it does not prove |
| --- | --- | --- | --- | --- |
| Google Search Console sitemap | `/sitemaps/en` under the `https://www.bobob.app/` property | Latest `bobob935@gmail.com` resubmission confirmed `사이트맵이 제출됨`; submitted/read `2026. 6. 26.`, status `성공`, discovered pages `68`, matching the prior live XML count before the 정보 expansion. Later CLI discovery work moved the live sitemap to `130` URLs, but no signed-in Search Console resubmission was performed in that CLI slice | Google can discover the submitted sitemap URL set | It does not prove indexing, impressions, or ranking |
| Google Search Console performance | `검색결과에서의 실적` under the `https://www.bobob.app/` property | Latest `bobob935@gmail.com` check showed clicks `0`, impressions `3`, CTR `0%` for `3개월` | Google has begun showing at least some search impressions | It does not prove useful traffic or page indexing completion |
| Google Search Console page indexing | `페이지 색인 생성` under the `https://www.bobob.app/` property | Latest `bobob935@gmail.com` check showed indexed pages `0`, not-indexed pages `5` | The indexing problem is still visible and measurable | It does not identify all submitted Blog + Play URLs as indexed |
| Google URL Inspection | `/blog/boring-maintenance-is-content-too` | Request confirmed with `색인 생성 요청됨` | A representative Blog URL was manually queued | It does not prove the URL was indexed |
| Bing and IndexNow | `https://api.indexnow.org/indexnow` with the public key file | Latest response status `200`; submitted URL count `130` after the Play canvas upgrade, password guess preview, follow-up youth savings result expansion, sum-box combo bonus, stacker landing preview, notification mole urgency feedback, crossing lane preview, sum-box streak bonus, password split feedback, gem-swap hint, sum-box release preview, password clue history, latest information notes, endless lottery Play update, arcade action-cap removal, lottery scratch drag update, shooter drag aiming update, and arcade count-field cleanup | Bing-compatible discovery ping accepted the current live sitemap URL set | It does not prove Bing indexed or ranked the pages |
| Bing Webmaster Tools | `https://www.bing.com/webmasters/home?siteUrl=https%3A%2F%2Fwww.bobob.app` | Latest browser check reached the public landing page with `Sign In`; site-specific recommendations were not visible | Bing Webmaster follow-up still needs a signed-in session | It does not provide indexing or recommendation evidence yet |
| Public Bing search | `site:www.bobob.app` | Latest browser check hit a `계속하려면 아래 과제 해결` challenge | Public Bing search was attempted | It does not prove whether Bing has indexed the URL set |
| RSS feed | `/feed.xml` | Live feed has `119` Blog + Play items and WebSub hub discovery | Feed readers and lightweight crawlers can discover current content | It does not replace sitemap or webmaster-tool evidence |
| Atom feed | `/atom.xml` | Live feed has `119` Blog + Play entries and WebSub hub discovery | Feed readers and WebSub can discover current content | It does not prove search indexing |
| JSON Feed | `/feed.json` | Live feed has `119` Blog + Play items and WebSub hub metadata | Programmatic readers can discover current content | It does not broaden the submitted sitemap scope |
| WebSub | `https://pubsubhubbub.appspot.com/` for RSS and Atom topics | Latest publish responses `204`, `204` with feed item counts `119`, `119` | Feed update topics were accepted by the hub | It does not prove Google indexed the URLs |
| robots.txt | `/robots.txt` | Allows public crawl paths and points to `/sitemap.xml` | Crawlers can find the canonical sitemap index | It does not force crawling or indexing |
| OpenSearch | `/opensearch.xml` | Points to `/search?q={searchTerms}` | Browsers and crawlers can discover the internal search entrypoint | It does not submit pages to search engines |
| llms.txt | `/llms.txt` | Lists Blog, Play, categories, discovery routes, trust pages, and selected archived tools | AI/search-adjacent crawlers can understand the current site map | It does not expand the canonical sitemap |
| Public search spot check | `site:www.bobob.app bobob.app` | Homepage appeared in a public search result | The canonical host can surface publicly | It does not prove the new Blog + Play URL set is indexed |

## Manual Follow-up Window

- Next scheduled observation: `2026-07-02`
- Second scheduled observation: `2026-07-09`
- Automation id: `bobob-indexing-observation`
- Use Search Console property: `https://www.bobob.app/`
- Use Google account: `bobob935@gmail.com`
- Use the Chrome profile/session signed in as `bobob935@gmail.com`; do not inspect Search Console from another signed-in Chrome profile.
- Open Bing Webmaster Tools in a signed-in session and check recommendation classes before closing the indexing loop.
- Public Bing `site:` search may show a challenge; do not treat a blocked public search page as indexing evidence.

## Required Comparison Points

Compare against the first `2026-06-25` baseline:

- Total clicks: `0`
- Total impressions: `0`
- Indexed pages: `0`
- Not indexed pages: `5`
- Initial `/sitemaps/en` discovered pages: `44`

Also compare against the later same-day post-expansion registration:

- `/sitemaps/en` discovered pages after resubmission: `52`
- Latest `/sitemaps/en` discovered pages after the 2026-06-26 resubmission: `68`
- Current live `/sitemaps/en` URL count: `130`
- Latest IndexNow URL count: `130`
- Latest feed item count: `119`

Latest Search Console observation from `bobob935@gmail.com`:

- Total clicks: `0`
- Total impressions: `3`
- Indexed pages: `0`
- Not indexed pages: `5`

## Stop Rule

Do not mark the active Blog + Play goal complete from deployment, sitemap fetches, Search Console submission success, IndexNow `200`, WebSub `204`, or public search spot checks alone.

Completion needs concrete changed Search Console or Bing evidence recorded in `docs/search-indexing-observation-log.md`: indexed pages, impressions, page indexing reason changes, representative URL inspection changes, Bing recommendation changes, or measured exports that cover the submitted Blog + Play URL set.
