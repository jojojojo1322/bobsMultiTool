# bobob.app Search Indexing Observation Log

This file records manual external checks for the Blog + Play migration. Keep private CSV exports out of git; use this only for high-level observed states that help decide the next crawl/indexing step.

## 2026-06-25

- Checked with the `bobob935` Google account on the Search Console URL-prefix property `https://www.bobob.app/`.
- Browser/session guard: use the Chrome profile/session signed in as `bobob935@gmail.com`; do not use another signed-in Chrome profile for Search Console.
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
- IndexNow submission:
  - Command: `NODE_TLS_REJECT_UNAUTHORIZED=0 npm run indexnow:submit`
  - Endpoint: `https://api.indexnow.org/indexnow`
  - Host: `www.bobob.app`
  - Key location: `https://www.bobob.app/ac3d32921a2fa361bd499222bff28abf.txt`
  - Submitted URL count: `44`
  - Response status: `200`
- Post-quality-update resubmission:
  - Google Search Console account: `bobob935@gmail.com`
  - Search Console action: submitted `sitemaps/en` again from the `https://www.bobob.app/` property after the Blog + Play quality/WebSub deployment
  - Search Console confirmation: `사이트맵이 제출됨`
  - IndexNow command: `NODE_TLS_REJECT_UNAUTHORIZED=0 npm run indexnow:submit`
  - IndexNow submitted URL count: `44`
  - IndexNow response status: `200`
  - WebSub command: `NODE_TLS_REJECT_UNAUTHORIZED=0 npm run websub:submit`
  - WebSub hub: `https://pubsubhubbub.appspot.com/`
  - WebSub topics: `https://www.bobob.app/feed.xml`, `https://www.bobob.app/atom.xml`
  - WebSub response statuses: `204`, `204`
- Post-discovery-wording resubmission:
  - Commit: `186d7af`
  - Change: root metadata, WebSite structured data, RSS/Atom/JSON Feed title and description now use the `일단 해보는 Blog and Play` direction instead of the old `Blog and Play Lab` wording.
  - Deployment check: `npm run harness:deployment-status` returned `overallState: success` for `186d7afcb0792f670869f17fba7019d2d5e72ba5`.
  - Live discovery check: `NODE_TLS_REJECT_UNAUTHORIZED=0 npm run harness:live-discovery` passed with sitemap URLs `44`, feed items `34`, Blog posts `28`, Play entries `6`.
  - IndexNow command: `NODE_TLS_REJECT_UNAUTHORIZED=0 npm run indexnow:submit`
  - IndexNow submitted URL count: `44`
  - IndexNow response status: `200`
  - WebSub command: `NODE_TLS_REJECT_UNAUTHORIZED=0 npm run websub:submit`
  - WebSub topics: `https://www.bobob.app/feed.xml`, `https://www.bobob.app/atom.xml`
  - WebSub response statuses: `204`, `204`
- Post-share-image resubmission:
  - Commit: `a80215a`
  - Change: Blog + Play home, index, category, detail pages now expose `og:image`, `og:image:width`, `og:image:height`, and `twitter:image` metadata using the shared `/og-image` PNG route.
  - Deployment check: `npm run harness:deployment-status` returned `overallState: success` for `a80215ac11d980a3d4e21fc1d1f6675c01ab6152`.
  - Live discovery check: `NODE_TLS_REJECT_UNAUTHORIZED=0 npm run harness:live-discovery` passed with sitemap URLs `44`, feed items `34`, Blog posts `28`, Play entries `6`.
  - IndexNow command: `NODE_TLS_REJECT_UNAUTHORIZED=0 npm run indexnow:submit`
  - IndexNow submitted URL count: `44`
  - IndexNow response status: `200`
  - WebSub command: `NODE_TLS_REJECT_UNAUTHORIZED=0 npm run websub:submit`
  - WebSub topics: `https://www.bobob.app/feed.xml`, `https://www.bobob.app/atom.xml`
  - WebSub response statuses: `204`, `204`
- Post-standalone-blog expansion resubmission:
  - Commit: `d3be3c8`
  - Change: added eight standalone Blog posts across `일기`, `요즘 관심사`, `AI`, `개발`, and `운영 기록`; Blog now has `36` posts, `12` standalone posts, and visible dates from `2026-01-28` to `2026-06-24`.
  - Deployment check: `BOBOB_DEPLOY_SHA=d3be3c8 npm run harness:deployment-status` returned `overallState: success`.
  - Live discovery check: `NODE_TLS_REJECT_UNAUTHORIZED=0 npm run harness:live-discovery` passed with sitemap URLs `52`, feed items `42`, Blog posts `36`, Play entries `6`.
  - Live spot check: `/blog/boring-maintenance-is-content-too`, `/blog/ai-coding-needs-human-last-check`, `/blog/first-small-web-note`, and `/blog/category/ai` returned `200`.
  - Google Search Console account: `bobob935@gmail.com`
  - Search Console action: submitted `/sitemaps/en` again from the `https://www.bobob.app/` URL-prefix property after the standalone Blog expansion deployment.
  - Search Console confirmation: `사이트맵이 제출됨`
  - Search Console sitemap row after submission: `/sitemaps/en`, status `성공`, discovered pages `52`.
  - Representative URL inspection: `https://www.bobob.app/blog/boring-maintenance-is-content-too`
  - Representative URL status before request: `URL이 Google에 등록되어 있지 않음`; page indexing reason `발견됨 - 현재 색인이 생성되지 않음`; sitemap `https://www.bobob.app/sitemaps/en`.
  - Representative URL indexing request confirmation: `색인 생성 요청됨`
  - IndexNow command: `NODE_TLS_REJECT_UNAUTHORIZED=0 npm run indexnow:submit`
  - IndexNow submitted URL count: `52`
  - IndexNow response status: `200`
  - WebSub command: `NODE_TLS_REJECT_UNAUTHORIZED=0 npm run websub:submit`
  - WebSub topics: `https://www.bobob.app/feed.xml`, `https://www.bobob.app/atom.xml`
  - WebSub feed item counts: `42`, `42`
  - WebSub response statuses: `204`, `204`
- Post-AI-review Play expansion registration:
  - Change: added `ai-review-tap`, a short tap-game for checking risky AI-answer signals; Play now has `7` entries while Blog remains `36` posts.
  - Live discovery check: `NODE_TLS_REJECT_UNAUTHORIZED=0 npm run harness:live-discovery` passed with sitemap URLs `53`, feed items `43`, Blog posts `36`, Play entries `7`.
  - Google Search Console account: `bobob935@gmail.com`
  - Search Console action: submitted `/sitemaps/en` again from the `https://www.bobob.app/` URL-prefix property after the AI-review Play expansion deployment.
  - Search Console confirmation: `사이트맵이 제출됨`
  - Search Console sitemap row after resubmission: `/sitemaps/en`, status `성공`, discovered pages `53`.
  - IndexNow command: `NODE_TLS_REJECT_UNAUTHORIZED=0 npm run indexnow:submit`
  - IndexNow submitted URL count: `53`
  - IndexNow response status: `200`
  - WebSub command: `NODE_TLS_REJECT_UNAUTHORIZED=0 npm run websub:submit`
  - WebSub topics: `https://www.bobob.app/feed.xml`, `https://www.bobob.app/atom.xml`
  - WebSub feed item counts: `43`, `43`
  - WebSub response statuses: `204`, `204`
- Public search spot check:
  - A public search result for `site:www.bobob.app bobob.app` surfaced the homepage, but Search Console has not yet reflected indexed URL counts for the new Blog + Play set.

Decision:

- Do not broaden sitemap scope yet.
- Keep `/sitemaps/en` as the submitted canonical Blog + Play sitemap.
- Continue with a 1-2 week Search Console observation window before treating indexing as solved.
- Next check should compare indexed count, not-indexed count, sitemap discovered page count, and 3-month impressions against this baseline.

Next observation windows:

- Automation:
  - Codex heartbeat automation id: `bobob-indexing-observation`
  - Schedule: starts `2026-07-02 10:00`, weekly, `2` runs.
  - Purpose: continue this thread and record concrete Search Console/Bing changes instead of treating discovery submissions as indexing proof.
- `2026-07-02`:
  - Use the `bobob935` Google account.
  - Use the Chrome profile/session signed in as `bobob935@gmail.com`; do not inspect Search Console from another signed-in Chrome profile.
  - Search Console property: `https://www.bobob.app/`.
  - Compare total clicks, total impressions, indexed pages, not-indexed pages, and `/sitemaps/en` discovered pages against the `2026-06-25` baseline, the later same-day `52` discovered-page sitemap resubmission, and the current `53` discovered-page sitemap resubmission.
  - Confirm whether the old reason rows `리디렉션이 포함된 페이지` and `적절한 표준 태그가 포함된 대체 페이지` moved, disappeared, or gained new sample URLs.
  - Inspect representative URLs: `https://www.bobob.app/`, `https://www.bobob.app/blog`, `https://www.bobob.app/play`, `https://www.bobob.app/blog/ai-side-project-realistic-order`, and `https://www.bobob.app/play/office-survival`.
- `2026-07-09`:
  - Use the Chrome profile/session signed in as `bobob935@gmail.com`; do not inspect Search Console from another signed-in Chrome profile.
  - Repeat the same Search Console comparison.
  - If indexed pages still remain `0`, do not broaden sitemap scope yet. First check live URL inspection, canonical selection, crawl allowed status, and Bing Webmaster recommendations for missing `h1`, duplicate title/description, insufficient content, or weak inbound-link signals.
  - If impressions appear, generate measured exports under the gitignored `reports/search-console.csv` or `reports/search-console.tsv` path and run `npm run harness:seo-opportunities`.

Completion guard:

- This Blog + Play migration should not be treated as indexed or search-ready only because deployment, sitemap fetch, live discovery, or IndexNow submission passed.
- WebSub publish and repeated Search Console sitemap submission are discovery hints, not indexing proof.
- The next Search Console check must record concrete changed numbers before closing the indexing part of the goal.
