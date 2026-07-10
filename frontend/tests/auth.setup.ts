import { test as setup, expect } from '@playwright/test';
import { join } from 'path';
import { existsSync } from 'fs';

const env = process.env.NODE_ENV;

async function authenticateUser(page: any, username: string, password: string) {
  const authFile = join(process.cwd(), `tests/.auth-${env}/${username}.json`);

  // only if authFile file does not exist
  if (existsSync(authFile)) {
    console.log('✔ Auth file exists', authFile);
    return;
  }

  // Start listener BEFORE going to the page or we might miss the event
  const loginFormLoadedPromise = page.waitForEvent('console', (msg: any) => msg.text() === '🟢 Login form loaded');

  // Perform authentication steps.
  await page.goto('/');
  await expect(page).toHaveURL(/.*\//, { timeout: 30000 });

  await page.getByText('RIS Synergy').click();
  await page.getByText('Import Tool').click();

  // Wait for the hydration log we set up earlier
  await loginFormLoadedPromise;

  await page.getByLabel('User name').fill(username);
  await page.getByLabel('Password').fill(password);

  // Wait for the response BEFORE clicking, or use Promise.all
  const loginResponsePromise = page.waitForResponse('**/api/auth/login');

  await page.getByRole('button', { name: 'Login' }).click();
  const loginResponse = await loginResponsePromise;

  // Example: Wait for login response and check status
  console.log('⬅️ Login Response Body:', await loginResponse.json())
  expect(loginResponse.status()).toBe(200);

  await page.waitForLoadState('networkidle');

  // we can't see 'FetchError'
  await expect(page.getByText('FetchError')).not.toBeVisible({ timeout: 10000 });

  // page moved over to /dashboard
  await expect(page).toHaveURL(/.*\/dashboard/, { timeout: 30000 });

  await expect(page.getByRole('heading', { name: 'Dashboard' }))
    .toBeVisible({ timeout: 60000 });

  // End of authentication steps.
  await page.context().storageState({ path: authFile });
  console.log('🔑 Auth file created', authFile);
}

setup('authenticate admin', async ({ page }) => {
  await authenticateUser(page, 'admin', 'admin');
});

setup('authenticate user', async ({ page }) => {
  await authenticateUser(page, 'user', 'user');
});
