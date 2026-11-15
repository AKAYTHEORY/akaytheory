import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { ENV } from './config/env';
import { apiRouter } from './routes';
import { healthRouter } from './routes/health.route';
import { errorMiddleware } from './middleware/error.middleware';
import { globalRateLimiter } from './middleware/rateLimit.middleware';
import { prisma } from './lib/prisma';

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: ENV.CLIENT_URL,
      credentials: true,
    }),
  );
  app.use(cookieParser());
  app.use(express.json({ limit: '1mb' }));

  // Lightweight structured HTTP request duration logging
  app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
      if (ENV.NODE_ENV !== 'test') {
        const duration = Date.now() - start;
        console.info(`[HTTP] ${req.method} ${req.originalUrl || req.url} ${res.statusCode} ${duration}ms`);
      }
    });
    next();
  });

  // Dedicated container & orchestrator root health endpoint
  app.use('/health', healthRouter);

  // Global rate limiter for API routes
  app.use('/api/v1', globalRateLimiter);

  // API Router v1
  app.use('/api/v1', apiRouter);

  // Centralized RFC 7807 problem details error handler
  app.use(errorMiddleware);

  return app;
}

if (process.env.NODE_ENV !== 'test') {
  const app = createApp();
  const server = app.listen(ENV.PORT, () => {
    console.info(`[AKAYTHEORY_API] Server listening on port ${ENV.PORT} (${ENV.NODE_ENV})`);
  });

  const gracefulShutdown = async (signal: string) => {
    console.info(`[AKAYTHEORY_API] Received ${signal}. Starting graceful shutdown...`);
    server.close(async () => {
      console.info('[AKAYTHEORY_API] Closed HTTP server.');
      try {
        await prisma.$disconnect();
        console.info('[AKAYTHEORY_API] Disconnected from PostgreSQL.');
      } catch (err) {
        console.error('[AKAYTHEORY_API] Error during database disconnect:', err);
      }
      process.exit(0);
    });

    // Force termination if gracefully draining takes longer than 10 seconds
    setTimeout(() => {
      console.error('[AKAYTHEORY_API] Forced shutdown after 10s timeout.');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
}
