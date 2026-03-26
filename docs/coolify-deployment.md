# Coolify Deployment

Each app in this monorepo is deployed as a separate service on Coolify. This guide covers how to set up and configure each deployment.

## Prerequisites

- A running [Coolify](https://coolify.io/) instance
- This monorepo pushed to a Git remote (GitHub, Gitea, etc.)
- A domain or subdomain per app

## Architecture

```
Git push
  └─> Coolify watches the repo
        ├─> cant-maintain  (cantmaintain.com)
        ├─> cant-resize    (cantresize.com)
        └─> cant-type      (canttype.com)
```

Each app is a separate Coolify resource pointing to the same repository but with different build configurations.

## Step 1: Enable standalone output

Add `output: "standalone"` to each app's `next.config.mjs` so Next.js produces a self-contained build:

```js
const nextConfig = {
  output: "standalone",
  experimental: {
    viewTransition: true,
  },
  transpilePackages: ["@cant/shared"],
};
```

This is required for Docker-based deployments. The standalone output includes only the files needed to run in production, keeping the image small.

## Step 2: Add a Dockerfile per app

Create a `Dockerfile` at the root of the monorepo for each app. Coolify will use the Dockerfile you point it to.

### `apps/cant-maintain/Dockerfile`

```dockerfile
FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@10.20.0 --activate

# --- Dependencies ---
FROM base AS deps
WORKDIR /app
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/cant-maintain/package.json ./apps/cant-maintain/
RUN pnpm install --frozen-lockfile

# --- Build ---
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages/shared/node_modules ./packages/shared/node_modules
COPY --from=deps /app/apps/cant-maintain/node_modules ./apps/cant-maintain/node_modules
COPY . .
RUN pnpm --filter cant-maintain build

# --- Production ---
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

COPY --from=builder /app/apps/cant-maintain/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/apps/cant-maintain/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/cant-maintain/.next/static ./apps/cant-maintain/.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "apps/cant-maintain/server.js"]
```

For the other apps, duplicate this file and replace `cant-maintain` with `cant-resize` or `cant-type`.

### `apps/cant-resize/Dockerfile`

Same structure, replace all occurrences of `cant-maintain` with `cant-resize`.

### `apps/cant-type/Dockerfile`

Same structure, replace all occurrences of `cant-maintain` with `cant-type`. Note: cant-type has a prebuild step (`node scripts/vendor-typescript.mjs`) that runs automatically as part of its `build` script, so no extra Docker config is needed.

## Step 3: Configure Coolify

For each app, create a new resource in Coolify:

1. **Type:** Docker (Dockerfile)
2. **Repository:** Point to this monorepo
3. **Branch:** `main`
4. **Dockerfile location:** `apps/cant-maintain/Dockerfile` (adjust per app)
5. **Build context:** `/` (repo root, so COPY commands work with the monorepo structure)
6. **Port:** 3000

### Domain configuration

| App | Domain |
|-----|--------|
| cant-maintain | cantmaintain.com |
| cant-resize | cantresize.com |
| cant-type | canttype.com |

Enable HTTPS via Coolify's built-in Let's Encrypt integration.

### Environment variables

No environment variables are required for the apps themselves. Analytics is handled client-side via the Umami script tag in each app's `layout.tsx`.

If you need per-environment config in the future, add env vars in Coolify's UI and reference them in `next.config.mjs` or server components.

## Step 4: Automatic deployments

Coolify supports webhook-based auto-deploy:

1. In Coolify, enable "Auto Deploy" for each resource
2. Add the Coolify webhook URL to your Git remote (GitHub Settings > Webhooks)
3. Every push to `main` triggers a rebuild of all three services

### Selective rebuilds

Coolify rebuilds the entire Dockerfile on every push. Since Turborepo caches builds and Docker layer caching handles dependencies, rebuilds are fast when only content changes.

If you want to skip deploying an unchanged app, you can configure Coolify's "Watch Paths" feature (if available in your version) to only trigger rebuilds when files in the relevant `apps/` directory or `packages/shared/` change.

Suggested watch paths per app:

```
apps/cant-maintain/**
packages/shared/**
pnpm-lock.yaml
```

## Troubleshooting

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

### Adding a `.dockerignore`

Create a `.dockerignore` at the repo root:

```
.git
**/node_modules
**/.next
**/.turbo
**/storybook-static
```

This speeds up the Docker build context transfer.
