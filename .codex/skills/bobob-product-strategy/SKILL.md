---
name: bobob-product-strategy
description: Use for Bob's Multi Tool monetization, tool priority, AdSense readiness, content strategy, and scope decisions.
---

# Bobob Product Strategy

- Prefer single-domain developer utilities over standalone blogs, communities, or AI wrappers.
- Prioritize 40+ tools with clear search intent, repeat usage, and low server cost.
- Classify tools by monetizationTier: core, growth, or long-tail. Core tools get the strongest SEO guide, FAQ, examples, and related-link coverage first.
- Use a 70/30 split for roadmap work: improve core tool detail quality first, then add new feature breadth. Core pages should expose registry-backed `inputExamples`, `useCases`, `failureCases`, `preCopyChecklist`, and related next actions so search visitors have reasons to stay, review, and continue. Core acquisition tools should have at least three real `inputExamples`, three priority `failureCases`, and three priority `preCopyChecklist` items before adding thin feature breadth.
- Put the working tool surface first in the center flow, then use quick-start examples, use cases, localized failure cases, pre-copy checklist, and related next actions below it so users can complete the input/output loop before reading support material.
- For mobile retention, keep the page task-first: input/output first, compact review/examples/FAQ after the tool surface, and next-tool movement in the sticky mobile action bar. Do not add fake copy/download buttons until the underlying tool surface exposes a real shared action.
- Feature additions should stay inside high-demand clusters. `json-escape-unescape`, `yaml-validator`, and `env-parser-validator` are approved data/config-cluster breadth additions; Regex Generator from examples, HTTP Header Parser, CSP Generator, CSV Cleaner, Markdown Table Generator, and Docker Compose Validator/Formatter are currently implemented inside their parent Regex/HTTP/CSV/Markdown/YAML tools to avoid thin pages. Next candidates should be deeper redirect/security-header checks and config validators that strengthen existing acquisition paths.
- After deployment, review Search Console and AdSense CSV exports with `npm run harness:seo-opportunities` before changing title/description copy for tool and guide pages. Real impressions, CTR, position, RPM, and `titleDescriptionRecommendations` should outrank guesses.
- Prefer default local measured exports at `reports/search-console.csv`, `reports/search-console.tsv`, `reports/adsense.csv`, and `reports/adsense.tsv` for quick review; use env vars only when the files live elsewhere.
- Use `measurementBacklog` and `measuredExportPlan` to decide which core pages need measured export coverage first. Use `measuredExportPlan.copyTargets` for Search Console page regex, canonical URL batches, and focused measured gate paths, but do not treat any backlog/export-plan field as evidence for title/description rewrites.
- Treat `metadataRewriteReadiness.canRewritePublicMetadata` as the stop/go signal for public title and description edits. If it is false, the next product task is measured data collection, not copy rewriting.
- Treat SEO report `inputWarnings` as a data quality gate; a missing header can make measured opportunities look empty.
- Run `npm run harness:seo-measured` before treating Search Console/AdSense-driven title or description work as complete. The gate uses `BOBOB_REQUIRE_MEASURED_SEO=1` and should fail when core measured coverage is missing.
- Use `BOBOB_REQUIRED_MEASURED_PATHS` only for targeted opportunity review, not for the final core-page monetization readiness claim.
- Keep `npm run harness:seo-opportunities:smoke` green so the measured SEO workflow is tested without real private exports.
- Before private measured exports exist, generate the collection handoff with `npm run seo:export-packet`; use it to copy Search Console page regex, canonical URLs, CSV headers, and focused gate paths, not to rewrite public metadata.
- For stakeholder review, generate the Markdown SEO report with `npm run seo:report` and keep title/description changes tied to measured rows.
- Use `reports/README.md` and `reports/templates/*.example.csv` as the safe handoff for Search Console and AdSense export collection; keep `npm run harness:seo-templates` green when export handling changes.
- Treat JSON, Regex, JWT, Base64, Cron, UUID, Hash, Password, QR, DNS, HTTP, Color, SQL, CSS, and JavaScript as search-led acquisition clusters.
- Formatter acquisition pages should earn repeat use through diagnostics, not only pretty output. SQL should expose query type, table references, clause checks, and copy-risk warnings before adding separate database tools.
- Increase session depth before adding thin tools: search results should expose match-signal chips that explain the result, and search results, central tool output, and the right reference panel should all expose related next-action links that lead to a second tool.
- Related next-action links should preserve the registry `relatedTools` order and include localized use-case context so users understand why the next tool is useful.
- Use workflow recipes for task-shaped search queries and repeat usage before creating new pages. Recipes must stay local-first, reuse registered tools, and connect clear multi-tool paths such as API response formatting, API token debugging, redirect debugging, DNS deployment checks, Wi-Fi QR creation, secure token generation, security-header review, deploy config validation, and CSV cleanup for API payloads.
- Workflow recipes should appear on the tool directory, matching search results, and connected tool detail pages so a visitor can move from one utility to a second or third utility without reading a generic article first.
- Task-shaped search should rank workflow recipes by exact localized title and search-intent matches before weaker step-tool matches, so a visitor looking for CSP, Docker Compose, or CSV cleanup sees that specific path before adjacent recipes.
- When a core tool gains a feature-specific search surface, update the registry and workflow layer together. Regex snippets, Base64 image/data URL preview, and JSONPath field extraction should carry keywords, aliases, use cases, input examples, task-shaped recipes when appropriate, and search/SEO harness coverage.
- Acquisition-cluster and first-step related tools should have Korean, Japanese, Spanish, and German priority intent copy so high-traffic session paths avoid generic fallback prose.
- Core acquisition tool detail pages in Korean, Japanese, Spanish, and German should have localized priority failure cases and pre-copy checklist items so review-strip copy is specific enough to increase trust and session depth.
- Use `/tools` and localized tool directories as session-depth hubs: acquisition workflow clusters should connect high-demand tools into second and third tool paths using localized registry copy.
- Treat guides as support content for tools, not as a separate generic blog.
- Treat `/tools` and localized tool directories as acquisition hub pages for categories, core tools, and internal search.
- Do not show ad placeholders before approval. Real opt-in ad units may reserve space only with valid publisher and slot ids, and post-approval candidates are below the primary tool output, right reference panel bottom, and mid-guide content only.
- Do not show AdSense, approval, monetization, or demand-tier wording to users. Keep revenue strategy in AGENTS, skills, reports, and harnesses, while public copy talks only about free utilities, privacy, local processing, and third-party services where legally needed.
- Favor local-only recency/favorites for repeat usage; do not mix these with analytics or personal tracking.
- Exclude community or UGC features unless the user explicitly accepts moderation and policy risk.
- Keep AI features out unless explicitly requested; the current product direction is local-first utilities.
- Default to deterministic developer utilities: formatters, converters, validators, generators, SEO tools, network checks, text cleanup, color/CSS utilities, and time tools.
- When product policy changes, update AGENTS.md and the relevant skill before handoff.
- Use the efficient slice loop for product work: Audit -> One Slice -> Harness -> Browser Check -> Stop.
