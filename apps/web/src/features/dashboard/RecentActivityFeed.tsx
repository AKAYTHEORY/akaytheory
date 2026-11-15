import React from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import {
  Activity,
  Clock,
  ArrowRight,
  BookOpen,
  Award,
  TrendingUp,
  Sparkles,
  Layers,
} from 'lucide-react';

export interface RecentProgressItem {
  id: string;
  masteryLevel: string;
  lastStudiedAt: string;
  topic: {
    id: string;
    title: string;
    slug: string;
    estimatedMinutes: number;
  };
}

export interface RecentActivityFeedProps {
  recentProgress: RecentProgressItem[];
  onSelectTopic: (slug: string) => void;
  onExploreFirstTopic?: () => void;
}

function formatRelativeTimestamp(isoString: string): string {
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24 && date.getDate() === now.getDate()) {
      return `Today, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    if (diffDays === 1 || (diffHours < 48 && date.getDate() === now.getDate() - 1)) {
      return `Yesterday, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    return date.toLocaleDateString([], {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  } catch {
    return 'Recent';
  }
}

function getMasteryBadge(level: string) {
  switch (level) {
    case 'MASTERED':
      return {
        variant: 'success' as const,
        label: 'Mastered',
        icon: Award,
        textColor: 'text-emerald-400',
      };
    case 'PROFICIENT':
      return {
        variant: 'indigo' as const,
        label: 'Proficient',
        icon: TrendingUp,
        textColor: 'text-primary',
      };
    case 'FAMILIAR':
      return {
        variant: 'neutral' as const,
        label: 'Familiar',
        icon: BookOpen,
        textColor: 'text-sky-400',
      };
    case 'NOVICE':
    case 'ATTEMPTED':
    default:
      return {
        variant: 'warning' as const,
        label: level === 'NOVICE' ? 'Novice' : 'Attempted',
        icon: Sparkles,
        textColor: 'text-amber-400',
      };
  }
}

export const RecentActivityFeed: React.FC<RecentActivityFeedProps> = ({
  recentProgress,
  onSelectTopic,
  onExploreFirstTopic,
}) => {
  const hasActivity = recentProgress && recentProgress.length > 0;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-border/70">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-primary" />
          <h3 className="text-base font-bold text-foreground tracking-tight">
            Recent Learning Activity
          </h3>
        </div>
        <span className="text-xs text-slate-500 font-mono">
          {hasActivity ? `${recentProgress.length} RECENT SESSIONS` : 'NO SESSIONS'}
        </span>
      </div>

      {!hasActivity ? (
        <Card className="p-6 md:p-8 text-center bg-surface/70 border-border/80 space-y-3">
          <Layers className="w-8 h-8 text-slate-500 mx-auto" />
          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-foreground">
              No Learning Sessions Recorded Yet
            </h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
              Begin your study path. Progress events, quiz scores, and mastery milestones will populate this live feed.
            </p>
          </div>
          {onExploreFirstTopic && (
            <div className="pt-2">
              <Button variant="primary" size="sm" onClick={onExploreFirstTopic}>
                <span>Begin Foundations Track</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </div>
          )}
        </Card>
      ) : (
        <div className="space-y-2.5">
          {recentProgress.map((item) => {
            const badgeInfo = getMasteryBadge(item.masteryLevel);
            const BadgeIcon = badgeInfo.icon;
            const targetLessonSlug = item.topic.slug.endsWith('-foundations')
              ? item.topic.slug
              : `${item.topic.slug}-foundations`;

            return (
              <div
                key={item.id}
                onClick={() => onSelectTopic(targetLessonSlug)}
                className="group p-3.5 rounded-xl bg-surface/80 hover:bg-surface-elevated border border-border/80 hover:border-primary/40 transition-all duration-200 cursor-pointer flex items-center justify-between gap-4 shadow-sm"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className={`p-2 rounded-lg bg-surface-elevated border border-border shrink-0 mt-0.5 ${badgeInfo.textColor}`}>
                    <BadgeIcon className="w-4 h-4" />
                  </div>

                  <div className="min-w-0 space-y-1">
                    <h4 className="text-xs sm:text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                      {item.topic.title}
                    </h4>

                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400 font-mono">
                      <span>{formatRelativeTimestamp(item.lastStudiedAt)}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {item.topic.estimatedMinutes || 20}m read
                      </span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-3">
                  <Badge variant={badgeInfo.variant} size="sm">
                    {badgeInfo.label}
                  </Badge>

                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-primary group-hover:translate-x-0.5 transition-all hidden sm:block" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

