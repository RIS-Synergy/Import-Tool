import { test, expect } from '@playwright/test'
import { user, admin } from './utils';

test.use(user);

test('User can Logout', async ({ page }) => {
  await page.goto('/');

  const projects = await page.waitForResponse('**/api/project2');
  const numProjects = (await projects.json()).items.length;
  // assert .items have more than 0 items
  expect(numProjects).toBe(4)

  await expect(page.getByText('Status:')
    .nth(0))
    .toBeVisible({ timeout: 10000 })

  // assert our page is /projects
  await expect(page).toHaveURL(/.*\/projects/);
  await expect(page.getByRole('banner').getByText('Projects')).toBeVisible();

  // open user menu
  await page.locator('.mdi-account').click();
  // await page.getByRole('listbox').getByRole('button').click();

  // click Logout
  await page.getByRole('button', { name: 'Logout' }).click();

  // assert our page is /login
  await expect(page).toHaveURL(/.*\/login/);

});

test.describe("User: 'user'", () => {
  test.use(user);

  test('Users table', async ({ page }) => {
    await page.goto('/users');

    // there should be only 1️⃣ users in the table
    await expect(page.locator('table tbody tr')).toHaveCount(1);
  });
})

test.describe("User: 'admin' 🔑", () => {
  test.use(admin);

  test('Users table', async ({ page }) => {
    await page.goto('/users');

    // general checks
    await expect(page.getByRole('cell', { name: 'user', exact: true })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'admin', exact: true })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'admin edit' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'edit', exact: true })).toBeVisible();

    // does not exist
    await expect(page.getByRole('cell', { name: 'foo', exact: true })).not.toBeVisible();

    // there should be only 2️⃣ users in the table
    await expect(page.locator('table tbody tr')).toHaveCount(2);
  });
})
