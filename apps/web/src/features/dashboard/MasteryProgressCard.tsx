import React from 'react';
import { Card } from '../../components/ui/Card';
import { Award, TrendingUp, BookOpen, Sparkles, ShieldCheck } from 'lucide-react';

export interface MasteryCounts {
  MASTERED: number;
  PROFICIENT: number;
  FAMILIAR: number;
  NOVICE: number;
}

export interface MasteryProgressCardProps {
  counts: MasteryCounts;
  totalEnrolled: number;
}

export const MasteryProgressCard: React.FC<MasteryProgressCardProps> = ({
  counts,
  totalEnrolled,
}) => {
  const sumCounts = counts.MASTERED + counts.PROFICIENT + counts.FAMILIAR + counts.NOVICE;
  const effectiveTotal = Math.max(sumCounts, totalEnrolled, 1);

  const masteredPct = sumCounts > 0 ? Math.round((counts.MASTERED / effectiveTotal) * 100) : 0;
  const proficientPct = sumCounts > 0 ? Math.round((counts.PROFICIENT / effectiveTotal) * 100) : 0;
  const familiarPct = sumCounts > 0 ? Math.round((counts.FAMILIAR / effectiveTotal) * 100) : 0;
  const novicePct = sumCounts > 0 ? Math.round((counts.NOVICE / effectiveTotal) * 100) : 0;

  const retainedPct = sumCounts > 0 ? Math.min(100, masteredPct + proficientPct) : 0;

  const stages = [
    {
      id: 'mastered',
      label: 'Mastered',
      level: 'Stage 4',
      count: counts.MASTERED,
      percentage: masteredPct,
      colorText: 'text-emerald-400',
      colorBg: 'bg-emerald-500/10',
      colorBorder: 'border-emerald-500/30',
      barFill: 'bg-emerald-500',
      icon: Award,
      criterion: '≥2 consecutive 80%+ spaced reviews (21d retention cycle)',
      badgeLabel: 'Consolidated',
    },
    {
      id: 'proficient',
      label: 'Proficient',
      level: 'Stage 3',
      count: counts.PROFICIENT,
      percentage: proficientPct,
      colorText: 'text-primary',
      colorBg: 'bg-primary/10',
      colorBorder: 'border-primary/30',
      barFill: 'bg-primary',
      icon: TrendingUp,
      criterion: 'Independent practice problem solved with correct complexity (7d cycle)',
      badgeLabel: 'Applied',
    },
    {
      id: 'familiar',
      label: 'Familiar',
      level: 'Stage 2',
      count: counts.FAMILIAR,
      percentage: familiarPct,
      colorText: 'text-sky-400',
      colorBg: 'bg-sky-500/10',
      colorBorder: 'border-sky-500/30',
      barFill: 'bg-sky-400',
      icon: BookOpen,
      criterion: 'Knowledge check quiz passed with ≥75% score (3d cycle)',
      badgeLabel: 'Verified',
    },
    {
      id: 'novice',
      label: 'Novice',
      level: 'Stage 1',
      count: counts.NOVICE,
      percentage: novicePct,
      colorText: 'text-amber-400',
      colorBg: 'bg-amber-500/10',
      colorBorder: 'border-amber-500/30',
      barFill: 'bg-amber-400',
      icon: Sparkles,
      criterion: 'Lesson read, mental invariant identified, initial retention active (1d cycle)',
      badgeLabel: 'Initialized',
    },
  ];

  return (
    <Card className="relative overflow-hidden p-6 md:p-7 bg-[#0E121A]/90 backdrop-blur-2xl border border-white/[0.08] shadow-2xl space-y-6 before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/15 before:to-transparent">
      {/* Cockpit Card Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground tracking-tight">
              Cognitive Mastery Progression
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Deterministic multi-tier retention model. Transitions require objective validation through knowledge checks, problem submissions, and scheduled reviews.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-[#141A26]/80 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/[0.08] shadow-sm">
          <div>
            <div className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">
              High-Retention Ratio
            </div>
            <div className="text-xl font-bold font-mono text-foreground">
              {retainedPct}%
            </div>
          </div>
          <div className="h-8 w-px bg-border" />
          <div>
            <div className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">
              Tracked Topics
            </div>
            <div className="text-xl font-bold font-mono text-foreground">
              {sumCounts} <span className="text-xs text-slate-500 font-normal">/ {effectiveTotal}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Unified Segmented Distribution Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
          <span>COGNITIVE DISTRIBUTION</span>
          <span>{sumCounts > 0 ? `${sumCounts} TOPICS ACTIVE` : 'NO TOPICS STARTED'}</span>
        </div>

        <div className="h-2.5 w-full bg-surface-elevated rounded-full overflow-hidden flex p-0.5 border border-border/50">
          {sumCounts === 0 ? (
            <div className="h-full w-full bg-surface-muted rounded-full" />
          ) : (
            <>
              {counts.MASTERED > 0 && (
                <div
                  className="h-full bg-emerald-500 rounded-l-full transition-all duration-500"
                  style={{ width: `${masteredPct}%` }}
                  title={`Mastered: ${counts.MASTERED} (${masteredPct}%)`}
                />
              )}
              {counts.PROFICIENT > 0 && (
                <div
                  className="h-full bg-primary transition-all duration-500"
                  style={{ width: `${proficientPct}%` }}
                  title={`Proficient: ${counts.PROFICIENT} (${proficientPct}%)`}
                />
              )}
              {counts.FAMILIAR > 0 && (
                <div
                  className="h-full bg-sky-400 transition-all duration-500"
                  style={{ width: `${familiarPct}%` }}
                  title={`Familiar: ${counts.FAMILIAR} (${familiarPct}%)`}
                />
              )}
              {counts.NOVICE > 0 && (
                <div
                  className="h-full bg-amber-400 rounded-r-full transition-all duration-500"
                  style={{ width: `${novicePct}%` }}
                  title={`Novice: ${counts.NOVICE} (${novicePct}%)`}
                />
              )}
            </>
          )}
        </div>
      </div>

      {/* Four Cohesive Breakdown Stages */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stages.map((stage) => {
          const Icon = stage.icon;
          return (
            <div
              key={stage.id}
              className={`rounded-xl p-4 border transition-all duration-200 bg-surface-elevated/40 hover:bg-surface-elevated/80 ${stage.colorBorder}`}
            >
              {/* Header row */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                  {stage.level}
                </span>
                <span className={`p-1.5 rounded-lg ${stage.colorBg} ${stage.colorText}`}>
                  <Icon className="w-4 h-4" />
                </span>
              </div>

              {/* Title & Count */}
              <div className="flex items-baseline justify-between gap-2">
                <span className={`text-sm font-bold ${stage.colorText}`}>
                  {stage.label}
                </span>
                <span className="text-2xl font-black font-mono text-foreground">
                  {stage.count}
                </span>
              </div>

              {/* Individual Stage Progress Bar & Percentage */}
              <div className="mt-3 space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>Share</span>
                  <span>{stage.percentage}%</span>
                </div>
                <div className="h-1.5 w-full bg-surface-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full ${stage.barFill} rounded-full transition-all duration-500`}
                    style={{ width: `${Math.min(100, stage.percentage)}%` }}
                  />
                </div>
              </div>

              {/* Criteria description */}
              <p className="text-[11px] text-slate-400/90 mt-3 pt-2.5 border-t border-border/50 leading-relaxed min-h-[38px]">
                {stage.criterion}
              </p>
            </div>
          );
        })}
      </div>

      {/* Footer Notice */}
      <div className="text-[11px] text-slate-500 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/40 font-mono">
        <span>CRITERIA: SRS §3.11 DETERMINISTIC EVIDENCE</span>
        <span>SUPERMEMO-ALIGNED RETENTION COEFFICIENTS</span>
      </div>
    </Card>
  );
};

