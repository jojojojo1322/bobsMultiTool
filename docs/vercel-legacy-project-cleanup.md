# Vercel Legacy Project Cleanup

The repository now builds and deploys only `apps/main`, but old Vercel projects can still be connected to the same GitHub repository. When they receive the same push, GitHub can show a red commit status even though the canonical app deployed successfully.

## Canonical Project

Keep this project connected:

- `Vercel – bobs-multi-tool-main`

## Legacy Projects To Unlink Or Delete

These project status contexts should no longer be attached to pushes. They were removed from the Vercel team on 2026-06-10; this list remains as the audit target for future commits:

- `Vercel – bobs-multi-tool-cron-generator`
- `Vercel – bobs-multi-tool-lorem-generator`
- `Vercel – bobs-multi-tool-iframe-viewer`
- `Vercel – bobs-multi-tool-regax`
- `Vercel – bobs-multi-tool-meta-generator`

## Verification

Check the latest commit status:

```bash
npm run harness:deployment-status
```

Before external cleanup, this command should pass when the main Vercel project is successful and list the legacy contexts as cleanup work. Older commits can keep historical GitHub status entries even after the projects are deleted.

After the legacy Vercel projects are deleted or disconnected from the GitHub repository, run the strict gate:

```bash
BOBOB_REQUIRE_NO_LEGACY_VERCEL=1 npm run harness:deployment-status
```

The strict gate should pass only when the main deployment succeeds and no legacy Vercel status contexts remain.

## Operational Notes

- Do not restore the legacy app directories to make these old projects build.
- Do not reconnect the old projects to subdomains for AdSense review.
- Public legacy URLs are handled by permanent redirects inside `apps/main`.
- Vercel CLI log inspection needs either `vercel login` or a `VERCEL_TOKEN` with access to the account/team that owns the failed projects.
