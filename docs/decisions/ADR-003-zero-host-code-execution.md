# ADR-003: Zero Host Code Execution Architecture (CON-007)

## Status
Accepted

## Context
Running arbitrary learner-submitted code directly on the application server poses severe security risks (RCE, local network probing, resource exhaustion). The platform specification (`CON-007`) strictly prohibits running untrusted user code on the primary application host.

## Decision
1. For MVP, practice problems operate with client-side code presentation and structured self-reporting (`status: 'SELF_REPORTED_SOLVED'`).
2. All editorial solutions and starter templates run purely in-browser (or client-side syntax verification).
3. Sandboxed remote execution (e.g., gVisor, WebAssembly, or isolated microVM workers) is reserved for Phase P2 without compromising MVP launch security.

## Code Implementation
```typescript
// apps/api/src/modules/progress/progress.service.ts
const submission = await prisma.submission.create({
  data: {
    userId,
    problemId: input.problemId,
    status: input.status, // 'SELF_REPORTED_SOLVED' | 'VERIFIED_PASSED'
    solutionLanguage: input.solutionLanguage,
    userCode: input.userCode || null,
    notes: input.notes || null,
  },
});
```

## Consequences
- **Positive:** Total immunity against RCE, no privilege escalation risks on the main server.
- **Negative:** Full automated test-runner verification requires P2 sandboxing infrastructure.

