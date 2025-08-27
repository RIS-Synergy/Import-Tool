import { test, expect } from '@playwright/test'

test('View the App name text', async ({ page }) => {
  await page.goto('/');
  await page.getByText('RIS Synergy').click();
  await page.getByText('Import Tool').click();
});

test('Backend API initial endpoint', async ({ page }) => {
  await page.goto('/api');
  await expect(page.getByText('RIS Synergy API')).toBeVisible();
});

test('Login and view "Projects"', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('textbox', { name: 'User name User name' }).fill('admin');
  await page.getByRole('textbox', { name: 'Password Password' }).fill('admin');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.getByRole('banner').getByText('Projects')).toBeVisible();

  await expect(page.getByText('Status: IN_PREPARATION').nth(0)).toBeVisible();
});

test('View a Project details', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('textbox', { name: 'User name User name' }).fill('admin');
  await page.getByRole('textbox', { name: 'Password Password' }).fill('admin');
  await page.getByRole('button', { name: 'Login' }).click();

  // See at least one project in the list
  await expect(page.getByText('Status: IN_PREPARATION').nth(0)).toBeVisible();

  // Click the first 'View' button for a project in the list
  await page.locator('.v-btn.v-theme--light.text-primary').first().click();

  // See some text come back
  await expect(page.getByText('Human-Translated')
    .nth(0))
    .toBeVisible({ timeout: 30000 }); // Might take a while to load under low resources
});
