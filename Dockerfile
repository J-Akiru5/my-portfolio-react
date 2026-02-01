# Multi-stage Docker build for Google Cloud Run deployment
# Last updated: 2026-02-01 - Force rebuild with .env.local
# Stage 1: Build the Vite application
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with legacy peer deps flag (required for React 19 compatibility)
RUN npm install --legacy-peer-deps

# Copy source code AND .env.local (Vite will read it during build)
COPY . .

# Build the application (Vite automatically reads .env.local)
RUN npm run build

# Stage 2: Production runtime
FROM node:20-alpine

WORKDIR /app

# Install production dependencies for Express server
COPY package*.json ./
RUN npm install --legacy-peer-deps --only=production && \
    npm install express cors --legacy-peer-deps

# Copy built assets from builder stage
COPY --from=builder /app/dist ./dist

# Copy API functions and server
COPY api ./api
COPY server.js ./

# Expose port (Cloud Run will set PORT env var)
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:' + (process.env.PORT || 8080) + '/api/health', (r) => { process.exit(r.statusCode === 200 ? 0 : 1); })"

# Start the Express server
CMD ["node", "server.js"]
# REBUILD-20260201-145007
