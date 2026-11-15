import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/server';

describe('Authentication & Session Integration (Phase 3)', () => {
  const app = createApp();
  const testEmail = `auth_test_${Date.now()}@akaytheory.dev`;
  let sessionCookie: string;

  it('POST /api/v1/auth/register creates user and returns HTTP-only cookie', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        email: testEmail,
        password: 'ValidPassword123!',
        username: `user_${Date.now()}`,
        displayName: 'Test Student',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe(testEmail);
    expect(res.headers['set-cookie']).toBeDefined();

    // Extract cookie
    const cookies = res.headers['set-cookie'] as unknown as string[];
    const sessionPart = cookies.find((c) => c.startsWith('akaytheory_session='));
    expect(sessionPart).toBeDefined();
    sessionCookie = sessionPart!.split(';')[0]!;
  });

  it('POST /api/v1/auth/register rejects duplicate email with 409 Conflict', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        email: testEmail,
        password: 'ValidPassword123!',
        username: `diff_user_${Date.now()}`,
        displayName: 'Another Student',
      });

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
    expect(res.body.code).toBe('EMAIL_EXISTS');
  });

  it('GET /api/v1/auth/me retrieves current user when session cookie is provided', async () => {
    const res = await request(app)
      .get('/api/v1/auth/me')
      .set('Cookie', sessionCookie);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe(testEmail);
  });

  it('GET /api/v1/auth/me returns 401 when no session cookie is sent', async () => {
    const res = await request(app).get('/api/v1/auth/me');
    expect(res.status).toBe(401);
    expect(res.body.code).toBe('UNAUTHORIZED');
  });

  it('POST /api/v1/auth/login validates credentials and creates session', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: testEmail,
        password: 'ValidPassword123!',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.headers['set-cookie']).toBeDefined();
  });

  it('POST /api/v1/auth/login rejects invalid password with 401', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: testEmail,
        password: 'WrongPassword999!',
      });

    expect(res.status).toBe(401);
    expect(res.body.code).toBe('INVALID_CREDENTIALS');
  });

  it('POST /api/v1/auth/logout destroys session and clears cookie', async () => {
    const res = await request(app)
      .post('/api/v1/auth/logout')
      .set('Cookie', sessionCookie);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    // Subsequent request with the same cookie should be rejected
    const afterLogout = await request(app)
      .get('/api/v1/auth/me')
      .set('Cookie', sessionCookie);
    expect(afterLogout.status).toBe(401);
  });
});

