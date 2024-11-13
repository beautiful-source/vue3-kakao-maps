<div align="center"><a href="https://vuejs.org">
  <img width="100" src="https://vuejs.org/images/logo.png" alt="Vue logo"></a>
  <img width="100" src="https://t1.kakaocdn.net/kakaocorp/kakaocorp/admin/1ca66319017800001.png" alt="카카오맵 api 이미지" width="200"/>
</div>

<h1>vue3-kakao-maps</h1>

> **Vue3로 카카오맵을 가장 손쉽게 사용하는 법.**

`vue3-kakao-maps`는 `Vue3`로 [Kakao Map API](https://apis.map.kakao.com/)를 손쉽게 사용할 수 있도록 개발된 컴포넌트 라이브러리입니다.

카카오맵 API의 `지도`, `마커`, `인포윈도우`, `커스텀 오버레이`, `마커 클러스터`등을 컴포넌트 형태로 제공합니다.

사용 예시 및 컴포넌트 별 세부 속성값은 [**Docs**](https://vue3-kakao-maps-docs.vercel.app/components/kakaoMap)에서 확인하실 수 있습니다.

<p align="center">
  <a href="https://npmcharts.com/compare/vue3-kakao-maps?minimal=true"><img src="https://img.shields.io/npm/dm/vue3-kakao-maps.svg?sanitize=true" alt="Downloads"></a>
  <a href="https://www.npmjs.com/package/vue3-kakao-maps"><img src="https://img.shields.io/npm/v/vue3-kakao-maps.svg?sanitize=true" alt="Version"></a>
  <a href="https://www.npmjs.com/package/vue"><img src="https://img.shields.io/npm/l/vue.svg?sanitize=true" alt="License"></a>
</p>

## 시작하기

### 설치

**NPM**

```
npm i vue3-kakao-maps
```

**Yarn**

```
yarn add vue3-kakao-maps
```

**PNPM**

```
pnpm install vue3-kakao-maps
```

### 첫 지도 그리기

**1. 카카오맵 API 로드**

`main.{js|ts}`에서 `useKakao('API key')` 호출을 통해 카카오맵 API를 로드합니다.

참고: API key 발급 관련 내용은 [공식 문서](https://apis.map.kakao.com/web/guide/)을 참고해주세요.

```js
import { createApp } from 'vue';
import App from './App.vue';
import { useKakao } from 'vue3-kakao-maps/@utils';

useKakao('API key');
createApp(App).mount('#app');
```

**2. 지도 컴포넌트 호출**

카카오맵 지도를 띄우기 위해서 `KakaoMap` 컴포넌트를 사용합니다. `props`를 통해 카카오맵 API에서 제공하는 다양한 [`option`](https://apis.map.kakao.com/web/documentation/#Map)을 전달할 수 있습니다.

```vue
<script setup>
import { KakaoMap, KakaoMapMarker } from 'vue3-kakao-maps';
const coordinate = {
  lat: 37.566826,
  lng: 126.9786567
};
</script>

<template>
  <KakaoMap :lat="coordinate.lat" :lng="coordinate.lng" :draggable="true">
    <KakaoMapMarker :lat="coordinate.lat" :lng="coordinate.lng"></KakaoMapMarker>
  </KakaoMap>
</template>
```

## `vue3-kakao-maps`로 만든 결과물

`vue3-kakao-maps`에서 제공하는 `마커`, `커스텀 오버레이`, `폴리라인`, `키워드 검색`을 활용한 예제입니다. 여러 개의 마커를 사용하거나 이벤트를 추가할 수 있습니다.

   <img width="100%" src="https://github.com/user-attachments/assets/a372e84b-c8fa-4cfa-85bd-cbe8277a3548" alt="데모 페이지"/>

## 📧 Contact

문의사항이 있거나 도움이 필요한 경우 Github 이슈를 달아주세요!

## 기여하기

아직 Kakao 지도 Web API를 100% 구현하지 못했습니다.
버그 또는 미구현 사항을 보완해서 Pull Request를 보내주시면 같이 잘 쓰도록 하겠습니다.
