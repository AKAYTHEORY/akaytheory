import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/server';

describe('Curriculum Content & Knowledge Graph Integration', () => {
  const app = createApp();

  it('GET /api/v1/curriculum/domains returns seeded domains', async () => {
    const res = await request(app).get('/api/v1/curriculum/domains');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBeGreaterThanOrEqual(2);

    const slugs = res.body.data.map((d: { slug: string }) => d.slug);
    expect(slugs).toContain('data-structures-and-algorithms');
    expect(slugs).toContain('system-design-foundations');
  });

  it('GET /api/v1/curriculum/topics/binary-search returns topic with dependencies', async () => {
    const res = await request(app).get('/api/v1/curriculum/topics/binary-search');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe('Binary Search Algorithm');
    expect(res.body.data.category).toBeDefined();
  });

  it('GET /api/v1/curriculum/lessons/binary-search-foundations returns published lesson with sections', async () => {
    const res = await request(app).get('/api/v1/curriculum/lessons/binary-search-foundations');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.sections.length).toBeGreaterThanOrEqual(3);
  });

  it('GET /api/v1/curriculum/problems returns seeded practice problems', async () => {
    const res = await request(app).get('/api/v1/curriculum/problems');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBeGreaterThanOrEqual(1);
    expect(res.body.data[0].slug).toBe('search-in-sorted-array');
  });
});

