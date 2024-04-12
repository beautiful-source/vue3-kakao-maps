import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueDevTools from 'vite-plugin-vue-devtools'
import path from 'node:path'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/main.ts'),
      formats: ['es'], // 트리쉐이킹을 활용하기 위해 es 포맷 설정
      name: 'Vue3KakaoMap'
    },
    rollupOptions: {
      external: ['vue'], // 최종 빌드에서 Vue 제외
      output: {
        globals: {
          Vue: 'vue'
        }
      }
    }
  },
  plugins: [vue(), VueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
