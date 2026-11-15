# AkayTheory — Testing Strategy & Verification Guide

**Last Updated:** 2026-11-15  
**Test Frameworks:** Vitest 2.1.9 (Unit & Integration) | Playwright 1.49+ (E2E) | ESLint 9 (Hygiene) | TypeScript 5.7+ (Type Soundness)  
**Current Test Results:** 38/38 Unit/Integration Tests Passing | 4/4 Playwright E2E Tests Passing | 0 Lint Errors | 0 Type Errors  

---

## 1. Test Pyramid & Coverage Breakdown

```
        ▲
       / \         Playwright E2E Tests (4 Journeys)
      /   \        Browser interactions, responsive design, visualizers, auth
     /     \
    /───────\      Supertest API Integration Tests (21 Tests)
   /         \     Express controllers, services, database constraints, rate limiting
  /───────────\    Vitest Unit Tests (17 Tests)
 /             \   Headless StepEngine FSM, mastery state machine, math algorithms
└───────────────┘
```

---

## 2. Test Execution Commands

### Run All Unit & Integration Tests (Vitest)
```bash
pnpm test
```

### Run Playwright Browser E2E Tests
```bash
pnpm test:e2e
```

### Run Monorepo Strict Type Checking
```bash
pnpm type-check
```

### Run Monorepo Linter (ESLint 9 Flat Config)
```bash
pnpm lint
```

### Run Full CI Build Verification
```bash
pnpm build
```

---

## 3. Key Test Suites & Implementations

### 3.1 Deterministic Mastery State Machine Unit Test (`packages/shared`)

```typescript
// packages/shared/src/__tests__/mastery.test.ts
import { describe, it, expect } from 'vitest';
import { evaluateMasteryTransition, calculateUtcMidnightRevisionDue } from '../constants/mastery';

describe('Deterministic Mastery State Machine (SRS §3.11.1)', () => {
  it('advances from NOT_STARTED to FAMILIAR on initial quiz score >= 75%', () => {
    const res = evaluateMasteryTransition({
      currentMastery: 'NOT_STARTED',
      consecutivePassCount: 0,
      score: 85,
      isRevision: false,
    });
    expect(res.nextMastery).toBe('FAMILIAR');
    expect(res.nextIntervalDays).toBe(3);
  });

  it('normalizes next revision due date to 00:00:00 UTC (BR-020)', () => {
    const base = new Date('2026-11-15T14:30:00Z');
    const due = calculateUtcMidnightRevisionDue(base, 3);
    expect(due.toISOString()).toBe('2026-11-18T00:00:00.000Z');
  });
});
```

### 3.2 Security & Rate Limiting Integration Test (`apps/api`)

```typescript
// apps/api/tests/security.test.ts
import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/server';

describe('Security Safeguards & Rate Limiting', () => {
  const app = createApp();

  it('verifies standard RFC 7807 problem details response on invalid registration', async () => {
    const res = await request(app).post('/api/v1/auth/register').send({
      email: 'invalid-email',
      password: 'short',
    });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.code).toBe('VALIDATION_FAILED');
    expect(res.body.invalidParams).toBeInstanceOf(Array);
  });
});
```

### 3.3 End-to-End User Journey Test (`e2e/learning-journey.spec.ts`)

```typescript
// e2e/learning-journey.spec.ts
import { test, expect } from '@playwright/test';

test('Learner traverses roadmap, reveals mental model checkpoint, and submits quiz', async ({ page }) => {
  await page.goto('http://localhost:5173');
  await page.getByRole('button', { name: 'Engineering Roadmaps' }).click();
  await expect(page.getByRole('heading', { name: 'Data Structures & Algorithms' })).toBeVisible();

  // Switch to accessible List view (WCAG 2.2 AA)
  await page.getByRole('button', { name: 'List' }).click();
  await page.getByRole('button', { name: 'Start' }).first().click();

  // Interact with Think & Reveal Mental Model Checkpoint
  const revealBtn = page.getByRole('button', { name: /Think & Reveal|Hide Solution/i });
  await revealBtn.click();
  await expect(page.locator('text=Mental Model Checkpoint')).toBeVisible();
});
```

