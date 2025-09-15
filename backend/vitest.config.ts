import { defineConfig } from 'vitest/config'
import { resolve } from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  test: {
    globals: true, // Use Vitest globals (describe, it, expect)
    environment: 'node', // Specify the environment
    clearMocks: true, // Automatically clear mocks between tests
    setupFiles: ['./vitest.setup.ts'], // not needed for now

    // exclude file with 'flycheck_'
    exclude: [
      '**/flycheck_*',
      '**/node_modules/**',
      "scripts",
      'dist/**',
      "resources",
    ],

    coverage: {
      enabled: true,
      provider: 'istanbul',
      reporter: ['html'],
      reportsDirectory: process.env.VITEST_COVERAGE__REPORTSDIRECTORY || './tests/coverage'
    },

    env: {
      LOKI_HOST: null,
      NODE_ENV: 'development',
      RIS_MEMBER_ID: 'FWF_Test', // TODO set this to FA1_Test for testing!
      RIS_TEST_DATA: '2024-09-04_testdata_projects_updated.json',
      JWT_SECRET: 'mysecret',
      JWT_EXPIRES_IN: '1h',
    }
  },
})
