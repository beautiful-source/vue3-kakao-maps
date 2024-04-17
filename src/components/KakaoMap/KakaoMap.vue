<script setup lang="ts">
import { onMounted, ref } from 'vue';

export interface KakaoMapProps extends /* @vue-ignore */ Omit<kakao.maps.MapOptions, 'center'> {
  width?: number | string;
  height?: number | string;
  appKey: string;
  markerList?: any;
  // x, y로 받는건 안해서 추후 요청이 있다면 수정 필요
  lat: number;
  lng: number;
}

const { width, height, appKey, lat, lng, draggable } = withDefaults(defineProps<KakaoMapProps>(), {
  width: '40rem',
  height: '30rem',
  draggable: true
});

// 기본지도 생성
const theme = {
  width: typeof width === 'number' ? width + 'px' : width,
  height: typeof height === 'number' ? height + 'px' : height
};

const kakaoMapRef = ref<null | HTMLElement>(null);

onMounted(() => {
  if (window.kakao?.maps !== undefined) {
    initMap();
  } else {
    const script = document.createElement('script');
    script.onload = () => {
      kakao.maps.load(() => {
        initMap();
      });
    };
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false`;
    document.body.appendChild(script);
  }
});

const initMap = (): void => {
  const options = {
    center: new kakao.maps.LatLng(lat, lng),
    level: 3
  };
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
