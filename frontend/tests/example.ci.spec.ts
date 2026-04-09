import { test, expect } from '@playwright/test'
import { user } from './utils';

test.describe("Backend", () => {
  test('Backend API initial endpoint', async ({ page }) => {
    await page.goto('/api');
    await expect(page.getByText('RIS Synergy API')).toBeVisible();
  });
})

test.describe("Unauthenticated", () => {
  test('View the App name text', async ({ page }) => {
    await page.goto('/');
    await page.getByText('RIS Synergy').click();
    await page.getByText('Import Tool').click();
  });

  test('Login and view "Dashboard"', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('textbox', { name: 'User name User name' }).fill('admin');
    await page.getByRole('textbox', { name: 'Password Password' }).fill('admin');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  });

  test('Login and view "Projects"', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('textbox', { name: 'User name User name' }).fill('admin');
    await page.getByRole('textbox', { name: 'Password Password' }).fill('admin');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.waitForURL('**/dashboard');
    await page.goto('/projects');
    await page.waitForURL('**/projects/all');
    await expect(page.locator('header').getByText('Projects')).toBeVisible();
    await expect(page.getByText('Status: IN_').first()).toBeVisible({ timeout: 60000 });
  });
});

test.describe("Authenticated", () => {
  test.use(user);

  test('View a Project details', async ({ page }) => {
    await page.goto('/projects');

    await expect(page.getByText('Status:')
      .nth(0))
      .toBeVisible({ timeout: 35000 })

    // Click the first 'View' button for a project in the list
    await page.locator('.v-btn.v-theme--light.text-primary').first().click();

    // See some text come back
    await expect(page.getByText('Human-Translated')
      .nth(0))
      .toBeVisible({ timeout: 35000 }); // Might take a while to load under low resources
  });
});
