<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { MapProps } from './types';

const { width = 40, height = 30, appKey, lat = 37.566826, lng = 126.9786567 } = defineProps<MapProps>();
const theme = {
  width: width + 'rem',
  height: height + 'rem',
  appKey
};

const kakaoMapRef = ref<null | HTMLElement>(null);

onMounted(() => {
  if (kakao.maps !== undefined) {
    initMap();
  } else {
    const script = document.createElement('script');
    script.onload = () => {
      kakao.maps.load(() => {
        initMap();
      });
    };
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${theme.appKey}&autoload=false`;
    document.body.appendChild(script);
  }
});

const initMap = (): void => {
  const options = {
    center: new kakao.maps.LatLng(lat, lng),
    level: 3
  };
  if (kakaoMapRef.value != null) {
    (() => new kakao.maps.Map(kakaoMapRef.value, options))();
  }
};
</script>

<template>
  <div class="kakao-map" ref="kakaoMapRef" />
</template>

<style scoped>
.kakao-map {
  width: v-bind('theme.width');
  height: v-bind('theme.height');
}
</style>
