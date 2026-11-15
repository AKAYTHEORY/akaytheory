import type { PlaybackStatus, StepEngineState, VisualizerStep } from './types';

export type StepChangeListener = (step: VisualizerStep, engineState: StepEngineState) => void;

export class StepEngine {
  private steps: VisualizerStep[];
  private currentStepIndex: number;
  private playbackStatus: PlaybackStatus;
  private playbackSpeedMs: number;
  private timer: ReturnType<typeof setInterval> | null = null;
  private listeners: Set<StepChangeListener> = new Set();

  constructor(steps: VisualizerStep[], initialSpeedMs = 1000) {
    if (!steps || steps.length === 0) {
      throw new Error('StepEngine requires at least one visualizer step');
    }
    this.steps = steps;
    this.currentStepIndex = 0;
    this.playbackStatus = 'IDLE';
    this.playbackSpeedMs = initialSpeedMs;
  }

  public getStepsCount(): number {
    return this.steps.length;
  }

  public getCurrentStep(): VisualizerStep {
    const step = this.steps[this.currentStepIndex];
    if (!step) {
      throw new Error(`Invalid step index: ${this.currentStepIndex}`);
    }
    return step;
  }

  public getState(): StepEngineState {
    return {
      totalSteps: this.steps.length,
      currentStepIndex: this.currentStepIndex,
      playbackStatus: this.playbackStatus,
      playbackSpeedMs: this.playbackSpeedMs,
    };
  }

  public subscribe(listener: StepChangeListener): () => void {
    this.listeners.add(listener);
    listener(this.getCurrentStep(), this.getState());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    const currentStep = this.getCurrentStep();
    const state = this.getState();
    this.listeners.forEach((listener) => listener(currentStep, state));
  }

  public stepNext(): boolean {
    if (this.currentStepIndex < this.steps.length - 1) {
      this.currentStepIndex += 1;
      if (this.currentStepIndex === this.steps.length - 1) {
        this.pause();
        this.playbackStatus = 'COMPLETED';
      }
      this.notify();
      return true;
    }
    this.pause();
    this.playbackStatus = 'COMPLETED';
    this.notify();
    return false;
  }

  public stepPrev(): boolean {
    if (this.currentStepIndex > 0) {
      this.currentStepIndex -= 1;
      this.playbackStatus = 'PAUSED';
      this.notify();
      return true;
    }
    return false;
  }

  public jumpTo(index: number): void {
    if (index >= 0 && index < this.steps.length) {
      this.currentStepIndex = index;
      this.playbackStatus = index === this.steps.length - 1 ? 'COMPLETED' : 'PAUSED';
      this.notify();
    }
  }

  public reset(): void {
    this.pause();
    this.currentStepIndex = 0;
    this.playbackStatus = 'IDLE';
    this.notify();
  }

  public play(): void {
    if (this.playbackStatus === 'PLAYING') return;

    if (this.currentStepIndex === this.steps.length - 1) {
      this.currentStepIndex = 0;
    }

    this.playbackStatus = 'PLAYING';
    this.notify();

    if (this.timer) {
      clearInterval(this.timer);
    }

    this.timer = setInterval(() => {
      const advanced = this.stepNext();
      if (!advanced) {
        this.pause();
      }
    }, this.playbackSpeedMs);
  }

  public pause(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    if (this.playbackStatus === 'PLAYING') {
      this.playbackStatus = 'PAUSED';
      this.notify();
    }
  }

  public setSpeed(speedMs: number): void {
    this.playbackSpeedMs = Math.max(100, Math.min(5000, speedMs));
    if (this.playbackStatus === 'PLAYING') {
      this.pause();
      this.play();
    } else {
      this.notify();
    }
  }

  public destroy(): void {
    this.pause();
    this.listeners.clear();
  }
}

