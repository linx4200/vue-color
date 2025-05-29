import { resolve } from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue2';

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  // cacheDir: 'node_modules/.vite/vue2',
  clearScreen: false,
  build: {
    // outDir: 'dist/vue2',  // different output dir
    lib: {
      entry: resolve(__dirname, '../../src/index.ts'),
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
})
