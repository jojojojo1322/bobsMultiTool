---
name: bobob-verification
description: Use before handing off Bob's Multi Tool changes, especially route, registry, sitemap, build, lint, and UI verification.
---

# Bobob Verification

Run the narrow checks first:

```bash
npm run harness:registry
npm run harness:tools
npm run harness:i18n
npm run harness:localization
npm run harness:theme
npm run harness:search
npm run harness:layout
npm run harness:visual
npm run harness:agents
npm run harness:seo-opportunities
```

Then run implementation checks:

```bash
npm install
npm run lint
npm run build
```

For deployment-sensitive changes, also verify a clean install/build path rather than relying on local caches:

```bash
npm ci
npm run build
```

Do not reintroduce `next/font/google` or build-time external font fetches. The build must not depend on Google Fonts network access.

For a running local server, run:

```bash
BOBOB_BASE_URL=http://localhost:3000 npm run harness:routes
BOBOB_BASE_URL=http://localhost:3000 npm run harness:visual
```

Before handoff, inspect desktop and mobile layouts for the home page and at least three representative tools.

Include:

- Light/Dark/System theme toggle behavior.
- Default English and at least two localized routes.
- Root `<html lang>` and `<html dir>` must match the active locale; route-level `main` attributes alone are insufficient.
- Localized visible prose for home, tool detail, sidebar search results, examples, FAQ, guide sections, and metadata.
- Guide detail meta description and OpenGraph description must match the localized `guide.description`, not a generic title-based template.
- Tool and guide detail pages must expose page-specific OpenGraph and Twitter title/description values, not root default social metadata.
- Localized privacy and terms prose plus metadata through `getLocalizedLegalContent`.
- Arabic RTL route and visible prose.
- Sitemap index at `/sitemap.xml`, per-locale sitemaps at `/sitemaps/en`, `/sitemaps/ko`, `/sitemaps/ar`, and full locale URL coverage without the old 200 URL static cap.
- Home, `/tools`, localized tool directories, and workbench shared search behavior, including `?q=` URL state and SearchAction schema alignment.
- Search Console/AdSense opportunity report behavior. Without CSV inputs it should keep registry metadata warnings at zero when metadata is healthy; with CSV inputs it should report high-impression low-CTR tool and guide pages, low-RPM pages, and `titleDescriptionRecommendations`.
- SEO report `inputWarnings` should flag missing required or recommended Search Console/AdSense CSV headers so empty measured results are not silently trusted.
- Markdown SEO report behavior with `BOBOB_SEO_REPORT_FORMAT=markdown` should produce a reviewable title/description recommendations table when CSV inputs are present.
- Desktop left and right sidebar resizing, single-shell panel alignment, clamped panel widths with no horizontal overflow at narrow desktop widths, top brand/home link, preserved sidebar scroll when clicking tool navigation, plus mobile Sheet fallback.
- No visible demand wording or raw `core` / `growth` / `long-tail` demand badges in home cards, search results, or tool detail headers.
- A local-only tool and a server route tool.
- Server route tools reject private/reserved hosts, validate redirect targets, and rate-limit repeated requests.
- No unused ad placeholder components or fake publisher IDs remain in the public app.
- No standalone legacy app directories, `packages/ui`, `turbo.json`, or `turbo` dependency remain. Old public entry paths should be verified as permanent redirects to `/tools/{slug}`, with rationale recorded in `docs/legacy-apps-archive.md`.
- Clean build behavior with no build-time external font downloads.
- The agent-skills-sync gate whenever feature, policy, SEO, theme, or i18n rules changed.
