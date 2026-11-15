import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/server';

describe('Roadmaps API Module (AT-ROADMAP)', () => {
  const app = createApp();

  it('GET /api/v1/roadmaps returns available roadmaps list', async () => {
    const res = await request(app).get('/api/v1/roadmaps');
    expect(res.status).toBe(200);
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data[0].slug).toBe('dsa-fundamentals');
  });

  it('GET /api/v1/roadmaps/:slug returns roadmap with nodes, edges, and computed states', async () => {
    const res = await request(app).get('/api/v1/roadmaps/dsa-fundamentals');
    expect(res.status).toBe(200);
    expect(res.body.data.slug).toBe('dsa-fundamentals');
    expect(res.body.data.nodes).toBeInstanceOf(Array);
    expect(res.body.data.edges).toBeInstanceOf(Array);

    const binarySearchNode = res.body.data.nodes.find(
      (n: { title: string; state: string }) => n.title === 'Binary Search Algorithm',
    );
    expect(binarySearchNode).toBeDefined();
    expect(binarySearchNode.state).toBe('AVAILABLE');
  });

  it('GET /api/v1/roadmaps/invalid-slug returns 404 RFC 7807 problem details', async () => {
    const res = await request(app).get('/api/v1/roadmaps/non-existent-roadmap');
    expect(res.status).toBe(404);
    expect(res.body.code).toBe('ROADMAP_NOT_FOUND');
  });
});
