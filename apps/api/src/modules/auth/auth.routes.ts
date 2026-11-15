import { Router } from 'express';
import { AuthController } from './auth.controller';
import { authMiddleware } from '../../middleware/auth.middleware';
import { authRateLimiter } from '../../middleware/rateLimit.middleware';

export const authRouter = Router();

authRouter.post('/register', authRateLimiter, AuthController.register);
authRouter.post('/login', authRateLimiter, AuthController.login);
authRouter.post('/logout', AuthController.logout);
authRouter.get('/me', authMiddleware, AuthController.getCurrentUser);
authRouter.post('/unlink-oauth', authMiddleware, AuthController.unlinkOAuth);

