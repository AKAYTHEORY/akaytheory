# AkayTheory — Implementation Baseline & Technical Architecture Baseline

**Document Identifier:** AT-BASE-001  
**Authoritative Baseline:** `AkayTheory_SRS_v1.4.md`  
**Associated Audit Report:** `AkayTheory_SRS_Phase5_Final_Audit_Report.md` (AT-AUD-005)  
**Product Blueprint:** `app.md` (§1–§25)  
**Standard of Verification:** ISO/IEC/IEEE 29148:2018 & Systems Engineering Baseline Standards  
**Status:** Established Phase 0 Implementation Baseline  
**Date:** 15 November 2026  

---

## 1. Documentation Inventory & Authoritative Hierarchy

An exhaustive audit of the repository identified the documentation artifacts below. Every document is classified by its lifecycle status and authority:

| Document Filename | Document Role & Contents | Lines / Size | Lifecycle Status | Authority Level |
|---|---|---|---|---|
| `app.md` | **Original Product Blueprint (§1–§25):** Vision, educational philosophy, 8 domains, learning workspace, visualization engine, daily publishing cadence. | 1,070 lines (39 KB) | Active | **Primary Source of Truth** for product vision, capabilities, and pedagogical philosophy. |
| `AkayTheory_SRS_v1.4.md` | **Software Requirements Specification (SRS v1.4):** 19 functional modules, 34 data entities, 21 business rules, 11 constraints, 14 acceptance test scenarios, deterministic mastery DFA (§3.11.1). | 1,614 lines (216 KB) | Active | **Authoritative Specification Baseline** (supersedes v1.0, v1.1, v1.2, v1.3). |
| `AkayTheory_SRS_Phase5_Final_Audit_Report.md` | **Phase 5 Final Audit & Corrective Reconciliation Report (AT-AUD-005):** Audit findings AUD-001 to AUD-016; records corrections incorporated into v1.4. | 79 lines (8.6 KB) | Active | **Authoritative Verification Record** of document reconciliation and outstanding limitations. |
| `AkayTheory_SRS_v1.3.md` | Phase 4 Reconciled SRS draft. | 1,572 lines (211 KB) | Superseded | Superseded by `AkayTheory_SRS_v1.4.md` (contained stale entity text and lacked explicit mastery table). |
| `AkayTheory_SRS_Phase4_Reconciliation_Report.md` | Phase 4 Reconciliation Report (AT-REC-004). | 196 lines (19.6 KB) | Historical | Historical record of Phase 4 findings. |
| `AkayTheory_SRS_v1.2.md` | Phase 3 SRS draft. | 1,556 lines (208 KB) | Superseded | Superseded by v1.3 and v1.4. |
| `AkayTheory_SRS_Phase3_Verification_Report.md` | Phase 3 Verification Report (AT-VER-003). | 350 lines (34.4 KB) | Historical | Historical record of Phase 3 STRIDE and verification review. |
| `AkayTheory — Software Requirements Specification (SRS).md` | Working in-repo SRS artifact (v1.1 state). | 1,517 lines (200 KB) | Stale / Working Draft | Slated for atomic synchronization with `AkayTheory_SRS_v1.4.md`. |
| `earlierprompt.txt` | Initial prompt sequence and system directives. | 1,027 lines (47 KB) | Historical Reference | Contextual reference only. |
| `refs/APP_BUILDER_TOOLKIT_REPORT.md` | App Builder agent toolkit overview. | 350 lines (18 KB) | Reference | Development agent tooling reference. |

---

## 2. Requirements Summary & System Scope

The authoritative specification `AkayTheory_SRS_v1.4.md` defines a cohesive, production-minded interactive software engineering platform:

### 2.1 Scale of Specification
- **19 Functional Modules:** `PUB`, `AUTH`, `ONB`, `DOM`, `ROADMAP`, `LEARN`, `VIZ`, `PROB`, `PRACTICE`, `DASH`, `PROGRESS`, `REV`, `NOTE`, `SEARCH`, `DAILY`, `CMS`, `SET`, `NOTIF`, `ADMIN`.
- **34 Relational Entities:** `DATA-ENT-001` (User) through `DATA-ENT-034` (RevisionSchedule).
- **21 Business Rules:** `BR-001` through `BR-021` (normative invariant rules).
- **11 Database Constraints:** `DATA-CON-001` through `DATA-CON-011` (referential, cascade, and uniqueness constraints).
- **14 Acceptance Test Scenarios:** `AT-001` through `AT-014` (testable system behavior criteria).

---

## 3. Scope Classification: Approved vs. Conditional Scope

To avoid implementing unapproved assumptions, requirements are strictly divided into **Approved Implementation Scope** and **Conditional Scope**:

### 3.1 Approved Implementation Scope (Unblocked Core)
The following capabilities are approved by the Product Blueprint and unambiguous in `AkayTheory_SRS_v1.4.md`:
1. **Monorepo Foundation & Tooling:** pnpm workspace with TypeScript strict mode, ESLint, Prettier, Prisma, and Docker configurations.
2. **Design System & Shell:** Dark-first, minimalist developer aesthetic with DM Sans typography, CSS variable design tokens, responsive multi-column layouts, and WCAG 2.2 AA accessibility foundation.
3. **Authentication & Session Foundation:** Email/password credentials with Argon2id/bcrypt hashing, session cookies (HTTP-only, SameSite=Lax), atomic verification, session revocation, and OAuth takeover safeguards (`BR-017`, `BR-021`).
4. **Relational Database Model:** PostgreSQL schema encompassing all 34 entities with `RESTRICT` cascades on curriculum graphs (`BR-019`, `DATA-CON-011`), soft deletion (`isArchived`, `status = ARCHIVED`), and unique index on `(userId, topicId)` for revisions.
5. **Deterministic Mastery Progression Engine:** Exact mathematical state transitions according to Section 3.11.1:
   $$\mathcal{M} \in \{\text{NOT\_STARTED}, \text{ATTEMPTED}, \text{FAMILIAR}, \text{PROFICIENT}, \text{MASTERED}\}$$
   - Reading/scrolling bounded to `ATTEMPTED`.
   - Quizzes $\ge 75\%$ for `FAMILIAR`.
   - Practice problem completion for `PROFICIENT`.
   - Two consecutive spaced reviews $\ge 80\%$ for `MASTERED`.
   - Downward transition to `PROFICIENT` on revision failure $< 80\%$.
   - Fixed intervals: 3d, 7d, 21d normalized to UTC midnight; 1d retry on failure.
6. **Learning Workspace & Content Delivery:** 3-column desktop layout (TOC / Lesson Prose / Visualizer & Code), responsive mobile drawer, 19 lesson sections, think-before-reveal blocks.
7. **Interactive Visualization Engine:** Configuration-driven step engine (Array, Linear Search, Binary Search, Two Pointers, Sliding Window, Stack, Queue) with Play, Pause, Step Next/Prev, Speed Slider, and variable inspection.
8. **Coding Problem Experience:** Problem presentation, test case examples, progressive hint disclosure, complexity analysis, and self-reported practice without running untrusted user code on the host server (`CON-007`).
9. **Learner Tools & Notes:** Personal markdown notes, bookmarks, daily focal lesson, and global Cmd+K full-text search.

### 3.2 Conditional Scope & Outstanding Product Owner Decisions
The following three policies are formally classified as **PENDING PRODUCT OWNER APPROVAL**. Until confirmed, the system must implement flexible, non-breaking abstractions rather than hardcoded assumptions:

```typescript
// Proposed Configuration Abstraction for Conditional Scope

export interface ProductOwnerDecisions {
  /**
   * DEC-01: MVP Launch Domain Scope
   * Option 1: Dual-Domain Anchor (DSA + System Design Foundations) [Recommended]
   * Option 2: All 8 Domains seeded simultaneously
   */
  launchDomainScope: 'DUAL_DOMAIN_ANCHOR' | 'ALL_EIGHT_DOMAINS';

  /**
   * DEC-02: Onboarding Flow Budget
   * Option 1: Maximum 6 screens, target <= 90 seconds, skippable [Recommended]
   * Option 2: Extended diagnostic assessment (> 6 screens)
   */
  onboardingBudget: {
    maxScreens: number; // 6
    targetDurationSeconds: number; // 90
    allowSkip: boolean; // true
  };

  /**
   * DEC-03: CMS Editorial Review Model
   * Option 1: Unified Author/Publisher self-review in MVP; 4-eyes separation in P2 [Recommended]
   * Option 2: Enforce strict multi-person 4-eyes approval even in MVP
   */
  cmsEditorialModel: 'UNIFIED_SELF_REVIEW_MVP' | 'STRICT_FOUR_EYES';
}

export const DEFAULT_PROPOSED_DECISIONS: ProductOwnerDecisions = {
  launchDomainScope: 'DUAL_DOMAIN_ANCHOR',
  onboardingBudget: {
    maxScreens: 6,
    targetDurationSeconds: 90,
    allowSkip: true,
  },
  cmsEditorialModel: 'UNIFIED_SELF_REVIEW_MVP',
};
```

---

## 4. Open Technical Issues & Recommended Architecture Choices

To unblock development without locking in fragile dependencies, the technical recommendations are defined below with code contracts:

### 4.1 Authentication Architecture (OI-01)
- **Recommendation:** Implement an Express modular auth service following Better-Auth/Lucia-style token & session lifecycle, with PostgreSQL `Session` and `Account` tables, Argon2id/bcrypt password hashing, and signed HTTP-only cookies.
- **Code Representation:**

```typescript
// packages/shared/src/types/auth.ts
export interface SessionUser {
  id: string;
  email: string;
  username: string;
  displayName: string;
  role: 'LEARNER' | 'CONTENT_AUTHOR' | 'CONTENT_REVIEWER' | 'CONTENT_PUBLISHER' | 'CONTENT_ADMINISTRATOR' | 'SYSTEM_ADMINISTRATOR';
  isEmailVerified: boolean;
}

export interface AuthSession {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  ipAddress: string | null;
  userAgent: string | null;
}
```

### 4.2 Roadmap Graph Renderer (OI-02)
- **Recommendation:** Use **React Flow (@xyflow/react)** for the canvas interactive roadmap, paired with a semantic HTML `<ol>` list view fallback for mobile and screen-reader accessibility (`FR-ROADMAP-014`, `NFR-A11Y-001`).

### 4.3 Database Integrity & Archive Model (DATA-CON-011, BR-019)
- **Recommendation:** Use Prisma ORM with strict referential constraints. Deletions on topics are prevented via `RESTRICT`; decommissioning is managed via explicit soft-delete.
- **Prisma Schema Excerpt:**

```prisma
// Topic referential safety (prisma/schema.prisma)
enum TopicStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}

model Topic {
  id            String       @id @default(uuid())
  slug          String       @unique
  title         String
  categoryId    String
  category      Category     @relation(fields: [categoryId], references: [id], onDelete: Restrict)
  status        TopicStatus  @default(DRAFT)
  isArchived    Boolean      @default(false)
  createdAt     DateTime     @default(now())
  updatedAt     DateTime     @updatedAt

  // Restrict deletions to preserve topological history
  dependenciesAsPrereq  TopicDependency[] @relation("PrereqTopic")
  dependenciesAsDep     TopicDependency[] @relation("DependentTopic")
  lessons               Lesson[]
  userProgress          UserProgress[]
  revisionSchedules     RevisionSchedule[]
  masteryAssessments    MasteryAssessment[]
}

model TopicDependency {
  id                   String   @id @default(uuid())
  prerequisiteTopicId String
  dependentTopicId     String
  relationshipType     String   @default("DIRECT_PREREQUISITE")
  createdAt            DateTime @default(now())

  prerequisiteTopic    Topic    @relation("PrereqTopic", fields: [prerequisiteTopicId], references: [id], onDelete: Restrict)
  dependentTopic       Topic    @relation("DependentTopic", fields: [dependentTopicId], references: [id], onDelete: Restrict)

  @@unique([prerequisiteTopicId, dependentTopicId])
}
```

---

## 5. Technical Architecture & Monorepo Layout

The platform is structured as a **Modular Monolith** in a pnpm monorepo:

```text
akaytheory/
├── apps/
│   ├── web/                    # React 18, Vite, Tailwind CSS, React Router, React Flow
│   │   ├── src/
│   │   │   ├── app/            # Application bootstrap & providers
│   │   │   ├── components/     # Design system (Button, Dialog, Input, Card, Tabs, etc.)
│   │   │   ├── features/       # Feature modules (auth, roadmap, learning, visualizer, revision)
│   │   │   ├── layouts/        # Shell layouts (MarketingLayout, AppLayout, WorkspaceLayout)
│   │   │   ├── routes/         # Route definitions
│   │   │   ├── lib/            # API client, storage, telemetry utilities
│   │   │   └── styles/         # Tailwind CSS & design tokens
│   │   ├── index.html
│   │   ├── vite.config.ts
│   │   └── package.json
│   │
│   └── api/                    # Node.js, Express, TypeScript modular backend
│       ├── src/
│       │   ├── config/         # Environment variables & constants
│       │   ├── middleware/     # Auth, session, rate-limiting, error handler (RFC 7807)
│       │   ├── modules/        # Domain modules (auth, topics, lessons, progress, revisions, etc.)
│       │   ├── routes/         # API v1 route aggregator
│       │   ├── utils/          # Logger, crypto, time utilities
│       │   └── server.ts       # Server initialization & graceful shutdown
│       ├── tsconfig.json
│       └── package.json
│
├── packages/
│   ├── shared/                 # Domain types, Zod schemas, constants, contracts
│   │   ├── src/
│   │   │   ├── schemas/        # Zod request/response validation schemas
│   │   │   ├── types/          # Core TypeScript domain entities & enums
│   │   │   └── constants/      # Mastery thresholds, revision intervals, intervals
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   └── visualizations/         # Headless visualization state machine & canvas components
│       ├── src/
│       │   ├── engine/         # Step-based finite state machine (play, pause, next, prev)
│       │   ├── algorithms/     # Array, Two Pointers, Binary Search, Sliding Window configs
│       │   └── components/     # Pure presentation renderers
│       ├── tsconfig.json
│       └── package.json
│
├── prisma/
│   ├── schema.prisma           # 34 entities, indexes, and referential constraints
│   ├── seed.ts                 # Idempotent development seed script (DSA + System Design)
│   └── migrations/             # SQL migrations
│
├── docs/
│   ├── IMPLEMENTATION_BASELINE.md
│   ├── REQUIREMENTS_TRACEABILITY.md
│   ├── IMPLEMENTATION_STATUS.md
│   ├── ARCHITECTURE.md
│   ├── DATABASE.md
│   ├── AUTH_FLOW.md
│   └── API_CONTRACTS.md
│
├── docker-compose.yml          # PostgreSQL 16 container for local development
├── package.json                # Root package with monorepo scripts
├── pnpm-workspace.yaml         # Workspace configuration
├── tsconfig.base.json          # Shared strict TypeScript configuration
├── .eslintrc.json              # Shared linting rules
├── .prettierrc                 # Formatting rules
├── .env.example                # Environment variables template
└── README.md
```

### 5.1 Standardized API Contract & Centralized Error Envelope
All API endpoints return a standardized payload adhering to RFC 7807 Problem Details for errors:

```typescript
// packages/shared/src/types/api.ts

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

export interface ApiErrorProblemDetails {
  success: false;
  type: string;        // URI identifier (e.g., "urn:akaytheory:error:unauthorized")
  title: string;       // Human-readable summary
  status: number;      // HTTP status code
  detail: string;      // Specific error description
  instance: string;    // Request path
  code: string;        // Machine-readable code (e.g., "INVALID_CREDENTIALS")
  invalidParams?: Array<{
    name: string;
    reason: string;
  }>;
  timestamp: string;
}
```

---

## 6. Phased Implementation Roadmap

Development will proceed in strict order through 14 phases. Each phase requires clean builds, passing tests, and updated status documentation before proceeding to the next:

1. **Phase 0 — Repository & Documentation Audit:** Establish baseline, traceability matrix, and status tracking (Current).
2. **Phase 1 — Project Foundation:** Monorepo scaffolding, TypeScript strict mode, shared packages, Prisma schema, API server bootstrap with health checks, Vite client bootstrap.
3. **Phase 2 — Design System & Application Shell:** Semantic design tokens (violet/slate dark-first theme), DM Sans typography, reusable UI library (buttons, inputs, dialogs, cards), responsive navigation layouts.
4. **Phase 3 — Authentication & User Foundation:** Email/password registration, login, logout, session management with HTTP-only cookies, password reset, account verification, and OAuth linking protection (`BR-017`, `BR-021`).
5. **Phase 4 — Database & Core Domain:** Full 34-entity Prisma schema, referential constraints, soft-deletion handling, and idempotent development seed.
6. **Phase 5 — Learning Content & CMS:** Category, Topic, Lesson, and Section authoring APIs; draft-published revision isolation (`FR-CMS-018`); content status workflows.
7. **Phase 6 — Learning Experience:** 3-column learning workspace, lesson prose renderer, table of contents, think-before-reveal blocks, prerequisite validation.
8. **Phase 7 — Interactive Visualization Engine:** Step-based FSM, play/pause/reset controls, variable inspector, step counters, and DSA visualizations (Binary Search, Two Pointers, Sliding Window).
9. **Phase 8 — Roadmaps & Knowledge Graph:** Interactive canvas via React Flow, accessible `<ol>` list view fallback, node status decorators, and prerequisite traversal.
10. **Phase 9 — Practice & Interview Preparation:** Problem catalog, difficulty filters, progressive hints, code solutions, complexity analysis, and self-reported practice submissions.
11. **Phase 10 — Progress, Mastery & Revision Engine:** Mastery transition DFA (§3.11.1), quiz submission evaluation, fixed-interval UTC revision scheduling (`BR-020`), and downward reassessment transitions.
12. **Phase 11 — Learner Dashboard & Personalization:** Personalized dashboard, continue learning queue, spaced revision queue, weak-area detection, and user preference management.
13. **Phase 12 — Search & Discovery:** Global Cmd+K search dialog, PostgreSQL full-text search indexing across topics, lessons, and problems.
14. **Phase 13 — Quality, Security & Verification:** Test suites (unit, integration, a11y, performance benchmarks), security audit, and final baseline verification.

---

## 7. Risks, Assumptions, & Mitigations

| Risk ID | Identified Risk | Impact | Concrete Architectural Mitigation |
|---|---|---|---|
| **RSK-01** | Local Docker daemon is currently not running in the developer environment. | PostgreSQL container cannot be started directly via `docker compose`. | Configure backend with flexible database connection string; support both local PostgreSQL instance or hosted development database (Neon / Supabase) via `.env`, or provide standalone SQLite adapter for zero-dependency unit tests. |
| **RSK-02** | Unresolved Product Owner Decisions (`DEC-01`, `DEC-02`, `DEC-03`). | Hardcoding policies could cause breaking changes if rejected. | Encapsulate decision logic in config files (`DECISIONS.ts`) with clear defaults; do not enforce multi-party 4-eyes approval as a hard blocking gate in MVP code. |
| **RSK-03** | Complex visualization state bugs and desynchronization. | Confusing learner experience or UI crashes during step scrubbing. | Model visualizations as pure deterministic state reducers: `state = reduce(initialState, stepEvents[0..stepIndex])`. Avoid side-effectful imperativeness. |
| **RSK-04** | Security vulnerabilities in user code execution. | Host system compromise. | Strict zero-host-execution constraint (`CON-007`): No untrusted user code runs on backend servers in MVP; practice is validated via self-reporting or external links. |
| **RSK-05** | Cascading deletion destroying historical learner mastery. | Irreversible learner data loss. | Database `RESTRICT` on all topic and curriculum foreign keys (`BR-019`, `DATA-CON-011`). Topics are retired strictly via soft-delete (`isArchived = true`, `status = ARCHIVED`). |

---

## 8. Acceptance & Verification Strategy

All modules are subject to automated verification:
1. **Static Analysis:** `tsc --noEmit` across all workspaces; ESLint rules forbidding `any`, `@ts-ignore`, and unused imports.
2. **Unit Tests:** Vitest suites for mastery state machine transitions, revision due date calculations (UTC midnight normalization), and Zod schema validation.
3. **Integration Tests:** Supertest suites for authentication flows, session revocation, rate-limiting, and CMS publication isolation.
4. **Accessibility Tests:** Automated Axe-core assertions (`@axe-core/react`) ensuring zero critical or serious WCAG 2.2 AA violations.
5. **Contract Verification:** Schema validation tests ensuring frontend API clients and backend endpoints remain 100% synchronized with `packages/shared`.

