import { test, expect } from '@playwright/test';
import { user } from './utils';

test.describe('Search Functionality', () => {
  test.use(user);

  test.beforeEach(async ({ page }) => {
    // Navigate to projects page
    await page.goto('/projects/all');
    // Wait for initial data to load if any
    try {
      await page.waitForResponse(response => 
        response.url().includes('/api/project2') && response.status() === 200,
        { timeout: 10000 }
      );
    } catch (e) {
      // It's okay if it was too fast or already loaded
    }
  });

  test('should hide "No data available" for short queries', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Search projects...');
    
    await searchInput.click();
    await searchInput.type('Te'); // Exactly 2 characters, should NOT trigger search if it's <2, but our logic is <2
    
    // Type 1 char
    await searchInput.clear();
    await searchInput.type('T');
    
    // The "No data available" message should be hidden via :hide-no-data="searchStr.length < 2"
    const noDataMessage = page.locator('.v-overlay-container').getByText('No data available');
    await expect(noDataMessage).not.toBeVisible();
  });

  test('should show prioritized results when searching for "Test"', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Search projects...');
    
    await searchInput.click();
    await searchInput.type('Test');

    // Wait for the search API response
    const searchResponse = await page.waitForResponse(response => 
      response.url().includes('/api/project2/search?q=Test') && response.status() === 200,
      { timeout: 15000 }
    );
    const results = await searchResponse.json();
    expect(results.length).toBeGreaterThan(0);

    // Verify prioritized results (Test Project Number One should be near the top)
    const resultsList = page.locator('.v-overlay-container .v-list-item');
    await expect(resultsList.first()).toContainText('Test Project Number');
    
    // Check for specific project data from samples
    const targetProject = resultsList.filter({ hasText: 'PAT1111111' });
    await expect(targetProject).toBeVisible();
    await expect(targetProject).toContainText('Bernhard Nachnameeins');
  });

  test('should navigate to project detail page on result selection', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Search projects...');
    
    await searchInput.click();
    await searchInput.type('PAT1111111');

    // Wait for results to appear
    const targetItem = page.locator('.v-overlay-container .v-list-item').filter({ hasText: 'PAT1111111' }).first();
    await targetItem.waitFor({ state: 'visible', timeout: 15000 });

    // Select the project
    await targetItem.click();

    // Verify navigation to project detail page
    await expect(page).toHaveURL(/.*\/project\/PAT1111111/);
    
    // Check if the project title appears on the detail page (ProjectView handles this)
    await expect(page.locator('body')).toContainText('Test Project Number One');
  });

  test('should handle empty results gracefully', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Search projects...');
    
    await searchInput.click();
    await searchInput.type('NonExistentProjectQueryResult12345');

    // Wait for API call to finish
    await page.waitForResponse(response => 
      response.url().includes('/api/project2/search') && response.status() === 200,
      { timeout: 15000 }
    );

    // Now it should show "No data available" because length >= 2
    const noDataMessage = page.locator('.v-overlay-container').getByText('No data available');
    await expect(noDataMessage).toBeVisible();
  });
});
