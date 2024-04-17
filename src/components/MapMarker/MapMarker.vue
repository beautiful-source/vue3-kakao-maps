<script setup lang="ts">
import { onMounted, ref } from 'vue';

const props = defineProps<{
  map: kakao.maps.Map;
  lat: number;
  lng: number;
}>();

const marker = ref<null | kakao.maps.Marker>(null);
const markerElement = ref<HTMLDivElement>();
const lat = ref<number>(props.lat);
const lng = ref<number>(props.lng);

const initMarker = (map: kakao.maps.Map): void => {
  if (lat.value === undefined || lng.value === undefined) {
    throw new Error('marker의 위치가 없습니다.');
  }
  const markerPosition = new kakao.maps.LatLng(lat.value, lng.value);
  marker.value = new kakao.maps.Marker({
    position: markerPosition
  });

  marker.value.setMap(map);
};
onMounted(() => {
  initMarker(props.map);
});
</script>

<template>
  <div ref="markerElement" id="aaaaaaaaaaaaaaaaaaaaaaaaaaaaa">
    <slot></slot>
  </div>
</template>
