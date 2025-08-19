import { test, expect } from '@playwright/test'

test('View the App name text', async ({ page }) => {
  await page.goto('/');
  await page.getByText('RIS Synergy').click();
  await page.getByText('Import Tool').click();
});

test.skip('Login and view "Projects"', async ({ page }) => {
  await page.getByRole('textbox', { name: 'User name User name' }).fill('admin');
  await page.getByRole('textbox', { name: 'Password Password' }).fill('test123');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.getByRole('banner').getByText('Projects')).toBeVisible();
});
