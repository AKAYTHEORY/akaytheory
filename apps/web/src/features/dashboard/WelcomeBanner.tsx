import React from 'react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Compass, Play, Sparkles } from 'lucide-react';

export interface WelcomeBannerProps {
  userName?: string;
  focusTopicTitle: string;
  focusTopicSlug: string;
  totalEnrolled: number;
  dueRevisionsCount: number;
  onContinueFocus: (slug: string) => void;
  onNavigateRoadmaps: () => void;
}

export const WelcomeBanner: React.FC<WelcomeBannerProps> = ({
  userName,
  focusTopicTitle,
  focusTopicSlug,
  totalEnrolled,
  dueRevisionsCount,
  onContinueFocus,
  onNavigateRoadmaps,
}) => {
  const displayName = userName || 'Engineer';

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-[#141A26]/90 via-[#0E121A]/95 to-[#0A0D14] p-6 md:p-8 shadow-2xl backdrop-blur-2xl before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent">
      {/* Background ambient decorative glow */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-16 -bottom-16 h-64 w-64 rounded-full bg-emerald-500/5 blur-3xl" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          {/* Status Chips */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Cognitive Engine Active
            </span>
            <Badge variant="indigo" size="sm">
              Dual-Domain Track
            </Badge>
            <span className="text-xs text-slate-500 font-mono hidden sm:inline">
              UTC 00:00 Cadence
            </span>
          </div>

          {/* Heading */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Welcome back, <span className="text-primary">{displayName}</span>
            </h1>
            <p className="text-sm text-slate-400 mt-1 leading-relaxed">
              Engineering Mastery Cockpit. Monitoring algorithmic retention, spaced retrieval intervals, and structured mental models across DSA and Distributed Systems.
            </p>
          </div>

          {/* Current Focus Highlight Pill */}
          <div className="inline-flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Current Focus:
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-200 bg-surface-muted/90 px-3 py-1 rounded-lg border border-border">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              {focusTopicTitle}
            </span>
          </div>
        </div>

        {/* Telemetry and Action Controls */}
        <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-3 shrink-0">
          <div className="flex items-center gap-3 self-start lg:self-end text-xs font-mono text-slate-300 bg-[#161D2A]/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/[0.08] shadow-sm">
            <div>
              <span className="text-slate-500">TRACKS:</span>{' '}
              <span className="text-foreground font-bold">{totalEnrolled}</span>
            </div>
            <span className="text-slate-600">|</span>
            <div>
              <span className="text-slate-500">QUEUE:</span>{' '}
              <span className={dueRevisionsCount > 0 ? 'text-amber-400 font-bold' : 'text-emerald-400 font-bold'}>
                {dueRevisionsCount} DUE
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <Button
              variant="secondary"
              size="sm"
              onClick={onNavigateRoadmaps}
              className="flex-1 sm:flex-initial"
            >
              <Compass className="w-4 h-4 mr-1.5 text-slate-400" />
              Roadmaps
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => onContinueFocus(focusTopicSlug)}
              className="flex-1 sm:flex-initial font-semibold"
            >
              <Play className="w-3.5 h-3.5 mr-1.5 fill-current" />
              Resume Focus
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
