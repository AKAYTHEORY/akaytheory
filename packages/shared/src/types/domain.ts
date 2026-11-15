export type TopicStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface Domain {
  id: string;
  slug: string;
  title: string;
  description: string;
  orderIndex: number;
  iconName: string | null;
  categories?: Category[];
}

export interface Category {
  id: string;
  domainId: string;
  slug: string;
  title: string;
  description: string;
  orderIndex: number;
  topics?: Topic[];
}

export interface Topic {
  id: string;
  categoryId: string;
  slug: string;
  title: string;
  description: string;
  status: TopicStatus;
  isArchived: boolean;
  orderIndex: number;
  estimatedMinutes: number;
}

export interface TopicDependency {
  id: string;
  prerequisiteTopicId: string;
  dependentTopicId: string;
  relationshipType: 'DIRECT_PREREQUISITE' | 'RECOMMENDED_PREREQUISITE' | 'EXPANSION';
}

export interface CrossDomainLink {
  id: string;
  sourceTopicId: string;
  targetTopicId: string;
  relationshipType: 'ANALOGY' | 'FOUNDATION' | 'SYSTEM_APPLICATION' | 'IMPLEMENTATION_DETAIL';
  description: string | null;
}

