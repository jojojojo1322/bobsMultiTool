# Legacy Apps Archive

Bob's Multi Tool now uses `apps/main` as the only public app.

## Removed App Packages

- `apps/regax`
- `apps/cron-generator`
- `apps/meta-generator`
- `apps/iframe-viewer`
- `apps/lorem-generator`
- `packages/ui`
- `turbo.json`

## Preserved Public Entry Paths

Old public paths remain as permanent redirects from `apps/main/next.config.ts`:

- `/regax` -> `/tools/regex-tester`
- `/cron-generator` -> `/tools/cron-generator`
- `/meta-generator` -> `/tools/meta-tag-generator`
- `/iframe-viewer` -> `/tools/iframe-viewer`
- `/lorem-generator` -> `/tools/lorem-ipsum-generator`

## Rationale

- AdSense review should see one canonical product domain instead of separate thin app surfaces.
- SEO authority should consolidate under `https://www.bobob.app/tools/{slug}` and localized variants.
- Shared tool metadata, search, localization, sitemap generation, and smoke tests are easier to enforce from one registry.

## Guardrails

- Root `package.json` workspaces must stay `["apps/main"]`.
- Legacy standalone directories must not be restored unless the product architecture changes.
- Redirects must continue to return permanent redirects to final 200 tool pages.
- `npm run harness:registry`, `npm run harness:routes`, and `npm run harness:agents` must fail if legacy app surfaces are reintroduced.
