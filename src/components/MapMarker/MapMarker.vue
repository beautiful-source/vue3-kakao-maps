<script setup lang="ts">
import { isKakaoMapApiLoaded } from '@/util/useKakao';
import { onBeforeUnmount, ref, watch, onMounted, inject, type Ref } from 'vue';

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

watch([() => isKakaoMapApiLoaded.value, () => mapRef], ([isKakaoMapApiLoaded, mapRef]) => {
  if (isKakaoMapApiLoaded && mapRef !== undefined) {
    initMarker(mapRef.value);
  }
});

onMounted(() => {
  if (isKakaoMapApiLoaded.value && mapRef !== undefined) {
    initMarker(mapRef.value);
  }
});
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
  <div>
    <slot></slot>
  </div>
</template>
