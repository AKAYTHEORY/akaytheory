import { prisma } from '../../lib/prisma';
import { AppError } from '../../middleware/error.middleware';

export class CurriculumService {
  public static async getDomains() {
    return prisma.domain.findMany({
      orderBy: { orderIndex: 'asc' },
      include: {
        categories: {
          orderBy: { orderIndex: 'asc' },
          include: {
            topics: {
              where: { isArchived: false },
              orderBy: { orderIndex: 'asc' },
            },
          },
        },
      },
    });
  }

  public static async getTopicBySlug(slug: string) {
    const topic = await prisma.topic.findUnique({
      where: { slug },
      include: {
        category: { include: { domain: true } },
        dependenciesAsDep: {
          include: { prerequisiteTopic: true },
        },
        dependenciesAsPrereq: {
          include: { dependentTopic: true },
        },
        sourceCrossLinks: {
          include: { targetTopic: true },
        },
        lessons: {
          where: { status: 'PUBLISHED' },
        },
        problems: true,
      },
    });

    if (!topic || topic.isArchived) {
      throw new AppError(404, 'TOPIC_NOT_FOUND', 'Topic Not Found', `Topic with slug '${slug}' does not exist.`);
    }

    return topic;
  }

  /**
   * Draft Isolation (BR-016, AT-012):
   * Public visitors receive 404 for draft lessons unless explicitly published.
   */
  public static async getLessonBySlug(slug: string, isStaff = false) {
    const lesson = await prisma.lesson.findUnique({
      where: { slug },
      include: {
        sections: {
          orderBy: { orderIndex: 'asc' },
          include: { visualizationConfig: true },
        },
        questions: {
          orderBy: { orderIndex: 'asc' },
          include: { options: true },
        },
        topic: true,
      },
    });

    if (!lesson) {
      throw new AppError(404, 'LESSON_NOT_FOUND', 'Lesson Not Found', `Lesson '${slug}' does not exist.`);
    }

    if (lesson.status !== 'PUBLISHED' && !isStaff) {
      throw new AppError(404, 'LESSON_NOT_PUBLISHED', 'Lesson Not Available', 'This lesson has not yet been published.');
    }

    return lesson;
  }

  public static async getProblems(difficulty?: string) {
    return prisma.problem.findMany({
      where: difficulty ? { difficulty: difficulty as 'EASY' | 'MEDIUM' | 'HARD' } : {},
      orderBy: { createdAt: 'desc' },
      include: {
        topic: true,
        problemTags: { include: { tag: true } },
      },
    });
  }

  public static async getProblemBySlug(slug: string) {
    const problem = await prisma.problem.findUnique({
      where: { slug },
      include: {
        topic: true,
        problemTags: { include: { tag: true } },
      },
    });

    if (!problem) {
      throw new AppError(404, 'PROBLEM_NOT_FOUND', 'Problem Not Found', `Problem '${slug}' does not exist.`);
    }

    return problem;
  }
}

