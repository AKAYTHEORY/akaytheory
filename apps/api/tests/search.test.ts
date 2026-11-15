import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/server';

describe('Global Search API Module (AT-SEARCH)', () => {
  const app = createApp();

  it('GET /api/v1/search?q=binary returns matching topics, lessons, and problems', async () => {
    const res = await request(app).get('/api/v1/search?q=binary');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.topics).toBeInstanceOf(Array);
    expect(res.body.data.lessons).toBeInstanceOf(Array);
    expect(res.body.data.problems).toBeInstanceOf(Array);

    const topicFound = res.body.data.topics.some((t: { title: string }) =>
      t.title.toLowerCase().includes('binary'),
    );
    expect(topicFound).toBe(true);
  });

  it('GET /api/v1/search with empty query returns empty arrays', async () => {
    const res = await request(app).get('/api/v1/search?q=');
    expect(res.status).toBe(200);
    expect(res.body.data.topics).toEqual([]);
    expect(res.body.data.lessons).toEqual([]);
    expect(res.body.data.problems).toEqual([]);
  });
});

