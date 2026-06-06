---
name: bobob-localization-quality
description: Use before changing Bob's Multi Tool visible prose, locale dictionaries, localized metadata, guide copy, tool examples, FAQ, or multilingual SEO coverage.
---

# Bobob Localization Quality

- English is the source locale and stays unprefixed.
- Non-English pages must render localized visible prose through `getLocalizedTool`, `getLocalizedGuide`, `getLocalizedTools`, `getLocalizedGuides`, and `searchLocalizedTools`; they must not expose raw English registry prose.
- Tool names, slugs, JSON/JWT/UUID/CSS/SQL/Base64, and code sample values may remain technical terms. Sentence copy, descriptions, examples, FAQ, guide sections, search result descriptions, and metadata descriptions must be localized.
- Tool components must use dictionary-backed labels for common controls such as input, mode, count, generate, copy-ready output, JSON input, indent, common input, and typical output.
- Arabic routes must keep `dir="rtl"` and visual QA coverage.
- When visible prose, metadata copy, tool registry copy, guide copy, or locale policy changes, update AGENTS.md, this skill, and the localization harness.
- Run `npm run harness:localization`, `npm run harness:i18n`, and browser checks for `/ko`, `/ja`, `/de`, `/es`, and `/ar`.
