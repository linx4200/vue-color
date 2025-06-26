import { defineWorkspace } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

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
    plugins: [vue()],
    test: {
      include: [
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
    define: {
      __IS_DEBUG__: false
    },
  },
])
