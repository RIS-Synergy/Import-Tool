import { test, expect } from '@playwright/test'
import { user } from './utils';

test.use(user);

test('User can Logout', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByText('Status:')
    .nth(0))
    .toBeVisible({ timeout: 10000 })

  // assert our page is /projects
  await expect(page).toHaveURL(/.*\/projects/);
  await expect(page.getByRole('banner').getByText('Projects')).toBeVisible();

  // open user menu
  await page.getByRole('listbox').getByRole('button').click();

  // click Logout
  await page.getByRole('button', { name: 'Logout' }).click();

  // assert our page is /login
  await expect(page).toHaveURL(/.*\/login/);

});
