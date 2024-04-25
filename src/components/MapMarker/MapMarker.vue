<script setup lang="ts">
import { isKakaoMapApiLoaded } from '@/util/useKakao';
import { inject, onBeforeUnmount, ref, watch, type Ref } from 'vue';

/**
 * MapMarker 컴포넌트 생성을 위한 타입
 */
export type MapMarkerProps = {
  /**
   * 마커의 위도 값
   */
  lat: number;
  /**
   * 마커의 경도 값
   */
  lng: number;
  /**
   * 마커에 추가할 InfoWindow content
   */
  infoWindow?: string;
};

const props = defineProps<MapMarkerProps>();
// kakao api로 생성한 marker 객체
const marker = ref<null | kakao.maps.Marker>(null);
// 마커가 위치할 지도의 위도
const lat = ref<number>(props.lat);
// 마커가 위치할 지도의 경도
const lng = ref<number>(props.lng);
// 마커가 표시될 지도의 객체
const mapRef = inject<Ref<kakao.maps.Map>>('mapRef');

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

watch(
  [() => isKakaoMapApiLoaded.value, () => mapRef],
  ([isKakaoMapApiLoaded, mapRef]) => {
    if (isKakaoMapApiLoaded && mapRef !== undefined) {
      initMarker(mapRef.value);
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
watch([() => mapRef], ([newMap]) => {
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
  <div>
    <slot></slot>
  </div>
</template>
