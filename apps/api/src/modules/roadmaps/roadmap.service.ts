import { prisma } from '../../lib/prisma';
import { AppError } from '../../middleware/error.middleware';

export type ComputedNodeState = 'LOCKED' | 'AVAILABLE' | 'IN_PROGRESS' | 'COMPLETED';

export class RoadmapService {
  public static async getRoadmaps() {
    return prisma.roadmap.findMany({
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        slug: true,
        title: true,
        description: true,
        domainId: true,
        isMaster: true,
        version: true,
      },
    });
  }

  public static async getRoadmapBySlug(slug: string, userId?: string) {
    const roadmap = await prisma.roadmap.findUnique({
      where: { slug },
      include: {
        nodes: {
          orderBy: { orderIndex: 'asc' },
          include: {
            topic: {
              include: {
                dependenciesAsDep: {
                  include: { prerequisiteTopic: true },
                },
              },
            },
          },
        },
        edges: true,
      },
    });

    if (!roadmap) {
      throw new AppError(404, 'ROADMAP_NOT_FOUND', 'Roadmap Not Found', `Roadmap '${slug}' does not exist.`);
    }

    // If userId provided, fetch user progress across all topic IDs in this roadmap
    const topicIds = roadmap.nodes
      .map((n) => n.topicId)
      .filter((id): id is string => Boolean(id));

    const progressMap = new Map<string, string>();
    if (userId && topicIds.length > 0) {
      const userProgressRecords = await prisma.userProgress.findMany({
        where: {
          userId,
          topicId: { in: topicIds },
        },
      });
      for (const record of userProgressRecords) {
        progressMap.set(record.topicId, record.masteryLevel);
      }
    }

    // Determine state for each node
    const computedNodes = roadmap.nodes.map((node) => {
      let state: ComputedNodeState = 'AVAILABLE';

      if (node.topicId) {
        const mastery = progressMap.get(node.topicId);
        if (mastery === 'MASTERED' || mastery === 'PROFICIENT') {
          state = 'COMPLETED';
        } else if (mastery === 'FAMILIAR' || mastery === 'NOVICE') {
          state = 'IN_PROGRESS';
        } else {
          // Check if prerequisites are satisfied
          const prereqs = node.topic?.dependenciesAsDep || [];
          const hasUncompletedPrereq = prereqs.some((dep) => {
            const prereqMastery = progressMap.get(dep.prerequisiteTopicId);
            return prereqMastery !== 'MASTERED' && prereqMastery !== 'PROFICIENT';
          });

          // Also check incoming roadmap edges
          const incomingEdges = roadmap.edges.filter((e) => e.targetNodeId === node.id);
          const hasUncompletedEdgePrereq = incomingEdges.some((edge) => {
            const sourceNode = roadmap.nodes.find((n) => n.id === edge.sourceNodeId);
            if (sourceNode?.topicId) {
              const srcMastery = progressMap.get(sourceNode.topicId);
              return srcMastery !== 'MASTERED' && srcMastery !== 'PROFICIENT';
            }
            return false;
          });

          if (hasUncompletedPrereq || hasUncompletedEdgePrereq) {
            state = 'LOCKED';
          } else {
            state = 'AVAILABLE';
          }
        }
      }

      return {
        id: node.id,
        topicId: node.topicId,
        nodeType: node.nodeType,
        title: node.title,
        positionX: node.positionX,
        positionY: node.positionY,
        orderIndex: node.orderIndex,
        state,
        topic: node.topic
          ? {
              id: node.topic.id,
              slug: node.topic.slug,
              title: node.topic.title,
              estimatedMinutes: node.topic.estimatedMinutes,
            }
          : null,
      };
    });

    return {
      id: roadmap.id,
      slug: roadmap.slug,
      title: roadmap.title,
      description: roadmap.description,
      domainId: roadmap.domainId,
      version: roadmap.version,
      nodes: computedNodes,
      edges: roadmap.edges.map((e) => ({
        id: e.id,
        source: e.sourceNodeId,
        target: e.targetNodeId,
        edgeType: e.edgeType,
      })),
    };
  }
}

