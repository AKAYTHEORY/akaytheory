import React from 'react';
import { Card, Badge, Button } from '../../components/ui';
import { Lock, CheckCircle2, Play, BookOpen, Clock, ChevronRight, Layers } from 'lucide-react';

export type ComputedNodeState = 'LOCKED' | 'AVAILABLE' | 'IN_PROGRESS' | 'COMPLETED';

export interface RoadmapNodeItem {
  id: string;
  topicId: string | null;
  nodeType: string;
  title: string;
  positionX: number;
  positionY: number;
  orderIndex: number;
  state: ComputedNodeState;
  topic: {
    id: string;
    slug: string;
    title: string;
    estimatedMinutes: number;
  } | null;
}

export interface RoadmapListViewProps {
  nodes: RoadmapNodeItem[];
  onSelectNode: (node: RoadmapNodeItem) => void;
}

export const RoadmapListView: React.FC<RoadmapListViewProps> = ({ nodes, onSelectNode }) => {
  return (
    <div className="space-y-6">
      {/* Informative Subheader */}
      <div className="flex items-center justify-between text-xs text-slate-400 bg-surface-muted/40 p-3 rounded-xl border border-border/60">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-primary" />
          <span>Accessible hierarchical learning sequence conforming to WCAG 2.2 AA (FR-ROADMAP-014).</span>
        </div>
        <span className="font-mono text-[11px] text-slate-500">{nodes.length} sequential milestones</span>
      </div>

      {/* Sequential Timeline List */}
      <ol className="relative space-y-4 list-none p-0 m-0" aria-label="Curriculum Milestones">
        {/* Continuous background vertical connecting spine */}
        <div
          className="absolute left-[27px] top-4 bottom-4 w-0.5 bg-border -z-0 hidden sm:block"
          aria-hidden="true"
        />

        {nodes.map((node, index) => {
          const isLocked = node.state === 'LOCKED';
          const isCompleted = node.state === 'COMPLETED';
          const isInProgress = node.state === 'IN_PROGRESS';

          // Timeline node indicator styling
          let indicatorStyle = 'bg-surface-elevated border-border text-slate-400';
          if (isCompleted) {
            indicatorStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-md shadow-emerald-500/20';
          } else if (isInProgress) {
            indicatorStyle = 'bg-primary/20 border-primary text-primary shadow-md shadow-primary/20 ring-2 ring-primary/40';
          } else if (node.state === 'AVAILABLE') {
            indicatorStyle = 'bg-indigo-500/10 border-indigo-400 text-indigo-400';
          }

          return (
            <li key={node.id} className="relative z-10">
              <Card
                className={`transition-all duration-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isLocked
                    ? 'bg-surface-muted/40 border-border/50 opacity-60'
                    : 'bg-surface/90 hover:bg-surface-elevated/90 border-border hover:border-primary/40 shadow-sm'
                }`}
              >
                {/* Left side: Timeline Icon + Topic Info */}
                <div className="flex items-start sm:items-center gap-4">
                  {/* Step Sequence Circle */}
                  <div
                    className={`w-9 h-9 rounded-full border flex-shrink-0 flex items-center justify-center font-mono text-xs font-bold transition-colors ${indicatorStyle}`}
                    aria-hidden="true"
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : isLocked ? (
                      <Lock className="w-3.5 h-3.5 text-slate-500" />
                    ) : (
                      String(index + 1).padStart(2, '0')
                    )}
                  </div>

                  {/* Title & Metadata */}
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-sm sm:text-base font-bold text-foreground">
                        {node.title}
                      </h4>
                      {isCompleted && (
                        <Badge variant="success" size="sm">
                          <CheckCircle2 className="w-3 h-3 mr-1 inline" />
                          Mastered
                        </Badge>
                      )}
                      {isInProgress && (
                        <Badge variant="primary" size="sm">
                          In Progress
                        </Badge>
                      )}
                      {node.state === 'AVAILABLE' && (
                        <Badge variant="indigo" size="sm">
                          Ready to Start
                        </Badge>
                      )}
                      {isLocked && (
                        <Badge variant="neutral" size="sm">
                          <Lock className="w-3 h-3 mr-1 inline text-slate-400" />
                          Locked
                        </Badge>
                      )}
                    </div>

                    {node.topic && (
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                        <span className="flex items-center gap-1 font-mono">
                          <Clock className="w-3.5 h-3.5 text-slate-500" />
                          {node.topic.estimatedMinutes} mins
                        </span>
                        <span>•</span>
                        <span className="text-slate-300">Topic: {node.topic.title}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right side: Action Button */}
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <Button
                    variant={isLocked ? 'outline' : isCompleted ? 'secondary' : 'primary'}
                    size="sm"
                    disabled={isLocked}
                    onClick={() => onSelectNode(node)}
                    aria-label={`${
                      isCompleted ? 'Review' : isInProgress ? 'Continue' : isLocked ? 'Locked' : 'Start'
                    } ${node.title}`}
                    className="min-w-[110px]"
                  >
                    {isCompleted ? (
                      'Review'
                    ) : isInProgress ? (
                      <>
                        <Play className="w-3.5 h-3.5 mr-1.5 fill-current" />
                        Resume
                      </>
                    ) : isLocked ? (
                      <>
                        <Lock className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
                        Locked
                      </>
                    ) : (
                      <>
                        <BookOpen className="w-3.5 h-3.5 mr-1.5" />
                        Start
                        <ChevronRight className="w-3.5 h-3.5 ml-1 text-slate-400" />
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            </li>
          );
        })}
      </ol>
    </div>
  );
};
