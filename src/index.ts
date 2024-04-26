import type { App, Plugin } from 'vue';
import { KakaoMap, KakaoMapMarker, KakaoMapCustomOverlay, KakaoMapInfoWindow } from './components';
import useKakao from './util/useKakao';

// `app.use()`에 쓰일 수 있는 플러그인
const Vue3KakaoMaps: Plugin = {
  install: (app: App) => {
    app.component('KakaoMap', KakaoMap);
    app.component('KakaoMapMarker', KakaoMapMarker);
    app.component('KakaoMapCustomOverlay', KakaoMapCustomOverlay);
    app.component('KakaoMapInfoWindow', KakaoMapInfoWindow);
  }
};

export { Vue3KakaoMaps, KakaoMap, KakaoMapMarker, useKakao, KakaoMapCustomOverlay, KakaoMapInfoWindow };
