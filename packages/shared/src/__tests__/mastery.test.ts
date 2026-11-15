import { describe, it, expect } from 'vitest';
import {
  calculateUtcMidnightRevisionDue,
  evaluateMasteryTransition,
  REVISION_INTERVALS_DAYS,
} from '../constants/mastery';
import { registerSchema } from '../schemas/auth.schema';
import { onboardingSchema } from '../schemas/onboarding.schema';

describe('Deterministic Mastery State Machine (SRS §3.11.1)', () => {
  it('TC-MAS-01: Low quiz score (< 75%) stays ATTEMPTED', () => {
    const result = evaluateMasteryTransition({
      currentMastery: 'NOT_STARTED',
      consecutivePassCount: 0,
      score: 50,
      isRevision: false,
    });

    expect(result.nextMastery).toBe('ATTEMPTED');
    expect(result.nextRoadmapState).toBe('IN_PROGRESS');
  });

  it('TC-MAS-02: Passing quiz score (>= 75%) advances to FAMILIAR and sets 3-day revision', () => {
    const result = evaluateMasteryTransition({
      currentMastery: 'ATTEMPTED',
      consecutivePassCount: 0,
      score: 80,
      isRevision: false,
    });

    expect(result.nextMastery).toBe('FAMILIAR');
    expect(result.nextRoadmapState).toBe('IN_PROGRESS');
    expect(result.nextIntervalDays).toBe(REVISION_INTERVALS_DAYS.FAMILIAR);
  });

  it('TC-MAS-03: Two consecutive revision passes advances PROFICIENT to MASTERED (21 days)', () => {
    // 1st revision pass
    const firstPass = evaluateMasteryTransition({
      currentMastery: 'PROFICIENT',
      consecutivePassCount: 0,
      score: 85,
      isRevision: true,
    });
    expect(firstPass.nextMastery).toBe('PROFICIENT');
    expect(firstPass.nextConsecutivePassCount).toBe(1);

    // 2nd revision pass
    const secondPass = evaluateMasteryTransition({
      currentMastery: 'PROFICIENT',
      consecutivePassCount: 1,
      score: 90,
      isRevision: true,
    });
    expect(secondPass.nextMastery).toBe('MASTERED');
    expect(secondPass.nextRoadmapState).toBe('MASTERED');
    expect(secondPass.nextIntervalDays).toBe(REVISION_INTERVALS_DAYS.MASTERED);
  });

  it('Failed revision on MASTERED resets count and downgrades to PROFICIENT (1-day review)', () => {
    const failed = evaluateMasteryTransition({
      currentMastery: 'MASTERED',
      consecutivePassCount: 3,
      score: 60,
      isRevision: true,
    });

    expect(failed.nextMastery).toBe('PROFICIENT');
    expect(failed.nextConsecutivePassCount).toBe(0);
    expect(failed.nextRoadmapState).toBe('NEEDS_REVISION');
    expect(failed.nextIntervalDays).toBe(REVISION_INTERVALS_DAYS.INITIAL_FAILED);
  });
});

describe('UTC Midnight Revision Scheduling (BR-020, AT-013)', () => {
  it('normalizes calculated due date to 00:00:00 UTC exactly', () => {
    const testDate = new Date('2026-11-15T14:32:45.123Z');
    const dueAt = calculateUtcMidnightRevisionDue(testDate, 3);

    expect(dueAt.toISOString()).toBe('2026-11-18T00:00:00.000Z');
    expect(dueAt.getUTCHours()).toBe(0);
    expect(dueAt.getUTCMinutes()).toBe(0);
    expect(dueAt.getUTCSeconds()).toBe(0);
    expect(dueAt.getUTCMilliseconds()).toBe(0);
  });
});

describe('Zod Schema Validation Constraints', () => {
  it('enforces password complexity in registration', () => {
    // Too short
    expect(() =>
      registerSchema.parse({
        email: 'test@example.com',
        password: 'Short1!',
        username: 'validuser',
        displayName: 'Test User',
      }),
    ).toThrow();

    // Valid password
    const valid = registerSchema.parse({
      email: 'test@example.com',
      password: 'ValidPassword123!',
      username: 'validuser',
      displayName: 'Test User',
    });
    expect(valid.email).toBe('test@example.com');
  });

  it('validates onboarding input constraints', () => {
    const onboarding = onboardingSchema.parse({
      experienceLevel: 'INTERMEDIATE',
      primaryGoal: 'INTERVIEW_PREP',
      targetRole: 'Senior Software Engineer',
      primaryDomainInterest: 'data-structures-and-algorithms',
      dailyTimeCommitmentMinutes: 45,
      preferredLanguages: ['TypeScript', 'Python'],
    });

    expect(onboarding.dailyTimeCommitmentMinutes).toBe(45);
  });
});
