import { test, expect } from '@playwright/test';

test.describe('E2E: Full Learning Experience & Knowledge Quiz (AT-LEARN)', () => {
  test('navigates from roadmaps to lesson, interacts with mental checkpoint and completes quiz', async ({
    page,
  }) => {
    // 1. First authenticate with seeded test account
    await page.goto('/');

    const signInBtn = page.getByRole('button', { name: 'Sign In' }).first();
    await signInBtn.click();

    await page.fill('input[type="email"]', 'learner@akaytheory.dev');
    await page.fill('input[type="password"]', 'AkayTheory2026!Secure');
    await page.getByRole('button', { name: 'Sign In' }).last().click();

    // Verify logged in
    await expect(page.locator('text=Akay Learner').first()).toBeVisible();

    // 2. Navigate to Roadmaps
    await page.getByRole('button', { name: 'Engineering Roadmaps' }).click();
    await expect(page.locator('h1:has-text("Data Structures & Algorithms")')).toBeVisible();

    // Verify visual graph canvas is displayed
    await expect(page.locator('text=Step 1')).toBeVisible();
    await expect(page.locator('text=Binary Search Algorithm').first()).toBeVisible();

    // 3. Test Accessible List View toggle (WCAG 2.2 AA)
    await page.getByRole('button', { name: 'Accessible List (WCAG)' }).click();
    await expect(page.locator('text=Accessible hierarchical learning sequence')).toBeVisible();

    // Switch back to graph or click "Start Learning"
    const binarySearchItem = page.locator('li').filter({ hasText: 'Binary Search Algorithm' });
    await binarySearchItem.getByRole('button').click();

    // 4. Verify Lesson Viewer loaded
    await expect(page.locator('h1:has-text("Binary Search: Intuition, Invariants & Implementation")')).toBeVisible();
    await expect(page.locator('text=Overview & Problem Statement').first()).toBeVisible();
    await expect(page.locator('text=Loop Invariants and Midpoint Calculation').first()).toBeVisible();

    // 5. Test Mental Model Checkpoint (Think Before Reveal)
    const revealBtn = page.getByRole('button', { name: 'Think & Reveal' });
    await expect(revealBtn).toBeVisible();
    await revealBtn.click();

    // Verify hidden solution is now revealed and button toggled
    await expect(page.getByRole('button', { name: 'Hide Solution' })).toBeVisible();
    await expect(page.locator('text=If array[mid] == target')).toBeVisible();

    // 6. Complete Knowledge Check Quiz
    await expect(page.locator('text=Knowledge Check: Binary Search Algorithm')).toBeVisible();

    // Select correct option for question:
    // "What is the time complexity of searching an element using binary search in a sorted array of size n?" -> "O(log n)"
    const logNOption = page.locator('button:has-text("O(log n)")');
    await expect(logNOption).toBeVisible();
    await logNOption.click();

    // Submit answers
    const submitQuizBtn = page.getByRole('button', { name: 'Submit Answers' });
    await expect(submitQuizBtn).toBeVisible();
    await submitQuizBtn.click();

    // 7. Verify Mastery Elevation & Feedback Banner
    await expect(page.locator('text=Mastery Evidence Accepted!')).toBeVisible();
    await expect(page.locator('text=Score: 100%').first()).toBeVisible();
    await expect(page.locator('text=Next spaced revision scheduled!')).toBeVisible();
  });
});
