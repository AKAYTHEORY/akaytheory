# ADR-001: Modular Monolith Backend Architecture

## Status
Accepted

## Context
AkayTheory requires clean separation of concerns across multiple domain areas (Authentication, Curriculum, Roadmaps, Progress, Mastery, Search, CMS) while avoiding premature distributed systems overhead (network latency, distributed transactions, orchestration complexity).

## Decision
Adopt a TypeScript Modular Monolith architecture in `apps/api/`:
- Co-locate domain logic in distinct feature directories under `src/modules/` (`auth`, `curriculum`, `roadmaps`, `progress`, `search`).
- Enforce clear internal layers within each module:
  - `*.routes.ts`: Express router definitions and route-level middleware.
  - `*.controller.ts`: HTTP request decoding, schema parsing, and response envelope formatting.
  - `*.service.ts`: Pure business logic and domain transaction orchestration.
- Route errors to a centralized RFC 7807 error handler middleware.
- Connect to PostgreSQL through Prisma ORM using transaction-safe methods (`prisma.$transaction`).

## Code Implementation
```typescript
// Example: Controller-Service Separation in apps/api/src/modules/curriculum/
export class CurriculumService {
  public static async getTopicBySlug(slug: string) {
    const topic = await prisma.topic.findUnique({
      where: { slug },
      include: {
        category: { include: { domain: true } },
        dependenciesAsDep: { include: { prerequisiteTopic: true } },
        lessons: { where: { status: 'PUBLISHED' } },
        problems: true,
      },
    });

    if (!topic || topic.isArchived) {
      throw new AppError(404, 'TOPIC_NOT_FOUND', 'Topic Not Found', `Topic '${slug}' not found`);
    }

    return topic;
  }
}
```

## Consequences
- **Positive:** Single deployment unit, zero cross-service RPC overhead, simple transactional integrity.
- **Negative:** Shared database process; mitigated by strict foreign key constraints and schema modularity.

