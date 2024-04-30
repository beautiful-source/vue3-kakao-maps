import vue from '@vitejs/plugin-vue';
import path from 'node:path';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import VueDevTools from 'vite-plugin-vue-devtools';

export default defineConfig({
  build: {
    lib: {
      entry: { index: path.resolve(__dirname, 'src/index.ts') },
      name: 'Vue3KakaoMaps',
      fileName: (format, entryName) => (format === 'es' ? `${entryName}.js` : `${entryName}.cjs`)
    },
    rollupOptions: {
      // 최종 빌드에서 제외할 외부 라이브러리
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue'
        }
      }
    }
  },
  plugins: [vue(), VueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    host: '0.0.0.0'
  }
});
