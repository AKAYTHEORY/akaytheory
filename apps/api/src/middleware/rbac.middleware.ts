import type { Response, NextFunction } from 'express';
import type { AuthenticatedRequest } from './auth.middleware';
import { AppError } from './error.middleware';
import type { UserRole } from '@akaytheory/shared';

export function requireRole(allowedRoles: UserRole[]) {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new AppError(401, 'UNAUTHORIZED', 'Authentication Required', 'You must be logged in.'));
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      next(
        new AppError(
          403,
          'FORBIDDEN',
          'Insufficient Permissions',
          `Role '${req.user.role}' is not authorized to access this resource.`,
        ),
      );
      return;
    }

    next();
  };
}

