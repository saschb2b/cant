FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@10.20.0 --activate

# --- Dependencies ---
FROM base AS deps
WORKDIR /app
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/cant-maintain/package.json ./apps/cant-maintain/
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

# --- Build ---
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages/shared/node_modules ./packages/shared/node_modules
COPY --from=deps /app/apps/cant-maintain/node_modules ./apps/cant-maintain/node_modules
COPY . .
RUN pnpm --filter cant-maintain build && \
    rm -rf /app/.turbo /app/node_modules/.cache

# --- Production ---
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

COPY --from=builder /app/apps/cant-maintain/public ./apps/cant-maintain/public
COPY --from=builder --chown=nextjs:nodejs /app/apps/cant-maintain/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/cant-maintain/.next/static ./apps/cant-maintain/.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "apps/cant-maintain/server.js"]
