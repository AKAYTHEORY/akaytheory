import React from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import {
  Clock,
  ArrowRight,
  Compass,
  CheckCircle2,
  Terminal,
} from 'lucide-react';

export interface FocusTopicDetails {
  id?: string;
  title: string;
  slug: string;
  estimatedMinutes?: number;
  domain?: string;
  summary?: string;
  invariants?: string[];
  lessonSlug?: string;
}

export interface HeroLearningFocusProps {
  topic?: FocusTopicDetails;
  onContinue: (slug: string) => void;
  onNavigateRoadmaps: () => void;
}

export const HeroLearningFocus: React.FC<HeroLearningFocusProps> = ({
  topic,
  onContinue,
  onNavigateRoadmaps,
}) => {
  const currentTopic: FocusTopicDetails = topic || {
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

  const targetLessonSlug =
    currentTopic.lessonSlug ||
    (currentTopic.slug.endsWith('-foundations')
      ? currentTopic.slug
      : `${currentTopic.slug}-foundations`);

  return (
    <Card className="relative overflow-hidden p-6 md:p-8 bg-gradient-to-br from-[#161C2A]/90 via-[#0F1420]/95 to-[#0A0D14] border border-white/[0.1] shadow-2xl before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent">
      {/* Decorative gradient blur backdrop */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 h-32 w-64 bg-indigo-500/10 blur-2xl" />

      <div className="relative z-10 space-y-6">
        {/* Eyebrow: Domain tag, status pulse, estimated duration */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <Badge variant="indigo" size="sm">
              {currentTopic.domain || 'Algorithms & Data Structures'}
            </Badge>

            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Recommended Learning Focus
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-surface/60 px-3 py-1 rounded-full border border-border">
            <Clock className="w-3.5 h-3.5 text-primary" />
            <span>{currentTopic.estimatedMinutes || 25} MIN TARGET</span>
          </div>
        </div>

        {/* Topic Title & Core Summary */}
        <div className="space-y-3 max-w-3xl">
          <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight leading-snug">
            {currentTopic.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {currentTopic.summary ||
              'Internalize algorithmic invariants, verify mathematical bounds, and test your mental model with live interactive visualizers before advancing.'}
          </p>
        </div>

        {/* Invariant & Core Concepts Pill List */}
        {currentTopic.invariants && currentTopic.invariants.length > 0 && (
          <div className="space-y-2 pt-1">
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-primary" />
              <span>Core Invariant Checkpoints</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {currentTopic.invariants.map((item, idx) => (
                <div
                  key={idx}
                  className="inline-flex items-center gap-1.5 text-xs text-slate-200 bg-surface-elevated/70 px-3 py-1.5 rounded-lg border border-border/70"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action CTAs */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Button
            variant="primary"
            size="md"
            onClick={() => onContinue(targetLessonSlug)}
            className="font-bold tracking-wide shadow-lg shadow-primary/25"
          >
            <span>Continue Learning</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>

          <Button
            variant="secondary"
            size="md"
            onClick={onNavigateRoadmaps}
            className="font-semibold"
          >
            <Compass className="w-4 h-4 mr-2 text-slate-400" />
            <span>View Roadmap Topology</span>
          </Button>
        </div>
      </div>
    </Card>
  );
};

