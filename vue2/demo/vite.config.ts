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
      'tinycolor2': resolve(__dirname, '../node_modules/tinycolor2/esm/tinycolor.js'),
      'material-colors': resolve(__dirname, '../node_modules/material-colors/dist/colors.es2015.js')
    }
  }
})
