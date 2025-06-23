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
    alias: [
      {
        find: 'tinycolor2',
        replacement: resolve(__dirname, '../node_modules/tinycolor2/esm/tinycolor.js'),
      },
      {
        find:'material-colors',
        replacement: resolve(__dirname, '../node_modules/material-colors/dist/colors.es2015.js'),
      },
      {
        find: /^vue-color\/vue2$/,
        // replacement: resolve(__dirname, '../../dist/vue2/vue-color.js')
        replacement: resolve(__dirname, '../../src/index.ts')
      },
      {
        find: /^vue-color\/vue2\/style.css$/,
        replacement: resolve(__dirname, '../../dist/vue2/vue-color.css')
      }
    ]
  }
})
