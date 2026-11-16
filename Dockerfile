# syntax=docker/dockerfile:1
FROM node:24-alpine AS base

# Install libc6-compat for Alpine compatibility with Next.js/Turbopack native binaries
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci --no-audit --progress=false

# Build the app (output: "standalone" in next.config.ts). The limits below keep
# the build from using all the server's RAM and CPU; raise them with
# --build-arg on a bigger machine.
FROM base AS builder
WORKDIR /app

ARG NEXT_PUBLIC_API_URL
ARG BUILD_MEMORY_MB=2048
ARG NEXT_BUILD_CPUS=1
ARG SKIP_TYPECHECK=true

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
# A clear "heap out of memory" error instead of Node growing until the server swaps or freezes.
ENV NODE_OPTIONS=--max-old-space-size=$BUILD_MEMORY_MB
ENV NEXT_BUILD_CPUS=$NEXT_BUILD_CPUS
ENV SKIP_TYPECHECK=$SKIP_TYPECHECK

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Runtime image: only the standalone server, static assets and public files —
# no full node_modules, no source, no build tools.
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup -S -g 1001 nodejs && adduser -S -u 1001 -G nodejs nextjs

COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

# Pending migrations run at startup (instrumentation.ts + prodMigrations).
CMD ["node", "server.js"]
