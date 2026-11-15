import { describe, it, expect } from 'vitest';
import { StepEngine } from '../StepEngine';
import { generateBinarySearchSteps } from '../../algorithms/binarySearch';

describe('StepEngine FSM', () => {
  it('initializes correctly with binary search steps', () => {
    const steps = generateBinarySearchSteps([1, 3, 5, 7, 9, 11], 7);
    const engine = new StepEngine(steps);

    expect(engine.getStepsCount()).toBeGreaterThan(1);
    expect(engine.getCurrentStep().stepIndex).toBe(0);
    expect(engine.getState().playbackStatus).toBe('IDLE');
  });

  it('navigates next and previous steps deterministically', () => {
    const steps = generateBinarySearchSteps([1, 3, 5, 7, 9, 11], 7);
    const engine = new StepEngine(steps);

    engine.stepNext();
    expect(engine.getCurrentStep().stepIndex).toBe(1);

    engine.stepPrev();
    expect(engine.getCurrentStep().stepIndex).toBe(0);
  });

  it('jumps to target step index', () => {
    const steps = generateBinarySearchSteps([1, 3, 5, 7, 9, 11], 7);
    const engine = new StepEngine(steps);

    engine.jumpTo(2);
    expect(engine.getCurrentStep().stepIndex).toBe(2);
  });

  it('resets back to step 0', () => {
    const steps = generateBinarySearchSteps([1, 3, 5, 7, 9, 11], 7);
    const engine = new StepEngine(steps);

    engine.jumpTo(2);
    engine.reset();
    expect(engine.getCurrentStep().stepIndex).toBe(0);
    expect(engine.getState().playbackStatus).toBe('IDLE');
  });
});

