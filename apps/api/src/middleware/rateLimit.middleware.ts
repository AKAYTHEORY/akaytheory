import rateLimit from 'express-rate-limit';
import { ENV } from '../config/env';
import type { Request, Response } from 'express';

/**
 * Global rate limiter protecting API routes against denial-of-service
 */
export const globalRateLimiter = rateLimit({
  windowMs: ENV.RATE_LIMIT_WINDOW_MS,
  max: ENV.NODE_ENV === 'test' ? 10000 : ENV.RATE_LIMIT_MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    type: 'urn:akaytheory:error:rate-limit-exceeded',
    title: 'Too Many Requests',
    status: 429,
    code: 'RATE_LIMIT_EXCEEDED',
    detail: 'Global rate limit exceeded. Please wait a moment before sending more requests.',
    timestamp: new Date().toISOString(),
  },
});

/**
 * Strict authentication rate limiter protecting login and registration
 * endpoints from brute-force credential stuffing and password exhaustion attacks.
 */
export const authRateLimiter = rateLimit({
  windowMs: ENV.RATE_LIMIT_WINDOW_MS,
  max: ENV.NODE_ENV === 'test' ? 1000 : ENV.AUTH_RATE_LIMIT_MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      type: 'urn:akaytheory:error:auth-rate-limit-exceeded',
      title: 'Too Many Authentication Attempts',
      status: 429,
      code: 'AUTH_RATE_LIMIT_EXCEEDED',
      detail: 'Too many authentication attempts from this IP address. Please try again after 1 minute.',
      instance: req.originalUrl,
      timestamp: new Date().toISOString(),
    });
  },
});

