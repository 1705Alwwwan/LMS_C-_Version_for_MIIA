# ==============================================================================
# Production Dockerfile for LMS MI Assuyutiyah
# Multi-stage build for optimal image size, security, and performance
# ==============================================================================

# STAGE 1: Build Frontend and Server Bundle
FROM node:22-alpine AS builder

WORKDIR /app

# Install build dependencies
COPY package.json package-lock.json* bun.lock* ./
RUN npm install

# Copy source code
COPY . .

# Build Vite client assets and compile backend bundle
RUN npm run build

# STAGE 2: Production Runtime
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production \
    PORT=3000

# Install wget for healthcheck (included in alpine by default)
RUN apk add --no-cache wget

# Install only production dependencies
COPY package.json ./
RUN npm install --omit=dev && npm cache clean --force

# Copy built frontend assets and server bundle from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.ts ./server.ts
COPY --from=builder /app/package.json ./package.json

# Security hardening: use non-root node user
RUN chown -R node:node /app
USER node

# Expose HTTP application port
EXPOSE 3000

# Container Healthcheck endpoint
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:3000/api/health || exit 1

# Start production server
CMD ["node", "dist/server.js"]
