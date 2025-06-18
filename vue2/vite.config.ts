import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue2'
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  // clearScreen: false,
  // server: {
  //   fs: {
  //     // 允许访问的文件系统目录
  //     allow: [
  //       // 项目根目录
  //       resolve(__dirname),
  //       // 上级目录
  //       resolve(__dirname, '../src'),
  //       resolve(__dirname, '../tests')
  //     ]
  //   }
  // },
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
  }
})
