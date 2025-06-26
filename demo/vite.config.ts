import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: 'https://linx4200.github.io/vue-color/',
  define: {
    __IS_DEBUG__: !!process.env.VITE_DEBUG
  },
})
