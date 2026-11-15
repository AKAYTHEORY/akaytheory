import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/server';
import { prisma } from '../src/lib/prisma';
import crypto from 'crypto';

describe('Security & Operational Safeguards', () => {
  const app = createApp();

  describe('Dedicated Root Health Route', () => {
    it('GET /health returns 200 with database health status', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('HEALTHY');
      expect(res.body.data.database).toBe('CONNECTED');
    });
  });

  describe('RFC 7807 Problem Details Schema Compliance', () => {
    it('returns RFC 7807 compliant problem details on validation failure', async () => {
      const res = await request(app).post('/api/v1/auth/register').send({
        email: 'invalid-email',
        password: 'short',
      });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.type).toBe('urn:akaytheory:error:validation');
      expect(res.body.code).toBe('VALIDATION_FAILED');
      expect(res.body.title).toBe('Validation Error');
      expect(res.body.invalidParams).toBeInstanceOf(Array);
      expect(res.body.invalidParams.length).toBeGreaterThan(0);
      expect(res.body.timestamp).toBeDefined();
    });
  });

  describe('OAuth Safeguards & Unlinking (AT-014, BR-021)', () => {
    it('AT-014: Blocks unlinking OAuth identity when no local password hash exists', async () => {
      // 1. Create an OAuth-only user (no password hash)
      const oauthEmail = `oauth_only_${Date.now()}@akaytheory.dev`;
      const token = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);

      const user = await prisma.user.create({
        data: {
          email: oauthEmail,
          username: `oauth_user_${Date.now()}`,
          displayName: 'OAuth Only User',
          passwordHash: null, // Zero local password
          role: 'LEARNER',
          isEmailVerified: true,
          accounts: {
            create: {
              provider: 'google',
              providerAccountId: `google_${Date.now()}`,
            },
          },
          sessions: {
            create: {
              token,
              expiresAt,
            },
          },
        },
      });

      // 2. Attempt to unlink Google account
      const res = await request(app)
        .post('/api/v1/auth/unlink-oauth')
        .set('Cookie', `akaytheory_session=${token}`)
        .send({ provider: 'google' });

      // 3. System MUST block unlinking with 400 and clear error message
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.code).toBe('CANNOT_UNLINK_LAST_AUTH');
      expect(res.body.detail).toContain('establish a verified password before unlinking');

      // 4. Verify Account record was NOT deleted
      const accountStillExists = await prisma.account.findFirst({
        where: { userId: user.id, provider: 'google' },
      });
      expect(accountStillExists).not.toBeNull();
    });
  });

  describe('Rate Limiter Headers Verification', () => {
    it('returns rate limit headers on API requests', async () => {
      const res = await request(app).get('/api/v1/health');
      expect(res.status).toBe(200);
      expect(res.headers).toHaveProperty('ratelimit-limit');
      expect(res.headers).toHaveProperty('ratelimit-remaining');
    });
  });
});
