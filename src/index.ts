import type { App, Plugin } from 'vue';
import KakaoMapVue from './components/KakaoMap/KakaoMap.vue';

// `app.use()`에 쓰일 수 있는 플러그인
const Vue3KakaoMaps: Plugin = {
  install: (app: App) => {
    // app.component("KakaoMap", KakaoMapVue);
  }
};

export { Vue3KakaoMaps, KakaoMapVue };
