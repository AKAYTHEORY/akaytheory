import type { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { registerSchema, loginSchema } from '@akaytheory/shared';
import { ENV } from '../../config/env';
import type { AuthenticatedRequest } from '../../middleware/auth.middleware';
import type { ApiResponse, SessionUser } from '@akaytheory/shared';

export class AuthController {
  private static setSessionCookie(res: Response, token: string): void {
    res.cookie(ENV.SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: ENV.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: ENV.SESSION_TTL_DAYS * 24 * 60 * 60 * 1000,
      path: '/',
    });
  }

  public static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = registerSchema.parse(req.body);
      const ip = req.ip || null;
      const userAgent = req.headers['user-agent'] || null;

      const { user, token } = await AuthService.register(validated, ip, userAgent);
      AuthController.setSessionCookie(res, token);

      const response: ApiResponse<{ user: SessionUser }> = {
        success: true,
        data: { user },
        meta: { timestamp: new Date().toISOString() },
      };

      res.status(201).json(response);
    } catch (err) {
      next(err);
    }
  }

  public static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = loginSchema.parse(req.body);
      const ip = req.ip || null;
      const userAgent = req.headers['user-agent'] || null;

      const { user, token } = await AuthService.login(validated, ip, userAgent);
      AuthController.setSessionCookie(res, token);

      const response: ApiResponse<{ user: SessionUser }> = {
        success: true,
        data: { user },
        meta: { timestamp: new Date().toISOString() },
      };

      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  public static async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const token = req.cookies[ENV.SESSION_COOKIE_NAME];
      if (token) {
        await AuthService.logout(token);
      }
      res.clearCookie(ENV.SESSION_COOKIE_NAME, { path: '/' });

      const response: ApiResponse<{ message: string }> = {
        success: true,
        data: { message: 'Successfully logged out.' },
        meta: { timestamp: new Date().toISOString() },
      };

      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  public static async getCurrentUser(req: AuthenticatedRequest, res: Response): Promise<void> {
    const response: ApiResponse<{ user: SessionUser }> = {
      success: true,
      data: { user: req.user! },
      meta: { timestamp: new Date().toISOString() },
    };
    res.status(200).json(response);
  }

  public static async unlinkOAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const provider = req.body.provider || 'google';
      await AuthService.unlinkOAuth(req.user!.id, provider);

      const response: ApiResponse<{ message: string }> = {
        success: true,
        data: { message: `Successfully unlinked ${provider} identity.` },
        meta: { timestamp: new Date().toISOString() },
      };

      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }
}

