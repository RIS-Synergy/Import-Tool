import { defineConfig } from '@playwright/test'
import { resolve } from 'path';
import { config } from 'dotenv';

// Determine the env variables source
if (process.env.NODE_ENV == 'development') {
  config({ path: resolve(process.cwd(), '.env.dev') });
  console.log('Using development environment variables from .env.dev');
  console.log('NODE_ENV', process.env.NODE_ENV)
  console.log('PLAYWRIGHT_BASE_URL', process.env.PLAYWRIGHT_BASE_URL)
} else if (process.env.NODE_ENV == 'ci') {
  console.log('Using CI environment variables from the compose file');
  console.log('NODE_ENV', process.env.NODE_ENV)
  console.log('PLAYWRIGHT_BASE_URL', process.env.PLAYWRIGHT_BASE_URL)
} else {
  console.log('NODE_ENV', process.env.NODE_ENV)
  throw new Error('NODE_ENV must be set to `development` or `ci`');
}

export default defineConfig({
  reporter: [
    ['html', { open: 'never', }]],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    ignoreHTTPSErrors: true,
    locale: 'en-US',
    timezoneId: 'Europe/Vienna',
    actionTimeout: 60000,
  },
  testDir: '.',
  projects: [
    {
      testMatch: '*tests/*.spec.ts',
    }
  ]
})
