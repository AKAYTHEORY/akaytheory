import dotenv from 'dotenv';
import path from 'path';

// Load .env from root if not already loaded
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

export const ENV = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '4000', 10),
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/akaytheory_dev?schema=public',
  SESSION_SECRET: process.env.SESSION_SECRET || 'dev-secret-at-least-32-chars-long-akaytheory',
  SESSION_COOKIE_NAME: process.env.SESSION_COOKIE_NAME || 'akaytheory_session',
  SESSION_TTL_DAYS: parseInt(process.env.SESSION_TTL_DAYS || '30', 10),
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10),
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '120', 10),
  AUTH_RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.AUTH_RATE_LIMIT_MAX_REQUESTS || '10', 10),
} as const;

