export type ContentStatus = 'DRAFT' | 'IN_REVIEW' | 'PUBLISHED' | 'SCHEDULED' | 'ARCHIVED';

export type LessonSectionType =
  | 'OVERVIEW'
  | 'MOTIVATION'
  | 'CORE_CONCEPT'
  | 'INTERACTIVE_VISUALIZATION'
  | 'CODE_EXAMPLE'
  | 'STEP_BY_STEP_WALKTHROUGH'
  | 'COMPLEXITY_ANALYSIS'
  | 'EDGE_CASES'
  | 'COMMON_MISTAKES'
  | 'INTERVIEW_TIPS'
  | 'THINK_BEFORE_REVEAL'
  | 'SUMMARY_CHEATSHEET';

export interface Lesson {
  id: string;
  topicId: string;
  title: string;
  slug: string;
  version: number;
  status: ContentStatus;
  publishedAt: Date | null;
  sections?: LessonSection[];
}

export interface LessonSection {
  id: string;
  lessonId: string;
  sectionType: LessonSectionType;
  title: string;
  contentMarkdown: string;
  orderIndex: number;
  visualizationConfigId: string | null;
}

export interface VisualizationConfig {
  id: string;
  visualizerType: string; // e.g., "BINARY_SEARCH", "TWO_POINTERS"
  initialData: Record<string, unknown>;
  stepRules: Record<string, unknown>;
  themeConfig: Record<string, unknown> | null;
}

