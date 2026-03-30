FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@10.20.0 --activate

# --- Dependencies ---
FROM base AS deps
WORKDIR /app
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/cant-query/package.json ./apps/cant-query/
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

# --- Build ---
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages/shared/node_modules ./packages/shared/node_modules
COPY --from=deps /app/apps/cant-query/node_modules ./apps/cant-query/node_modules
COPY . .
RUN pnpm --filter cant-query build && \
    rm -rf /app/.turbo /app/node_modules/.cache

# --- Production ---
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

COPY --from=builder /app/apps/cant-query/public ./apps/cant-query/public
COPY --from=builder --chown=nextjs:nodejs /app/apps/cant-query/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/cant-query/.next/static ./apps/cant-query/.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "apps/cant-query/server.js"]
