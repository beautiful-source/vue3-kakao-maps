<script setup lang="ts">
import { computed, inject, ref, type ComputedRef, type Ref } from 'vue';
import type { KakaoMapMarkerListItem } from './types';
import KakaoMapMarker from './KakaoMapMarker.vue';
import KakaoMapCustomOverlay from '../KakaoMapCustomOverlay/KakaoMapCustomOverlay.vue';
import KakaoMapPolyline from '../KakaoMapPolyline/KakaoMapPolyline.vue';

/**
 * KakaoMapMarkerPolyline 컴포넌트 생성을 위한 타입
 */
type KakaoMapMarkerPolylineProps = {
  /**
   * 지도에 표시할 마커 리스트
   */
  markerList: KakaoMapMarkerListItem[];
  /**
   * 마커의 순서 표시 여부
   */
  showMarkerOrder?: boolean;
  /**
   * 선의 화살표 여부
   */
  endArrow?: boolean;
  /**
   * 선의 두께
   */
  strokeWeight?: number;
  /**
   * 선의 색
   */
  strokeColor?: string;
  /**
   * 선의 불투명도. 1에서 0 사이의 값이며 0에 가까울수록 투명하다
   */
  strokeOpacity?: number;
  /**
   *선의 스타일
   */
  strokeStyle?: kakao.maps.StrokeStyles;
};

const props = defineProps<KakaoMapMarkerPolylineProps>();

/**
 * 마커가 표시될 지도 객체
 */
const mapRef = inject<Ref<kakao.maps.Map>>('mapRef');

/**
 * 마커 객체 리스트 (드래그된 마커 추적)
 */
const mapMarkerList: Ref<kakao.maps.Marker[]> = ref([]);

/**
 * 폴리라인이 지나갈 경로
 */
const linePath: ComputedRef<kakao.maps.LatLng[]> = computed(() => {
  return props.markerList.map((item) => {
    return new kakao.maps.LatLng(item.lat, item.lng);
  });
});

/**
 * 마커 객체를 리스트에 추가하는 함수
 * @param marker
 */
const addMapMarkerList = (marker: kakao.maps.Marker): void => {
  mapMarkerList.value.push(marker);
};

/**
 * 마커 객체를 리스트에서 삭제하는 함수
 * @param marker
 */
const deleteMapMarker = (marker: kakao.maps.Marker): void => {
  const targetIndex = mapMarkerList.value.indexOf(marker);
  mapMarkerList.value.splice(targetIndex, 1);
};

/**
 * 드래그한 마커의 lat, lng을 변경하는 함수
 * @param marker
 */
const updateMarkerLatLng = (marker: kakao.maps.Marker): void => {
  const markerListProps = props.markerList;
  const targetIndex = mapMarkerList.value.indexOf(marker);

  markerListProps[targetIndex].lat = marker.getPosition().getLat();
  markerListProps[targetIndex].lng = marker.getPosition().getLng();
};

/**
 * 커스텀오버레이의 content
 * @param order
 */
const customOverlayContent = (order: number | string): string => {
  return `<div>${order}</div>`;
};
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
      :draggable="marker.draggable"
      @on-load-kakao-map-marker="addMapMarkerList"
      @drag-end-kakao-map-marker="updateMarkerLatLng"
      @delete-kakao-map-marker="deleteMapMarker"
    >
    </KakaoMapMarker>
    <template v-for="(path, index) in linePath" :key="index">
      <KakaoMapPolyline
        v-if="index !== linePath.length - 1"
        :linePath="[path, linePath[index + 1]]"
        :endArrow="props.endArrow"
      ></KakaoMapPolyline>
    </template>
    <template v-if="props.showMarkerOrder">
      <KakaoMapCustomOverlay
        v-for="(marker, index) in props.markerList"
        :key="index"
        :lat="marker.lat"
        :lng="marker.lng"
        :content="customOverlayContent(marker.key === undefined ? index + 1 : marker.key)"
        :y-anchor="0"
      ></KakaoMapCustomOverlay>
    </template>
    <slot></slot>
  </div>
</template>
