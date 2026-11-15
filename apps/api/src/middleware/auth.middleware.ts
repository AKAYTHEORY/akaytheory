import type { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { ENV } from '../config/env';
import { AppError } from './error.middleware';
import type { SessionUser } from '@akaytheory/shared';

export interface AuthenticatedRequest extends Request {
  user?: SessionUser;
  sessionId?: string;
}

export async function authMiddleware(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  const token = req.cookies[ENV.SESSION_COOKIE_NAME];

  if (!token) {
    next(new AppError(401, 'UNAUTHORIZED', 'Authentication Required', 'No active session cookie found.'));
    return;
  }

  try {
    const session = await prisma.session.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!session || session.expiresAt < new Date()) {
      next(new AppError(401, 'SESSION_EXPIRED', 'Session Expired', 'Your session has expired. Please sign in again.'));
      return;
    }

    req.user = {
      id: session.user.id,
      email: session.user.email,
      username: session.user.username,
      displayName: session.user.displayName,
      role: session.user.role,
      isEmailVerified: session.user.isEmailVerified,
    };
    req.sessionId = session.id;

    next();
  } catch (err) {
    next(err);
  }
}

export async function optionalAuthMiddleware(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  const token = req.cookies[ENV.SESSION_COOKIE_NAME];

  if (!token) {
    next();
    return;
  }

  try {
    const session = await prisma.session.findUnique({
      where: { token },
      include: { user: true },
    });

    if (session && session.expiresAt >= new Date()) {
      req.user = {
        id: session.user.id,
        email: session.user.email,
        username: session.user.username,
        displayName: session.user.displayName,
        role: session.user.role,
        isEmailVerified: session.user.isEmailVerified,
      };
      req.sessionId = session.id;
    }
  } catch {
    // Continue anonymously
  }

  next();
}

