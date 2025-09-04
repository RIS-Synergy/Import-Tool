import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // exclude file with 'flycheck_'
    exclude: [
      '**/flycheck_*',
      '**/node_modules/**',
      "scripts",
      "resources",
    ],

    coverage: {
      enabled: true,
      provider: 'istanbul',
      reporter: ['html'],
      reportsDirectory: process.env.VITEST_COVERAGE__REPORTSDIRECTORY || './tests/coverage'
    },

    setupFiles: ['./vitest.setup.ts'],

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
