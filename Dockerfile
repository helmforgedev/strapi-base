# syntax=docker/dockerfile:1

# ==============================================================================
# Base stage: shared dependencies and security hardening
# ==============================================================================
FROM node:22-alpine3.22 AS base

# Install security updates and required tools
RUN apk update && \
    apk upgrade --no-cache && \
    apk add --no-cache \
    dumb-init \
    && rm -rf /var/cache/apk/*

# Use existing node user (UID/GID 1000)
# No need to create - already exists in node:alpine images

WORKDIR /opt/app
RUN chown node:node /opt/app

# ==============================================================================
# Dependencies stage: install production dependencies
# ==============================================================================
FROM base AS dependencies

COPY --chown=node:node package.json package-lock.json* ./

RUN npm ci --only=production --ignore-scripts && \
    npm cache clean --force

# ==============================================================================
# Build stage: compile TypeScript and build admin panel
# ==============================================================================
FROM base AS build

COPY --chown=node:node package.json package-lock.json* ./

# Install all dependencies (including devDependencies for build)
RUN npm ci --ignore-scripts && \
    npm cache clean --force

# Copy source code
COPY --chown=node:node . .

# Set build environment
ENV NODE_ENV=production

# Build Strapi
RUN npm run build

# ==============================================================================
# Production stage: minimal runtime image
# ==============================================================================
FROM base AS production

# Security labels
LABEL org.opencontainers.image.title="Strapi Base" \
      org.opencontainers.image.description="Production-ready Strapi base image with full plugin support" \
      org.opencontainers.image.vendor="HelmForge" \
      org.opencontainers.image.authors="HelmForge Team" \
      org.opencontainers.image.licenses="MIT" \
      org.opencontainers.image.source="https://github.com/helmforgedev/strapi-base"

# Copy production dependencies
COPY --from=dependencies --chown=node:node /opt/app/node_modules ./node_modules

# Copy built application
COPY --from=build --chown=node:node /opt/app/dist ./dist
COPY --from=build --chown=node:node /opt/app/build ./build

# Copy runtime files
COPY --chown=node:node package.json ./
COPY --from=build --chown=node:node /opt/app/dist/config ./config
COPY --chown=node:node public ./public
COPY --from=build --chown=node:node /opt/app/dist/src ./src

# Create required directories with correct ownership
RUN mkdir -p .tmp public/uploads && \
    chown -R node:node .tmp public/uploads

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:1337/_health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Switch to non-root user
USER node:node

# Expose application port
EXPOSE 1337

# Environment defaults
ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=1337 \
    STRAPI_TELEMETRY_DISABLED=true

# Use dumb-init to handle signals properly
ENTRYPOINT ["/usr/bin/dumb-init", "--"]

# Start Strapi
CMD ["node", "node_modules/@strapi/strapi/bin/strapi.js", "start"]
