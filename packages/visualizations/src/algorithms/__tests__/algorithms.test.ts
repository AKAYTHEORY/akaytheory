import { describe, it, expect } from 'vitest';
import { generateBinarySearchSteps } from '../binarySearch';
import { generateTwoPointersSteps } from '../twoPointers';
import { generateSlidingWindowSteps } from '../slidingWindow';

describe('Algorithm Step Generators', () => {
  describe('Binary Search', () => {
    it('generates correct search sequence for found element', () => {
      const arr = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91];
      const steps = generateBinarySearchSteps(arr, 23);

      expect(steps.length).toBeGreaterThan(1);
      const lastStep = steps[steps.length - 1]!;
      expect(lastStep.title).toBe('Target Found!');
      expect(lastStep.auxiliaryVariables['foundIndex']).toBe(5);
    });

    it('generates not found step when element is absent', () => {
      const arr = [2, 5, 8, 12, 16];
      const steps = generateBinarySearchSteps(arr, 99);

      const lastStep = steps[steps.length - 1]!;
      expect(lastStep.title).toBe('Target Not Found');
      expect(lastStep.auxiliaryVariables['found']).toBe(false);
    });
  });

  describe('Two Pointers', () => {
    it('finds target pair in sorted array', () => {
      const arr = [1, 2, 4, 7, 11, 15];
      const steps = generateTwoPointersSteps(arr, 15); // 4 + 11

      const lastStep = steps[steps.length - 1]!;
      expect(lastStep.title).toBe('Target Pair Found!');
      expect(lastStep.pointers['matchLeft']).toBe(2);
      expect(lastStep.pointers['matchRight']).toBe(4);
    });

    it('detects when no pair matches target', () => {
      const arr = [1, 2, 3, 9];
      const steps = generateTwoPointersSteps(arr, 20);

      const lastStep = steps[steps.length - 1]!;
      expect(lastStep.title).toBe('No Pair Found');
      expect(lastStep.auxiliaryVariables['found']).toBe(false);
    });
  });

  describe('Sliding Window', () => {
    it('finds maximum sum subarray of size k', () => {
      const arr = [2, 1, 5, 1, 3, 2];
      const k = 3;
      const steps = generateSlidingWindowSteps(arr, k);

      expect(steps.length).toBeGreaterThan(1);
      const lastStep = steps[steps.length - 1]!;
      expect(lastStep.title).toBe('Sliding Window Completed');
      expect(lastStep.auxiliaryVariables['maxSum']).toBe(9); // [5, 1, 3] = 9
      expect(lastStep.auxiliaryVariables['bestStart']).toBe(2);
    });

    it('handles invalid window size k gracefully', () => {
      const arr = [1, 2];
      const steps = generateSlidingWindowSteps(arr, 5);

      expect(steps.length).toBe(1);
      expect(steps[0]!.title).toBe('Invalid Window Size');
    });
  });
});

