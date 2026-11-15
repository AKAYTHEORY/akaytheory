import type { VisualizerStep } from '../engine/types';

export function generateBinarySearchSteps(array: number[], target: number): VisualizerStep[] {
  const steps: VisualizerStep[] = [];
  let left = 0;
  let right = array.length - 1;
  let stepIndex = 0;

  // Initial step
  steps.push({
    stepIndex: stepIndex++,
    title: 'Initialize Binary Search',
    explanation: `Searching for target ${target} in sorted array of ${array.length} elements. Left pointer at 0, Right pointer at ${right}.`,
    activeLine: 1,
    highlightedIndices: [],
    pointers: { left: 0, right },
    auxiliaryVariables: { target, left, right, mid: -1 },
    elementsState: array.map((val) => ({ value: val, status: 'DEFAULT' })),
  });

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const midVal = array[mid]!;

    steps.push({
      stepIndex: stepIndex++,
      title: 'Calculate Midpoint',
      explanation: `Midpoint index = floor((${left} + ${right}) / 2) = ${mid}. Element at mid is ${midVal}.`,
      activeLine: 3,
      highlightedIndices: [mid],
      pointers: { left, right, mid },
      auxiliaryVariables: { target, left, right, mid, 'array[mid]': midVal },
      elementsState: array.map((val, idx) => {
        if (idx === mid) return { value: val, status: 'ACTIVE' };
        if (idx < left || idx > right) return { value: val, status: 'DISCARDED' };
        return { value: val, status: 'DEFAULT' };
      }),
    });

    if (midVal === target) {
      steps.push({
        stepIndex: stepIndex++,
        title: 'Target Found!',
        explanation: `Element at index ${mid} (${midVal}) matches target ${target}. Binary search successfully terminated.`,
        activeLine: 5,
        highlightedIndices: [mid],
        pointers: { match: mid },
        auxiliaryVariables: { target, foundIndex: mid },
        elementsState: array.map((val, idx) => {
          if (idx === mid) return { value: val, status: 'MATCH' };
          return { value: val, status: 'DISCARDED' };
        }),
      });
      return steps;
    }

    if (midVal < target) {
      steps.push({
        stepIndex: stepIndex++,
        title: 'Target Greater than Mid',
        explanation: `${midVal} < ${target}. Discarding left half (indices ${left} to ${mid}). Moving left pointer to ${mid + 1}.`,
        activeLine: 7,
        highlightedIndices: [mid],
        pointers: { left: mid + 1, right },
        auxiliaryVariables: { target, newLeft: mid + 1, right },
        elementsState: array.map((val, idx) => {
          if (idx <= mid || idx > right) return { value: val, status: 'DISCARDED' };
          return { value: val, status: 'DEFAULT' };
        }),
      });
      left = mid + 1;
    } else {
      steps.push({
        stepIndex: stepIndex++,
        title: 'Target Less than Mid',
        explanation: `${midVal} > ${target}. Discarding right half (indices ${mid} to ${right}). Moving right pointer to ${mid - 1}.`,
        activeLine: 9,
        highlightedIndices: [mid],
        pointers: { left, right: mid - 1 },
        auxiliaryVariables: { target, left, newRight: mid - 1 },
        elementsState: array.map((val, idx) => {
          if (idx >= mid || idx < left) return { value: val, status: 'DISCARDED' };
          return { value: val, status: 'DEFAULT' };
        }),
      });
      right = mid - 1;
    }
  }

  // Not found step
  steps.push({
    stepIndex: stepIndex++,
    title: 'Target Not Found',
    explanation: `Left pointer (${left}) crossed Right pointer (${right}). Target ${target} does not exist in the array.`,
    activeLine: 11,
    highlightedIndices: [],
    pointers: {},
    auxiliaryVariables: { target, found: false },
    elementsState: array.map((val) => ({ value: val, status: 'DISCARDED' })),
  });

  return steps;
}

