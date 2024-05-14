<script setup lang="ts">
import { isKakaoMapApiLoaded } from '@/utils';
import { computed, inject, onBeforeUnmount, watch, type ComputedRef, type Ref } from 'vue';
import type { KakaoMapPolylineProps } from './types';

const props = withDefaults(defineProps<KakaoMapPolylineProps>(), {
  strokeWeight: 3,
  strokeColor: '#F10000',
  strokeOpacity: 0.6,
  strokeStyle: 'solid'
});

/**
 * 폴리라인이 표시될 지도 객체
 */
const mapRef = inject<Ref<kakao.maps.Map>>('mapRef');

/**
 * 지도에 표시할 폴리라인 객체
 */
let polyline: kakao.maps.Polyline | null = null;

/**
 * 폴리라인이 지나갈 경로
 */
const linePath: ComputedRef<kakao.maps.LatLng[]> = computed(() => {
  return props.latLngList.map((item) => {
    return new kakao.maps.LatLng(item.lat, item.lng);
  });
});

/**
 * 폴리라인 객체를 생성하는 함수
 */
const initPolyline = (map: kakao.maps.Map): void => {
  polyline = new kakao.maps.Polyline({
    path: linePath.value,
    endArrow: props.endArrow,
    strokeWeight: props.strokeWeight,
    strokeColor: props.strokeColor,
    strokeOpacity: props.strokeOpacity,
    strokeStyle: props.strokeStyle,
    zIndex: props.zIndex
  });

  polyline.setMap(map);
};

/**
 * 상위 컴포넌트에서 map을 주입받으면 폴리라인 생성
 */
watch(
  [() => isKakaoMapApiLoaded.value, () => mapRef?.value, () => isKakaoMapApiLoaded, () => mapRef],
  ([isKakaoMapApiLoaded, mapRef]) => {
    if (isKakaoMapApiLoaded && mapRef !== undefined && mapRef !== null) {
      initPolyline(mapRef);
    }
  },
  { immediate: true }
);

/**
 * props의 linePath가 변경되면 폴리라인 경로 지정
 */
watch(
  () => props.latLngList,
  () => {
    polyline?.setPath(linePath.value);
  },
  { deep: true }
);

/**
 * 화살표 여부 변경 감지
 */
watch(
  () => props.endArrow,
  () => {
    polyline?.setMap(null);
    if (mapRef !== undefined) {
      initPolyline(mapRef.value);
    }
  }
);

/**
 * stroke 옵션 변경 감지
 */
watch(
  [() => props.strokeWeight, () => props.strokeColor, () => props.strokeOpacity, () => props.strokeStyle],
  ([strokeWeight, strokeColor, strokeOpacity, strokeStyle]) => {
    polyline?.setOptions({
      strokeWeight,
      strokeColor,
      strokeOpacity,
      strokeStyle
    });
  }
);

/**
 * zIndex 변경 감지
 */
watch(
  () => props.zIndex,
  (zIndex) => {
    if (zIndex !== undefined) {
      polyline?.setZIndex(zIndex);
    }
  }
);

/**
 * 언마운트되면 map에서 폴리라인 삭제
 */
onBeforeUnmount(() => {
  polyline?.setMap(null);
});
</script>

<template>
  <div>
    <slot></slot>
  </div>
</template>
