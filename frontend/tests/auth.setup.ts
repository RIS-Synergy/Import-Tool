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

  // make sure backend is ready
  await page.goto('/api');
  await expect(page.getByText('RIS Synergy API')).toBeVisible();

  // Perform authentication steps.
  await page.goto('/');

  await expect(page).toHaveURL(/.*\/login/, { timeout: 30000 });

  await page.getByText('RIS Synergy').click();
  await page.getByText('Import Tool').click();

  // This is important ❗
  if (process.env.NODE_ENV === "ci") {
    var delay = 3000;
    if (process.env.CI_TIME_DELAY) {
      delay = parseInt(process.env.CI_TIME_DELAY) * 1000;
    }

    // This is needed for making Nuxt load properly withing GitHub Action,
    // when everything needs to be running when a new docker file is being started
    console.log(`🚧 CI, ${delay / 1000} second delay...`)
    await page.waitForTimeout(delay);
  }

  await page.getByRole('textbox', { name: 'User name User name' }).fill(username);
  await page.getByRole('textbox', { name: 'Password Password' }).fill(password);

  const [loginRequest, loginResponse] = await Promise.all([
    page.waitForRequest('**/api/auth/login'),
    page.waitForResponse('**/api/auth/login'),
    page.getByRole('button', { name: 'Login' }).click()
  ]);

  const postData = loginRequest.postDataJSON();
  console.log('➡️', postData)

  expect(postData.username).toBe(username);
  expect(postData.password).toBe(password);

  // Example: Wait for login response and check status
  console.log('⬅️', await loginResponse.json())
  expect(loginResponse.status()).toBe(200);

  await page.waitForLoadState('networkidle');

  // we can't see 'FetchError'
  await expect(page.getByText('FetchError')).not.toBeVisible({ timeout: 10000 });

  // page moved over to /projects
  await expect(page).toHaveURL(/.*\/projects/, { timeout: 120000 });

  await expect(page.getByRole('banner')
    .getByText('Projects'))
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
