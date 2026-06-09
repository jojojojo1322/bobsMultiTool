---
name: bobob-product-strategy
description: Use for Bob's Multi Tool monetization, tool priority, AdSense readiness, content strategy, and scope decisions.
---

# Bobob Product Strategy

- Prefer single-domain developer utilities over standalone blogs, communities, or AI wrappers.
- Prioritize 40+ tools with clear search intent, repeat usage, and low server cost.
- Classify tools by monetizationTier: core, growth, or long-tail. Core tools get the strongest SEO guide, FAQ, examples, and related-link coverage first.
- After deployment, review Search Console and AdSense CSV exports with `npm run harness:seo-opportunities` before changing title/description copy for tool and guide pages. Real impressions, CTR, position, RPM, and `titleDescriptionRecommendations` should outrank guesses.
- Treat SEO report `inputWarnings` as a data quality gate; a missing header can make measured opportunities look empty.
- For stakeholder review, generate the Markdown SEO report with `BOBOB_SEO_REPORT_FORMAT=markdown` and keep title/description changes tied to measured rows.
- Treat JSON, Regex, JWT, Base64, Cron, UUID, Hash, Password, QR, DNS, HTTP, Color, SQL, CSS, and JavaScript as search-led acquisition clusters.
- Treat guides as support content for tools, not as a separate generic blog.
- Treat `/tools` and localized tool directories as acquisition hub pages for categories, core tools, and internal search.
- Do not show ad placeholders before approval. Post-approval candidates are below tool output, right reference panel bottom, and mid-guide content only.
- Favor local-only recency/favorites for repeat usage; do not mix these with analytics or personal tracking.
- Exclude community or UGC features unless the user explicitly accepts moderation and policy risk.
- Keep AI features out unless explicitly requested; the current product direction is local-first utilities.
- Default to deterministic developer utilities: formatters, converters, validators, generators, SEO tools, network checks, text cleanup, color/CSS utilities, and time tools.
- When product policy changes, update AGENTS.md and the relevant skill before handoff.
