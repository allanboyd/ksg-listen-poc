# Production multi-stage build for Next.js app
FROM node:20-bullseye-slim AS builder
WORKDIR /app
ENV NPM_CONFIG_LEGACY_PEER_DEPS=1
COPY package.json package-lock.json* .npmrc ./
RUN npm ci
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:20-bullseye-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3030
ENV HOSTNAME=0.0.0.0
ENV DB_FILE=/app/data/app.db

# Copy only necessary files
COPY --from=builder /app/next.config.* ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Create data dir for SQLite
RUN mkdir -p /app/data
VOLUME ["/app/data"]

EXPOSE 3030
CMD node server.js -p 3030


