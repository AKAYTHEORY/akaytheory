import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/server';

describe('Health Endpoint Integration', () => {
  const app = createApp();

  it('GET /api/v1/health returns 200 and healthy payload', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('HEALTHY');
    expect(res.body.data.database).toBe('CONNECTED');
  });
});

