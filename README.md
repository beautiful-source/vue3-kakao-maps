<div align="center"><a href="https://vuejs.org">
  <img width="100" src="https://vuejs.org/images/logo.png" alt="Vue logo"></a>
  <img width="100" src="https://drive.google.com/uc?export=view&id=1nIhN4NpBOQaY-jwYnzP7yMtMVvKAI18g" alt="카카오맵 api 이미지" width="200"/>
</div>

<h1>vue3-kakao-maps</h1>

> **Vue3로 카카오맵을 가장 손쉽게 사용하는 법.**

`vue3-kakao-maps`는 `Vue3`로 [Kakao Map API](https://apis.map.kakao.com/)를 손쉽게 사용할 수 있도록 개발된 컴포넌트 라이브러리입니다.

카카오맵 API의 `지도`, `마커`, `인포윈도우`, `커스텀 오버레이`, `마커 클러스터`등을 컴포넌트 형태로 제공합니다.

사용 예시 및 컴포넌트 별 세부 속성값은 [**Docs**](https://vue3-kakao-maps-docs.vercel.app/components/kakaoMap)에서 확인하실 수 있습니다.

[`vue3-kakao-maps`에 관한 소중한 생각을 남겨주세요!](https://forms.gle/qZty6EQDRD8Q3b3i9)

<p align="center">
<!--   <a href="https://circleci.com/gh/vuejs/vue/tree/dev"><img src="https://img.shields.io/circleci/project/github/vuejs/vue/dev.svg?sanitize=true" alt="Build Status"></a>
  <a href="https://codecov.io/github/vuejs/vue?branch=dev"><img src="https://img.shields.io/codecov/c/github/vuejs/vue/dev.svg?sanitize=true" alt="Coverage Status"></a> -->
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

## 📧 Contact

문의사항이 있거나 도움이 필요한 경우 하단의 카카오톡 채널로 연락주시기 바립니다.

http://pf.kakao.com/_iiZUG/chat
