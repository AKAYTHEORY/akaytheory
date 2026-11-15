export type RevisionStatus = 'UPCOMING' | 'DUE' | 'OVERDUE';

export interface RevisionSchedule {
  id: string;
  userId: string;
  topicId: string;
  revisionStatus: RevisionStatus;
  intervalDays: number;
  dueAt: Date;
  lastReviewedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

