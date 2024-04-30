<script setup lang="ts">
import { isKakaoMapApiLoaded } from '@/util/useKakao';
import { inject, watch, type Ref } from 'vue';
import type { KakaoMapMarkerListItem } from '../KakaoMapMarker/types';

export type KakaoMapPolylineProps = {
  pathList: KakaoMapMarkerListItem[];
};

const props = defineProps<KakaoMapPolylineProps>();

const mapRef = inject<Ref<kakao.maps.Map>>('mapRef');

let polyline = null;

watch(
  [() => isKakaoMapApiLoaded.value, () => mapRef, () => mapRef?.value],
  ([isKakaoMapApiLoaded, mapRef, newMap]) => {
    if (isKakaoMapApiLoaded && mapRef !== undefined && newMap !== undefined) {
      initPolyline(newMap);
    }
  },
  { immediate: true }
);

const initPolyline = (map: kakao.maps.Map): void => {
  const linePath = props.pathList.map((e) => {
    return new kakao.maps.LatLng(e.lat, e.lng);
  });

  polyline = new kakao.maps.Polyline({
    path: linePath,
    strokeWeight: 5, // 선의 두께 입니다
    strokeColor: '#FFAE00', // 선의 색깔입니다
    strokeOpacity: 0.7, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
    strokeStyle: 'solid' // 선의 스타일입니다
  });

  polyline.setMap(map);
};
</script>

<template>
  <div></div>
</template>
