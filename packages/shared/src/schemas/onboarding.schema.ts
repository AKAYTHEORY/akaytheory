import { z } from 'zod';

export const onboardingSchema = z.object({
  experienceLevel: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']),
  primaryGoal: z.enum(['INTERVIEW_PREP', 'FOUNDATIONS', 'SYSTEM_ARCHITECTURE', 'UPSKILLING']),
  targetRole: z.string().trim().max(100).optional(),
  primaryDomainInterest: z.string().trim().min(1, 'Domain interest required'),
  dailyTimeCommitmentMinutes: z.number().int().min(5).max(480),
  preferredLanguages: z.array(z.string()).default(['TypeScript']),
});

export type OnboardingInput = z.infer<typeof onboardingSchema>;

