import { prisma } from '../../lib/prisma';

export interface SearchResults {
  topics: Array<{
    id: string;
    slug: string;
    title: string;
    description: string;
    categoryTitle?: string;
  }>;
  lessons: Array<{
    id: string;
    slug: string;
    title: string;
    topicSlug?: string;
    topicTitle?: string;
  }>;
  problems: Array<{
    id: string;
    slug: string;
    title: string;
    difficulty: string;
    topicTitle?: string;
  }>;
}

export class SearchService {
  public static async searchAll(query: string): Promise<SearchResults> {
    const trimmed = query.trim();
    if (!trimmed) {
      return { topics: [], lessons: [], problems: [] };
    }

    const [topics, lessons, problems] = await Promise.all([
      prisma.topic.findMany({
        where: {
          isArchived: false,
          OR: [
            { title: { contains: trimmed, mode: 'insensitive' } },
            { description: { contains: trimmed, mode: 'insensitive' } },
          ],
        },
        take: 5,
        include: { category: true },
      }),
      prisma.lesson.findMany({
        where: {
          status: 'PUBLISHED',
          title: { contains: trimmed, mode: 'insensitive' },
        },
        take: 5,
        include: { topic: true },
      }),
      prisma.problem.findMany({
        where: {
          title: { contains: trimmed, mode: 'insensitive' },
        },
        take: 5,
        include: { topic: true },
      }),
    ]);

    return {
      topics: topics.map((t) => ({
        id: t.id,
        slug: t.slug,
        title: t.title,
        description: t.description,
        categoryTitle: t.category.title,
      })),
      lessons: lessons.map((l) => ({
        id: l.id,
        slug: l.slug,
        title: l.title,
        topicSlug: l.topic?.slug,
        topicTitle: l.topic?.title,
      })),
      problems: problems.map((p) => ({
        id: p.id,
        slug: p.slug,
        title: p.title,
        difficulty: p.difficulty,
        topicTitle: p.topic?.title,
      })),
    };
  }
}

