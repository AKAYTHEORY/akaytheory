# AkayTheory — Comprehensive Engineering Audit Report

**Audit Date:** 2026-11-15  
**Auditor:** Senior Software Architect & Code Quality Auditor  
**Audit Scope:** Full Monorepo (`apps/api`, `apps/web`, `packages/shared`, `packages/visualizations`, `prisma/`, `e2e/`, Infrastructure & Tooling)  
**Baseline Test Status:** 35/35 Vitest Unit/Integration Tests Passing | 4/4 Playwright E2E Tests Passing | 0 TypeScript Strict Mode Compilation Errors  

---

## 1. Executive Summary & Audit Score

| Category | Weight | Score (0-100) | Weighted Score | Key Status / Observations |
|---|:---:|:---:|:---:|---|
| **A. Architecture & Design** | 15% | 88 | 13.2 | Clean modular monolith with clear domain services; slight inconsistency in response envelopes. |
| **B. Code Quality & Type Safety** | 10% | 82 | 8.2 | Strict TypeScript enabled; 14 lint warnings/errors in legacy ESLint config (`any` types). |
| **C. Frontend & UI/UX (WCAG)** | 15% | 85 | 12.75 | Modern React 18 + Tailwind; button touch targets and `aria-busy` states need hardening. |
| **D. Backend & API Design** | 15% | 84 | 12.6 | Express 5 modular architecture; missing auth rate-limiting middleware & `/health` route misbinding. |
| **E. Database & Schema Design** | 15% | 80 | 12.0 | 34 tables seeded cleanly; missing foreign key & query compound indexes in Prisma schema. |
| **F. Security (OWASP Top 10)** | 15% | 85 | 12.75 | Strong password hashing & HTTP-only sessions; missing endpoint throttling for brute-force defense. |
| **G. Testing & Quality Assurance** | 10% | 90 | 9.0 | High-quality unit, integration, and Playwright E2E tests passing cleanly. |
| **H. DevOps & Infrastructure** | 5% | 75 | 3.75 | Postgres container present; missing production rootless multi-stage Dockerfile and modern ESLint 9 flat config. |
| **TOTAL OVERALL SCORE** | **100%** | — | **84.25 / 100** | **Solid Foundation; Ready for Production Hardening** |

---

## 2. Dependency & Architecture Map

```
                     ┌─────────────────────────────┐
                     │          apps/web           │
                     │  (React 18 + Tailwind CSS)  │
                     └──────────────┬──────────────┘
                                    │
           ┌────────────────────────┼────────────────────────┐
           │ HTTP (Fetch API)       │ Workspace Import       │ Workspace Import
           ▼                        ▼                        ▼
┌──────────────────────┐ ┌────────────────────┐ ┌───────────────────────────┐
│       apps/api       │ │  packages/shared   │ │  packages/visualizations  │
│ (Express 5 Monolith) │ │ (Types, Schemas,   │ │ (Deterministic FSM Engine │
│                      │ │  Mastery Engine)   │ │  & Step Visualizers)      │
└──────────┬───────────┘ └──────────▲─────────┘ └─────────────▲─────────────┘
           │                        │                         │
           │ Imports Schemas & Types│                         │ Imports Types
           ├────────────────────────┘                         │
           │                                                  │
           │ Prisma ORM Client                                │
           ▼                                                  │
┌──────────────────────┐                                      │
│    PostgreSQL 16     │                                      │
│  (34 Seeded Tables)  │                                      │
└──────────────────────┘                                      │
           ▲                                                  │
           └──────────────────────────────────────────────────┘
```

---

## 3. Comprehensive Audit by Category

### A. Architecture
- **Strengths:** 
  - Monorepo structure properly decoupled with `pnpm-workspace.yaml`.
  - Separation of concerns between HTTP Controllers and Domain Services (`AuthService`, `CurriculumService`, `ProgressService`, `RoadmapService`, `SearchService`).
  - Core domain logic (deterministic mastery DFA, UTC midnight interval arithmetic) is isolated in pure, testable functions in `packages/shared`.
  - Algorithm step generation is completely headless and framework-agnostic in `packages/visualizations`.
- **Defects:**
  - `RoadmapController` bypassed the standardized `ApiResponse<T>` envelope by returning `{ data: roadmap }` directly, whereas `CurriculumController` and `AuthController` returned `{ success: true, data, meta: { timestamp } }`.
  - Suggestions in code:
```typescript
// Standardize RoadmapController response envelope:
const response: ApiResponse<typeof roadmap> = {
  success: true,
  data: roadmap,
  meta: { timestamp: new Date().toISOString() },
};
res.status(200).json(response);
```

### B. Code Quality & Type Safety
- **Strengths:**
  - TypeScript `strict: true` across all packages and apps.
  - Zero compilation errors during `pnpm build` and `pnpm type-check`.
- **Defects:**
  - ESLint 9 fails to execute out of the box due to missing `eslint.config.mjs` flat configuration.
  - 14 lint issues discovered:
    - `any` type casts in `apps/api/src/modules/roadmaps/roadmap.controller.ts:18` (`(req as any).user?.id`).
    - `any` in `apps/web/src/features/learning/LessonViewer.tsx:39` (`questions: any[]`).
    - `any` in `apps/web/src/features/learning/QuizWidget.tsx:128,158` (`(q: any)`).
    - `any` in `apps/web/src/features/practice/ProblemWorkspace.tsx:65` (`submission: any`).
    - `any` in `apps/web/src/lib/api.ts:59,74,82` (`err: any`, `body?: any`).
    - Unused variables in `prisma/seed.ts` (`testUser`, `sysDesignDomain`).
  - Suggestions in code:
```typescript
// apps/api/src/modules/roadmaps/roadmap.controller.ts
export class RoadmapController {
  public static async getRoadmap(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const rawSlug = req.params.slug;
      const slug = Array.isArray(rawSlug) ? rawSlug[0]! : rawSlug!;
      const userId = req.user?.id;
      const roadmap = await RoadmapService.getRoadmapBySlug(slug, userId);
      const response: ApiResponse<typeof roadmap> = {
        success: true,
        data: roadmap,
        meta: { timestamp: new Date().toISOString() },
      };
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }
}
```

### C. Frontend & UI/UX (WCAG 2.2 AA)
- **Strengths:**
  - Clean, dark-mode design system using Tailwind CSS tokens.
  - Keyboard navigation with global `Cmd+K` / `Ctrl+K` command palette.
  - Both visual canvas and WCAG-compliant accessible list views for roadmaps.
  - Progressive disclosure on practice problem hints.
- **Defects:**
  - `Button` component lacks `aria-busy` and `focus-visible:ring-2` tokens.
  - `AuthModal` prints raw unformatted Zod JSON errors to the learner if client-side validation fails.
  - Suggestions in code:
```tsx
// Accessible WCAG Button Token upgrade
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', isLoading = false, loadingText, leftIcon, rightIcon, className, children, disabled, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      className={twMerge(clsx(
        'inline-flex items-center justify-center font-medium rounded-lg transition-all',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950',
        'disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]',
        variantClasses[variant],
        sizeClasses[size],
        className
      ))}
      {...props}
    >
      {isLoading ? <Spinner className="w-4 h-4 animate-spin -ml-1 mr-2" /> : leftIcon}
      <span>{isLoading && loadingText ? loadingText : children}</span>
      {!isLoading && rightIcon}
    </button>
  )
);
```

### D. Backend & API Design
- **Strengths:**
  - Centralized RFC 7807 problem details error handling (`ApiErrorProblemDetails`).
  - Strict input validation with Zod schemas (`registerSchema`, `loginSchema`, `quizSubmissionSchema`, `problemSubmissionSchema`).
  - Layered architecture with route -> controller -> service separation.
- **Defects:**
  - Route binding bug: `app.use('/health', apiRouter)` mounted the entire router at `/health`.
  - Missing middleware: `optionalAuthMiddleware` was omitted from `/api/v1/curriculum/lessons/:slug`.
  - Rate limiting is completely unconfigured despite `.env` containing rate limit variables.
  - Suggestions in code:
```typescript
// apps/api/src/server.ts
import rateLimit from 'express-rate-limit';

const authLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10),
  max: parseInt(process.env.AUTH_RATE_LIMIT_MAX_REQUESTS || '10', 10),
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    type: 'urn:akaytheory:error:rate-limit-exceeded',
    title: 'Too Many Requests',
    status: 429,
    code: 'RATE_LIMIT_EXCEEDED',
    detail: 'Too many authentication attempts. Please try again after 1 minute.',
    timestamp: new Date().toISOString(),
  },
});
```

### E. Database & Schema Design
- **Strengths:**
  - All 34 data entities from SRS catalogue represented in `schema.prisma`.
  - Deterministic foreign key cascade rules (`onDelete: Cascade` for user-owned records, `onDelete: Restrict` for core curriculum taxonomy).
- **Defects:**
  - Missing indexes on high-frequency query paths and foreign keys.
  - Suggestions in code:
```prisma
// Recommended Prisma Schema Index additions
model RevisionSchedule {
  // ... fields
  @@unique([userId, topicId])
  @@index([userId, dueAt])
  @@index([dueAt])
}

model UserProgress {
  // ... fields
  @@unique([userId, topicId])
  @@index([userId, lastStudiedAt])
  @@index([masteryLevel])
}

model Topic {
  // ... fields
  @@index([categoryId])
  @@index([isArchived, orderIndex])
}

model Lesson {
  // ... fields
  @@index([topicId, status])
}

model LessonSection {
  // ... fields
  @@index([lessonId, orderIndex])
}
```

### F. Security (OWASP Top 10)
- **Strengths:**
  - SQL Injection: Fully mitigated via Prisma parameterized queries.
  - XSS: Mitigated via React's default HTML escaping and secure headers via `helmet()`.
  - Authentication: Bcrypt password hashing (cost factor 10), 256-bit crypto session tokens, HTTP-only `sameSite: 'lax'` cookies.
  - BOLA / IDOR: Progress and revision endpoints scope data queries to `req.user.id`.
- **Defects:**
  - Missing rate limiting on `/auth/login` and `/auth/register` creates exposure to brute-force credential stuffing.
  - No origin checking on incoming mutations to guard against unauthorized cross-site requests.
  - Expired sessions are not automatically pruned on user login.

### G. Testing & Quality Assurance
- **Strengths:**
  - 35 unit/integration tests covering auth, curriculum, progress, roadmaps, search, and health.
  - 4 end-to-end browser scenarios in Playwright covering learner registration, roadmap traversal, lesson mental checkpoints, quizzes, practice workspaces, and algorithm visualizers.
- **Defects:**
  - Lack of negative tests asserting rate limiting (429 Too Many Requests).
  - Lack of tests asserting RFC 7807 `application/problem+json` error responses.

### H. DevOps & Infrastructure
- **Strengths:**
  - Working `docker-compose.yml` for local PostgreSQL 16.
  - Fast monorepo builds with Vite and TypeScript project references.
- **Defects:**
  - No production rootless multi-stage `Dockerfile` with `dumb-init` for containerized deployments.
  - No process signal handling (`SIGTERM` / `SIGINT`) in `server.ts` for clean container shutdown.

---

## 4. Prioritized Findings Summary

| ID | Priority | Module | Description | Action Required |
|---|:---:|---|---|---|
| **FIND-001** | **P0** | `apps/api` | Missing Rate Limiting on `/api/v1/auth/*` | Implement express rate limiter middleware |
| **FIND-002** | **P0** | `apps/api` | Broken Route Binding on `/health` Root | Mount `healthRouter` directly to `/health` |
| **FIND-003** | **P0** | `apps/api` | Missing Auth Context on `/curriculum/lessons/:slug` | Add `optionalAuthMiddleware` to route |
| **FIND-004** | **P1** | `prisma` | Missing Query & Foreign Key Indexes | Add Prisma `@@index` annotations across 8 models |
| **FIND-005** | **P1** | `apps/api` | Inconsistent API Response Envelopes in `RoadmapController` | Wrap responses in standard `ApiResponse<T>` |
| **FIND-006** | **P1** | Root Tooling | ESLint 9 Flat Config Incompatibility | Create `eslint.config.mjs` flat configuration |
| **FIND-007** | **P1** | `apps/web` | Raw Zod JSON String Rendered in `AuthModal` | Format client-side validation errors cleanly |
| **FIND-008** | **P1** | `apps/api` | Missing Graceful Shutdown (`SIGTERM`/`SIGINT`) | Add server termination and Prisma disconnect logic |
| **FIND-009** | **P2** | Cross-app | 14 TypeScript `any` Lint Violations | Replace `any` with strict interface definitions |
| **FIND-010** | **P2** | `apps/web` | WCAG 2.2 AA Deficiencies in `Button` Component | Add `aria-busy`, 44px min touch targets, `focus-visible` |
| **FIND-011** | **P2** | `apps/api` | Expired Session Accumulation in Database | Prune expired sessions during auth operations |
| **FIND-012** | **P2** | `apps/api` | Lack of Structured Request Duration Logging | Add HTTP request logging middleware |
| **FIND-013** | **P3** | Infra | Missing Production Rootless Dockerfile | Provide multi-stage Dockerfile with `dumb-init` |
| **FIND-014** | **P3** | Tests | Missing Rate Limit & RFC 7807 Integration Tests | Add test suite coverage for rate limits and error schemas |

