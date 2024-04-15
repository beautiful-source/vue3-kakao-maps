import type { App, Plugin } from 'vue'
import TestComponent from './components/TestComponent.vue'
import { hello } from './utils/hello'

// `app.use()`에 쓰일 수 있는 플러그인
const Vue3KakaoMaps: Plugin = {
  install: (app: App) => {
    app.component('TestComponent', TestComponent)
  }
}

export { Vue3KakaoMaps, hello, TestComponent }
