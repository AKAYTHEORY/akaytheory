# AkayTheory — Requirements Traceability Matrix (RTM)

**Document Identifier:** AT-RTM-001  
**Authoritative Baseline:** `AkayTheory_SRS_v1.4.md`  
**Purpose:** End-to-end bidirectional traceability connecting formal requirements to application modules, database schemas, and test suites.  
**Status:** Phase 0 Baseline Matrix  
**Date:** 15 November 2026  

---

## 1. Functional Requirements to Module & Test Mapping

| Requirement ID | Module Name | Phase | Implementation Target File(s) | Verification & Test Target |
|---|---|---|---|---|
| **FR-PUB-001 to 008** | Public & Marketing | Phase 2 | `apps/web/src/pages/LandingPage.tsx`, `apps/web/src/layouts/MarketingLayout.tsx` | Vitest / RTL: Landing navigation, hero render, responsive navbar test |
| **FR-AUTH-001 to 007** | Registration & Credentials | Phase 3 | `apps/api/src/modules/auth/auth.service.ts`, `apps/api/src/modules/auth/auth.controller.ts` | Supertest: User registration, email format validation, duplicate email rejection |
| **FR-AUTH-008 to 013** | Session Management & Cookies | Phase 3 | `apps/api/src/middleware/auth.middleware.ts`, `apps/api/src/modules/auth/session.service.ts` | Integration: HTTP-only cookie issuance, session expiration, token verification |
| **FR-AUTH-014 to 019** | Role-Based Access Control | Phase 3 | `apps/api/src/middleware/rbac.middleware.ts`, `packages/shared/src/types/auth.ts` | Unit/Integration: RBAC route gating for Learner, Author, Admin roles |
| **FR-AUTH-020 to 021** | OAuth Safeguards & Unlinking | Phase 3 | `apps/api/src/modules/auth/oauth.service.ts` | Integration: `AT-011` (OAuth pre-reg takeover defense) and `AT-014` (Unlinking safeguard) |
| **FR-ONB-001 to 008** | Onboarding Flow | Phase 2, 11 | `apps/web/src/features/onboarding/OnboardingFlow.tsx`, `apps/api/src/modules/users/user.service.ts` | RTL: Step progress, skippability check, preferences persistence |
| **FR-DOM-001 to 010** | Curricular Domains & Taxonomy | Phase 4, 6 | `apps/api/src/modules/domains/domain.service.ts`, `apps/web/src/features/domains/DomainExplore.tsx` | Prisma: Foreign key cascades, Category/Topic hierarchical retrieval |
| **FR-ROADMAP-001 to 013** | Roadmap Graph Rendering | Phase 8 | `apps/web/src/features/roadmaps/RoadmapCanvas.tsx`, `packages/shared/src/types/roadmap.ts` | RTL / React Flow: Node rendering, minimap pan/zoom, edge traversal |
| **FR-ROADMAP-014 to 022** | Accessible List View & Prereqs | Phase 8 | `apps/web/src/features/roadmaps/RoadmapListView.tsx`, `apps/api/src/modules/roadmaps/roadmap.service.ts` | Axe-core: Screen reader navigation; Unit: topological sort prerequisite check |
| **FR-LEARN-001 to 010** | Learning Workspace & Sections | Phase 6 | `apps/web/src/features/learning/LearningWorkspace.tsx`, `apps/web/src/features/learning/LessonProse.tsx` | RTL: 3-column layout, table of contents scroll-spy, think-before-reveal toggle |
| **FR-LEARN-011 to 019** | Lesson Navigation & Progress | Phase 6 | `apps/web/src/features/learning/LessonNavigation.tsx`, `apps/api/src/modules/lessons/lesson.service.ts` | Integration: Reading progress tracking (`ATTEMPTED` state transition) |
| **FR-VIZ-001 to 006** | Visualization State Engine | Phase 7 | `packages/visualizations/src/engine/StepEngine.ts`, `packages/visualizations/src/engine/types.ts` | Vitest: Step FSM (play, pause, next, prev, jump, speed adjustment) |
| **FR-VIZ-007 to 012** | Core Algorithmic Visualizers | Phase 7 | `packages/visualizations/src/algorithms/`, `apps/web/src/features/visualizers/VisualizerContainer.tsx` | RTL: Binary search pointer tracking, two pointers step highlighting |
| **FR-PROB-001 to 015** | Problem Catalog & Details | Phase 9 | `apps/api/src/modules/problems/problem.service.ts`, `apps/web/src/features/problems/ProblemCatalog.tsx` | Integration: Problem filtering by difficulty, tag search, progressive hints |
| **FR-PRACTICE-001 to 010**| Practice Submission & Tracking | Phase 9 | `apps/web/src/features/practice/PracticeWorkspace.tsx`, `apps/api/src/modules/submissions/submission.service.ts`| Unit: Self-reported submission validation, code editor integration |
| **FR-PROGRESS-001 to 008**| Mastery Progression Engine | Phase 10 | `apps/api/src/modules/mastery/mastery.engine.ts`, `packages/shared/src/constants/mastery.ts` | Vitest: `TC-MAS-01` to `TC-MAS-03` (quiz score thresholds, downward transitions) |
| **FR-REV-001 to 012** | Spaced Repetition Scheduling | Phase 10 | `apps/api/src/modules/revisions/revision.service.ts`, `apps/api/src/modules/revisions/revision.cron.ts` | Vitest: `AT-013` (3d, 7d, 21d UTC midnight normalization, failed review queue) |
| **FR-NOTE-001 to 008** | Learner Notes & Bookmarks | Phase 11 | `apps/api/src/modules/notes/note.service.ts`, `apps/web/src/features/notes/NotesDrawer.tsx` | Integration: Note creation, polymorphic resource attachment, markdown formatting |
| **FR-SEARCH-001 to 012**| Global Cmd+K Search | Phase 12 | `apps/api/src/modules/search/search.service.ts`, `apps/web/src/components/search/CommandPalette.tsx` | RTL / Integration: Keyboard shortcut trigger, debounced full-text search |
| **FR-DAILY-001 to 008** | Daily Content & Focal Lesson | Phase 6, 11 | `apps/api/src/modules/daily/daily.service.ts`, `apps/web/src/features/daily/DailyChallengeCard.tsx` | Integration: Daily UTC challenge rotation, streak tracking |
| **FR-CMS-001 to 019** | Content Management & Workflows | Phase 5 | `apps/api/src/modules/cms/cms.service.ts`, `apps/web/src/features/admin/ContentEditor.tsx` | Integration: `AT-012` (Draft-published isolation, atomic publishing) |
| **FR-SET-001 to 010** | User Preferences & Privacy | Phase 3, 11 | `apps/api/src/modules/users/settings.service.ts`, `apps/web/src/pages/SettingsPage.tsx` | Integration: `AT-010` (GDPR data erasure, anonymization of learning history) |
| **FR-NOTIF-001 to 006** | System Notifications | Phase 11 | `apps/api/src/modules/notifications/notification.service.ts` | Integration: In-app notification creation, read status marking |
| **FR-ADMIN-001 to 008**| Platform Administration | Phase 5, 13 | `apps/api/src/modules/admin/admin.service.ts`, `apps/web/src/features/admin/AdminDashboard.tsx` | Supertest: Admin audit logging, user role management |

---

## 2. Business Rules (BR-001 to BR-021) Traceability

| Rule ID | Rule Summary | Enforcing Layer & Code File | Test Scenario |
|---|---|---|---|
| **BR-001** | Content Accessibility Before Auth | API route permissions / `auth.middleware.ts` | Public access test: visitor reads lesson without login |
| **BR-002** | Prerequisite Roadmaps Gating | Service logic / `roadmap.service.ts` | Visual warning check when accessing uncompleted prereq |
| **BR-003** | Evidence-Driven Mastery | Engine / `mastery.engine.ts` | `TC-MAS-01`: Reading does not trigger mastery; quiz does |
| **BR-004** | Daily Lesson Universal Availability | Service / `daily.service.ts` | Unauthenticated visitor can access daily challenge |
| **BR-005** | Content Release Independence | CMS service / `cms.service.ts` | CMS update requires 0 application code redeployments |
| **BR-006** | Non-Punitive Learning Metrics | Engine / `mastery.engine.ts` | Mastery never degrades from time decay alone |
| **BR-007** | User Data Privacy & Erasure | Service / `settings.service.ts` | `AT-010`: Full account erasure deletes personal records |
| **BR-008** | Visualizer Config-Driven Declarative | Visualizer Engine / `StepEngine.ts` | Validates visualization schema without runtime JS eval |
| **BR-009** | Progressive Hint Revelation | Frontend / `ProblemHints.tsx` | Hint 2 remains locked until Hint 1 is revealed |
| **BR-010** | Session Revocation on Password Reset | Auth service / `auth.service.ts` | Global session revocation test on password change |
| **BR-011** | Zero Host Code Execution | Architecture constraint / `CON-007` | Verifies no untrusted code execution endpoint exists |
| **BR-012** | Cross-Domain Taxonomy Separation | Domain service / `domain.service.ts` | Cross-listing uses `CrossDomainLink` without duplicate entities |
| **BR-013** | Roadmap Node State Derivation | Service / `roadmap.service.ts` | Maps `masteryLevel` + prereqs to `nodeState` |
| **BR-014** | Force Logout on Credential Mutation | Auth service / `session.service.ts` | Active session cookie rejected after password reset |
| **BR-015** | CMS Author Least Privilege | RBAC middleware / `rbac.middleware.ts` | Content Author cannot read user auth logs or mutate users |
| **BR-016** | Draft Isolation from Public API | API route filters / `lesson.service.ts` | `AT-012`: Visitor receives 404 on draft lesson slug |
| **BR-017** | OAuth Takeover Password Purge | OAuth service / `oauth.service.ts` | `AT-011`: Unverified password purged upon OAuth link |
| **BR-018** | Minimum Passing Quiz Threshold | Quiz service / `quiz.service.ts` | Scores $< 75\%$ reject `FAMILIAR` mastery transition |
| **BR-019** | Topic Graph Deletion Restriction | Prisma schema / `DATA-CON-011` | Deleting topic with dependencies throws Foreign Key Error |
| **BR-020** | Spaced Revision UTC Midnight Anchor | Revision service / `revision.service.ts` | `AT-013`: All revision `dueAt` timestamps set to `00:00:00Z` |
| **BR-021** | OAuth Unlinking Password Requirement| Auth service / `auth.service.ts` | `AT-014`: Unlinking OAuth blocked if no password hash exists |

---

## 3. Database Entities (DATA-ENT-001 to 034) Traceability

All 34 entities are codified in `prisma/schema.prisma`:

| Entity Range | Domain Area | Entities Included | Implementation Model |
|---|---|---|---|
| **DATA-ENT-001 to 004** | Identity & Security | User, Account, Session, Role | `model User`, `model Account`, `model Session`, `model Role` |
| **DATA-ENT-005 to 009** | Curriculum Graph | Domain, Category, Topic, TopicDependency, CrossDomainLink | `model Domain`, `model Category`, `model Topic`, `model TopicDependency`, `model CrossDomainLink` |
| **DATA-ENT-010 to 012** | Roadmaps | Roadmap, RoadmapNode, RoadmapEdge | `model Roadmap`, `model RoadmapNode`, `model RoadmapEdge` |
| **DATA-ENT-013 to 016** | Lessons & Visualizations | Lesson, LessonSection, LessonTemplate, VisualizationConfig | `model Lesson`, `model LessonSection`, `model LessonTemplate`, `model VisualizationConfig` |
| **DATA-ENT-017 to 019** | Problem Library | Problem, ProblemTag, ProblemToTag | `model Problem`, `model ProblemTag`, `model ProblemToTag` |
| **DATA-ENT-020 to 023** | Assessments & Mastery | Question, QuizOption, UserProgress, MasteryAssessment | `model Question`, `model QuizOption`, `model UserProgress`, `model MasteryAssessment` |
| **DATA-ENT-024 to 026** | Practice & Workspace | Bookmark, Note, Submission | `model Bookmark`, `model Note`, `model Submission` |
| **DATA-ENT-027 to 034** | Operations & Cadence | DailyChallenge, MediaAsset, ContentPublication, LearningActivity, UserPreference, AuditLog, Notification, RevisionSchedule | `model DailyChallenge`, `model MediaAsset`, `model ContentPublication`, `model LearningActivity`, `model UserPreference`, `model AuditLog`, `model Notification`, `model RevisionSchedule` |

---

## 4. Acceptance Test Scenarios (AT-001 to AT-014) Mapping

| Test ID | Scenario Name | Test Framework | Execution File | Target Phase |
|---|---|---|---|---|
| **AT-001** | First-Time User Registration & Onboarding | Playwright E2E | `apps/web/tests/e2e/onboarding.spec.ts` | Phase 2, 3 |
| **AT-002** | Unauthenticated Public Learning Access | Playwright E2E | `apps/web/tests/e2e/public-access.spec.ts` | Phase 6 |
| **AT-003** | Interactive Roadmap Canvas Navigation | Playwright / RTL | `apps/web/src/features/roadmaps/__tests__/RoadmapCanvas.test.tsx` | Phase 8 |
| **AT-004** | Algorithmic Step-Through Controls | Vitest / RTL | `packages/visualizations/src/engine/__tests__/StepEngine.test.ts` | Phase 7 |
| **AT-005** | Progressive Problem Solving & Hints | RTL / Component | `apps/web/src/features/problems/__tests__/ProblemWorkspace.test.tsx`| Phase 9 |
| **AT-006** | Evidence-Driven Mastery Progression | Vitest Unit | `apps/api/src/modules/mastery/__tests__/mastery.engine.test.ts` | Phase 10 |
| **AT-007** | WCAG 2.2 AA Automated Accessibility | Axe-core Vitest | `apps/web/tests/a11y/accessibility.spec.ts` | Phase 2, 13 |
| **AT-008** | Core Web Vitals Benchmark | Playwright Audit| `apps/web/tests/perf/web-vitals.spec.ts` | Phase 13 |
| **AT-009** | Security Audit (Rate Limits, CSRF, XSS) | Supertest / OWASP| `apps/api/tests/security/security.test.ts` | Phase 3, 13 |
| **AT-010** | GDPR User Data Erasure & Privacy | Integration DB | `apps/api/tests/privacy/erasure.test.ts` | Phase 3, 13 |
| **AT-011** | OAuth Pre-Registration Takeover Defense | Supertest Auth | `apps/api/src/modules/auth/__tests__/oauth.takeover.test.ts` | Phase 3 |
| **AT-012** | CMS Draft Isolation & Atomic Publish | Integration CMS | `apps/api/src/modules/cms/__tests__/cms.publish.test.ts` | Phase 5 |
| **AT-013** | Spaced Revision Queueing (UTC Midnight) | Vitest Service | `apps/api/src/modules/revisions/__tests__/revision.test.ts` | Phase 10 |
| **AT-014** | OAuth Unlinking Credential Safeguard | Supertest Auth | `apps/api/src/modules/auth/__tests__/oauth.unlink.test.ts` | Phase 3 |

