import React, { useMemo } from 'react';
import { Badge, Button } from '../../components/ui';
import { Lock, CheckCircle2, Play, BookOpen, Sparkles, Clock } from 'lucide-react';
import type { RoadmapNodeItem } from './RoadmapListView';

export interface RoadmapEdgeItem {
  id: string;
  source: string;
  target: string;
  edgeType: string;
}

export interface RoadmapCanvasProps {
  nodes: RoadmapNodeItem[];
  edges: RoadmapEdgeItem[];
  onSelectNode: (node: RoadmapNodeItem) => void;
}

const NODE_WIDTH = 270;
const NODE_HEIGHT = 120;

export const RoadmapCanvas: React.FC<RoadmapCanvasProps> = ({
  nodes,
  edges,
  onSelectNode,
}) => {
  // Calculate bounding box so SVG canvas and scroll area size dynamically
  const { canvasWidth, canvasHeight } = useMemo(() => {
    if (nodes.length === 0) {
      return { canvasWidth: 600, canvasHeight: 500 };
    }
    let maxX = -Infinity;
    let maxY = -Infinity;

    nodes.forEach((n) => {
      if (n.positionX > maxX) maxX = n.positionX;
      if (n.positionY > maxY) maxY = n.positionY;
    });

    const paddingX = 140;
    const paddingY = 100;
    const canvasWidth = Math.max(700, maxX + NODE_WIDTH + paddingX);
    const canvasHeight = Math.max(520, maxY + NODE_HEIGHT + paddingY);

    return { canvasWidth, canvasHeight };
  }, [nodes]);

  return (
    <div className="relative w-full rounded-2xl border border-border bg-surface/80 backdrop-blur-md overflow-hidden shadow-2xl">
      {/* Canvas Top Bar / Legend */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 border-b border-border/80 bg-surface-muted/60 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="font-semibold text-foreground tracking-tight">Interactive Dependency Topology</span>
          <span className="text-slate-500 hidden sm:inline">({nodes.length} milestones)</span>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[11px] font-medium text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 shadow-sm shadow-emerald-500/50" />
            <span>Mastered</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-primary shadow-sm shadow-primary/50" />
            <span>In Progress</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-400/80" />
            <span>Ready</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-600" />
            <span>Locked</span>
          </div>
        </div>
      </div>

      {/* Scrollable Viewport */}
      <div className="relative w-full overflow-x-auto overflow-y-hidden min-h-[520px] p-8 flex items-center justify-center">
        {/* Subtle Blueprint Grid Pattern */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--primary)) 1px, transparent 0)`,
            backgroundSize: '24px 24px',
          }}
        />

        {/* Inner Canvas */}
        <div
          className="relative"
          style={{ width: canvasWidth, height: canvasHeight }}
        >
          {/* SVG Canvas for Smooth Bézier Edges */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ width: canvasWidth, height: canvasHeight }}
          >
            <defs>
              <linearGradient id="edgeGradActive" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.8" />
              </linearGradient>
              <linearGradient id="edgeGradDefault" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#6366f1" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#475569" stopOpacity="0.3" />
              </linearGradient>
              <marker
                id="arrowheadActive"
                markerWidth="8"
                markerHeight="6"
                refX="7"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 8 3, 0 6" fill="#8b5cf6" />
              </marker>
              <marker
                id="arrowheadDefault"
                markerWidth="8"
                markerHeight="6"
                refX="7"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 8 3, 0 6" fill="#64748b" />
              </marker>
            </defs>

            {edges.map((edge) => {
              const sourceNode = nodes.find((n) => n.id === edge.source);
              const targetNode = nodes.find((n) => n.id === edge.target);
              if (!sourceNode || !targetNode) return null;

              // Compute source and target connection anchor points
              const x1 = sourceNode.positionX + NODE_WIDTH / 2;
              const y1 = sourceNode.positionY + NODE_HEIGHT;
              const x2 = targetNode.positionX + NODE_WIDTH / 2;
              const y2 = targetNode.positionY;

              const isSourceCompleted = sourceNode.state === 'COMPLETED';
              const isTargetAccessible = targetNode.state !== 'LOCKED';

              // Smooth Bézier curve
              const deltaY = Math.max(40, (y2 - y1) / 2);
              const pathD = `M ${x1} ${y1} C ${x1} ${y1 + deltaY}, ${x2} ${y2 - deltaY}, ${x2} ${y2}`;

              return (
                <g key={edge.id}>
                  {/* Subtle edge glow */}
                  {isSourceCompleted && (
                    <path
                      d={pathD}
                      fill="none"
                      stroke="#8b5cf6"
                      strokeWidth="6"
                      strokeOpacity="0.15"
                      strokeLinecap="round"
                    />
                  )}
                  {/* Main connection line */}
                  <path
                    d={pathD}
                    fill="none"
                    stroke={isSourceCompleted ? 'url(#edgeGradActive)' : 'url(#edgeGradDefault)'}
                    strokeWidth="2.5"
                    strokeDasharray={edge.edgeType === 'RECOMMENDED' ? '5,5' : undefined}
                    markerEnd={isTargetAccessible ? 'url(#arrowheadActive)' : 'url(#arrowheadDefault)'}
                    className="transition-all duration-300"
                  />
                </g>
              );
            })}
          </svg>

          {/* Node Cards */}
          {nodes.map((node) => {
            const isLocked = node.state === 'LOCKED';
            const isCompleted = node.state === 'COMPLETED';
            const isInProgress = node.state === 'IN_PROGRESS';

            let containerStyle = 'bg-surface-elevated/95 border-border hover:border-primary/50 text-foreground';
            if (isCompleted) {
              containerStyle = 'bg-emerald-950/20 border-emerald-500/40 hover:border-emerald-500/70 shadow-lg shadow-emerald-950/20';
            } else if (isInProgress) {
              containerStyle = 'bg-primary/10 border-primary/60 hover:border-primary shadow-lg shadow-primary/20 ring-1 ring-primary/40';
            } else if (isLocked) {
              containerStyle = 'bg-surface-muted/60 border-border/50 opacity-60';
            }

            return (
              <div
                key={node.id}
                style={{
                  position: 'absolute',
                  left: `${node.positionX}px`,
                  top: `${node.positionY}px`,
                  width: `${NODE_WIDTH}px`,
                  minHeight: `${NODE_HEIGHT}px`,
                }}
                className="z-10 transition-transform duration-200 hover:-translate-y-1 select-none"
              >
                <div
                  className={`p-4 rounded-xl border backdrop-blur-md flex flex-col justify-between transition-all ${containerStyle}`}
                >
                  {/* Card Header: Step & Badge */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-slate-400">
                      Step {node.orderIndex}
                    </span>
                    {isCompleted && (
                      <Badge variant="success" size="sm">
                        <CheckCircle2 className="w-3 h-3 mr-1 inline" />
                        Mastered
                      </Badge>
                    )}
                    {isInProgress && (
                      <Badge variant="primary" size="sm">
                        <Sparkles className="w-3 h-3 mr-1 inline" />
                        In Progress
                      </Badge>
                    )}
                    {node.state === 'AVAILABLE' && (
                      <Badge variant="indigo" size="sm">
                        Ready
                      </Badge>
                    )}
                    {isLocked && (
                      <Badge variant="neutral" size="sm">
                        <Lock className="w-3 h-3 mr-1 inline text-slate-400" />
                        Locked
                      </Badge>
                    )}
                  </div>

                  {/* Node Title & Metadata */}
                  <div>
                    <h4 className="text-sm font-bold text-foreground line-clamp-1">
                      {node.title}
                    </h4>
                    {node.topic && (
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <span>{node.topic.estimatedMinutes} mins est.</span>
                      </div>
                    )}
                  </div>

                  {/* Card Action Footer */}
                  <div className="mt-3 pt-2.5 border-t border-border/60 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 font-medium">
                      {isLocked ? 'Prereq pending' : isCompleted ? 'Mastered' : 'Core Path'}
                    </span>
                    <Button
                      variant={isLocked ? 'outline' : isCompleted ? 'secondary' : 'primary'}
                      size="sm"
                      disabled={isLocked}
                      onClick={() => onSelectNode(node)}
                      className="text-xs h-7 min-h-[28px] px-2.5 py-0"
                    >
                      {isCompleted ? (
                        'Review'
                      ) : isLocked ? (
                        <Lock className="w-3 h-3" />
                      ) : isInProgress ? (
                        <>
                          <Play className="w-3 h-3 mr-1 fill-current" />
                          Resume
                        </>
                      ) : (
                        <>
                          <BookOpen className="w-3 h-3 mr-1" />
                          Start
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
