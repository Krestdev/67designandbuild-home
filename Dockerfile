FROM node:24-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN \
  if [ -f package-lock.json ]; then npm ci; \
  else echo "Lockfile not found." && exit 1; \
  fi


FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

ENV PORT=3000


# Install Payload migrations
RUN npm run payload migrate

# Doker Host
CMD HOSTNAME="0.0.0.0" node server.js