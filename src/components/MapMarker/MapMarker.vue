<script setup lang="ts">
import { isKakaoMapApiLoaded } from '@/util/useKakao';
import { onBeforeUnmount, ref, watch } from 'vue';
import type { MapMarkerProps } from './types';

const props = defineProps<MapMarkerProps>();

const marker = ref<null | kakao.maps.Marker>(null);
const markerElement = ref<HTMLDivElement>();

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

/**
 * map 변경감지
 */
watch([() => props.map], ([newMap]) => {
  marker.value?.setMap(null);
  marker.value?.setMap(newMap);
});

/**
 * lat, lng 변경감지
 */
watch([() => props.lat, () => props.lng], ([newLat, newLng]) => {
  if (isKakaoMapApiLoaded.value) {
    marker.value?.setPosition(new kakao.maps.LatLng(newLat, newLng));
  }
});

// TODO: 나머지 `props` 에 대한 watch 작성
</script>

<template>
  <div ref="markerElement">
    <slot></slot>
  </div>
</template>
