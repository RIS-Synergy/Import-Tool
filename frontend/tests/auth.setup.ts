import { test as setup, expect } from '@playwright/test';
import { join } from 'path';
import { existsSync } from 'fs';

const env = process.env.NODE_ENV;
const authFile = join(process.cwd(), `tests/.auth-${env}/user.json`);

setup('authenticate', async ({ page }) => {
  // only if authFile file does not exist
  if (existsSync(authFile)) {
    console.log('✔ Auth file exists', authFile);
    return;
  }

  // make sure backend is ready
  await page.goto('/api');
  await expect(page.getByText('RIS Synergy API')).toBeVisible();
  // console.log('👆 Backend is ready')

  // Perform authentication steps.
  await page.goto('/');

  await page.reload();

  await expect(page).toHaveURL(/.*\/login/)

  await page.getByText('RIS Synergy').click();
  await page.getByText('Import Tool').click();

  // This is important ❗
  if (process.env.NODE_ENV === "ci") {
    // This is needed for making Nuxt load properly withing GitHub Action,
    // when everything needs to be running when a new docker file is being started
    console.log('🚧 CI, 3 second delay...')
    await page.waitForTimeout(3000);
  }

  await page.getByRole('textbox', { name: 'User name User name' }).fill('admin');
  await page.getByRole('textbox', { name: 'Password Password' }).fill('admin');

  const [loginRequest, loginResponse] = await Promise.all([
    page.waitForRequest('**/api/auth/login'),
    page.waitForResponse('**/api/auth/login'),
    page.getByRole('button', { name: 'Login' }).click()
  ]);

  const postData = loginRequest.postDataJSON();
  console.log('➡️', postData)

  expect(postData.username).toBe('admin');
  expect(postData.password).toBe('admin');

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
});
