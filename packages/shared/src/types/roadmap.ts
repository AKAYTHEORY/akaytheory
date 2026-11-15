export type RoadmapNodeState =
  | 'PREREQUISITE_NOT_MET'
  | 'NOT_STARTED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'NEEDS_REVISION'
  | 'MASTERED';

export type RoadmapNodeType =
  | 'CATEGORY'
  | 'TOPIC'
  | 'SUBTOPIC'
  | 'PROBLEM'
  | 'ASSESSMENT'
  | 'MILESTONE';

export interface Roadmap {
  id: string;
  slug: string;
  title: string;
  description: string;
  domainId: string | null;
  isMaster: boolean;
  version: number;
}

export interface RoadmapNode {
  id: string;
  roadmapId: string;
  topicId: string | null;
  nodeType: RoadmapNodeType;
  title: string;
  positionX: number;
  positionY: number;
  orderIndex: number;
  nodeState?: RoadmapNodeState;
}

export interface RoadmapEdge {
  id: string;
  roadmapId: string;
  sourceNodeId: string;
  targetNodeId: string;
  edgeType: 'REQUIRED' | 'OPTIONAL' | 'CROSS_LINK';
}

