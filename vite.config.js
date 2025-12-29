/* eslint-env node */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Pass Vercel's commit SHA to frontend during build
    'import.meta.env.VITE_VERCEL_GIT_COMMIT_SHA': JSON.stringify(
      process.env.VERCEL_GIT_COMMIT_SHA || 'dev-build'
    ),
  },
  build: {
    // Exclude api folder - it's for Vercel serverless functions
    rollupOptions: {
      external: ['@google-analytics/data']
    }
  }
})
