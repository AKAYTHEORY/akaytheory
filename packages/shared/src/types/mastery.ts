export type MasteryLevel =
  | 'NOT_STARTED'
  | 'ATTEMPTED'
  | 'FAMILIAR'
  | 'PROFICIENT'
  | 'MASTERED';

export type EvidenceType =
  | 'LESSON_READ'
  | 'QUIZ_SUBMISSION'
  | 'PROBLEM_SOLVED'
  | 'SPACED_REVISION';

export interface UserProgress {
  id: string;
  userId: string;
  topicId: string;
  masteryLevel: MasteryLevel;
  consecutivePassCount: number;
  lastStudiedAt: Date;
  updatedAt: Date;
}

export interface MasteryAssessment {
  id: string;
  userId: string;
  topicId: string;
  evidenceType: EvidenceType;
  score: number; // 0 to 100 percentage
  passed: boolean;
  metadataJson: Record<string, unknown> | null;
  createdAt: Date;
}

