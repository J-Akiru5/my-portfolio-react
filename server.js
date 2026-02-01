/**
 * Express server for Google Cloud Run
 * Serves static Vite build + wraps Vercel API functions
 */

import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readdir } from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

// Health check endpoint for Cloud Run
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production'
  });
});

// Dynamically load and mount API routes from the api/ directory
async function loadApiRoutes() {
  try {
    const apiDir = join(__dirname, 'api');
    const files = await readdir(apiDir);
    
    for (const file of files) {
      if (file.endsWith('.js')) {
        const routeName = file.replace('.js', '');
        const routePath = `/api/${routeName}`;
        
        try {
          // Dynamic import for ES modules
          const handler = await import(`./api/${file}`);
          
          // Vercel uses default export with (req, res) signature
          const vercelHandler = handler.default;
          
          if (typeof vercelHandler === 'function') {
            // Wrap Vercel function to work with Express
            app.all(routePath, async (req, res) => {
              try {
                // Vercel-style request/response compatibility
                await vercelHandler(req, res);
              } catch (error) {
                console.error(`Error in ${routePath}:`, error);
                if (!res.headersSent) {
                  res.status(500).json({ 
                    error: 'Internal server error',
                    message: process.env.NODE_ENV === 'development' ? error.message : undefined
                  });
                }
              }
            });
            console.log(`✓ Mounted API route: ${routePath}`);
          }
        } catch (error) {
          console.error(`✗ Failed to load ${file}:`, error.message);
        }
      }
    }
  } catch (error) {
    console.error('Failed to load API routes:', error);
  }
}

// Load API routes
await loadApiRoutes();

// Serve static files from dist directory
app.use(express.static(join(__dirname, 'dist')));

// SPA fallback - serve index.html for all non-API routes
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`
╔════════════════════════════════════════════╗
║  🚀 Portfolio Server Running              ║
║  📍 Port: ${PORT}                           ║
║  🌍 Environment: ${process.env.NODE_ENV || 'production'}              ║
║  ☁️  Platform: Google Cloud Run            ║
╚════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  process.exit(0);
});
