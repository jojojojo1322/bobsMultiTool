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
npm run harness:agents
```

Then run implementation checks:

```bash
npm install
npm run lint
npm run build
```

For a running local server, run:

```bash
BOBOB_BASE_URL=http://localhost:3000 npm run harness:routes
```

Before handoff, inspect desktop and mobile layouts for the home page and at least three representative tools.

Include:

- Light/Dark/System theme toggle behavior.
- Default English and at least two localized routes.
- Localized visible prose for home, tool detail, sidebar search results, examples, FAQ, guide sections, and metadata.
- Arabic RTL route and visible prose.
- Home and workbench shared search behavior.
- Desktop left and right sidebar resizing, single-shell panel alignment, top brand/home link, plus mobile Sheet fallback.
- A local-only tool and a server route tool.
- The agent-skills-sync gate whenever feature, policy, SEO, theme, or i18n rules changed.
