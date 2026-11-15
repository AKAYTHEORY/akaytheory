import React, { useState, useEffect } from 'react';
import { Card, Badge, Button, Skeleton } from '../../components/ui';
import { apiClient } from '../../lib/api';
import { QuizWidget, type QuizQuestion } from './QuizWidget';
import { VisualizerWidget } from '../visualizers/VisualizerWidget';
import {
  BookOpen,
  Clock,
  ChevronRight,
  Eye,
  EyeOff,
  Lightbulb,
  CheckCircle,
  AlertTriangle,
  BrainCircuit,
  Zap,
  Copy,
  Check,
} from 'lucide-react';

export interface LessonSection {
  id: string;
  sectionType: string;
  title: string;
  content?: string;
  contentMarkdown?: string;
  orderIndex: number;
}

export interface LessonData {
  id: string;
  slug: string;
  title: string;
  status: string;
  estimatedMinutes: number;
  topic: {
    id: string;
    slug: string;
    title: string;
    difficulty: string;
  };
  sections: LessonSection[];
  questions: QuizQuestion[];
}

export interface LessonViewerProps {
  lessonSlug: string;
  onNavigateTopic?: (slug: string) => void;
}

export const LessonViewer: React.FC<LessonViewerProps> = ({
  lessonSlug,
  onNavigateTopic,
}) => {
  const [lesson, setLesson] = useState<LessonData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  // Collapsible state for THINK_BEFORE_REVEAL sections
  const [revealedSections, setRevealedSections] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let isMounted = true;
    async function loadLesson() {
      setIsLoading(true);
      setError(null);
      const res = await apiClient.get<LessonData>(`/curriculum/lessons/${lessonSlug}`);
      if (!isMounted) return;
      setIsLoading(false);
      if (res.data) {
        setLesson(res.data);
      } else {
        setError(res.error?.detail || 'Failed to load lesson.');
      }
    }
    loadLesson();
    return () => {
      isMounted = false;
    };
  }, [lessonSlug]);

  const toggleReveal = (sectionId: string) => {
    setRevealedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const handleCopyCode = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto py-8">
        <Skeleton className="h-6 w-1/4 rounded-md" />
        <Skeleton className="h-10 w-2/3 rounded-lg" />
        <Skeleton className="h-64 w-full rounded-2xl" />
        <Skeleton className="h-40 w-full rounded-2xl" />
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <Card className="p-8 text-center max-w-xl mx-auto my-12 bg-surface border-border">
        <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-foreground">Lesson Unavailable</h3>
        <p className="text-sm text-slate-400 mt-1 mb-4">{error || 'Lesson not found.'}</p>
        <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </Card>
    );
  }

  const isDsaAlgorithm =
    lesson.slug.includes('binary-search') ||
    lesson.slug.includes('pointer') ||
    lesson.slug.includes('window');

  return (
    <article className="max-w-4xl mx-auto py-6 space-y-10">
      {/* Lesson Navigation Header */}
      <header className="space-y-4 pb-6 border-b border-border/80">
        {/* Breadcrumb path */}
        <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
          <button
            onClick={() => onNavigateTopic && onNavigateTopic(lesson.topic.slug)}
            className="hover:text-primary transition-colors flex items-center gap-1.5"
          >
            <BookOpen className="w-3.5 h-3.5" />
            {lesson.topic.title}
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-foreground font-semibold">{lesson.title}</span>
        </div>

        {/* Title & Metadata Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight leading-tight">
            {lesson.title}
          </h1>
          <div className="flex items-center gap-2.5 self-start sm:self-auto shrink-0">
            <Badge variant="primary" size="md">
              <Clock className="w-3.5 h-3.5 mr-1 inline" />
              {lesson.estimatedMinutes} mins read
            </Badge>
            <Badge variant="neutral" size="md">
              {lesson.topic.difficulty}
            </Badge>
          </div>
        </div>
      </header>

      {/* Lesson Sections (Distraction-Free Reading Layout) */}
      <div className="space-y-8">
        {lesson.sections.map((section, idx) => {
          const rawText = section.content || section.contentMarkdown || '';

          // 1. THINK_BEFORE_REVEAL ("Mental Model Checkpoint")
          if (section.sectionType === 'THINK_BEFORE_REVEAL') {
            const isRevealed = !!revealedSections[section.id];
            return (
              <div
                key={section.id}
                className="relative rounded-2xl border border-primary/40 bg-gradient-to-br from-primary/10 via-surface to-accent/5 p-6 sm:p-7 shadow-xl shadow-primary/5 overflow-hidden transition-all"
              >
                {/* Glow accent bar on the left */}
                <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-gradient-to-b from-primary to-accent" />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-primary/20 border border-primary/40 text-primary shrink-0">
                      <BrainCircuit className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-primary">
                        Mental Model Checkpoint #{idx + 1}
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-foreground">
                        {section.title}
                      </h3>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleReveal(section.id)}
                    className="border-primary/40 text-foreground hover:bg-primary/20 shrink-0 self-start sm:self-auto"
                  >
                    {isRevealed ? (
                      <>
                        <EyeOff className="w-4 h-4 mr-1.5 text-slate-400" />
                        Hide Solution
                      </>
                    ) : (
                      <>
                        <Eye className="w-4 h-4 mr-1.5 text-primary" />
                        Think & Reveal
                      </>
                    )}
                  </Button>
                </div>

                {isRevealed ? (
                  <div className="mt-4 pt-4 border-t border-primary/20 space-y-3 animate-in fade-in duration-300">
                    <div className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
                      {rawText}
                    </div>
                    <div className="p-3 bg-surface-elevated/80 rounded-xl border border-border/80 text-xs text-slate-300 flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>Takeaway: Connecting this intuition to edge cases solidifies your algorithm mental model.</span>
                    </div>
                  </div>
                ) : (
                  <div className="mt-2 text-xs text-slate-400 italic bg-surface-muted/50 p-3 rounded-xl border border-border/50 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-amber-400/80 shrink-0" />
                    <span>Take 30 seconds to formulate your prediction in your head before revealing the insight!</span>
                  </div>
                )}
              </div>
            );
          }

          // 2. COMPLEXITY_ANALYSIS
          if (section.sectionType === 'COMPLEXITY_ANALYSIS') {
            return (
              <div
                key={section.id}
                className="p-6 sm:p-7 rounded-2xl bg-surface border border-border shadow-md space-y-4"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
                      Performance Bound
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-foreground">
                      {section.title}
                    </h3>
                  </div>
                </div>

                <div className="text-sm text-slate-300 font-mono bg-surface-elevated/70 p-4 rounded-xl border border-border/80 whitespace-pre-wrap leading-relaxed">
                  {rawText}
                </div>
              </div>
            );
          }

          // 3. CODE_EXAMPLE
          if (section.sectionType === 'CODE_EXAMPLE' || rawText.includes('```')) {
            const cleanCode = rawText.replace(/```[a-z]*\n?/g, '').trim();

            return (
              <section key={section.id} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
                    <span className="text-xs font-mono text-primary font-bold">
                      {String(idx + 1).padStart(2, '0')}.
                    </span>
                    {section.title}
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopyCode(cleanCode, section.id)}
                    className="text-xs text-slate-400 hover:text-foreground h-7 px-2"
                  >
                    {copiedCodeId === section.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 mr-1" />
                        Copy Code
                      </>
                    )}
                  </Button>
                </div>

                <div className="relative rounded-2xl overflow-hidden border border-border bg-surface-muted/90 shadow-lg">
                  <div className="flex items-center justify-between px-4 py-2 border-b border-border/80 bg-surface-elevated/60 text-xs font-mono text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500/60 inline-block" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500/60 inline-block" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/60 inline-block" />
                      <span className="ml-2 text-slate-300 font-semibold">implementation.ts</span>
                    </span>
                    <span>TypeScript</span>
                  </div>
                  <pre className="p-4 sm:p-5 text-xs sm:text-sm font-mono text-slate-200 overflow-x-auto leading-relaxed">
                    <code>{cleanCode}</code>
                  </pre>
                </div>
              </section>
            );
          }

          // 4. DEFAULT CONCEPTUAL SECTION (OVERVIEW, MECHANICS, ETC.)
          return (
            <section key={section.id} className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
                <span className="text-xs font-mono text-primary font-bold">
                  {String(idx + 1).padStart(2, '0')}.
                </span>
                {section.title}
              </h2>
              <div className="p-6 rounded-2xl bg-surface/70 border border-border text-sm sm:text-base text-slate-300 leading-relaxed whitespace-pre-wrap space-y-4">
                {rawText}
              </div>
            </section>
          );
        })}
      </div>

      {/* Embedded Visualizer workbench when applicable */}
      {isDsaAlgorithm && (
        <section className="pt-6 space-y-4 border-t border-border/80">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary">
              <Zap className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-xl font-bold text-foreground">Interactive Algorithm Workbench</h2>
              <p className="text-xs text-slate-400">Ground the theoretical concepts above by stepping through execution states.</p>
            </div>
          </div>
          <VisualizerWidget />
        </section>
      )}

      {/* Knowledge Check / Interactive Quiz */}
      <section className="pt-6 border-t border-border/80">
        <QuizWidget
          topicId={lesson.topic.id}
          topicTitle={lesson.topic.title}
          questions={lesson.questions}
        />
      </section>
    </article>
  );
};
