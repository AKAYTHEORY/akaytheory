import React from 'react';
import { Button, Badge } from '../../components/ui';
import {
  Sparkles,
  UserPlus,
  LogIn,
  ArrowRight,
  ShieldCheck,
  Zap,
  Map,
  BookOpen,
  Compass,
} from 'lucide-react';

export interface LandingGatewayProps {
  onSignIn: () => void;
  onSignUp: () => void;
  onContinueGuest: (targetNav?: string) => void;
}

export const LandingGateway: React.FC<LandingGatewayProps> = ({
  onSignIn,
  onSignUp,
  onContinueGuest,
}) => {
  return (
    <div className="space-y-8 max-w-5xl mx-auto py-4 sm:py-8">
      {/* MacBook Pro Window Frame */}
      <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-[#141A26]/95 via-[#0E121A]/98 to-[#0A0D14] shadow-2xl backdrop-blur-2xl before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent">
        {/* macOS Window Chrome Header */}
        <div className="px-5 py-3.5 bg-surface-muted/60 flex items-center justify-between border-b border-white/[0.06] select-none">
          <div className="flex items-center space-x-2" aria-hidden="true">
            <span className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] block" />
            <span className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] block" />
            <span className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] block" />
          </div>
          <div className="text-[11px] font-mono text-slate-400 font-medium px-3 py-0.5 rounded-md bg-surface border border-white/[0.06]">
            akaytheory.gateway.v1 — Darwin ARM64
          </div>
          <div className="hidden sm:flex items-center space-x-1.5 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Dual-Domain Engine Active</span>
          </div>
        </div>

        {/* Hero Section */}
        <div className="p-6 sm:p-10 md:p-12 space-y-8">
          <div className="space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>Dual-Domain Anchor Launch • DSA + System Design Foundations</span>
            </div>

            <h2 className="text-xs font-mono text-primary font-semibold tracking-wider uppercase">
              Learner Dashboard
            </h2>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
              Don't just read about engineering. <br className="hidden sm:inline" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-300 to-indigo-400">
                Understand, visualize, interact, and practice it.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              AkayTheory combines structured topological roadmaps, deterministic algorithm execution engines, and multi-tier cognitive retention modeling to help software engineers truly master core invariants.
            </p>

            <blockquote className="text-xs sm:text-sm text-slate-400 italic pl-3 border-l-2 border-primary/50">
              "The way to a better you is you through you."
            </blockquote>
          </div>

          {/* The 3 Primary Portals: Sign Up, Sign In, Guest Mode */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
            {/* Portal 1: Create Account */}
            <div className="relative rounded-2xl p-6 bg-[#161D2A]/80 border border-primary/30 shadow-xl flex flex-col justify-between space-y-4 hover:border-primary/60 transition-all group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="p-2.5 rounded-xl bg-primary/15 text-primary border border-primary/30">
                    <UserPlus className="w-5 h-5" />
                  </span>
                  <Badge variant="indigo" size="sm">
                    New Engineer
                  </Badge>
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Create Account</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Personalized profile with cloud mastery persistence, quiz progress records, and automated 00:00 UTC spaced revision schedules.
                  </p>
                </div>
              </div>

              <Button
                variant="primary"
                size="md"
                onClick={onSignUp}
                className="w-full font-semibold shadow-lg shadow-primary/20"
              >
                <span>Create Account</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>

            {/* Portal 2: Sign In */}
            <div className="relative rounded-2xl p-6 bg-[#161D2A]/60 border border-white/[0.08] shadow-xl flex flex-col justify-between space-y-4 hover:border-white/20 transition-all group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="p-2.5 rounded-xl bg-surface-elevated text-slate-200 border border-white/[0.08]">
                    <LogIn className="w-5 h-5" />
                  </span>
                  <Badge variant="neutral" size="sm">
                    Returning
                  </Badge>
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Sign In</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Resume your active focus topic, review due algorithmic invariants in the queue, and continue your roadmap progression.
                  </p>
                </div>
              </div>

              <Button
                variant="secondary"
                size="md"
                onClick={onSignIn}
                className="w-full font-medium"
              >
                <span>Sign In</span>
                <LogIn className="w-4 h-4 ml-1.5" />
              </Button>
            </div>

            {/* Portal 3: Continue as Guest */}
            <div className="relative rounded-2xl p-6 bg-gradient-to-br from-[#121622]/80 to-[#10141F]/90 border border-emerald-500/30 shadow-xl flex flex-col justify-between space-y-4 hover:border-emerald-500/50 transition-all group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    <Compass className="w-5 h-5" />
                  </span>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    Open Access
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Continue as Guest</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Zero signup barrier. Immediately explore roadmaps, interactive lessons, algorithm visualizers, and coding practice.
                  </p>
                </div>
              </div>

              <Button
                variant="outline"
                size="md"
                onClick={() => onContinueGuest('explore')}
                className="w-full font-semibold border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/10"
              >
                <span>Continue as Guest</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Architecture Overview (Direct Open Access Triggers) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          type="button"
          onClick={() => onContinueGuest('roadmaps')}
          className="text-left rounded-2xl p-5 bg-surface/80 border border-border/80 hover:border-primary/50 hover:bg-surface-elevated/40 transition-all space-y-2 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/40"
        >
          <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 text-primary w-fit group-hover:bg-primary/20 transition">
            <Map className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition">Topological Roadmaps</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Directed acyclic graph dependencies across Algorithms and Distributed Systems with WCAG 2.2 AA accessibility.
          </p>
        </button>

        <button
          type="button"
          onClick={() => onContinueGuest('visualizers')}
          className="text-left rounded-2xl p-5 bg-surface/80 border border-border/80 hover:border-emerald-500/50 hover:bg-surface-elevated/40 transition-all space-y-2 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
        >
          <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 w-fit group-hover:bg-emerald-500/20 transition">
            <Zap className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-foreground group-hover:text-emerald-400 transition">Algorithm Visualizers</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Deterministic state-machine playback tracking memory pointers, loop invariants, and complexity bounds.
          </p>
        </button>

        <button
          type="button"
          onClick={() => onContinueGuest('lessons')}
          className="text-left rounded-2xl p-5 bg-surface/80 border border-border/80 hover:border-sky-500/50 hover:bg-surface-elevated/40 transition-all space-y-2 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-500/40"
        >
          <div className="p-2 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400 w-fit group-hover:bg-sky-500/20 transition">
            <BookOpen className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-foreground group-hover:text-sky-400 transition">Interactive Lessons</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            "Think Before Reveal" mental model checkpoints, reference code, and embedded knowledge check quizzes.
          </p>
        </button>

        <button
          type="button"
          onClick={() => onContinueGuest('revision')}
          className="text-left rounded-2xl p-5 bg-surface/80 border border-border/80 hover:border-amber-500/50 hover:bg-surface-elevated/40 transition-all space-y-2 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500/40"
        >
          <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 w-fit group-hover:bg-amber-500/20 transition">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-foreground group-hover:text-amber-400 transition">Spaced Retrieval</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Deterministic multi-tier retention intervals (1d, 3d, 7d, 21d) calculating review queues at UTC 00:00 midnight.
          </p>
        </button>
      </div>
    </div>
  );
};
