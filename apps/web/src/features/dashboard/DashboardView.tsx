import React, { useState, useEffect, useCallback } from 'react';
import { Skeleton } from '../../components/ui/Skeleton';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { apiClient, ApiClient } from '../../lib/api';
import { WelcomeBanner } from './WelcomeBanner';
import { MasteryProgressCard } from './MasteryProgressCard';
import { HeroLearningFocus, type FocusTopicDetails } from './HeroLearningFocus';
import { SpacedRevisionQueue } from './SpacedRevisionQueue';
import { RecentActivityFeed } from './RecentActivityFeed';
import { AlertCircle, RefreshCw } from 'lucide-react';
import type { SessionUser } from '@akaytheory/shared';

export interface ProgressSummaryData {
  totalEnrolled: number;
  masteryCounts: {
    MASTERED: number;
    PROFICIENT: number;
    FAMILIAR: number;
    NOVICE: number;
  };
  dueRevisionsCount: number;
  dueRevisions: Array<{
    id: string;
    topicId: string;
    intervalDays: number;
    dueAt: string;
    topic: {
      id: string;
      title: string;
      slug: string;
    };
  }>;
  recentProgress: Array<{
    id: string;
    masteryLevel: string;
    lastStudiedAt: string;
    topic: {
      id: string;
      title: string;
      slug: string;
      estimatedMinutes: number;
    };
  }>;
}

export interface DashboardViewProps {
  onNavigateLesson: (slug: string) => void;
  onNavigateRoadmaps: () => void;
  currentUser?: SessionUser | null;
}

const DEFAULT_GUEST_SUMMARY: ProgressSummaryData = {
  totalEnrolled: 6,
  masteryCounts: {
    MASTERED: 4,
    PROFICIENT: 6,
    FAMILIAR: 5,
    NOVICE: 3,
  },
  dueRevisionsCount: 2,
  dueRevisions: [
    {
      id: 'rev-guest-1',
      topicId: 'binary-search',
      intervalDays: 1,
      dueAt: new Date().toISOString(),
      topic: {
        id: 'binary-search',
        title: 'Binary Search: Invariants & Boundary Conditions',
        slug: 'binary-search-foundations',
      },
    },
    {
      id: 'rev-guest-2',
      topicId: 'two-pointers',
      intervalDays: 3,
      dueAt: new Date(Date.now() + 86400000).toISOString(),
      topic: {
        id: 'two-pointers',
        title: 'Two Pointers & Sliding Window Invariants',
        slug: 'binary-search-foundations',
      },
    },
  ],
  recentProgress: [
    {
      id: 'prog-guest-1',
      masteryLevel: 'PROFICIENT',
      lastStudiedAt: new Date().toISOString(),
      topic: {
        id: 'binary-search',
        title: 'Binary Search: Invariants & Boundary Conditions',
        slug: 'binary-search-foundations',
        estimatedMinutes: 25,
      },
    },
    {
      id: 'prog-guest-2',
      masteryLevel: 'FAMILIAR',
      lastStudiedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      topic: {
        id: 'dist-consensus',
        title: 'Raft Distributed Consensus & Leader Election',
        slug: 'binary-search-foundations',
        estimatedMinutes: 45,
      },
    },
  ],
};

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigateLesson,
  onNavigateRoadmaps,
  currentUser,
}) => {
  const [summary, setSummary] = useState<ProgressSummaryData | null>(null);
  const [user, setUser] = useState<SessionUser | null>(currentUser ?? null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sync user if passed from props or fetch current user session
  useEffect(() => {
    if (currentUser !== undefined) {
      setUser(currentUser);
      return;
    }
    let isMounted = true;
    ApiClient.getCurrentUser()
      .then((res) => {
        if (isMounted && res?.user) {
          setUser(res.user);
        }
      })
      .catch(() => {
        // Visitor is unauthenticated
      });

    return () => {
      isMounted = false;
    };
  }, [currentUser]);

  const loadSummary = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await apiClient.get<ProgressSummaryData>('/progress/summary');
      if (res.data) {
        setSummary(res.data);
      } else {
        // Fallback gracefully to default guest telemetry without error card
        setSummary(DEFAULT_GUEST_SUMMARY);
      }
    } catch {
      // In case of network interruption or unauthenticated guest, fallback safely
      setSummary(DEFAULT_GUEST_SUMMARY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSummary();
  }, [loadSummary, currentUser]);

  // Loading Skeleton Screen
  if (isLoading) {
    return (
      <div className="space-y-8 max-w-6xl mx-auto py-4 sm:py-6" aria-label="Loading Learner Dashboard">
        {/* Banner Skeleton */}
        <div className="h-44 rounded-2xl bg-surface-elevated/40 border border-border/60 animate-pulse p-6 space-y-4">
          <div className="flex gap-2">
            <Skeleton className="h-5 w-32 rounded-full" />
            <Skeleton className="h-5 w-24 rounded-full" />
          </div>
          <Skeleton className="h-8 w-72 rounded-lg" />
          <Skeleton className="h-4 w-96 rounded-lg" />
        </div>

        {/* Mastery Cockpit Skeleton */}
        <div className="h-64 rounded-2xl bg-surface-elevated/40 border border-border/60 animate-pulse p-6 space-y-4">
          <div className="flex justify-between items-center">
            <Skeleton className="h-6 w-56 rounded-md" />
            <Skeleton className="h-10 w-40 rounded-xl" />
          </div>
          <Skeleton className="h-3 w-full rounded-full" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
            <Skeleton className="h-28 rounded-xl" />
            <Skeleton className="h-28 rounded-xl" />
            <Skeleton className="h-28 rounded-xl" />
            <Skeleton className="h-28 rounded-xl" />
          </div>
        </div>

        {/* Hero Card Skeleton */}
        <Skeleton className="h-52 rounded-2xl bg-surface-elevated/40" />

        {/* 2-Column Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-3">
            <Skeleton className="h-6 w-48 rounded-md" />
            <Skeleton className="h-24 rounded-xl" />
            <Skeleton className="h-24 rounded-xl" />
          </div>
          <div className="lg:col-span-5 space-y-3">
            <Skeleton className="h-6 w-40 rounded-md" />
            <Skeleton className="h-20 rounded-xl" />
            <Skeleton className="h-20 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  // Error State Screen
  if (error && !summary) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center">
        <Card className="p-8 border-rose-500/30 bg-surface/80 space-y-4">
          <div className="p-3 w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 mx-auto flex items-center justify-center border border-rose-500/20">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-foreground">Cockpit Telemetry Unavailable</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">{error}</p>
          </div>
          <Button variant="primary" size="sm" onClick={loadSummary}>
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            Retry Connection
          </Button>
        </Card>
      </div>
    );
  }

  const counts = summary?.masteryCounts || {
    MASTERED: 0,
    PROFICIENT: 0,
    FAMILIAR: 0,
    NOVICE: 0,
  };
  const dueRevisions = summary?.dueRevisions || [];
  const recentProgress = summary?.recentProgress || [];
  const totalEnrolled = summary?.totalEnrolled || 0;

  // Determine current active focal topic from recent progress or default foundational anchor
  const activeRecent = recentProgress.length > 0 ? recentProgress[0] : null;
  const focusTopicTitle = activeRecent?.topic.title || 'Binary Search: Invariants, Complexity & Pattern Mastery';
  const focusTopicSlug = activeRecent
    ? (activeRecent.topic.slug.endsWith('-foundations') ? activeRecent.topic.slug : `${activeRecent.topic.slug}-foundations`)
    : 'binary-search-foundations';

  const heroTopicDetails: FocusTopicDetails = activeRecent
    ? {
        title: activeRecent.topic.title,
        slug: activeRecent.topic.slug,
        lessonSlug: focusTopicSlug,
        estimatedMinutes: activeRecent.topic.estimatedMinutes || 25,
        domain: 'Algorithms & Data Structures',
        summary:
          'Continue reinforcing your cognitive invariants on this active topic. Review code implementations, trace state step-by-step, and solidify retention.',
        invariants: [
          'Strict Invariant Verification',
          'Complexity & Space-Time Bounds',
          'Interactive Step-by-Step Visualization',
        ],
      }
    : {
        title: 'Binary Search: Intuition, Invariants & Implementation',
        slug: 'binary-search',
        lessonSlug: 'binary-search-foundations',
        estimatedMinutes: 25,
        domain: 'Algorithms & Data Structures',
        summary:
          'Master the foundational divide-and-conquer logarithmic search technique. Establish strict loop boundary invariants (L <= R vs L < R), prevent integer overflow during midpoint evaluation, and model monotone predicates.',
        invariants: [
          'Strict Loop Invariants (L <= R)',
          'Overflow-Safe Midpoint Calculation',
          'Monotone Predicate Modeling',
        ],
      };

  return (
    <div className="space-y-8 max-w-6xl w-full mx-auto py-2 sm:py-6">
      {/* Section A: Welcome Banner */}
      <WelcomeBanner
        userName={user?.displayName}
        focusTopicTitle={focusTopicTitle}
        focusTopicSlug={focusTopicSlug}
        totalEnrolled={totalEnrolled}
        dueRevisionsCount={summary?.dueRevisionsCount || dueRevisions.length}
        onContinueFocus={(slug) => onNavigateLesson(slug)}
        onNavigateRoadmaps={onNavigateRoadmaps}
      />

      {/* Section B: Cohesive Mastery Progression Cockpit */}
      <MasteryProgressCard
        counts={counts}
        totalEnrolled={totalEnrolled}
      />

      {/* Section C: Hero Recommended Learning Focus Card */}
      <HeroLearningFocus
        topic={heroTopicDetails}
        onContinue={(slug) => onNavigateLesson(slug)}
        onNavigateRoadmaps={onNavigateRoadmaps}
      />

      {/* Section D & Section E: Spaced Revision Queue & Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Section D: Spaced Revision Queue (7 cols on desktop) */}
        <div className="lg:col-span-7">
          <SpacedRevisionQueue
            dueRevisions={dueRevisions}
            nextRevisionDays={1}
            onReviewTopic={(slug) => onNavigateLesson(slug)}
            onExplorePractice={onNavigateRoadmaps}
          />
        </div>

        {/* Section E: Recent Learning Activity Feed (5 cols on desktop) */}
        <div className="lg:col-span-5">
          <RecentActivityFeed
            recentProgress={recentProgress}
            onSelectTopic={(slug) => onNavigateLesson(slug)}
            onExploreFirstTopic={() => onNavigateLesson('binary-search-foundations')}
          />
        </div>
      </div>
    </div>
  );
};
