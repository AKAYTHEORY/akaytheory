# AkayTheory — Software Requirements Specification (SRS)

*Interactive computer science and software engineering learning platform*

| Field | Value |
| --- | --- |
| Document ID | AT-SRS-001 |
| Version | 1.4 — Corrected Audit Draft; Pending Product-Owner Decisions |
| Reconciliation Date | 15 November 2026 |
| Reconciliation Status | Phase 5 document audit and corrective reconciliation completed; implementation verification not performed |
| Source of Truth | AkayTheory Product Blueprint (§1–§25), v1.3, and Phase 4 reconciliation report; unapproved policies remain proposals |
| Structural Standard | ISO/IEC/IEEE 29148:2018 Systems and Software Engineering — Requirements Engineering |
| Product Owner | Akay |
| Document Status | Corrected SRS draft for Product-Owner review; not an approved production baseline |

**How to use this document.** Part 1 (Sections 1–2) defines scope, conventions, roles and MVP boundaries. Section 3 is the functional catalogue, one module per heading. Sections 4–6 cover interfaces, data and quality attributes. Sections 7–9 give workflows, business rules and verification. Section 10 traces every blueprint section to requirement IDs. Section 11 lists open decisions you must settle. Section 12 evaluates the proposed technology stack. Section 13 records document-level audit status and outstanding verification limitations.

**Read this first: what the source document is.** The supplied blueprint is a *master prompt* that specifies the product vision, domains, features and preferred architecture. It does not contain completed competitor research, screenshots or verified observations. Therefore every competitor reference (NeetCode, LeetCode, VisuAlgo and others) is treated here as *inspiration only*. No requirement in this SRS depends on a competitor feature being verified. Where the blueprint names a competitor feature that I could not confirm from the document itself (for example "Planly" at Take U Forward), it is recorded as an open issue, not a requirement.

---

# 1. Introduction

## 1.1 Purpose

This SRS defines **what** AkayTheory shall do. It is written so that a product owner can approve scope, a designer can derive screens, engineers can derive schemas, APIs and components, and QA can derive test plans. Implementation detail is limited to constraints and to Section 12.

## 1.2 Scope

**In scope.** AkayTheory is a web-based learning platform with:

- Eight learning domains with cross-domain concept links (a global knowledge graph).
- Roadmaps rendered as an interactive graph and as an accessible list.
- A learning workspace with reusable lesson templates.
- A configuration-driven interactive visualization engine (DSA first, system design later).
- A coding problem library with practice and assessment.
- Onboarding, personalization, a dashboard, mastery tracking and revision.
- Notes, bookmarks, global search and daily content.
- A content management and publishing workflow that needs no frontend deployment.
- Authentication, user settings, notifications and administrative management.

**Out of scope for this document.** Production code; UI mockups; competitor analysis reports; the content itself (lessons, problems, videos); automated posting to YouTube, Instagram or LinkedIn (see OI-14); native mobile apps (see OI-15); a general-purpose in-house code-execution engine in the MVP (see FR-PRACTICE and OI-06).

## 1.3 Product overview

**Vision (blueprint §2).** *Don't just read about engineering. Understand it, visualize it, interact with it and practice it.* A single concept should be reusable as a website lesson, an interactive visualization and a video.

**Core differentiators (blueprint §2, §8, §20).** Interactive visualizations on every eligible topic; a cross-domain knowledge graph; mastery rather than completion tracking; a daily publishing cadence supported by a CMS.

## 1.4 Definitions and abbreviations

| Term | Definition |
| --- | --- |
| Domain | One of the eight top-level learning areas (Section 3.4). |
| Category / Topic / Subtopic | Hierarchy within a domain. Category groups topics; a topic is a learnable concept; a subtopic is a part of a topic. |
| Lesson | A published, structured unit of content attached to a topic. |
| Lesson template | A named structure that defines which lesson sections are available (blueprint §7, §12). |
| Roadmap | A directed graph of roadmap nodes representing a recommended learning path. |
| Roadmap node | A visual instance of a category, topic, subtopic, problem, assessment or milestone. |
| Knowledge graph | The global graph of topics and the typed relationships between them, across domains. |
| Visualization | An interactive, step-based simulation rendered from a reusable component plus a configuration. |
| Visualization configuration | Structured data (type, inputs, step rules) that parameterises a visualization component. |
| Mastery level | One of Not Started, Attempted, Familiar, Proficient, Mastered. |
| Node state | The roadmap display state of a node (Section 3.5). Distinct from mastery level; see OI-08. |
| Evidence | A recorded learner interaction used to compute mastery (quiz answer, problem result, revision result). |
| Sandbox | An isolated environment for executing untrusted learner code. |
| CMS | The content management capability used by administrators to author and publish content. |
| MVP | Minimum viable product: the first public release (Section 2.7). |
| TBD | A value not given by the source and not invented here; see Section 11. |
| WCAG 2.2 AA | Web Content Accessibility Guidelines 2.2, conformance level AA. |
| LCP / INP / CLS | Core Web Vitals: Largest Contentful Paint, Interaction to Next Paint, Cumulative Layout Shift. |
| CSRF / XSS | Cross-site request forgery / cross-site scripting. |
| RBAC | Role-based access control. |
| FTS | Full-text search. |

## 1.5 References

| Ref | Document |
| --- | --- |
| \[R1\] | AkayTheory Product Blueprint (master prompt), Sections 1–25. Referred to as "Blueprint §n". |
| \[R2\] | ISO/IEC/IEEE 29148, Systems and software engineering — Life cycle processes — Requirements engineering. |
| \[R3\] | WCAG 2.2, https://www.w3.org/TR/WCAG22/ |
| \[R4\] | React Flow accessibility guidance, https://reactflow.dev/learn/advanced-use/accessibility |
| \[R5\] | Core Web Vitals, https://web.dev/articles/vitals (LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1, as stated in the blueprint). |

## 1.6 Document conventions

**Requirement identifiers.** `FR-<MODULE>-NNN` functional; `NFR-<AREA>-NNN` non-functional; `DATA-NNN` data; `BR-NNN` business rule; `UC-NNN` use case; `OI-NN` open issue; `CON-NNN` constraint; `ASM-NN` assumption.

**Modules:** PUB, AUTH, ONB, DOM, ROADMAP, LEARN, VIZ, PROB, PRACTICE, DASH, PROGRESS, REV, NOTE, SEARCH, DAILY, CMS, SET, NOTIF, ADMIN.

**Requirement type tag (first characters of each requirement).**

| Tag | Meaning |
| --- | --- |
| **\[E\]** | Explicit: stated in the blueprint. |
| **\[D\]** | Derived: logically necessary to deliver an explicit requirement. |
| **\[R\]** | Recommended: my proposal; needs stakeholder confirmation. |

**Priority (MoSCoW) and phase.** Written as `Pri/Phase`. Priority: M Must, S Should, C Could, W Won't (for MVP). Phase: **MVP**, **P2** (first post-MVP release), **Fut** (future enhancement).

**Verification method.** I Inspection, D Demonstration, T Test, A Analysis.

**Language.** "Shall" is mandatory. "Should" and "may" are not used inside requirement statements. Thresholds not supplied by the blueprint are written TBD and listed in Section 11; none were invented.

---

# 2. Overall Description

## 2.1 Product perspective

AkayTheory is a new, self-contained web product. It has no predecessor system to integrate with. It depends on external services for email delivery, Google sign-in, video hosting, media storage and (post-MVP) sandboxed code execution. It is delivered as a modular monolith inside a monorepo (CON-002).

Logical subsystems:

| Subsystem | Responsibility |
| --- | --- |
| Public site | Unauthenticated discovery and SEO-friendly content. |
| Learner application | Authenticated learning, practice, progress. |
| Content & visualization engine | Lesson rendering, visualization components, roadmap graph rendering. |
| Identity & access | Registration, sessions, roles. |
| Learning intelligence | Mastery, revision scheduling, recommendations. |
| Admin workspace | Authoring, review, publishing, user management, analytics. |
| Search | Unified index over content. |
| Execution gateway (post-MVP) | Adapter to an external or isolated sandbox. |

## 2.2 Product objectives

| ID | Objective | Source |
| --- | --- | --- |
| OBJ-1 | Let learners progress from programming fundamentals to system design inside one connected curriculum. | §2 |
| OBJ-2 | Make concepts learnable by manipulation: every eligible topic can carry an interactive visualization. | §2, §8 |
| OBJ-3 | Measure real understanding through evidence-based mastery, not page views. | §11 |
| OBJ-4 | Allow the team to publish new lessons daily with no frontend release. | §12, §21 |
| OBJ-5 | Deliver an accessible (WCAG 2.2 AA), private and secure product. | §16, §17 |
| OBJ-6 | Keep the first release small enough to ship and learn from. | §22, §24 |

## 2.3 User classes and characteristics

The blueprint names administrators and learners but does not define a "problem solver" or "system administrator" role. They are modeled here as requested in the SRS task and flagged in OI-03.

| ID | Class | Description | Authentication |
| --- | --- | --- | --- |
| UC-01 | Public visitor | Browses public content, may preview public lessons and roadmaps. | None |
| UC-02 | Registered learner | Has an account. Learns, tracks progress, keeps notes and bookmarks. | Required |
| UC-03 | Problem solver | A registered learner using the problem library and practice features. A *capability profile* of UC-02 (not a separate account type) \[D\]. | Required |
| UC-04 | Content administrator | Manages curriculum and content. The proposed unified Author, Reviewer, and Publisher capability with self-review is conditional on DEC-03 approval (FR-CMS-017); until approval, separate author and reviewer/publisher permissions apply. | Required |
| UC-05 | System administrator | Manages users, security roles, system configuration, feature flags, and operational audit logs. Cannot modify curriculum content. | Required |

**Editorial Role Definitions (within UC-04 / UC-05):**
- **Content Author:** Creates and edits drafts of lessons, problems, and roadmaps.
- **Content Reviewer:** Reviews submitted drafts, adds editorial feedback, and approves or rejects content.
- **Content Publisher:** Schedules and publishes approved content to public routes, triggering edge CDN cache purges.
- **System Administrator (UC-05):** Manages user accounts, assigns security roles, configures global feature flags, and monitors immutable security audit logs. Strictly separated from curriculum content generation (BR-015).

Blueprint §19 personas (beginner, college student, interview candidate, experienced engineer, career-switcher) are *learner archetypes* used for onboarding and usability tests, not security roles.

**Authorization matrix** (Y = allowed, O = own data only, P = published content only, — = denied).

| Capability | Visitor | Learner | Problem solver | Content admin | System admin |
| --- | --- | --- | --- | --- | --- |
| View public lessons, roadmaps, problem list | P | P | P | Y | Y |
| View full lesson workspace | Per BR-001 | P | P | Y | Y |
| Save progress, notes, bookmarks | — | O | O | O | O |
| Submit solutions / run practice | — | — | O | O | O |
| Edit own settings and profile | — | O | O | O | O |
| Create / edit content (draft) | — | — | — | Y | — |
| Publish / schedule / archive content | — | — | — | Y (subject to DEC-03 approval) | — |
| View content analytics | — | — | — | Y | Y |
| Manage users and roles | — | — | — | — | Y |
| View other users' personal data | — | — | — | — | Y (audited) |

## 2.4 Operating environment

- Client: current evergreen desktop and mobile browsers; large desktop, standard desktop, laptop, tablet and mobile viewports (Blueprint §17). Exact browser list TBD (OI-12).
- Server: Node.js runtime hosting a modular monolith; PostgreSQL database; object storage for media; email provider; optional cache.
- External services: Google OAuth, video host (YouTube embeds), code-execution provider (post-MVP).

## 2.5 Design and implementation constraints

| ID | Constraint | Source | Status |
| --- | --- | --- | --- |
| CON-001 | Frontend uses React, TypeScript, Vite and Tailwind CSS. | §16, §21 | Initial constraint |
| CON-002 | Backend uses Node.js, Express and TypeScript, organised as a modular monolith in a monorepo. | §21 | Initial constraint |
| CON-003 | Primary datastore is PostgreSQL accessed through Prisma. | §16, §21 | Initial constraint |
| CON-004 | Input validation uses Zod with schemas shared between client and server. | §16, §21 | Preferred |
| CON-005 | Authentication provider is Better Auth *or another justified provider*. | §16 | Open (OI-01) |
| CON-006 | React Flow is the initial preferred technology for the roadmap graph, subject to evaluation against alternatives. | §4-D | Open (OI-02) |
| CON-007 | Untrusted learner code shall never execute on the main web server. | §9 | Fixed |
| CON-008 | The platform shall not reproduce proprietary problem statements from LeetCode, NeetCode or similar platforms. | §9 | Fixed |
| CON-009 | Content must be publishable without a frontend deployment. | §12, §21 | Fixed |
| CON-010 | Infrastructure complexity shall be introduced only with evidence of need. | §18, §24 | Fixed |

## 2.6 Assumptions and dependencies (summary)

Full list in Section 11. Key items: the product is web-only for the MVP (ASM-01); content authoring is performed by a small trusted team (ASM-02); video is hosted externally (ASM-03); the team supplies all lesson and problem content (ASM-04).

## 2.7 MVP and release scope

The blueprint lists ten phases but does not label which features are MVP. The table below is a *proposed release allocation* \[R\], not an approved commitment. The Dual-Domain Anchor allocation is conditional on DEC-01 approval; until then it is a planning baseline only.

| Capability | Phase | Rationale |
| --- | --- | --- |
| Public site, categories, public roadmap and lesson view | MVP | Entry point and SEO; low complexity; needed to test positioning. |
| Email/password and Google OAuth, verification, reset | MVP | Prerequisite for any saved progress. |
| Short onboarding (≤ the fields in FR-ONB-002) | MVP | Needed to recommend a first roadmap. |
| Domain/topic catalogue with prerequisite and cross-domain links | MVP | Foundation of roadmaps, search and the knowledge graph. |
| Roadmap graph and accessible list for DSA and the Master roadmap (others as content is ready) | MVP | Signature feature; high value, medium complexity. |
| Learning workspace with core lesson templates | MVP | Core value delivery. |
| Core DSA Visualizations (linear, pointer, search/sort) & Request-Flow System Design (client-server, cache, load balancer) | Proposed MVP; pending DEC-01 | Proposed Dual-Domain Anchor; implementation scope is not authorized until Product Owner approval. |
| Quiz and knowledge-check questions | MVP | Primary mastery evidence. |
| Problem library using original problems; external practice links; no in-platform execution | MVP | Lowers security and cost risk (CON-007). |
| Basic mastery and progress (topic and roadmap level) | MVP | Needed to avoid completion-only tracking. |
| Notes and bookmarks | MVP | Low complexity, high retention value. |
| Global search (Ctrl/Cmd + K) over lessons, topics, problems, roadmaps | MVP | Essential navigation; use database FTS first. |
| CMS: draft, review, publish, schedule, archive with draft-while-published isolation | MVP | Required for daily-content model without live corruption risk. |
| Core settings: theme, font size, reduced motion, density, gamification toggle | MVP | Accessibility and ethical learning baseline. |
| Advanced Non-Linear DSA (trees, graphs, DP tables) & Distributed System Simulators (sharding, queues, consensus) | P2 | Higher complexity state engines; builds on proven MVP visualizer runtime. |
| In-platform code editor with sandboxed execution | P2 | Highest security risk; requires provider decision. |
| Basic deterministic revision queue and fixed intervals (Familiar 3d, Proficient 7d, Mastered 21d, failed review 1d) | MVP | Required by FR-REV-001–012 and BR-020; adaptive SM-2/FSRS scheduling remains P2. |
| Email notifications, weekly goals, analytics views | P2 | Depend on stable user base. |
| Company-wise filtering | P2 | Depends on legally usable data (BR-009). |
| Contextual AI search, collaborative canvas, pattern trainer, system-design simulator editing | Fut | Novelty with unproven value; do not block core navigation (blueprint §13). |

---

# 3. Functional Requirements

**How each module is presented.** Each module opens with a header block (actor, preconditions, trigger, workflows, exceptions, inputs/outputs, permissions) that applies to all requirements in that module. Requirements follow as atomic rows with source reference, priority/phase, verification method and acceptance criteria. Where the blueprint's *intent* is explicit but a detail is missing, the row is tagged \[D\] or \[R\] and the gap is logged in Section 11.

## 3.1 Public website (FR-PUB)

**Primary actor:** Public visitor (UC-01); also any signed-in user. **Preconditions:** none. **Trigger:** visitor opens a public URL or follows an external link. **Main workflow:** land → explore domains/categories → open a public roadmap, lesson or problem → register or continue browsing. **Alternative workflows:** arrive directly on a lesson or the daily lesson; use search. **Exceptions:** unknown URL → not-found page; content unpublished or archived → not-found page that does not reveal that a draft exists; server error → error page with retry. **Inputs:** URL, search text. **Outputs:** rendered published content. **Permissions:** read-only access to published public content.

| ID | Requirement | Src | Pri/Ph | Ver | Acceptance criteria |
| --- | --- | --- | --- | --- | --- |
| FR-PUB-001 | \[E\] The system shall provide a landing page that states the product value proposition, shows the eight domains and offers entry points to Explore, Register and Login. | §15 | M/MVP | D | Unauthenticated user sees all three entry points and eight domain items. |
| FR-PUB-002 | \[E\] The system shall provide an Explore page listing the eight domains and featured roadmaps. | §15 | M/MVP | D | Page lists eight domains; each links to its category page. |
| FR-PUB-003 | \[E\] The system shall provide an all-categories page and one page per category listing its published topics. | §15 | M/MVP | T | Every published category has a reachable page listing only published topics. |
| FR-PUB-004 | \[E\] The system shall display public roadmaps to visitors in read-only mode without progress data. | §15 | M/MVP | T | Visitor can open a roadmap, pan, zoom and select nodes; no progress states shown. |
| FR-PUB-005 | \[E\] The system shall display lessons flagged public to visitors. | §15 | M/MVP | T | A public lesson loads without login; a non-public lesson prompts login (BR-001). |
| FR-PUB-006 | \[E\] The system shall provide a public daily-lesson page showing the lesson scheduled for the current day. | §15 | M/MVP | T | After the scheduled time the page shows that lesson; before it, the previous one. |
| FR-PUB-007 | \[E\] The system shall provide a public problem library list and problem detail view for published problems. | §15 | M/MVP | T | Visitor can open a problem detail; submitting or saving prompts login. |
| FR-PUB-008 | \[E\] The system shall provide an About page. | §15 | S/MVP | I | Page exists and is linked from the footer. |
| FR-PUB-009 | \[E\] The system shall provide a search results page for visitors limited to public content. | §13, §15 | M/MVP | T | A visitor search never returns draft, scheduled, archived or non-public items. |
| FR-PUB-010 | \[D\] The system shall give every public page a unique stable URL, a title and a meta description. | §18 | S/MVP | I | Sampled public pages each have a unique title and description. |
| FR-PUB-011 | \[D\] When a visitor attempts a learner-only action, the system shall prompt for login or registration and return the visitor to the same page and context afterwards. | §15 | M/MVP | T | After login the visitor lands on the original URL with the intended action available. |
| FR-PUB-012 | \[D\] The system shall present not-found and error pages that offer navigation back to Explore and search. | §15 | S/MVP | D | Unknown URL returns an HTTP 404 page with those links. |

## 3.2 User registration and authentication (FR-AUTH)

**Primary actor:** Visitor registering, or learner signing in. **Preconditions:** none for registration; verified account for full sign-in. **Trigger:** user selects Register, Login or Forgot password, or a session expires. **Main workflow:** register (email/password or Google) → verify email → sign in → reach onboarding or dashboard. **Alternative workflows:** Google OAuth sign-in; password reset; resend verification. **Exceptions:** invalid input; email already registered; expired or reused token; OAuth cancelled or failed; rate limit exceeded; session expired. **Inputs:** email, password, OAuth consent, tokens. **Outputs:** session, verification and reset emails, error messages. **Permissions:** self-service only; roles are assigned only by a System administrator.

| ID | Requirement | Src | Pri/Ph | Ver | Acceptance criteria |
| --- | --- | --- | --- | --- | --- |
| FR-AUTH-001 | \[E\] The system shall allow a visitor to register with an email address and password. | §16 | M/MVP | T | Valid input creates an unverified account and sends a verification email. |
| FR-AUTH-002 | \[D\] The system shall validate registration input on the server and reject malformed email addresses and passwords that violate the password policy (minimum length and rules TBD). | §16 | M/MVP | T | Each rejected case returns a field-level error; no account is created. |
| FR-AUTH-003 | \[E\] The system shall allow registration and sign-in with Google OAuth. | §16 | M/MVP | T | Successful consent creates or signs into an account; cancel returns to login with a message. |
| FR-AUTH-004 | \[D\] When a Google sign-in email matches an existing verified account, the system shall link identities only after re-authenticating with the existing account credential. If the existing account is unverified, the system shall promote it to verified and link the Google identity only after validating the provider's signed identity response and an explicit `email_verified = true` claim for the exact matching email; the unverified local password credential shall be invalidated atomically (BR-017). | §16 | M/MVP | T | No duplicate user rows result; unverified accounts cannot be hijacked via malicious pre-registration. |
| FR-AUTH-005 | \[E\] The system shall send an email verification link and mark the account verified when the link is opened. | §16 | M/MVP | T | Valid link verifies; expired or reused link shows an error and offers resend. |
| FR-AUTH-006 | \[D\] The system shall expire each verification token after a lifetime of TBD and make it single-use. | §16 | M/MVP | T | Reuse and post-expiry use are rejected. |
| FR-AUTH-007 | \[D\] The system shall allow resending the verification email, limited by FR-AUTH-014. | §16 | S/MVP | T | Excess requests return a rate-limit message. |
| FR-AUTH-008 | \[E\] The system shall authenticate users by email and password and create a secure session. | §16 | M/MVP | T | Correct credentials create a session; incorrect ones do not. |
| FR-AUTH-009 | \[D\] Failed-login messages shall not reveal whether an email address is registered. | §16 | M/MVP | T | Wrong email and wrong password produce the same message. |
| FR-AUTH-010 | \[E\] The system shall provide forgot-password and reset-password flows using single-use, expiring tokens (lifetime TBD). | §16 | M/MVP | T | Reset succeeds once; token reuse is rejected. |
| FR-AUTH-011 | \[D\] Completing a password reset shall invalidate all existing sessions of that user. | §16 | M/MVP | T | Previously issued sessions are rejected after reset. |
| FR-AUTH-012 | \[E\] The system shall handle session expiration by informing the user, preserving the intended destination and requiring re-authentication. | §15, §16 | M/MVP | T | An expired-session request returns the user to login, then back to the destination. |
| FR-AUTH-013 | \[E\] The system shall provide logout that invalidates the session on the server and clears the client session cookie. | §16 | M/MVP | T | After logout, the old session token is rejected. |
| FR-AUTH-014 | \[E\] The system shall rate-limit registration, login, verification and password-reset requests (limits TBD). | §16 | M/MVP | T | Requests above the configured limit receive a throttling response. |
| FR-AUTH-015 | \[E\] The system shall protect learner and admin routes so that unauthenticated or unauthorised users cannot access them. | §16 | M/MVP | T | Direct URL and API calls without authorisation return a redirect or 401/403. |
| FR-AUTH-016 | \[E\] The system shall enforce role-based permissions on the server for every protected operation, with at least Learner, Content administrator and System administrator roles. | §16 | M/MVP | T | A learner token calling an admin API receives 403. |
| FR-AUTH-017 | \[E\] The system shall present authentication errors as accessible messages associated with the relevant field or form. | §17 | M/MVP | T | A screen reader announces the error; error text is programmatically linked to its input. |
| FR-AUTH-018 | \[D\] The system shall allow a user to delete their account and associated personal data, subject to BR-010. | §16 | S/MVP | T | After confirmation, the account and personal data are removed or anonymised per retention rules. |
| FR-AUTH-019 | \[R\] The system shall support multi-factor authentication for administrator accounts. | §16 | S/P2 | T | Admin sign-in requires a second factor when enabled. |
| FR-AUTH-020 | \[D\] The system shall permit unlinking a third-party OAuth provider (e.g., Google) only if the user has an active, verified email address and a valid password credential established (BR-021). | §16 | M/MVP | T | Unlinking OAuth without an alternative verified credential is rejected with HTTP 400. |
| FR-AUTH-021 | \[D\] The system shall automatically revoke all active sessions across all devices whenever a user's password is changed, email is updated, or account is deactivated by an administrator (BR-014). | §16 | M/MVP | T | After security credential mutation, subsequent API requests with existing session tokens return HTTP 401. |

## 3.3 Onboarding (FR-ONB)

**Primary actor:** Newly verified registered learner. **Preconditions:** verified account; onboarding not completed. **Trigger:** first sign-in after verification, or Update my goals in settings. **Main workflow:** welcome → experience level → learning goals → preferred language → study schedule → recommended starting roadmap → dashboard. **Alternative workflows:** skip any step; skip the entire flow; resume later. **Exceptions:** save failure → retry without losing entered answers. **Inputs:** fields in FR-ONB-002. **Outputs:** stored preferences and a recommended roadmap. **Permissions:** the user's own data only.

| ID | Requirement | Src | Pri/Ph | Ver | Acceptance criteria |
| --- | --- | --- | --- | --- | --- |
| FR-ONB-001 | \[E\] The system shall present an onboarding flow with these screens in order: Welcome, Experience level, Learning goals, Preferred language, Study schedule, Recommended starting roadmap. | §15 | M/MVP | D | All six screens appear in the stated order for a new user. |
| FR-ONB-002 | \[E\] The system shall collect only these fields: experience level, main learning goal, preferred programming language, target interview type, learning interests, available study time, preferred learning format. | §10 | M/MVP | I | No additional personal fields exist in the flow or the stored record. |
| FR-ONB-003 | \[E\] The system shall offer at least these goals: learn programming from scratch; prepare for coding interviews; prepare for product-based companies; learn system design; become a stronger backend developer; improve CS fundamentals; prepare for a specific technical role. | §10 | M/MVP | I | Each goal is selectable. |
| FR-ONB-004 | \[E\] The onboarding flow shall be short and skippable. A maximum of six screens and a target duration of 90 seconds are proposed, subject to DEC-02 approval. | §10 | M/MVP | T | The flow is skippable; if DEC-02 is approved, it contains no more than six screens and usability testing evaluates the 90-second target. |
| FR-ONB-005 | \[D\] The system shall allow the learner to skip any step or the whole flow and shall apply documented defaults. | §10 | M/MVP | T | Skipping all steps yields a valid account with default preferences. |
| FR-ONB-006 | \[D\] The system shall recommend a starting roadmap using deterministic rules over the stored answers and show the reason for the recommendation. | §10, §15 | M/MVP | T | Same inputs always yield the same roadmap and reason text. |
| FR-ONB-007 | \[E\] The system shall let the learner change every onboarding answer later in settings. | §10 | M/MVP | T | Edited values persist and affect later recommendations. |
| FR-ONB-008 | \[D\] The system shall show progress through the flow and allow moving back without losing answers. | §10 | S/MVP | D | Back navigation preserves entered answers. |

## 3.4 Learning domains and content discovery (FR-DOM)

**Primary actor:** Visitor or learner browsing; Content administrator maintaining the taxonomy. **Preconditions:** published taxonomy exists. **Trigger:** user opens Explore, a category or a topic page. **Main workflow:** choose domain → category → topic → view lessons, problems and related topics. **Alternative workflows:** arrive through search or knowledge-graph links. **Exceptions:** empty category → empty state with related categories. **Permissions:** read published (all); write taxonomy (Content administrator).

**Seed taxonomy (Blueprint §5).**

| Domain | Subcategories |
| --- | --- |
| 01 Programming | C++, Python, Java, JavaScript, TypeScript, Golang; programming fundamentals; object-oriented programming; memory management; language-specific concepts; standard libraries |
| 02 Data Structures and Algorithms | Arrays, strings, hashing, two pointers, sliding window, prefix sums, binary search, linked lists, stacks, queues, trees, binary search trees, heaps, tries, graphs, recursion, backtracking, greedy, dynamic programming, bit manipulation, sorting, searching, advanced graph algorithms; coding interview problems inside relevant topics |
| 03 Databases | Fundamentals, relational databases, PostgreSQL, MySQL, MongoDB, Redis, indexing, transactions, ACID, normalization, query optimization, internals, replication, sharding, consistency models |
| 04 System Design | Fundamentals, Low-Level Design, High-Level Design, distributed systems, scalability, load balancing, caching, message queues, API design, microservices, CAP theorem, consistency, fault tolerance, database architecture, real-world case studies |
| 05 Computer Science Fundamentals | Operating systems, computer networks, networking protocols, memory management, processes and threads, concurrency, synchronization, OOP, compiler fundamentals, computer architecture |
| 06 Software Engineering | Backend, frontend, REST APIs, GraphQL, Node.js, React, testing, Git and GitHub, Docker, Kubernetes, CI/CD, AWS, cloud infrastructure, DevOps, security fundamentals, software architecture |
| 07 Interview Preparation | Coding interviews, DSA interview patterns, company-specific questions, system design interviews, LLD interviews, HLD interviews, behavioral interviews, mock interviews, revision plans |
| 08 Miscellaneous Engineering Topics | Linux, shell commands, developer productivity, command-line tools, Git workflows, engineering career advice, technical aptitude, developer tools, open-source contribution, engineering insights |

**Overlaps detected in the source (logged as OI-07):** OOP and memory management appear in Domains 01 and 05; Git appears in Domains 06 and 08; Low-Level Design and system-design interviews appear in Domains 04 and 07; DSA interview patterns overlap Domain 02. FR-DOM-003 resolves the structure without deleting anything.

| ID | Requirement | Src | Pri/Ph | Ver | Acceptance criteria |
| --- | --- | --- | --- | --- | --- |
| FR-DOM-001 | \[E\] The system shall organise content as Domain → Category → Topic → Subtopic with exactly eight top-level domains as listed above. | §5 | M/MVP | I | Taxonomy shows eight domains with the listed subcategories. |
| FR-DOM-002 | \[D\] A Content administrator shall be able to create, rename, reorder, hide and archive categories and topics without a code deployment. | §12, §21 | M/MVP | D | A change appears to learners without a redeploy. |
| FR-DOM-003 | \[D\] A topic shall have one canonical home and may be cross-listed under additional categories or domains. | §5 | M/MVP | T | A cross-listed topic appears in both places and shares one progress record. |
| FR-DOM-004 | \[E\] The system shall store directed prerequisite relationships between topics and shall reject any change that creates a cycle. | §6 | M/MVP | T | Saving a cyclic dependency fails with an error naming the cycle. |
| FR-DOM-005 | \[E\] The system shall store typed cross-domain relationships between topics (at least related-to, builds-on, applied-in) forming a global knowledge graph. | §5 | M/MVP | I | Relationships can be created between topics in different domains. |
| FR-DOM-006 | \[E\] The system shall seed the knowledge graph with at least these links: BST and database indexing; hashing and Redis and hash indexes; graph algorithms and networking and routing; queues and message brokers; concurrency and operating systems and backend engineering; caching and both DSA and distributed systems. | §5 | M/MVP | I | Each listed pair is present and navigable from both topics. |
| FR-DOM-007 | \[D\] A topic page shall show summary, difficulty, estimated study time, prerequisites, lessons, practice problems and related topics. | §6 | M/MVP | D | Every listed field renders or shows an explicit empty state. |
| FR-DOM-008 | \[D\] The system shall let users browse and filter topics by domain, difficulty and (for signed-in users) learning status, with paginated results. | §6, §9 | S/MVP | T | Filters combine; result counts match. |
| FR-DOM-009 | \[E\] The system shall provide a concept dependency view showing the foundations needed to understand a selected topic. | §20 | S/P2 | D | Selecting a topic shows its prerequisite chain to a configurable depth. |
| FR-DOM-010 | \[D\] The difficulty scale for topics shall be defined by the product owner (values TBD). | §6 | M/MVP | I | Scale is documented before content entry (OI-10). |

## 3.5 Roadmaps and knowledge graph (FR-ROADMAP)

**Primary actor:** Visitor or learner; Content administrator for authoring. **Preconditions:** a published roadmap exists; progress data exists for signed-in users. **Trigger:** user opens a roadmap from Explore, the dashboard or search. **Main workflow:** open roadmap → understand the path → select a node → review the contextual panel → start the lesson. **Alternative workflows:** switch to list view; search or filter nodes; keyboard-only navigation. **Exceptions:** roadmap fails to render → fall back to list view; no nodes match a filter → empty state with clear-filters action. **Permissions:** read (all); progress overlay (owner); edit (Content administrator).

**Node states (Blueprint §6):** Not started; In progress; Completed; Needs revision; Mastered; Prerequisite not completed. **Node types:** Category; Topic; Subtopic; Problem; Assessment; Milestone.

| ID | Requirement | Src | Pri/Ph | Ver | Acceptance criteria |
| --- | --- | --- | --- | --- | --- |
| FR-ROADMAP-001 | \[E\] The system shall support roadmaps for DSA, Programming, Database, System Design, Computer Science, Software Engineering, Interview Preparation and a Master Engineering roadmap. | §6 | M/MVP | I | Each of the eight can be created and published; which are populated at launch is set by OI-04. |
| FR-ROADMAP-002 | \[E\] The roadmap canvas shall support zoom in, zoom out, drag-to-pan, fit-to-screen, reset position and full-screen mode. | §6 | M/MVP | T | Each control works with mouse, touch and keyboard where applicable. |
| FR-ROADMAP-003 | \[E\] The roadmap canvas shall provide a minimap showing the viewport position. | §6 | S/MVP | D | Minimap viewport matches the canvas view and supports click-to-move. |
| FR-ROADMAP-004 | \[E\] The system shall let users search nodes by name and centre and highlight the selected result. | §6 | M/MVP | T | Searching a node name brings it into view and highlights it. |
| FR-ROADMAP-005 | \[E\] The system shall let users filter nodes by difficulty and by learning status. | §6 | M/MVP | T | Non-matching nodes are visually de-emphasised and the filter state is announced. |
| FR-ROADMAP-006 | \[E\] Selecting or focusing a node shall highlight its prerequisite and dependent nodes and edges. | §6 | M/MVP | T | The highlighted set equals the stored dependency set for that node. |
| FR-ROADMAP-007 | \[E\] The system shall provide reusable node types: category, topic, subtopic, problem, assessment and milestone. | §6 | M/MVP | I | Each type has a distinct appearance and accessible name. |
| FR-ROADMAP-008 | \[E\] Each node shall display one of the six node states, indicated by an icon or text label in addition to colour. | §6, §17 | M/MVP | I | State is identifiable in greyscale. |
| FR-ROADMAP-009 | \[D\] The system shall compute node state per user from progress and mastery data according to a documented mapping (OI-08). | §6, §11 | M/MVP | A | Mapping table approved and implemented; unit tests cover every state. |
| FR-ROADMAP-010 | \[E\] Selecting a node shall open a contextual panel showing topic name, summary, difficulty, estimated study time, prerequisites, number of lessons, number of practice questions, progress, related subjects and a Start learning action. | §6 | M/MVP | D | Every listed field is shown or marked not available. |
| FR-ROADMAP-011 | \[E\] The Start learning action shall open the associated lesson in the learning workspace. | §6 | M/MVP | T | The action navigates to the correct lesson. |
| FR-ROADMAP-012 | \[E\] Unmet prerequisites shall be shown as a recommendation and shall never block access to a lesson. | §6 | M/MVP | T | A learner can open any published node regardless of prerequisite status (BR-002). |
| FR-ROADMAP-013 | \[E\] The system shall show overall roadmap progress using a documented calculation. | §6, §11 | M/MVP | A | Calculation is documented and verified on sample data. |
| FR-ROADMAP-014 | \[E\] The system shall provide a list representation of every roadmap with the same nodes, hierarchy, states, filters and actions as the graph. | §6, §17 | M/MVP | T | A task completable in graph view is completable in list view. |
| FR-ROADMAP-015 | \[D\] The system shall let users switch between graph and list views and remember the choice. | §6 | S/MVP | T | The preference persists across sessions. |
| FR-ROADMAP-016 | \[E\] All roadmap operations shall be operable by keyboard, and no function shall depend on dragging alone. | §6, §17 | M/MVP | T | Node focus, selection, panel open, zoom and fit are keyboard-operable (WCAG 2.2 SC 2.1.1 and 2.5.7). |
| FR-ROADMAP-017 | \[E\] On small viewports the system shall adapt the roadmap, defaulting to the list view while keeping the graph available with touch gestures. | §6, §17 | M/MVP | D | At mobile width the list view is the default; the graph supports pinch and pan. |
| FR-ROADMAP-018 | \[D\] Each graph node shall expose an accessible name including type, title, state and prerequisite count. | §17 | M/MVP | T | Screen-reader output includes those items. |
| FR-ROADMAP-019 | \[E\] When reduced motion is enabled, the canvas shall omit animated transitions. | §10, §17 | M/MVP | T | No animated pan or zoom easing when the setting or OS preference is on. |
| FR-ROADMAP-020 | \[D\] A signed-in user shall see progress overlays on public roadmaps; a visitor shall see none. | §15 | M/MVP | T | The same URL differs by authentication state only in progress data. |
| FR-ROADMAP-021 | \[D\] A Content administrator shall create and edit roadmaps (nodes, edges, node type, positions, linked topics) in the admin workspace, and the system shall reject cyclic edges. | §15, §21 | M/MVP | D | A saved roadmap renders without code change; a cycle is rejected. |
| FR-ROADMAP-022 | \[E\] The system shall maintain interaction performance up to the maximum planned node count (TBD) as defined in NFR-PERF-003. | §18 | S/MVP | A | A performance test at the maximum node count passes. |

## 3.6 Learning workspace (FR-LEARN)

**Primary actor:** Registered learner (UC-02); Content administrator for authoring. **Preconditions:** a published lesson exists for the selected topic. **Trigger:** user opens a lesson from a roadmap node, topic page, dashboard, search result or direct URL. **Main workflow:** open lesson → left sidebar shows course navigation and progress → central area renders lesson sections in order → right sidebar shows table of contents, notes and bookmarks → learner reads, interacts with visualizations and completes knowledge checks → section-level progress is recorded → lesson completion is recorded. **Alternative workflows:** collapse either sidebar for wider reading; jump to a section via right-sidebar TOC; open lesson directly from a public URL (visitor sees public content only per BR-001); navigate to the previous or next lesson from the sidebar. **Exceptions:** lesson not published → not-found page; lesson fails to load → error state with retry; visualization component fails → graceful degradation to static fallback image or text explanation. **Inputs:** lesson ID, user interactions (scroll, section completion, quiz answers, notes). **Outputs:** rendered lesson, section progress events, saved notes, bookmarks. **Permissions:** read published (all authenticated users and visitors per BR-001); write progress, notes, bookmarks (owner only); edit lesson content (Content administrator).

| ID | Requirement | Src | Pri/Ph | Ver | Acceptance criteria |
| --- | --- | --- | --- | --- | --- |
| FR-LEARN-001 | \[E\] The learning workspace shall use a three-column desktop layout: left sidebar for course navigation, central area for lesson content and right sidebar for table of contents, notes and bookmarks. | §7 | M/MVP | D | All three columns render on viewports ≥ 1024 px. |
| FR-LEARN-002 | \[E\] Each sidebar shall be independently collapsible, and the central content area shall expand to fill the freed space. | §7 | M/MVP | T | Collapsing either sidebar widens the central area; collapsing both yields a single-column layout. |
| FR-LEARN-003 | \[E\] On mobile viewports (< 640px) the layout shall use a single-column view with navigation accessible through drawer overlays and bottom sheets; on tablet viewports (640px–1023px), sidebars shall collapse into toggled side sheets; sidebars shall never compress horizontally into the content area. | §7, §17 | M/MVP | D | At viewport < 640px sidebars reflow to mobile drawers; at 640px–1023px sidebars collapse into toggleable sheets. |
| FR-LEARN-004 | \[E\] The left sidebar shall display: current topic title, previous lessons, next lessons, section-level progress indicators and topic grouping within the parent category. | §7 | M/MVP | D | All listed items appear; progress indicators update without page reload after section completion. |
| FR-LEARN-005 | \[E\] The right sidebar shall display: a table-of-contents listing all sections of the current lesson, on-this-page scroll-spy navigation, topic progress summary, related content links, a quick-notes input area and a bookmark toggle. | §7 | M/MVP | D | TOC highlights the currently visible section; clicking a TOC entry scrolls to it. |
| FR-LEARN-006 | \[E\] The system shall support a reusable lesson template with up to 19 possible sections: introduction, learning objectives, prerequisites, concept explanation, real-world analogy, interactive visualization, step-by-step execution, brute-force approach, optimized approach, code implementation, complexity analysis, common mistakes, interview questions, knowledge-check quiz, practice problems, related concepts, revision notes, video explanation and completion/feedback. | §7 | M/MVP | I | A lesson can be created with any subset of these 19 sections in the listed order. |
| FR-LEARN-007 | \[E\] Not every lesson shall require every section; the template shall render only the sections that contain content. | §7 | M/MVP | T | A lesson with five populated sections renders exactly five sections, no empty placeholders. |
| FR-LEARN-008 | \[E\] The system shall support at least these lesson types, each mapping to a default template subset: DSA concept, coding problem, programming fundamental, database concept, system design concept, CS theory and engineering tutorial. | §12 | M/MVP | I | Each lesson type is selectable in the CMS and produces the documented default sections. |
| FR-LEARN-009 | \[E\] Code blocks within lessons shall support syntax highlighting for at least JavaScript, TypeScript, Python, Java, C++, Go and SQL. | §7 | M/MVP | T | Each listed language renders with correct keyword highlighting. |
| FR-LEARN-010 | \[E\] Code blocks shall support a language selector allowing the learner to switch between available implementations of the same example. | §7, §9 | M/MVP | T | Switching the language re-renders the code block without page reload. |
| FR-LEARN-011 | \[E\] The system shall support embedding externally hosted video explanations within the lesson template. | §7, §12 | M/MVP | T | A YouTube embed loads inside the lesson; playback controls are keyboard-accessible. |
| FR-LEARN-012 | \[D\] The system shall record section-level progress as the learner scrolls through or completes each section, and shall resume the learner at the last incomplete section on return. | §7, §11 | M/MVP | T | Returning to a partially completed lesson scrolls to the first incomplete section. |
| FR-LEARN-013 | \[D\] The central content area shall enforce a maximum reading width (TBD characters or pixels) to maintain readability on wide monitors. | §14 | S/MVP | I | Content does not exceed the configured width at any viewport size. |
| FR-LEARN-014 | \[D\] The lesson workspace shall meet WCAG 2.2 AA: all interactive elements shall be keyboard-operable, headings shall follow a logical hierarchy and code blocks shall be accessible to screen readers. | §17 | M/MVP | T | Automated accessibility scan reports zero AA violations on a sample lesson. |
| FR-LEARN-015 | \[D\] When a visualization component referenced by a lesson fails to load, the system shall display a static fallback (image or text description) and a retry action. | §7 | S/MVP | T | Blocking the visualization script still renders the lesson with a fallback and retry button. |
| FR-LEARN-016 | \[E\] Code blocks within the learning workspace shall provide an accessible one-click copy button that places the code snippet into the system clipboard and displays a visual confirmation toast. | §7 | S/MVP | T | Clicking the copy button copies exact code text to clipboard; toast announces success. |
| FR-LEARN-017 | \[E\] The workspace shall display a reading progress bar indicating the percentage of the current lesson completed based on the learner's viewport scroll position. | §7 | S/MVP | D | Progress bar dynamically updates from 0% to 100% as learner scrolls from top to bottom. |
| FR-LEARN-018 | \[E\] The learning workspace shall support keyboard shortcuts (e.g., `[` and `]` or `J` and `K`) to navigate directly between sequential sections of a lesson. | §7, §17 | S/MVP | T | Pressing the shortcut scrolls the viewport smoothly to the next or previous section header. |
| FR-LEARN-019 | \[E\] Concepts in lesson text that reference prerequisite topics shall display inline glossaries or hover tooltips showing a brief definition and a link to the foundational topic. | §7, §20 | S/P2 | D | Hovering or focusing an annotated term reveals an accessible tooltip with definition and link. |

## 3.7 Interactive visualization engine (FR-VIZ)

**Primary actor:** Registered learner interacting with a visualization; Content administrator configuring one. **Preconditions:** a published visualization configuration exists for the target concept. **Trigger:** learner opens a lesson section that contains a visualization, or opens a standalone visualization page. **Main workflow:** component loads → renders initial state from configuration → learner uses controls (play, pause, step, input) → engine transitions through algorithm or system states → state explanation and highlighted elements update at each step → learner resets or provides custom input. **Alternative workflows:** learner adjusts playback speed; learner provides custom input data; learner toggles optional code synchronization panel; reduced-motion mode replaces animations with instant state transitions. **Exceptions:** invalid custom input → validation message and no state change; rendering error → fallback per FR-LEARN-015. **Inputs:** visualization configuration (type, default inputs, step rules), learner controls, custom input data. **Outputs:** rendered interactive visualization, step-by-step state, highlighted elements, state explanations. **Permissions:** interact (all authenticated users and visitors on public lessons); configure (Content administrator).

| ID | Requirement | Src | Pri/Ph | Ver | Acceptance criteria |
| --- | --- | --- | --- | --- | --- |
| FR-VIZ-001 | \[E\] The visualization engine shall be configuration-driven: each visualization shall be parameterised by a structured configuration (type, inputs, step rules) rather than requiring a custom-coded page. | §8, §12 | M/MVP | I | Adding a new visualization of an existing type requires only a new configuration, not a code deployment. |
| FR-VIZ-002A | \[E\] The engine shall provide reusable visualization components for core linear and search/sort DSA concepts: Two Sum, Sliding Window, Two Pointers, Binary Search, Merge Sort, Quick Sort, Linked List operations, and Stack and Queue. | §8 | M/MVP | D | Each listed linear/search DSA type can be instantiated from a configuration and renders correctly on a test page. |
| FR-VIZ-002B | \[E\] The engine shall provide reusable visualization components for non-linear, graph, and optimization DSA concepts: Tree traversal, BST insertion, Heap operations, Graph traversal, DFS and BFS, Dijkstra's algorithm, Backtracking, Recursion tree, and Dynamic programming tables. | §8 | M/P2 | D | Each listed non-linear/graph DSA type can be instantiated and renders correctly on a test page in Phase 2. |
| FR-VIZ-003 | \[E\] Every visualization shall provide these controls: play, pause, reset, next step, previous step, playback speed adjustment, custom input, step counter and current-state explanation. | §8 | M/MVP | T | Each control is present, operable by keyboard and produces the expected state change. |
| FR-VIZ-004 | \[E\] At each step the visualization shall highlight the active variables, nodes or array positions relevant to that step. | §8 | M/MVP | T | Highlighted elements match the algorithm state documented in the step rules. |
| FR-VIZ-005 | \[E\] The visualization shall optionally display a synchronised code panel that highlights the line of code executing at the current step. | §8 | S/MVP | D | Toggling code sync on shows the code panel; the highlighted line advances with each step. |
| FR-VIZ-006 | \[E\] The system shall allow the learner to provide custom input values to a visualization and the engine shall validate the input before execution. | §8 | M/MVP | T | Custom input within constraints runs; input outside constraints shows a validation error. |
| FR-VIZ-007A | \[E\] The engine shall provide reusable visualization components for foundational request-flow and caching System Design simulations: client-server communication, load balancing, Redis caching, and cache invalidation. | §8 | M/MVP | D | Each foundational system-design flow type can be instantiated and demonstrates request/response stepping and cache hit/miss transitions. |
| FR-VIZ-007B | \[E\] The engine shall provide reusable visualization components for advanced distributed systems simulations: database replication, database sharding, message queues, API gateway, rate limiting, circuit breakers, distributed transactions, and event-driven architecture. | §8 | M/P2 | D | Each distributed system type demonstrates multi-node communication, failure injection, and partition recovery in Phase 2. |
| FR-VIZ-008 | \[D\] A Content administrator shall configure a visualization by selecting a component type and providing structured input data (initial state, step sequence, labels) without writing frontend code. | §8, §12 | M/MVP | D | An admin creates a configuration in the CMS and the visualization renders from it on the lesson page. |
| FR-VIZ-009 | \[D\] The playback speed control shall offer at least three speeds (e.g., 0.5×, 1× and 2×). | §8 | S/MVP | T | Each speed option changes the step transition interval proportionally. |
| FR-VIZ-010 | \[E\] When the OS or user reduced-motion preference is active, the visualization shall replace animated transitions with instant state changes. | §10, §17 | M/MVP | T | With `prefers-reduced-motion: reduce` enabled, no animated transitions occur. |
| FR-VIZ-011 | \[D\] Visualization controls shall be keyboard-operable and shall expose accessible names (e.g., "Play animation", "Next step 3 of 12"). | §17 | M/MVP | T | A screen reader announces control purpose and current step. |
| FR-VIZ-012 | \[D\] Visualizations shall be lazy-loaded so that they do not block initial lesson render. | §18 | S/MVP | A | LCP of a lesson page with a visualization remains ≤ 2.5 s on a representative connection. |
| FR-VIZ-013 | \[R\] The technology selection for visualization rendering shall be evaluated per component type: React + SVG and Framer Motion for DOM-based visualizations, Canvas for large data sets, React Flow for node-graph simulations, Mermaid for simple architecture diagrams and Manim for pre-rendered educational animations. | §8 | S/MVP | A | An architecture decision record documents the rationale for each rendering technology used. |
| FR-VIZ-014 | \[D\] On mobile viewports, visualization controls shall reflow to remain usable without horizontal scrolling; the visualisation canvas shall support pinch-to-zoom and swipe gestures. | §17 | M/MVP | D | All controls are reachable and operable at 375 px viewport width. |

## 3.8 Coding problem library (FR-PROB)

**Primary actor:** Problem solver (UC-03); Content administrator for authoring. **Preconditions:** at least one published problem exists. **Trigger:** user opens the problem library from navigation, search, a roadmap node or a lesson's practice-problems section. **Main workflow:** open library → search or filter → select a problem → read statement → attempt hints or solution reveal → view solution, complexity analysis and related questions. **Alternative workflows:** bookmark a problem; filter by company tag (P2); open a problem collection; navigate to a related concept lesson. **Exceptions:** no problems match filters → empty state with clear-filters action; problem not published → not-found page. **Inputs:** search text, filter selections, bookmark toggle. **Outputs:** filtered problem list, problem detail, saved bookmarks. **Permissions:** read published (all); bookmark, track completion (owner only); create and edit problems (Content administrator).

| ID | Requirement | Src | Pri/Ph | Ver | Acceptance criteria |
| --- | --- | --- | --- | --- | --- |
| FR-PROB-001 | \[E\] The system shall provide a problem library page with text search over problem titles, descriptions and tags. | §9 | M/MVP | T | A search term returns problems whose title, description or tags match. |
| FR-PROB-002 | \[E\] The problem library shall support filtering by topic, difficulty, pattern and completion status. | §9 | M/MVP | T | Combining filters yields the intersection; counts update. |
| FR-PROB-003 | \[E\] The problem library shall support filtering by company tag where licensing and data rights permit. | §9 | S/P2 | T | Company filter appears only when company data is available (BR-009). |
| FR-PROB-004 | \[E\] The system shall let authenticated users bookmark problems, and bookmarked problems shall be accessible from a dedicated bookmarks view. | §9 | M/MVP | T | Toggling a bookmark persists across sessions; the bookmarks view lists all bookmarked problems. |
| FR-PROB-005 | \[E\] The system shall display personalised problem recommendations based on the learner's roadmap progress, mastery data and weak areas. | §9 | S/MVP | T | Recommendations change after a learner completes problems or advances mastery. |
| FR-PROB-006 | \[E\] The system shall support curated problem collections (e.g., "Blind 75", "Top Arrays") grouping related problems. | §9 | S/MVP | D | A collection page lists its problems with aggregate completion status. |
| FR-PROB-007 | \[E\] Each problem shall link to its related concept lessons and topics in the knowledge graph. | §9, §5 | M/MVP | T | The problem detail shows at least one related concept link that navigates to the correct lesson or topic page. |
| FR-PROB-008 | \[E\] The problem detail page shall display: problem statement, input/output examples with expected results, constraints, hints, progressive solution reveal, brute-force reasoning, optimized reasoning, complexity analysis, code examples and test cases. | §9 | M/MVP | D | Every listed field is present or shows an explicit empty state. |
| FR-PROB-009 | \[E\] Hints shall be revealed progressively: the learner requests each hint individually and the system records the request. | §9, §20 | M/MVP | T | Each hint is hidden until requested; revealing hint N does not reveal hint N+1. |
| FR-PROB-010 | \[E\] The solution reveal shall follow a think-before-reveal pattern: the learner shall explicitly request the solution and the system shall present reasoning before final code. | §9, §20 | M/MVP | T | Solution is hidden by default; requesting it shows reasoning text before code. |
| FR-PROB-011 | \[E\] Code examples on the problem detail page shall support multiple programming languages with a language selector per FR-LEARN-009 and FR-LEARN-010. | §9 | M/MVP | T | Switching languages shows the correct implementation with syntax highlighting. |
| FR-PROB-012 | \[E\] Each problem shall include discussion prompts and links to related questions. | §9 | S/MVP | I | At least one discussion prompt and one related question link are present on a sample problem. |
| FR-PROB-013 | \[E\] The problem detail page shall support embedded or linked video explanations. | §9 | S/MVP | T | A video embed or link renders and is playable. |
| FR-PROB-014 | \[E\] The system shall not reproduce proprietary problem statements from LeetCode, NeetCode or similar platforms. | §9, CON-008 | M/MVP | I | Content review confirms all problem statements are original or properly licensed. |
| FR-PROB-015 | \[D\] The problem library list shall be paginated or use progressive loading to remain performant at scale. | §18 | S/MVP | T | Loading 500+ problems does not exceed a 3-second page load on a representative connection. |

## 3.9 Practice and assessment (FR-PRACTICE)

**Primary actor:** Problem solver (UC-03). **Preconditions:** learner has an account; a quiz or practice item exists for the topic. **Trigger:** learner reaches a knowledge-check section in a lesson, opens a problem for practice, or opens the practice results page. **Main workflow (quiz):** lesson presents question → learner selects answer → system evaluates → immediate feedback with explanation → result is recorded as mastery evidence. **Main workflow (problem attempt — MVP):** learner reads problem → clicks external practice link or uses an embedded sandbox provider → returns and self-reports the outcome, or the system records the attempt. **Main workflow (problem attempt — post-MVP):** learner writes code in the platform editor → system sends code to a sandboxed execution adapter → test cases run → results and feedback are displayed → result is recorded as mastery evidence. **Alternative workflows:** learner reviews submission history; learner retries a quiz. **Exceptions:** sandbox unavailable (post-MVP) → error message with retry and an option to use an external link; quiz answer save fails → client retains answer and retries. **Inputs:** quiz answers, code submissions, self-reported outcomes. **Outputs:** evaluation results, feedback, mastery evidence records, submission history. **Permissions:** submit and view own results (owner only); view aggregate analytics (Content administrator, System administrator).

| ID | Requirement | Src | Pri/Ph | Ver | Acceptance criteria |
| --- | --- | --- | --- | --- | --- |
| FR-PRACTICE-001 | \[E\] The system shall present knowledge-check quizzes within lessons, with each question offering selectable answer options and a submit action. | §7, §9 | M/MVP | T | A quiz section renders at least one question; submitting records an answer. |
| FR-PRACTICE-002 | \[D\] Upon submission the system shall evaluate the quiz answer, display immediate feedback indicating correctness and show an explanation for the correct answer. | §7 | M/MVP | T | Correct answers show success feedback; incorrect answers show the explanation. |
| FR-PRACTICE-003 | \[D\] Each evaluated quiz response shall be recorded as mastery evidence for the associated topic. | §11 | M/MVP | T | A correct quiz answer creates an evidence record retrievable by the progress system. |
| FR-PRACTICE-004 | \[D\] The system shall track each problem attempt, recording: problem ID, timestamp, outcome (self-reported or system-evaluated) and language used. | §9 | M/MVP | T | The submission history for a problem shows all attempts with the listed fields. |
| FR-PRACTICE-005 | \[E\] For the MVP, the system shall provide external practice links to third-party coding platforms or an embedded third-party sandbox provider, and shall NOT execute untrusted learner code on the main web server. | §9, CON-007 | M/MVP | I | No code execution endpoint exists on the server at MVP launch; external links or a sandbox provider are present. |
| FR-PRACTICE-006 | \[E\] Post-MVP, the system shall support a sandboxed code-execution adapter that sends learner code to an isolated execution environment and returns test-case results. | §9 | M/P2 | T | Code submitted through the adapter executes in an isolated sandbox; results return to the UI. |
| FR-PRACTICE-007 | \[D\] When the sandbox adapter is available, the system shall validate learner code against defined test cases and display per-case pass/fail results with expected versus actual output. | §9 | M/P2 | T | Each test case shows pass or fail with expected and actual output. |
| FR-PRACTICE-008 | \[D\] The system shall provide a submission history page showing all quiz and problem attempts by the learner, sorted by recency, with filters for topic, outcome and date. | §9 | S/MVP | T | Filters apply correctly; at least 50 entries render without performance degradation. |
| FR-PRACTICE-009 | \[D\] Quiz and problem results shall be used as inputs to the mastery system (FR-PROGRESS) and revision system (FR-REV). | §11 | M/MVP | A | A unit test confirms that a recorded result triggers a mastery-level re-evaluation. |
| FR-PRACTICE-010 | \[E\] Upon completing or reviewing a practice problem, the system shall allow the learner to record a self-assessed confidence rating (e.g., Easy, Fair, Hard, Need Review) that feeds into the revision scheduler (BR-003, BR-020). | §9, §11 | S/MVP | T | Selecting a confidence rating persists to the problem attempt record and updates the revision interval. |

## 3.10 Personalised dashboard (FR-DASH)

**Primary actor:** Registered learner (UC-02). **Preconditions:** authenticated session. **Trigger:** learner signs in, completes onboarding, or navigates to the dashboard. **Main workflow:** dashboard loads → learner sees a summary of current learning state → selects a widget to continue learning, review, or explore recommendations. **Alternative workflows:** first visit after onboarding shows the recommended roadmap; empty state for new users with no activity directs to Explore. **Exceptions:** data load failure for a widget → that widget shows an error state with retry; other widgets remain functional. **Inputs:** user ID, session. **Outputs:** aggregated personal learning data rendered across dashboard widgets. **Permissions:** read and interact (owner only); no other user may view another learner's dashboard.

| ID | Requirement | Src | Pri/Ph | Ver | Acceptance criteria |
| --- | --- | --- | --- | --- | --- |
| FR-DASH-001 | \[E\] The dashboard shall display a Continue learning widget showing the most recently accessed lesson with a resume action. | §10 | M/MVP | T | The widget shows the last lesson accessed; clicking it opens the lesson at the last incomplete section. |
| FR-DASH-002 | \[E\] The dashboard shall display a Today's lesson widget showing the daily-published lesson with a link. | §10, §15 | M/MVP | T | The widget updates to reflect the current day's scheduled lesson. |
| FR-DASH-003 | \[E\] The dashboard shall display a Recommended topic widget suggesting the next topic based on onboarding answers, roadmap position and mastery data. | §10 | M/MVP | T | The recommendation changes after the learner completes the previously recommended topic. |
| FR-DASH-004 | \[E\] The dashboard shall display the learner's current roadmap with overall progress. | §10 | M/MVP | D | The widget shows the roadmap name and a progress indicator matching the roadmap page value. |
| FR-DASH-005 | \[E\] The dashboard shall display a Learning time widget summarising time spent learning in the current day and week. | §10 | S/MVP | T | Time values increment during an active lesson session and reset daily/weekly. |
| FR-DASH-006 | \[E\] The dashboard shall display a Weekly goals widget showing progress toward a configurable weekly study target. | §10 | S/MVP | T | The goal value is editable in settings; the widget shows current progress versus target. |
| FR-DASH-007 | \[E\] The dashboard shall display an Areas needing practice widget listing topics with low mastery or recent incorrect quiz results. | §10 | S/MVP | T | Topics shown match those with mastery ≤ Familiar or recent failed evidence. |
| FR-DASH-008 | \[E\] The dashboard shall display a Recently viewed widget listing the last TBD lessons or topics the learner visited. | §10 | S/MVP | T | The list shows the most recent items in reverse chronological order. |
| FR-DASH-009 | \[E\] The dashboard shall display a Bookmarked content widget showing bookmarked lessons and problems. | §10 | S/MVP | T | Items bookmarked from lessons or problems appear here; removing a bookmark removes the item. |
| FR-DASH-010 | \[E\] The dashboard shall display an Upcoming revision widget listing topics scheduled for revision per FR-REV. | §10 | S/MVP | T | The widget lists topics with revision dates ≤ today + TBD days. |
| FR-DASH-011 | \[E\] The dashboard shall display an Activity history widget summarising recent learning events (lessons completed, quizzes taken, problems attempted). | §10 | S/MVP | D | The widget shows at least the last TBD events. |
| FR-DASH-012 | \[D\] Each dashboard widget shall load independently so that a failure in one widget does not prevent others from rendering. | §18 | M/MVP | T | Blocking one widget's API call leaves all other widgets functional. |
| FR-DASH-013 | \[D\] On mobile viewports, dashboard widgets shall stack vertically in a priority order (Continue learning first) without horizontal overflow. | §17 | M/MVP | D | At 375 px width all widgets stack and are scrollable with no horizontal scroll bar. |

## 3.11 Progress and mastery (FR-PROGRESS)

**Primary actor:** Registered learner viewing their own progress; system computing mastery transitions. **Preconditions:** learner has at least one recorded evidence event (section completion, quiz answer, problem attempt or revision result). **Trigger:** a new evidence event is recorded; learner opens a progress or mastery view. **Main workflow:** evidence is recorded → system evaluates transition rules → mastery level is updated if thresholds are met → updated level propagates to the topic page, roadmap node state, dashboard and revision scheduler. **Alternative workflows:** learner views progress summary without new evidence; learner views strengths and weaknesses. **Exceptions:** evidence event fails to save → client retries; mastery computation produces an unexpected state → the system logs the event and retains the previous level until manual review. **Inputs:** evidence events (quiz results, problem outcomes, revision results, section completions). **Outputs:** mastery levels per topic, per category and per roadmap; progress summaries; strengths/weaknesses analysis; learning history. **Permissions:** view own progress (owner only); view aggregate analytics (Content administrator, System administrator).

| ID | Requirement | Src | Pri/Ph | Ver | Acceptance criteria |
| --- | --- | --- | --- | --- | --- |
| FR-PROGRESS-001 | \[E\] The system shall define five mastery levels: Not Started, Attempted, Familiar, Proficient and Mastered. | §11 | M/MVP | I | The data model and UI both use exactly these five levels. |
| FR-PROGRESS-002 | \[E\] The system shall compute mastery-level transitions using the normative MVP transition table in Section 3.11.1. Evidence provenance shall distinguish learner-reported practice completion from system-verified results. | §11 | M/MVP | A | Unit tests cover every transition row, threshold boundary and provenance condition in Section 3.11.1. |
| FR-PROGRESS-003 | \[D\] The system shall enforce the minimum evidence quantities and consecutive-pass rules defined in Section 3.11.1; a single passing revision is insufficient for Mastered. | §11 | M/MVP | A | Boundary tests prove that one passing revision is insufficient for Mastered and that a failed revision resets the consecutive-pass counter. |
| FR-PROGRESS-004 | \[E\] The system shall compute and display topic-level mastery for every topic that has at least one evidence event. | §11 | M/MVP | T | The topic page and roadmap node show the correct mastery level matching the evidence record. |
| FR-PROGRESS-005 | \[E\] The system shall compute and display category-level mastery as a documented aggregate of the mastery levels of its constituent topics. | §11 | M/MVP | A | The aggregation formula is documented; the category page shows the computed value. |
| FR-PROGRESS-006 | \[E\] The system shall compute and display roadmap-level progress using a documented calculation that accounts for mastery levels, not just completion counts. | §6, §11 | M/MVP | A | Roadmap progress differs between a learner with all topics at Attempted versus one with all at Proficient. |
| FR-PROGRESS-007 | \[E\] The system shall provide a learning history showing timestamped evidence events (lessons read, quizzes taken, problems attempted, revisions completed). | §11 | S/MVP | T | The history lists events in reverse chronological order with type, topic and outcome. |
| FR-PROGRESS-008 | \[E\] The system shall display weekly activity data summarising the number of lessons, quizzes and problems completed per day. | §11 | S/MVP | D | A weekly view shows seven days of data with per-day counts. |
| FR-PROGRESS-009 | \[E\] The system shall identify and display areas of strength (topics at Proficient or Mastered) and areas requiring additional practice (topics at Attempted or Familiar with recent incorrect evidence). | §11 | S/MVP | T | Strengths list contains only topics at Proficient or Mastered; weaknesses list contains only topics meeting the weakness criteria. |
| FR-PROGRESS-010 | \[E\] Gamification elements (badges, streaks, points) shall be optional and supportive only; they shall not be the primary progress indicator and shall not penalise the learner for inactivity. | §11 | C/MVP | I | No streak-loss penalty exists; the primary progress view uses mastery levels, not gamification scores. |
| FR-PROGRESS-011 | \[D\] Mastery levels shall propagate to roadmap node states according to the documented mapping (OI-08). A change in mastery level shall update the node state within TBD seconds without requiring a page refresh by the learner. | §6, §11 | M/MVP | T | Completing a quiz that raises mastery updates the roadmap node state on the next roadmap view or within the agreed latency. |
| FR-PROGRESS-012 | \[D\] The system shall never reduce a mastery level below Not Started; the only MVP downward transition is `MASTERED` → `PROFICIENT` following a failed revision assessment, as defined in Section 3.11.1. Time passage alone shall never reduce mastery. | §11 | M/MVP | A | A failed revision downgrades Mastered to Proficient; overdue status without an assessment leaves mastery unchanged. |

### 3.11.1 Normative mastery transition rules (MVP)

The following is the authoritative MVP transition model. `MasteryAssessment` is append-only: a transition updates current `UserProgress.masteryLevel` without changing prior evidence records.

| Current level | Evidence event | Condition | Next level | Roadmap node state | Revision interval |
|---|---|---|---|---|---|
| NOT_STARTED | Lesson section viewed/read | Recorded interaction | ATTEMPTED | IN_PROGRESS | None |
| ATTEMPTED | Knowledge-check assessment | Score < 75% | ATTEMPTED | IN_PROGRESS | None |
| ATTEMPTED | Knowledge-check assessment | Score ≥ 75% | FAMILIAR | IN_PROGRESS | 3 days |
| FAMILIAR | Problem-practice completion | Learner records completion; provenance is SELF_REPORTED unless execution is independently verified | PROFICIENT | COMPLETED | 7 days |
| PROFICIENT | Revision assessment | Score ≥ 80%; first consecutive pass | PROFICIENT | COMPLETED | 21 days |
| PROFICIENT | Revision assessment | Score ≥ 80%; second consecutive pass | MASTERED | MASTERED | 21 days |
| PROFICIENT | Revision assessment | Score < 80% | PROFICIENT | NEEDS_REVISION | 1 day |
| MASTERED | Revision assessment | Score ≥ 80% | MASTERED | MASTERED | 21 days |
| MASTERED | Revision assessment | Score < 80% | PROFICIENT | NEEDS_REVISION | 1 day |
| Any | Time passes without new evidence | No assessment event | Unchanged | Unchanged except due/overdue decoration | Existing schedule becomes due/overdue |

**Evaluation rules:**
1. A passing revision is a completed revision assessment with score ≥ 80%. Two consecutive passing revision assessments are required to reach `MASTERED`.
2. A failed revision assessment (score < 80%) resets `consecutivePasses` to zero. For `MASTERED`, one failed revision downgrades the level to `PROFICIENT`; for `PROFICIENT`, the level remains `PROFICIENT`.
3. A non-revision quiz or lesson interaction shall not increment `consecutivePasses`.
4. Learner-reported problem completion is `SELF_REPORTED`, not system-verified execution. Evidence provenance shall be retained and exposed accurately in learner-facing progress.
5. `RevisionSchedule` is unique per `(userId, topicId)`. `consecutivePasses` is a non-negative integer and is updated atomically with the assessment result.
6. Revision due dates are computed using UTC calendar days and normalized to 00:00:00 UTC. A failed review is due at the next UTC midnight after one calendar day.
7. `MasteryAssessment` records the evidence type and provenance, score, previous level, resulting level and evaluation timestamp.
8. MVP uses deterministic fixed intervals. Adaptive SM-2/FSRS scheduling is P2 and shall not change MVP mastery thresholds.

**Policy limitation:** In the MVP, practice may occur on an external platform. Learner-marked completion is weaker than an accepted automated test result and shall never be labelled `SYSTEM_VERIFIED`. Product Owner acceptance of this evidence model is required before using Proficient as a high-stakes competency claim.


## 3.12 Revision system (FR-REV)

**Primary actor:** Registered learner; system scheduler. **Preconditions:** learner has at least one topic with mastery evidence. **Trigger:** a mastery-level change occurs; a scheduled revision date is reached; learner opens the revision centre; learner manually marks a topic for revision. **Main workflow:** mastery evidence triggers a revision scheduling evaluation → system adds the topic to the revision queue with a recommended date → learner opens the revision centre → selects a topic → re-engages with the concept (re-reads key sections, retakes the knowledge check, reattempts problems) → system records the revision result as new mastery evidence → mastery level is re-evaluated. **Alternative workflows:** learner manually marks a topic for revision; learner dismisses a revision recommendation; learner views upcoming revisions on the dashboard (FR-DASH-010). **Exceptions:** no topics due for revision → empty state suggesting the learner continue learning new topics; revision content unavailable (lesson unpublished) → the topic remains in the queue with a "content unavailable" indicator. **Inputs:** mastery evidence, manual revision requests, revision assessment results. **Outputs:** revision schedule, revision centre page content, updated mastery evidence. **Permissions:** view and interact with own revisions (owner only).

| ID | Requirement | Src | Pri/Ph | Ver | Acceptance criteria |
| --- | --- | --- | --- | --- | --- |
| FR-REV-001 | \[E\] The system shall schedule revision recommendations for topics based on the learner's mastery evidence and previous revision results. | §11, §20 | M/MVP | T | A topic at Familiar with no recent evidence appears in the revision queue within TBD days. |
| FR-REV-002 | \[D\] For the MVP, revision scheduling shall use a deterministic rule-based approach (e.g., fixed intervals per mastery level). Algorithmic spaced-repetition scheduling (e.g., SM-2 or a custom algorithm) shall be a P2 enhancement. | §11 | M/MVP | A | The fixed MVP interval rules in BR-020 and Section 3.11.1 are applied; P2 may replace the scheduler algorithm without changing historical evidence. |
| FR-REV-003 | \[E\] The system shall provide a revision centre page listing all topics due for revision, sorted by urgency, with the revision date and current mastery level for each. | §15, §20 | M/MVP | D | The page lists topics with dates and levels; the most urgent topic appears first. |
| FR-REV-004 | \[E\] The system shall allow the learner to manually mark any topic for revision, adding it to the revision queue with an immediate or near-immediate revision date. | §20 | M/MVP | T | Marking a topic adds it to the revision centre; it appears in the list immediately. |
| FR-REV-005 | \[E\] The system shall generate revision recommendations that bring back concepts based on previous mistakes and demonstrated understanding. | §20 | M/MVP | T | A topic with recent incorrect quiz evidence is recommended for revision sooner than one with correct evidence. |
| FR-REV-006 | \[D\] When a learner selects a topic for revision, the system shall present the revision experience: key lesson sections (concept explanation, knowledge-check quiz, practice problems) and a revision assessment. | §11, §20 | M/MVP | D | The revision view shows at least the concept summary and a re-assessment quiz. |
| FR-REV-007 | \[D\] The revision assessment result shall be recorded as mastery evidence and shall trigger a mastery-level re-evaluation per FR-PROGRESS-002. | §11 | M/MVP | T | Completing a revision assessment updates the mastery level according to the transition rules. |
| FR-REV-008 | \[D\] After a successful revision (assessment meets the upward-transition threshold), the system shall reschedule the next revision at a longer interval; after an unsuccessful revision, it shall reschedule at a shorter interval. | §11, §20 | M/MVP | T | Successful revision pushes the next date further out; unsuccessful revision brings it closer. |
| FR-REV-009 | \[D\] The learner shall be able to dismiss a revision recommendation; dismissed topics shall not reappear until the next scheduled cycle or until the learner manually re-marks them. | §20 | S/MVP | T | Dismissing removes the topic from the current list; it reappears only at the next scheduled date or on manual re-mark. |
| FR-REV-010 | \[E\] Upcoming revisions shall be surfaced on the dashboard (FR-DASH-010) and optionally via notifications (post-MVP). | §10, §20 | S/MVP | T | The dashboard widget shows topics with revision dates ≤ today + TBD days. |
| FR-REV-011 | \[R\] Post-MVP, the system shall implement algorithmic spaced-repetition scheduling that adjusts intervals based on the learner's full revision history and mastery trajectory. | §11, §20 | S/P2 | A | The algorithm's interval calculations are documented and validated against sample revision histories. |
| FR-REV-012 | \[D\] Revision due dates and scheduler cron evaluations shall be anchored strictly to 00:00:00 UTC date boundaries, eliminating timezone jitter and duplicate revision job dispatches across distributed clients (BR-020). | §11, §18 | M/MVP | T | Revision schedules calculated for users in different timezones produce identical UTC target midnight timestamps. |

## 3.13 Notes and bookmarks (FR-NOTE)

**Primary actor:** Registered learner (UC-02). **Preconditions:** authenticated session. **Trigger:** user creates, edits or deletes a note or bookmark from the learning workspace, a lesson, a topic, a problem or a dedicated list page. **Main workflow:** open resource → add note or bookmark → view in dedicated list → edit or delete → (future) export. **Alternative workflows:** create a standalone note not associated with any resource; search or filter notes and bookmarks; access a bookmark to navigate directly to the bookmarked resource. **Exceptions:** save failure → retry without losing entered text; referenced resource deleted or unpublished → bookmark remains with an indicator that the resource is unavailable; note body exceeds size limit → rejection with field-level error. **Inputs:** note title, note body (rich text including code snippets), associated resource reference (lesson, topic, problem or none), bookmark target reference. **Outputs:** stored note, stored bookmark, list views, navigation to bookmarked resource. **Permissions:** the user's own data only; notes and bookmarks are private and shall never be visible to other users or administrators (except as aggregate counts in analytics).

| ID | Requirement | Src | Pri/Ph | Ver | Acceptance criteria |
| --- | --- | --- | --- | --- | --- |
| FR-NOTE-001 | \[E\] The system shall allow a learner to create, edit and delete personal notes. | §20 | M/MVP | T | A note can be created, its title and body modified, and deleted; changes persist across sessions. |
| FR-NOTE-002 | \[E\] The system shall allow a learner to associate a note with a lesson, topic or problem. | §20 | M/MVP | T | A note created from a lesson page stores the lesson reference and displays it. |
| FR-NOTE-003 | \[D\] The system shall allow a learner to create a standalone note not associated with any resource. | §20 | S/MVP | T | A note with no resource association can be created and appears in the notes list. |
| FR-NOTE-004 | \[E\] The system shall support code snippets inside notes with syntax highlighting for the learner's preferred programming language. | §20 | M/MVP | T | A note containing a code block renders with syntax highlighting matching the language selected. |
| FR-NOTE-005 | \[E\] The system shall allow a learner to bookmark lessons, topics and problems. | §20 | M/MVP | T | Each resource type can be bookmarked; a second action on the same resource removes the bookmark. |
| FR-NOTE-006 | \[D\] The system shall provide a bookmarks list page showing all bookmarked resources grouped by type, with links to each resource. | §15, §20 | M/MVP | D | The page lists every bookmark and each link navigates to the correct resource. |
| FR-NOTE-007 | \[D\] The system shall provide a notes list page with search and sort (by date created, date modified, associated resource). | §15, §20 | M/MVP | D | Search by keyword returns matching notes; sort order changes take effect immediately. |
| FR-NOTE-008 | \[D\] When a bookmarked or note-associated resource is unpublished or deleted, the system shall retain the bookmark or note and display an indicator that the resource is unavailable. | §20 | S/MVP | T | Bookmark entry shows "Resource unavailable" instead of a broken link. |
| FR-NOTE-009 | \[D\] Notes and bookmarks shall be private to the owning learner and shall not be accessible to other users. | §20 | M/MVP | T | An API call supplying another user's identifier returns 403; no cross-user data leaks in list queries. |
| FR-NOTE-010 | \[R\] The system shall allow exporting all notes as Markdown or PDF. | §20 | C/Fut | D | Export produces a file containing all notes with formatting preserved. |
| FR-NOTE-011 | \[D\] The system shall enforce a maximum note body size of TBD characters and reject input exceeding the limit with a field-level error. | §20 | M/MVP | T | A note body at the limit saves; one character over is rejected with an error message. |

## 3.14 Search (FR-SEARCH)

**Primary actor:** Any user (UC-01 through UC-05). **Preconditions:** at least one published content item exists. **Trigger:** user activates the command palette (Cmd/Ctrl + K) or opens the search page. **Main workflow:** open palette → type query → view ranked results → select result → navigate to resource. **Alternative workflows:** apply filters (type, domain, difficulty); browse recent searches; browse recently visited pages; browse popular topics; navigate results by keyboard only; follow a related-searches suggestion. **Exceptions:** no results → empty state with spelling suggestions and popular topics; search service unavailable → error message with retry; query too short → prompt for additional characters. **Inputs:** search query text, optional filters. **Outputs:** ranked result list with highlighted matching text, recent searches list, recently visited list, search suggestions. **Permissions:** visitors see only published public content; authenticated users see all published content; administrators additionally see draft and scheduled content titles (marked with status badge).

| ID | Requirement | Src | Pri/Ph | Ver | Acceptance criteria |
| --- | --- | --- | --- | --- | --- |
| FR-SEARCH-001 | \[E\] The system shall provide a command palette activated by Cmd/Ctrl + K from any page. | §13 | M/MVP | T | Pressing the shortcut opens the palette with focus in the search input; pressing Escape closes it. |
| FR-SEARCH-002 | \[E\] The system shall provide unified search over topics, lessons, questions, problems, roadmaps, programming languages, system design case studies and video explanations. | §13 | M/MVP | T | A query matching a topic, a lesson and a problem returns results from all three types. |
| FR-SEARCH-003 | \[E\] The system shall display recent searches persisted per user (or per browser session for visitors). | §13 | M/MVP | T | After performing a search and reopening the palette, the previous query appears in the recent list. |
| FR-SEARCH-004 | \[E\] The system shall display recently visited pages when the palette opens with an empty query. | §13 | S/MVP | T | Opening the palette shows the five most recently visited resources. |
| FR-SEARCH-005 | \[E\] The system shall display search suggestions (auto-complete) as the user types. | §13 | S/MVP | T | After typing three or more characters, suggestions appear within TBD ms. |
| FR-SEARCH-006 | \[E\] The system shall support search filters for content type, domain, difficulty and (for authenticated users) learning status. | §13 | M/MVP | T | Applying a filter restricts results; removing it restores unfiltered results. |
| FR-SEARCH-007 | \[E\] The system shall support full keyboard navigation of search results (arrow keys to move, Enter to select, Escape to close). | §13 | M/MVP | T | A user can search, navigate and select a result without using a mouse. |
| FR-SEARCH-008 | \[E\] The system shall highlight the matching text within each search result. | §13 | M/MVP | T | The query substring is visually distinguished in each result title and snippet. |
| FR-SEARCH-009 | \[E\] The system shall display popular topics when the palette opens with no query and no recent searches. | §13 | S/MVP | D | A new visitor opening the palette sees a "Popular topics" section. |
| FR-SEARCH-010 | \[E\] The system shall display related searches alongside search results. | §13 | S/MVP | D | At least one related search suggestion is shown for queries returning results. |
| FR-SEARCH-011 | \[D\] For visitors, search results shall be limited to published public content and shall never include draft, scheduled, archived or non-public items. | §13, §15 | M/MVP | T | A visitor query for a known draft title returns zero results. |
| FR-SEARCH-012 | \[D\] The MVP search implementation shall use database full-text search (PostgreSQL FTS). | §13 | M/MVP | A | Search queries execute against a PostgreSQL FTS index; no external search service is required. |
| FR-SEARCH-013 | \[R\] A future release shall provide contextual AI-powered search that interprets natural-language queries. | §13 | C/Fut | D | An AI search mode can answer "How does binary search differ from linear search?" with a relevant summary. |
| FR-SEARCH-014 | \[D\] The system shall provide a dedicated search results page (at a stable URL) in addition to the command palette overlay. | §15 | S/MVP | T | A search performed in the palette can be opened as a full-page result list with a shareable URL. |

## 3.15 Daily learning content (FR-DAILY)

**Primary actor:** Content administrator (UC-04) publishing; any user consuming. **Preconditions:** at least one lesson is published or scheduled as the daily lesson. **Trigger (consumer):** user opens the daily lesson page or the dashboard "Today's lesson" card. **Trigger (admin):** administrator schedules a lesson as the daily lesson for a future date. **Main workflow (consumer):** open daily lesson page → consume the lesson → (optionally) attempt the daily challenge → browse the calendar of past daily lessons. **Main workflow (admin):** create or select a lesson → assign it as the daily lesson for a date → preview → confirm. **Alternative workflows:** visit a past daily lesson from the calendar; daily lesson not scheduled → page shows the most recent available daily lesson with a notice. **Exceptions:** no daily lesson has ever been scheduled → empty state explaining the feature; scheduled lesson unpublished before its date → system falls back to the previous daily lesson. **Inputs:** lesson reference, target date. **Outputs:** daily lesson page, calendar view of past daily lessons. **Permissions:** read (all); schedule (Content administrator).

| ID | Requirement | Src | Pri/Ph | Ver | Acceptance criteria |
| --- | --- | --- | --- | --- | --- |
| FR-DAILY-001 | \[E\] The system shall publish one new structured lesson per day on the daily lesson page. | §12 | M/MVP | T | On each calendar day at the configured publish time, the page shows the lesson scheduled for that day. |
| FR-DAILY-002 | \[E\] The system shall provide a daily lesson page accessible to visitors and authenticated users. | §12, §15 | M/MVP | D | The daily lesson page loads without authentication and displays the current daily lesson. |
| FR-DAILY-003 | \[E\] A Content administrator shall be able to schedule a lesson as the daily lesson for a specific future date. | §12 | M/MVP | T | An admin assigns a lesson to a date; the lesson appears on that date and not before. |
| FR-DAILY-004 | \[D\] The system shall allow scheduling daily lessons in advance for multiple future dates. | §12 | M/MVP | T | An admin can schedule lessons for the next seven consecutive days in a single session. |
| FR-DAILY-005 | \[E\] Daily lesson content shall be reusable: it shall be a standard lesson that also appears in its topic's lesson list and can be referenced from roadmaps and search. | §12 | M/MVP | T | The same lesson appears on the daily page and on the topic page; progress is shared. |
| FR-DAILY-006 | \[R\] The daily lesson page shall optionally feature a daily challenge linking to a practice problem related to the day's topic. | §12 | S/MVP | T | When a daily challenge is configured, the page shows a problem link below the lesson; when none is configured, the section is absent. |
| FR-DAILY-007 | \[D\] The system shall provide a calendar view of past daily lessons, allowing users to browse and open any previous daily lesson. | §12 | S/MVP | D | A calendar page lists past daily lessons by date; selecting one opens the lesson. |
| FR-DAILY-008 | \[D\] If no daily lesson is scheduled for the current date, the system shall display the most recent daily lesson with a notice indicating it is not today's lesson. | §12 | S/MVP | T | On an unscheduled day the page shows the fallback lesson and a notice. |
| FR-DAILY-009 | \[D\] The system shall prevent scheduling more than one daily lesson for the same date. | §12 | M/MVP | T | Attempting to schedule a second lesson for an occupied date fails with an error naming the conflict. |

## 3.16 Content administration (FR-CMS)

**Primary actor:** Content administrator (UC-04); System administrator (UC-05) for publishing permissions. **Preconditions:** authenticated admin session; at least one domain and category exist. **Trigger:** administrator opens the admin workspace to create, edit, review or publish content. **Main workflow:** create lesson → select category/topic → add content sections → configure visualization → preview → save as draft → submit for review → reviewer approves → publish or schedule → monitor feedback. **Alternative workflows:** edit an existing lesson; archive a published lesson; restore an archived lesson to draft; reject and return to author with comments; clone a lesson as a template starting point. **Exceptions:** validation failure on save → field-level errors; publish attempted on a lesson missing required sections → rejection listing the missing sections; concurrent edit conflict → the second saver is informed and offered merge or overwrite. **Inputs:** lesson content, problem content, roadmap structure, visualization configuration, scheduling metadata, media assets. **Outputs:** created/updated content in the appropriate status, preview rendering, version history entries, content analytics. **Permissions:** create and edit drafts (Content administrator); publish, schedule and archive (Content administrator with publisher permission or System administrator); view analytics (Content administrator, System administrator).

| ID | Requirement | Src | Pri/Ph | Ver | Acceptance criteria |
| --- | --- | --- | --- | --- | --- |
| FR-CMS-001 | \[E\] The system shall support these content statuses: Draft, In review, Published, Scheduled and Archived. | §12 | M/MVP | T | A lesson can transition through all five statuses; each status is queryable in the content library. |
| FR-CMS-002 | \[E\] The system shall support the 17-step admin publishing workflow: create lesson, select category, select topic, define prerequisites, add learning objectives, add explanation sections, select visualization type, configure visualization inputs, add code examples, add questions and answers, add practice problems, attach video URLs, add related topics, preview, save as draft, schedule or publish, monitor feedback. | §12 | M/MVP | D | An admin can perform all 17 steps end-to-end to publish a lesson. |
| FR-CMS-003 | \[E\] The system shall provide reusable lesson templates for at least these types: DSA concepts, coding interview problems, programming fundamentals, database concepts, system design concepts, computer science theory and engineering tutorials. | §12 | M/MVP | I | Each of the seven template types is selectable when creating a lesson; each defines a default set of sections. |
| FR-CMS-004 | \[E\] The system shall define a structured content schema so that lessons are stored as structured data and new lessons can be published without a frontend deployment. | §12, §21 | M/MVP | A | A lesson created through the admin UI renders on the public site without any code change or redeployment. |
| FR-CMS-005 | \[E\] The system shall allow administrators to configure visualizations through the admin interface using structured configuration (type, inputs, step rules) without writing frontend code. | §8, §12 | M/MVP | D | An admin selects a visualization type, provides inputs and previews the result; no code deployment is required. |
| FR-CMS-006 | \[E\] The system shall provide a lesson editor that supports adding, reordering and removing the sections defined in the lesson structure (introduction, learning objectives, prerequisites, concept explanation, real-world analogy, interactive visualization, step-by-step execution, brute-force approach, optimized approach, code implementation, complexity analysis, common mistakes, interview questions, knowledge-check quiz, practice problems, related concepts, revision notes, video explanation, completion and feedback). | §7 | M/MVP | D | Each of the listed sections can be added to a lesson; sections can be reordered via drag or keyboard. |
| FR-CMS-007 | \[E\] The system shall provide a problem editor for creating and editing practice problems, including problem statement, input/output examples, constraints, hints, solution approaches, code examples and related questions. | §9 | M/MVP | D | An admin creates a problem with all listed fields; it appears in the problem library after publishing. |
| FR-CMS-008 | \[E\] The system shall provide a roadmap editor for creating and editing roadmap nodes, edges, node types, node positions and linked topics. | §6, §15 | M/MVP | D | An admin adds nodes and edges, saves, and the roadmap renders on the public site. |
| FR-CMS-009 | \[D\] The system shall provide a media library for uploading, browsing and selecting images and other media assets to embed in lessons. | §15 | M/MVP | D | An admin uploads an image to the library and inserts it into a lesson. |
| FR-CMS-010 | \[D\] The system shall provide a publishing queue showing all content scheduled for future publication, ordered by date. | §12 | S/MVP | D | The queue lists scheduled items; an admin can reorder or unschedule from the queue. |
| FR-CMS-011 | \[D\] The system shall provide a content review workflow: an author submits a draft for review; a reviewer approves, or rejects with comments; on approval the content becomes publishable. | §12 | M/MVP | T | A draft submitted for review appears in the reviewer's queue; rejection returns it to the author with comments visible. |
| FR-CMS-012 | \[E\] The system shall provide a preview function that renders a lesson, problem or roadmap exactly as it will appear to learners before it is published. | §12 | M/MVP | D | The preview matches the published rendering in layout, styling and visualization. |
| FR-CMS-013 | \[D\] The system shall maintain a version history for lessons, allowing an administrator to view past versions and restore a previous version to draft status. | §12 | S/MVP | D | At least the last TBD versions are retained; restoring creates a new draft from the selected version. |
| FR-CMS-014 | \[D\] The system shall provide content analytics showing views, completion rate and quiz scores per lesson. | §12 | S/MVP | D | Analytics page displays each metric for a selected lesson with data from the last TBD days. |
| FR-CMS-015 | \[D\] The system shall validate that a lesson contains all required sections before allowing transition to Published or Scheduled status. | §12 | M/MVP | T | Attempting to publish a lesson missing a required section fails with an error listing the missing sections. |
| FR-CMS-016 | \[E\] The system shall provide an archiving workflow that removes published content from public discovery while preserving canonical URLs with tombstone notices and links to successor topics. | §12 | S/MVP | T | Visiting an archived lesson URL renders a tombstone notice without 404 error; item is hidden from Explore. |
| FR-CMS-017 | \[R\] Subject to DEC-03 approval, Content Administrators shall have unified author and publish permissions with self-review in MVP; if DEC-03 is not approved, separate author and reviewer/publisher permissions shall remain enforced. | §12, §16 | M/MVP (conditional) | T | Permission tests demonstrate the Product-Owner-approved policy; self-review is not enabled before DEC-03 approval. |
| FR-CMS-018 | \[R\] The system shall support tagging and categorizing content by target interview role (Frontend, Backend, Distributed Systems, General SDE) and estimated completion difficulty. | §12 | S/MVP | I | Tags can be applied in CMS and appear as filter facets in the learner Explore view. |
| FR-CMS-019 | \[D\] Editing an already published lesson shall create an isolated pending draft revision without altering the currently served public lesson. Publishing the draft increments the lesson version number and purges the CDN cache tag atomically (BR-018). | §12, §18 | M/MVP | T | Editing a published lesson leaves live version unchanged until published; CDN cache is purged upon release. |

## 3.17 User settings (FR-SET)

**Primary actor:** Registered learner (UC-02). **Preconditions:** authenticated session. **Trigger:** user opens Settings from the user menu or navigation. **Main workflow:** open settings → modify a preference → save. **Alternative workflows:** change multiple preferences in one session; update profile information; change email or password; re-run onboarding goals. **Exceptions:** email change requires re-verification; password change requires current password confirmation; invalid input → field-level error. **Inputs:** preference values, profile fields, credentials. **Outputs:** persisted preferences applied immediately on the client; confirmation message; verification email on email change. **Permissions:** the user's own data only.

| ID | Requirement | Src | Pri/Ph | Ver | Acceptance criteria |
| --- | --- | --- | --- | --- | --- |
| FR-SET-001 | \[E\] The system shall allow the user to select a theme: dark or light. | §10 | M/MVP | T | Selecting dark theme applies dark colours immediately; selecting light applies light colours. |
| FR-SET-002 | \[E\] The system shall allow the user to set a preferred programming language. | §10 | M/MVP | T | After setting Python, code examples and new notes default to Python syntax highlighting. |
| FR-SET-003 | \[E\] The system shall allow the user to adjust font size. | §10 | M/MVP | T | Increasing font size enlarges body text across all pages. |
| FR-SET-004 | \[E\] The system shall allow the user to enable reduced motion, which suppresses non-essential animations. | §10, §17 | M/MVP | T | With reduced motion on, animated transitions (roadmap pan/zoom easing, visualization auto-play) are suppressed. |
| FR-SET-005 | \[E\] The system shall allow the user to choose compact or comfortable content density. | §10 | M/MVP | T | Compact mode reduces spacing and padding; comfortable mode restores defaults. |
| FR-SET-006 | \[E\] The system shall allow the user to set a daily study goal (e.g., time or number of lessons, values TBD). | §10 | S/MVP | T | A set goal appears on the dashboard; progress toward the goal is tracked daily. |
| FR-SET-007 | \[E\] The system shall allow the user to configure notification preferences (which notification types are enabled). | §10 | S/MVP | T | Disabling a notification type stops delivery of that type; enabling restores it. |
| FR-SET-008 | \[E\] The system shall allow the user to set preferred visualization playback speed. | §10 | S/MVP | T | Changing speed to 2× doubles the playback rate of visualizations. |
| FR-SET-009 | \[E\] The system shall allow the user to set explanation depth (e.g., concise or detailed). | §10 | C/P2 | T | Selecting concise hides optional detail sections in lessons; selecting detailed shows all sections. |
| FR-SET-010 | \[D\] The system shall allow the user to edit their profile (display name, avatar). | §15 | M/MVP | T | Updated display name appears in the navigation and on the profile page. |
| FR-SET-011 | \[D\] The system shall allow the user to change their email address, subject to re-verification of the new address. | §16 | S/MVP | T | A verification email is sent to the new address; the email updates only after the new address is verified. |
| FR-SET-012 | \[D\] The system shall allow the user to change their password, requiring confirmation of the current password. | §16 | M/MVP | T | Providing the correct current password and a valid new password changes the password and invalidates other sessions. |
| FR-SET-013 | \[E\] The system shall allow the user to set a roadmap view preference (graph or list) as the default. | §6, §10 | S/MVP | T | After setting list as default, opening any roadmap initially renders the list view. |
| FR-SET-014 | \[D\] Preference changes shall take effect immediately on the client without requiring a page reload. | §10 | M/MVP | T | Toggling theme switches colours without a full-page reload. |
| FR-SET-015 | \[E\] The system shall allow the user to update onboarding answers (experience level, learning goals, preferred language, study schedule) from settings. | §10 | M/MVP | T | Changing experience level in settings updates the stored value and may change the recommended roadmap. |

## 3.18 Notifications (FR-NOTIF)

**Primary actor:** Registered learner (UC-02); system for automated delivery. **Preconditions:** authenticated session (in-app); verified email (email notifications). **Trigger:** a system event matching an enabled notification type occurs. **Main workflow:** event fires → system checks user preferences → if enabled, generate notification → deliver in-app (and email in P2) → user views and optionally dismisses. **Alternative workflows:** user views all notifications in a notifications panel; user marks all as read; user adjusts preferences from the notification panel. **Exceptions:** email delivery failure → retry per email provider policy; notification preference not set → apply documented defaults. **Inputs:** system events, user preference state. **Outputs:** in-app notification entries, email messages (P2). **Permissions:** each user receives only their own notifications; no user can view another user's notification feed.

| ID | Requirement | Src | Pri/Ph | Ver | Acceptance criteria |
| --- | --- | --- | --- | --- | --- |
| FR-NOTIF-001 | \[E\] The system shall deliver in-app notifications displayed in a notification panel accessible from the main navigation. | §10 | M/MVP | D | A notification icon in the header shows an unread count; clicking opens a panel listing notifications. |
| FR-NOTIF-002 | \[R\] The system shall deliver email notifications for enabled types to the user's verified email address. | §10 | S/P2 | T | An email matching the notification type is received at the user's address within TBD minutes. |
| FR-NOTIF-003 | \[E\] The system shall support these notification types: daily lesson reminder, weekly progress summary, revision reminder, new content in followed topics and account security events. | §10, §11 | M/MVP | T | Each type can be triggered independently and appears in the notification panel with a type indicator. |
| FR-NOTIF-004 | \[E\] The system shall allow users to enable or disable each notification type independently from settings or the notification panel. | §10 | M/MVP | T | Disabling "daily lesson reminder" stops that notification; other types continue. |
| FR-NOTIF-005 | \[D\] The system shall apply documented default notification preferences for new accounts (defaults TBD). | §10 | M/MVP | I | A new account has the default preferences applied without user action. |
| FR-NOTIF-006 | \[E\] The system shall not implement punitive streak loss mechanics, shame-based messages or manipulative engagement loops in notifications. | §11 | M/MVP | I | No notification text penalises missed days or uses loss-aversion language. |
| FR-NOTIF-007 | \[D\] The system shall allow a user to mark individual notifications or all notifications as read. | §10 | M/MVP | T | After marking all as read, the unread count resets to zero. |
| FR-NOTIF-008 | \[D\] Account security event notifications (e.g., password changed, new sign-in from unrecognised device) shall always be delivered and shall not be disablable by the user. | §16 | M/MVP | T | Disabling all notification types still delivers a "password changed" notification. |
| FR-NOTIF-009 | \[D\] Notifications shall be private: each user shall see only their own notification feed. | §10 | M/MVP | T | An API request with another user's identifier returns 403. |

## 3.19 Administrative management (FR-ADMIN)

**Primary actor:** System administrator (UC-05); Content administrator (UC-04) for content-related views. **Preconditions:** authenticated admin session. **Trigger:** administrator opens the admin workspace. **Main workflow:** open admin dashboard → review metrics → manage users or content → configure system settings → review audit log. **Alternative workflows:** search for a specific user; filter content library by status; export analytics; toggle a feature flag. **Exceptions:** unauthorised role → 403; searched user not found → empty state; config change fails validation → field-level error with rollback. **Inputs:** search queries, filter selections, role assignments, configuration values, feature flag states. **Outputs:** dashboard metrics, user lists, content lists with status, analytics reports, audit log entries. **Permissions:** full admin access (System administrator); content library and content analytics (Content administrator); user management and system configuration (System administrator only).

| ID | Requirement | Src | Pri/Ph | Ver | Acceptance criteria |
| --- | --- | --- | --- | --- | --- |
| FR-ADMIN-001 | \[E\] The system shall provide an admin dashboard displaying content metrics: total lessons, total problems, total roadmaps, items by status (draft, in review, published, scheduled, archived) and publication rate. | §15 | M/MVP | D | The dashboard shows each listed metric with data matching the content library counts. |
| FR-ADMIN-002 | \[E\] The system shall provide user management: list all users with search by name or email, view a user's profile and role, assign or change roles and deactivate accounts. | §15 | M/MVP | T | An admin searches for a user by email, views the profile, changes the role to Content administrator and the change takes effect immediately. |
| FR-ADMIN-003 | \[D\] Deactivating a user account shall prevent the user from signing in and shall invalidate existing sessions, but shall not delete their learning data. | §15, §16 | M/MVP | T | A deactivated user's next request is rejected; their progress data remains in the database. |
| FR-ADMIN-004 | \[E\] The system shall provide a content library view listing all lessons, problems and roadmaps with filters for status, domain, category and date range. | §15 | M/MVP | D | Filters narrow the list; clearing filters shows all items; counts match. |
| FR-ADMIN-005 | \[E\] The system shall provide analytics views: content performance (views, completion rates, average quiz scores per lesson), user engagement aggregates (active users, new registrations, daily/weekly/monthly active users) and search analytics (top queries, zero-result queries). | §15 | S/P2 | D | Each analytics view displays data for the selected time range; no individual user learning data is exposed in aggregates. |
| FR-ADMIN-006 | \[D\] The system shall provide system configuration: feature flags (enable/disable specific features without deployment) and system-wide defaults (default theme, default notification preferences, default onboarding values). | §15 | S/MVP | T | Toggling a feature flag disables the feature for all users within TBD seconds without a deployment. |
| FR-ADMIN-007 | \[D\] The system shall maintain an audit log of administrative actions (user role changes, content status transitions, feature flag changes, account deactivations) recording the actor, action, target, timestamp and previous value. | §15, §16 | M/MVP | T | Each listed action type creates an audit entry; entries are append-only and cannot be deleted by any user. |
| FR-ADMIN-008 | \[D\] The audit log shall be viewable only by System administrators, with search by actor, action type and date range. | §15 | M/MVP | T | A Content administrator receives 403 when attempting to view the audit log. |
| FR-ADMIN-009 | \[D\] Administrative pages shall be protected by server-side role checks; a non-admin session shall receive HTTP 403 on every admin API endpoint and shall not see admin navigation. | §16 | M/MVP | T | A learner token calling any admin API returns 403; the admin sidebar is absent from the learner UI. |
| FR-ADMIN-010 | \[R\] The system shall allow exporting content analytics and user engagement reports as CSV. | §15 | C/P2 | D | An export action downloads a CSV file with the displayed data. |

# 4. External Interface Requirements

## 4.1 User interfaces (EIF-UI)

The user interface shall be designed according to the visual identity and interaction rules established in Blueprint §14 and §17: a premium, minimalist, information-dense developer workspace prioritizing a sophisticated dark theme, alongside a high-contrast accessible light theme.

| ID | Requirement | Src | Pri/Ph | Ver | Acceptance criteria |
| --- | --- | --- | --- | --- | --- |
| EIF-UI-001 | [E] The system shall adapt responsively across five designated viewport breakpoints: Mobile (< 640px), Tablet (640px–1023px), Laptop (1024px–1279px), Standard Desktop (1280px–1535px), and Large Desktop (≥ 1536px). | §17 | M/MVP | T | Layout reflows at each specified breakpoint without horizontal overflow or clipped interactive elements. |
| EIF-UI-002 | [E] The learning workspace UI shall provide a 3-column desktop layout consisting of: (1) Collapsible Left Sidebar for curriculum navigation and progress, (2) Central Learning Area for lesson content and interactive visualizations, and (3) Collapsible Right Sidebar for table of contents, in-page navigation, quick notes, and bookmarks. | §7 | M/MVP | D | Collapsing left or right sidebars dynamically expands central reading/visualization width; state persists per session. |
| EIF-UI-003 | [E] On mobile viewports (< 640px), the system shall collapse sidebar columns into touch-friendly modal drawers and bottom sheets, forbidding horizontal three-column compression. | §7, §17 | M/MVP | D | On viewports < 640px, navigation is accessible via drawer menu; central content occupies full viewport width. |
| EIF-UI-004 | [E] The UI shall enforce a maximum readable prose measure between 65 and 75 characters per line (approximately 680px–750px width) within the central reading pane, while permitting visualization containers and code blocks to expand to full pane width. | §14 | S/MVP | I | Prose reading container width is bounded; visualization and wide code snippets utilize available container width. |
| EIF-UI-005 | [E] The UI shall support both dark and light modes using semantic design tokens, defaulting to dark mode for new visitors. Switching themes shall occur instantly without full page reloads or layout shifts. | §10, §14 | M/MVP | T | Theme toggle flips all semantic tokens (background, surface, text, border, accent); no un-themed flashes occur. |
| EIF-UI-006 | [E] The typography system shall use a high-legibility sans-serif font for interface text and body prose, and a dedicated monospace font with ligature support for code blocks, inline code, and algorithmic complexity notations. | §14 | M/MVP | I | Monospace font is applied consistently to all `<pre>`, `<code>`, and editor elements. |
| EIF-UI-007 | [E] All interactive components (buttons, inputs, dropdowns, tabs, dialogs, sliders) shall expose distinct visual states: default, hover, focus-visible, active/pressed, disabled, loading, success, and error. | §14 | M/MVP | T | Every state has distinct CSS styling meeting contrast standards; focus indicators are visible under keyboard navigation. |
| EIF-UI-008 | [E] Interactive visualization containers shall provide a persistent control bar housing playback buttons (play, pause, reset, step-forward, step-back), playback speed slider, input controls, and step counter. | §8 | M/MVP | D | Control bar is fixed or pinned within viewport when interacting with visualization; controls meet minimum target size. |
| EIF-UI-009 | [E] Interactive touch targets on touch-enabled devices shall be at least 24×24 CSS pixels with adequate spacing, in conformance with WCAG 2.2 SC 2.5.8. | §17 | M/MVP | T | Automated audit confirms all interactive touch targets meet or exceed 24×24 CSS px. |
| EIF-UI-010 | [D] When system or user-preference `prefers-reduced-motion` is active, the UI shall disable non-essential animations, canvas smooth-panning, and layout transitions, providing instant state swaps. | §10, §17 | M/MVP | T | Animations and easing transitions are suppressed when reduced-motion is enabled. |

## 4.2 API interfaces (EIF-API)

The frontend client and backend modular monolith shall communicate exclusively via a structured, versioned RESTful HTTP API over TLS 1.3.

| ID | Requirement | Src | Pri/Ph | Ver | Acceptance criteria |
| --- | --- | --- | --- | --- | --- |
| EIF-API-001 | [D] The API shall be versioned via the URL path prefix (e.g., `/api/v1/...`). Breaking changes shall increment the major version number. | §21 | M/MVP | I | All API endpoints adhere to `/api/v1/` prefix. |
| EIF-API-002 | [D] All API endpoints shall validate request payloads, query parameters, and route parameters on the server using shared Zod schemas (CON-004). | §16, §21 | M/MVP | T | Sending malformed payload returns HTTP 422 with structured field-level error details. |
| EIF-API-003 | [D] API error responses shall conform to RFC 7807 (Problem Details for HTTP APIs) containing `type`, `title`, `status`, `detail`, `instance`, and an optional `errors` array for validation failures. | §16, §21 | M/MVP | T | Invalid requests return standardized JSON payload matching RFC 7807 schema. |
| EIF-API-004 | [D] Collection endpoints (topics, lessons, problems, search results) shall support deterministic cursor-based pagination with `limit` (max 100) and `cursor` parameters, returning `nextCursor` and `hasMore` flags. | §18 | M/MVP | T | Paged queries return exact requested limit and correct cursor for sequential traversal. |
| EIF-API-005 | [D] Protected API endpoints shall authenticate requests via secure HTTP-only session cookies or `Bearer` tokens in the `Authorization` header, rejecting unauthenticated requests with HTTP 401. | §16 | M/MVP | T | Missing or invalid auth credentials immediately return HTTP 401. |
| EIF-API-006 | [D] The API shall enforce rate limiting across public, authenticated, and administrative tiers, returning HTTP 429 and `Retry-After` header upon threshold breach. | §16 | M/MVP | T | Sending requests exceeding configured threshold triggers HTTP 429 response. |
| EIF-API-007 | [D] All mutating endpoints (POST, PUT, PATCH, DELETE) accessed via browser session cookies shall validate anti-CSRF tokens or enforce SameSite=Lax/Strict cookie isolation. | §16 | M/MVP | T | Cross-origin unauthorized mutation requests are rejected. |

```typescript
// Standard RFC 7807 Problem Details API Error Interface
export interface ApiProblemDetails {
  type: string;                      // URI reference identifying problem type
  title: string;                     // Short, human-readable summary
  status: number;                    // HTTP status code
  detail: string;                    // Human-readable explanation specific to this occurrence
  instance?: string;                 // URI reference identifying specific occurrence
  errors?: Array<{
    field: string;
    message: string;
    code: string;
  }>;
}
```

## 4.3 Database interfaces (EIF-DB)

| ID | Requirement | Src | Pri/Ph | Ver | Acceptance criteria |
| --- | --- | --- | --- | --- | --- |
| EIF-DB-001 | [E] The backend shall interface with PostgreSQL via Prisma ORM using strongly-typed data access clients generated from `schema.prisma`. | §16, §21 | M/MVP | I | All database queries are executed via Prisma client or parameterized raw queries. |
| EIF-DB-002 | [D] The database interface shall utilize connection pooling with configurable pool sizing (`connection_limit`, `pool_timeout`) to prevent connection exhaustion under high concurrency. | §18 | M/MVP | T | Load test confirming pool gracefully queues requests without dropping connections. |
| EIF-DB-003 | [D] Database schema changes shall be managed through declarative, repeatable Prisma migrations tracked in version control, forbidding manual DDL execution in production. | §21 | M/MVP | I | Migrations directory contains sequential SQL migration files verified in CI pipeline. |
| EIF-DB-004 | [D] The database interface shall execute multi-table dependent operations (e.g., publishing a lesson with its sections, quiz questions, and visualization config) inside ACID transactions. | §12, §21 | M/MVP | T | Simulated crash during multi-table write rolls back completely; no partial records persist. |
| EIF-DB-005 | [D] Database queries supporting full-text search across topics, lessons, and problems shall utilize PostgreSQL tsvector columns and GIN indexes for sub-100ms response times. | §13, §18 | M/MVP | T | Search query execution plans show index scans on `tsvector` indexes. |

## 4.4 Third-party integrations (EIF-INT)

| ID | Requirement | Src | Pri/Ph | Ver | Acceptance criteria |
| --- | --- | --- | --- | --- | --- |
| EIF-INT-001 | [E] The system shall integrate with Google Identity Services via OAuth 2.0 / OpenID Connect for one-click user registration and authentication. | §16 | M/MVP | T | Successful Google OAuth flow exchanges authorization code for user profile, creating or linking user record. |
| EIF-INT-002 | [D] The system shall integrate with a transactional email delivery service (e.g., Resend, AWS SES, or SendGrid) via secure API for sending verification, password reset, and notification emails. | §16 | M/MVP | T | Email triggers produce delivered messages with correct recipient headers and tracking tokens. |
| EIF-INT-003 | [E] The system shall embed video explanations hosted externally on YouTube using privacy-enhanced `youtube-nocookie.com` iframe players. | §7, §12 | M/MVP | D | Lesson video embed loads with responsive 16:9 container using privacy-enhanced domain. |
| EIF-INT-004 | [D] Media assets (diagrams, architecture schematics, static graphics) uploaded via CMS shall be stored in an S3-compatible cloud object store with CDN caching. | §15, §21 | M/MVP | T | Uploaded media returns persistent CDN URL; asset persists independent of application server restart. |
| EIF-INT-005 | [E] For Post-MVP in-platform code execution, the system shall integrate with an isolated, secure external sandbox provider (e.g., Judge0 or containerized microVMs) over a hardened API gateway (CON-007). | §9, §21 | S/P2 | T | Untrusted code executes inside isolated ephemeral sandbox; response returns stdout/stderr within runtime limits. |

## 4.5 Content delivery interfaces (EIF-CDN)

| ID | Requirement | Src | Pri/Ph | Ver | Acceptance criteria |
| --- | --- | --- | --- | --- | --- |
| EIF-CDN-001 | [E] Content published through the CMS (lessons, roadmaps, problems) shall be immediately servable to the frontend client via API without rebuilding or redeploying frontend assets (CON-009). | §12, §21 | M/MVP | T | Publishing a new lesson in CMS makes it retrievable by slug within TBD seconds without deployment. |
| EIF-CDN-002 | [D] Public content API responses shall include HTTP cache headers (`Cache-Control: public, s-maxage=300, stale-while-revalidate=600`) to enable edge caching via CDN. | §18 | S/MVP | T | Response headers verified; subsequent requests served from edge cache. |
| EIF-CDN-003 | [D] When content is updated, published, or archived in the CMS, the system shall issue targeted cache invalidation tags to the edge CDN to ensure consistency. | §12, §18 | S/MVP | T | Updating lesson content purges edge cache tag; client immediately receives updated payload. |

---

# 5. Data Requirements

## 5.1 Entity catalogue

The platform data model comprises 34 entity types (`DATA-ENT-001` through `DATA-ENT-034`) derived directly from Blueprint §21 and the functional requirements:

```typescript
// Core Data Model Domain Types (TypeScript / Prisma Mapping)
export type RoleName = 'LEARNER' | 'CONTENT_ADMIN' | 'SYSTEM_ADMIN';
export type MasteryLevel = 'NOT_STARTED' | 'ATTEMPTED' | 'FAMILIAR' | 'PROFICIENT' | 'MASTERED';
export type NodeState = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'NEEDS_REVISION' | 'MASTERED' | 'PREREQUISITE_NOT_MET';
export type ContentStatus = 'DRAFT' | 'IN_REVIEW' | 'PUBLISHED' | 'SCHEDULED' | 'ARCHIVED';
export type RevisionStatus = 'UPCOMING' | 'DUE' | 'OVERDUE';
export type DifficultyLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
export type ProblemDifficulty = 'EASY' | 'MEDIUM' | 'HARD';
export type NodeType = 'CATEGORY' | 'TOPIC' | 'SUBTOPIC' | 'PROBLEM' | 'ASSESSMENT' | 'MILESTONE';
export type CrossDomainRelation = 'RELATED_TO' | 'BUILDS_ON' | 'APPLIED_IN';
```

1. **DATA-ENT-001 (User)**: Identity record (id, email, passwordHash, displayName, avatarUrl, isEmailVerified, isDeactivated, deactivatedAt, roleId, createdAt, updatedAt).
2. **DATA-ENT-002 (Account)**: OAuth credential link (id, userId, provider, providerAccountId, refreshToken, accessToken, expiresAt).
3. **DATA-ENT-003 (Session)**: Authenticated session token (id, userId, sessionToken, ipAddress, userAgent, expiresAt, createdAt).
4. **DATA-ENT-004 (Role)**: RBAC role definition (id, name, permissionsJson).
5. **DATA-ENT-005 (Domain)**: Top-level learning domain (id, slug, name, description, orderIndex, icon, isPublished).
6. **DATA-ENT-006 (Category)**: Grouping within a domain (id, domainId, slug, name, description, orderIndex).
7. **DATA-ENT-007 (Topic)**: Concrete concept (id, categoryId, slug, name, summary, difficulty, estimatedMinutes, status, isPublished, isArchived, canonicalDomainId). `status` uses the documented content lifecycle values; `ARCHIVED` is a non-public terminal content state.
8. **DATA-ENT-008 (TopicDependency)**: Directed prerequisite (prerequisiteTopicId, dependentTopicId).
9. **DATA-ENT-009 (CrossDomainLink)**: Typed cross-domain semantic link (sourceTopicId, targetTopicId, relationType, description).
10. **DATA-ENT-010 (Roadmap)**: Learning path graph (id, slug, title, description, domainId, isMaster, isPublished, version).
11. **DATA-ENT-011 (RoadmapNode)**: Visual graph vertex (id, roadmapId, topicId, problemId, nodeType, label, posX, posY, orderIndex).
12. **DATA-ENT-012 (RoadmapEdge)**: Directed edge (id, roadmapId, sourceNodeId, targetNodeId, isPrerequisite).
13. **DATA-ENT-013 (Lesson)**: Structured instructional document (id, topicId, slug, title, summary, templateType, status, isPublic, currentVersion, draftVersion, publishedAt, scheduledFor, authorId, reviewerId).
14. **DATA-ENT-014 (LessonSection)**: Ordered section block (id, lessonId, sectionType, orderIndex, title, contentJson, readingMinutes).
15. **DATA-ENT-015 (LessonTemplate)**: Reusable template definition (id, name, allowedSectionTypesJson).
16. **DATA-ENT-016 (VisualizationConfig)**: Visualizer parameters (id, lessonId, visualizerType, initialInputsJson, stepRulesJson, codeSyncJson).
17. **DATA-ENT-017 (Problem)**: Coding interview challenge (id, topicId, slug, title, statementMd, difficulty, inputExample, outputExample, constraints, hintsJson, starterCodeJson, solutionMd, complexityAnalysis, testCasesJson, isPublished).
18. **DATA-ENT-018 (ProblemTag)**: Categorization tag (id, name, slug, tagType).
19. **DATA-ENT-019 (ProblemToTag)**: Join entity (problemId, tagId).
20. **DATA-ENT-020 (Question)**: Conceptual quiz item (id, lessonId, topicId, promptMd, explanationMd, questionType).
21. **DATA-ENT-021 (QuizOption)**: Selectable choice (id, questionId, optionText, isCorrect, orderIndex).
22. **DATA-ENT-022 (UserProgress)**: Learner topic progress (id, userId, topicId, status, masteryLevel, timeSpentMinutes, lastAccessedAt).
23. **DATA-ENT-023 (MasteryAssessment)**: Append-only mastery evidence record (id, userId, topicId, questionId, problemId, evidenceType, evidenceProvenance, score, isSuccess, previousMasteryLevel, resultingMasteryLevel, evaluatedAt). `evidenceProvenance` distinguishes `SELF_REPORTED` from `SYSTEM_VERIFIED`.
24. **DATA-ENT-024 (Bookmark)**: Polymorphic saved item (id, userId, resourceType, resourceId, createdAt).
25. **DATA-ENT-025 (Note)**: Learner private notes and code (id, userId, resourceType, resourceId, title, bodyMd, createdAt, updatedAt).
26. **DATA-ENT-026 (Submission)**: Code attempt record (id, userId, problemId, language, code, status, runtimeMs, memoryKb, submittedAt).
27. **DATA-ENT-027 (DailyChallenge)**: Scheduled daily focal challenge (id, calendarDate, lessonId, problemId, publishedAt).
28. **DATA-ENT-028 (MediaAsset)**: Uploaded visual asset (id, filename, s3Key, url, mimeType, sizeBytes, uploadedBy, createdAt).
29. **DATA-ENT-029 (ContentPublication)**: Publication audit log (id, contentType, contentId, fromStatus, toStatus, actorId, performedAt).
30. **DATA-ENT-030 (LearningActivity)**: Daily activity aggregate (id, userId, activityDate, count, minutesSpent).
31. **DATA-ENT-031 (UserPreference)**: UI display and study preferences (id, userId, theme, fontSize, preferredLanguage, reducedMotion, density, showGamification, studyGoalMinutes, visualizerSpeed, explanationDepth).
32. **DATA-ENT-032 (AuditLog)**: System security log (id, actorId, action, targetEntity, targetId, detailsJson, ipAddress, createdAt).
33. **DATA-ENT-033 (Notification)**: In-app user alert (id, userId, notificationType, title, message, linkUrl, isRead, readAt, createdAt).
34. **DATA-ENT-034 (RevisionSchedule)**: One per-user/per-topic revision state (id, userId, topicId, intervalDays, dueAtUtc, consecutivePasses, lastReviewedAt, revisionStatus). `consecutivePasses` resets to zero after a failed revision assessment.

## 5.2 Entity relationships and constraints

| Entity A | Relation | Entity B | Foreign Key | Cascade Rule | Nullable |
| --- | --- | --- | --- | --- | --- |
| User | 1 : N | Account | `Account.userId` | CASCADE | No |
| User | 1 : N | Session | `Session.userId` | CASCADE | No |
| User | N : 1 | Role | `User.roleId` | RESTRICT | No |
| Domain | 1 : N | Category | `Category.domainId` | RESTRICT | No |
| Category | 1 : N | Topic | `Topic.categoryId` | RESTRICT | No |
| Topic | M : N | Topic | `TopicDependency` (`prerequisiteTopicId`, `dependentTopicId`) | RESTRICT | No |
| Topic | M : N | Topic | `CrossDomainLink` (sourceId, targetId) | CASCADE | No |
| Topic | 1 : N | Lesson | `Lesson.topicId` | RESTRICT | No |
| Lesson | 1 : N | LessonSection | `LessonSection.lessonId` | CASCADE | No |
| Lesson | 1 : 1 | VisualizationConfig | `VisualizationConfig.lessonId` | CASCADE | Yes |
| Topic | 1 : N | Problem | `Problem.topicId` | RESTRICT | Yes |
| Problem | M : N | ProblemTag | `ProblemToTag` (problemId, tagId) | CASCADE | No |
| Problem | 1 : N | Submission | `Submission.problemId` | RESTRICT | No |
| User | 1 : N | Submission | `Submission.userId` | CASCADE | No |
| Lesson | 1 : N | Question | `Question.lessonId` | CASCADE | Yes |
| Question | 1 : N | QuizOption | `QuizOption.questionId` | CASCADE | No |
| User | 1 : N | UserProgress | `UserProgress.userId` | CASCADE | No |
| Topic | 1 : N | UserProgress | `UserProgress.topicId` | RESTRICT | No |
| Topic | 1 : N | MasteryAssessment | `MasteryAssessment.topicId` | RESTRICT | No |
| Topic | 1 : N | RoadmapNode | `RoadmapNode.topicId` (nullable for non-topic nodes) | RESTRICT | Yes |
| User | 1 : N | MasteryAssessment | `MasteryAssessment.userId` | CASCADE | No |
| User | 1 : N | Bookmark | `Bookmark.userId` | CASCADE | No |
| User | 1 : N | Note | `Note.userId` | CASCADE | No |
| Bookmark / Note | Polymorphic reference | Topic, Lesson, Problem, Roadmap | (`resourceType`, `resourceId`) | No database FK; application-level validation; preserve archived targets | Yes |
| Roadmap | 1 : N | RoadmapNode | `RoadmapNode.roadmapId` | CASCADE | No |
| Roadmap | 1 : N | RoadmapEdge | `RoadmapEdge.roadmapId` | CASCADE | No |
| User | 1 : 1 | UserPreference | `UserPreference.userId` | CASCADE | No |
| User | 1 : N | Notification | `Notification.userId` | CASCADE | No |
| User | 1 : N | RevisionSchedule | `RevisionSchedule.userId` | CASCADE | No |
| Topic | 1 : N | RevisionSchedule | `RevisionSchedule.topicId` | RESTRICT | No |
| Lesson | 1 : N | DailyChallenge | `DailyChallenge.lessonId` | RESTRICT | No |
| User | 1 : N | ContentPublication | `ContentPublication.actorId` | RESTRICT | No |
| User | 1 : N | LearningActivity | `LearningActivity.userId` | SET NULL | Yes |
| User | 1 : N | AuditLog | `AuditLog.actorId` | SET NULL | Yes |

## 5.3 Key constraints

| ID | Constraint Specification | Table / Field | Rationale |
| --- | --- | --- | --- |
| DATA-CON-001 | Unique lower-cased user email address. | `User.email` | Prevents duplicate user accounts. |
| DATA-CON-002 | Unique slug per category under domain. | `Category.domainId, Category.slug` | Clean, stable hierarchical URLs. |
| DATA-CON-003 | Unique topic slug globally. | `Topic.slug` | Direct canonical routing `/topics/[slug]`. |
| DATA-CON-004 | Unique lesson slug globally. | `Lesson.slug` | Stable routing `/lessons/[slug]`. |
| DATA-CON-005 | Unique problem slug globally. | `Problem.slug` | Stable routing `/problems/[slug]`. |
| DATA-CON-006 | No self-referencing topic dependency (`prereqId != dependentId`). | `TopicDependency` | Prevents trivial circular dependencies. |
| DATA-CON-007 | Exactly one daily challenge entry per calendar date. | `DailyChallenge.calendarDate` | Enforces BR-005 single daily focal lesson. |
| DATA-CON-008 | Exactly one user progress record per `(userId, topicId)`. | `UserProgress.userId, UserProgress.topicId` | Maintains single source of truth for topic mastery. |
| DATA-CON-009 | Exactly one user bookmark per `(userId, resourceType, resourceId)`. | `Bookmark` | Prevents duplicate bookmarks. |
| DATA-CON-010 | Exactly one revision schedule record per `(userId, topicId)`. | `RevisionSchedule` | Prevents duplicate revision queue entries. |
| DATA-CON-011 | Physical deletion of a Topic is rejected (`RESTRICT`) while referenced by `TopicDependency`, `RoadmapNode`, `Lesson`, `Problem`, `UserProgress`, `MasteryAssessment`, or `RevisionSchedule`. Polymorphic `Bookmark` and `Note` references are preserved through application-level validation; topics are retired by setting `isArchived = true` and `status = ARCHIVED` (BR-019). | `Topic` | Protects curriculum topology, content references and learner history. |

## 5.4 Data validation rules

| ID | Requirement | Src | Pri/Ph | Ver | Acceptance criteria |
| --- | --- | --- | --- | --- | --- |
| DATA-VAL-001 | [D] User password hashes shall be generated using Argon2id or bcrypt (cost factor ≥ 12); plain-text passwords shall never be persisted or logged. | §16 | M/MVP | T | Database inspection verifies password column contains salted hashes only. |
| DATA-VAL-002 | [D] User text input in notes and search queries shall be sanitized to strip executable script tags (`<script>`, `onerror`, `javascript:`) before persistence to prevent stored XSS. | §16 | M/MVP | T | XSS payload strings are safely sanitized or rendered as literal text. |
| DATA-VAL-003 | [D] Lesson content stored in `LessonSection.contentJson` shall adhere strictly to a typed schema specifying allowed node types (headings, paragraphs, code blocks, callouts, lists, math KaTeX). | §12, §21 | M/MVP | T | Malformed JSON content payloads fail schema validation during CMS save. |
| DATA-VAL-004 | [D] Visualization configuration JSON payloads shall validate against specific schema definitions per visualizer type prior to saving in CMS. | §8, §12 | M/MVP | T | Saving visualization with missing required step fields is rejected with validation error. |

## 5.5 Data ownership, access, and retention

| ID | Requirement | Src | Pri/Ph | Ver | Acceptance criteria |
| --- | --- | --- | --- | --- | --- |
| DATA-OWN-001 | [D] A learner owns their personal profile, progress, notes, bookmarks, and submissions. No other learner shall read or modify another user's personal learning data. | §16, §20 | M/MVP | T | Cross-user query attempts return 403 or empty sets. |
| DATA-OWN-002 | [D] Educational content (domains, categories, topics, lessons, problems, roadmaps) is owned by the platform. Content mutations require Content Administrator privileges; System Administrators shall not modify curriculum content unless a separately approved emergency-break-glass procedure is defined and audited. | §15, §16 | M/MVP | T | Learner and System Administrator content-mutation calls return HTTP 403; Content Administrator calls are authorized according to CMS policy. |
| DATA-OWN-003 | [D] Upon account deletion (FR-AUTH-018), personal data shall be deleted or irreversibly anonymized within 30 days, subject to documented legal retention obligations. The workflow shall include User, Account, Session, UserPreference, Note, Bookmark, Submission, UserProgress, MasteryAssessment, RevisionSchedule and Notification records. Learning activity aggregates shall be stripped of user identifiers. | §16 | M/MVP | T | A deletion test verifies every listed record is deleted or irreversibly anonymized; retained security records are separately justified and access-restricted. |
| DATA-OWN-004 | [D] System audit logs (`AuditLog`) shall be immutable and retained for a minimum of 365 days for forensic accountability, accessible only by System Administrators. | §15, §16 | M/MVP | T | Audit log entries cannot be modified or deleted via API. |

---

# 6. Non-Functional Requirements

## 6.1 Performance (NFR-PERF)

| ID | Requirement | Src | Pri/Ph | Ver | Acceptance criteria |
| --- | --- | --- | --- | --- | --- |
| NFR-PERF-001 | [E] The public landing page, category pages, and lesson pages shall achieve Core Web Vitals targets under standard 4G mobile conditions: Largest Contentful Paint (LCP) ≤ 2.5 seconds. | §18 | M/MVP | T | Automated Lighthouse/PageSpeed test reports LCP ≤ 2.5s on 75th percentile of runs. |
| NFR-PERF-002 | [E] All interactive UI elements, including visualization controls and roadmap navigation, shall achieve Interaction to Next Paint (INP) ≤ 200 milliseconds. | §18 | M/MVP | T | INP measured via Chrome DevTools during step execution remains ≤ 200ms. |
| NFR-PERF-003 | [E] Cumulative Layout Shift (CLS) across all public and learner pages shall not exceed 0.1 during full page lifecycle. | §18 | M/MVP | T | Page load and media hydration maintain CLS ≤ 0.1. |
| NFR-PERF-004 | [E] Interactive visualization component bundles and heavy dependencies (e.g., Monaco Editor, React Flow) shall be code-split and dynamically imported on demand, keeping the initial JS bundle under 150 KB gzipped. | §18 | M/MVP | A | Webpack/Vite bundle analysis confirms initial route entry bundle ≤ 150 KB. |
| NFR-PERF-005 | [D] Standard read API endpoints (topic details, lesson contents, roadmap data) shall respond within 100 milliseconds at the 95th percentile under normal load. | §18 | M/MVP | T | Benchmark load testing confirms p95 latency ≤ 100ms. |
| NFR-PERF-006 | [D] Full-text search queries (FR-SEARCH) shall return ranked search suggestions within 150 milliseconds of keystroke debounce. | §13, §18 | M/MVP | T | Search response benchmark confirms sub-150ms roundtrip. |
| NFR-PERF-007 | [D] The roadmap graph canvas shall maintain a sustained 60 frames per second (fps) during panning and zooming operations with up to 250 visible nodes on standard hardware. | §6, §18 | S/MVP | T | FPS telemetry during pan/zoom on 250-node roadmap averages ≥ 55 fps. |

## 6.2 Scalability (NFR-SCALE)

| ID | Requirement | Src | Pri/Ph | Ver | Acceptance criteria |
| --- | --- | --- | --- | --- | --- |
| NFR-SCALE-001 | [D] The backend modular monolith shall be stateless, enabling horizontal scaling behind a standard HTTP load balancer across multiple container instances. | §18, §21 | M/MVP | D | Spinning up 3 backend replicas behind load balancer handles distributed requests seamlessly without session affinity. |
| NFR-SCALE-002 | [D] The system shall support a minimum baseline of 1,000 concurrent active learners reading lessons and stepping through visualizations without performance degradation. | §18 | M/MVP | T | Simulated 1,000 concurrent user load test passes with 0% HTTP 5xx errors and p95 latency < 250ms. |
| NFR-SCALE-003 | [D] The content architecture and database schemas shall support at least 10,000 published topics, 20,000 lessons, and 50,000 questions without requiring structural schema alteration. | §5, §18 | S/MVP | A | Query performance analysis on seeded database with 10k topics confirms index utilization. |

## 6.3 Availability and reliability (NFR-AVAIL / NFR-REL)

| ID | Requirement | Src | Pri/Ph | Ver | Acceptance criteria |
| --- | --- | --- | --- | --- | --- |
| NFR-AVAIL-001 | [D] The public website and learner application shall maintain 99.9% uptime per calendar month, excluding scheduled off-peak maintenance windows. | §18 | M/MVP | A | Monthly uptime monitoring report records ≥ 99.9% availability. |
| NFR-AVAIL-002 | [D] The learning workspace shall support graceful degradation: if an interactive visualization fails to load or execute, the lesson text, explanations, and code examples shall remain fully readable. | §7, §8 | M/MVP | T | Simulating script error in visualization component displays an inline fallback card; text remains accessible. |
| NFR-REL-001 | [D] PostgreSQL automated snapshot backups shall execute daily, with Point-In-Time Recovery (PITR) WAL archiving maintained for 7 days, achieving a Recovery Point Objective (RPO) ≤ 1 hour. | §18 | M/MVP | I | Cloud database configuration verifies active daily snapshots and WAL retention. |
| NFR-REL-002 | [D] In the event of primary database instance failure, failover to standby replica shall complete with a Recovery Time Objective (RTO) ≤ 15 minutes. | §18 | M/MVP | T | Disaster recovery failover drill confirms recovery within 15 minutes. |

## 6.4 Security (NFR-SEC)

| ID | Requirement | Src | Pri/Ph | Ver | Acceptance criteria |
| --- | --- | --- | --- | --- | --- |
| NFR-SEC-001 | [E] All network traffic shall be strictly encrypted in transit using TLS 1.3 (TLS 1.2 minimum); unencrypted HTTP requests shall automatically redirect to HTTPS with HSTS enabled. | §16 | M/MVP | T | SSL Labs test yields Grade A+; HTTP redirects to HTTPS with `Strict-Transport-Security` header. |
| NFR-SEC-002 | [E] Session cookies shall be configured with `HttpOnly`, `Secure`, and `SameSite=Lax` attributes to mitigate XSS session hijacking and CSRF. | §16 | M/MVP | T | Cookie inspection verifies flags on `sessionToken`. |
| NFR-SEC-003 | [E] The application shall implement Content Security Policy (CSP), X-Content-Type-Options: nosniff, X-Frame-Options: DENY, and Referrer-Policy headers on all HTTP responses. | §16 | M/MVP | T | Security headers scanner confirms all four security headers present with strict policies. |
| NFR-SEC-004 | [E] The backend shall prevent SQL injection by utilizing Prisma ORM parameterized queries exclusively; no dynamic un-sanitized string concatenation shall be permitted in raw queries. | §16, §21 | M/MVP | A | Static code analysis (Semgrep/ESLint) verifies zero unparameterized query calls. |
| NFR-SEC-005 | [E] Untrusted learner-submitted code shall NEVER execute on the core application server or database instance (CON-007). In MVP, code execution is restricted to external links or client-side evaluation. | §9, §16 | M/MVP | I | Architecture audit verifies zero server-side `eval()` or child process execution of user code. |
| NFR-SEC-006 | [D] Authentication endpoints shall be protected against credential stuffing and brute-force attacks by IP-based and account-based rate limiters (maximum 5 failed attempts per 15 minutes per IP). | §16 | M/MVP | T | 6th failed login attempt within 15 minutes returns HTTP 429. |

## 6.5 Privacy (NFR-PRIV)

| ID | Requirement | Src | Pri/Ph | Ver | Acceptance criteria |
| --- | --- | --- | --- | --- | --- |
| NFR-PRIV-001 | [E] The platform shall enforce strict data minimization: onboarding and account creation shall never collect telephone numbers, physical addresses, or financial data (BR-007). | §10, §16 | M/MVP | I | Data schema audit confirms zero unnecessary personal identifiable fields. |
| NFR-PRIV-002 | [D] User learning progress, quiz responses, notes, and bookmarks shall never be exposed to third-party ad networks or tracking trackers. Third-party analytics shall be privacy-respecting and cookieless. | §16 | M/MVP | I | Network request audit verifies no telemetry packets dispatched to third-party ad trackers. |
| NFR-PRIV-003 | [D] Learners shall be able to download an export of all their personal data (profile, progress history, notes, bookmarks, submissions) in JSON format upon request. | §16 | S/MVP | T | Triggering data export produces complete downloadable JSON archive within 60 seconds. |

## 6.6 Accessibility (NFR-A11Y)

| ID | Requirement | Src | Pri/Ph | Ver | Acceptance criteria |
| --- | --- | --- | --- | --- | --- |
| NFR-A11Y-001 | [E] The entire web application shall conform to Web Content Accessibility Guidelines (WCAG) 2.2 Level AA standards. | §17 | M/MVP | T | Automated axe-core / Playwright accessibility audit reports 0 violations across all core routes. |
| NFR-A11Y-002 | [E] All functional capabilities, including roadmap navigation, search, and visualization stepping, shall be fully operable via keyboard alone without requiring mouse drag interactions (WCAG 2.1.1, 2.5.7). | §6, §17 | M/MVP | T | Full keyboard walkthrough completes lesson, steps visualization, and navigates roadmap. |
| NFR-A11Y-003 | [E] Interactive elements shall provide a persistent, high-contrast visual focus indicator (minimum 3:1 contrast ratio against adjacent surfaces) whenever focused via keyboard. | §17 | M/MVP | T | Visual inspection confirms visible focus rings on all focusable components. |
| NFR-A11Y-004 | [E] Text and user interface components shall satisfy WCAG 2.2 contrast minimums: normal text ≥ 4.5:1, large text (≥ 18pt or 14pt bold) ≥ 3:1, and UI boundaries/icons ≥ 3:1 in both dark and light themes. | §14, §17 | M/MVP | T | Automated color contrast analyzer confirms compliance across all token combinations. |
| NFR-A11Y-005 | [E] For graphical roadmaps and complex interactive simulations, the system shall provide equivalent textual or tabular accessible alternatives (e.g., list-based roadmap view per FR-ROADMAP-014). | §6, §17 | M/MVP | D | Screen reader user can navigate complete curriculum structure via list view. |
| NFR-A11Y-006 | [E] Information conveyed by color (e.g., mastery levels, difficulty badges, pass/fail states) shall also be distinguishable by text labels, distinct icons, or geometric patterns (WCAG 1.4.1). | §6, §14, §17 | M/MVP | I | Inspection in greyscale simulator confirms all states remain clearly identifiable. |

## 6.7 Usability (NFR-USE)

| ID | Requirement | Src | Pri/Ph | Ver | Acceptance criteria |
| --- | --- | --- | --- | --- | --- |
| NFR-USE-001 | [R] Subject to DEC-02 approval, new learners should be able to complete onboarding and receive a recommended starting roadmap within 90 seconds; the flow shall remain skippable regardless of the target. | §10, §19 | S/MVP (conditional) | T | If DEC-02 is approved, representative usability testing demonstrates the agreed target; otherwise the measured result is reported without a mandatory 90-second pass/fail threshold. |
| NFR-USE-002 | [E] First-time visitors shall be able to locate a relevant topic, enter the learning workspace, and initiate an interactive visualization step within 3 clicks from the landing page. | §15, §19 | M/MVP | T | User journey click-depth test validates 3-click access path. |
| NFR-USE-003 | [D] All form inputs and interactive actions shall provide immediate visual feedback (inline validation, active states, or loading spinners) within 100 milliseconds of user action. | §14, §18 | M/MVP | T | Visual response latency benchmark verifies < 100ms feedback. |

## 6.8 Maintainability and observability (NFR-MAINT / NFR-OBS)

| ID | Requirement | Src | Pri/Ph | Ver | Acceptance criteria |
| --- | --- | --- | --- | --- | --- |
| NFR-MAINT-001 | [E] The project codebase shall be organized as a modular monolith within a monorepo, enforcing clean boundary isolation between packages (apps/web, apps/api, packages/ui, packages/db, packages/schemas). | §21 | M/MVP | I | Repository structure verifies distinct workspaces; dependency graph contains no cyclic imports. |
| NFR-MAINT-002 | [D] Shared TypeScript validation schemas (Zod) shall serve as single source of truth for both frontend form validation and backend API request validation. | §16, §21 | M/MVP | I | Monorepo setup imports schemas from shared package in both client and server code. |
| NFR-MAINT-003 | [D] Unit test suite coverage shall exceed 80% line coverage across shared utilities, mastery evaluation logic, and visualization state reducers. | §21 | M/MVP | T | `vitest run --coverage` reports ≥ 80% coverage on core packages. |
| NFR-OBS-001 | [D] The backend shall emit structured JSON log events to stdout, tagging every request with `correlationId`, `userId` (if authenticated), `route`, `statusCode`, and `durationMs`. | §18 | M/MVP | T | Log stream inspection confirms valid JSON structure with correlation IDs. |
| NFR-OBS-002 | [D] Application runtime exceptions and unhandled Promise rejections shall be captured by an error tracking monitor (e.g., Sentry) with stack traces and sanitized context. | §18 | M/MVP | T | Triggering simulated error dispatches error event to monitoring dashboard. |

# 7. Use Cases and User Workflows

## UC-100: Public Visitor Discovers and Explores Content

- **Primary Actor:** Public Visitor (UC-01).
- **Preconditions:** Public website is online; published domains, categories, and topics exist.
- **Trigger:** Visitor navigates to platform root URL or follows an external search/social link.
- **Main Success Scenario:**
  1. Visitor lands on Homepage (`/`), reviewing the core value proposition and 8 major domain cards.
  2. Visitor clicks "Explore" or an individual domain card (e.g., "Data Structures and Algorithms").
  3. System renders the Category/Topic overview page displaying published topics and roadmap previews.
  4. Visitor selects a public roadmap (e.g., "DSA Roadmap").
  5. System renders the interactive roadmap canvas in read-only mode (without personalized progress overlays).
  6. Visitor selects a node (e.g., "Binary Search"). System displays the contextual preview panel.
  7. Visitor clicks "Start Learning".
  8. System loads the public lesson in the Learning Workspace, displaying explanations, interactive visualization, and code examples.
- **Alternative Flows:**
  - *2a. Direct Deep-Link:* Visitor arrives directly at a lesson URL (`/lessons/binary-search`). System serves the lesson immediately without requiring navigation through the landing page.
  - *8a. Attempting Authenticated Action:* Visitor clicks "Bookmark Lesson" or "Save Notes". System prompts for login/registration (FR-PUB-011) and redirects back to the exact lesson upon authentication.
- **Exception Flows:**
  - *E1. Unpublished/Draft Topic URL:* System returns an accessible 404 Not Found page offering navigation back to Explore without revealing draft content status.
- **Postconditions:** Visitor successfully accesses published content; session remains unauthenticated until explicit registration.
- **Related Requirements:** FR-PUB-001, FR-PUB-002, FR-PUB-004, FR-PUB-005, FR-PUB-011, BR-001.

---

## UC-200: New User Registers and Completes Onboarding

- **Primary Actor:** Prospective Learner (UC-01 transitioning to UC-02).
- **Preconditions:** User is unauthenticated.
- **Trigger:** User clicks "Register" or "Sign Up".
- **Main Success Scenario:**
  1. User navigates to Registration page (`/register`).
  2. User inputs valid email address and password satisfying security policy (or clicks "Continue with Google").
  3. System creates an unverified account record and dispatches an email verification token with single-use link.
  4. User opens verification link in email.
  5. System marks email verified, initializes authenticated session, and redirects to Onboarding flow (`/onboarding`).
  6. User steps through 6 concise onboarding screens: (1) Welcome, (2) Experience Level, (3) Primary Goal, (4) Preferred Language, (5) Daily Study Time, (6) Recommended Starting Roadmap.
  7. System deterministically evaluates answers, saves `UserPreference` record, initializes `UserProgress` records, and presents recommended roadmap.
  8. User clicks "Start Learning" and lands on their personalized Dashboard (`/dashboard`).
- **Alternative Flows:**
  - *2a. Google OAuth:* User signs up via Google; email is automatically marked verified; user skips email verification step and proceeds directly to Onboarding.
  - *6a. Skip Onboarding:* User clicks "Skip for now". System assigns sensible defaults (e.g., Beginner, Python, 20 mins/day) and navigates directly to Dashboard.
- **Exception Flows:**
  - *E1. Duplicate Email:* System informs user that email cannot be registered without confirming if an account exists (or prompts for login).
  - *E2. Expired Verification Token:* System informs user that token has expired and displays a single-click "Resend Verification Email" button.
- **Postconditions:** User account is active, verified, preferences stored, and personalized dashboard available.
- **Related Requirements:** FR-AUTH-001, FR-AUTH-003, FR-AUTH-005, FR-ONB-001 through FR-ONB-008, BR-007.

---

## UC-300: Learner Follows an Interactive Roadmap

- **Primary Actor:** Registered Learner (UC-02).
- **Preconditions:** User is authenticated; selected roadmap is published.
- **Trigger:** Learner clicks a roadmap link from Dashboard or Navigation.
- **Main Success Scenario:**
  1. System renders the interactive React Flow roadmap canvas (`/roadmaps/[slug]`).
  2. Canvas displays nodes color-coded and badged with the learner's individual node states (Not Started, In Progress, Completed, Needs Revision, Mastered).
  3. Learner uses zoom, pan, or minimap to inspect the curriculum topology.
  4. Learner clicks on an "In Progress" or "Not Started" topic node.
  5. System highlights incoming prerequisite edges and outgoing dependent edges.
  6. Contextual slide-out panel displays topic summary, estimated time, prerequisite status, lesson count, and mastery score.
  7. Learner clicks "Start Learning".
  8. System transitions smoothly into the Learning Workspace for the selected topic.
- **Alternative Flows:**
  - *3a. Accessible List Mode:* Learner toggles the "List View" switch. Canvas replaces with an accessible hierarchical list view reflecting identical states, filters, and actions. Choice is saved to `UserPreference`.
  - *4a. Prerequisite Warning:* Learner selects a node with unmet prerequisites. System displays a non-blocking advisory banner: *"Recommended: complete [Prerequisite Topic] first"*, while keeping the "Start Learning" button active (BR-002).
- **Exception Flows:**
  - *E1. WebGL/Canvas Failure:* System detects rendering failure and automatically falls back to Accessible List View with an explanatory toast.
- **Postconditions:** Learner transitions to lesson; node interaction state logged.
- **Related Requirements:** FR-ROADMAP-001 through FR-ROADMAP-020, BR-002, BR-013.

---

## UC-400: Learner Completes an Interactive Lesson

- **Primary Actor:** Registered Learner (UC-02).
- **Preconditions:** Learner is authenticated; lesson is published.
- **Trigger:** Learner enters a lesson via roadmap node or topic catalog.
- **Main Success Scenario:**
  1. System renders the 3-column Learning Workspace with collapsible navigation, lesson content, and right-hand table of contents.
  2. Learner reads the concept explanation and real-world analogy sections.
  3. Learner reaches the Interactive Visualization container.
  4. Learner clicks "Play" to watch algorithm step through default input data.
  5. Learner pauses, inputs custom array/target values, and clicks "Step Forward" to inspect pointer movements, highlighted variables, and state explanation messages.
  6. Learner reads the brute-force vs. optimized complexity analysis sections.
  7. Learner answers the Knowledge-Check quiz questions embedded in the lesson.
  8. System evaluates answers instantly, displays comprehensive explanations, and logs a `MasteryAssessment` evidence record.
  9. System automatically calculates updated topic mastery level and marks the lesson section completed.
- **Alternative Flows:**
  - *5a. Step Backward:* Learner steps backward to re-examine a previous loop iteration or variable swap.
  - *7a. Incorrect Quiz Attempt:* Learner selects wrong option. System reveals explanation, logs failed attempt, and offers a retry after reviewing relevant section.
- **Exception Flows:**
  - *E1. Visualization Payload Corruption:* System displays an alert within visualizer frame with a "Reset to Defaults" button without breaking lesson prose.
- **Postconditions:** Lesson progress updated, mastery evidence recorded, next lesson recommended.
- **Related Requirements:** FR-LEARN-001 through FR-LEARN-019, FR-VIZ-001 through FR-VIZ-012, FR-PROGRESS-001, BR-003.

---

## UC-500: Learner Practices Coding Challenges

- **Primary Actor:** Problem Solver (UC-03 / UC-02).
- **Preconditions:** Learner is authenticated; problem library populated with original problems (CON-008).
- **Trigger:** Learner clicks "Problems" in navigation or follows a practice link from a lesson.
- **Main Success Scenario:**
  1. Learner opens Problem Library (`/problems`).
  2. Learner filters list by Topic ("Binary Search"), Difficulty ("Medium"), and Status ("Unsolved").
  3. Learner selects problem "Search in Rotated Sorted Array".
  4. System opens Problem Detail page displaying statement, examples, constraints, hints, and code editor.
  5. Learner expands Progressive Hint 1.
  6. Learner writes solution in Monaco editor in chosen language (Python/TypeScript/Java/C++).
  7. (MVP) Learner tests code locally or via integrated external practice sandbox link; (Post-MVP) clicks "Run Code".
  8. Learner marks problem completed or submits solution; system records `Submission` record and updates topic mastery evidence.
- **Alternative Flows:**
  - *5a. Progressive Reveal:* Learner expands Hints 1, 2, then views full algorithmic breakdown and complexity analysis.
- **Exception Flows:**
  - *E1. Untrusted Code Sandbox Timeout (Post-MVP):* Sandbox terminates process after 5s limit and returns execution timeout error without impacting core server.
- **Postconditions:** Submission record created, problem marked attempted/solved, mastery updated.
- **Related Requirements:** FR-PROB-001 through FR-PROB-015, FR-PRACTICE-001 through FR-PRACTICE-010, BR-009, BR-011.

---

## UC-600: Learner Reviews Weak Concepts via Revision Center

- **Primary Actor:** Registered Learner (UC-02).
- **Preconditions:** Learner has completed lessons with recorded mastery evidence.
- **Trigger:** Learner navigates to Revision Center (`/revision`) or clicks an "Upcoming Revision" card on Dashboard.
- **Main Success Scenario:**
  1. Learner opens Revision Center.
  2. System lists topics flagged as "Needs Revision" or scheduled for spaced review, prioritized by urgency.
  3. Learner clicks "Review Now" on highest-priority topic (e.g., "Two Pointers").
  4. System serves targeted revision module: summary concept recap, key mistakes, and a 3-question reassessment quiz.
  5. Learner answers reassessment questions.
  6. Learner achieves ≥ 80% score.
  7. System records new mastery evidence, transitions topic state from "Needs Revision" to "Proficient", and reschedules next review interval.
- **Alternative Flows:**
  - *6a. Failed Reassessment:* Learner scores < 80%. System preserves "Needs Revision" state, highlights specific weak concepts, and schedules follow-up review for tomorrow.
- **Postconditions:** Mastery score updated, revision queue updated, activity recorded.
- **Related Requirements:** FR-REV-001 through FR-REV-011, FR-PROGRESS-002, BR-003.

---

## UC-700: Learner Manages Private Notes and Bookmarks

- **Primary Actor:** Registered Learner (UC-02).
- **Preconditions:** Learner is authenticated.
- **Trigger:** Learner clicks "Add Note" or "Bookmark" icon in Learning Workspace.
- **Main Success Scenario:**
  1. In the right-hand sidebar of a lesson, learner clicks "Take Note".
  2. Learner types note title, markdown notes, and embeds a code snippet.
  3. System saves note asynchronously via API with automatic debounce.
  4. Learner clicks the Bookmark icon in the header. System records bookmark.
  5. Learner later navigates to Personal Notebook (`/notebook`).
  6. System displays all user notes searchable by keyword and filterable by associated topic/problem.
  7. Learner edits note contents; changes persist.
- **Alternative Flows:**
  - *7a. Standalone Note:* Learner creates a general engineering note directly from `/notebook` without associating it with a lesson.
- **Postconditions:** Private note persisted; inaccessible by any other user or administrator.
- **Related Requirements:** FR-NOTE-001 through FR-NOTE-011, DATA-OWN-001.

---

## UC-800: Learner Uses Unified Global Search (Cmd+K)

- **Primary Actor:** Any User (UC-01 through UC-05).
- **Preconditions:** User is viewing any page on the platform.
- **Trigger:** User presses keyboard shortcut `Cmd + K` (Mac) / `Ctrl + K` (Windows) or clicks header search bar.
- **Main Success Scenario:**
  1. System opens accessible command palette modal overlay with immediate autofocus on search input.
  2. User types search term (e.g., "Dijkstra").
  3. System debounces input (150ms) and executes full-text query across topics, lessons, problems, and roadmaps.
  4. Palette displays categorized results: Topics (1), Lessons (2), Roadmaps (1), Problems (2).
  5. User navigates results using Arrow Up/Down keys; highlighted item shows brief snippet and domain badge.
  6. User presses `Enter`.
  7. Modal closes immediately and system navigates to selected resource.
- **Alternative Flows:**
  - *2a. Empty Input:* Modal displays recent searches, recently visited topics, and popular trending roadmaps.
- **Exception Flows:**
  - *E1. No Results Found:* Palette displays "No matching topics or problems found", suggesting alternative related search terms.
- **Postconditions:** User seamlessly navigates to destination resource without mouse interaction.
- **Related Requirements:** FR-SEARCH-001 through FR-SEARCH-012, NFR-PERF-006, NFR-A11Y-002.

---

## UC-900: Content Admin Authors and Publishes Daily Lesson

- **Primary Actor:** Content Administrator (UC-04).
- **Preconditions:** Administrator is authenticated with Content Admin privileges.
- **Trigger:** Admin opens Admin CMS workspace (`/admin/lessons/new`).
- **Main Success Scenario:**
  1. Admin opens Lesson Editor and selects Template Type ("DSA Concept").
  2. Admin selects Domain ("DSA"), Category ("Binary Search"), and Topic ("Search in Rotated Array").
  3. Admin enters title, summary, estimated minutes, prerequisites, and learning objectives.
  4. Admin adds content sections: concept markdown explanation, complexity tables, and multi-language code snippets.
  5. Admin selects Visualization Type ("Binary Search Array") and configures initial JSON inputs (array elements, target value, step logic).
  6. Admin adds 3 multiple-choice quiz questions with answer rationales.
  7. Admin embeds YouTube video URL.
  8. Admin clicks "Preview". System renders the lesson exactly as a learner will experience it.
  9. Admin selects status "Scheduled" and sets publication date/time for tomorrow at 06:00 UTC.
  10. System saves lesson record in database; at scheduled timestamp, background worker automatically marks status "Published" and binds it to `DailyChallenge`.
- **Alternative Flows:**
  - *9a. Instant Publish:* Admin clicks "Publish Now". Lesson immediately becomes visible on the public site without redeployment (CON-009).
- **Exception Flows:**
  - *E1. Visualization Config Schema Failure:* System highlights invalid JSON fields and prevents publishing until schema passes validation.
- **Postconditions:** Lesson scheduled/published; zero frontend or backend deployment executed.
- **Related Requirements:** FR-CMS-001 through FR-CMS-018, FR-DAILY-001 through FR-DAILY-008, BR-004, BR-005, BR-016.

---

## UC-1000: Admin Modifies Roadmap Graph Topology

- **Primary Actor:** Content Administrator (UC-04).
- **Preconditions:** Admin has Content Admin privileges; roadmap exists.
- **Trigger:** Admin opens Roadmap Editor (`/admin/roadmaps/[slug]`).
- **Main Success Scenario:**
  1. Admin opens visual canvas editor displaying existing roadmap graph.
  2. Admin adds a new Topic Node ("Trie Data Structure").
  3. Admin positions node on canvas and links it to canonical topic record.
  4. Admin creates a directed prerequisite edge from "Tree Fundamentals" to "Trie Data Structure".
  5. Admin clicks "Validate Graph". System traverses graph and verifies acyclic properties (DAG).
  6. Admin clicks "Save Changes".
  7. System writes nodes and edges to database within an ACID transaction.
- **Alternative Flows:**
  - *5a. Circular Prerequisite Attempt:* Admin attempts to link "Trie" back to an ancestor node. System detects cycle, highlights loop in red, and displays validation error: *"Circular dependency detected: Tree -> Trie -> Tree. Save blocked."* (FR-DOM-004, FR-ROADMAP-021).
- **Postconditions:** Roadmap graph updated in database and served to learners on next fetch.
- **Related Requirements:** FR-ROADMAP-001, FR-ROADMAP-021, FR-DOM-004.

---

## UC-1100: Returning Learner Resumes Active Learning

- **Primary Actor:** Registered Learner (UC-02).
- **Preconditions:** Learner has prior activity.
- **Trigger:** Learner navigates to platform and logs in.
- **Main Success Scenario:**
  1. System authenticates learner and serves personalized Dashboard (`/dashboard`).
  2. Dashboard prominently features "Continue Learning" banner showing last accessed lesson ("Dynamic Programming: 0/1 Knapsack", 65% completed).
  3. Learner clicks "Resume Lesson".
  4. System opens Learning Workspace, automatically scrolling to the first uncompleted section or quiz checkpoint.
  5. Learner continues lesson.
- **Postconditions:** Learning activity updated; seamless re-engagement achieved.
- **Related Requirements:** FR-DASH-001 through FR-DASH-011.

---

## UC-1200: User Configures Accessibility and Display Preferences

- **Primary Actor:** Registered Learner (UC-02) or Visitor (UC-01).
- **Preconditions:** User is viewing application.
- **Trigger:** User opens Settings (`/settings`) or toggles quick preference controls in header.
- **Main Success Scenario:**
  1. User opens Settings panel.
  2. User changes Theme to "Dark", Font Size to "Large" (18px base), Density to "Comfortable", and toggles "Reduce Motion" to ON.
  3. System applies changes immediately via CSS variables and semantic tokens across all pages without full reload.
  4. System persists preferences to `UserPreference` database record (for logged-in learners) and `localStorage` (for visitors).
- **Postconditions:** Custom display preferences remain active across all subsequent sessions.
- **Related Requirements:** FR-SET-001 through FR-SET-010, NFR-A11Y-001 through NFR-A11Y-006.

---

# 8. Business Rules and System Constraints

| ID | Rule Statement | Source | Affected Requirements |
| --- | --- | --- | --- |
| BR-001 | **Public vs. Protected Content Access:** All top-level domain catalogs, categories, public roadmaps, problem statements, and lessons explicitly flagged `isPublic = true` shall be accessible to unauthenticated visitors. Saving progress, taking notes, creating bookmarks, submitting code, and viewing personalized analytics shall strictly require an authenticated account. | §15, §16 | FR-PUB-001 to 011, FR-AUTH-015 |
| BR-002 | **Non-Blocking Prerequisites:** Prerequisite relationships between topics and roadmap nodes shall be advisory and pedagogical only. The system shall never lock, disable, or prevent a learner from opening any published lesson or problem, regardless of prerequisite completion status. | §6 | FR-ROADMAP-012, FR-DOM-004 |
| BR-003 | **Evidence-Based Mastery Progression:** Mastery levels (Not Started, Attempted, Familiar, Proficient, Mastered) shall transition exclusively upon verifiable interaction evidence (quiz scores, problem submissions, revision checks). A lesson marked read or viewed shall never promote mastery beyond `ATTEMPTED`. Reaching `MASTERED` requires sustained multi-instance performance including spaced revision. | §11 | FR-PROGRESS-001 to 008, FR-REV-001 to 011 |
| BR-004 | **Content State Lifecycle:** All published content (lessons, problems, roadmaps) shall follow a strict state machine: `DRAFT` → `IN_REVIEW` → `PUBLISHED` (or `SCHEDULED` → `PUBLISHED`) → `ARCHIVED`. Content in `DRAFT` or `IN_REVIEW` shall never be visible to learners or public visitors under any circumstance. | §12, §15 | FR-CMS-001 to 018 |
| BR-005 | **Single Daily Focal Lesson:** Exactly one lesson shall be designated as the `DailyChallenge` per calendar day (UTC). Past daily lessons remain permanently accessible in the archive; future daily lessons remain hidden until scheduled UTC release. | §12 | FR-DAILY-001 to 008, DATA-CON-007 |
| BR-006 | **Supportive, Non-Punitive Gamification:** Gamification mechanics (streaks, weekly goals, activity heatmaps) shall be opt-in and supportive. The system shall never employ punitive streak resets, public shaming badges, or high-frequency manipulative push notifications. | §11 | FR-DASH-006, FR-PROGRESS-008, FR-NOTIF-007 |
| BR-007 | **Data Minimization:** Onboarding and registration flows shall collect strictly essential technical and learning data (experience level, primary goal, preferred language, study time). Collection of physical addresses, telephone numbers, and financial details is strictly prohibited in MVP. | §10, §16 | FR-ONB-002, NFR-PRIV-001 |
| BR-008 | **Configuration-Driven Visualizations:** All interactive algorithmic and architectural visualizations shall be instantiated via structured JSON configuration schemas applied to reusable component templates. The system shall forbid writing custom frontend application code for individual daily lessons. | §8, §12 | FR-VIZ-001 to 012, FR-CMS-008 |
| BR-009 | **Intellectual Property and Copyright Compliance:** The platform shall strictly prohibit reproducing proprietary problem descriptions, solutions, or copyrighted text from LeetCode, NeetCode, or other proprietary platforms. All problems and explanations shall be original or licensed (CON-008). | §9 | FR-PROB-001 to 015, CON-008 |
| BR-010 | **Right to Erasure and Data Portability:** Upon user account deletion, all personal profile records, private notes, bookmarks, and submissions shall be permanently removed or cryptographically anonymized within 30 days. System audit logs may retain the minimum necessary security metadata under DATA-OWN-004, with direct identifiers removed or pseudonymized where feasible; purpose, access and expiry shall be documented. | §16 | FR-AUTH-018, DATA-OWN-003 |
| BR-011 | **Zero Untrusted Execution on Host:** Under no circumstance shall arbitrary learner-submitted code execute inside the application server runtime, host container, or primary database environment (CON-007). Execution must occur on client WebAssembly or isolated third-party sandbox microVMs. | §9, §16 | FR-PRACTICE-001 to 010, CON-007 |
| BR-012 | **Canonical Topic Ownership:** Every topic shall belong canonically to exactly one primary Domain and Category. Topics cross-listed in additional domains (e.g., Caching in both DSA and System Design) shall share a single canonical identity and unified progress record. | §5 | FR-DOM-001 to 006 |
| BR-013 | **Deterministic Node State Derivation:** A roadmap node's display state shall be calculated deterministically from the learner's underlying `UserProgress` and prerequisite tree: (1) `PREREQUISITE_NOT_MET` if prerequisites incomplete and topic not started, (2) `NOT_STARTED`, (3) `IN_PROGRESS` if attempted, (4) `NEEDS_REVISION` if flagged by revision engine, (5) `COMPLETED` if proficient, (6) `MASTERED` if mastered. | §6, §11 | FR-ROADMAP-008, FR-ROADMAP-009 |
| BR-014 | **Global Session Revocation on Credential Change:** Successful completion of a password reset or security credential modification shall immediately invalidate all active user sessions across all devices, requiring re-authentication. | §16 | FR-AUTH-010, FR-AUTH-011 |
| BR-015 | **Administrative Least Privilege & Editorial Role Governance:** Administrative privileges shall be segregated into distinct roles. System Administrators manage user accounts, security roles, system configurations, and audit logs; Content Administrators manage curriculum, lessons, problems, and roadmaps. The proposed MVP policy is unified Author/Reviewer/Publisher permissions with self-review, but this policy shall remain disabled until DEC-03 is approved; if not approved, separate author and reviewer/publisher permissions shall be enforced. Strict multi-party four-eyes approval (Author != Reviewer != Publisher) remains a configurable Phase 2/Enterprise capability. Content Administrators are strictly prohibited from accessing other users' personal data or security logs. | §12, §15, §16 | FR-CMS-001 to 019, FR-ADMIN-001 to 010 |
| BR-016 | **Zero-Downtime Content Publishing:** The content architecture shall ensure that adding new domains, categories, topics, lessons, problems, and roadmaps requires only database inserts/updates through CMS APIs, never triggering code compilation, asset bundling, or server restarts (CON-009). | §12, §21 | FR-CMS-001 to 018, EIF-CDN-001 |
| BR-017 | **Safe Account Linking and Verification Integrity:** If a third-party OAuth email matches an unverified local password account, the provider's signed identity response and `email_verified = true` claim for the exact matching email shall be validated before the account is promoted to verified. The unverified local password hash shall then be invalidated and the OAuth identity linked atomically; failure at any step shall leave the account unchanged. | §16 | FR-AUTH-003, FR-AUTH-004 |
| BR-018 | **Content Draft-while-Published Version Isolation:** Modifying a published lesson or topic in the CMS shall automatically create a detached pending draft version (vNext). The active published version (vCurrent) and CDN edge cache shall remain untouched until the pending draft explicitly passes review and is published. | §12 | FR-CMS-001 to 019, EIF-CDN-001 |
| BR-019 | **Referential Topic Deprecation over Deletion:** Any topic referenced by active roadmap nodes, prerequisite dependencies, or user bookmarks shall be restricted from physical deletion. Decommissioning shall occur strictly via setting `isArchived = true` and `status = ARCHIVED`; physical deletion shall be rejected while protected references exist, ensuring dependent graph links and learner history remain intact. | §5, §6 | FR-DOM-002, DATA-CON-011 |
| BR-020 | **Deterministic Default Spaced Revision Intervals:** For MVP, topic revision scheduling shall adhere to fixed baseline intervals: Familiar = 3 days; Proficient = 7 days; Mastered = 21 days; Failed revision assessment = 1 day. Algorithmic decay models (SM-2) are deferred to Phase 2. | §11, §20 | FR-REV-001, FR-REV-002 |
| BR-021 | **Identity Provider Unlinking Safeguard:** A learner shall never be permitted to unlink an OAuth provider (e.g., Google OAuth) if doing so would leave the account with zero authentication credentials. Unlinking requires an established and verified local password credential. | §16 | FR-AUTH-003, FR-AUTH-020 |

---

# 9. Acceptance Criteria and Verification Requirements

## 9.1 Verification Method Matrix

| Module Range | Subsystem / Capability | Verification Method | Primary Test Type | Owner | Acceptance Threshold |
| --- | --- | --- | --- | --- | --- |
| FR-PUB-001–012 | Public Website & SEO | Demonstration / Test | E2E Playwright & Lighthouse | Frontend / QA | 100% route availability, LCP ≤ 2.5s |
| FR-AUTH-001–019 | Identity & Session Mgmt | Test / Inspection | Security Unit & Integration Tests | Backend / Security | 0 unauthorized bypasses, rate limits pass |
| FR-ONB-001–008 | User Onboarding | Demonstration | Usability Walkthrough | Product / UX | Completion time < 90s, preferences saved |
| FR-DOM-001–010 | Taxonomy & Knowledge Graph | Test / Analysis | Database Integration Tests | Backend | DAG verification passes; 0 cycles permitted |
| FR-ROADMAP-001–022 | Roadmaps (Graph & List) | Demonstration / Test | E2E & Accessibility Audit | Frontend / a11y | 60 fps pan/zoom; 100% keyboard operable |
| FR-LEARN-001–019 | Learning Workspace | Demonstration | Component & Visual Regression | Frontend | 3-column reflow verified; video embeds load |
| FR-VIZ-001–012 | Visualization Engine | Test / Demonstration | State Machine Unit & E2E | Frontend | Step-through deterministic on all presets |
| FR-PROB-001–015 | Problem Library | Test | Integration & Search Tests | QA / Content | Filter combinations return correct sets |
| FR-PRACTICE-001–010 | Practice & Assessment | Test | Sandbox & Scoring Unit Tests | Backend | Quiz evaluation immediate; 0 host execution |
| FR-DASH-001–011 | Personalized Dashboard | Demonstration | Integration Tests | Frontend | Widgets hydrate correctly from UserProgress |
| FR-PROGRESS-001–008| Mastery Progression Engine | Test / Analysis | Algorithmic Unit Tests | Backend | 100% transition table test coverage |
| FR-REV-001–011 | Spaced Revision System | Test | Scheduled Job & State Tests | Backend | Due topics surfaced per rule thresholds |
| FR-NOTE-001–011 | Notes & Bookmarks | Test | API Security & Mutation Tests | Backend | 100% tenant isolation; XSS sanitized |
| FR-SEARCH-001–012 | Global Search (Cmd+K) | Test | Benchmark & Integration Tests | Backend | Sub-150ms latency; ranked FTS match |
| FR-DAILY-001–008 | Daily Publishing Engine | Demonstration / Test | Cron & Invalidation Tests | Backend / CMS | Daily challenge transitions at 00:00 UTC |
| FR-CMS-001–018 | Content Administration | Demonstration | Admin Workflow E2E | Backend / Admin | Content publishable with zero deployment |
| FR-SET-001–010 | Settings & Preferences | Test | Regression & State Tests | Frontend | Instant theme/font/motion application |
| FR-NOTIF-001–009 | Notification System | Test | Event & Delivery Tests | Backend | System alerts delivered; opt-outs respected |
| FR-ADMIN-001–010 | System Administration | Test / Inspection | RBAC & Audit Log Tests | Security / QA | Non-admins blocked (403); audit log intact |
| NFR-PERF-001–007 | Performance & Web Vitals | Test | Automated Lighthouse & k6 | DevOps / QA | LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1 |
| NFR-SEC-001–006 | Security & Vulnerabilities | Test / Inspection | OWASP ZAP & Semgrep SAST | Security | Zero high/critical vulnerabilities |
| NFR-A11Y-001–006 | Accessibility Compliance | Test / Inspection | axe-core & Screen Reader Audit | a11y Specialist | 100% WCAG 2.2 AA conformance |

---

## 9.2 High-Priority Acceptance Test Scenarios (AT-001 through AT-010)

### AT-001: End-to-End Registration to First Lesson Completion
- **Preconditions:** Fresh test environment; email service stubbed or live sandbox.
- **Steps:**
  1. Navigate to `/register` and submit email `test@example.com` with valid password.
  2. Retrieve verification link from mailbox and open link in browser.
  3. Complete onboarding selecting "Computer Science Student", "DSA", "Python", "30 mins".
  4. Land on `/dashboard`, select recommended topic "Binary Search".
  5. Step through visualization, modify target to `7`, step to completion.
  6. Answer 2 quiz questions correctly and click "Finish Lesson".
- **Expected Result:** Account marked verified, preferences stored, topic progress updated to `ATTEMPTED` / `FAMILIAR`, dashboard reflects completed minutes.
- **Pass/Fail Criteria:** All steps complete without error; database reflects valid `User`, `UserPreference`, `UserProgress`, and `MasteryAssessment` records.

### AT-002: Roadmap Canvas Keyboard Navigation and Screen Reader Operability
- **Preconditions:** User is on `/roadmaps/dsa-roadmap`.
- **Steps:**
  1. Press `Tab` to navigate into roadmap canvas.
  2. Use Arrow keys and Tab to traverse between linked nodes.
  3. Focus node "Binary Search Trees" and press `Enter`.
  4. Inspect screen reader announcement (NVDA/VoiceOver).
  5. Press `Escape` to close slide-out contextual panel.
  6. Press `Alt + L` to switch to List representation.
- **Expected Result:** Visible high-contrast focus indicator follows active node; screen reader announces node label, difficulty, and state; panel opens and closes; list view activates cleanly.
- **Pass/Fail Criteria:** Zero trapped focus states; full equivalence verified between canvas and list.

### AT-003: Visualization Engine State Manipulation and Input Validation
- **Preconditions:** User is viewing Binary Search visualization in `/lessons/binary-search`.
- **Steps:**
  1. Click "Play". Observe automated step progression at 1.0x speed.
  2. Click "Pause". Speed slider moved to 2.0x.
  3. Enter custom array `[2, 5, 8, 12, 16, 23, 38, 56, 72, 91]` and target `23`.
  4. Click "Reset", then click "Step Forward" 3 times.
  5. Attempt to enter unsorted array `[10, 2, 5]`.
- **Expected Result:** Execution steps accurately highlight pointers `left=0`, `right=9`, `mid=4`; values update in variable watch window; unsorted array input is rejected with inline warning *"Binary search requires a sorted array"*.
- **Pass/Fail Criteria:** Correct algorithmic behavior verified; invalid inputs gracefully handled.

### AT-004: Global Search Response Time and Ranking Accuracy
- **Preconditions:** Content database seeded with 500+ topics and lessons.
- **Steps:**
  1. Press `Cmd + K` on any active page.
  2. Type query `"hash table"`.
  3. Measure latency from keystroke to result render.
  4. Verify top 3 results are canonical topics/lessons in DSA and Databases.
- **Expected Result:** Search palette opens instantly (< 50ms); results populate in under 150ms; exact topic title matches rank highest.
- **Pass/Fail Criteria:** Response time ≤ 150ms; no empty-screen flickering; keyboard arrow navigation functions smoothly.

### AT-005: Zero-Downtime Content Publishing via Admin CMS
- **Preconditions:** Admin logged into `/admin/lessons/new`.
- **Steps:**
  1. Fill in complete lesson details for "Introduction to Redis Caching".
  2. Configure visualization parameters and quiz questions.
  3. Click "Publish Now".
  4. In an unauthenticated incognito browser, immediately request `/lessons/introduction-to-redis-caching`.
- **Expected Result:** New lesson is served with HTTP 200 and full content within 5 seconds of publish click.
- **Pass/Fail Criteria:** Zero deployment scripts executed; zero server process restarts; lesson immediately available.

### AT-006: Evidence-Based Mastery Transition Logic
- **Preconditions:** Authenticated learner has topic "Two Pointers" at `NOT_STARTED`.
- **Steps:**
  1. Learner opens lesson and reads all sections without answering quiz: assert status is `ATTEMPTED`.
  2. Learner answers knowledge-check quiz with 100% accuracy: assert status updates to `FAMILIAR`.
  3. Learner completes 2 practice problems on two pointers: assert status updates to `PROFICIENT`.
  4. 7 days elapse; topic flagged for spaced revision.
  5. Learner passes revision assessment: assert status updates to `MASTERED`.
- **Expected Result:** Every state transition aligns precisely with documented rules in BR-003 and FR-PROGRESS-002.
- **Pass/Fail Criteria:** Mastery never advances without requisite evidence; transitions are deterministic and audited.

### AT-007: Automated WCAG 2.2 AA Accessibility Conformance Audit
- **Preconditions:** Test suite configured with Playwright and axe-core.
- **Steps:**
  1. Run automated accessibility test across all 25 core application routes in both Dark and Light themes.
  2. Run color contrast analyzers on all defined tokens.
  3. Run keyboard-only test suite verifying no interactive control requires pointer drag.
- **Expected Result:** Zero violations of WCAG 2.2 Level AA rules reported.
- **Pass/Fail Criteria:** Axe-core reports 0 critical, 0 serious, 0 moderate violations.

### AT-008: Core Web Vitals Benchmark on Low-Tier Device Emulation
- **Preconditions:** Headless Chrome running with 4G throttling (1.6 Mbps down, 750 kbps up, 150ms RTT) and 4x CPU slowdown.
- **Steps:**
  1. Navigate to Landing Page, Explore, and Lesson Page.
  2. Record PerformanceObserver metrics for LCP, INP, and CLS over 20 repeated runs.
- **Expected Result:** Average LCP ≤ 2.2s, max INP ≤ 180ms, CLS ≤ 0.05.
- **Pass/Fail Criteria:** 75th percentile satisfies NFR-PERF-001 (LCP ≤ 2.5s), NFR-PERF-002 (INP ≤ 200ms), NFR-PERF-003 (CLS ≤ 0.1).

### AT-009: Security Audit: Rate Limiting, CSRF, and Untrusted Input Sanitization
- **Preconditions:** Security testing suite (OWASP ZAP / custom script) targeting API.
- **Steps:**
  1. Dispatch 10 rapid failed login attempts from a single IP.
  2. Dispatch cross-origin POST request with valid session cookie but without anti-CSRF token / with mismatched Origin.
  3. Submit note containing `<script>alert('xss')</script>` and `<img src=x onerror=alert(1)>`.
  4. Render saved note in browser.
- **Expected Result:** 6th login attempt receives HTTP 429; cross-origin mutation is blocked with HTTP 403; rendered note displays script as plain text without executing script.
- **Pass/Fail Criteria:** Zero unauthorized mutations, zero script executions, rate limiting enforced.

### AT-010: Complete User Data Erasure and Privacy Verification
- **Preconditions:** Test user account populated with profile, 5 notes, 3 bookmarks, progress across 4 topics, and 2 submissions.
- **Steps:**
  1. User navigates to `/settings` and confirms "Delete Account".
  2. System executes deletion transaction.
  3. Query database directly for records matching user ID in `User`, `Account`, `Session`, `Note`, `Bookmark`, `Submission`, `UserProgress`.
  4. Query `LearningActivity` table.
- **Expected Result:** All user-specific records are deleted; `LearningActivity` rows are retained but have `userId` set to null / anonymized hash.
- **Pass/Fail Criteria:** Zero lingering personal identifiable records; user cannot log in.

### AT-011: OAuth Pre-Registration Takeover Defense Verification
- **Preconditions:** An unverified account exists for `victim@example.com` registered with a password.
- **Steps:**
  1. Victim initiates Google OAuth login using verified Google Account `victim@example.com`.
  2. System detects unverified local account matching the Google email.
  3. System prompts for confirmation, verifies Google identity, marks account verified, links Google ID, and purges the previous unverified password hash (BR-017).
  4. Attacker attempts to log in using the pre-registered password.
- **Expected Result:** Attacker password login fails with invalid credentials; legitimate user has full access via Google.
- **Pass/Fail Criteria:** Previous unverified password hash is completely purged; account cannot be accessed via attacker password.

### AT-012: CMS Draft-While-Published Isolation and Atomic Re-Publishing
- **Preconditions:** Lesson `L-001` is published (`v1`) and active on public URL `/lessons/binary-search`.
- **Steps:**
  1. Content Admin opens `L-001` in CMS and modifies explanation text to draft revision (`v2`).
  2. Admin saves draft.
  3. In an incognito window, public visitor refreshes `/lessons/binary-search`.
  4. Admin clicks "Publish Revision".
  5. Visitor refreshes public lesson again.
- **Expected Result:** In step 3, visitor sees unmodified `v1` text; in step 5, visitor immediately sees updated `v2` text with purged CDN cache.
- **Pass/Fail Criteria:** Draft changes are never exposed prior to explicit publication; edge cache is atomically updated.

### AT-013: Spaced Revision Queueing and UTC Boundary Normalization
- **Preconditions:** Learner achieves `FAMILIAR` mastery on topic `T-001` at 14:30:00 UTC on 15 Nov 2026.
- **Steps:**
  1. Inspect `RevisionSchedule` table for topic `T-001`.
  2. Verify calculated `dueAt` timestamp.
  3. Fast-forward test clock to 18 Nov 2026 00:00:01 UTC.
  4. Request `/api/v1/revision/due`.
- **Expected Result:** `dueAt` is set exactly to 18 Nov 2026 00:00:00 UTC (15 Nov + 3 days normalized to UTC midnight per BR-020 and FR-REV-012); topic appears in due queue on 18 Nov.
- **Pass/Fail Criteria:** Timestamp matches exact UTC midnight; queue includes topic without duplication.

### AT-014: OAuth Unlinking Credential Safeguard
- **Preconditions:** User has account authenticated solely via Google OAuth with no local password set.
- **Steps:**
  1. User navigates to `/settings` and clicks "Unlink Google Account".
- **Expected Result:** System blocks the action, returning an informative modal: "You must establish a verified password before unlinking Google OAuth" (BR-021, FR-AUTH-020).
- **Pass/Fail Criteria:** Account is not unlinked; user is never orphaned with zero authentication credentials.

# 10. Requirement Traceability Matrix

This matrix maps every section of the source AkayTheory Product Blueprint (§1 through §25) directly to the formal SRS requirements, constraints, and architecture sections that satisfy it.

| Blueprint Section | Section Title in Blueprint | SRS Requirement IDs / Artifacts | Coverage Status | Notes & Scope Boundaries |
| --- | --- | --- | --- | --- |
| §1 | Your Role | Section 1.1, 1.2, 1.3 | Complete | Meta-instruction; defines multi-disciplinary engineering persona. |
| §2 | Product Vision | OBJ-1 to OBJ-6, FR-PUB-001, FR-DOM-001, FR-VIZ-001 | Complete | Core vision, 8 domains, visual-first interactive learning philosophy. |
| §3 | Competitor and Inspiration Research | Section 1.5, Section 11 (OI-09) | Not Applicable | Inspiration and research input; competitor features are non-normative. |
| §4 | Competitor Analysis Framework | Section 1.5, Section 12 | Not Applicable | Methodological framework; informed functional and design modules. |
| §5 | Define Platform's Information Architecture | FR-DOM-001 to FR-DOM-010, BR-012, DATA-ENT-005 to DATA-ENT-009 | Complete | All 8 major domains and subcategories modeled; cross-domain knowledge graph. |
| §6 | Design Roadmap and Knowledge Graph | FR-ROADMAP-001 to FR-ROADMAP-022, BR-002, BR-013, DATA-ENT-010 to DATA-ENT-012 | Complete | React Flow canvas, node types, node states, minimap, accessible list view. |
| §7 | Design Learning Workspace | FR-LEARN-001 to FR-LEARN-019, EIF-UI-002, EIF-UI-003, EIF-UI-004 | Complete | 3-column layout, 19 lesson sections, mobile drawers, template types. |
| §8 | Build Interactive Visualization Engine | FR-VIZ-001 to FR-VIZ-012, BR-008, EIF-UI-008, DATA-ENT-016 | Complete | Configurable state engine, DSA step controls, variable highlights, system design (P2). |
| §9 | Coding Problem and Interview Experience | FR-PROB-001 to 015, FR-PRACTICE-001 to 010, CON-007, CON-008, BR-009, BR-011 | Complete | Original problem library, progressive reveal, hints, multi-language, external sandbox MVP. |
| §10 | Personalized Learning & User Preferences | FR-ONB-001 to 008, FR-DASH-001 to 011, FR-SET-001 to 010, BR-007, DATA-ENT-031 | Complete | 6-step onboarding, goals, languages, personalized dashboard, study settings. |
| §11 | Progress and Mastery System | FR-PROGRESS-001 to 008, FR-REV-001 to 011, BR-003, BR-006, DATA-ENT-022, DATA-ENT-023 | Complete | 5-level Khan-style mastery progression, evidence-based transitions, non-punitive. |
| §12 | Daily Content Publishing Engine | FR-DAILY-001 to 008, FR-CMS-001 to 018, BR-004, BR-005, BR-016, CON-009 | Complete | Daily focal lesson, multi-channel reuse, CMS publishing workflow without redeploy. |
| §13 | Global Search and Content Discovery | FR-SEARCH-001 to FR-SEARCH-012, EIF-DB-005, NFR-PERF-006 | Complete | Cmd+K command palette, full-text search across all content, debounced results. |
| §14 | Design System and Visual Identity | EIF-UI-001 to EIF-UI-010, NFR-A11Y-001 to 006 | Complete | Minimalist developer aesthetic, dark/light theme tokens, typography, component states. |
| §15 | All Important Screens and Routes | Section 2.3, Section 3 modules, Section 7 (UC-100 to UC-1200) | Complete | Full screen inventory across Public, Auth, Onboarding, Learner, and Admin spaces. |
| §16 | Authentication, Privacy and Security | FR-AUTH-001 to 019, NFR-SEC-001 to 006, NFR-PRIV-001 to 003, CON-005, BR-010 | Complete | Email/password, Google OAuth, session cookies, rate limiting, RBAC, GDPR erasure. |
| §17 | Responsive Design and Accessibility | NFR-A11Y-001 to 006, EIF-UI-001, EIF-UI-003, EIF-UI-009, FR-ROADMAP-014 | Complete | WCAG 2.2 AA conformance, keyboard navigation, contrast, touch targets, list alternative. |
| §18 | Performance and Technical Quality | NFR-PERF-001 to 007, NFR-SCALE-001 to 003, NFR-AVAIL-001 to 002, CON-010 | Complete | Core Web Vitals (LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1), caching, code splitting. |
| §19 | User Research and Validation | Section 2.3 (Personas), Section 7 (Use Cases), NFR-USE-001 to 003 | Complete | Five learner archetypes are represented in the requirements and use cases; empirical user validation remains outstanding. |
| §20 | Innovation and Differentiation | FR-VIZ-006, FR-REV-005, FR-NOTE-001, FR-LEARN-010, FR-DOM-009 | Complete | Think-before-reveal, algorithm playground, notebook, concept dependency explorer. |
| §21 | Technical Architecture and Data Modeling | CON-001 to CON-010, Section 4, Section 5, Section 12 | Complete | Monorepo modular monolith, PostgreSQL, Prisma, Zod, React Flow, Better Auth. |
| §22 | Product Development Roadmap | Section 2.7 (MVP and Release Scope), Section 12 | Complete | 10-phase development plan mapped to MVP, Post-MVP (P2), and Future (Fut). |
| §23 | Required Research Deliverables | Section 1.1, Section 10, Section 13 | Complete | Blueprint deliverable structure operationalized within formal SRS artifact. |
| §24 | Research Methodology and Quality Rules | Section 1.6, Section 8, Section 13 | Complete | Source-grounded, testable "shall" language, verified vs. assumptions distinguished. |
| §25 | Final Strategic Direction | OBJ-1 to OBJ-6, Section 2.7 | Complete | Visual-first, interactive, personalized CS learning ecosystem codified. |

---

# 11. Assumptions, Dependencies and Open Issues

## 11.1 Assumptions

| ID | Assumption Statement | Rationale & Impact |
| --- | --- | --- |
| ASM-01 | **Web-First Platform:** The MVP platform is delivered exclusively as a responsive web application; native iOS and Android applications are deferred to future phases. | Focuses engineering resources on establishing core web visualizers and responsive roadmaps. |
| ASM-02 | **Trusted Internal Authors:** In the MVP, all educational content is authored and reviewed by a trusted internal team; public user-generated lessons or community submissions are excluded. | Eliminates complex content moderation, spam filtering, and multi-tenant publishing pipelines in MVP. |
| ASM-03 | **External Video Hosting:** Educational videos will be hosted on YouTube and embedded via iframe; AkayTheory will not operate a custom video streaming or transcoding backend. | Reduces infrastructure storage, bandwidth costs, and video CDN operational overhead to zero. |
| ASM-04 | **Original Curricular Content:** The product team will supply all initial lesson text, algorithm step configurations, and coding problems; no automatic scraping or AI generation is assumed. | Ensures pedagogical quality, editorial voice, and eliminates copyright infringement risks (CON-008). |
| ASM-05 | **Single Primary Language (English):** The interface and content will be published in English for the initial launch; multi-lingual localization (i18n) is deferred to Post-MVP. | Simplifies database schemas, content authoring workflows, and SEO indexing. |
| ASM-06 | **Universal Coordinated Time (UTC) for Scheduling:** Daily lessons and system streaks operate on UTC calendar boundaries, simplifying background scheduling jobs. | Eliminates timezone boundary discrepancies in database aggregation queries. |
| ASM-07 | **Single-User Interactive Workspace:** Learners interact with visualizations and code editors individually; real-time multi-user collaborative canvas sessions are excluded from MVP. | Avoids operational complexity of WebSockets, CRDTs, or operational transformation engines. |
| ASM-08 | **Free Core Tier for MVP:** The initial release will not include a payment gateway, subscription billing, or paywalls; all published MVP content is free upon registration. | Allows rapid validation of learning engagement and retention without PCI compliance overhead. |
| ASM-09 | **Single Administrative Tenant:** A single administrative interface serves the founding content team; multi-tenant organization or enterprise team spaces are deferred. | Keeps administrative permissions model lightweight and straightforward. |
| ASM-10 | **Deterministic Visualization Execution:** Algorithmic visualizations can be modeled as deterministic finite state machines driven by step-index arrays and pointer configurations. | Eliminates need for runtime JavaScript code evaluation during visualizer stepping. |

## 11.2 External Dependencies

| ID | Dependency | Purpose | Risk & Mitigation |
| --- | --- | --- | --- |
| DEP-01 | **Google Identity Services (OAuth 2.0)** | One-click user sign-in and account linking. | Outage prevents Google login. Mitigation: email/password fallback always available. |
| DEP-02 | **Transactional Email Service (e.g., Resend / SES)** | Sending email verifications and password resets. | Delivery delays. Mitigation: asynchronous queueing and retry workers with alerting. |
| DEP-03 | **Managed PostgreSQL Database (e.g., Supabase / Neon / AWS RDS)** | Primary relational datastore and full-text search. | Database downtime. Mitigation: automated daily backups, read replicas, connection pooling. |
| DEP-04 | **S3-Compatible Object Store (e.g., Cloudflare R2 / AWS S3)** | Storing media assets, diagrams, and static images. | Storage access latency. Mitigation: CDN caching in front of all media buckets. |
| DEP-05 | **YouTube Video Platform** | Hosting and serving embedded video lessons. | Video deletion or regional blocking. Mitigation: graceful fallback to written lesson prose. |
| DEP-06 | **Isolated Code Sandbox Provider (Post-MVP)** | Executing untrusted learner code safely. | Service latency or cost spikes. Mitigation: rate-limiting and external practice links for MVP. |
| DEP-07 | **Edge CDN (e.g., Cloudflare / Vercel Edge)** | Serving static assets and caching public API endpoints. | Stale cache. Mitigation: explicit cache-tag purge endpoints triggered on CMS publish. |
| DEP-08 | **DNS and SSL Certificate Provider** | Domain routing and TLS 1.3 certificate lifecycle. | Expiration risk. Mitigation: automated Let's Encrypt / Cloudflare managed renewal. |

## 11.3 Open Issues and Stakeholder Decision Register

The following items represent design choices, policy parameters, or numerical thresholds that require explicit Product Owner determination prior to Phase 2 / Phase 3 implementation.

| ID | Issue Title | Description & Options | Proposed Default / Recommendation | Status |
| --- | --- | --- | --- | --- |
| OI-01 | **Authentication Provider Selection** | Better Auth vs. Auth.js (NextAuth) vs. native custom JWT/session implementation. | **Better Auth:** excellent TypeScript DX, native Prisma adapter, built-in rate limiting and 2FA. | Open |
| OI-02 | **Roadmap Graph Engine** | React Flow vs. custom Canvas / SVG renderer vs. tldraw. | **React Flow:** proven node/edge ecosystem, built-in zoom/pan, custom node support, accessible DOM layer. | Open |
| OI-03 | **User Role Granularity** | Should "Problem Solver" be an explicit RBAC role or a capability profile of all learners? | **Capability Profile:** All registered learners can solve problems; no separate account type needed. | Resolved (Profile) |
| OI-04 | **MVP Curricular Domain Depth** | Launch all 8 domains simultaneously vs. Dual-Domain Anchor (DSA + System Design deep launch). | **Dual-Domain Anchor:** Deep visualizers and roadmaps for DSA + System Design; seed others. | PENDING PRODUCT OWNER APPROVAL |
| OI-05 | **Monetization Architecture Readiness** | Should database schemas include billing/subscription tables in MVP in anticipation of freemium? | **Omit from MVP schema:** Add cleanly via Prisma migration in Phase 2 to avoid dead code. | Open |
| OI-06 | **Post-MVP Sandbox Partner** | Self-hosted Judge0 on isolated EC2 vs. managed provider vs. WebAssembly client execution (Pyodide). | **Hybrid:** Client-side WebAssembly for Python/JS; Judge0 for C++/Java in Phase 2. | Open |
| OI-07 | **Curricular Taxonomy Overlaps** | OOP in Domains 01 & 05; Git in 06 & 08; Caching in 02 & 04. | **Canonical Assignment:** Assign primary to foundational domain, cross-list via `CrossDomainLink`. | Open |
| OI-08 | **Node State Derivation Thresholds** | Define the mapping from topic mastery and prerequisite state to roadmap node state. | Resolved by BR-013 and the normative mastery transition table in Section 3.11.1: `COMPLETED` follows `PROFICIENT`; `MASTERED` follows two consecutive passing revision assessments; prerequisite and needs-revision states take precedence as specified. | Resolved by v1.4 |
| OI-09 | **Take U Forward "Planly" Feature** | The source blueprint references "Planly" at TUF. Feature specifics cannot be verified from prompt. | Exclude unverified proprietary feature; implement AkayTheory personalized daily planner. | Resolved |
| OI-10 | **Difficulty Scale Definition** | Discrete 3-tier (Beginner, Intermediate, Advanced) vs. 5-star vs. LeetCode-style (Easy, Medium, Hard). | **3-Tier (Beginner, Intermediate, Advanced)** for topics; **Easy/Med/Hard** for coding problems. | Open |
| OI-11 | **Onboarding Maximum Targets** | Confirm whether the onboarding limit is six screens (which may group multiple fields) and whether 90 seconds is a target or a hard acceptance threshold. | **Proposed: maximum 6 screens, skippable, target ≤ 90 seconds.** | PENDING PRODUCT OWNER APPROVAL |
| OI-12 | **Supported Browser Matrix** | Minimum supported browser versions for desktop and mobile. | Chrome 110+, Safari 16+, Firefox 115+, Edge 110+, iOS Safari 16+, Chrome Android 110+. | Open |
| OI-13 | **Maximum Roadmap Node Count** | Upper bound on rendered nodes per roadmap graph to guarantee 60 fps. | **250 nodes per roadmap view.** Cluster or paginate larger curricula. | Open |
| OI-14 | **Social Media Automation Scope** | Automated API posting to YouTube/LinkedIn vs. manual admin content copy. | **Manual copy-export in MVP:** Provide formatted Markdown/text export; automate via API in P2. | Open |
| OI-15 | **Mobile Native App Strategy** | Progressive Web App (PWA) vs. React Native vs. Flutter. | **PWA for MVP:** Add web manifest and service worker; evaluate React Native post-launch. | Open |
| OI-16 | **API Rate Limiting Thresholds** | Specific numerical request limits per window for public, auth, and search. | Public: 60 req/min; Auth: 10 req/min; Search: 30 req/min; Learner API: 120 req/min. | Open |
| OI-17 | **Password Complexity Policy** | Minimum length and character class requirements. | Minimum 10 characters, at least 1 digit, 1 uppercase, 1 special character; zxcvbn score ≥ 3. | Open |
| OI-18 | **Token Expiration Lifetimes** | Lifetimes for email verification, password reset, and active user sessions. | Verification: 24 hours; Password Reset: 1 hour; Session Cookie: 30 days rolling. | Open |
| OI-19 | **Explanation Depth Semantics** | How does the "Explanation Depth" preference alter lesson presentation? | Concised (code + bullet points), Standard (full prose + visualizer), Deep (academic theory + proofs). | Open |
| OI-20 | **Spaced Revision Schedule Algorithm** | Fixed interval rules vs. SuperMemo SM-2 vs. Leitner box system. | **Fixed Rules in MVP** (1d, 3d, 7d, 21d); **SM-2 Algorithmic Scheduling in Phase 2**. | Open |

---

# 12. Technology Stack Evaluation

The AkayTheory Product Blueprint (§21) outlines a preferred initial technology stack based on a **modular monolith inside a monorepo**. Below is the formal architectural evaluation, assessing fit, potential risks, and recommendations.

```
AkayTheory Monorepo Architecture (pnpm / Turborepo)
├── apps/
│   ├── web/               # Next.js / Vite React frontend application
│   ├── api/               # Express modular monolith backend (if decoupled)
│   └── admin/             # Internal content administration workspace
├── packages/
│   ├── ui/                # Shared design system components & Tailwind tokens
│   ├── visualizers/       # Reusable SVG/Canvas algorithm visualizer components
│   ├── db/                # Prisma client, schema definitions, and migrations
│   ├── schemas/           # Shared Zod validation schemas and TypeScript types
│   └── config/            # Shared ESLint, Prettier, and TypeScript configs
```

## 12.1 Component Evaluation

### 1. Frontend Framework: React + TypeScript
- **System Role:** Core interactive client application, roadmap graph, and visualizer rendering.
- **Suitability:** **Excellent Fit.** Unrivaled ecosystem for interactive graph tools (React Flow), motion (Framer Motion), and Monaco code editor. TypeScript ensures type safety across shared domain entities.
- **Alternatives Considered:** Svelte (lighter bundle, but smaller graph/canvas ecosystem); Vue.js.
- **Recommendation:** **Adopt React 18+ with TypeScript.**

### 2. Build Tooling & Rendering Model: Vite vs. Next.js App Router
- **System Role:** Bundler, client runtime, and server-side rendering (SSR) for daily lessons and SEO.
- **Suitability:** **Caution on pure Vite SPA.** While Vite provides exceptional local developer experience and fast builds, a pure Client-Side Rendered (CSR) SPA delivers an empty HTML shell to search engine crawlers and social media preview scrapers (Twitter, LinkedIn, Slack OpenGraph). Because AkayTheory relies heavily on daily published content and viral social distribution (Blueprint §2, §12), server-rendered meta tags and fast First Contentful Paint are critical.
- **Alternatives Considered:** Next.js (App Router with React Server Components); Astro (Islands architecture); Remix.
- **Recommendation:** **Adopt Next.js (App Router) in a hybrid model**, OR maintain a **Vite SPA backed by Cloudflare Workers / Edge Prerendering** for public `/lessons/*` and `/roadmaps/*` routes. If modular monolith with Express is maintained, implement an Express SSR renderer for public SEO routes.

### 3. Styling & Design Tokens: Tailwind CSS
- **System Role:** Implementation of semantic design tokens, responsive breakpoints, and dark/light themes.
- **Suitability:** **Excellent Fit.** Zero runtime CSS overhead, built-in responsive prefix utilities, straightforward dark mode via CSS variables, and easily auditable design tokens (Blueprint §14).
- **Alternatives Considered:** CSS Modules; Vanilla Extract; Styled Components (runtime overhead).
- **Recommendation:** **Adopt Tailwind CSS v3/v4 with CSS custom properties for semantic tokens.**

### 4. Backend Architecture: Node.js + Express (Modular Monolith)
- **System Role:** Business logic, authentication, progress calculation, CMS APIs, and search indexing.
- **Suitability:** **Good Fit.** TypeScript end-to-end; modular domain separation (Auth, Curriculum, Progress, CMS) ensures clean boundaries without distributed systems overhead.
- **Alternatives Considered:** Fastify (higher throughput); NestJS (stricter DI structure, but higher boilerplate); Go / Rust (premature complexity for MVP).
- **Recommendation:** **Adopt Node.js with Express or Fastify**, organized into strict domain modules within the monorepo.

### 5. Primary Datastore: PostgreSQL + Prisma ORM
- **System Role:** Relational data persistence, integrity constraints, and full-text search.
- **Suitability:** **Excellent Fit.** PostgreSQL provides robust ACID transactions, foreign keys, JSONB columns for flexible visualization configs and lesson section schemas, and native `tsvector` full-text search. Prisma offers type-safe database queries and automated schema migrations.
- **Alternatives Considered:** Drizzle ORM (lighter SQL-first alternative); MongoDB (unsuitable for heavily relational knowledge graphs and prerequisite trees).
- **Recommendation:** **Adopt PostgreSQL with Prisma ORM.** Monitor complex recursive graph queries; leverage raw SQL CTEs for deep dependency traversal if needed.

### 6. Authentication Provider: Better Auth
- **System Role:** User credential management, Google OAuth, session cookies, password reset, and RBAC.
- **Suitability:** **Good Fit.** Modern, lightweight, framework-agnostic TypeScript auth library with native Prisma support, built-in session management, and two-factor authentication capabilities.
- **Alternatives Considered:** Auth.js / NextAuth; Supabase Auth; Clerk (high vendor lock-in and cost at scale).
- **Recommendation:** **Adopt Better Auth**, maintaining standard session tables in PostgreSQL.

### 7. Validation: Zod
- **System Role:** Runtime input validation, API payload checking, and shared schema contracts.
- **Suitability:** **Excellent Fit.** Single source of truth across frontend forms and backend controllers (CON-004). Integrates seamlessly with TypeScript and Prisma.
- **Recommendation:** **Adopt Zod across all monorepo packages.**

### 8. Interactive Roadmap Engine: React Flow
- **System Role:** Rendering interactive, draggable, zoomable curriculum graphs and node panels.
- **Suitability:** **Excellent Fit.** Highly customizable custom nodes and edges, built-in minimap, pan/zoom controls, and an underlying DOM tree that enables WCAG keyboard navigation and accessibility attributes.
- **Alternatives Considered:** Cytoscape.js; D3.js (steep learning curve, manual DOM management); tldraw (better suited for freehand whiteboards than structured roadmaps).
- **Recommendation:** **Adopt React Flow for roadmap graph visualization.**

### 9. Code Editor: Monaco Editor
- **System Role:** In-browser code editing with syntax highlighting, indentation, and multi-language support.
- **Suitability:** **Good Fit.** Powers VS Code; unmatched editing experience, syntax highlighting, and keyboard accessibility.
- **Caution:** Bundle size is substantial (~2-4 MB).
- **Recommendation:** **Adopt `@monaco-editor/react` with lazy dynamic import**, loaded only when the user expands code practice or problem solutions. For static code snippets, use lightweight syntax highlighters (Shiki / Prism).

---

# 13. SRS Completeness and Consistency Audit

This section records a document-level static review. It does not claim that software has been implemented, deployed, penetration-tested, load-tested, or independently certified. Runtime verification remains a delivery-stage activity.

## 13.1 Document audit status

| Audit Check | Current result | Evidence / limitation |
| --- | --- | --- |
| Functional module inventory | 19 modules identified | Inventory is based on Section 3 module headings. |
| Entity catalogue | 34 entity definitions (`DATA-ENT-001`–`034`) | Count reconciled in Section 5.1; relationships and lifecycle rules are separately specified. |
| Business rules | 21 rules (`BR-001`–`021`) | Each rule requires implementation-level tests before operational acceptance. |
| Acceptance tests | 14 scenarios (`AT-001`–`014`) | These are planned acceptance scenarios, not executed test results. |
| Cross-reference integrity | Static review required at each baseline change | A zero-dangling-reference claim is not made solely from a generated report; identifiers and semantic targets require validation. |
| Open product decisions | DEC-01, DEC-02 and DEC-03 remain pending | Requirements conditional on these decisions shall not be treated as approved scope. |
| Security and privacy | Requirements specified; runtime verification pending | Requires threat-model review, code review, security testing and operational controls. |
| Performance and availability | Targets specified; runtime verification pending | Requires representative infrastructure and measured workloads. |
| Accessibility | WCAG 2.2 AA is a requirement | Requires manual assistive-technology testing in addition to automated scans. |
| Standards alignment | Structured with reference to ISO/IEC/IEEE 29148:2018 | This is not certification or independent conformity assessment. |

## 13.2 Baseline status

**Document Status:** Version 1.4 — Corrected Audit Draft; Pending Product-Owner Decisions.

The SRS is a candidate requirements baseline. It shall not be designated an approved production baseline until:
1. The Product Owner resolves DEC-01, DEC-02 and DEC-03.
2. Remaining open issues affecting selected MVP architecture or acceptance criteria are resolved or explicitly accepted as deferred.
3. The implementation team derives and reviews the database schema, API contracts, UI specifications and test plan against this version.
4. Verification evidence is produced for applicable security, privacy, accessibility, performance, reliability and functional requirements.

