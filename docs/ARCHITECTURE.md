# AkayTheory — System Architecture Documentation

**Document Identifier:** AT-ARCH-001  
**Authoritative Specification Baseline:** `AkayTheory_SRS_v1.4.md`  
**System Architecture:** Modular Monolith in pnpm Workspaces  
**Status:** Verified Phase 1 Architecture  
**Date:** 15 November 2026  

---

## 1. High-Level Architectural Topology

AkayTheory is architected as a **Modular Monolith** organized within a monorepo. It prioritizes runtime simplicity, cohesive domain boundaries, strict end-to-end type safety, and zero premature microservice complexity.

```
┌────────────────────────────────────────────────────────────────────────┐
│                          AkayTheory Client (apps/web)                  │
│  React 18 • Vite • Tailwind CSS • React Flow (@xyflow) • Lucide Icons │
│  Responsive Learning Workspace • Step Visualizers • Dark-First Violet  │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │ HTTP / REST / Cookie Sessions
                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        AkayTheory API (apps/api)                       │
│  Express • TypeScript • RFC 7807 Error Handling • Zod Validation      │
│  Modular Domain Features (Auth, Domains, Lessons, Mastery, Revisions)  │
└──────────────────┬─────────────────────────────────┬───────────────────┘
                   │                                 │
                   ▼                                 ▼
┌──────────────────────────────────────┐  ┌──────────────────────────────┐
│  Shared Contracts (@akaytheory/shared)│  │ Visualization FSM Engine     │
│  TypeScript Types, Schemas, Constants│  │ (@akaytheory/visualizations) │
└──────────────────┬───────────────────┘  └──────────────────────────────┘
                   │
                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     Database Layer (PostgreSQL 16)                     │
│  Prisma ORM • 34 Entities • Referential Restrict • Explicit Migrations │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Monorepo Organization & Workspace Packages

| Package / App | Purpose & Technologies | Exported Capabilities |
|---|---|---|
| `apps/web` | Client application running on React 18, Vite, Tailwind CSS, and React Flow. | Interactive workspace, roadmap canvas, visualizer controllers, accessible list navigation. |
| `apps/api` | Backend REST API server built with Express, TypeScript, helmet, and cookie-parser. | Authentication, lesson serving, quiz evaluation, mastery state calculations, spaced revision queuing. |
| `packages/shared` | Central source of truth for TypeScript types, enums, Zod validation schemas, and constants. | `MasteryLevel`, `RevisionStatus`, `UserRole`, `evaluateMasteryTransition`, `calculateUtcMidnightRevisionDue`. |
| `packages/visualizations` | Headless algorithm state engine and configuration generators. | `StepEngine` finite state machine (play, pause, stepNext, stepPrev, jumpTo, reset) and algorithm step generators (e.g. Binary Search). |
| `prisma/` | Relational datastore specifications, migration files, and development seed scripts. | 34 relational entities, referential integrity rules, and database seeding. |

---

## 3. Communication Patterns & Error Handling

### 3.1 Standard API Envelope
All API endpoints return JSON conforming to the standardized `ApiResponse<T>` envelope:

```typescript
export interface ApiResponse<T> {
  success: true;
  data: T;
  meta?: {
    total?: number;
    page?: number;
    pageSize?: number;
    timestamp: string;
  };
}
```

### 3.2 RFC 7807 Problem Details
All API errors are processed through a centralized middleware (`error.middleware.ts`) and serialized according to RFC 7807:

```json
{
  "success": false,
  "type": "urn:akaytheory:error:validation",
  "title": "Validation Error",
  "status": 400,
  "code": "VALIDATION_FAILED",
  "detail": "The submitted request payload failed schema validation.",
  "instance": "/api/v1/auth/register",
  "invalidParams": [
    {
      "name": "password",
      "reason": "Password must be at least 10 characters"
    }
  ],
  "timestamp": "2026-11-15T06:50:00.000Z"
}
```

---

## 4. Security & Isolation Architecture

1. **Host Isolation Constraint (CON-007, BR-011):** Untrusted learner code is never executed directly on the host application server or database instance. Practice in MVP is handled via self-reported submission records (`DATA-ENT-026`) or external sandboxes.
2. **Session Security (BR-014):** Authentication sessions are stored in PostgreSQL (`Session` table) and identified via cryptographically secure, random tokens stored in HTTP-only, SameSite=Lax cookies. LocalStorage token storage is strictly prohibited. Expired sessions are opportunistically pruned in the background.
3. **Curriculum Immutability (BR-019, DATA-CON-011):** Topics with existing dependencies or learner history reject physical database `DELETE` operations via `onDelete: Restrict`. Decommissioning requires explicit soft-deletion (`isArchived = true`, `status = ARCHIVED`).
4. **Draft-While-Published Isolation (BR-016, AT-012):** Content updates are staged in draft records and isolated from unauthenticated visitor endpoints until explicit publication.
5. **Rate Limiting & Abuse Prevention:** All `/api/v1/auth/*` authentication endpoints enforce strict window throttling (10 requests per minute) to eliminate brute-force attack vectors, and `/api/v1` enforces a 120 req/min global threshold.
6. **Process Signal Lifecycle:** Container shutdown is managed gracefully via `dumb-init` and Node `SIGTERM`/`SIGINT` event listeners, ensuring in-flight requests drain and PostgreSQL connections close cleanly.
7. **Database Indexing Architecture:** High-cardinality foreign keys and temporal sort keys (`RevisionSchedule(userId, dueAt)`, `UserProgress(userId, lastStudiedAt)`) are explicitly indexed in PostgreSQL to maintain sub-10ms query times under production load.

