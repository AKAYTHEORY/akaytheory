import { test, expect } from '@playwright/test';

test.describe('E2E: Practice Workspace & Global Search (AT-PRAC & AT-SEARCH)', () => {
  test('solves practice problem with progressive hints and uses CommandPalette search', async ({
    page,
  }) => {
    // 1. Authenticate first
    await page.goto('/');

    const signInBtn = page.getByRole('button', { name: 'Sign In' }).first();
    await signInBtn.click();
    await page.fill('input[type="email"]', 'learner@akaytheory.dev');
    await page.fill('input[type="password"]', 'AkayTheory2026!Secure');
    await page.getByRole('button', { name: 'Sign In' }).last().click();
    await expect(page.locator('text=Akay Learner').first()).toBeVisible();

    // 2. Navigate to Practice Problems
    await page.getByRole('button', { name: 'Practice Problems' }).click();
    await expect(page.locator('h1:has-text("Practice Problems")')).toBeVisible();

    // 3. Select Problem
    const solveBtn = page.getByRole('button', { name: 'Solve' }).first();
    await expect(solveBtn).toBeVisible();
    await solveBtn.click();

    // 4. In Problem Workspace
    await expect(page.locator('h1:has-text("Search in Sorted Array")')).toBeVisible();
    await expect(page.locator('text=EASY')).toBeVisible();

    // Test Progressive Hints (BR-009)
    await page.getByRole('button', { name: /Progressive Hints/ }).click();
    await expect(page.locator('text=Progressive Hint Disclosure (BR-009)')).toBeVisible();

    const revealNextHintBtn = page.getByRole('button', { name: 'Reveal Next Hint' });
    await expect(revealNextHintBtn).toBeVisible();
    await revealNextHintBtn.click();
    await expect(page.locator('text=Notice that the array is sorted')).toBeVisible();

    // Test Editorial Solution Tab
    await page.getByRole('button', { name: 'Editorial Solution' }).click();
    await expect(page.locator('text=Official Reference Solution')).toBeVisible();
    await expect(page.locator('text=O(log n)').first()).toBeVisible();
    await expect(page.locator('text=O(1)').first()).toBeVisible();

    // Submit Problem ("Mark as Solved")
    const markSolvedBtn = page.getByRole('button', { name: 'Mark as Solved' });
    await expect(markSolvedBtn).toBeVisible();
    await markSolvedBtn.click();
    await expect(page.locator('text=Problem Solved! Mastery progress and revision schedule updated.')).toBeVisible();

    // 5. Global Search Command Palette (Click search or Meta+k)
    const searchTrigger = page.locator('button:has-text("Search curriculum")').or(page.locator('button:has-text("Quick search")')).or(page.locator('[placeholder*="Search"]')).first();
    if (await searchTrigger.isVisible()) {
      await searchTrigger.click();
    } else {
      await page.keyboard.press('Meta+k');
    }

    // Verify search modal opened
    const searchInput = page.locator('input[placeholder*="Search topics, lessons, problems"]');
    await expect(searchInput).toBeVisible();

    // Type query
    await searchInput.fill('Binary');

    // Wait for search results
    await expect(page.locator('text=Binary Search Algorithm').first()).toBeVisible();
    await expect(page.locator('text=Binary Search: Intuition, Invariants & Implementation').first()).toBeVisible();

    // Select the lesson search result
    await page.locator('button:has-text("Binary Search: Intuition, Invariants & Implementation")').click();

    // Verify navigated to LessonViewer
    await expect(page.locator('h1:has-text("Binary Search: Intuition, Invariants & Implementation")')).toBeVisible();
  });
});
