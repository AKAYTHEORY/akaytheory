import { test, expect } from '@playwright/test';

test.describe('E2E: Interactive Algorithm Visualizer (AT-VIZ)', () => {
  test('executes step-by-step algorithms, switches between Binary Search, Two Pointers, and Sliding Window', async ({
    page,
  }) => {
    await page.goto('/');

    // 1. Navigate to Algorithm Visualizers
    await page.getByRole('button', { name: 'Algorithm Visualizers' }).click();
    await expect(page.locator('text=Interactive Algorithm Visualizer')).toBeVisible();

    // 2. Binary Search default view
    await expect(page.locator('text=Initialize Binary Search')).toBeVisible();
    await expect(page.locator('text=Step 1 of')).toBeVisible();

    // Test Step Forward (Next)
    const nextBtn = page.getByRole('button', { name: 'Next' });
    await expect(nextBtn).toBeVisible();
    await nextBtn.click();

    // Verify step index advanced
    await expect(page.locator('text=Step 2 of')).toBeVisible();

    // Test Step Backward (Back)
    const backBtn = page.getByRole('button', { name: 'Back' });
    await backBtn.click();
    await expect(page.locator('text=Step 1 of')).toBeVisible();

    // 3. Switch to Two Pointers
    const twoPointersTab = page.getByRole('button', { name: 'Two Pointers' });
    await twoPointersTab.click();
    await expect(page.locator('text=Initialize Two Pointers')).toBeVisible();

    // Advance Two Pointers step
    await nextBtn.click();
    await expect(page.locator('text=Compare Current Sum')).toBeVisible();

    // 4. Switch to Sliding Window
    const slidingWindowTab = page.getByRole('button', { name: 'Sliding Window' });
    await slidingWindowTab.click();
    await expect(page.locator('text=Initialize First Window')).toBeVisible();
    await expect(page.locator('text=Window Size (k):')).toBeVisible();

    // Advance sliding window step
    await nextBtn.click();
    await expect(page.locator('text=Slide Window to')).toBeVisible();
  });
});

