import { test, expect } from '@playwright/test';

test.describe('E2E: Authentication & Session Lifecycle (AT-AUTH)', () => {
  test('unauthenticated visitor sees landing shell and can register & authenticate', async ({ page }) => {
    // 1. Visit homepage
    await page.goto('/');
    await expect(page).toHaveTitle(/AkayTheory/);

    // 2. Verify branding and navigation elements
    await expect(page.locator('text=AkayTheory').first()).toBeVisible();
    await expect(page.locator('text=Dual-Domain Anchor Launch')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Learner Dashboard' }).first()).toBeVisible();

    // 3. Open Registration Modal
    const createAccountBtn = page.getByRole('button', { name: 'Create Account' });
    await expect(createAccountBtn).toBeVisible();
    await createAccountBtn.click();

    // Verify modal visible
    await expect(page.locator('text=Create Your Account').first()).toBeVisible();

    // 4. Fill registration form with unique email
    const uniqueId = Date.now();
    const testEmail = `learner_${uniqueId}@akaytheory.dev`;
    const testUsername = `user_${uniqueId}`;

    await page.fill('input[placeholder*="Akay Developer"]', 'Test Learner');
    await page.fill('input[placeholder*="akay_dev"]', testUsername);
    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[type="password"]', 'StrongPass123!');

    // Submit registration
    await page.getByRole('button', { name: 'Create Account' }).last().click();

    // 5. Verify user is now authenticated and modal closed
    await expect(page.locator('text=Create Your Account')).not.toBeVisible();
    await expect(page.locator('text=Test Learner').first()).toBeVisible();
    await expect(page.locator(`text=${testEmail}`).first()).toBeVisible();

    // 6. Test Logout
    const logoutBtn = page.getByTitle('Log Out');
    await expect(logoutBtn).toBeVisible();
    await logoutBtn.click();

    // 7. Verify back to unauthenticated state
    await expect(page.getByRole('button', { name: 'Sign In', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Create Account' })).toBeVisible();
  });
});
