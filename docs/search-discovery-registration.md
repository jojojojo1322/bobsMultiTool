# bobob.app Search Discovery Registration Matrix

This matrix tracks the public discovery paths used for the Blog + Play migration. It is not indexing proof. Search readiness still needs later Search Console, Bing, and Naver observation evidence.

## Current Discovery Set

- Canonical host: `https://www.bobob.app`
- Apex host: `https://bobob.app` should permanently redirect to the canonical host.
- Submitted sitemap index: `https://www.bobob.app/sitemap.xml`
- Current submitted sitemap: `https://www.bobob.app/sitemaps/en`
- Current submitted sitemap source target URL count: `74`
- Current feed source target item count: `59`
- Current Blog count: `126`
- Current representative Blog count: `33`
- Current Play count: `26`
- Latest external sitemap discovery count: `77`
- Latest IndexNow representative submission count: `74`
- Latest external feed publish item count: `59`
- Current Blog categories in sitemap: `일기`, `요즘 관심사`, `AI`, `개발`, `운영 기록`, `정보`
- Sitemap scope: home, global search, trust pages (`/about`, `/contact`, `/privacy`, `/terms`), Blog index, Blog category hubs with representative posts, representative Blog posts, Play index, Play pages, and archived `/tools`. Short devlog/archive Blog posts remain reachable but are excluded from the submitted sitemap/feed and marked noindex.
- Submitted URL health: every `/sitemaps/en` URL should be a final 200 HTML response with matching canonical, one h1, unique title/description metadata, OpenGraph/Twitter title and description, and indexable robots metadata.
- Paused scope: broad locale sitemap expansion. Do not restore it until localized Blog/Play content exists and measured demand supports it.

## Registration And Discovery Channels

| Channel | Public target | Current status | What it proves | What it does not prove |
| --- | --- | --- | --- | --- |
| Google Search Console sitemap | `/sitemaps/en` under the `https://www.bobob.app/` property | Current production sitemap target: `74` URLs after the additional World Cup information prune. Latest signed-in Search Console observation after resubmission of the previous 77-URL deployment: `/sitemaps/en`, submitted `2026. 7. 3.`, last read `2026. 7. 3.`, status `성공`, discovered pages `77`, videos `0` | Google accepted, read, and discovered the previous 77-URL canonical sitemap set | It does not prove indexing, impressions, ranking, that the representative Blog + Play pages are search-ready, or that the new 74-URL production target has been resubmitted and observed in Search Console |
| Google Search Console performance | `검색결과에서의 실적` under the `https://www.bobob.app/` property | Latest `bobob935@gmail.com` check showed clicks `0`, impressions `18`, CTR `0%`, average position `1.1` for `3개월`; last updated `8.5시간 전` | Google has begun showing more search impressions than the earlier `3`-impression observation | It does not prove useful traffic or broad Blog + Play indexing completion |
| Google Search Console page indexing | `페이지 색인 생성` under the `https://www.bobob.app/` property | Latest `bobob935@gmail.com` check showed indexed pages `0`, not-indexed pages `5`, last updated `2026-06-12`; reason rows remain `리디렉션이 포함된 페이지` `3` and `적절한 표준 태그가 포함된 대체 페이지` `2` | The old page indexing report is still visible and measurable | It does not yet reflect the homepage URL Inspection indexed state or the submitted Blog + Play URL set |
| Google URL Inspection | Homepage plus Blog/Play representatives | Homepage `https://www.bobob.app/` is `URL이 Google에 등록되어 있음` and `페이지 색인이 생성됨`. `/blog`, `/play`, `/blog/ai-side-project-realistic-order`, and `/play/office-survival` are not registered; each has a confirmed `색인 생성 요청됨` after inspection. Post-77-URL pillar inspections for `why-bobob-shifted-to-content-lab` and `content-indexing-checklist-before-resubmission` both showed `URL이 Google에 등록되어 있지 않음`, reason `크롤링됨 - 현재 색인이 생성되지 않음`, sitemap `https://www.bobob.app/sitemaps/en`, recent crawls `2026. 7. 3. 오전 2:58:20` and `2026. 7. 3. 오전 3:00:15`, page fetch `성공`, indexing allowed `예`, and both have `색인 생성 요청됨` confirmations with queue messages | URL Inspection proves homepage indexing, current sitemap association, fresh Googlebot smartphone crawl, successful fetch, allowed indexing, and queued pillar URL requests | It does not prove the Blog/Play representatives or pillar posts were indexed after inspection |
| Bing and IndexNow | `https://api.indexnow.org/indexnow` with the public key file | Latest IndexNow representative submission: `74` URLs with response `200` after the deploy-snake archive consolidation refresh | Bing-compatible discovery was refreshed for the current deployed representative URL set | It does not prove Bing indexed or ranked the pages, and it does not replace Search Console or Naver observation |
| Bing Webmaster Tools | `https://www.bing.com/webmasters/home?siteUrl=https%3A%2F%2Fwww.bobob.app` | Latest browser check reached the public landing page with `Sign In`; site-specific recommendations were not visible | Bing Webmaster follow-up still needs a signed-in session | It does not provide indexing or recommendation evidence yet |
| Public Bing search | `site:www.bobob.app` | Latest browser check hit a `계속하려면 아래 과제 해결` challenge | Public Bing search was attempted | It does not prove whether Bing has indexed the URL set |
| Naver Search Advisor | `https://searchadvisor.naver.com/` | Signed-in Search Advisor showed `https://www.bobob.app` owned under `풀꽃`, registered `25.07.24`, ownership expires `26.07.24`. Security certificate and HTTPS redirect are normal. Naver reports `사이트맵을 찾을 수 없습니다` and `콘텐츠 노출/클릭 정보가 없습니다`; visible sitemap rows are old broad locale entries from `26.06.16`, and `sitemaps/en` was not visibly added after submission attempts | Naver ownership and basic HTTPS state are confirmed | It does not prove Naver indexed or ranked pages, and the reduced sitemap still needs a separate Naver cleanup/pass |
| RSS feed | `/feed.xml` | Current representative feed has `59` Blog + Play items and WebSub hub discovery | Feed readers and lightweight crawlers can discover the representative content set | It does not replace sitemap or webmaster-tool evidence |
| Atom feed | `/atom.xml` | Current representative feed has `59` Blog + Play entries and WebSub hub discovery | Feed readers and WebSub can discover the representative content set | It does not prove search indexing |
| JSON Feed | `/feed.json` | Current representative feed has `59` Blog + Play items and WebSub hub metadata | Programmatic readers can discover the representative content set | It does not broaden the submitted sitemap scope |
| WebSub | `https://pubsubhubbub.appspot.com/` for RSS and Atom topics | Latest WebSub representative publish: `59` RSS items and `59` Atom entries with response statuses `204`, `204` after the deploy-snake archive consolidation refresh | Feed update topics were refreshed for the current representative feed set | It does not prove Google indexed the URLs |
| robots.txt | `/robots.txt` | Allows public crawl paths and points to `/sitemap.xml` | Crawlers can find the canonical sitemap index | It does not force crawling or indexing |
| OpenSearch | `/opensearch.xml` | Points to `/search?q={searchTerms}` | Browsers and crawlers can discover the internal search entrypoint | It does not submit pages to search engines |
| llms.txt | `/llms.txt` | Lists Blog, Play, categories, discovery routes, trust pages, and selected archived tools | AI/search-adjacent crawlers can understand the current site map | It does not expand the canonical sitemap |
| Public search spot check | `site:www.bobob.app bobob.app` | Homepage appeared in a public search result | The canonical host can surface publicly | It does not prove the new Blog + Play URL set is indexed |

## Manual Follow-up Window

- Completed observation: `2026-07-02`
- Next scheduled observation: `2026-07-09`
- Second scheduled observation: `2026-07-09`
- Automation id: `bobob-indexing-observation`
- Use Search Console property: `https://www.bobob.app/`
- Use Google account: `bobob935@gmail.com`
- Use the Chrome profile/session signed in as `bobob935@gmail.com`; do not inspect Search Console from another signed-in Chrome profile.
- Open Bing Webmaster Tools in a signed-in session and check recommendation classes before closing the indexing loop.
- Public Bing `site:` search may show a challenge; do not treat a blocked public search page as indexing evidence.
- Open Naver Search Advisor in a signed-in session and check site ownership, sitemap, robots.txt, and representative page collection status before closing the indexing loop.

## Required Comparison Points

Compare against the first `2026-06-25` baseline:

- Total clicks: `0`
- Total impressions: `0`
- Indexed pages: `0`
- Not indexed pages: `5`
- Initial `/sitemaps/en` discovered pages: `44`

Also compare against the later same-day post-expansion registration:

- `/sitemaps/en` discovered pages after resubmission: `52`
- Prior `/sitemaps/en` discovered pages after the 2026-07-02 resubmission: `68`
- Latest `/sitemaps/en` discovered pages after the 2026-07-03 77-URL resubmission: `77`
- Current representative `/sitemaps/en` source URL target: `74`
- Latest external sitemap discovery count: `77`
- Latest IndexNow representative submission count: `74`
- Current representative feed source target item count: `59`
- Latest external feed publish item count: `59`
- The latest Search Console discovered count still reflects the previous `77`-URL sitemap observation. Production, IndexNow, WebSub, and feed surfaces now reflect the `74`-URL / `59`-item source target, but this is not Search Console discovery proof until `/sitemaps/en` is resubmitted and observed there.

Latest Search Console observation from `bobob935@gmail.com`:

- Total clicks: `0`
- Total impressions: `18`
- Indexed pages: `0`
- Not indexed pages: `5`
- `/sitemaps/en` discovered pages: `77` against the previously submitted `77`-URL sitemap; this proves discovery alignment for that earlier deployment, not indexing or the current 74-URL production target.
- URL Inspection: `https://www.bobob.app/` is indexed; Blog/Play representative URLs are not indexed yet.
- Pillar URL inspections: `why-bobob-shifted-to-content-lab` and `content-indexing-checklist-before-resubmission` are still not indexed, now with `크롤링됨 - 현재 색인이 생성되지 않음`; both remain tied to `https://www.bobob.app/sitemaps/en`, show successful Googlebot smartphone fetches on `2026. 7. 3.`, allow indexing, and both have fresh `색인 생성 요청됨` confirmations.

## Stop Rule

Do not mark the active Blog + Play goal complete from deployment, sitemap fetches, Search Console submission success, IndexNow `200`, WebSub `204`, Naver page collection request, or public search spot checks alone.

Completion needs concrete changed Search Console, Bing, or Naver evidence recorded in `docs/search-indexing-observation-log.md`: indexed pages, impressions, page indexing reason changes, representative URL inspection changes, Bing recommendation changes, Naver Search Advisor collection/indexing changes, or measured exports that cover the submitted Blog + Play URL set.
