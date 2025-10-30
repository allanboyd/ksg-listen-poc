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

# Build-time args to pass secrets and config (optional)
ARG GEMINI_API_KEY
ARG NEXTAUTH_URL
ARG NEXTAUTH_SECRET
ARG MAIL_HOST
ARG MAIL_PORT
ARG MAIL_SCHEME
ARG MAIL_USERNAME
ARG MAIL_PASSWORD
ARG MAIL_FROM_ADDRESS
ARG ALERT_TO

# Expose envs at runtime (use docker build --build-arg or override with docker run -e)
ENV GEMINI_API_KEY=${GEMINI_API_KEY}
ENV NEXTAUTH_URL=${NEXTAUTH_URL}
ENV NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
ENV MAIL_HOST=${MAIL_HOST}
ENV MAIL_PORT=${MAIL_PORT}
ENV MAIL_SCHEME=${MAIL_SCHEME}
ENV MAIL_USERNAME=${MAIL_USERNAME}
ENV MAIL_PASSWORD=${MAIL_PASSWORD}
ENV MAIL_FROM_ADDRESS=${MAIL_FROM_ADDRESS}
ENV ALERT_TO=${ALERT_TO}

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


