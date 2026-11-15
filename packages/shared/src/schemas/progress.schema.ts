import { z } from 'zod';

export const quizSubmissionSchema = z.object({
  topicId: z.string().uuid(),
  answers: z.array(
    z.object({
      questionId: z.string().uuid(),
      selectedOptionId: z.string().uuid(),
    }),
  ).min(1, 'At least one answer must be submitted'),
});

export const problemSubmissionSchema = z.object({
  problemId: z.string().uuid(),
  solutionLanguage: z.string().default('typescript'),
  userCode: z.string().optional(),
  status: z.enum(['SELF_REPORTED_SOLVED', 'VERIFIED_PASSED', 'ATTEMPTED']),
  notes: z.string().max(2000).optional(),
});

export type QuizSubmissionInput = z.infer<typeof quizSubmissionSchema>;
export type ProblemSubmissionInput = z.infer<typeof problemSubmissionSchema>;

