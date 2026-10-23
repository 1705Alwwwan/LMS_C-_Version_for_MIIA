import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createApiRouter } from './apiRouter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Root dir of the applet
const rootDir = path.resolve(__dirname, '../../');

const app = express();
const PORT = process.env.PORT || 3000;
const distPath = path.resolve(rootDir, 'dist');
const isProd = process.env.NODE_ENV === 'production';

// Global Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request Logger for API
app.use((req, _res, next) => {
  if (req.path.startsWith('/api')) {
    console.log(`[API ${req.method}] ${req.path} - ${new Date().toISOString()}`);
  }
  next();
});

// Mount Core RESTful API Routes
app.use('/api', createApiRouter());

// Serve Frontend in Production or Development
async function startServer() {
  if (isProd && fs.existsSync(distPath)) {
    console.log(`[Production] Serving static files from: ${distPath}`);
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  } else {
    // Dynamic Vite Dev Server in development
    try {
      const { createServer } = await import('vite');
      const vite = await createServer({
        root: rootDir,
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(vite.middlewares);

      // Serve index.html transformed by Vite for client-side routing
      app.use('*', async (req: Request, res: Response, next) => {
        if (req.originalUrl.startsWith('/api')) {
          return next();
        }
        try {
          const indexHtmlPath = path.resolve(rootDir, 'index.html');
          const rawHtml = fs.readFileSync(indexHtmlPath, 'utf-8');
          const html = await vite.transformIndexHtml(req.originalUrl, rawHtml);
          res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
        } catch (err) {
          next(err);
        }
      });
      console.log('[Development] Vite middleware and SPA handler successfully attached to Express.');
    } catch (err) {
      console.error('[Error] Failed to load Vite development middleware:', err);
    }
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log('========================================================');
    console.log(`🚀 LMS MI Assuyutiyah Server Running on http://0.0.0.0:${PORT}`);
    console.log(`📡 REST API Base URL:       http://0.0.0.0:${PORT}/api`);
    console.log(`🩺 Healthcheck:             http://0.0.0.0:${PORT}/api/health`);
    console.log(`📖 OpenAPI 3.0 Doc:         http://0.0.0.0:${PORT}/api/openapi.json`);
    console.log(`👥 Students API:            http://0.0.0.0:${PORT}/api/students`);
    console.log(`👨‍🏫 Teachers API:            http://0.0.0.0:${PORT}/api/teachers`);
    console.log(`🏢 Classes API:             http://0.0.0.0:${PORT}/api/classes`);
    console.log(`💰 SPP Finance API:         http://0.0.0.0:${PORT}/api/finance/invoices`);
    console.log(`🌍 Environment:             ${isProd ? 'production' : 'development'}`);
    console.log('========================================================');
  });
}

startServer();

// Process signal handling
process.on('SIGTERM', () => {
  console.log('[System] Received SIGTERM, exiting gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('[System] Received SIGINT, exiting gracefully...');
  process.exit(0);
});
