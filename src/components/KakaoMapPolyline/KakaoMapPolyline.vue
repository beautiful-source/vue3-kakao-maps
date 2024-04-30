<script setup lang="ts">
import { isKakaoMapApiLoaded } from '@/util/useKakao';
import { inject, onBeforeUnmount, watch, type Ref } from 'vue';

/**
 * KakaoMapPolyline 컴포넌트 생성을 위한 타입
 */
type KakaoMapPolylineProps = {
  linePath: kakao.maps.LatLng[];
};

const props = defineProps<KakaoMapPolylineProps>();

/**
 * 폴리라인이 표시될 지도 객체
 */
const mapRef = inject<Ref<kakao.maps.Map>>('mapRef');

/**
 * 지도에 표시할 폴리라인 객체
 */
let polyline: kakao.maps.Polyline | null = null;

/**
 * 폴리라인 객체를 생성하는 함수
 */
const initPolyline = (map: kakao.maps.Map): void => {
  polyline = new kakao.maps.Polyline({
    path: props.linePath,
    strokeWeight: 5, // 선의 두께 입니다
    strokeColor: '#FFAE00', // 선의 색깔입니다
    strokeOpacity: 0.7, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
    strokeStyle: 'solid' // 선의 스타일입니다
  });

  polyline.setMap(map);
};

watch(
  [() => isKakaoMapApiLoaded.value, () => mapRef, () => mapRef?.value],
  ([isKakaoMapApiLoaded, mapRef, newMap]) => {
    if (isKakaoMapApiLoaded && mapRef !== undefined && newMap !== undefined) {
      initPolyline(newMap);
    }
  },
  { immediate: true }
);

watch(
  () => props.linePath,
  () => {
    polyline?.setPath(props.linePath);
    if (mapRef !== undefined) {
      polyline?.setMap(mapRef.value);
    }
  },
  { deep: true }
);

onBeforeUnmount(() => {
  polyline?.setMap(null);
});
</script>

<template>
  <div></div>
</template>
