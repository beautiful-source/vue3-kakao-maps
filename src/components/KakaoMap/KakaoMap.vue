<template>
  <div id="map" />
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import type { MapProps } from "./";

declare global {
  interface Window {
    kakao: any; // kakao map 관련 타입 정비시 수정 필요
  }
}
const { width = 40, height = 30, appKey, lat = 37.566826, lng = 126.9786567 } = defineProps<MapProps>();

const theme = {
  width: width + "rem",
  height: height + "rem",
  appKey
};

onMounted(() => {
  if (window.kakao?.maps !== undefined) {
    initMap();
  } else {
    const script = document.createElement("script");
    script.onload = () => {
      window.kakao.maps.load(() => {
        initMap();
      });
    };
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${theme.appKey}&autoload=false`;
    document.body.appendChild(script);
  }
});

const initMap = (): void => {
  const container = document.getElementById("map");
  const options = {
    center: new window.kakao.maps.LatLng(lat, lng),
    level: 3
  };
  window.kakao.maps.Map(container, options);
};
</script>

<style scoped>
#map {
  width: v-bind("theme.width");
  height: v-bind("theme.height");
}
</style>
