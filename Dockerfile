# ─────────────────────────────────────────
# Stage 1: Install dependencies
# ─────────────────────────────────────────
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# ─────────────────────────────────────────
# Stage 2: Build the application
# ─────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build args are injected at build time by Easypanel
ARG SPACESHIP_API_KEY
ARG SPACESHIP_API_SECRET
ARG SPACESHIP_API_URL
ARG ODISEA_API_URL
ARG ODISEA_API_KEY
ARG DOMAIN_MARKUP_PERCENT
ARG CURRENCY_USD_TO_PEN

ENV SPACESHIP_API_KEY=$SPACESHIP_API_KEY \
    SPACESHIP_API_SECRET=$SPACESHIP_API_SECRET \
    SPACESHIP_API_URL=$SPACESHIP_API_URL \
    ODISEA_API_URL=$ODISEA_API_URL \
    ODISEA_API_KEY=$ODISEA_API_KEY \
    DOMAIN_MARKUP_PERCENT=$DOMAIN_MARKUP_PERCENT \
    CURRENCY_USD_TO_PEN=$CURRENCY_USD_TO_PEN \
    NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# ─────────────────────────────────────────
# Stage 3: Production runtime (minimal)
# ─────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser  --system --uid 1001 nextjs

# Copy only the standalone output and static assets
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000 \
    HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
