# Coolify Deployment

Each app in this monorepo is deployed as a separate service on Coolify. This guide covers how to set up and configure each deployment.

## Prerequisites

- A running [Coolify](https://coolify.io/) instance
- This monorepo pushed to a Git remote (GitHub, Gitea, etc.)
- A domain or subdomain per app

## Architecture

```
Git push
  └─> GitHub webhook fires
        └─> Coolify receives push event
              └─> Each resource checks its watch paths against the commit diff
                    ├─> cant-maintain     ← only if apps/cant-maintain/** or packages/shared/** changed
                    ├─> cant-resize       ← only if apps/cant-resize/** changed
                    ├─> cant-type         ← only if apps/cant-type/** changed
                    ├─> cant-orchestrate  ← only if apps/cant-orchestrate/** changed
                    └─> cant-seo          ← only if apps/cant-seo/** changed
```

Each app is a separate Coolify resource pointing to the same repository. A single GitHub webhook triggers all five resources, but each resource only rebuilds when its watched files actually changed.

## What is already in place

The following files are already committed and ready to use:

- `output: "standalone"` is set in every app's `next.config.mjs`
- Each app has its own `Dockerfile` at `apps/<app-name>/Dockerfile`
- A `.dockerignore` exists at the repo root

You only need to configure Coolify (Steps 1 and 2 below).

## Step 1: Configure Coolify resources

For each app, create a new resource in Coolify:

1. **Type:** Docker (Dockerfile)
2. **Repository:** Point to this monorepo
3. **Branch:** `main`
4. **Dockerfile location:** `apps/<app-name>/Dockerfile` (see table below)
5. **Build context:** `/` (repo root, so COPY commands work with the monorepo structure)
6. **Port:** 3000

### Per-app settings

| App | Dockerfile location | Domain |
|-----|---------------------|--------|
| cant-maintain | `apps/cant-maintain/Dockerfile` | cant-maintain.saschb2b.com |
| cant-resize | `apps/cant-resize/Dockerfile` | cant-resize.saschb2b.com |
| cant-type | `apps/cant-type/Dockerfile` | cant-type.saschb2b.com |
| cant-orchestrate | `apps/cant-orchestrate/Dockerfile` | cant-orchestrate.saschb2b.com |
| cant-seo | `apps/cant-seo/Dockerfile` | cant-seo.saschb2b.com |

Enable HTTPS via Coolify's built-in Let's Encrypt integration.

### Environment variables

No environment variables are required. Analytics is handled client-side via the Umami script tag in each app's `layout.tsx`.

## Step 2: Webhook and selective rebuilds

A monorepo with one webhook and five Coolify resources will, by default, rebuild all five apps on every push. This is wasteful. Coolify's "Watch Paths" feature solves this by only triggering a rebuild when the commit touches files that matter to that specific app.

### 2a: Set up the GitHub webhook (once)

1. In Coolify, go to any one of the five resources and copy its **webhook URL** (Settings > Webhooks). All resources on the same repository share the same webhook endpoint.
2. In GitHub, go to **Settings > Webhooks > Add webhook**.
3. Paste the Coolify webhook URL.
4. Content type: `application/json`.
5. Events: select "Just the push event".
6. Save.

One webhook is enough. Coolify routes the push event to all resources that point to the same repository.

### 2b: Configure watch paths per resource

In each Coolify resource, go to **Settings** and set the **Watch Paths** field. This tells Coolify to compare the incoming commit's changed files against these patterns. If nothing matches, the rebuild is skipped.

| App | Watch paths |
|-----|------------|
| cant-maintain | `apps/cant-maintain/**`, `packages/shared/**`, `pnpm-lock.yaml` |
| cant-resize | `apps/cant-resize/**`, `packages/shared/**`, `pnpm-lock.yaml` |
| cant-type | `apps/cant-type/**`, `packages/shared/**`, `pnpm-lock.yaml` |
| cant-orchestrate | `apps/cant-orchestrate/**`, `packages/shared/**`, `pnpm-lock.yaml` |
| cant-seo | `apps/cant-seo/**`, `packages/shared/**`, `pnpm-lock.yaml` |

### How it works in practice

- Commit only touches `apps/cant-seo/components/inspector/...` -> only cant-seo rebuilds.
- Commit touches `packages/shared/src/lib/cant-apps.ts` -> all five apps rebuild (shared code changed).
- Commit touches `apps/cant-type/...` and `apps/cant-resize/...` -> only those two rebuild.
- Commit only touches `docs/`, `CLAUDE.md`, or `.github/` -> nothing rebuilds.

### Verifying the setup

After pushing a commit that only changes one app, check the Coolify dashboard. You should see:
- One resource shows "Building" or "Deployed"
- The other four show no new activity

If all five rebuild on every push, double-check that Watch Paths are configured (not left empty). An empty Watch Paths field means "rebuild on any change".

## Adding a new app

When a new app is added to the monorepo:

1. Add `output: "standalone"` to its `next.config.mjs`
2. Create a `Dockerfile` by copying an existing one and replacing the app name
3. Create a new Coolify resource with the settings from Step 1
4. Set watch paths: `apps/<new-app>/**`, `packages/shared/**`, `pnpm-lock.yaml`

No new webhook is needed. The existing GitHub webhook already covers all resources on the same repository.

## Troubleshooting

### All apps rebuild on every push

Watch Paths are either empty or misconfigured. In Coolify, open each resource's settings and verify the paths are set. An empty field means "always rebuild".

### Build fails with "Module not found: @cant/shared"

Make sure the Dockerfile copies the full monorepo context and that `pnpm install` runs at the root level. The workspace protocol (`workspace:*`) requires all package.json files to be present.

### Standalone output missing files

Verify that `output: "standalone"` is set in `next.config.mjs`. Without it, the `.next/standalone` directory won't be created and the final Docker stage will fail.

### Port conflicts

Each Coolify service runs in its own container, so all can use port 3000 internally. Coolify's reverse proxy handles routing by domain.

### Large Docker images

The multi-stage Dockerfile keeps the final image small (~150-200MB). If images are too large, check that:
- `.dockerignore` excludes `node_modules`, `.next`, `.git`
- The final stage only copies from the standalone output

### Webhook not triggering

- Verify the webhook URL in GitHub Settings > Webhooks. Check "Recent Deliveries" for response codes.
- Coolify returns 200 even when it skips a build (watch paths didn't match). This is normal.
- If Coolify returns 401/403, regenerate the webhook secret in Coolify and update it in GitHub.
