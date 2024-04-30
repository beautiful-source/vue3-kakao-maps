<script setup lang="ts">
import { isKakaoMapApiLoaded } from '@/util/useKakao';
import { computed, inject, onBeforeUnmount, ref, watch, type ComputedRef, type Ref } from 'vue';
import KakaoMapMarker from '../KakaoMapMarker/KakaoMapMarker.vue';
import type { KakaoMapMarkerListItem } from '../KakaoMapMarker/types';

type KakaoMapPolylineWithMarkerProps = {
  markerList: KakaoMapMarkerListItem[];
};

const props = defineProps<KakaoMapPolylineWithMarkerProps>();

const mapRef = inject<Ref<kakao.maps.Map>>('mapRef');

let polyline: kakao.maps.Polyline | null = null;

const realMarkerList: Ref<kakao.maps.Marker[]> = ref([]);

let customOverlayList: kakao.maps.CustomOverlay[] = [];

const realLinePath: ComputedRef<kakao.maps.LatLng[]> = computed(() => {
  return props.markerList.map((item) => {
    return new kakao.maps.LatLng(item.lat, item.lng);
  });
});

const initPolyline = (map: kakao.maps.Map): void => {
  polyline = new kakao.maps.Polyline({
    path: [],
    strokeWeight: 5, // 선의 두께 입니다
    strokeColor: '#FFAE00', // 선의 색깔입니다
    strokeOpacity: 0.7, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
    strokeStyle: 'solid' // 선의 스타일입니다
  });

  polyline.setMap(map);
};

const updatePolyline = (marker: kakao.maps.Marker): void => {
  realMarkerList.value.push(marker);

  polyline?.setPath(realLinePath.value);

  if (mapRef !== undefined) {
    polyline?.setMap(mapRef.value);
  }
};

const updateMarkerList = (marker: kakao.maps.Marker): void => {
  const targetIndex = realMarkerList.value.indexOf(marker);
  realMarkerList.value.splice(targetIndex, 1, marker);

  // props 변경
  props.markerList[targetIndex].lat = marker.getPosition().getLat();
  props.markerList[targetIndex].lng = marker.getPosition().getLng();

  realLinePath.value[targetIndex] = marker.getPosition();

  // customOverlay 교체 로직 작성
  // customOverlayList[targetIndex].setPosition(realLinePath.value[targetIndex]);

  polyline?.setPath(realLinePath.value);
  if (mapRef !== undefined) {
    polyline?.setMap(mapRef.value);
  }
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
      initPolyline(newMap);
      initCustomOverlay();
    }
  },
  { immediate: true }
);

watch(
  () => props.markerList,
  () => {
    polyline?.setPath(realLinePath.value);
    if (mapRef !== undefined) {
      polyline?.setMap(mapRef.value);
    }

    resetCustomOverlay();
    initCustomOverlay();
  },
  { deep: true }
);

onBeforeUnmount(() => {
  polyline?.setMap(null);
});
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
      @on-load-kakao-map-marker="updatePolyline"
      @drag-end-kakao-map-marker="updateMarkerList"
    >
    </KakaoMapMarker>
    <slot></slot>
  </div>
</template>
