# AkayTheory — Database Architecture & Data Dictionary

**Document Identifier:** AT-DATA-001  
**Database Engine:** PostgreSQL 16  
**ORM:** Prisma ORM  
**Total Entities Reconciled:** 34  
**Authoritative Reference:** `AkayTheory_SRS_v1.4.md` (Section 5)  
**Status:** Verified Phase 1 Database Specification  
**Date:** 15 November 2026  

---

## 1. Entity Catalogue & Functional Domains

| Domain Range | Entity Name | Prisma Model | Primary Purpose & Key Columns |
|---|---|---|---|
| **Identity & Security (4)** | User (`DATA-ENT-001`) | `User` | User profile, role, password hash, email verification status. |
| | Account (`DATA-ENT-002`) | `Account` | OAuth identity provider links (Google, credentials). |
| | Session (`DATA-ENT-003`) | `Session` | Active user sessions, tokens, IP address, user agent, expiration. |
| | Role (`DATA-ENT-004`) | `Role` | RBAC role definitions and granular permission lists. |
| **Curriculum Graph (5)** | Domain (`DATA-ENT-005`) | `Domain` | Top-level learning areas (e.g. DSA, System Design). |
| | Category (`DATA-ENT-006`) | `Category` | Intermediate concept groupings within a domain. |
| | Topic (`DATA-ENT-007`) | `Topic` | Core learnable concept; soft-deletable (`isArchived`, `status`). |
| | TopicDependency (`DATA-ENT-008`) | `TopicDependency` | Directed prerequisite graph connecting topics (`RESTRICT` cascade). |
| | CrossDomainLink (`DATA-ENT-009`) | `CrossDomainLink` | Cross-domain analogical connections. |
| **Roadmaps (3)** | Roadmap (`DATA-ENT-010`) | `Roadmap` | Directed curriculum roadmaps (Master Engineering, Domain). |
| | RoadmapNode (`DATA-ENT-011`) | `RoadmapNode` | Visual canvas coordinate node representing a category/topic. |
| | RoadmapEdge (`DATA-ENT-012`) | `RoadmapEdge` | Visual graph edge connecting nodes (`REQUIRED`, `OPTIONAL`). |
| **Lessons & Visualizations (4)** | Lesson (`DATA-ENT-013`) | `Lesson` | Published/draft lesson container attached to a topic. |
| | LessonSection (`DATA-ENT-014`) | `LessonSection` | Granular content section (Prose, Walkthrough, Visualizer). |
| | LessonTemplate (`DATA-ENT-015`) | `LessonTemplate` | Reusable section layout template. |
| | VisualizationConfig (`DATA-ENT-016`) | `VisualizationConfig` | Parameter configuration for interactive step visualizers. |
| **Problem Library (3)** | Problem (`DATA-ENT-017`) | `Problem` | Practice problem statement, examples, constraints, hints. |
| | ProblemTag (`DATA-ENT-018`) | `ProblemTag` | Categorical tag (e.g., Array, Two-Pointers, Sliding-Window). |
| | ProblemToTag (`DATA-ENT-019`) | `ProblemToTag` | M:N join table between problems and tags. |
| **Assessments & Mastery (4)** | Question (`DATA-ENT-020`) | `Question` | Multiple-choice knowledge-check question attached to a lesson. |
| | QuizOption (`DATA-ENT-021`) | `QuizOption` | Answer options with correctness indicator. |
| | UserProgress (`DATA-ENT-022`) | `UserProgress` | Learner mastery level per topic (`NOT_STARTED` to `MASTERED`). |
| | MasteryAssessment (`DATA-ENT-023`) | `MasteryAssessment` | Append-only evidence audit log of quizzes and revisions. |
| **Learner Practice (3)** | Bookmark (`DATA-ENT-024`) | `Bookmark` | Saved resources (topic, lesson, problem). |
| | Note (`DATA-ENT-025`) | `Note` | Personal markdown note attached to a learning resource. |
| | Submission (`DATA-ENT-026`) | `Submission` | Problem practice submission records (self-reported/verified). |
| **Operations & Cadence (8)** | DailyChallenge (`DATA-ENT-027`) | `DailyChallenge` | Daily featured topic challenge normalized to UTC midnight. |
| | MediaAsset (`DATA-ENT-028`) | `MediaAsset` | Media files, diagrams, and static images. |
| | ContentPublication (`DATA-ENT-029`) | `ContentPublication` | Audit record of publishing actions. |
| | LearningActivity (`DATA-ENT-030`) | `LearningActivity` | User activity telemetry log (anonymized on account erasure). |
| | UserPreference (`DATA-ENT-031`) | `UserPreference` | Theme, explanation depth, and learning goal preferences. |
| | AuditLog (`DATA-ENT-032`) | `AuditLog` | Security audit log for authentication and administrative actions. |
| | Notification (`DATA-ENT-033`) | `Notification` | In-app user notifications. |
| | RevisionSchedule (`DATA-ENT-034`) | `RevisionSchedule` | Spaced repetition queue entry (`UPCOMING`, `DUE`, `OVERDUE`). |

---

## 2. Referential Integrity & Cascade Safeguards

```
User ───────(1:N CASCADE)───► Account, Session, UserProgress, MasteryAssessment, Bookmark, Note, Submission, Notification, RevisionSchedule
User ───────(1:N SET NULL)──► LearningActivity, AuditLog
Domain ─────(1:N RESTRICT)──► Category ───(1:N RESTRICT)───► Topic
Topic ──────(M:N RESTRICT)──► TopicDependency (prerequisiteTopicId, dependentTopicId)
Topic ──────(1:N RESTRICT)──► Lesson, Problem, UserProgress, RevisionSchedule, MasteryAssessment
Lesson ─────(1:N CASCADE)───► LessonSection, Question
Roadmap ────(1:N CASCADE)───► RoadmapNode, RoadmapEdge
```

### 2.1 Critical Cascade Rules:
1. **Topic Graph Preservation (`BR-019`, `DATA-CON-011`):** Deleting a `Topic` is blocked (`onDelete: Restrict`) if references exist in `TopicDependency`, `Lesson`, `Problem`, or `UserProgress`. Deletion must use soft-delete (`isArchived = true`, `status = ARCHIVED`).
2. **Revision Schedule Uniqueness (`DATA-CON-010`):** `RevisionSchedule` enforces `@@unique([userId, topicId])` so each learner has exactly one active schedule per topic.
3. **UTC Midnight Normalization (`BR-020`):** All `RevisionSchedule.dueAt` and `DailyChallenge.date` columns store timestamps normalized to `00:00:00 UTC` to eliminate timezone jitter.

