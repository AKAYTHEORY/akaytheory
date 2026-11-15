# AkayTheory

> **"The way to a better you is you through you."**  
> *"Don't just read about engineering. Understand it, visualize it, interact with it and practice it."*

**AkayTheory** is an independent, production-grade computer science and software engineering learning platform. It combines structured engineering roadmaps, deterministic algorithm visualizations, progressive coding practice, cognitive mastery tracking, and automated spaced revision.

---

## Table of Contents

1. [Monorepo Architecture](#1-monorepo-architecture)
2. [Prerequisites & System Requirements](#2-prerequisites--system-requirements)
3. [Quickstart & Local Development](#3-quickstart--local-development)
4. [Testing & Quality Verification](#4-testing--quality-verification)
5. [API Architecture & Endpoints](#5-api-architecture--endpoints)
6. [Design System & UI/UX Architecture](#6-design-system--uiux-architecture)
7. [Deployment & Container Infrastructure](#7-deployment--container-infrastructure)
8. [Engineering Quality & Remediation Baseline](#8-engineering-quality--remediation-baseline)
9. [Documentation Index](#9-documentation-index)

---

## 1. Monorepo Architecture

AkayTheory is built as a high-performance TypeScript monorepo orchestrated with `pnpm` workspaces:

```text
akaytheory/
├── apps/
│   ├── web/                    # React 18, Vite, Tailwind CSS, Lucide icons (Dark-first UI)
│   └── api/                    # Express 5 modular monolith, Prisma ORM, RFC 7807 error handling
├── packages/
│   ├── shared/                 # Core domain entities, Zod validation schemas, Mastery DFA state machine
│   └── visualizations/         # Headless deterministic StepEngine FSM (Binary Search, Two Pointers, Sliding Window)
├── prisma/
│   ├── schema.prisma           # 34 data entities (DATA-ENT-001 to 034) with optimized indexes & cascades
│   └── seed.ts                 # Idempotent development curriculum & roadmap seeder
├── e2e/                        # Playwright end-to-end browser scenarios (Headless Chrome)
├── docs/                       # Comprehensive engineering documentation & architectural specifications
│   ├── ARCHITECTURE.md         # Domain decomposition, service patterns, and data flow
│   ├── SRS.md                  # Complete Software Requirements Specification (AT-SRS-001 v1.4)
│   ├── DATABASE.md             # Entity relationships, schema dictionary, and indexing strategies
│   ├── API_CONTRACTS.md        # REST endpoint specifications, request payloads, and status codes
│   ├── AUTH_FLOW.md            # Session lifecycle, credential security, and OAuth unlinking rules
│   ├── TESTING.md              # Vitest & Playwright testing strategy and verification protocols
│   ├── DEPLOYMENT.md           # Docker multi-stage builds, rootless containers, and Kubernetes manifests
│   ├── UI_REDESIGN_REPORT.md   # Design tokens, responsive testing, and component architecture
│   ├── ENGINEERING_AUDIT.md    # 9-dimension engineering quality and security baseline audit
│   ├── REMEDIATION_REPORT.md   # Prioritized issue resolution log with before/after benchmarks
│   ├── IMPLEMENTATION_BASELINE.md
│   ├── IMPLEMENTATION_STATUS.md
│   ├── REQUIREMENTS_TRACEABILITY.md
│   └── decisions/              # Architectural Decision Records (ADRs)
├── Dockerfile.api              # Rootless Alpine multi-stage production build for API
├── Dockerfile.web              # Nginx Alpine static web bundle build
└── docker-compose.yml          # PostgreSQL 16 database container definition
```

### Monorepo Workspaces Breakdown

| Package / App | Technology Stack | Responsibility |
| :--- | :--- | :--- |
| `@akaytheory/web` | React 18, Vite, Tailwind CSS | Application shell, engineering roadmaps, interactive lesson reader, practice workspace, algorithm visualizer. |
| `@akaytheory/api` | Express 5, Prisma ORM, Zod | Modular API with rate limiting, session auth, curriculum queries, mastery updates, and spaced revision engine. |
| `@akaytheory/shared` | TypeScript, Zod | Shared interfaces, session contracts, mastery state machine transitions, and validation schemas. |
| `@akaytheory/visualizations` | TypeScript | Pure deterministic finite state machine (`StepEngine`) for step-by-step algorithm walkthroughs. |

---

## 2. Prerequisites & System Requirements

- **Node.js:** `>= 20.0.0` (Verified on Node v20 - v24 LTS)
- **Package Manager:** `pnpm >= 10.0.0`
- **Database:** PostgreSQL 16 (Local native instance or containerized via Docker)
- **Container Engine (Optional):** Docker / Colima with Docker Compose

---

## 3. Quickstart & Local Development

### Step 1: Install Dependencies
```bash
pnpm install
```

### Step 2: Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Default local values:
```env
PORT=4000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/akaytheory_dev?schema=public
SESSION_SECRET=akaytheory_super_secret_local_key_development_only_12345
SESSION_COOKIE_NAME=akaytheory_session
SESSION_TTL_DAYS=30
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=120
AUTH_RATE_LIMIT_MAX_REQUESTS=10
```

### Step 3: Start PostgreSQL Database Container
```bash
# Start container using Docker Compose
docker compose up -d

# On macOS utilizing Colima:
# colima start --cpu 2 --memory 2
# docker compose up -d
```

### Step 4: Synchronize Schema & Seed Curriculum Data
```bash
# Push Prisma schema migrations to PostgreSQL
npx prisma db push

# Run idempotent database seeder (seeds topics, roadmaps, lessons, quizzes, problems)
npx tsx prisma/seed.ts
```

### Step 5: Start Concurrent Development Servers
```bash
pnpm dev
```
- **Web Client:** [http://localhost:5173](http://localhost:5173)
- **Backend API:** [http://localhost:4000](http://localhost:4000)
- **API Health Check:** [http://localhost:4000/health](http://localhost:4000/health)

---

## 4. Testing & Quality Verification

AkayTheory employs an end-to-end verification pipeline spanning static analysis, unit testing, integration testing, and browser automation:

```bash
# 1. Type-Safety: Strict TypeScript compilation across all packages (0 errors)
pnpm type-check

# 2. Code Hygiene: Modern ESLint 9 Flat Config scan (0 errors, 0 warnings)
pnpm lint

# 3. Unit & Integration Tests: 38 Vitest tests across shared, visualizations, and api
pnpm test

# 4. End-to-End Browser Testing: 4 Playwright test suites in Headless Chrome
pnpm test:e2e

# 5. Production Build: Full monorepo production compilation
pnpm build
```

### Test Suite Summary

- **`packages/shared`** (`src/__tests__/mastery.test.ts`): Tests deterministic mastery transitions from `NOT_STARTED` through `MASTERED`, accuracy thresholds ($\ge 80\%$), and anti-regression rules.
- **`packages/visualizations`** (`src/engine/__tests__/StepEngine.test.ts`, `src/algorithms/__tests__/algorithms.test.ts`): Tests forward and backward stepping, boundary conditions, and invariant snapshots across Binary Search, Two Pointers, and Sliding Window.
- **`apps/api`** (`tests/health.test.ts`, `tests/auth.test.ts`, `tests/curriculum.test.ts`, `tests/roadmap.test.ts`, `tests/search.test.ts`, `tests/security.test.ts`): Tests session cookies, draft isolation, rate limiting defense, and spaced revision scheduling.
- **`e2e`** (`auth.spec.ts`, `learning-journey.spec.ts`, `practice-and-search.spec.ts`, `visualizer.spec.ts`): Full browser execution validating authentication, WCAG accessible roadmap navigation, interactive quizzes, progressive hint unlocks, and visualizer controls.

---

## 5. API Architecture & Endpoints

All API endpoints follow a unified response format adhering to RFC 7807 Problem Details for errors:

### Success Envelope (`ApiResponse<T>`)
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "timestamp": "2026-11-15T16:15:00.000Z"
  }
}
```

### Error Envelope (`ApiErrorProblemDetails`)
```json
{
  "success": false,
  "type": "urn:akaytheory:error:validation",
  "title": "Validation Error",
  "status": 400,
  "code": "VALIDATION_FAILED",
  "detail": "The submitted payload failed schema validation.",
  "instance": "/api/v1/auth/register",
  "invalidParams": [{ "name": "password", "reason": "Minimum 8 characters" }],
  "timestamp": "2026-11-15T16:15:00.000Z"
}
```

### Endpoint Catalog

| Namespace | Method | Path | Rate Limit | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **Diagnostics** | `GET` | `/health` | None | Container liveness & readiness health probe |
| **Auth** | `POST` | `/api/v1/auth/register` | 10 req/min | Register user & issue HTTP-only session cookie |
| **Auth** | `POST` | `/api/v1/auth/login` | 10 req/min | Authenticate user credentials & issue session cookie |
| **Auth** | `POST` | `/api/v1/auth/logout` | 10 req/min | Invalidate session and clear session cookie |
| **Auth** | `GET` | `/api/v1/auth/me` | 120 req/min | Retrieve current authenticated user session |
| **Curriculum** | `GET` | `/api/v1/curriculum/domains` | 120 req/min | Retrieve domain taxonomy with categories & topics |
| **Curriculum** | `GET` | `/api/v1/curriculum/lessons/:slug` | 120 req/min | Fetch lesson content with draft isolation protection |
| **Curriculum** | `GET` | `/api/v1/curriculum/problems` | 120 req/min | Filter and browse coding practice problems |
| **Curriculum** | `GET` | `/api/v1/curriculum/problems/:slug` | 120 req/min | Fetch problem specs, examples, constraints & hints |
| **Roadmaps** | `GET` | `/api/v1/roadmaps/:slug` | 120 req/min | Fetch roadmap node graph with computed progress states |
| **Progress** | `POST` | `/api/v1/progress/quiz` | 120 req/min | Submit quiz, evaluate mastery DFA & queue revision |
| **Progress** | `POST` | `/api/v1/progress/problem` | 120 req/min | Submit problem solve & advance topic mastery |
| **Progress** | `GET` | `/api/v1/progress/summary` | 120 req/min | Retrieve learner mastery distribution & due reviews |
| **Search** | `GET` | `/api/v1/search?q={query}` | 120 req/min | Full-text search across topics, lessons, and problems |

---

## 6. Design System & UI/UX Architecture

AkayTheory's frontend adheres to a developer-first dark canvas aesthetic inspired by Linear, Raycast, and GitHub Dark Mode:

### Palette & Design Tokens

- **Canvas Background:** `#0D1117` (`--background`)
- **Card & Container Surface:** `#111827` (`--surface`)
- **Elevated Modals & Cards:** `#161D2A` (`--surface-elevated`)
- **Structural Borders:** `#21262D` (`--border`)
- **Primary / Brand Accent:** `#8B5CF6` (Electric Violet `--primary`)
- **Semantic Statuses:**
  - Success / Mastered: `#22C55E` (`--success`)
  - Warning / In Progress: `#F59E0B` (`--warning`)
  - Danger / Hard Difficulty: `#F43F5E` (`--danger`)
  - Info / Available Nodes: `#38BDF8` (`--info`)

### Core Features & Views

1. **Application Shell (`AppLayout.tsx`, `CommandPalette.tsx`):**
   - Collapsible desktop sidebar categorizing curriculum, revision, and settings.
   - Responsive mobile navigation drawer with smooth sliding animations and backdrop blur.
   - Global `⌘K` Command Palette providing real-time search across topics, lessons, and problems.
2. **Learner Cockpit Dashboard (`DashboardView.tsx`):**
   - **Guest Learner Cockpit:** Frictionless open access for unauthenticated visitors. Provides complete access to explore roadmaps, interactive invariant lessons, algorithm visualizers, and coding practice, with non-intrusive callouts to create an account for progress persistence.
   - **Personalized Telemetry Banner:** Adapts dynamically between guest preview mode and authenticated learner session, highlighting the active focus topic and next study milestones.
   - **Cognitive Mastery Progression:** Four deterministic mastery stages (`Novice`, `Familiar`, `Proficient`, `Mastered`) governed by SuperMemo-aligned retention intervals (1d, 3d, 7d, 21d) with real-time distribution charts.
   - **Spaced Revision Queue:** Real-time queue computing due reviews at UTC midnight, with countdown indicators and an all-caught-up zero cognitive debt card.
3. **Engineering Roadmaps (`RoadmapView.tsx`):**
   - Dual-view switcher: Interactive SVG dependency canvas (`RoadmapCanvas.tsx`) alongside a WCAG 2.2 AA compliant topological milestone timeline (`RoadmapListView.tsx`).
4. **Interactive Lessons (`LessonViewer.tsx`, `QuizWidget.tsx`):**
   - Distraction-free reading view with "Think Before Reveal" mental model checkpoints.
   - Knowledge check quiz widget updating mastery levels upon passing ($\ge 80\%$).
5. **Practice Workspace (`ProblemWorkspace.tsx`):**
   - Two-column engineering workspace with problem specs, constraints, progressive hints disclosure (BR-009), official reference implementation, and integrated code editor.
6. **Algorithm Visualizers (`VisualizerWidget.tsx`):**
   - Clean array visualization with high-contrast element boxes and pointer markers (`L`, `R`, `Mid`).
   - Comprehensive playback toolbar: Play, Pause, Next, Prev, Reset, and adjustable speed controls (0.5x, 1x, 2x).

---

## 7. Deployment & Container Infrastructure

### Production Docker Images

The monorepo contains hardened, rootless Dockerfiles utilizing multi-stage builds and CIS security benchmarks:

- **`Dockerfile.api`**: Node.js 20 Alpine image running under non-root UID `10001` with `dumb-init` process supervisor for clean signal termination.
- **`Dockerfile.web`**: Multi-stage build running Vite production build and serving optimized static assets via Nginx Alpine.

### Building & Running Production Containers
```bash
# Build API image
docker build -t akaytheory-api:latest -f Dockerfile.api .

# Build Web image
docker build -t akaytheory-web:latest -f Dockerfile.web .
```

Full production compose configurations and Kubernetes manifests (`Deployment`, `Service`, `Ingress`, `HorizontalPodAutoscaler`) are documented in [`docs/DEPLOYMENT.md`](file:///Users/akayr/Downloads/DEV/CODING%20CHANNEL/docs/DEPLOYMENT.md).

---

## 8. Engineering Quality & Remediation Baseline

AkayTheory was comprehensively audited across 9 engineering dimensions, yielding an initial score of **84.25/100** and achieving **96.50/100** after production hardening:

| Category | Initial Audit | Post-Remediation | Status |
| :--- | :---: | :---: | :--- |
| **Architecture & Design** | 88 / 100 | **96 / 100** | Strict modular monolith, unified RFC 7807 error envelopes |
| **Code Quality & Type Safety** | 82 / 100 | **98 / 100** | ESLint 9 Flat Config (0 errors), strict TypeScript compilation |
| **Frontend & UI/UX (WCAG)** | 85 / 100 | **96 / 100** | WCAG 2.2 AA compliant list views, 44px touch targets |
| **Backend & API Design** | 84 / 100 | **98 / 100** | Direct `/health` mounting, draft content isolation |
| **Database & Schema Design** | 80 / 100 | **95 / 100** | 34 tables, foreign key & compound query indexes |
| **Security (OWASP Top 10)** | 85 / 100 | **97 / 100** | Throttling (10 req/min auth, 120 req/min global), HTTP-only cookies |
| **Testing & Quality Assurance** | 90 / 100 | **98 / 100** | 38 unit/integration tests, 4 Playwright E2E suites passing |
| **DevOps & Infrastructure** | 75 / 100 | **94 / 100** | Rootless multi-stage Docker builds, Kubernetes manifests |
| **Overall Score** | **84.25 / 100** | **96.50 / 100** | **Production-Grade Standard** |

---

## 9. Documentation Index

Detailed architectural specifications, verification reports, and operational guides are organized within the [`docs/`](docs/) directory:

- [docs/SRS.md](docs/SRS.md) — Complete Software Requirements Specification (AT-SRS-001 v1.4).
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — Detailed architecture, module boundaries, and design patterns.
- [docs/DATABASE.md](docs/DATABASE.md) — Database schema, data dictionary, and foreign key cascade policies.
- [docs/API_CONTRACTS.md](docs/API_CONTRACTS.md) — Exhaustive REST API contract catalogue.
- [docs/AUTH_FLOW.md](docs/AUTH_FLOW.md) — Authentication flow, session handling, and OAuth rules.
- [docs/TESTING.md](docs/TESTING.md) — Testing strategy, execution guides, and E2E scenarios.
- [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) — Production deployment guides, container builds, and Kubernetes manifests.
- [docs/UI_REDESIGN_REPORT.md](docs/UI_REDESIGN_REPORT.md) — Comprehensive visual redesign report and design token reference.
- [docs/ENGINEERING_AUDIT.md](docs/ENGINEERING_AUDIT.md) — Initial engineering audit baseline report.
- [docs/REMEDIATION_REPORT.md](docs/REMEDIATION_REPORT.md) — Issue remediation tracking and verification metrics.
- [docs/REQUIREMENTS_TRACEABILITY.md](docs/REQUIREMENTS_TRACEABILITY.md) — Requirement-to-code traceability matrix.
- [docs/IMPLEMENTATION_BASELINE.md](docs/IMPLEMENTATION_BASELINE.md) — Implementation roadmap, milestone baselines, and technical milestones.
- [docs/IMPLEMENTATION_STATUS.md](docs/IMPLEMENTATION_STATUS.md) — Verification checklist, release status, and capability readiness matrix.
- [docs/decisions/](docs/decisions/) — Architectural Decision Records (ADRs).
