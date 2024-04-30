<script setup lang="ts">
import { isKakaoMapApiLoaded } from '@/util/useKakao';
import { computed, inject, ref, watch, type ComputedRef, type Ref } from 'vue';
import type { KakaoMapMarkerListItem } from './types';
import KakaoMapMarker from './KakaoMapMarker.vue';
import KakaoMapPolyline from '../KakaoMapPolyline/KakaoMapPolyline.vue';

/**
 * KakaoMapMarkerPolyline 컴포넌트 생성을 위한 타입
 */
type KakaoMapMarkerPolylineProps = {
  /**
   * 지도에 표시할 마커 리스트
   */
  markerList: KakaoMapMarkerListItem[];
};

// const emits = defineEmits(['dragEndKakaoMapMarker']);

const props = defineProps<KakaoMapMarkerPolylineProps>();

/**
 * 마커가 표시될 지도 객체
 */
const mapRef = inject<Ref<kakao.maps.Map>>('mapRef');

/**
 * 마커 객체 리스트 (드래그된 마커 추적)
 */
const mapMarkerList: Ref<kakao.maps.Marker[]> = ref([]);

let customOverlayList: kakao.maps.CustomOverlay[] = [];

const linePath: ComputedRef<kakao.maps.LatLng[]> = computed(() => {
  return props.markerList.map((item) => {
    return new kakao.maps.LatLng(item.lat, item.lng);
  });
});

const addMapMarker = (marker: kakao.maps.Marker): void => {
  mapMarkerList.value.push(marker);
};

const updateMarkerList = (marker: kakao.maps.Marker): void => {
  const backup = props.markerList;
  const targetIndex = mapMarkerList.value.indexOf(marker);

  console.log('에러나는 위치');

  backup[targetIndex].lat = marker.getPosition().getLat();
  backup[targetIndex].lng = marker.getPosition().getLng();

  // console.log('에러나는 위치2');

  // emits('dragEndKakaoMapMarker', backup);
};

const content = (order: string): string => {
  return `<div>${order}</div>`;
};

const initCustomOverlay = (): void => {
  props.markerList.forEach((item) => {
    const position = new kakao.maps.LatLng(item.lat, item.lng);

    const customOverlay = new kakao.maps.CustomOverlay({
      map: mapRef?.value,
      position,
      content: content(customOverlayList.length + ''),
      yAnchor: 0
    });
    customOverlayList.push(customOverlay);
  });
};

const resetCustomOverlay = (): void => {
  customOverlayList.forEach((item) => {
    item.setMap(null);
  });
  customOverlayList = [];
};

watch(
  [() => isKakaoMapApiLoaded.value, () => mapRef, () => mapRef?.value],
  ([isKakaoMapApiLoaded, mapRef, newMap]) => {
    if (isKakaoMapApiLoaded && mapRef !== undefined && newMap !== undefined) {
      initCustomOverlay();
    }
  },
  { immediate: true }
);

watch(
  () => props.markerList,
  () => {
    resetCustomOverlay();
    initCustomOverlay();
    // MapMarkerList도 갱신되어야 함
  },
  { deep: true }
);
</script>

<template>
  <div v-if="props.markerList && mapRef !== null">
    <KakaoMapMarker
      v-for="(marker, index) in props.markerList"
      :id="index"
      :key="marker.key === undefined ? index : marker.key"
      :map="mapRef"
      :lat="marker.lat"
      :lng="marker.lng"
      :draggable="true"
      @on-load-kakao-map-marker="addMapMarker"
      @drag-end-kakao-map-marker="updateMarkerList"
    >
    </KakaoMapMarker>
    <KakaoMapPolyline :linePath="linePath"></KakaoMapPolyline>

    <slot></slot>
  </div>
</template>
