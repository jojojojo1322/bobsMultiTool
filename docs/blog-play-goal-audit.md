# bobob.app Blog + Play Goal Audit

This audit tracks the active first-pass goal. It is not a completion certificate. The goal stays open until the external indexing observation window produces concrete Search Console/Bing/Naver evidence.

## Current Product State

- Public direction: bobob.app is now a Blog + Play workshop for development, AI, side-project, and web-operations writing plus lightweight web play.
- Tools position: existing developer tools remain available under `/tools`, but they are no longer the main homepage direction.
- No support monetization: the first pass does not expose donation, coffee, paid-pack, login, ranking, comments, or game-ad UI.

## Blog Evidence

- Blog source: `content/blog/*.mdx`
- Current count: `114` Blog posts.
- Date range: `2026-01-05` through `2026-06-28`, with public dates spread across the first half of 2026 instead of piling up in late June.
- Categories: `일기`, `요즘 관심사`, `AI`, `개발`, `운영 기록`, `정보`.
- Category distribution: the original five categories each have at least `7` posts, and the `정보` lane has `36` date-sensitive posts.
- Date-sensitive information lane: `36` posts live under `정보` for AI plan prices, safe-driving insurance discounts, MacBook price/outlook notes, football checks, World Cup bracket/time/search/watch/round-of-32/ticket/host-city/resale/player-stat checks, and youth savings notes.
- Standalone Blog lane: `46` posts have no forced `relatedPlay`, so Blog is not subordinate to Play.
- Required first-pass topics are present:
  - `ai-side-project-realistic-order`
  - `cursor-codex-web-service-bottlenecks`
  - `search-console-misreads-for-indie-devs`
  - `small-web-games-retention`
  - `vercel-sitemap-canonical-log`
  - `human-decisions-in-ai-coding`
  - `why-bobob-shifted-to-content-lab`
  - `static-micro-games-architecture`

## Play Evidence

- Play source: `content/play/*.json`
- Current count: `26` Play entries.
- Required first-pass entries are present:
  - `office-survival`
  - `prompt-cleanup`
  - `meeting-escape`
  - `priority-sorter`
  - `bug-clicker`
  - `ai-review-tap`
- Implemented Play engine types:
  - `micro-sim`
  - `tap-game`
  - `sort-match-game`
  - `arcade-game`
- Arcade entries use a shared keyboard/canvas engine with button fallbacks, so Play can move beyond quiz-style choices without adding server state.
- Play pages link to related Blog and related Play entries through result links.
- Blog posts that declare `relatedPlay` must point to existing Play entries, and those Play entries must link back.

## Discovery And Submission Evidence

- Live canonical host: `https://www.bobob.app`
- Reduced submitted sitemap route: `/sitemaps/en`
- Current live discovery snapshot:
  - Sitemap URLs: `151`
  - Feed items: `140`
  - Blog posts: `114`
  - Play entries: `26`
- Google Search Console:
  - Account: `bobob935@gmail.com`
  - Browser/session guard: use the Chrome profile/session signed in as `bobob935@gmail.com`; do not inspect Search Console from another signed-in Chrome profile.
  - Property: `https://www.bobob.app/`
  - `/sitemaps/en` was checked and submitted again on `2026-07-02` from the signed-in `bobob935@gmail.com` Chrome session.
  - Search Console sitemap row showed status `성공`, submitted `2026. 7. 2.`, last read `2026. 6. 26.`, and discovered pages `68`.
  - Live `/sitemaps/en` had `151` URLs at that check, so Search Console sitemap discovery still trails the current XML.
  - Latest performance observation showed total clicks `0`, total impressions `18`, CTR `0%`, and average position `1.1` for the `3개월` range.
  - Latest page indexing report still showed indexed pages `0` and not-indexed pages `5`, with last update `2026-06-12`.
  - URL Inspection now shows `https://www.bobob.app/` as `URL이 Google에 등록되어 있음` and `페이지 색인이 생성됨`.
  - Representative Blog/Play URLs inspected: `https://www.bobob.app/blog`, `https://www.bobob.app/play`, `https://www.bobob.app/blog/ai-side-project-realistic-order`, and `https://www.bobob.app/play/office-survival`.
  - Representative Blog/Play URL status before request: `/blog`, `/play`, and `/play/office-survival` were `크롤링됨 - 현재 색인이 생성되지 않음`; `/blog/ai-side-project-realistic-order` was `발견됨 - 현재 색인이 생성되지 않음`.
  - Representative Blog/Play URL indexing request confirmation: `색인 생성 요청됨`
- IndexNow:
  - Latest submitted URL count: `151`
  - Latest response status: `200`
  - The 151-URL live sitemap set was submitted after the Play canvas upgrade, information-content expansion, arcade count wording cleanup, latest Play cue updates, Naver verification confirmation, indexing waiting room update, and workshop growth ledger update.
- Bing:
  - Bing Webmaster Tools reached the public landing page with `Sign In`; site-specific recommendation classes were not visible without a signed-in session.
  - Public Bing `site:www.bobob.app` search was blocked by a `계속하려면 아래 과제 해결` challenge, so it did not provide indexing evidence.
- Naver:
  - Signed-in Search Advisor showed `https://www.bobob.app` owned under `풀꽃`, registered `25.07.24`, with ownership expiring `26.07.24`.
  - Naver reports security certificate and HTTPS redirect as normal.
  - Naver still reports `사이트맵을 찾을 수 없습니다` and `콘텐츠 노출/클릭 정보가 없습니다`.
  - Visible Naver sitemap rows are old broad locale entries from `26.06.16`; `sitemaps/en` was not visibly added after submission attempts.
  - A Naver page collection request, when submitted later, must be logged separately and must not be treated as indexing proof.
- WebSub:
  - Feed topics submitted: `https://www.bobob.app/feed.xml`, `https://www.bobob.app/atom.xml`
  - Latest response statuses: `204`, `204`
  - Latest feed item counts: `140`, `140`
- Discovery registration matrix:
  - `docs/search-discovery-registration.md` tracks Google Search Console, Bing/IndexNow, Naver Search Advisor, feeds, WebSub, robots.txt, OpenSearch, llms.txt, current counts, and the stop rule that discovery submissions are not indexing proof.
- Submitted URL health:
  - `npm run harness:submitted-url-health` verifies every submitted `/sitemaps/en` URL as a final 200 HTML response with matching canonical, one h1, unique title/description, social metadata, and indexable robots metadata.

## Still Not Complete

- Search Console has started showing more impressions (`18`) in the `3개월` performance report, but clicks remain `0`.
- Google URL Inspection proves the homepage itself is indexed.
- Search Console page indexing is still unresolved: indexed pages `0`, not-indexed pages `5`.
- Search Console sitemap discovery still trails the live sitemap URL count (`151`): `/sitemaps/en` discovered pages remain `68`.
- Blog and Play representative URLs are still not indexed after inspection; requests were queued but that is not indexing proof.
- Bing Webmaster recommendation classes still need a signed-in follow-up pass after deployment and submission propagation.
- Naver Search Advisor still needs a cleanup/pass for reduced sitemap registration and later collection/indexing state.
- Discovery submissions are hints only. They do not prove that Google, Bing, or Naver indexed the new Blog + Play pages.

## Scheduled Follow-up

- Automation id: `bobob-indexing-observation`
- Schedule: starts `2026-07-02 10:00`, weekly, `2` runs.
- Follow-up must compare:
  - total clicks
  - total impressions
  - indexed pages
  - not-indexed pages
  - `/sitemaps/en` discovered pages
  - representative URL inspection results
  - Bing Webmaster recommendation classes
  - Naver Search Advisor collection/indexing state

## Completion Rule

Do not mark the active goal complete from local code, deployment status, sitemap fetches, WebSub `204`, IndexNow `200`, Search Console submission success, or Naver page collection request alone. Completion requires concrete post-submission Search Console/Bing/Naver observation evidence recorded in `docs/search-indexing-observation-log.md`.
