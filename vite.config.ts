/// <reference types="vitest" />
import vue from '@vitejs/plugin-vue';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import type { UserConfig } from 'vite'

// https://vite.dev/config/
export default {
  plugins: [vue()],
  define: {
    __IS_DEBUG__: !!process.env.VITE_DEBUG
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'VueColor',
      // the proper extensions will be added
      fileName: 'vue-color',
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['vue'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
  test: {
    projects: [
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
      }
    ]
  }
} satisfies UserConfig;
