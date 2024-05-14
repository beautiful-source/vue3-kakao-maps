import type { App, Plugin } from 'vue';
import {
  KakaoMap,
  KakaoMapMarker,
  KakaoMapCustomOverlay,
  KakaoMapInfoWindow,
  KakaoMapMarkerPolyline,
  KakaoMapPolyline
} from './components';

// `app.use()`에 쓰일 수 있는 플러그인
const Vue3KakaoMaps: Plugin = {
  install: (app: App) => {
    app.component('KakaoMap', KakaoMap);
    app.component('KakaoMapMarker', KakaoMapMarker);
    app.component('KakaoMapCustomOverlay', KakaoMapCustomOverlay);
    app.component('KakaoMapInfoWindow', KakaoMapInfoWindow);
    app.component('KakaoMapMarkerPolyline', KakaoMapMarkerPolyline);
    app.component('KakaoMapPolyline', KakaoMapPolyline);
  }
};

// plugin
export { Vue3KakaoMaps };
// components
export * from './components';
// utils
export * from './utils';
// types
export type * from './types';
export type * from './components/KakaoMap/types';
export type * from './components/KakaoMapCustomOverlay/types';
export type * from './components/KakaoMapInfoWindow/types';
export type * from './components/KakaoMapMarker/types';
export type * from './components/KakaoMapPolyline/types';
