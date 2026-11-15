import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { prisma } from '../../lib/prisma';
import { AppError } from '../../middleware/error.middleware';
import { ENV } from '../../config/env';
import type { RegisterInput, LoginInput, SessionUser } from '@akaytheory/shared';

export class AuthService {
  private static generateSessionToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  private static calculateSessionExpiration(): Date {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + ENV.SESSION_TTL_DAYS);
    return expiresAt;
  }

  public static async register(
    input: RegisterInput,
    ipAddress: string | null,
    userAgent: string | null,
  ): Promise<{ user: SessionUser; token: string }> {
    const existingEmail = await prisma.user.findUnique({ where: { email: input.email } });
    if (existingEmail) {
      throw new AppError(409, 'EMAIL_EXISTS', 'Email Conflict', 'An account with this email address already exists.');
    }

    const existingUsername = await prisma.user.findUnique({ where: { username: input.username } });
    if (existingUsername) {
      throw new AppError(409, 'USERNAME_TAKEN', 'Username Taken', 'This username is already taken.');
    }

    const passwordHash = await bcrypt.hash(input.password, 10);
    const token = this.generateSessionToken();
    const expiresAt = this.calculateSessionExpiration();

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: input.email,
          username: input.username,
          displayName: input.displayName,
          passwordHash,
          role: 'LEARNER',
          isEmailVerified: false,
        },
      });

      await tx.session.create({
        data: {
          userId: user.id,
          token,
          ipAddress,
          userAgent,
          expiresAt,
        },
      });

      return user;
    });

    // Asynchronously prune expired sessions in the background
    this.pruneExpiredSessions().catch(() => {});

    return {
      user: {
        id: result.id,
        email: result.email,
        username: result.username,
        displayName: result.displayName,
        role: result.role,
        isEmailVerified: result.isEmailVerified,
      },
      token,
    };
  }

  public static async login(
    input: LoginInput,
    ipAddress: string | null,
    userAgent: string | null,
  ): Promise<{ user: SessionUser; token: string }> {
    const user = await prisma.user.findUnique({ where: { email: input.email } });
    if (!user || !user.passwordHash) {
      throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid Credentials', 'Incorrect email address or password.');
    }

    const isMatch = await bcrypt.compare(input.password, user.passwordHash);
    if (!isMatch) {
      throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid Credentials', 'Incorrect email address or password.');
    }

    const token = this.generateSessionToken();
    const expiresAt = this.calculateSessionExpiration();

    await prisma.session.create({
      data: {
        userId: user.id,
        token,
        ipAddress,
        userAgent,
        expiresAt,
      },
    });

    // Asynchronously prune expired sessions in the background
    this.pruneExpiredSessions().catch(() => {});

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        displayName: user.displayName,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
      },
      token,
    };
  }

  public static async logout(token: string): Promise<void> {
    await prisma.session.deleteMany({
      where: { token },
    });
  }

  public static async revokeAllUserSessions(userId: string): Promise<void> {
    await prisma.session.deleteMany({
      where: { userId },
    });
  }

  public static async pruneExpiredSessions(): Promise<number> {
    const result = await prisma.session.deleteMany({
      where: {
        expiresAt: { lt: new Date() },
      },
    });
    return result.count;
  }

  /**
   * OAuth Unlinking Safeguard (BR-021, AT-014):
   * Users cannot unlink an external identity if no verified password exists.
   */
  public static async unlinkOAuth(userId: string, provider: string): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { accounts: true },
    });

    if (!user) {
      throw new AppError(404, 'USER_NOT_FOUND', 'User Not Found', 'User could not be found.');
    }

    if (!user.passwordHash) {
      throw new AppError(
        400,
        'CANNOT_UNLINK_LAST_AUTH',
        'Password Required',
        'You must establish a verified password before unlinking Google OAuth.',
      );
    }

    await prisma.account.deleteMany({
      where: {
        userId,
        provider,
      },
    });
  }
}

