import { defineWorkspace } from 'vitest/config'

export default defineWorkspace([
  {
    test: {
      include: [
        'tests/utils/**/*.unit.{test,spec}.ts',
      ],
      name: 'unit',
      environment: 'node',
    },
  },
  {
    test: {
      include: [
        'tests/common/**/*.{test,spec}.ts',
        'tests/components/**/*.{test,spec}.ts',
        'tests/utils/**/*.browser.{test,spec}.ts',
      ],
      name: 'browser',
      browser: {
        provider: 'playwright',
        enabled: true,
        // at least one instance is required
        instances: [
          { browser: 'chromium' },
        ],
      },
    },
  },
])
