export type PlaybackStatus = 'IDLE' | 'PLAYING' | 'PAUSED' | 'COMPLETED';

export interface VisualizerStep {
  stepIndex: number;
  title: string;
  explanation: string;
  activeLine?: number;
  highlightedIndices: number[];
  pointers: Record<string, number>;
  auxiliaryVariables: Record<string, string | number | boolean>;
  elementsState: Array<{
    value: string | number;
    status: 'DEFAULT' | 'ACTIVE' | 'MATCH' | 'DISCARDED' | 'MODIFIED';
  }>;
}

export interface StepEngineState {
  totalSteps: number;
  currentStepIndex: number;
  playbackStatus: PlaybackStatus;
  playbackSpeedMs: number; // Interval in milliseconds per step
}

