import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // exclude file with 'flycheck_'
    exclude: [
      '**/flycheck_*',
      '**/node_modules/**',
      "scripts",
      "resources"
    ],

    coverage: {
      enabled: true,
      provider: 'istanbul',
      reporter: ['html'],
      reportsDirectory: './tests/coverage'
    },

    env: {
      LOKI_HOST: null
    }
  },
})
