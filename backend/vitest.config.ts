import { defineConfig } from 'vitest/config'
import { resolve } from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@/resources": resolve(__dirname, "resources"),
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
      reportsDirectory: process.env.VITEST_COVERAGE__REPORTSDIRECTORY || './tests/coverage',
      exclude: [
        // Default exclusions
        'coverage/**',
        'dist/**',
        'packages/*/test{,s}/**',
        '**/*.d.ts',
        'cypress/**',
        'test{,s}/**',
        'test{,-*}.{js,cjs,mjs,ts,tsx,jsx}',
        '**/*{.,-}test.{js,cjs,mjs,ts,tsx,jsx}',
        '**/*{.,-}spec.{js,cjs,mjs,ts,tsx,jsx}',
        '**/__tests__/**',
        '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*',
        '**/.{eslint,mocha,prettier}rc.{js,cjs,yml}',

        // Exclude features with validation and routes
        '**/features/**/*.validation.ts',
        '**/features/**/*.routes.ts'
      ]
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
