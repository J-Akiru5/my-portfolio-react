/* eslint-env node */
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '')

  console.log('🔍 Vite Config - Environment Variables Check:')
  console.log('Mode:', mode)
  console.log('VITE_FIREBASE_API_KEY:', env.VITE_FIREBASE_API_KEY ? `${env.VITE_FIREBASE_API_KEY.substring(0, 10)}...` : 'MISSING')
  console.log('VITE_FIREBASE_PROJECT_ID:', env.VITE_FIREBASE_PROJECT_ID || 'MISSING')
  console.log('VITE_FIREBASE_AUTH_DOMAIN:', env.VITE_FIREBASE_AUTH_DOMAIN || 'MISSING')

  return {
    plugins: [react()],
    define: {
      // Pass Vercel's commit SHA to frontend during build
      'import.meta.env.VITE_VERCEL_GIT_COMMIT_SHA': JSON.stringify(
        process.env.VITE_VERCEL_GIT_COMMIT_SHA || env.VITE_VERCEL_GIT_COMMIT_SHA || 'dev-build'
      ),
      // Explicitly pass Firebase environment variables to the client bundle
      'import.meta.env.VITE_FIREBASE_API_KEY': JSON.stringify(env.VITE_FIREBASE_API_KEY || ''),
      'import.meta.env.VITE_FIREBASE_AUTH_DOMAIN': JSON.stringify(env.VITE_FIREBASE_AUTH_DOMAIN || ''),
      'import.meta.env.VITE_FIREBASE_PROJECT_ID': JSON.stringify(env.VITE_FIREBASE_PROJECT_ID || ''),
      'import.meta.env.VITE_FIREBASE_STORAGE_BUCKET': JSON.stringify(env.VITE_FIREBASE_STORAGE_BUCKET || ''),
      'import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID': JSON.stringify(env.VITE_FIREBASE_MESSAGING_SENDER_ID || ''),
      'import.meta.env.VITE_FIREBASE_APP_ID': JSON.stringify(env.VITE_FIREBASE_APP_ID || ''),
      'import.meta.env.VITE_FIREBASE_MEASUREMENT_ID': JSON.stringify(env.VITE_FIREBASE_MEASUREMENT_ID || ''),
      'import.meta.env.VITE_ADMIN_GATEWAY_KEY': JSON.stringify(env.VITE_ADMIN_GATEWAY_KEY || ''),
      'import.meta.env.VITE_GEMINI_API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY || ''),
    },
    build: {
      // Exclude api folder - it's for Vercel serverless functions
      rollupOptions: {
        external: ['@google-analytics/data']
      }
    }
  }
})
