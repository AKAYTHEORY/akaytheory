import type { VisualizerStep } from '../engine/types';

/**
 * Generates discrete visualizer steps for Sliding Window (Maximum Sum Subarray of fixed size k).
 *
 * @param array Array of numbers
 * @param k Window size
 */
export function generateSlidingWindowSteps(array: number[], k: number): VisualizerStep[] {
  const steps: VisualizerStep[] = [];
  let stepIndex = 0;

  if (array.length < k || k <= 0) {
    steps.push({
      stepIndex: stepIndex++,
      title: 'Invalid Window Size',
      explanation: `Array length (${array.length}) is smaller than window size (${k}).`,
      activeLine: 1,
      highlightedIndices: [],
      pointers: {},
      auxiliaryVariables: { arrayLength: array.length, k },
      elementsState: array.map((val) => ({ value: val, status: 'DISCARDED' })),
    });
    return steps;
  }

  // Step 0: Compute first window sum
  let windowSum = 0;
  for (let i = 0; i < k; i++) {
    windowSum += array[i]!;
  }
  let maxSum = windowSum;
  let bestStart = 0;

  steps.push({
    stepIndex: stepIndex++,
    title: 'Initialize First Window',
    explanation: `Compute sum of initial window of size ${k} (indices 0 to ${k - 1}). Sum = ${windowSum}.`,
    activeLine: 2,
    highlightedIndices: Array.from({ length: k }, (_, i) => i),
    pointers: { windowStart: 0, windowEnd: k - 1 },
    auxiliaryVariables: { k, currentWindowSum: windowSum, maxWindowSum: maxSum, bestStart },
    elementsState: array.map((val, idx) => ({
      value: val,
      status: idx < k ? 'ACTIVE' : 'DEFAULT',
    })),
  });

  // Slide the window
  for (let i = k; i < array.length; i++) {
    const exitingIdx = i - k;
    const enteringIdx = i;
    const exitingVal = array[exitingIdx]!;
    const enteringVal = array[enteringIdx]!;

    const prevSum = windowSum;
    windowSum = windowSum - exitingVal + enteringVal;
    const isNewMax = windowSum > maxSum;
    if (isNewMax) {
      maxSum = windowSum;
      bestStart = exitingIdx + 1;
    }

    steps.push({
      stepIndex: stepIndex++,
      title: `Slide Window to [${exitingIdx + 1}..${enteringIdx}]`,
      explanation: `Subtract element leaving window (index ${exitingIdx}, val ${exitingVal}) and add element entering window (index ${enteringIdx}, val ${enteringVal}). Previous sum: ${prevSum}, New sum: ${windowSum}.${
        isNewMax ? ` New maximum found: ${maxSum}!` : ''
      }`,
      activeLine: 4,
      highlightedIndices: Array.from({ length: k }, (_, idx) => exitingIdx + 1 + idx),
      pointers: { windowStart: exitingIdx + 1, windowEnd: enteringIdx },
      auxiliaryVariables: {
        k,
        exitedValue: exitingVal,
        enteredValue: enteringVal,
        currentWindowSum: windowSum,
        maxWindowSum: maxSum,
        bestStart,
      },
      elementsState: array.map((val, idx) => {
        if (idx >= exitingIdx + 1 && idx <= enteringIdx) {
          return { value: val, status: isNewMax ? 'MATCH' : 'ACTIVE' };
        }
        return { value: val, status: idx <= exitingIdx ? 'DISCARDED' : 'DEFAULT' };
      }),
    });
  }

  // Final step
  steps.push({
    stepIndex: stepIndex++,
    title: 'Sliding Window Completed',
    explanation: `Optimal window is from index ${bestStart} to ${bestStart + k - 1} with maximum sum of ${maxSum}.`,
    activeLine: 6,
    highlightedIndices: Array.from({ length: k }, (_, idx) => bestStart + idx),
    pointers: { bestStart, bestEnd: bestStart + k - 1 },
    auxiliaryVariables: { maxSum, bestStart, bestEnd: bestStart + k - 1 },
    elementsState: array.map((val, idx) => ({
      value: val,
      status: idx >= bestStart && idx < bestStart + k ? 'MATCH' : 'DISCARDED',
    })),
  });

  return steps;
}

