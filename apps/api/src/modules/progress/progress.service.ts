import { prisma } from '../../lib/prisma';
import { AppError } from '../../middleware/error.middleware';
import {
  evaluateMasteryTransition,
  calculateUtcMidnightRevisionDue,
} from '@akaytheory/shared';
import type { QuizSubmissionInput, ProblemSubmissionInput } from '@akaytheory/shared';

export class ProgressService {
  public static async submitQuiz(userId: string, input: QuizSubmissionInput) {
    const topic = await prisma.topic.findUnique({
      where: { id: input.topicId },
      include: {
        lessons: {
          include: {
            questions: {
              include: { options: true },
            },
          },
        },
      },
    });

    if (!topic) {
      throw new AppError(404, 'TOPIC_NOT_FOUND', 'Topic Not Found', 'Target topic does not exist.');
    }

    // Collect all valid questions for this topic
    const questions = topic.lessons.flatMap((l) => l.questions);
    if (questions.length === 0) {
      throw new AppError(400, 'NO_QUESTIONS', 'No Quiz Available', 'This topic does not have quiz questions configured.');
    }

    // Calculate score
    let correctCount = 0;
    for (const answer of input.answers) {
      const q = questions.find((item) => item.id === answer.questionId);
      if (q) {
        const selectedOpt = q.options.find((o) => o.id === answer.selectedOptionId);
        if (selectedOpt && selectedOpt.isCorrect) {
          correctCount++;
        }
      }
    }

    const totalQuestions = input.answers.length;
    const scorePercentage = Math.round((correctCount / totalQuestions) * 100);

    // Retrieve or initialize user progress
    const existingProgress = await prisma.userProgress.findUnique({
      where: {
        userId_topicId: {
          userId,
          topicId: input.topicId,
        },
      },
    });

    const currentMastery = existingProgress?.masteryLevel || 'NOT_STARTED';
    const currentPassCount = existingProgress?.consecutivePassCount || 0;

    // Check if user has an existing revision due
    const existingSchedule = await prisma.revisionSchedule.findUnique({
      where: {
        userId_topicId: {
          userId,
          topicId: input.topicId,
        },
      },
    });

    const isRevision = existingSchedule ? existingSchedule.dueAt <= new Date() : false;

    // Evaluate deterministic state transition (SRS §3.11.1)
    const transition = evaluateMasteryTransition({
      currentMastery,
      consecutivePassCount: currentPassCount,
      score: scorePercentage,
      isRevision,
    });

    const nextDueAt = calculateUtcMidnightRevisionDue(new Date(), transition.nextIntervalDays);

    // Transactionally update progress, append assessment log, and schedule revision
    const result = await prisma.$transaction(async (tx) => {
      const updatedProgress = await tx.userProgress.upsert({
        where: {
          userId_topicId: {
            userId,
            topicId: input.topicId,
          },
        },
        update: {
          masteryLevel: transition.nextMastery,
          consecutivePassCount: transition.nextConsecutivePassCount,
          lastStudiedAt: new Date(),
        },
        create: {
          userId,
          topicId: input.topicId,
          masteryLevel: transition.nextMastery,
          consecutivePassCount: transition.nextConsecutivePassCount,
          lastStudiedAt: new Date(),
        },
      });

      await tx.masteryAssessment.create({
        data: {
          userId,
          topicId: input.topicId,
          evidenceType: isRevision ? 'SPACED_REVISION' : 'QUIZ_SUBMISSION',
          score: scorePercentage,
          passed: scorePercentage >= (isRevision ? 80 : 75),
          metadataJson: {
            totalQuestions,
            correctCount,
            isRevision,
          },
        },
      });

      const updatedSchedule = await tx.revisionSchedule.upsert({
        where: {
          userId_topicId: {
            userId,
            topicId: input.topicId,
          },
        },
        update: {
          revisionStatus: 'UPCOMING',
          intervalDays: transition.nextIntervalDays,
          dueAt: nextDueAt,
          lastReviewedAt: new Date(),
        },
        create: {
          userId,
          topicId: input.topicId,
          revisionStatus: 'UPCOMING',
          intervalDays: transition.nextIntervalDays,
          dueAt: nextDueAt,
          lastReviewedAt: new Date(),
        },
      });

      return { updatedProgress, updatedSchedule };
    });

    return {
      score: scorePercentage,
      scorePercentage,
      passed: scorePercentage >= 75,
      correctCount,
      totalQuestions,
      previousMastery: currentMastery,
      currentMastery: result.updatedProgress.masteryLevel,
      newMastery: result.updatedProgress.masteryLevel,
      nextRevisionDueAt: result.updatedSchedule.dueAt,
      nextIntervalDays: result.updatedSchedule.intervalDays,
    };
  }

  public static async submitProblem(userId: string, input: ProblemSubmissionInput) {
    const problem = await prisma.problem.findUnique({
      where: { id: input.problemId },
    });

    if (!problem) {
      throw new AppError(404, 'PROBLEM_NOT_FOUND', 'Problem Not Found', 'Target problem does not exist.');
    }

    const submission = await prisma.submission.create({
      data: {
        userId,
        problemId: input.problemId,
        status: input.status,
        solutionLanguage: input.solutionLanguage,
        userCode: input.userCode || null,
        notes: input.notes || null,
      },
    });

    // If solved, advance progress to PROFICIENT if currently FAMILIAR
    if (input.status === 'SELF_REPORTED_SOLVED' || input.status === 'VERIFIED_PASSED') {
      const progress = await prisma.userProgress.findUnique({
        where: {
          userId_topicId: {
            userId,
            topicId: problem.topicId,
          },
        },
      });

      if (progress && progress.masteryLevel === 'FAMILIAR') {
        const nextDueAt = calculateUtcMidnightRevisionDue(new Date(), 7); // 7 days for Proficient
        await prisma.$transaction([
          prisma.userProgress.update({
            where: {
              userId_topicId: {
                userId,
                topicId: problem.topicId,
              },
            },
            data: {
              masteryLevel: 'PROFICIENT',
              lastStudiedAt: new Date(),
            },
          }),
          prisma.revisionSchedule.upsert({
            where: {
              userId_topicId: {
                userId,
                topicId: problem.topicId,
              },
            },
            update: {
              intervalDays: 7,
              dueAt: nextDueAt,
            },
            create: {
              userId,
              topicId: problem.topicId,
              intervalDays: 7,
              dueAt: nextDueAt,
            },
          }),
        ]);
      }
    }

    return submission;
  }

  public static async getDueRevisions(userId: string) {
    const now = new Date();
    return prisma.revisionSchedule.findMany({
      where: {
        userId,
        dueAt: { lte: now },
      },
      include: {
        topic: {
          include: { category: true },
        },
      },
      orderBy: { dueAt: 'asc' },
    });
  }

  public static async getProgressSummary(userId: string) {
    const progresses = await prisma.userProgress.findMany({
      where: { userId },
      include: {
        topic: {
          select: { id: true, title: true, slug: true, estimatedMinutes: true },
        },
      },
      orderBy: { lastStudiedAt: 'desc' },
    });

    const now = new Date();
    const dueRevisions = await prisma.revisionSchedule.findMany({
      where: { userId, dueAt: { lte: now } },
      include: {
        topic: {
          select: { id: true, title: true, slug: true },
        },
      },
      orderBy: { dueAt: 'asc' },
    });

    const masteryCounts = {
      MASTERED: 0,
      PROFICIENT: 0,
      FAMILIAR: 0,
      NOVICE: 0,
    };

    for (const p of progresses) {
      if (p.masteryLevel in masteryCounts) {
        masteryCounts[p.masteryLevel as keyof typeof masteryCounts]++;
      }
    }

    return {
      totalEnrolled: progresses.length,
      masteryCounts,
      dueRevisionsCount: dueRevisions.length,
      dueRevisions,
      recentProgress: progresses.slice(0, 5),
    };
  }
}
