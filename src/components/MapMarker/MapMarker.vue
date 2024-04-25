<script setup lang="ts">
import { isKakaoMapApiLoaded } from '@/util/useKakao';
import { onBeforeUnmount, ref, watch } from 'vue';
import type { MapMarkerProps } from './types';

const props = defineProps<MapMarkerProps>();

const marker = ref<null | kakao.maps.Marker>(null);
const markerElement = ref<HTMLDivElement>();

const initMarker = (map: kakao.maps.Map): void => {
  if (props.lat === undefined || props.lng === undefined) {
    throw new Error('marker의 위치가 없습니다.');
  }
  const markerPosition = new kakao.maps.LatLng(props.lat, props.lng);
  marker.value = new kakao.maps.Marker({
    position: markerPosition
  });

  marker.value.setMap(map);
};

watch(
  () => isKakaoMapApiLoaded.value,
  (isKakaoMapApiLoaded) => {
    if (isKakaoMapApiLoaded) {
      initMarker(props.map);
    }
  },
  { immediate: true }
);

onBeforeUnmount(() => {
  marker.value?.setMap(null); // 컴포넌트 삭제될 때 map에서 marker 삭제
});

/**
 * map 변경감지
 */
watch([() => props.map], ([newMap]) => {
  // TODO: provide/inject 후 사라질 예정입니다.
  console.log('new map', newMap);
});

/**
 * lat, lng 변경감지
 */
watch([() => props.lat, () => props.lng], ([newLat, newLng]) => {
  if (isKakaoMapApiLoaded.value) {
    marker.value?.setPosition(new kakao.maps.LatLng(newLat, newLng));
  }
});
</script>

<template>
  <div ref="markerElement">
    <slot></slot>
  </div>
</template>
