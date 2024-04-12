import type { App } from 'vue'
import TestComponent from './components/TestComponent.vue'

export { TestComponent }

export default {
  install: (app: App) => {
    app.component('TestComponent', TestComponent)
  }
}
