/// <reference types="vitest" />

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue2';
import path from 'path';
import { cwd } from 'process';

// https://vite.dev/config/
export default defineConfig({
  optimizeDeps: {
    // noDiscovery: true,
    // include: void 0
    disabled: true
  },
  server: {
    fs: {
      // 允许访问的文件系统目录
      allow: [
        // 项目根目录
        path.resolve(__dirname),
        // 上级目录
        path.resolve(__dirname, '../src'),
        path.resolve(__dirname, '../tests')
      ]
    }
  },
  plugins: [vue()],
  build: {
    lib: {
      entry: 'index.ts',
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
  /** Configurations for Vitest */
  test: {
    // ui: true,
    // typecheck: {
    //   disabled: false
    // },
    dir: path.join(cwd(), '..'),
    include: [
      // './tests/components/**/*.{test,spec}.ts',
      './tests/components/common/AlphaSlider.spec.ts',
    ],
    browser: {
      provider: 'playwright',
      enabled: true,
      // at least one instance is required
      instances: [
        { browser: 'chromium' },
      ],
    },
    disableConsoleIntercept: true
  }
})
