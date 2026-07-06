# bobob.app Blog + Play Goal Audit

This audit tracks the active first-pass goal. It is not a completion certificate. The goal stays open until the external indexing observation window produces concrete Search Console/Bing/Naver evidence.

## Current Product State

- Public direction: bobob.app is now a web-operations workbench first, with Blog and Play preserved as supporting operating evidence and retention experiments.
- Tools position: selected high-utility tools for URL status, redirect chains, response headers, DNS, sitemap, robots, meta/canonical, JWT, and JSON/API inspection are now presented as the main homepage workflow. Generic developer utilities remain available under `/tools` but should not read as a thin DevTools clone.
- Blog/Play position: Blog and Play are not removed; they stay visible as operating notes, build logs, and short interaction surfaces below the primary operations workflow.
- No support monetization: the first pass does not expose donation, coffee, paid-pack, login, ranking, comments, or game-ad UI.

## Blog Evidence

- Blog source: `content/blog/*.mdx`
- Current count: `128` Blog posts.
- Representative submitted count: `35` Blog posts.
- Archive/noindex candidate count: `93` Blog posts.
- Representative minimum body depth: `401` words after the source-level 400-word gate was added to `npm run harness:blog-play-mvp`.
- Date range: `2026-01-05` through `2026-07-06`, with public dates spread across the first half of 2026 plus the current representative operations note.
- Categories: `일기`, `요즘 관심사`, `AI`, `개발`, `운영 기록`, `정보`.
- Category distribution: the original five categories each have at least `7` posts, and the `정보` lane has `36` date-sensitive posts.
- Date-sensitive information lane: `36` posts live under `정보` for AI plan prices, safe-driving insurance discounts, MacBook price/outlook notes, football checks, World Cup bracket/time/search/watch/round-of-32/ticket/host-city/resale/player-stat checks, and youth savings notes.
- Representative information lane: `6` posts remain submitted under `정보`.
- Standalone Blog lane: `48` posts have no forced `relatedPlay`, so Blog is not subordinate to Play.
- Representative standalone lane: `8` submitted posts have no forced `relatedPlay`.
- First consolidated devlog posts now replace clusters of short development notes in the submitted Blog set:
  - `password-lock-build-log`
  - `ten-box-rush-build-log`
  - `deploy-pattern-memory-build-log`
  - `meeting-escape-build-log`
  - `priority-sorter-build-log`
  - `ai-review-tap-build-log`
  - `prompt-cleanup-build-log`
  - `bug-clicker-build-log`
  - `deploy-snake-build-log`
  - `deploy-stacker-build-log`
  - `deploy-minesweeper-build-log`
  - `notification-mole-build-log`
  - `lottery-endless-stage-loop-note`
- Password-lock consolidation: `password-lock-build-log` now absorbs eight short noindex notes about candidate chips, history candidate counts, digit heatmaps, guess previews, split meters, smarter candidates, keyboard suggestion cycling, and slot-aware keypad cues into one representative build log tied to `password-lock`.
- Memory-console consolidation: `deploy-pattern-memory-build-log` now absorbs the short noindex notes for replay, input trail, and flow-panel cleanup into one representative build log tied to `deploy-pattern-memory`.
- Meeting-routine consolidation: `meeting-escape-build-log` now absorbs the short noindex notes about small starts, one-rule Play, button response, naming, and routine into one representative build log tied to `meeting-escape`.
- Priority-board consolidation: `priority-sorter-build-log` now absorbs the short noindex notes about static-first operation, delayed login, and server limits into one representative build log tied to `priority-sorter`.
- AI-review consolidation: `ai-review-tap-build-log` now absorbs the short noindex notes about AI outputs as drafts and answer-review habits into one representative build log tied to `ai-review-tap`.
- Prompt-request consolidation: `prompt-cleanup-build-log` now absorbs the short noindex notes about reviewing AI answers and deciding before delegation into one representative build log tied to `prompt-cleanup`.
- Bug-ticket consolidation: `bug-clicker-build-log` now absorbs the short noindex notes about Codex work direction and one-button Play response into a 1,300+ word representative build log tied to `bug-clicker`, with first-5-second screen decisions, rejected feature choices, failure-cause separation, and result-link verification criteria so the required bug-ticket Play has a direct build-log page instead of relying only on adjacent operations posts.
- Office-survival promotion: `office-survival-workday` moved from a short noindex diary note into a representative production log tied to `office-survival`, with an archive absorption table, four-resource design table, and screen-check checklist for the first Play surface.
- Notification-mole consolidation: `notification-mole-build-log` now absorbs the two short noindex notes about urgency rings and priority cues into one representative build log tied to `notification-mole`, so the Play has its own screen-judgment record instead of relying only on the cross-game feedback article.
- Cross-game feedback consolidation: `game-feedback-before-score-note` now absorbs smaller noindex cue notes for `bug-brick-breaker`, `server-room-flight`, `bug-bubble-shooter`, `deploy-crossing`, `deploy-invaders`, and `prompt-gem-swap`, so those short implementation notes do not need separate submitted pages.
- Lottery-scratch consolidation: `lottery-endless-stage-loop-note` now absorbs the shorter `lottery-scratch-stage-note` archive note, so `lucky-scratch` has one submitted representative page for the paper-to-foil-to-slip loop while the earlier scratch-stage implementation memo remains reachable by URL but noindex.
- Owner-operations consolidation: `search-console-waiting-diary` now absorbs the short indexing-waiting notes into one representative operations article with a table, today's-check checklist, wait-list checklist, and verification record shape tied to `indexing-waiting-room`.
- Owner category balance: `first-small-web-note` and `why-small-web-toys-return` are now deeper representative posts, so the `일기` and `요즘 관심사` category hubs each have at least two submitted posts instead of looking like one-post hubs.
- Date-sensitive information pruning: `world-cup-search-terms-check-2026-06-27`, `world-cup-player-stats-check-2026-06-27`, `world-cup-round-of-32-korea-time-2026-06-27`, `world-cup-round-of-32-bracket-check-2026-06-27`, `world-cup-round-of-32-check-2026-06-27`, `world-cup-third-place-rules-2026-06-27`, `world-cup-watch-replay-check-2026-06-27`, `world-cup-resale-transfer-check-2026-06-27`, `youth-future-savings-search-questions-2026-06-27`, `youth-future-savings-switch-check-2026-06-27`, `youth-future-savings-vs-youth-leap-check-2026-06-27`, and `youth-future-savings-rate-check-2026-06-27` are now archive/noindex candidates so the submitted set is less dominated by duplicate information wrappers.
- First pillar posts now carry the site-owner evidence surface:
  - `why-bobob-shifted-to-content-lab`
  - `static-micro-games-architecture`
  - `content-indexing-checklist-before-resubmission`
- Homepage evidence surface: `apps/main/src/app/page.tsx` now opens with `data-ops-workflows` for URL/header/DNS/sitemap/token checks, then keeps the three pillar posts in the `data-pillar-blog` operating-notes section before ordinary latest Blog cards, so a first visitor sees a concrete reason to use the site while Blog/Play evidence stays visible.
- Global search evidence surface: `/search?q=` now returns `data-content-search-workflows` results for task-shaped operations queries such as redirect debugging, search discovery readiness, DNS deployment, and security-header review before falling through to individual tool cards, so internal search no longer reads as only a generic developer-tool archive.
- DevTools boundary evidence: `devtools-cannot-see-crawler-state` is now a representative operations post tied to `indexing-waiting-room`, with a DevTools/public crawler comparison table, public URL checklist, and Search Console account/property stop rule so the new developer-tool direction is explained as a web-operations workflow rather than another browser-tool clone.
- HTTP Status Checker evidence surface: `/tools/http-status-checker` now exposes a copyable Public URL report with final status, redirect count, redirect path, allowlisted response-header diagnostics, and security-header review notes so the submitted tool page produces an issue/deploy handoff artifact rather than only duplicating browser DevTools output.
- DNS Lookup evidence surface: `/tools/dns-lookup` now exposes a copyable DNS deployment report with web routing, IPv6, canonical, name-server, TXT policy, and DMARC notes so the submitted tool page produces a domain/deploy handoff artifact instead of only duplicating a local DNS lookup.
- Sitemap Generator evidence surface: `/tools/sitemap-generator` now exposes a copyable Search discovery report with URL count, canonical host, HTTPS count, duplicate warnings, and submission checklist notes so the submitted tool page supports Search Console/Bing/Naver handoff instead of only producing XML.
- Robots.txt Generator evidence surface: `/tools/robots-txt-generator` now exposes a copyable Robots crawl report with crawl policy, sitemap directive, sitemap host, directive counts, warning notes, and crawler checklist so the submitted tool page supports crawl-policy handoff instead of only producing text.
- Meta Tag Generator evidence surface: `/tools/meta-tag-generator` now exposes a copyable Meta crawler report with title and description lengths, canonical host, robots policy, Open Graph image host, warning notes, and crawler checklist so the submitted tool page supports metadata/Search Console handoff instead of only producing tag markup.
- Open Graph Preview evidence surface: `/tools/open-graph-preview` now exposes a copyable Open Graph crawler report with title and description lengths, page host, image host, robots policy, warning notes, and crawler checklist so the submitted SEO tool page supports social-preview/Search Console handoff instead of only showing a card mock.
- URL Parser evidence surface: `/tools/url-parser` now exposes a copyable URL canonical report with host, query, tracking, fragment, clean URL, canonical candidate, warning notes, and crawler follow-up checklist so the submitted operations tool page supports URL cleanup/Search Console handoff instead of only showing parsed URL JSON.
- Blog index evidence surface: `apps/main/src/app/blog/page.tsx` now exposes the same three pillar posts in the `data-blog-pillars` first-read section before category cards, so `/blog` starts with the site direction, Play architecture, and content/indexing policy instead of a long chronological archive.
- Trust surface alignment: default About/Contact copy now describes the web-operations workbench first while preserving Blog/Play context; localized trust routes still need a follow-up pass if the operations-first wording is expanded beyond this source-locale recovery slice.
- Required first-pass topics are present:
  - `ai-side-project-realistic-order`
  - `cursor-codex-web-service-bottlenecks`
  - `search-console-misreads-for-indie-devs`
  - `small-web-games-retention`
  - `vercel-sitemap-canonical-log`
  - `human-decisions-in-ai-coding`
  - `why-bobob-shifted-to-content-lab`
  - `static-micro-games-architecture`
- Representative quality hardening:
  - `npm run harness:blog-play-mvp` now checks archive consolidation at the slug level: every noindex Blog note with `archiveGroup` must be explicitly named inside an indexable representative Blog post, not only share a related Play.
  - `small-web-games-retention` was deepened from a short retention argument into an 800+ word Blog + Play operating note with a signal table, explicit choices not built, Play QA hooks, and consolidation criteria for short notes.
  - `search-console-misreads-for-indie-devs` was deepened from a short Search Console warning into an 800+ word observation workflow with a proof/not-proof table, current 77-URL sitemap interpretation, wait-period stop rules, and the next external checks to compare.
  - `cursor-codex-web-service-bottlenecks` was deepened from a short AI-tool bottleneck note into an 800+ word development operations article with route/content/sitemap/workflow boundaries, failure-mode checks, and the final verification bundle.
  - `human-decisions-in-ai-coding` was deepened from a short AI judgment note into an 800+ word product-decision article with a human/AI responsibility table, explicit deferred features, public URL decisions, and indexing-observation wording discipline.
  - `vercel-sitemap-canonical-log` was deepened from a short canonical cleanup note into a 1,300+ word web-operations article with domain/app/content/external-tool layers, source/live/external-observation number discipline, deployment-status separation, a sitemap-scope table, and a public-surface check bundle.
  - `ai-side-project-realistic-order` was deepened from a short AI side-project note into a 1,400+ word product-scope article with deferred-feature decisions, public-surface ownership table, AI request checklist, completion criteria, and a Blog/Play/search/deploy verification table.
  - `first-small-web-note` was deepened from a smaller diary entry into a 900+ word owner-note article with a public-surface operating-unit table, list-review criteria, and representative/archive separation rules.
  - `why-small-web-toys-return` was deepened from a smaller interest note into a near-900 word Blog + Play article with a small-Play quality table, mobile/result-link checks, and visual-metaphor criteria.
  - `content-indexing-checklist-before-resubmission` was strengthened with a concrete source-surface table, the representative/archive split, user-visible route checks, and the reminder that source cleanup is not external indexing proof.
  - `why-bobob-shifted-to-content-lab` was deepened from a first-direction note into a 1,200+ word ownership pillar with public-surface reduction criteria, representative-evidence requirements, archive/noindex detail-page checks, and a final screen-review checklist for proving that Blog + Play is the visible first impression.
  - `static-micro-games-architecture` was deepened from a short static-Play structure note into a 1,600+ word architecture pillar with a content/engine/discovery/verification/privacy boundary table, a pre-publication question table, a static-runtime failure table, and a final public-readiness checklist for proving that Play is a deliberately operated static content surface rather than loose sample games.
  - `office-survival-workday` was deepened from a 700+ word first-Play production log into a 1,300+ word representative article with a ten-ticket placement table, choice-effect tuning notes, deliberately excluded feature table, result-screen continuation notes, and a pre-publication checklist for proving that the first Play is an operated resource-management surface rather than a short workplace joke.
  - `deploy-stacker-build-log` was deepened from an 860-word archive absorption note into a 1,200+ word release-rail production log with a deliberate-exclusion table, scene-by-scene screen criteria, and verification questions for keeping the stacker Play about landing width and cut loss rather than jackpots, height ranking, or recovery loops.
  - `macbook-price-outlook-2026-06-26` was deepened from a thinner information note into a 1,000+ word comparison article with a 2026-07-03 follow-up check, official announcement price table, purchase-screen/discount separation, reseller-discount caveat, and a purchase checklist so the submitted information lane reads like a reusable decision note instead of a stale price snippet.
  - `notification-mole-build-log` now gives the notification selector its own representative production log with an archive absorption table, signal table, and desktop/mobile verification criteria for making the game about selecting important alerts instead of tapping everything.
  - `lottery-endless-stage-loop-note` now absorbs `lottery-scratch-stage-note` into a 1,100+ word representative Play-safety build log with an archive absorption table, excluded-mechanics reasoning, screen-check criteria, and verification criteria for keeping lottery-style Play away from scoreboards, timers, cumulative winnings, and loss-recovery prompts.
  - `devtools-cannot-see-crawler-state` adds a representative operations note that separates Chrome DevTools, public status checks, sitemap/robots/canonical review, and Search Console observations with a table and final checklist before the next manual indexing pass.

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
- Current source discovery target after web-operations recovery:
  - Sitemap URLs: `84`
  - Feed items: `61`
  - Blog posts: `128`
  - Representative Blog posts: `35`
  - Play entries: `26`
  - Submitted operations tool URLs: `8`
- Latest deployed/Search Console-observed discovery snapshot:
  - Sitemap URLs: `77`
  - Feed items: `62`
  - Representative Blog posts: `36`
- Latest deployed production discovery snapshot after PR #5:
  - Sitemap URLs: `74`
  - Feed items: `59`
  - Representative Blog posts: `33`
- Latest deployed production discovery snapshot after the 75-URL production refresh:
  - Sitemap URLs: `75`
  - Feed items: `60`
  - Representative Blog posts: `34`
  - Representative set change: `lottery-scratch-stage-note` moved back to `devlog-archive`/`noindex`, while `lottery-endless-stage-loop-note` remains the single submitted lucky-scratch representative and names the archived note explicitly.
- Latest deployed production discovery snapshot after the web-operations recovery:
  - Sitemap URLs: `83`
  - Feed items: `60`
  - Representative Blog posts: `34`
  - Submitted operations tool URLs: `8`
- Latest deployed production discovery snapshot after the DevTools boundary operations post:
  - Sitemap URLs: `84`
  - Feed items: `61`
  - Representative Blog posts: `35`
  - Submitted operations tool URLs: `8`
- Google Search Console:
  - Account: `bobob935@gmail.com`
  - Browser/session guard: use the Chrome profile/session signed in as `bobob935@gmail.com`; do not inspect Search Console from another signed-in Chrome profile.
  - Property: `https://www.bobob.app/`
  - `/sitemaps/en` was checked and submitted again from the signed-in `bobob935@gmail.com` Chrome session after the current 84-URL representative target was live.
  - Search Console sitemap resubmission for the latest externally submitted 84-URL sitemap showed `사이트맵이 제출됨`. The visible `/sitemaps/en` row showed status `성공`, submitted `2026. 7. 6.`, last read `2026. 7. 6.`, discovered pages `84`, and videos `0`.
- The representative sitemap remains intentionally reduced. Production and Search Console now align at the current `84` URL count after adding the selected operations-first tool pages and the DevTools/public-crawler boundary operations post. This is discovery evidence, not indexing proof.
  - Earlier 2026-07-06 follow-ups exposed only `task10@ljfriends.net` in Chrome and did not count as valid `bobob935@gmail.com` observations.
  - The later signed-in `bobob935@gmail.com` pass is the current Search Console sitemap observation for the 84-URL target.
  - Latest performance observation showed total clicks `0`, total impressions `18`, CTR `0%`, and average position `1.1` for the `3개월` range.
  - Latest page indexing report now shows indexed pages `1` and not-indexed pages `32`, with last update `2026. 6. 30`.
  - Latest page-indexing reason rows include `크롤링됨 - 현재 색인이 생성되지 않음`: `24`, `리디렉션이 포함된 페이지`: `5`, `사용자가 선택한 표준이 없는 중복 페이지`: `2`, and `적절한 표준 태그가 포함된 대체 페이지`: `1`.
  - URL Inspection now shows `https://www.bobob.app/` as `URL이 Google에 등록되어 있음` and `페이지 색인이 생성됨`.
  - Representative Blog/Play URLs inspected: `https://www.bobob.app/blog`, `https://www.bobob.app/play`, `https://www.bobob.app/blog/ai-side-project-realistic-order`, and `https://www.bobob.app/play/office-survival`.
  - Representative Blog/Play URL status before request: `/blog`, `/play`, and `/play/office-survival` were `크롤링됨 - 현재 색인이 생성되지 않음`; `/blog/ai-side-project-realistic-order` was `발견됨 - 현재 색인이 생성되지 않음`.
  - Representative Blog/Play URL indexing request confirmation: `색인 생성 요청됨`
  - Post-77-URL pillar URL Inspection checked `https://www.bobob.app/blog/why-bobob-shifted-to-content-lab` and `https://www.bobob.app/blog/content-indexing-checklist-before-resubmission`.
  - Both pillar URLs were `URL이 Google에 등록되어 있지 않음` with `페이지 색인이 생성되지 않음: 크롤링됨 - 현재 색인이 생성되지 않음`; both remain tied to `https://www.bobob.app/sitemaps/en`, fetched successfully, and allowed indexing.
  - Both pillar URL indexing request confirmations showed `색인 생성 요청됨` and `URL이 우선순위 크롤링 대기열에 추가되었습니다`.
- IndexNow:
  - Latest submitted URL count: `84`
  - The latest deployed 84-URL representative sitemap set has been submitted to IndexNow with response status `200`.
  - Search Console resubmission is also aligned at `84`, but both Search Console discovery and IndexNow submission still need later indexing observation; IndexNow is not Google indexing proof.
- Bing:
  - Bing Webmaster Tools reached the public landing page with `Sign In`; site-specific recommendation classes were not visible without a signed-in session.
  - The latest 2026-07-06 retry against the current 84-URL production target still reached only the public Bing Webmaster Tools landing page, so no Bing sitemap or recommendation state was observed.
  - Public Bing `site:www.bobob.app` search was blocked by a `계속하려면 아래 과제 해결` challenge, so it did not provide indexing evidence.
- Naver:
  - Signed-in Search Advisor showed `https://www.bobob.app` owned under `풀꽃`, registered `25.07.24`, with ownership expiring `26.07.24`.
  - Naver reports security certificate and HTTPS redirect as normal.
  - Naver still reports `사이트맵을 찾을 수 없습니다` and `콘텐츠 노출/클릭 정보가 없습니다`.
  - Visible Naver sitemap rows are old broad locale entries from `26.06.16`; `sitemaps/en` was not visibly added after submission attempts.
  - The latest 2026-07-06 retry reached only the public Search Advisor landing page with `로그인`; the console retry did not produce a readable signed-in site dashboard before the browser-control session timed out.
  - A Naver page collection request, when submitted later, must be logged separately and must not be treated as indexing proof.
- WebSub:
  - Feed topics submitted: `https://www.bobob.app/feed.xml`, `https://www.bobob.app/atom.xml`
  - Latest response statuses: `204`, `204`
  - Latest published feed item counts: `61`, `61`.
  - The current 61-item feed set now reflects the DevTools/public-crawler boundary operations post.
- Discovery registration matrix:
  - `docs/search-discovery-registration.md` tracks Google Search Console, Bing/IndexNow, Naver Search Advisor, feeds, WebSub, robots.txt, OpenSearch, llms.txt, current counts, and the stop rule that discovery submissions are not indexing proof.
- Submitted URL health:
  - `npm run harness:submitted-url-health` verifies every submitted `/sitemaps/en` URL as a final 200 HTML response with matching canonical, one h1, unique title/description, social metadata, and indexable robots metadata.
- Live first-impression verification after the 75-URL deployment:
  - `BOBOB_BASE_URL=https://www.bobob.app NODE_TLS_REJECT_UNAUTHORIZED=0 npm run harness:routes` passed for `268` live paths.
  - `BOBOB_BASE_URL=https://www.bobob.app NODE_TLS_REJECT_UNAUTHORIZED=0 npm run harness:search` passed, so content search remains aligned with Blog + Play first and noindex archive separation.
  - `BOBOB_BASE_URL=https://www.bobob.app NODE_TLS_REJECT_UNAUTHORIZED=0 npm run harness:blog-play-quality` passed for `68` live Blog/Play pages.
  - `BOBOB_BASE_URL=https://www.bobob.app NODE_TLS_REJECT_UNAUTHORIZED=0 npm run harness:rendered-content` passed for `383` live pages, covering home, tools, guides, trust/legal, and localized support surfaces.
- Live Play completion verification after the 75-URL deployment:
  - `npm run harness:play-planning` passed for all `26` Play entries.
  - `BOBOB_BASE_URL=https://www.bobob.app NODE_TLS_REJECT_UNAUTHORIZED=0 npm run harness:play-interaction` passed for all `26` Play entries across desktop and mobile viewports, including result sharing and related Blog/Play links.
- Measured SEO/AdSense export readiness:
  - `npm run harness:seo-opportunities` found `77` measured-review inventory pages (`60` tools and `17` guides), but no private Search Console or AdSense exports are present.
  - `npm run harness:seo-measured` correctly fails until Search Console and AdSense rows exist, with `0/36` required measured core pages covered.
  - `metadataRewriteReadiness.canRewritePublicMetadata=false`, so title/description rewrites from backlog-only suggestions remain blocked.

## Still Not Complete

- Search Console has started showing more impressions (`18`) in the `3개월` performance report, but clicks remain `0`.
- Google URL Inspection proves the homepage itself is indexed.
- Search Console page indexing is still unresolved: indexed pages `1`, not-indexed pages `32`.
- Search Console sitemap discovery now matches the current live representative sitemap URL count (`84`), but this is discovery only and still does not prove that submitted Blog, Play, or tool URLs are indexed.
- Blog and Play representative URLs are still not indexed after inspection; requests were queued but that is not indexing proof.
- The two new pillar posts have `색인 생성 요청됨` confirmations, but they are still not indexed after the latest inspection.
- Search Console and AdSense measured CSV exports are still missing, so measured SEO review and public metadata rewrites are intentionally blocked.
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
