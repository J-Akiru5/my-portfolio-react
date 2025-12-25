import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Exclude api folder - it's for Vercel serverless functions
    rollupOptions: {
      external: ['@google-analytics/data']
    }
  }
})
