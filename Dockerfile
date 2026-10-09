# ─────────────────────────────────────────────────────────────
#  MeritOS — multi-stage production image
#  Build: docker build -t meritos .
#  Run:   docker run -p 3000:3000 meritos
# ─────────────────────────────────────────────────────────────

# ---- Stage 1: install dependencies (cached layer) ----
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
# `npm ci` for reproducible, lockfile-exact installs.
RUN npm ci

# ---- Stage 2: build the Next.js standalone bundle ----
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Disable Next.js telemetry during build for reproducible output.
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ---- Stage 3: minimal non-root runtime ----
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Run as the unprivileged `node` user that ships with the alpine image.
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

# Copy only the self-contained server bundle, its pruned node_modules,
# and the static assets that `output: 'standalone'` keeps separate.
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

# Liveness endpoint for orchestrators / uptime checks.
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||3000)+'/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "server.js"]
