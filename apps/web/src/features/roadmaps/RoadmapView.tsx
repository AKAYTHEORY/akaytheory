import React, { useState, useEffect } from 'react';
import { Card, Button, Skeleton } from '../../components/ui';
import { apiClient } from '../../lib/api';
import { RoadmapCanvas, type RoadmapEdgeItem } from './RoadmapCanvas';
import { RoadmapListView, type RoadmapNodeItem } from './RoadmapListView';
import { Network, ListOrdered, Compass, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

export interface RoadmapData {
  id: string;
  slug: string;
  title: string;
  description: string;
  nodes: RoadmapNodeItem[];
  edges: RoadmapEdgeItem[];
}

export interface RoadmapViewProps {
  initialSlug?: string;
  onNavigateLesson?: (slug: string) => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({
  initialSlug = 'dsa-fundamentals',
  onNavigateLesson,
}) => {
  const [currentSlug] = useState<string>(initialSlug);
  const [viewMode, setViewMode] = useState<'canvas' | 'list'>('canvas');
  const [roadmap, setRoadmap] = useState<RoadmapData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchRoadmap() {
      setIsLoading(true);
      setError(null);
      const res = await apiClient.get<RoadmapData>(`/roadmaps/${currentSlug}`);
      if (!isMounted) return;
      setIsLoading(false);
      if (res.data) {
        setRoadmap(res.data);
      } else {
        setError(res.error?.detail || 'Failed to load roadmap.');
      }
    }
    fetchRoadmap();
    return () => {
      isMounted = false;
    };
  }, [currentSlug]);

  const handleSelectNode = (node: RoadmapNodeItem) => {
    if (node.topic && onNavigateLesson) {
      // In seed, binary-search topic has lesson 'binary-search-foundations'
      const lessonSlug = `${node.topic.slug}-foundations`;
      onNavigateLesson(lessonSlug);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto py-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
          <div className="space-y-2">
            <Skeleton className="h-8 w-64 rounded-lg" />
            <Skeleton className="h-4 w-96 rounded-md" />
          </div>
          <Skeleton className="h-10 w-48 rounded-xl" />
        </div>
        <Skeleton className="h-[480px] w-full rounded-2xl" />
      </div>
    );
  }

  if (error || !roadmap) {
    return (
      <Card className="p-8 text-center max-w-md mx-auto my-12 bg-surface border-border">
        <AlertCircle className="w-10 h-10 text-rose-400 mx-auto mb-3" />
        <h3 className="text-base font-bold text-foreground">Roadmap Unavailable</h3>
        <p className="text-xs text-slate-400 mt-1 mb-4">{error || 'Could not retrieve roadmap data.'}</p>
        <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
          Retry Loading
        </Button>
      </Card>
    );
  }

  // Calculate completion statistics
  const totalNodes = roadmap.nodes.length;
  const completedCount = roadmap.nodes.filter((n) => n.state === 'COMPLETED').length;
  const inProgressCount = roadmap.nodes.filter((n) => n.state === 'IN_PROGRESS').length;
  const progressPercent = totalNodes > 0 ? Math.round((completedCount / totalNodes) * 100) : 0;
  const totalMinutes = roadmap.nodes.reduce(
    (acc, n) => acc + (n.topic?.estimatedMinutes || 0),
    0
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-6">
      {/* Roadmap Header & Progress Strip */}
      <div className="space-y-4 pb-6 border-b border-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary">
                <Compass className="w-5 h-5" />
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                {roadmap.title}
              </h1>
            </div>
            <p className="text-sm text-slate-400 max-w-2xl">{roadmap.description}</p>
          </div>

          {/* View Toggle Tabs */}
          <div className="flex items-center bg-surface-elevated p-1 rounded-xl border border-border self-start sm:self-auto shadow-sm">
            <button
              onClick={() => setViewMode('canvas')}
              aria-label="Visual Graph"
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                viewMode === 'canvas'
                  ? 'bg-primary text-white shadow-md'
                  : 'text-slate-400 hover:text-foreground'
              }`}
            >
              <Network className="w-3.5 h-3.5" />
              Visual Graph
            </button>
            <button
              onClick={() => setViewMode('list')}
              aria-label="Accessible List (WCAG)"
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                viewMode === 'list'
                  ? 'bg-primary text-white shadow-md'
                  : 'text-slate-400 hover:text-foreground'
              }`}
            >
              <ListOrdered className="w-3.5 h-3.5" />
              Accessible List (WCAG)
            </button>
          </div>
        </div>

        {/* Progress & Milestone Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3 rounded-xl bg-surface/60 border border-border/80 flex items-center justify-between">
            <div className="text-xs text-slate-400">Total Milestones</div>
            <div className="text-sm font-bold font-mono text-foreground">{totalNodes}</div>
          </div>
          <div className="p-3 rounded-xl bg-surface/60 border border-border/80 flex items-center justify-between">
            <div className="text-xs text-slate-400">Curriculum Progress</div>
            <div className="flex items-center gap-1.5 text-sm font-bold font-mono text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {progressPercent}%
            </div>
          </div>
          <div className="p-3 rounded-xl bg-surface/60 border border-border/80 flex items-center justify-between">
            <div className="text-xs text-slate-400">In Flight</div>
            <div className="text-sm font-bold font-mono text-primary">{inProgressCount} active</div>
          </div>
          <div className="p-3 rounded-xl bg-surface/60 border border-border/80 flex items-center justify-between">
            <div className="text-xs text-slate-400">Est. Total Time</div>
            <div className="flex items-center gap-1 text-sm font-bold font-mono text-slate-300">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              {totalMinutes} mins
            </div>
          </div>
        </div>
      </div>

      {/* Render Selected View */}
      {viewMode === 'canvas' ? (
        <RoadmapCanvas
          nodes={roadmap.nodes}
          edges={roadmap.edges}
          onSelectNode={handleSelectNode}
        />
      ) : (
        <RoadmapListView nodes={roadmap.nodes} onSelectNode={handleSelectNode} />
      )}
    </div>
  );
};
