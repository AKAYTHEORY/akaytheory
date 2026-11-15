import React, { useState, useEffect } from 'react';
import { Card, Badge, Button, Skeleton } from '../../components/ui';
import { apiClient } from '../../lib/api';
import { Code, ChevronRight, Filter, Search, Clock, HardDrive, Sparkles } from 'lucide-react';
import type { ProblemData } from './ProblemWorkspace';

export interface ProblemListViewProps {
  onSelectProblem: (problem: ProblemData) => void;
}

export const ProblemListView: React.FC<ProblemListViewProps> = ({ onSelectProblem }) => {
  const [problems, setProblems] = useState<ProblemData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterDifficulty, setFilterDifficulty] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    let isMounted = true;
    async function loadProblems() {
      setIsLoading(true);
      const url =
        filterDifficulty === 'ALL'
          ? '/curriculum/problems'
          : `/curriculum/problems?difficulty=${filterDifficulty}`;
      const res = await apiClient.get<ProblemData[]>(url);
      if (!isMounted) return;
      setIsLoading(false);
      if (res.data) {
        setProblems(res.data);
      }
    }
    loadProblems();
    return () => {
      isMounted = false;
    };
  }, [filterDifficulty]);

  const filteredProblems = problems.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.topic?.title && p.topic.title.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const easyCount = problems.filter((p) => p.difficulty === 'EASY').length;
  const mediumCount = problems.filter((p) => p.difficulty === 'MEDIUM').length;
  const hardCount = problems.filter((p) => p.difficulty === 'HARD').length;

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-6">
      {/* Top Header & Search/Filter Controls */}
      <div className="space-y-4 pb-6 border-b border-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary">
                <Code className="w-5 h-5" />
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
                Curated Problem Catalog
              </h2>
            </div>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Curated engineering problems with progressive hint disclosure (BR-009) and reference solutions.
            </p>
          </div>

          {/* Quick Problem Distribution Counts */}
          <div className="flex items-center gap-2 text-xs font-mono self-start sm:self-auto">
            <span className="px-2.5 py-1 rounded-lg bg-surface-elevated border border-border text-slate-300">
              {problems.length} Total
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              {easyCount} Easy
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
              {mediumCount} Med
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400">
              {hardCount} Hard
            </span>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          {/* Search box */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search problem title or topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-elevated border border-border rounded-xl pl-9 pr-4 py-2 text-xs text-foreground placeholder-slate-500 focus:outline-none focus:border-primary shadow-sm"
            />
          </div>

          {/* Difficulty segmented pills */}
          <div className="flex items-center bg-surface-elevated border border-border rounded-xl p-1 text-xs self-start sm:self-auto">
            <Filter className="w-3.5 h-3.5 text-slate-400 ml-2 mr-1.5" />
            {(['ALL', 'EASY', 'MEDIUM', 'HARD'] as const).map((diff) => (
              <button
                key={diff}
                onClick={() => setFilterDifficulty(diff)}
                className={`px-3 py-1 font-semibold rounded-lg transition-all ${
                  filterDifficulty === diff
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-slate-400 hover:text-foreground'
                }`}
              >
                {diff === 'ALL' ? 'All' : diff.charAt(0) + diff.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Problems List */}
      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-20 w-full rounded-2xl" />
          <Skeleton className="h-20 w-full rounded-2xl" />
          <Skeleton className="h-20 w-full rounded-2xl" />
        </div>
      ) : filteredProblems.length === 0 ? (
        <Card className="p-10 text-center bg-surface border-border">
          <Sparkles className="w-8 h-8 text-slate-500 mx-auto mb-2" />
          <h3 className="text-base font-bold text-foreground">No Matching Problems</h3>
          <p className="text-xs text-slate-400 mt-1">Try adjusting your difficulty filter or search terms.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredProblems.map((problem) => (
            <Card
              key={problem.id}
              className="p-5 bg-surface/80 hover:bg-surface-elevated border-border hover:border-primary/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm group"
            >
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                    {problem.title}
                  </h3>
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
                    Topic: <span className="text-slate-300 font-medium">{problem.topic.title}</span>
                  </p>
                )}
              </div>

              <div className="flex items-center gap-4 self-end sm:self-auto">
                <div className="text-right text-xs font-mono text-slate-400 hidden sm:flex items-center gap-3">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    {problem.timeComplexity}
                  </span>
                  <span className="flex items-center gap-1 text-primary">
                    <HardDrive className="w-3.5 h-3.5 text-slate-500" />
                    {problem.spaceComplexity}
                  </span>
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onSelectProblem(problem)}
                  className="h-9 px-4 min-w-[90px]"
                >
                  Solve
                  <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
