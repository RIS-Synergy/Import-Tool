import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  reporter: [['html', { open: 'never',
                        // outputFolder: '../playwright-report'
                      }]],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    ignoreHTTPSErrors: true,
    locale: 'en-US',
    timezoneId: 'Europe/Vienna',
    actionTimeout: 30000,
  },
  testDir: '.',
  projects: [
    {
      testMatch: '*tests/*.spec.ts',
    }
  ]
})
