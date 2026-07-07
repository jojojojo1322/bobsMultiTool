# bobob.app Search Discovery Registration Matrix

This matrix tracks the public discovery paths used for the web-operations + Blog + Play recovery pass. It is not indexing proof. Search readiness still needs later Search Console, Bing, and Naver observation evidence.

## Current Discovery Set

- Canonical host: `https://www.bobob.app`
- Apex host: `https://bobob.app` should permanently redirect to the canonical host.
- Submitted sitemap index: `https://www.bobob.app/sitemap.xml`
- Current submitted sitemap: `https://www.bobob.app/sitemaps/en`
- Current submitted sitemap source target URL count: `85`
- Current feed source target item count: `62`
- Current Blog count: `129`
- Current representative Blog count: `36`
- Current Play count: `26`
- Latest external sitemap discovery count: `85`
- Latest IndexNow representative submission count: `85`
- Latest external feed publish item count: `62`
- Current Blog categories in sitemap: `일기`, `요즘 관심사`, `AI`, `개발`, `운영 기록`, `정보`
- Sitemap scope: home, global search, trust pages (`/about`, `/contact`, `/privacy`, `/terms`), Blog index, Blog category hubs with representative posts, representative Blog posts, Play index, Play pages, `/tools`, and selected operations-first tool pages for HTTP status, DNS, sitemap, robots, meta, URL parser, JWT, and JSON. Short devlog/archive Blog posts remain reachable but are excluded from the submitted sitemap/feed and marked noindex.
- Retired known locale sitemap paths such as `/sitemaps/ar`, `/sitemaps/th`, and `/sitemaps/zh-CN` 308 redirect to `/sitemaps/en`; this keeps older external webmaster submissions from seeing 404s without restoring broad locale sitemap coverage.
- Submitted URL health: every `/sitemaps/en` URL should be a final 200 HTML response with matching canonical, one h1, unique title/description metadata, OpenGraph/Twitter title and description, and indexable robots metadata.
- Paused scope: broad locale sitemap expansion. Do not restore it until localized Blog/Play content exists and measured demand supports it.

## Registration And Discovery Channels

| Channel | Public target | Current status | What it proves | What it does not prove |
| --- | --- | --- | --- | --- |
| Google Search Console sitemap | `/sitemaps/en` under the `sc-domain:bobob.app` and `https://www.bobob.app/` properties | Current source sitemap target after web-operations recovery: `85` URLs. Latest signed-in Search Console observation after resubmission from `bobob935@gmail.com`: `/sitemaps/en`, submitted `2026. 7. 7.`, last read `2026. 7. 7.`, status `성공`, discovered pages `85`, videos `0`. Same-day `sc-domain:bobob.app` recheck first showed the older `84`-page row from `2026. 7. 6.`, then after reload showed submitted `2026. 7. 7.`, last read `2026. 7. 7.`, status `성공`, discovered pages `85`, videos `0`. Earlier same-day Chrome retries resolved to `task10@ljfriends.net`; the signed-in `bobob935@gmail.com` pass is the current observation. | Google accepted, read, and discovered the latest externally submitted 85-URL canonical sitemap set | It does not prove indexing, impressions, ranking, or that the submitted Blog, Play, or tool pages are indexed |
| Google Search Console performance | `검색결과에서의 실적` under the `sc-domain:bobob.app` property | Latest `bobob935@gmail.com` check showed clicks `1`, impressions `28`, CTR `3.6%`, average position `3.5` for `3개월`; last updated `8.5시간 전`. The visible query row included `bobs toolbox` with clicks `0` and impressions `1`. | Google has begun showing both impressions and one click | It does not prove useful traffic or broad Blog + Play indexing completion |
| Google Search Console page indexing | `페이지 색인 생성` under the `sc-domain:bobob.app` property | Latest `bobob935@gmail.com` recheck still showed indexed pages `1`, not-indexed pages `32`, last updated `2026. 6. 30`; reason rows include `리디렉션이 포함된 페이지`: `5`, `크롤링됨 - 현재 색인이 생성되지 않음`: `24`, `사용자가 선택한 표준이 없는 중복 페이지`: `2`, and `적절한 표준 태그가 포함된 대체 페이지`: `1` | The page-indexing report still reflects one indexed URL, but its report date is still `2026. 6. 30` and has not caught up with the 2026-07-07 sitemap/read/request activity | It does not prove that the 2026-07-07 85-URL sitemap resubmission has been crawled or indexed |
| Google URL Inspection | Homepage plus Blog/Play/operations-tool representatives | Homepage `https://www.bobob.app/` is `URL이 Google에 등록되어 있음` and `페이지 색인이 생성됨`; a recrawl/indexing request was submitted after the site-wide operations metadata deployment and showed `색인 생성 요청됨`. `/blog`, `/play`, and `/tools/http-status-checker` are not registered; each showed `페이지 색인이 생성되지 않음: 크롤링됨 - 현재 색인이 생성되지 않음` and sitemap `https://www.bobob.app/sitemaps/en`. `/tools/http-status-checker` also received a fresh `색인 생성 요청됨` confirmation. `/blog` and `/play` were not re-requested in this pass because earlier logs already contain requests and Google states repeated submissions do not improve queue position or priority. | URL Inspection proves homepage indexing, sitemap association, inspected representative states, and queued recrawl/indexing requests for the homepage and one operations tool | It does not prove the Blog/Play representatives or the operations-tool representative were indexed after inspection |
| Bing and IndexNow | `https://api.indexnow.org/indexnow` with the public key file | Latest IndexNow representative submission: `85` URLs with response `200` after the site-wide operations metadata deployment | Bing-compatible discovery was refreshed for the current deployed representative URL set | It does not prove Bing indexed or ranked the pages, and it does not replace Search Console or Naver observation |
| Bing Webmaster Tools | `https://www.bing.com/webmasters/home?siteUrl=https%3A%2F%2Fwww.bobob.app` | Latest `2026-07-07` browser recheck still reached the public Bing Webmaster Tools about/landing page with `Sign In`; site-specific sitemap, Site Explorer, URL Submission, and recommendation classes were not visible. | Bing Webmaster follow-up still needs a signed-in session that reaches the `www.bobob.app` site dashboard | It does not provide indexing, sitemap, or recommendation evidence yet |
| Public Bing search | `site:www.bobob.app` | Latest browser check hit a `계속하려면 아래 과제 해결` challenge | Public Bing search was attempted | It does not prove whether Bing has indexed the URL set |
| Naver Search Advisor | `https://searchadvisor.naver.com/` | Latest `2026-07-07` signed-in Search Advisor recheck reached the `풀꽃` account dashboard and the `https://www.bobob.app` detail page. The site is listed, registered `25.07.24`, with ownership expiring `26.07.24`; the summary reports the security certificate and HTTPS redirect as normal, but still reports `사이트맵을 찾을 수 없습니다`. The sitemap-submit page still shows only old broad locale rows from `26.06.16` (`sitemaps/ar`, `sitemaps/th`, `sitemaps/vi`, `sitemaps/id`, `sitemaps/hi`, `sitemaps/fr`, `sitemaps/pt-BR`, `sitemaps/zh-TW`, `sitemaps/zh-CN`, `sitemaps/es`). `sitemaps/en` is not visible in the submitted sitemap row list. Route cleanup now keeps retired known locale sitemap paths on 308 redirects to `/sitemaps/en` instead of 404s. | Naver ownership, site dashboard access, and basic HTTPS state are confirmed; older visible sitemap rows now resolve toward the reduced sitemap route instead of dead XML paths | It does not prove Naver indexed or ranked pages, and Naver still needs a later signed-in check to confirm whether it rereads the redirected rows or accepts `sitemaps/en` visibly |
| RSS feed | `/feed.xml` | Current representative feed has `62` Blog + Play items and WebSub hub discovery | Feed readers and lightweight crawlers can discover the representative content set | It does not replace sitemap or webmaster-tool evidence |
| Atom feed | `/atom.xml` | Current representative feed has `62` Blog + Play entries and WebSub hub discovery | Feed readers and WebSub can discover the representative content set | It does not prove search indexing |
| JSON Feed | `/feed.json` | Current representative feed has `62` Blog + Play items and WebSub hub metadata | Programmatic readers can discover the representative content set | It does not broaden the submitted sitemap scope |
| WebSub | `https://pubsubhubbub.appspot.com/` for RSS and Atom topics | Latest WebSub representative publish: `62` RSS items and `62` Atom entries with response statuses `204`, `204` after the site-wide operations metadata deployment | Feed update topics were refreshed for the current representative feed set | It does not prove Google indexed the URLs |
| robots.txt | `/robots.txt` | Allows public crawl paths and points to `/sitemap.xml` | Crawlers can find the canonical sitemap index | It does not force crawling or indexing |
| OpenSearch | `/opensearch.xml` | Points to `/search?q={searchTerms}` | Browsers and crawlers can discover the internal search entrypoint | It does not submit pages to search engines |
| llms.txt | `/llms.txt` | Lists web-operations tools, Blog, Play, categories, discovery routes, and trust pages | AI/search-adjacent crawlers can understand the current site map | It does not expand into broad per-locale sitemap coverage |
| Public search spot check | `site:www.bobob.app bobob.app` | Homepage appeared in a public search result | The canonical host can surface publicly | It does not prove the new Blog + Play URL set is indexed |

## Manual Follow-up Window

- Completed observation: `2026-07-02`
- Next scheduled observation: `2026-07-09`
- Second scheduled observation: `2026-07-09`
- Automation id: `bobob-indexing-observation`
- Use Search Console property: `sc-domain:bobob.app` for the user's Search Console link; compare older URL-prefix observations under `https://www.bobob.app/` only when reviewing historical rows.
- Use Google account: `bobob935@gmail.com`
- Use the Chrome profile/session signed in as `bobob935@gmail.com`; do not inspect Search Console from another signed-in Chrome profile.
- Open Bing Webmaster Tools in a signed-in session and check recommendation classes before closing the indexing loop.
- Public Bing `site:` search may show a challenge; do not treat a blocked public search page as indexing evidence.
- Open Naver Search Advisor in a signed-in session and check site ownership, sitemap, robots.txt, and representative page collection status before closing the indexing loop; `sitemaps/en` still needs a visible successful registration or an explicit Naver error state.

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
- Latest `/sitemaps/en` discovered pages after the 2026-07-07 85-URL resubmission: `85`
- Current representative `/sitemaps/en` source URL target: `85`
- Latest external sitemap discovery count: `85`
- Latest IndexNow representative submission count: `85`
- Current representative feed source target item count: `62`
- Latest external feed publish item count: `62`
- The latest Search Console discovered count now reflects the latest externally submitted `85`-URL sitemap after the signed-in `bobob935@gmail.com` resubmission on `2026. 7. 7.`. The current source and live target is `85` URLs after the site-wide operations metadata deployment, with IndexNow refreshed at `85` URLs and WebSub refreshed at `62` feed items. A same-day `sc-domain:bobob.app` recheck also refreshed from the older visible `84`-page row to the current `85`-page row after reload. Earlier Chrome retries exposed only `task10@ljfriends.net`, but the current matrix uses the successful `bobob935@gmail.com` observation. This is discovery evidence, not indexing proof.

Latest Search Console observation from `bobob935@gmail.com`:

- Total clicks: `1`
- Total impressions: `28`
- Indexed pages: `1`
- Not indexed pages: `32`
- `/sitemaps/en` discovered pages: `85` against the latest externally submitted `85`-URL sitemap on `2026. 7. 7.`. This is discovery evidence, not indexing proof.
- Page indexing reasons include `리디렉션이 포함된 페이지`: `5`, `크롤링됨 - 현재 색인이 생성되지 않음`: `24`, `사용자가 선택한 표준이 없는 중복 페이지`: `2`, and `적절한 표준 태그가 포함된 대체 페이지`: `1`.
- URL Inspection: `https://www.bobob.app/` is indexed and received a fresh recrawl/indexing request after the site-wide operations metadata deployment; `/blog`, `/play`, and `/tools/http-status-checker` are not indexed yet. `/tools/http-status-checker` received a fresh indexing request in this pass.
- Pillar URL inspections: `why-bobob-shifted-to-content-lab` and `content-indexing-checklist-before-resubmission` are still not indexed, now with `크롤링됨 - 현재 색인이 생성되지 않음`; both remain tied to `https://www.bobob.app/sitemaps/en`, show successful Googlebot smartphone fetches on `2026. 7. 3.`, allow indexing, and both have fresh `색인 생성 요청됨` confirmations.

## Stop Rule

Do not mark the active web-operations + Blog + Play goal complete from deployment, sitemap fetches, Search Console submission success, IndexNow `200`, WebSub `204`, Naver page collection request, or public search spot checks alone.

Completion needs concrete changed Search Console, Bing, or Naver evidence recorded in `docs/search-indexing-observation-log.md`: indexed pages, impressions, page indexing reason changes, representative URL inspection changes, Bing recommendation changes, Naver Search Advisor collection/indexing changes, or measured exports that cover the submitted Blog + Play URL set.
