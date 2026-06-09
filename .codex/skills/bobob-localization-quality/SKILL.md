---
name: bobob-localization-quality
description: Use before changing Bob's Multi Tool visible prose, locale dictionaries, localized metadata, guide copy, tool examples, FAQ, or multilingual SEO coverage.
---

# Bobob Localization Quality

- English is the source locale and stays unprefixed.
- Non-English pages must render localized visible prose through `getLocalizedTool`, `getLocalizedGuide`, `getLocalizedTools`, `getLocalizedGuides`, and `searchLocalizedTools`; they must not expose raw English registry prose.
- Tool names, slugs, JSON/JWT/UUID/CSS/SQL/Base64, and code sample values may remain technical terms. Sentence copy, descriptions, examples, FAQ, guide sections, search result descriptions, and metadata descriptions must be localized.
- Guide detail metadata must use the same localized `guide.description` shown on the page, not a generic guide-title template.
- Tool and guide detail pages must set page-specific OpenGraph and Twitter title/description values instead of inheriting the root default social metadata.
- Locale privacy and terms pages must use `getLocalizedLegalContent`; localized routes must not hardcode English policy prose, "Back to tools", "Privacy Policy", or "Terms of Service" text.
- Core acquisition tools in Korean, Japanese, Spanish, and German should have slug-specific descriptions, SEO descriptions, use cases, FAQ, and guide intro copy rather than only generic templates.
- Long-tail acquisition locales (`zh-CN`, `zh-TW`, `pt-BR`, `fr`, `hi`, `id`, `vi`, `th`, `ar`) need slug-specific visible descriptions for representative high-traffic tools such as JSON Formatter, Regex Tester, JWT Decoder, Base64, Cron, UUID, Hash, Password, DNS, HTTP Status, Markdown Previewer, CSS Unit Converter, and CSS Clamp Generator.
- Long-tail guide descriptions should also be slug-specific for high-traffic workflows such as Regex, Cron, SEO meta tags, Hash, JSON/YAML/CSV, Network, CSS, Web SEO, and Text cleanup.
- Tool components must use dictionary-backed labels for common controls such as input, mode, count, generate, copy-ready output, JSON input, indent, common input, typical output, lookup/check buttons, network result titles, MIME labels, and empty-output placeholders.
- Locale-specific dictionary overrides must not re-spread English nested objects over common localized text. The merge order should preserve locale common text before applying only true per-locale overrides.
- Arabic routes must keep `dir="rtl"` and visual QA coverage.
- Locale routes must set the root `<html lang>` and `<html dir>` through the middleware locale handoff. A localized `<main>` alone is not enough for multilingual SEO or accessibility.
- When visible prose, metadata copy, tool registry copy, guide copy, or locale policy changes, update AGENTS.md, this skill, and the localization harness.
- Run `npm run harness:localization`, `npm run harness:i18n`, and browser or visual harness checks for `/ko`, `/ja`, `/de`, `/es`, `/hi`, `/th`, and `/ar`.
