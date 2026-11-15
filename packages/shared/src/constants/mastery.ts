import type { MasteryLevel, RoadmapNodeState } from '../types';

export const MASTERY_THRESHOLDS = {
  QUIZ_PASS_PERCENTAGE: 75,
  REVISION_PASS_PERCENTAGE: 80,
  CONSECUTIVE_REVISION_PASSES_REQUIRED: 2,
} as const;

export const REVISION_INTERVALS_DAYS = {
  INITIAL_FAILED: 1,
  FAMILIAR: 3,
  PROFICIENT: 7,
  MASTERED: 21,
} as const;

/**
 * Normalizes a target date by adding intervalDays and resetting time to 00:00:00 UTC (BR-020).
 */
export function calculateUtcMidnightRevisionDue(baseDate: Date, intervalDays: number): Date {
  const result = new Date(baseDate.getTime());
  result.setUTCDate(result.getUTCDate() + intervalDays);
  result.setUTCHours(0, 0, 0, 0);
  return result;
}

/**
 * Evaluates the deterministic state transition for mastery (SRS §3.11.1)
 */
export function evaluateMasteryTransition(params: {
  currentMastery: MasteryLevel;
  consecutivePassCount: number;
  score: number;
  isRevision: boolean;
}): {
  nextMastery: MasteryLevel;
  nextConsecutivePassCount: number;
  nextRoadmapState: RoadmapNodeState;
  nextIntervalDays: number;
} {
  const { currentMastery, consecutivePassCount, score, isRevision } = params;

  if (!isRevision) {
    // Initial / quiz evaluation
    if (score >= MASTERY_THRESHOLDS.QUIZ_PASS_PERCENTAGE) {
      if (currentMastery === 'NOT_STARTED' || currentMastery === 'ATTEMPTED') {
        return {
          nextMastery: 'FAMILIAR',
          nextConsecutivePassCount: 0,
          nextRoadmapState: 'IN_PROGRESS',
          nextIntervalDays: REVISION_INTERVALS_DAYS.FAMILIAR,
        };
      }
    }
    return {
      nextMastery: currentMastery === 'NOT_STARTED' ? 'ATTEMPTED' : currentMastery,
      nextConsecutivePassCount: consecutivePassCount,
      nextRoadmapState: 'IN_PROGRESS',
      nextIntervalDays: REVISION_INTERVALS_DAYS.INITIAL_FAILED,
    };
  }

  // Spaced revision evaluation
  const passed = score >= MASTERY_THRESHOLDS.REVISION_PASS_PERCENTAGE;

  if (passed) {
    const updatedPassCount = consecutivePassCount + 1;
    if (currentMastery === 'PROFICIENT' && updatedPassCount >= MASTERY_THRESHOLDS.CONSECUTIVE_REVISION_PASSES_REQUIRED) {
      return {
        nextMastery: 'MASTERED',
        nextConsecutivePassCount: updatedPassCount,
        nextRoadmapState: 'MASTERED',
        nextIntervalDays: REVISION_INTERVALS_DAYS.MASTERED,
      };
    }
    if (currentMastery === 'MASTERED') {
      return {
        nextMastery: 'MASTERED',
        nextConsecutivePassCount: updatedPassCount,
        nextRoadmapState: 'MASTERED',
        nextIntervalDays: REVISION_INTERVALS_DAYS.MASTERED,
      };
    }
    return {
      nextMastery: currentMastery,
      nextConsecutivePassCount: updatedPassCount,
      nextRoadmapState: 'COMPLETED',
      nextIntervalDays: currentMastery === 'FAMILIAR' ? REVISION_INTERVALS_DAYS.PROFICIENT : REVISION_INTERVALS_DAYS.MASTERED,
    };
  }

  // Revision failed: reset pass count and downgrade if mastered
  const nextMastery: MasteryLevel = currentMastery === 'MASTERED' ? 'PROFICIENT' : currentMastery;
  return {
    nextMastery,
    nextConsecutivePassCount: 0,
    nextRoadmapState: 'NEEDS_REVISION',
    nextIntervalDays: REVISION_INTERVALS_DAYS.INITIAL_FAILED,
  };
}
