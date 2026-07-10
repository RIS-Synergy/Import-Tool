import { test, expect } from '@playwright/test'
import { user, admin } from './utils';

test.use(user);

test('User can Logout', async ({ page }) => {
  await page.goto('/projects');

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

  // open user menu (opens dialog)
  await page.getByText('user', { exact: true }).first().click();
  // await page.locator('.mdi-account').click();

  // click Logout in the dialog
  await page.getByRole('button', { name: 'Logout' }).click();

  // assert our page is /
  await expect(page).toHaveURL(/.*\//);

});

test.describe("User: 'user'", () => {
  test.use(user);

  test('Users table', async ({ page }) => {
    await page.goto('/users');

    // wait for the table to populate
    await expect(page.getByRole('cell', { name: 'user', exact: true })).toBeVisible();

    // there should be at least 1 user in the table
    const rowCount = await page.locator('table tbody tr').count();
    expect(rowCount).toBeGreaterThanOrEqual(1);
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

    // there should be at least 2 users in the table
    const rowCount = await page.locator('table tbody tr').count();
    expect(rowCount).toBeGreaterThanOrEqual(2);
  });
})
