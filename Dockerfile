# Multi-stage Docker build for Google Cloud Run deployment
# Last updated: 2026-02-01 - Build with environment variables from GitHub Secrets
# Stage 1: Build the Vite application
FROM node:20-alpine AS builder

WORKDIR /app

# Declare build arguments for Vite environment variables
ARG VITE_FIREBASE_API_KEY
ARG VITE_FIREBASE_AUTH_DOMAIN
ARG VITE_FIREBASE_PROJECT_ID
ARG VITE_FIREBASE_STORAGE_BUCKET
ARG VITE_FIREBASE_MESSAGING_SENDER_ID
ARG VITE_FIREBASE_APP_ID
ARG VITE_FIREBASE_MEASUREMENT_ID
ARG VITE_ADMIN_GATEWAY_KEY
ARG VITE_GEMINI_API_KEY

# Set as environment variables so Vite can read them during build
ENV VITE_FIREBASE_API_KEY=$VITE_FIREBASE_API_KEY \
    VITE_FIREBASE_AUTH_DOMAIN=$VITE_FIREBASE_AUTH_DOMAIN \
    VITE_FIREBASE_PROJECT_ID=$VITE_FIREBASE_PROJECT_ID \
    VITE_FIREBASE_STORAGE_BUCKET=$VITE_FIREBASE_STORAGE_BUCKET \
    VITE_FIREBASE_MESSAGING_SENDER_ID=$VITE_FIREBASE_MESSAGING_SENDER_ID \
    VITE_FIREBASE_APP_ID=$VITE_FIREBASE_APP_ID \
    VITE_FIREBASE_MEASUREMENT_ID=$VITE_FIREBASE_MEASUREMENT_ID \
    VITE_ADMIN_GATEWAY_KEY=$VITE_ADMIN_GATEWAY_KEY \
    VITE_GEMINI_API_KEY=$VITE_GEMINI_API_KEY

# Copy package files
COPY package*.json ./

# Install dependencies with legacy peer deps flag (required for React 19 compatibility)
RUN npm install --legacy-peer-deps

# Copy source code (but NOT .env.local - using build args instead)
COPY . .

# DEBUG: Verify environment variables are set before build
RUN node check-env.js

# Build the application (Vite reads ENV variables set above)
RUN npm run build

# DEBUG: Verify the built files contain the Firebase config
RUN echo "🔍 Checking if Firebase config is in built files:" && \
    grep -r "firebaseapp.com" dist/ || echo "⚠️  WARNING: Firebase domain NOT found in built files!"

# Stage 2: Production runtime
FROM node:20-alpine

WORKDIR /app

# Install production dependencies for Express server
COPY package*.json ./
RUN npm install --legacy-peer-deps --only=production

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
