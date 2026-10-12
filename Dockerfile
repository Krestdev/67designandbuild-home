# syntax=docker/dockerfile:1
FROM node:24-alpine AS base

# Install libc6-compat for Alpine compatibility with Next.js/Turbopack native binaries
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies with npm cache mount
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# Build the app (output: "standalone" in next.config.ts)
FROM base AS builder
WORKDIR /app

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Mount Next.js build cache to speed up repeated builds
RUN npm run build

# Runtime image: only the standalone server, static assets and public files —
# no full node_modules, no source, no build tools.
FROM base AS runner
WORKDIR /app

ENV PORT=3000
ENV HOSTNAME=0.0.0.0

COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

EXPOSE 3000

# Pending migrations run at startup (instrumentation.ts + prodMigrations).
CMD ["node", "server.js"]
