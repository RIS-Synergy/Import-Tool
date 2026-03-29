import { defineConfig } from '@playwright/test'
import { resolve, join } from 'path';
import { config } from 'dotenv';

// Determine the env variables source
if (process.env.NODE_ENV == 'development') {
  config({ path: resolve(process.cwd(), '.env.dev') });
  console.log('Using development environment variables from .env.dev');
  console.log('NODE_ENV', process.env.NODE_ENV)
  console.log('PLAYWRIGHT_BASE_URL', process.env.PLAYWRIGHT_BASE_URL)
  console.log('BACKEND_API_PROXY', process.env.BACKEND_API_PROXY)
} else if (process.env.NODE_ENV == 'ci') {
  console.log('Using CI environment variables from the compose file');
  console.log('NODE_ENV', process.env.NODE_ENV)
  console.log('PLAYWRIGHT_BASE_URL', process.env.PLAYWRIGHT_BASE_URL)
  console.log('BACKEND_API_PROXY', process.env.BACKEND_API_PROXY)
} else {
  console.log('NODE_ENV', process.env.NODE_ENV)
  throw new Error('NODE_ENV must be set to `development` or `ci`');
}

// const vidDir = join(process.cwd(), process.env.PLAYWRIGHT_HTML_OUTPUT_DIR, 'videos');
// console.log('📹 Videos will be stored in:', vidDir)

export default defineConfig({
  timeout: 120000,
  reporter: [['html', { open: 'never',}]],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL,
    ignoreHTTPSErrors: true,
    locale: 'en-US',
    timezoneId: 'Europe/Vienna',
    actionTimeout: 60000,
  },
  testDir: '.',
  outputDir: process.env.PLAYWRIGHT_OUTPUT_DIR,
  projects: [
    { name: 'setup', testMatch: /.*\.setup\.ts/ },
    {
      name: 'dev',
      use: {
        browserName: "chromium",
        headless: true, // set to false if you want to see the browser
        video: "on",
        trace: "on",
        screenshot: "on",
      },
      testMatch: '*tests/*.spec.ts',
      dependencies: ['setup'],
    },
    {
      name: 'ci',
      use: {
        browserName: "chromium",
        headless: true,
        video: "retain-on-failure",
        trace: "on",
        screenshot: "on",
      },
      testMatch: '*tests/*.spec.ts',
      testIgnore: /.*dev\.spec\.ts/,
      dependencies: ['setup'],
    },
  ],
  globalSetup: "global-setup.ts",
  globalTeardown: "global-teardown.ts"
})
