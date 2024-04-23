<script setup lang="ts">
import { isKakaoMapApiLoaded } from '@/util/useKakao';
import { onBeforeUnmount, ref, watch } from 'vue';

export type MapMarkerProps = {
  map: kakao.maps.Map;
  lat: number;
  lng: number;
  infoWindow?: string;
};

const props = defineProps<MapMarkerProps>();

const marker = ref<null | kakao.maps.Marker>(null);
const markerElement = ref<HTMLDivElement>();
const lat = ref<number>(props.lat);
const lng = ref<number>(props.lng);

watch(
  () => isKakaoMapApiLoaded.value,
  (isKakaoMapApiLoaded) => {
    if (isKakaoMapApiLoaded) {
      initMarker(props.map);
    }
  }
);

onBeforeUnmount(() => {
  marker.value?.setMap(null); // 컴포넌트 삭제될 때 map에서 marker 삭제
});

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
</script>

<template>
  <div ref="markerElement">
    <slot></slot>
  </div>
</template>
