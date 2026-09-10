# syntax=docker/dockerfile:1
FROM node:24-alpine AS base

# Install libc6-compat for Alpine compatibility with Next.js/Turbopack native binaries
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies with npm cache mount
FROM base AS deps
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci --prefer-offline --no-audit --progress=false

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
# API URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL 

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Mount Next.js build cache to speed up repeated builds
RUN --mount=type=cache,target=/app/.next/cache \
    npm run build

EXPOSE 3000

ENV PORT=3000

CMD npm run payload migrate && npm start