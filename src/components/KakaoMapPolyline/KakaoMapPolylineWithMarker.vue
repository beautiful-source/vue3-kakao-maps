<script setup lang="ts">
import { isKakaoMapApiLoaded } from '@/util/useKakao';
import { computed, inject, ref, watch, type ComputedRef, type Ref } from 'vue';
import MapMarker from '../MapMarker/MapMarker.vue';
import type { KakaoMapMarkerListItem } from '../MapMarker/types';

type KakaoMapPolylineWithMarkerProps = {
  markerList: KakaoMapMarkerListItem[];
};

const props = defineProps<KakaoMapPolylineWithMarkerProps>();

const mapRef = inject<Ref<kakao.maps.Map>>('mapRef');

let polyline: kakao.maps.Polyline | null = null;

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
  polyline = new kakao.maps.Polyline({
    path: [],
    strokeWeight: 5, // 선의 두께 입니다
    strokeColor: '#FFAE00', // 선의 색깔입니다
    strokeOpacity: 0.7, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
    strokeStyle: 'solid' // 선의 스타일입니다
  });

  polyline.setMap(map);
};

const realMarkerList: Ref<kakao.maps.Marker[]> = ref([]);
const realLinePath: ComputedRef<kakao.maps.LatLng[]> = computed(() => {
  return realMarkerList.value.map((marker) => {
    return marker.getPosition();
  });
});

const updatePolyline = (marker: kakao.maps.Marker): void => {
  realMarkerList.value.push(marker);
  console.log(realLinePath.value, realMarkerList);

  polyline?.setPath(realLinePath.value);

  if (mapRef !== undefined) {
    polyline?.setMap(mapRef.value);
  }
};

const updateMarkerList = (marker: kakao.maps.Marker): void => {
  const targetIndex = realMarkerList.value.indexOf(marker);
  realMarkerList.value.splice(targetIndex, 1, marker);

  polyline?.setPath(realLinePath.value);
  if (mapRef !== undefined) {
    polyline?.setMap(mapRef.value);
  }
};
</script>

<template>
  <div v-if="props.markerList && mapRef !== null">
    <MapMarker
      v-for="(marker, index) in props.markerList"
      :id="index"
      :key="marker.key === undefined ? index : marker.key"
      :map="mapRef"
      :lat="marker.lat"
      :lng="marker.lng"
      :draggable="true"
      @init-marker="updatePolyline"
      @drag-end-marker="updateMarkerList"
    >
    </MapMarker>
    <slot></slot>
  </div>
</template>
