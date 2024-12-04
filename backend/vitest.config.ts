import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // exclude file with 'flycheck_'
    exclude: ['**/flycheck_*', '**/node_modules/**'],

    coverage: {
      enabled: true,
      provider: 'istanbul',
      reporter: ['html'],
      reportsDirectory: './tests/coverage'
    },
  },
})
