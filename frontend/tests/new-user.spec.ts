import { test, expect } from '@playwright/test';

test.describe('New User SSO Flow', () => {
  test('new user is redirected to pending page and blocked from dashboard', async ({ page, request, context }) => {
    const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000';

    // 1. Get a fresh token from backend using the mock SSO bypass
    const response = await request.post(`${baseURL}/api/auth/sso-login`, {
      data: {
        frontendData: {
          accessToken: 'mock-newe2euser',
          userInfo: {}
        }
      }
    });

    expect(response.ok()).toBeTruthy();
    const backendData = await response.json();
    expect(backendData.token).toBeDefined();

    // 2. Set the sso_backend_data cookie to simulate the redirect from sso-callback.ts
    const payload = { backendData };
    const base64Session = Buffer.from(JSON.stringify(payload)).toString('base64');

    // We get the domain from the baseURL, usually localhost
    // (baseURL is already defined at the top of the test)

    await context.addCookies([{
      name: 'sso_backend_data',
      value: base64Session,
      url: baseURL,
    }]);

    // 3. Navigate to dashboard - sso-callback.ts middleware should intercept and redirect to /new-user
    await page.goto(`${baseURL}/dashboard`);

    // Wait for it to redirect to the new-user page
    await expect(page).toHaveURL(/.*\/new-user/);

    // 4. Test the UI on /new-user
    await expect(page.getByRole('heading', { name: 'Pending' })).toBeVisible();
    await expect(page.getByText('Contact your CRIS department')).toBeVisible();

    // (Step 5 removed: "Back to Home" now logs the user out, which would ruin Step 6's expectation that the user is still authenticated as pending)
    // 6. Test direct API call restriction (403 Forbidden)
    // The dashboard page will attempt to fetch /api/project2/stats which will throw 403, 
    // triggering useApiUtils to push to '/'
    await page.goto(`${baseURL}/dashboard`);
    await expect(page).toHaveURL(/.*\/new-user/);
  });
});
