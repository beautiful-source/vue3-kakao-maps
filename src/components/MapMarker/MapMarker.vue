<script setup lang="ts">
import { isKakaoMapApiLoaded } from '@/util/useKakao';
import { onBeforeUnmount, ref, watch } from 'vue';

export type MapMarkerProps = {
  /**
   * 마커가 추가될 카카오맵
   */
  map: kakao.maps.Map;
  /**
   * 마커의 위도 좌표
   */
  lat: number;
  /**
   * 마커의 경도 좌표
   */
  lng: number;
  /**
   * 마커와 함께 쓰이는 인포윈도우
   */
  infoWindow?: any;
  /**
   * 마커와 함께 쓰이는 커스텀 오버레이
   */
  customOverlay?: any;
};

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
