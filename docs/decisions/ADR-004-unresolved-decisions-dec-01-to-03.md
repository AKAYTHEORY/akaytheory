# ADR-004: Unresolved Product Owner Scope Decisions (DEC-01 to DEC-03)

## Status
Pending Product Owner Formal Sign-Off

## Context
Three critical policy points were identified during requirements stabilization:
- **DEC-01:** MVP Curricular Scope (Dual-Domain Anchor vs. Full Catalogue).
- **DEC-02:** Onboarding Screen Budget ($\le 6$ screens, $\le 90$s target, skippable).
- **DEC-03:** CMS Editorial Self-Review Workflow for Solo Founding Authors.

## Policy Recommendations & Code Safeguards

### 1. DEC-01 (Dual-Domain Anchor Scope)
- **Recommendation:** Approve Dual-Domain Anchor (`Data Structures & Algorithms` and `System Design Foundations`) for MVP.
- **Code Safeguard:** Seed script establishes both domains cleanly without hardcoding assumptions:
```typescript
// prisma/seed.ts
const dsaDomain = await prisma.domain.upsert({
  where: { slug: 'data-structures-and-algorithms' },
  update: {},
  create: {
    slug: 'data-structures-and-algorithms',
    title: 'Data Structures & Algorithms',
    description: 'Computational efficiency and problem solving',
    orderIndex: 1,
  },
});
```

### 2. DEC-02 (Onboarding Screen Budget)
- **Recommendation:** Implement skippable modal onboarding that directs straight to learning paths upon registration.
- **Code Safeguard:** Auth registration returns session immediately; onboarding flags stored in user profile.

### 3. DEC-03 (CMS Self-Review Permissions)
- **Recommendation:** Allow `SYSTEM_ADMIN` role to approve content in MVP staging environments, while keeping draft isolation active (`BR-016`).
- **Code Safeguard:** Draft content returns 404 for visitors unless role contains `SYSTEM_ADMIN` or `CONTENT_REVIEWER`:
```typescript
// apps/api/src/modules/curriculum/curriculum.service.ts
if (lesson.status !== 'PUBLISHED' && !isStaff) {
  throw new AppError(404, 'LESSON_NOT_PUBLISHED', 'Lesson Not Available', 'This lesson is unpublished.');
}
```

