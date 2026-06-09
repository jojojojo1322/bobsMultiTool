---
name: bobob-adsense-seo
description: Use before changing Bob's Multi Tool AdSense, domain, redirect, sitemap, robots, metadata, schema, privacy, or terms behavior.
---

# Bobob AdSense SEO

- Canonical host is `https://www.bobob.app`.
- `bobob.app` should permanently redirect to `www.bobob.app`.
- Legacy subdomain apps should redirect to the matching `/tools/{slug}` page.
- `/sitemap.xml` must be a sitemap index. Per-locale sitemaps live at `/sitemaps/{locale}` and must include home, tools, guides, privacy, and terms for that locale.
- Sitemap entries must point only to final public URLs expected to return 200.
- English is the default unprefixed URL set. Non-English locales use path prefixes and require canonical plus hreflang alternates.
- Hreflang alternates must include `x-default` pointing to the canonical unprefixed English URL.
- Arabic locale routes must keep RTL layout coverage.
- Locale routing may use NEXT_LOCALE, Accept-Language, and country headers such as x-vercel-ip-country or cf-ipcountry.
- Do not cap localized sitemap coverage in a single static file. Use the sitemap index to expose every supported locale/tool/guide URL.
- Use registry search metadata and content clusters to strengthen tool-led SEO; avoid thin localized pages by improving core tool titles, descriptions, FAQ, and guide intros first.
- Localized metadata must use localized tool and guide content. Do not leave non-English title/description pages backed by raw English registry prose.
- Do not add fabricated review, rating, pricing, or availability schema.
- Keep privacy and terms pages aligned with the actual local-first utility behavior.
- If SEO, AdSense, locale, redirect, schema, or country detection policy changes, update AGENTS.md and this skill before handoff.
