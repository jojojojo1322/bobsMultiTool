# bobob.app Blog + Play Goal Audit

This audit tracks the active first-pass goal. It is not a completion certificate. The goal stays open until the external indexing observation window produces concrete Search Console/Bing/Naver evidence.

## Current Product State

- Public direction: bobob.app is now a Blog + Play workshop for development, AI, side-project, and web-operations writing plus lightweight web play.
- Tools position: existing developer tools remain available under `/tools`, but they are no longer the main homepage direction.
- No support monetization: the first pass does not expose donation, coffee, paid-pack, login, ranking, comments, or game-ad UI.

## Blog Evidence

- Blog source: `content/blog/*.mdx`
- Current count: `126` Blog posts.
- Representative submitted count: `34` Blog posts.
- Archive/noindex candidate count: `92` Blog posts.
- Representative minimum body depth: `401` words after the source-level 400-word gate was added to `npm run harness:blog-play-mvp`.
- Date range: `2026-01-05` through `2026-07-02`, with public dates spread across the first half of 2026 plus the current representative pruning note.
- Categories: `일기`, `요즘 관심사`, `AI`, `개발`, `운영 기록`, `정보`.
- Category distribution: the original five categories each have at least `7` posts, and the `정보` lane has `36` date-sensitive posts.
- Date-sensitive information lane: `36` posts live under `정보` for AI plan prices, safe-driving insurance discounts, MacBook price/outlook notes, football checks, World Cup bracket/time/search/watch/round-of-32/ticket/host-city/resale/player-stat checks, and youth savings notes.
- Representative information lane: `6` posts remain submitted under `정보`.
- Standalone Blog lane: `47` posts have no forced `relatedPlay`, so Blog is not subordinate to Play.
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
  - `lottery-scratch-stage-note`
- Password-lock consolidation: `password-lock-build-log` now absorbs eight short noindex notes about candidate chips, history candidate counts, digit heatmaps, guess previews, split meters, smarter candidates, keyboard suggestion cycling, and slot-aware keypad cues into one representative build log tied to `password-lock`.
- Memory-console consolidation: `deploy-pattern-memory-build-log` now absorbs the short noindex notes for replay, input trail, and flow-panel cleanup into one representative build log tied to `deploy-pattern-memory`.
- Meeting-routine consolidation: `meeting-escape-build-log` now absorbs the short noindex notes about small starts, one-rule Play, button response, naming, and routine into one representative build log tied to `meeting-escape`.
- Priority-board consolidation: `priority-sorter-build-log` now absorbs the short noindex notes about static-first operation, delayed login, and server limits into one representative build log tied to `priority-sorter`.
- AI-review consolidation: `ai-review-tap-build-log` now absorbs the short noindex notes about AI outputs as drafts and answer-review habits into one representative build log tied to `ai-review-tap`.
- Prompt-request consolidation: `prompt-cleanup-build-log` now absorbs the short noindex notes about reviewing AI answers and deciding before delegation into one representative build log tied to `prompt-cleanup`.
- Bug-ticket consolidation: `bug-clicker-build-log` now absorbs the short noindex notes about Codex work direction and one-button Play response into one representative build log tied to `bug-clicker`, so the required bug-ticket Play has a direct build-log page instead of relying only on adjacent operations posts.
- Office-survival promotion: `office-survival-workday` moved from a short noindex diary note into a representative production log tied to `office-survival`, with an archive absorption table, four-resource design table, and screen-check checklist for the first Play surface.
- Cross-game feedback consolidation: `game-feedback-before-score-note` now absorbs smaller noindex cue notes for `bug-brick-breaker`, `server-room-flight`, `bug-bubble-shooter`, `deploy-crossing`, `deploy-invaders`, and `prompt-gem-swap`, so those short implementation notes do not need separate submitted pages.
- Lottery-scratch promotion: `lottery-scratch-stage-note` was promoted from archive to representative after being deepened with a table of deliberately excluded mechanics, a screen-check record, and safety wording that keeps `lucky-scratch` as a paper-to-foil-to-slip toy rather than a score, timer, or loss-recovery loop.
- Owner-operations consolidation: `search-console-waiting-diary` now absorbs the short indexing-waiting notes into one representative operations article with a table, today's-check checklist, wait-list checklist, and verification record shape tied to `indexing-waiting-room`.
- Owner category balance: `first-small-web-note` and `why-small-web-toys-return` are now deeper representative posts, so the `일기` and `요즘 관심사` category hubs each have at least two submitted posts instead of looking like one-post hubs.
- Date-sensitive information pruning: `world-cup-search-terms-check-2026-06-27`, `world-cup-player-stats-check-2026-06-27`, `world-cup-round-of-32-korea-time-2026-06-27`, `world-cup-round-of-32-bracket-check-2026-06-27`, `world-cup-round-of-32-check-2026-06-27`, `world-cup-third-place-rules-2026-06-27`, `world-cup-watch-replay-check-2026-06-27`, `world-cup-resale-transfer-check-2026-06-27`, `youth-future-savings-search-questions-2026-06-27`, `youth-future-savings-switch-check-2026-06-27`, `youth-future-savings-vs-youth-leap-check-2026-06-27`, and `youth-future-savings-rate-check-2026-06-27` are now archive/noindex candidates so the submitted set is less dominated by duplicate information wrappers.
- First pillar posts now carry the site-owner evidence surface:
  - `why-bobob-shifted-to-content-lab`
  - `static-micro-games-architecture`
  - `content-indexing-checklist-before-resubmission`
- Homepage evidence surface: `apps/main/src/app/page.tsx` pins those three pillar posts in the `data-pillar-blog` first-read section before ordinary latest Blog cards, so a first visitor can see the direction change, static Play architecture, and content/indexing cleanup criteria without opening the full archive.
- Blog index evidence surface: `apps/main/src/app/blog/page.tsx` now exposes the same three pillar posts in the `data-blog-pillars` first-read section before category cards, so `/blog` starts with the site direction, Play architecture, and content/indexing policy instead of a long chronological archive.
- Trust surface alignment: default and localized About/Contact copy now describe bobob.app as a Blog + Play workshop first, with archived tools as a supporting surface, so visitors do not see a tools-first identity on localized trust routes.
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
  - `small-web-games-retention` was deepened from a short retention argument into an 800+ word Blog + Play operating note with a signal table, explicit choices not built, Play QA hooks, and consolidation criteria for short notes.
  - `search-console-misreads-for-indie-devs` was deepened from a short Search Console warning into an 800+ word observation workflow with a proof/not-proof table, current 77-URL sitemap interpretation, wait-period stop rules, and the next external checks to compare.
  - `cursor-codex-web-service-bottlenecks` was deepened from a short AI-tool bottleneck note into an 800+ word development operations article with route/content/sitemap/workflow boundaries, failure-mode checks, and the final verification bundle.
  - `human-decisions-in-ai-coding` was deepened from a short AI judgment note into an 800+ word product-decision article with a human/AI responsibility table, explicit deferred features, public URL decisions, and indexing-observation wording discipline.
  - `vercel-sitemap-canonical-log` was deepened from a short canonical cleanup note into a near-800 word web-operations article with domain/app/content/external-tool layers, a sitemap-scope table, and a public-surface check bundle.
  - `ai-side-project-realistic-order` was deepened from a short AI side-project note into an 800+ word product-scope article with deferred-feature decisions, completion criteria, and a Blog/Play/search/deploy verification table.
  - `first-small-web-note` was deepened from a smaller diary entry into a 900+ word owner-note article with a public-surface operating-unit table, list-review criteria, and representative/archive separation rules.
  - `why-small-web-toys-return` was deepened from a smaller interest note into a near-900 word Blog + Play article with a small-Play quality table, mobile/result-link checks, and visual-metaphor criteria.
  - `content-indexing-checklist-before-resubmission` was strengthened with a concrete source-surface table, the current 34 representative / 92 archive split, user-visible route checks, and the reminder that source cleanup is not external indexing proof.
  - `lottery-scratch-stage-note` was deepened from a short noindex development note into a 700+ word representative Play-safety build log with an excluded-mechanics table, screen-check record, and verification criteria for keeping lottery-style Play away from scoreboards, timers, cumulative winnings, and loss-recovery prompts.

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
- Current source discovery target after office-survival representative promotion:
  - Sitemap URLs: `75`
  - Feed items: `60`
  - Blog posts: `126`
  - Representative Blog posts: `34`
  - Play entries: `26`
- Latest deployed/Search Console-observed discovery snapshot:
  - Sitemap URLs: `77`
  - Feed items: `62`
  - Representative Blog posts: `36`
- Latest deployed production discovery snapshot after PR #5:
  - Sitemap URLs: `74`
  - Feed items: `59`
  - Representative Blog posts: `33`
- Latest deployed production discovery snapshot after the lottery-scratch representative swap:
  - Sitemap URLs: `74`
  - Feed items: `59`
  - Representative Blog posts: `33`
  - Representative set change: `world-cup-resale-transfer-check-2026-06-27` moved to archive/noindex and `lottery-scratch-stage-note` moved into the submitted representative set.
- Google Search Console:
  - Account: `bobob935@gmail.com`
  - Browser/session guard: use the Chrome profile/session signed in as `bobob935@gmail.com`; do not inspect Search Console from another signed-in Chrome profile.
  - Property: `https://www.bobob.app/`
  - `/sitemaps/en` was checked and submitted again from the signed-in `bobob935@gmail.com` Chrome session after the 77-URL representative deployment.
  - Search Console sitemap resubmission for the latest externally submitted 77-URL sitemap showed `사이트맵이 제출됨`. The visible `/sitemaps/en` row showed status `성공`, submitted `2026. 7. 3.`, last read `2026. 7. 3.`, discovered pages `77`, and videos `0`.
  - The representative sitemap is intentionally reduced and Search Console discovered pages matched the latest externally submitted `77` URL count. This is discovery evidence, not indexing proof. It is also not proof for the new 75-URL source target.
  - Latest performance observation showed total clicks `0`, total impressions `18`, CTR `0%`, and average position `1.1` for the `3개월` range.
  - Latest page indexing report still showed indexed pages `0` and not-indexed pages `5`, with last update `2026-06-12`.
  - URL Inspection now shows `https://www.bobob.app/` as `URL이 Google에 등록되어 있음` and `페이지 색인이 생성됨`.
  - Representative Blog/Play URLs inspected: `https://www.bobob.app/blog`, `https://www.bobob.app/play`, `https://www.bobob.app/blog/ai-side-project-realistic-order`, and `https://www.bobob.app/play/office-survival`.
  - Representative Blog/Play URL status before request: `/blog`, `/play`, and `/play/office-survival` were `크롤링됨 - 현재 색인이 생성되지 않음`; `/blog/ai-side-project-realistic-order` was `발견됨 - 현재 색인이 생성되지 않음`.
  - Representative Blog/Play URL indexing request confirmation: `색인 생성 요청됨`
  - Post-77-URL pillar URL Inspection checked `https://www.bobob.app/blog/why-bobob-shifted-to-content-lab` and `https://www.bobob.app/blog/content-indexing-checklist-before-resubmission`.
  - Both pillar URLs were `URL이 Google에 등록되어 있지 않음` with `페이지 색인이 생성되지 않음: 크롤링됨 - 현재 색인이 생성되지 않음`; both remain tied to `https://www.bobob.app/sitemaps/en`, fetched successfully, and allowed indexing.
  - Both pillar URL indexing request confirmations showed `색인 생성 요청됨` and `URL이 우선순위 크롤링 대기열에 추가되었습니다`.
- IndexNow:
  - Latest submitted URL count: `74`
  - The latest deployed 74-URL representative sitemap set has been submitted to IndexNow with response status `200`.
  - The same 74-URL count now reflects the lottery-scratch representative swap.
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
  - Latest published feed item counts: `59`, `59`.
  - The current 59-item feed set now reflects the lottery-scratch representative swap.
- Discovery registration matrix:
  - `docs/search-discovery-registration.md` tracks Google Search Console, Bing/IndexNow, Naver Search Advisor, feeds, WebSub, robots.txt, OpenSearch, llms.txt, current counts, and the stop rule that discovery submissions are not indexing proof.
- Submitted URL health:
  - `npm run harness:submitted-url-health` verifies every submitted `/sitemaps/en` URL as a final 200 HTML response with matching canonical, one h1, unique title/description, social metadata, and indexable robots metadata.

## Still Not Complete

- Search Console has started showing more impressions (`18`) in the `3개월` performance report, but clicks remain `0`.
- Google URL Inspection proves the homepage itself is indexed.
- Search Console page indexing is still unresolved: indexed pages `0`, not-indexed pages `5`.
- Search Console sitemap discovery matched the previous externally submitted representative sitemap URL count (`77`), but production still serves the last deployed `74` URL target while the source target is now `75`; the 75-URL target still needs deployment, Search Console resubmission, and observation.
- Blog and Play representative URLs are still not indexed after inspection; requests were queued but that is not indexing proof.
- The two new pillar posts have `색인 생성 요청됨` confirmations, but they are still not indexed after the latest inspection.
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
