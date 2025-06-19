import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue2';

import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      'tinycolor2': resolve(__dirname, 'node_modules/tinycolor2/esm/tinycolor.js'),
      'material-colors': resolve(__dirname, 'node_modules/material-colors/dist/colors.es2015.js')
    }
  },
  build: {
    outDir: '../dist/vue2',
    lib: {
      entry: '../src/index.ts',
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
  }
})
