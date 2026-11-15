import React, { useState } from 'react';
import { Card, Badge, Button } from '../../components/ui';
import { apiClient } from '../../lib/api';
import {
  Code2,
  CheckCircle2,
  HelpCircle,
  Eye,
  Clock,
  HardDrive,
  Award,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Copy,
  Check,
  FileText,
  Sparkles,
} from 'lucide-react';

export interface ProblemExample {
  input: string;
  output: string;
  explanation?: string;
}

export interface ProblemData {
  id: string;
  slug: string;
  title: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  statementMarkdown: string;
  examplesJson: ProblemExample[];
  constraintsJson: string[];
  hintsJson: string[];
  solutionMarkdown: string;
  timeComplexity: string;
  spaceComplexity: string;
  topic?: {
    id: string;
    slug: string;
    title: string;
  };
}

export interface ProblemWorkspaceProps {
  problem: ProblemData;
  onSolved?: () => void;
}

export const ProblemWorkspace: React.FC<ProblemWorkspaceProps> = ({ problem, onSolved }) => {
  const [activeTab, setActiveTab] = useState<'statement' | 'hints' | 'solution'>('statement');
  const [revealedHintIndex, setRevealedHintIndex] = useState<number>(-1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [solvedMessage, setSolvedMessage] = useState<string | null>(null);
  const [copiedSolution, setCopiedSolution] = useState(false);

  const defaultStarterCode = `function solve(nums: number[], target: number): number {\n  // Implement your algorithm here\n  // Return the index or required result\n  return -1;\n}`;

  const [codeSnippet, setCodeSnippet] = useState<string>(defaultStarterCode);

  const handleRevealNextHint = () => {
    if (revealedHintIndex < problem.hintsJson.length - 1) {
      setRevealedHintIndex(revealedHintIndex + 1);
    }
  };

  const handleCopySolution = () => {
    navigator.clipboard.writeText(problem.solutionMarkdown);
    setCopiedSolution(true);
    setTimeout(() => setCopiedSolution(false), 2000);
  };

  const handleSubmitSolution = async () => {
    setIsSubmitting(true);
    setSolvedMessage(null);

    const res = await apiClient.post<{ message: string; submission: Record<string, unknown> }>(
      '/progress/problem',
      {
        problemId: problem.id,
        status: 'SELF_REPORTED_SOLVED',
        solutionLanguage: 'typescript',
        userCode: codeSnippet,
        notes: 'Solved in Practice Workspace',
      }
    );

    setIsSubmitting(false);

    if (res.data) {
      setSolvedMessage('Problem Solved! Mastery progress and revision schedule updated.');
      if (onSolved) onSolved();
    } else {
      setSolvedMessage(res.error?.detail || 'Failed to submit problem.');
    }
  };

  // Line numbers calculation for code editor
  const lineNumbers = codeSnippet.split('\n').map((_, i) => i + 1);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto py-4">
      {/* Left Column: Problem Specs, Progressive Hints & Solution (7 cols) */}
      <div className="lg:col-span-7 space-y-4">
        {/* Problem Header */}
        <div className="p-5 rounded-2xl bg-surface border border-border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
                {problem.title}
              </h1>
              <Badge
                variant={
                  problem.difficulty === 'EASY'
                    ? 'success'
                    : problem.difficulty === 'MEDIUM'
                    ? 'warning'
                    : 'danger'
                }
                size="sm"
              >
                {problem.difficulty}
              </Badge>
            </div>
            {problem.topic && (
              <p className="text-xs text-slate-400">
                Curriculum Topic: <span className="text-primary font-medium">{problem.topic.title}</span>
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs font-mono self-start sm:self-auto">
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-muted border border-border/80 text-emerald-400">
              <Clock className="w-3.5 h-3.5" />
              {problem.timeComplexity}
            </span>
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-muted border border-border/80 text-primary">
              <HardDrive className="w-3.5 h-3.5" />
              {problem.spaceComplexity}
            </span>
          </div>
        </div>

        {/* Workspace Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-surface-elevated/70 rounded-xl border border-border">
          <button
            onClick={() => setActiveTab('statement')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'statement'
                ? 'bg-primary text-white shadow'
                : 'text-slate-400 hover:text-foreground'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Description
          </button>
          <button
            onClick={() => setActiveTab('hints')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'hints'
                ? 'bg-primary text-white shadow'
                : 'text-slate-400 hover:text-foreground'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            Progressive Hints
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-surface text-slate-300">
              {revealedHintIndex + 1}/{problem.hintsJson.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('solution')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'solution'
                ? 'bg-primary text-white shadow'
                : 'text-slate-400 hover:text-foreground'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            Editorial Solution
          </button>
        </div>

        {/* Tab 1: Problem Statement */}
        {activeTab === 'statement' && (
          <Card className="p-6 bg-surface/90 border-border space-y-6">
            {/* Statement text */}
            <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
              {problem.statementMarkdown}
            </div>

            {/* Test Case Examples */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Examples
              </h3>
              {problem.examplesJson.map((ex, idx) => (
                <div
                  key={idx}
                  className="bg-surface-elevated/60 p-4 rounded-xl border border-border/80 text-xs font-mono space-y-2"
                >
                  <div className="flex items-start gap-2">
                    <span className="text-slate-500 font-semibold select-none">Input:</span>
                    <span className="text-foreground">{ex.input}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-slate-500 font-semibold select-none">Output:</span>
                    <span className="text-emerald-400 font-bold">{ex.output}</span>
                  </div>
                  {ex.explanation && (
                    <div className="text-slate-400 pt-1 border-t border-border/40 font-sans text-xs">
                      <span className="font-semibold text-slate-300">Explanation: </span>
                      {ex.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Constraints */}
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Constraints
              </h3>
              <ul className="space-y-1.5 text-xs font-mono text-slate-300">
                {problem.constraintsJson.map((c, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        )}

        {/* Tab 2: Progressive Hints (BR-009) */}
        {activeTab === 'hints' && (
          <Card className="p-6 bg-surface/90 border-border space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-border/80">
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  Progressive Hint Disclosure (BR-009)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Reveal hints progressively when blocked to build intuition without spoiling the full solution.
                </p>
              </div>

              {revealedHintIndex < problem.hintsJson.length - 1 && (
                <Button variant="outline" size="sm" onClick={handleRevealNextHint}>
                  <Sparkles className="w-3.5 h-3.5 mr-1 text-primary" />
                  Reveal Next Hint
                </Button>
              )}
            </div>

            {problem.hintsJson.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No hints recorded for this problem.</p>
            ) : (
              <div className="space-y-3">
                {problem.hintsJson.map((hint, idx) => {
                  const isRevealed = idx <= revealedHintIndex;
                  return (
                    <div
                      key={idx}
                      className={`p-4 rounded-xl border text-xs transition-all ${
                        isRevealed
                          ? 'bg-primary/10 border-primary/40 text-foreground'
                          : 'bg-surface-muted/40 border-border/50 text-slate-500 opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold mb-1">
                        <span className="flex items-center gap-1.5">
                          <span className="font-mono text-[11px] text-primary">Hint #{idx + 1}</span>
                        </span>
                        {isRevealed ? (
                          <ChevronUp className="w-4 h-4 text-primary" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-500" />
                        )}
                      </div>
                      {isRevealed ? (
                        <p className="mt-1 leading-relaxed text-slate-300 font-sans">{hint}</p>
                      ) : (
                        <p className="mt-1 italic font-sans text-slate-500">
                          Locked hint. Click "Reveal Next Hint" above to unlock.
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        )}

        {/* Tab 3: Official Solution & Complexity */}
        {activeTab === 'solution' && (
          <Card className="p-6 bg-surface/90 border-border space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border/80">
              <div>
                <h3 className="text-sm font-bold text-foreground">Official Reference Solution</h3>
                <p className="text-xs text-slate-400 mt-0.5">Optimal time and space bounds.</p>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopySolution}
                className="text-xs text-slate-400 hover:text-foreground h-7 px-2"
              >
                {copiedSolution ? (
                  <>
                    <Check className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 mr-1" />
                    Copy Solution
                  </>
                )}
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-surface-elevated border border-border flex items-center justify-between">
                <span className="text-slate-400">Time Complexity:</span>
                <span className="text-emerald-400 font-bold">{problem.timeComplexity}</span>
              </div>
              <div className="p-3 rounded-xl bg-surface-elevated border border-border flex items-center justify-between">
                <span className="text-slate-400">Space Complexity:</span>
                <span className="text-primary font-bold">{problem.spaceComplexity}</span>
              </div>
            </div>

            <div className="rounded-xl overflow-hidden border border-border bg-surface-muted/90">
              <pre className="p-4 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed">
                {problem.solutionMarkdown.replace(/```[a-z]*\n?/g, '').trim()}
              </pre>
            </div>
          </Card>
        )}
      </div>

      {/* Right Column: Code Editor & Submission (5 cols) */}
      <div className="lg:col-span-5 space-y-4">
        <Card className="p-0 bg-surface border-border flex flex-col h-[560px] overflow-hidden shadow-xl rounded-2xl">
          {/* Editor Header Bar with macOS Window Controls */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-surface-elevated/80 select-none">
            <div className="flex items-center gap-3">
              <div className="flex items-center space-x-1.5" aria-hidden="true">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56] border border-[#E0443E]/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] block" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E] border border-[#DEA123]/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] block" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F] border border-[#1AAB29]/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] block" />
              </div>
              <div className="h-3.5 w-px bg-border/80" />
              <div className="flex items-center gap-1.5">
                <div className="p-0.5 rounded bg-primary/10 text-primary">
                  <Code2 className="w-3 h-3" />
                </div>
                <span className="text-xs font-bold text-foreground font-mono">solution.ts</span>
                <span className="text-[9px] font-mono text-slate-400 uppercase px-1.5 py-0.5 rounded bg-surface border border-border">
                  TS 5.8
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCodeSnippet(defaultStarterCode)}
                className="text-[11px] text-slate-400 hover:text-foreground flex items-center gap-1 font-mono transition-colors"
                title="Reset to starter template"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            </div>
          </div>

          {/* Editor Body with Line Numbers */}
          <div className="flex-1 flex overflow-hidden bg-surface-muted/80">
            {/* Line numbers gutter */}
            <div
              className="py-3 px-2 text-right select-none font-mono text-xs text-slate-600 bg-surface-elevated/40 border-r border-border/60 min-w-[36px]"
              aria-hidden="true"
            >
              {lineNumbers.map((num) => (
                <div key={num} className="leading-5">
                  {num}
                </div>
              ))}
            </div>

            {/* Code text input */}
            <textarea
              value={codeSnippet}
              onChange={(e) => setCodeSnippet(e.target.value)}
              className="flex-1 w-full bg-transparent text-slate-200 font-mono text-xs p-3 resize-none border-0 focus:outline-none focus:ring-0 leading-5"
              spellCheck={false}
              aria-label="Code Editor"
            />
          </div>

          {/* Submission status feedback */}
          {solvedMessage && (
            <div className="mx-4 my-2 p-3 bg-emerald-950/30 border border-emerald-500/40 text-emerald-200 text-xs rounded-xl flex items-center gap-2.5 animate-in fade-in duration-200">
              <Award className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{solvedMessage}</span>
            </div>
          )}

          {/* Editor Footer Actions */}
          <div className="p-3 border-t border-border bg-surface-elevated/60 flex items-center justify-between">
            <span className="text-[11px] font-mono text-slate-500">
              Interactive client test mode
            </span>

            <Button
              variant="primary"
              size="sm"
              onClick={handleSubmitSolution}
              isLoading={isSubmitting}
              className="h-8 px-4"
            >
              <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
              Mark as Solved
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
