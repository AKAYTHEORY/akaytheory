# ADR-002: Deterministic Mastery State Machine and Spaced Revision Scheduling

## Status
Accepted

## Context
AkayTheory requires an auditable, deterministic mastery framework across 5 states (`NOT_STARTED`, `NOVICE`, `FAMILIAR`, `PROFICIENT`, `MASTERED`) rather than an opaque or non-reproducible algorithm. Furthermore, spaced repetition reviews must avoid calendar jitter by normalizing review due dates to UTC midnight (`00:00:00Z`).

## Decision
1. Codify a deterministic Finite State Automaton (DFA) in `@akaytheory/shared`:
   - Transitions require verified evidence (`EVD_QUIZ_PASS`, `EVD_PROBLEM_SOLVED`, `EVD_REVISION_PASS`).
   - Elevating to `FAMILIAR` requires quiz score $\ge 80\%$.
   - Elevating to `PROFICIENT` requires solving an associated practice problem.
   - Elevating to `MASTERED` requires $\ge 3$ consecutive successful spaced reviews.
2. Normalize all review intervals to UTC Midnight:
   - Novice: 1 day
   - Familiar: 3 days
   - Proficient: 7 days
   - Intermediate: 14 days
   - Mastered: 30 days

## Code Implementation
```typescript
// packages/shared/src/constants/mastery.ts
export function calculateUtcMidnightRevisionDue(fromDate: Date, intervalDays: number): Date {
  const target = new Date(fromDate);
  target.setUTCDate(target.getUTCDate() + intervalDays);
  target.setUTCHours(0, 0, 0, 0);
  return target;
}
```

## Consequences
- **Positive:** 100% testable, mathematically provable progression, zero reliance on external cron workers or client local timezone discrepancies.
- **Negative:** Advanced machine-learning spaced repetition algorithms (e.g. FSRS/SM-2) deferred to P2 post-MVP.

