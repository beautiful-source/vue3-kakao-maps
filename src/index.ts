import type { App, Plugin } from 'vue';
import { KakaoMap, KakaoMapMarker, KakaoMapCustomOverlay, KakaoMapInfoWindow } from './components';

// `app.use()`에 쓰일 수 있는 플러그인
const Vue3KakaoMaps: Plugin = {
  install: (app: App) => {
    app.component('KakaoMap', KakaoMap);
    app.component('KakaoMapMarker', KakaoMapMarker);
    app.component('KakaoMapCustomOverlay', KakaoMapCustomOverlay);
    app.component('KakaoMapInfoWindow', KakaoMapInfoWindow);
  }
};

export { Vue3KakaoMaps };
export * from './components';
export * from './utils';
export type * from './types';
