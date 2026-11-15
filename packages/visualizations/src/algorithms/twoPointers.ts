import type { VisualizerStep } from '../engine/types';

/**
 * Generates discrete visualizer steps for Two Pointers (Target Sum in Sorted Array).
 *
 * @param array Sorted array of numbers
 * @param target Sum to find
 */
export function generateTwoPointersSteps(array: number[], target: number): VisualizerStep[] {
  const steps: VisualizerStep[] = [];
  let left = 0;
  let right = array.length - 1;
  let stepIndex = 0;

  // Step 0: Initialization
  steps.push({
    stepIndex: stepIndex++,
    title: 'Initialize Two Pointers',
    explanation: `Target sum is ${target}. Set left pointer at start (index 0) and right pointer at end (index ${right}).`,
    activeLine: 1,
    highlightedIndices: [left, right],
    pointers: { left: 0, right },
    auxiliaryVariables: { target, left, right, currentSum: array[left]! + array[right]! },
    elementsState: array.map((val, idx) => ({
      value: val,
      status: idx === left || idx === right ? 'ACTIVE' : 'DEFAULT',
    })),
  });

  while (left < right) {
    const currentSum = array[left]! + array[right]!;

    steps.push({
      stepIndex: stepIndex++,
      title: 'Compare Current Sum',
      explanation: `array[${left}] (${array[left]}) + array[${right}] (${array[right]}) = ${currentSum}. Target is ${target}.`,
      activeLine: 3,
      highlightedIndices: [left, right],
      pointers: { left, right },
      auxiliaryVariables: { target, left, right, currentSum },
      elementsState: array.map((val, idx) => ({
        value: val,
        status: idx === left || idx === right ? 'ACTIVE' : 'DEFAULT',
      })),
    });

    if (currentSum === target) {
      steps.push({
        stepIndex: stepIndex++,
        title: 'Target Pair Found!',
        explanation: `Found elements at indices ${left} (${array[left]}) and ${right} (${array[right]}) summing to ${target}.`,
        activeLine: 5,
        highlightedIndices: [left, right],
        pointers: { matchLeft: left, matchRight: right },
        auxiliaryVariables: { target, left, right, match: true },
        elementsState: array.map((val, idx) => ({
          value: val,
          status: idx === left || idx === right ? 'MATCH' : 'DISCARDED',
        })),
      });
      return steps;
    }

    if (currentSum < target) {
      steps.push({
        stepIndex: stepIndex++,
        title: 'Sum Too Small: Advance Left',
        explanation: `${currentSum} < ${target}. To increase the sum, increment left pointer from ${left} to ${left + 1}.`,
        activeLine: 7,
        highlightedIndices: [left],
        pointers: { left: left + 1, right },
        auxiliaryVariables: { target, oldLeft: left, newLeft: left + 1, right },
        elementsState: array.map((val, idx) => ({
          value: val,
          status: idx <= left ? 'DISCARDED' : idx === right ? 'ACTIVE' : 'DEFAULT',
        })),
      });
      left++;
    } else {
      steps.push({
        stepIndex: stepIndex++,
        title: 'Sum Too Large: Decrement Right',
        explanation: `${currentSum} > ${target}. To decrease the sum, decrement right pointer from ${right} to ${right - 1}.`,
        activeLine: 9,
        highlightedIndices: [right],
        pointers: { left, right: right - 1 },
        auxiliaryVariables: { target, left, oldRight: right, newRight: right - 1 },
        elementsState: array.map((val, idx) => ({
          value: val,
          status: idx >= right ? 'DISCARDED' : idx === left ? 'ACTIVE' : 'DEFAULT',
        })),
      });
      right--;
    }
  }

  // Not found
  steps.push({
    stepIndex: stepIndex++,
    title: 'No Pair Found',
    explanation: `Pointers met at index ${left}. No two elements in the array sum to ${target}.`,
    activeLine: 11,
    highlightedIndices: [],
    pointers: {},
    auxiliaryVariables: { target, found: false },
    elementsState: array.map((val) => ({ value: val, status: 'DISCARDED' })),
  });

  return steps;
}

