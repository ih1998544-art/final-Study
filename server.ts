/**
 * Study Zone - Production Server Entry Point
 * Full-stack Express server orchestrating:
 * - Secure API routes (/api/*)
 * - Rate limiting & Authentication
 * - Server-side Gemini AI Service
 * - Vite dev server middleware in development / static SPA in production
 * 
 * Binds strictly to 0.0.0.0:3000 per AI Studio runtime requirements.
 */

import 'dotenv/config';
import express, { type Request, type Response, type NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import { authRouter } from './server/routes/authRoutes.ts';
import { userRouter } from './server/routes/userRoutes.ts';
import { subjectRouter } from './server/routes/subjectRoutes.ts';
import { quizRouter } from './server/routes/quizRoutes.ts';
import { progressRouter } from './server/routes/progressRoutes.ts';
import { notesRouter } from './server/routes/notesRoutes.ts';
import { flashcardsRouter } from './server/routes/flashcardsRoutes.ts';
import { plannerRouter } from './server/routes/plannerRoutes.ts';
import { savedContentRouter } from './server/routes/savedContentRoutes.ts';
import { subscriptionRouter } from './server/routes/subscriptionRoutes.ts';
import { aiRouter } from './server/routes/aiRoutes.ts';
import { generalApiLimiter } from './server/middleware/rateLimiter.ts';

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || '3000', 10);
  const HOST = '0.0.0.0';

  // Body Parsing & General Security Headers
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // CORS & Preflight Handling for API
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(204);
    }
    next();
  });

  // Apply general rate limiting across all /api routes
  app.use('/api', generalApiLimiter);

  // Mount API Routers
  app.use('/api/auth', authRouter);
  app.use('/api/users', userRouter);
  app.use('/api/subjects', subjectRouter);
  app.use('/api/quizzes', quizRouter);
  app.use('/api/progress', progressRouter);
  app.use('/api/notes', notesRouter);
  app.use('/api/flashcards', flashcardsRouter);
  app.use('/api/study-plans', plannerRouter);
  app.use('/api/saved-content', savedContentRouter);
  app.use('/api/subscriptions', subscriptionRouter);
  app.use('/api/ai', aiRouter);

  // Health check endpoint
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'healthy',
      app: 'Study Zone',
      timestamp: new Date().toISOString(),
      aiConfigured: Boolean(process.env.GEMINI_API_KEY),
    });
  });

  // Development vs Production UI Serving
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('[Study Zone] Mounted Vite dev middleware in development mode.');
  } else {
    const distPath = path.resolve('dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req: Request, res: Response) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
      console.log('[Study Zone] Serving prebuilt static SPA assets in production mode from /dist.');
    } else {
      console.warn('[Study Zone] /dist directory not found. Run "npm run build" first.');
      app.get('*', (_req: Request, res: Response) => {
        res.status(503).send('Application build in progress or static assets missing. Run "npm run build".');
      });
    }
  }

  // Global Error Handler
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error('[Unhandled Server Error]', err);
    res.status(err.status || 500).json({
      error: err.name || 'InternalServerError',
      message: err.message || 'An unexpected server error occurred.',
    });
  });

  app.listen(PORT, HOST, () => {
    console.log(`🚀 Study Zone Production Server active at http://${HOST}:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[Fatal Server Startup Error]', err);
  process.exit(1);
});
