<template>
    <div id="map"></div>
</template>

<script setup props="props">
import { ref, onMounted } from 'vue';

const map = ref(null);
const { width, height, appKey } = props;

onMounted(() => {
  const script = document.createElement('script');
  script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}`;
  script.async = true;
  script.onload = () => {
    initMap();
  };
  document.head.appendChild(script);
});

function initMap() {
  const container = map.value;
  const options = {
    center: new kakao.maps.LatLng(37.566826, 126.9786567),
    level: 3,
  };
  const kakaoMap = new kakao.maps.Map(container, options);
}
</script>

<style scoped>
#map {
  --custom-width: {{ width }}px;
  --custom-height: {{ height }}px;
  width: var(--custom-width);
  height: var(--custom-height);
}
</style>
