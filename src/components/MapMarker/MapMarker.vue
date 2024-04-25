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
  /**
   * 마커의 이미지
   */
  // TODO: 마커 이미지 타입 추가
  /**
   * 마커의 타이틀 속성 값 (툴팁)
   */
  title?: string;

  /**
   * 마커의 드래그 가능 여부
   */
  draggable?: boolean;

  /**
   * 마커의 클릭 가능 여부
   */
  clickable?: boolean;

  /**
   * 마커의 z-index 속성 값
   */
  zIndex?: number;

  /**
   * 마커 투명도 (0-1)
   */
  opacity?: number;

  /**
   * 로드뷰에 올라가 있는 마커의 높이 값(m 단위)
   */
  altitude?: number;

  /**
   * 로드뷰 상에서 마커의 가시반경(m 단위), 두 지점 사이의 거리가 지정한 값보다 멀어지면 마커는 로드뷰에서 보이지 않게 됨
   */
  range?: number;
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
