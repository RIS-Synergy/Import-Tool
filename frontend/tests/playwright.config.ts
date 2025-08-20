import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  reporter: [
    ['html', {
      outputFolder: 'test-results',
      open: 'never',
    }]
  ],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    ignoreHTTPSErrors: true,
    locale: 'en-US',
    timezoneId: 'Europe/Vienna',
    actionTimeout: 10000,
  },
  testDir: '../tests',
  // for local: '../tests/test-results',
  outputDir: process.env.PLAYWRIGHT_OUTPUT_DIR,
  projects: [
    {
      testMatch: '*tests/*.spec.ts',
    }
  ]
})
