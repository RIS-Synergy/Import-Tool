import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  reporter: [
    ['html', { outputFolder: 'test-results' }]
  ],
  use: {
    baseURL: 'http://localhost:3032/',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    ignoreHTTPSErrors: true,
    locale: 'en-US',
    timezoneId: 'Europe/Vienna',
  },
  testDir: '../tests',
  outputDir: '../tests/test-results',
  projects: [
    {
      testMatch: '*tests/*.spec.ts',
    }
  ]
})
