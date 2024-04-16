<script setup lang="ts">
import { onMounted, ref } from 'vue';

declare global {
  interface Window {
    kakao: any; // kakao map 관련 타입 정비시 수정 필요
    Map: any;
  }
}
export type KakaoMapProps = {
  width?: number | string;
  height?: number | string;
  appKey: string;
  lat?: number; // center
  lng?: number; // center
  markerList?: any;
  container?: any;
  center?: number;
  mapTypeId?: any;
  draggable: boolean;
  disableDoubleClick?: boolean;
  projectionId?: any;
  tileAnimation?: boolean;
  keyboardShortcuts?: any;
};

const { width, height, appKey, lat, lng, draggable } = withDefaults(defineProps<KakaoMapProps>(), {
  width: '40rem',
  height: '30rem',
  lat: 37.566826,
  lng: 126.9786567,
  draggable: true
});

// 기본지도 생성
const theme = {
  width: typeof width === 'number' ? width + 'rem' : width,
  height: typeof height === 'number' ? height + 'rem' : height
};

const kakaoMapRef = ref<null | HTMLElement>(null);

onMounted(() => {
  if (window.kakao?.maps !== undefined) {
    initMap();
  } else {
    const script = document.createElement('script');
    script.onload = () => {
      window.kakao.maps.load(() => {
        initMap();
      });
    };
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false`;
    document.body.appendChild(script);
  }
});

const initMap = (): void => {
  const options = {
    center: new window.kakao.maps.LatLng(lat, lng),
    level: 3
  };
  console.log(kakaoMapRef.value);
  if (kakaoMapRef.value !== null) {
    const map = new window.kakao.maps.Map(kakaoMapRef.value, options);
    map.setDraggable(draggable);
  }
};
</script>

<template>
  <div class="kakao-map" ref="kakaoMapRef"></div>
</template>

<style scoped>
.kakao-map {
  width: v-bind('theme.width');
  height: v-bind('theme.height');
}
</style>
