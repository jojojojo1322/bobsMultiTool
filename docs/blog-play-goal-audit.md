# bobob.app Blog + Play Goal Audit

This audit tracks the active first-pass goal. It is not a completion certificate. The goal stays open until the external indexing observation window produces concrete Search Console/Bing evidence.

## Current Product State

- Public direction: bobob.app is now a Blog + Play workshop for development, AI, side-project, and web-operations writing plus lightweight web play.
- Tools position: existing developer tools remain available under `/tools`, but they are no longer the main homepage direction.
- No support monetization: the first pass does not expose donation, coffee, paid-pack, login, ranking, comments, or game-ad UI.

## Blog Evidence

- Blog source: `content/blog/*.mdx`
- Current count: `36` Blog posts.
- Date range: `2026-01-28` through `2026-06-24`, so the archive reads as a gradual few-month publishing trail.
- Categories: `일기`, `요즘 관심사`, `AI`, `개발`, `운영 기록`.
- Category distribution: each category has at least `7` posts.
- Standalone Blog lane: `10` posts have no forced `relatedPlay`, so Blog is not subordinate to Play.
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
- Current count: `7` Play entries.
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
- Play pages link to related Blog and related Play entries through result links.
- Blog posts that declare `relatedPlay` must point to existing Play entries, and those Play entries must link back.

## Discovery And Submission Evidence

- Live canonical host: `https://www.bobob.app`
- Reduced submitted sitemap route: `/sitemaps/en`
- Current live discovery snapshot:
  - Sitemap URLs: `53`
  - Feed items: `43`
  - Blog posts: `36`
  - Play entries: `7`
- Google Search Console:
  - Account: `bobob935@gmail.com`
  - Browser/session guard: use the Chrome profile/session signed in as `bobob935@gmail.com`; do not inspect Search Console from another signed-in Chrome profile.
  - Property: `https://www.bobob.app/`
  - `/sitemaps/en` resubmitted after the AI-review Play expansion.
  - Search Console sitemap row after resubmission showed status `성공` and discovered pages `53`.
  - Representative URL inspected: `https://www.bobob.app/blog/boring-maintenance-is-content-too`
  - Representative URL status before request: `발견됨 - 현재 색인이 생성되지 않음`
  - Representative URL indexing request confirmation: `색인 생성 요청됨`
- IndexNow:
  - Latest submitted URL count: `53`
  - Latest response status: `200`
- WebSub:
  - Feed topics submitted: `https://www.bobob.app/feed.xml`, `https://www.bobob.app/atom.xml`
  - Latest response statuses: `204`, `204`
- Discovery registration matrix:
  - `docs/search-discovery-registration.md` tracks Google Search Console, Bing/IndexNow, feeds, WebSub, robots.txt, OpenSearch, llms.txt, current counts, and the stop rule that discovery submissions are not indexing proof.
- Submitted URL health:
  - `npm run harness:submitted-url-health` verifies every submitted `/sitemaps/en` URL as a final 200 HTML response with matching canonical, one h1, unique title/description, social metadata, and indexable robots metadata.

## Still Not Complete

- Search Console page indexing report still needs a later refresh after the same-day `/sitemaps/en` `53` discovered-page resubmission.
- The baseline still records indexed pages `0`, not-indexed pages `5`, clicks `0`, and impressions `0`.
- Bing Webmaster recommendation classes still need a follow-up pass after deployment and submission propagation.
- Discovery submissions are hints only. They do not prove that Google or Bing indexed the new Blog + Play pages.

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

## Completion Rule

Do not mark the active goal complete from local code, deployment status, sitemap fetches, WebSub `204`, IndexNow `200`, or Search Console submission success alone. Completion requires concrete post-submission Search Console/Bing observation evidence recorded in `docs/search-indexing-observation-log.md`.
