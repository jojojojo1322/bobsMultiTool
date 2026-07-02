# bobob.app Search Discovery Registration Matrix

This matrix tracks the public discovery paths used for the Blog + Play migration. It is not indexing proof. Search readiness still needs later Search Console, Bing, and Naver observation evidence.

## Current Discovery Set

- Canonical host: `https://www.bobob.app`
- Apex host: `https://bobob.app` should permanently redirect to the canonical host.
- Submitted sitemap index: `https://www.bobob.app/sitemap.xml`
- Current submitted sitemap: `https://www.bobob.app/sitemaps/en`
- Current submitted sitemap URL count: `77`
- Current feed item count: `62`
- Current Blog count: `120`
- Current representative Blog count: `36`
- Current Play count: `26`
- Current Blog categories in sitemap: `일기`, `요즘 관심사`, `AI`, `개발`, `운영 기록`, `정보`
- Sitemap scope: home, global search, trust pages (`/about`, `/contact`, `/privacy`, `/terms`), Blog index, Blog category hubs with representative posts, representative Blog posts, Play index, Play pages, and archived `/tools`. Short devlog/archive Blog posts remain reachable but are excluded from the submitted sitemap/feed and marked noindex.
- Submitted URL health: every `/sitemaps/en` URL should be a final 200 HTML response with matching canonical, one h1, unique title/description metadata, OpenGraph/Twitter title and description, and indexable robots metadata.
- Paused scope: broad locale sitemap expansion. Do not restore it until localized Blog/Play content exists and measured demand supports it.

## Registration And Discovery Channels

| Channel | Public target | Current status | What it proves | What it does not prove |
| --- | --- | --- | --- | --- |
| Google Search Console sitemap | `/sitemaps/en` under the `https://www.bobob.app/` property | Trust-page sitemap correction target: `77` URLs. The `bobob935@gmail.com` session resubmitted `sitemaps/en` after the live 77-URL deployment, and Search Console showed `사이트맵이 제출됨`. The visible row now shows `/sitemaps/en`, submitted `2026. 7. 3.`, last read `2026. 7. 3.`, status `성공`, discovered pages `73`, videos `0` | Google accepted and read the canonical sitemap after the trust-page correction | It does not prove indexing, impressions, ranking, or that Search Console has discovered all `77` live sitemap URLs yet |
| Google Search Console performance | `검색결과에서의 실적` under the `https://www.bobob.app/` property | Latest `bobob935@gmail.com` check showed clicks `0`, impressions `18`, CTR `0%`, average position `1.1` for `3개월`; last updated `8.5시간 전` | Google has begun showing more search impressions than the earlier `3`-impression observation | It does not prove useful traffic or broad Blog + Play indexing completion |
| Google Search Console page indexing | `페이지 색인 생성` under the `https://www.bobob.app/` property | Latest `bobob935@gmail.com` check showed indexed pages `0`, not-indexed pages `5`, last updated `2026-06-12`; reason rows remain `리디렉션이 포함된 페이지` `3` and `적절한 표준 태그가 포함된 대체 페이지` `2` | The old page indexing report is still visible and measurable | It does not yet reflect the homepage URL Inspection indexed state or the submitted Blog + Play URL set |
| Google URL Inspection | Homepage plus Blog/Play representatives | Homepage `https://www.bobob.app/` is `URL이 Google에 등록되어 있음` and `페이지 색인이 생성됨`. `/blog`, `/play`, `/blog/ai-side-project-realistic-order`, and `/play/office-survival` are not registered; each has a confirmed `색인 생성 요청됨` after inspection. Post-pruning pillar live tests for `why-bobob-shifted-to-content-lab` and `content-indexing-checklist-before-resubmission` both returned `URL을 Google에 등록할 수 있음` with valid breadcrumb detection | URL Inspection proves homepage indexing, queues representative Blog/Play URLs, and confirms the new pillar pages are live-test eligible | It does not prove the Blog/Play representatives or pillar posts were indexed after inspection |
| Bing and IndexNow | `https://api.indexnow.org/indexnow` with the public key file | Latest IndexNow representative submission: `77` URLs with response `200` after the trust-page sitemap correction deployment | Bing-compatible discovery has been refreshed for the reduced representative URL set | It does not prove Bing indexed or ranked the pages |
| Bing Webmaster Tools | `https://www.bing.com/webmasters/home?siteUrl=https%3A%2F%2Fwww.bobob.app` | Latest browser check reached the public landing page with `Sign In`; the `2026-07-03` pass clicked `Sign In`, but the tab stayed on the public Webmaster Tools landing page, so site-specific recommendations were not visible | Bing Webmaster follow-up still needs a working signed-in dashboard session | It does not provide indexing or recommendation evidence yet |
| Public Bing search | `site:www.bobob.app` | Latest browser check hit a `계속하려면 아래 과제 해결` challenge | Public Bing search was attempted | It does not prove whether Bing has indexed the URL set |
| Naver Search Advisor | `https://searchadvisor.naver.com/` | Signed-in Search Advisor showed `https://www.bobob.app` owned under `풀꽃`, registered `25.07.24`, ownership expires `26.07.24`. Security certificate and HTTPS redirect are normal. Naver reports `사이트맵을 찾을 수 없습니다` and `콘텐츠 노출/클릭 정보가 없습니다`; visible sitemap rows are old broad locale entries from `26.06.16`, and `sitemaps/en` was not visibly added after submission attempts. The `2026-07-03` sitemap screen still showed no visible `sitemaps/en` row. The `sitemaps/en` submission field is reachable, but no new Naver submission was made in this pass because it changes webmaster-tool state and needs action-time confirmation | Naver ownership, basic HTTPS state, and the current sitemap-registration gap are confirmed | It does not prove Naver indexed or ranked pages, and the reduced sitemap still needs confirmed registration or an explicit decision to leave Naver on IndexNow/discovery only |
| RSS feed | `/feed.xml` | Representative feed target has `62` Blog + Play items and WebSub hub discovery | Feed readers and lightweight crawlers can discover the representative content set | It does not replace sitemap or webmaster-tool evidence |
| Atom feed | `/atom.xml` | Representative feed target has `62` Blog + Play entries and WebSub hub discovery | Feed readers and WebSub can discover the representative content set | It does not prove search indexing |
| JSON Feed | `/feed.json` | Representative feed target has `62` Blog + Play items and WebSub hub metadata | Programmatic readers can discover the representative content set | It does not broaden the submitted sitemap scope |
| WebSub | `https://pubsubhubbub.appspot.com/` for RSS and Atom topics | Latest WebSub representative publish: `62` RSS items and `62` Atom entries with response statuses `204`, `204` | Feed update topics have been refreshed for the representative feed set | It does not prove Google indexed the URLs |
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
- Open Bing Webmaster Tools in a signed-in session and check recommendation classes before closing the indexing loop. The latest `2026-07-03` browser pass still did not reach a site-specific dashboard.
- Public Bing `site:` search may show a challenge; do not treat a blocked public search page as indexing evidence.
- Open Naver Search Advisor in a signed-in session and check site ownership, sitemap, robots.txt, and representative page collection status before closing the indexing loop. The latest `2026-07-03` pass reached the `sitemaps/en` submission field, but submission is still pending explicit confirmation because it changes Naver state.

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
- Latest `/sitemaps/en` discovered pages after the 2026-07-03 trust-page correction resubmission: `73`
- Current representative `/sitemaps/en` URL count: `77`
- Latest IndexNow representative submission count: `77`
- Latest representative feed item count: `62`
- Trust-page correction Search Console sitemap submission was accepted and read, but the discovered page count remains `73` until Google reprocesses the full `77`-URL XML.

Latest Search Console observation from `bobob935@gmail.com`:

- Total clicks: `0`
- Total impressions: `18`
- Indexed pages: `0`
- Not indexed pages: `5`
- `/sitemaps/en` discovered pages: `73` against the current `77`-URL sitemap.
- URL Inspection: `https://www.bobob.app/` is indexed; Blog/Play representative URLs are not indexed yet.
- Pillar URL inspections: `why-bobob-shifted-to-content-lab` and `content-indexing-checklist-before-resubmission` are still not indexed, with `발견됨 - 현재 색인이 생성되지 않음`; both remain tied to `https://www.bobob.app/sitemaps/en`.

## Stop Rule

Do not mark the active Blog + Play goal complete from deployment, sitemap fetches, Search Console submission success, IndexNow `200`, WebSub `204`, Naver page collection request, or public search spot checks alone.

Completion needs concrete changed Search Console, Bing, or Naver evidence recorded in `docs/search-indexing-observation-log.md`: indexed pages, impressions, page indexing reason changes, representative URL inspection changes, Bing recommendation changes, Naver Search Advisor collection/indexing changes, or measured exports that cover the submitted Blog + Play URL set.
