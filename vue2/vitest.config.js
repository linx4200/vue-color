import vue from '@vitejs/plugin-vue2';
import { defineConfig } from 'vitest/config';
import { cwd } from 'process';
import path from 'path';

export default defineConfig({
  plugins: [vue()],
  test: {
    dir: path.join(cwd(), '..'),
    include: [
      './tests/components/**/*.{test,spec}.ts',
    ],
    browser: {
      provider: 'playwright',
      enabled: true,
      // at least one instance is required
      instances: [
        { browser: 'chromium' },
      ],
    },
  }
});