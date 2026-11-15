import { useState } from 'react';
import { ListFilter, Sparkles, Code2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../components/ui/Button';

export interface WorkspaceLayoutProps {
  topicTitle: string;
  categoryTitle: string;
  tableOfContents: React.ReactNode;
  lessonContent: React.ReactNode;
  visualizerOrPractice: React.ReactNode;
  onBackToCurriculum?: () => void;
}

export function WorkspaceLayout({
  topicTitle,
  categoryTitle,
  tableOfContents,
  lessonContent,
  visualizerOrPractice,
  onBackToCurriculum,
}: WorkspaceLayoutProps) {
  const [activeRightTab, setActiveRightTab] = useState<'visualizer' | 'practice'>('visualizer');
  const [leftSidebarCollapsed, setLeftSidebarCollapsed] = useState(false);

  return (
    <div className="h-screen overflow-hidden bg-background text-foreground flex flex-col antialiased">
      {/* Workspace Header (Sticky, clean z-30, Linear/Raycast styling) */}
      <header className="h-14 shrink-0 border-b border-border bg-surface/85 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between z-30 sticky top-0">
        <div className="flex items-center space-x-3 truncate pr-4">
          {onBackToCurriculum && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBackToCurriculum}
              className="p-1.5 h-8 w-8 rounded-lg shrink-0"
              aria-label="Back to curriculum"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
          )}
          <div className="truncate">
            <span className="text-[10px] font-mono text-primary uppercase tracking-wider font-semibold block leading-tight">
              {categoryTitle}
            </span>
            <h2 className="text-sm font-bold tracking-tight text-white truncate leading-tight">
              {topicTitle}
            </h2>
          </div>
        </div>

        {/* Right Tab Toggle (Visualizer vs Practice) */}
        <div className="flex items-center bg-surface-elevated/70 p-1 rounded-lg border border-border shrink-0">
          <button
            onClick={() => setActiveRightTab('visualizer')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all ${
              activeRightTab === 'visualizer'
                ? 'bg-primary text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Visualization</span>
          </button>
          <button
            onClick={() => setActiveRightTab('practice')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all ${
              activeRightTab === 'practice'
                ? 'bg-primary text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Practice</span>
          </button>
        </div>
      </header>

      {/* 3-Column Body */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Left Column: Table of Contents */}
        <aside
          className={`border-r border-border bg-surface transition-all duration-200 overflow-y-auto hidden md:flex flex-col shrink-0 ${
            leftSidebarCollapsed ? 'w-12' : 'w-64'
          }`}
        >
          <div className="p-3.5 flex items-center justify-between border-b border-border/60 shrink-0">
            {!leftSidebarCollapsed && (
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-2">
                <ListFilter className="w-3.5 h-3.5 text-primary" />
                <span>Contents</span>
              </span>
            )}
            <button
              onClick={() => setLeftSidebarCollapsed(!leftSidebarCollapsed)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-surface-elevated transition"
              aria-label={leftSidebarCollapsed ? 'Expand contents' : 'Collapse contents'}
            >
              {leftSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {!leftSidebarCollapsed && <div className="p-4 flex-1">{tableOfContents}</div>}
        </aside>

        {/* Center Column: Lesson Prose */}
        <main className="flex-1 overflow-y-auto p-6 md:p-10 max-w-3xl mx-auto space-y-8 min-w-0">
          {lessonContent}
        </main>

        {/* Right Column: Visualizer or Code Workspace */}
        <section className="w-full lg:w-[480px] xl:w-[540px] border-l border-border bg-surface flex flex-col overflow-y-auto hidden lg:flex shrink-0">
          <div className="p-6 flex-1">{visualizerOrPractice}</div>
        </section>
      </div>
    </div>
  );
}
