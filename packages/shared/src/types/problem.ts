export type ProblemDifficulty = 'EASY' | 'MEDIUM' | 'HARD';

export interface Problem {
  id: string;
  topicId: string;
  slug: string;
  title: string;
  difficulty: ProblemDifficulty;
  statementMarkdown: string;
  examplesJson: Array<{ input: string; output: string; explanation?: string }>;
  constraintsJson: string[];
  hintsJson: string[];
  solutionMarkdown: string | null;
  timeComplexity: string;
  spaceComplexity: string;
  externalUrl: string | null;
}

export interface ProblemTag {
  id: string;
  slug: string;
  name: string;
}

export interface Submission {
  id: string;
  userId: string;
  problemId: string;
  status: 'SELF_REPORTED_SOLVED' | 'VERIFIED_PASSED' | 'ATTEMPTED';
  solutionLanguage: string | null;
  userCode: string | null;
  notes: string | null;
  createdAt: Date;
}

