import React, { useState, useEffect } from 'react';
import {
  StepEngine,
  generateBinarySearchSteps,
  generateTwoPointersSteps,
  generateSlidingWindowSteps,
  type VisualizerStep,
  type StepEngineState,
} from '@akaytheory/visualizations';
import { Card, Button, Badge } from '../../components/ui';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Zap,
  Activity,
  Sliders,
  CheckCircle2,
  Gauge,
} from 'lucide-react';

export type AlgorithmType = 'binarySearch' | 'twoPointers' | 'slidingWindow';

export const VisualizerWidget: React.FC = () => {
  const [algo, setAlgo] = useState<AlgorithmType>('binarySearch');
  const [arrayInput, setArrayInput] = useState<string>('2, 5, 8, 12, 16, 23, 38, 56, 72, 91');
  const [targetInput, setTargetInput] = useState<number>(23);
  const [kInput, setKInput] = useState<number>(3);

  const [engine, setEngine] = useState<StepEngine | null>(null);
  const [currentStep, setCurrentStep] = useState<VisualizerStep | null>(null);
  const [engineState, setEngineState] = useState<StepEngineState | null>(null);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1000);

  // Initialize or re-generate steps whenever parameters change
  useEffect(() => {
    const rawArray = arrayInput
      .split(',')
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !isNaN(n));

    let steps: VisualizerStep[] = [];
    if (algo === 'binarySearch') {
      const sorted = [...rawArray].sort((a, b) => a - b);
      steps = generateBinarySearchSteps(sorted, targetInput);
    } else if (algo === 'twoPointers') {
      const sorted = [...rawArray].sort((a, b) => a - b);
      steps = generateTwoPointersSteps(sorted, targetInput);
    } else if (algo === 'slidingWindow') {
      steps = generateSlidingWindowSteps(rawArray, kInput);
    }

    const newEngine = new StepEngine(steps, playbackSpeed);
    const unsubscribe = newEngine.subscribe((step, state) => {
      setCurrentStep(step);
      setEngineState(state);
    });

    setEngine(newEngine);

    return () => {
      unsubscribe();
      newEngine.destroy();
    };
  }, [algo, arrayInput, targetInput, kInput]);

  const handleSpeedChange = (speedMs: number) => {
    setPlaybackSpeed(speedMs);
    if (engine) {
      engine.setSpeed(speedMs);
    }
  };

  const totalSteps = engineState ? engineState.totalSteps : 0;
  const currentStepIndex = engineState ? engineState.currentStepIndex : 0;
  const isPlaying = engineState?.playbackStatus === 'PLAYING';
  const isCompleted = engineState?.playbackStatus === 'COMPLETED';

  // Format pointer names to clean badges
  const getPointerBadge = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('left') || lower === 'l') {
      return { label: 'L', color: 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300' };
    }
    if (lower.includes('right') || lower === 'r') {
      return { label: 'R', color: 'bg-rose-500/20 border-rose-500/50 text-rose-300' };
    }
    if (lower.includes('mid') || lower === 'm') {
      return { label: 'MID', color: 'bg-amber-500/20 border-amber-500/50 text-amber-300' };
    }
    if (lower.includes('start') || lower === 'i') {
      return { label: name.toUpperCase(), color: 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300' };
    }
    return { label: name.toUpperCase(), color: 'bg-primary/20 border-primary/50 text-primary' };
  };

  return (
    <Card className="p-0 bg-surface/95 border-border shadow-2xl rounded-2xl overflow-hidden divide-y divide-border/70">
      {/* macOS Window Chrome Header */}
      <div className="px-4 py-3 bg-surface-muted/50 flex items-center justify-between border-b border-border/70 select-none">
        <div className="flex items-center space-x-2" aria-hidden="true">
          <span className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] block" />
          <span className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] block" />
          <span className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] block" />
        </div>
        <div className="text-[11px] font-mono text-slate-400 font-medium px-3 py-0.5 rounded-md bg-surface border border-border/60">
          StepEngine — {algo === 'binarySearch' ? 'BinarySearch.ts' : algo === 'twoPointers' ? 'TwoPointers.ts' : 'SlidingWindow.ts'}
        </div>
        <div className="hidden sm:flex items-center space-x-1.5 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>ARM64 JIT</span>
        </div>
      </div>

      <div className="p-5 sm:p-7 space-y-6">
        {/* Top Header & Algorithm Selector */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-border/80">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary">
                <Zap className="w-4 h-4" />
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-foreground">
                Algorithm Execution Canvas
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Visual invariant tracking with step-by-step memory pointer states and auxiliary watches.
            </p>
          </div>

          {/* Algorithm Tabs */}
          <div className="flex items-center gap-1.5 bg-surface-elevated p-1 rounded-xl border border-border self-start lg:self-auto shadow-sm">
            <button
              onClick={() => {
                setAlgo('binarySearch');
                setArrayInput('2, 5, 8, 12, 16, 23, 38, 56, 72, 91');
                setTargetInput(23);
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                algo === 'binarySearch'
                  ? 'bg-primary text-white shadow'
                  : 'text-slate-400 hover:text-foreground'
              }`}
            >
              Binary Search
            </button>
          <button
            onClick={() => {
              setAlgo('twoPointers');
              setArrayInput('1, 3, 4, 6, 8, 11, 15');
              setTargetInput(14);
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              algo === 'twoPointers'
                ? 'bg-primary text-white shadow'
                : 'text-slate-400 hover:text-foreground'
            }`}
          >
            Two Pointers
          </button>
          <button
            onClick={() => {
              setAlgo('slidingWindow');
              setArrayInput('2, 1, 5, 1, 3, 2');
              setKInput(3);
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              algo === 'slidingWindow'
                ? 'bg-primary text-white shadow'
                : 'text-slate-400 hover:text-foreground'
            }`}
          >
            Sliding Window
          </button>
        </div>
      </div>

      {/* Parameter Inputs Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-surface-muted/50 rounded-xl border border-border/60 text-xs">
        <div className="flex items-center gap-2">
          <Sliders className="w-3.5 h-3.5 text-primary" />
          <span className="font-semibold text-slate-300">Input Parameters:</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {algo === 'slidingWindow' ? (
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-mono">Window Size (k):</span>
              <input
                type="number"
                min={1}
                max={8}
                value={kInput}
                onChange={(e) => setKInput(Math.max(1, Number(e.target.value)))}
                className="w-16 bg-surface-elevated border border-border rounded-lg px-2 py-1 text-xs text-foreground font-mono text-center focus:outline-none focus:border-primary"
              />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-mono">Target Value:</span>
              <input
                type="number"
                value={targetInput}
                onChange={(e) => setTargetInput(Number(e.target.value))}
                className="w-16 bg-surface-elevated border border-border rounded-lg px-2 py-1 text-xs text-foreground font-mono text-center focus:outline-none focus:border-primary"
              />
            </div>
          )}

          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-mono hidden sm:inline">Array:</span>
            <input
              type="text"
              value={arrayInput}
              onChange={(e) => setArrayInput(e.target.value)}
              className="w-48 sm:w-64 bg-surface-elevated border border-border rounded-lg px-2.5 py-1 text-xs text-foreground font-mono focus:outline-none focus:border-primary"
              placeholder="comma-separated numbers"
            />
          </div>
        </div>
      </div>

      {/* Visual Canvas Area (Maximized Workspace) */}
      <div className="relative rounded-2xl bg-surface-elevated/40 border border-border p-6 sm:p-8 min-h-[300px] flex flex-col justify-between overflow-hidden shadow-inner">
        {/* Subtle grid backdrop */}
        <div
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--primary)) 1px, transparent 0)`,
            backgroundSize: '20px 20px',
          }}
        />

        {/* Step Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border/60">
          <div className="flex items-center gap-3">
            <Badge variant="primary" size="md">
              Step {currentStepIndex + 1} of {totalSteps}
            </Badge>
            <h3 className="text-sm sm:text-base font-bold text-foreground">
              {currentStep?.title || 'Execution Step'}
            </h3>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            {isCompleted ? (
              <span className="flex items-center gap-1 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Execution Finished
              </span>
            ) : isPlaying ? (
              <span className="flex items-center gap-1.5 text-primary">
                <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
                Playing
              </span>
            ) : (
              <span className="text-slate-500">Paused</span>
            )}
          </div>
        </div>

        {/* Dynamic Array Display Stage */}
        <div className="py-8 px-2 flex flex-col items-center justify-center overflow-x-auto">
          {/* Pointers Row */}
          <div className="flex items-end justify-center gap-3 min-h-[36px] mb-2">
            {currentStep?.elementsState.map((_, idx) => {
              const activePointers = Object.entries(currentStep.pointers || {})
                .filter(([_, ptrIdx]) => ptrIdx === idx)
                .map(([name]) => name);

              return (
                <div key={idx} className="w-14 sm:w-16 flex-shrink-0 flex flex-col items-center justify-end">
                  {activePointers.length > 0 && (
                    <div className="flex flex-col items-center animate-in fade-in slide-in-from-top-1 duration-200">
                      <div className="flex items-center gap-1">
                        {activePointers.map((pName) => {
                          const badge = getPointerBadge(pName);
                          return (
                            <span
                              key={pName}
                              className={`text-[10px] font-mono font-extrabold uppercase px-1.5 py-0.5 rounded-md border shadow-sm ${badge.color}`}
                            >
                              {badge.label}
                            </span>
                          );
                        })}
                      </div>
                      <span className="text-primary text-[10px] leading-none mt-0.5">▼</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Element Boxes Row */}
          <div className="flex items-center justify-center gap-3">
            {currentStep?.elementsState.map((el, idx) => {
              let boxStyle = 'bg-surface border-border text-foreground hover:border-border';

              if (el.status === 'ACTIVE') {
                boxStyle =
                  'bg-primary/20 border-primary text-white ring-2 ring-primary/50 shadow-lg shadow-primary/25 scale-105';
              } else if (el.status === 'MATCH') {
                boxStyle =
                  'bg-emerald-500/25 border-emerald-500 text-emerald-200 ring-2 ring-emerald-500/60 shadow-lg shadow-emerald-500/30 scale-110';
              } else if (el.status === 'DISCARDED') {
                boxStyle =
                  'bg-surface-muted/30 border-border/40 text-slate-600 line-through opacity-40 scale-95';
              } else if (el.status === 'MODIFIED') {
                boxStyle =
                  'bg-amber-500/20 border-amber-500 text-amber-300 ring-2 ring-amber-500/50 scale-105';
              }

              return (
                <div key={idx} className="flex flex-col items-center gap-1.5 flex-shrink-0">
                  <div
                    className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border flex items-center justify-center text-lg sm:text-xl font-bold font-mono transition-all duration-300 shadow-md ${boxStyle}`}
                  >
                    {el.value}
                  </div>
                  <span className="text-[11px] font-mono text-slate-500">[{idx}]</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Explanation Callout */}
        <div className="pt-4 border-t border-border/60">
          <div className="p-4 rounded-xl bg-surface/80 border border-border/80 text-xs sm:text-sm text-slate-300 leading-relaxed flex items-start gap-3">
            <Activity className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-foreground mr-1.5">Invariant State:</span>
              <span>{currentStep?.explanation}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Auxiliary Variables & Scrubber Timeline */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Left: Auxiliary Watch (6 cols) */}
        <div className="md:col-span-6 bg-surface-elevated/40 p-4 rounded-xl border border-border/80 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-bold uppercase tracking-wider text-[10px]">
              Auxiliary Variables Watch
            </span>
            <span className="font-mono text-[10px] text-slate-500">O(1) memory</span>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {Object.entries(currentStep?.auxiliaryVariables || {}).length === 0 ? (
              <span className="text-xs text-slate-500 italic">No extra variables in this step</span>
            ) : (
              Object.entries(currentStep?.auxiliaryVariables || {}).map(([key, val]) => (
                <div
                  key={key}
                  className="bg-surface px-3 py-1.5 rounded-lg border border-border/80 flex items-center gap-2 shadow-sm"
                >
                  <span className="text-[11px] text-slate-400 font-mono">{key}:</span>
                  <span className="text-xs font-bold font-mono text-primary">{String(val)}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Step Scrubber Timeline (6 cols) */}
        <div className="md:col-span-6 bg-surface-elevated/40 p-4 rounded-xl border border-border/80 flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-bold uppercase tracking-wider text-[10px]">
              Timeline Scrubber
            </span>
            <span className="font-mono text-[10px] text-slate-400">
              {currentStepIndex + 1} / {totalSteps}
            </span>
          </div>

          <div className="space-y-1.5 pt-1">
            <input
              type="range"
              min={0}
              max={Math.max(0, totalSteps - 1)}
              value={currentStepIndex}
              onChange={(e) => engine?.jumpTo(Number(e.target.value))}
              aria-label="Algorithm Step Timeline"
              className="w-full accent-primary h-2 bg-surface rounded-lg appearance-none cursor-pointer border border-border"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>Start</span>
              <span>Step {currentStepIndex + 1}</span>
              <span>Finish</span>
            </div>
          </div>
        </div>
      </div>

      {/* Refined Playback Controls Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border/80">
        {/* Playback Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => engine?.reset()}
            title="Reset to beginning"
            className="h-9 px-3"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" />
            Reset
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => engine?.stepPrev()}
            disabled={currentStepIndex === 0}
            title="Previous Step"
            className="h-9 px-3"
          >
            <SkipBack className="w-3.5 h-3.5 mr-1" />
            Back
          </Button>

          <Button
            variant={isPlaying ? 'secondary' : 'primary'}
            size="sm"
            onClick={() => {
              if (isPlaying) {
                engine?.pause();
              } else {
                engine?.play();
              }
            }}
            className="h-9 px-4 min-w-[90px]"
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 mr-1.5 fill-current" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-1.5 fill-current" />
                Play
              </>
            )}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => engine?.stepNext()}
            disabled={currentStepIndex === totalSteps - 1}
            title="Next Step"
            className="h-9 px-3"
          >
            Next
            <SkipForward className="w-3.5 h-3.5 ml-1" />
          </Button>
        </div>

        {/* Speed Selector */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
            <Gauge className="w-3.5 h-3.5 text-primary" />
            Speed:
          </span>
          <div className="flex items-center bg-surface-elevated p-1 rounded-lg border border-border">
            {[
              { label: '0.5x', speed: 1500 },
              { label: '1.0x', speed: 1000 },
              { label: '1.5x', speed: 600 },
              { label: '2.0x', speed: 300 },
            ].map(({ label, speed }) => (
              <button
                key={label}
                onClick={() => handleSpeedChange(speed)}
                className={`px-2.5 py-1 text-xs font-mono font-medium rounded-md transition-all ${
                  playbackSpeed === speed
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-slate-400 hover:text-foreground'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
      </div>
    </Card>
  );
};
