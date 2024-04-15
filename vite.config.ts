import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import VueDevTools from "vite-plugin-vue-devtools";
import path from "node:path";
import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      // 트리쉐이킹을 활용하기 위해 es 포맷 설정
      // formats: ['es'],
      name: "Vue3KakaoMaps",
      fileName: (format) => `index.${format}.js`
    },
    rollupOptions: {
      // 최종 빌드에서 Vue 제외
      external: ["vue"],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: "Vue"
        }
      }
    }
  },
  plugins: [vue(), VueDevTools(), dts()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url))
    }
  }
});
