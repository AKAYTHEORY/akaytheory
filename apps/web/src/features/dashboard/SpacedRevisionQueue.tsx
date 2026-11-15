import React from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import {
  Repeat,
  CheckCircle2,
  Clock,
  ArrowRight,
  Zap,
} from 'lucide-react';

export interface DueRevisionItem {
  id: string;
  topicId: string;
  intervalDays: number;
  dueAt: string;
  topic: {
    id: string;
    title: string;
    slug: string;
  };
}

export interface SpacedRevisionQueueProps {
  dueRevisions: DueRevisionItem[];
  nextRevisionDays?: number;
  onReviewTopic: (slug: string) => void;
  onExplorePractice?: () => void;
}

export const SpacedRevisionQueue: React.FC<SpacedRevisionQueueProps> = ({
  dueRevisions,
  nextRevisionDays = 1,
  onReviewTopic,
  onExplorePractice,
}) => {
  const hasDueRevisions = dueRevisions.length > 0;

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between pb-2 border-b border-border/70">
        <div className="flex items-center gap-2">
          <Repeat className="w-4 h-4 text-primary" />
          <h3 className="text-base font-bold text-foreground tracking-tight">
            Spaced Revision Queue
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {hasDueRevisions ? (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
              {dueRevisions.length} DUE TODAY
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              ALL CAUGHT UP
            </span>
          )}
        </div>
      </div>

      {/* Due list or Polished Empty State */}
      {!hasDueRevisions ? (
        <Card className="relative overflow-hidden p-6 md:p-8 bg-surface/70 border-border/80 text-center space-y-4 shadow-lg">
          {/* Subtle gradient accent */}
          <div className="pointer-events-none absolute inset-x-0 -top-24 h-48 bg-emerald-500/5 blur-2xl" />

          <div className="relative z-10 flex flex-col items-center max-w-md mx-auto space-y-3">
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 shadow-inner">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h4 className="text-base font-bold text-foreground">
                All caught up! Next revision due in {nextRevisionDays} {nextRevisionDays === 1 ? 'day' : 'days'}
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Zero cognitive debt. The spaced retrieval engine schedules memory reinforcement sessions at 00:00 UTC based on your mastery trajectory.
              </p>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
              <div className="inline-flex items-center gap-1.5 text-[11px] font-mono text-slate-400 bg-surface-elevated/70 px-3 py-1 rounded-md border border-border">
                <Clock className="w-3.5 h-3.5 text-primary" />
                <span>Next interval calculation: 00:00 UTC</span>
              </div>
              {onExplorePractice && (
                <Button variant="outline" size="sm" onClick={onExplorePractice}>
                  <Zap className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
                  Practice Problem Catalog
                </Button>
              )}
            </div>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {dueRevisions.map((rev) => {
            const lessonSlug = rev.topic.slug.endsWith('-foundations')
              ? rev.topic.slug
              : `${rev.topic.slug}-foundations`;

            return (
              <Card
                key={rev.id}
                className="group p-4 bg-surface/80 hover:bg-surface-elevated/80 border-border/80 hover:border-primary/40 transition-all duration-200 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="indigo" size="sm">
                      {rev.intervalDays}d Interval
                    </Badge>
                    <span className="text-[11px] font-mono text-amber-400 font-semibold flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Due at UTC Midnight
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                    {rev.topic.title}
                  </h4>

                  <p className="text-[11px] text-slate-400 font-mono">
                    Retention checkpoint: Pass with ≥80% score to extend interval to{' '}
                    {rev.intervalDays >= 7 ? '21 days' : '7 days'}
                  </p>
                </div>

                <div className="shrink-0 flex items-center gap-2 self-start sm:self-center">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => onReviewTopic(lessonSlug)}
                    className="font-semibold shadow-md shadow-primary/20"
                  >
                    <span>Review Now</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
