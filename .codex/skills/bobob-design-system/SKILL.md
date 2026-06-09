---
name: bobob-design-system
description: Use before changing Bob's Multi Tool UI, shadcn-style components, layout, navigation, colors, spacing, or responsive behavior.
---

# Bobob Design System

- Use shadcn/ui-style local primitives from `apps/main/src/components/ui`.
- Keep the product-lab tone: neutral zinc palette, compact panels, crisp borders, modest radius, no raised colored top borders, and no decorative accent strips.
- Avoid oversized heroes, gradient-heavy sections, emoji tool cards, bento marketing layouts, nested cards, explanatory UI copy, and AI-generated-looking card accents.
- Tool pages use the same frame: left navigation, top context bar, central tool panel, right examples/FAQ/guides/related tools.
- Desktop tool pages require real resizable left and right sidebars with localStorage persistence: left 280px default / 220px min, right 340px default / 280px min, center 560px min.
- Desktop tool pages must use one aligned workbench shell around the resizable panels. Do not wrap left, center, and right panels in separate outer rounded bordered cards.
- Resize handles use a transparent hit area with one neutral divider line; avoid extra border columns that visually protrude.
- Detail top bars must include a locale-aware brand/home link so users can return to the main screen without opening side navigation.
- Tool navigation clicks must preserve sidebar scroll position across tool detail navigation. Use non-scrolling tool links and restore the navigation scroll container from localStorage.
- Demand tier is not a user-facing label. Do not show demand wording or raw `core` / `growth` / `long-tail` badges in cards, search results, or detail headers.
- Mobile must keep Sheet navigation and single-column content instead of draggable panels.
- Use lucide icons for actions where an icon exists.
- Light/Dark/System is required product behavior. Use next-themes, ThemeProvider, ThemeToggle, and class-based `.dark` variables.
- Theme changes must be verified with `npm run harness:theme`.
- Layout changes must be verified with `npm run harness:layout`.
- If UI policy changes, update AGENTS.md and this skill in the same change.
