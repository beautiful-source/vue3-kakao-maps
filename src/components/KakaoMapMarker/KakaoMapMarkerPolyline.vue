<script setup lang="ts">
import { computed, inject, onMounted, ref, type ComputedRef, type Ref } from 'vue';
import KakaoMapMarker from './KakaoMapMarker.vue';
import KakaoMapCustomOverlay from '../KakaoMapCustomOverlay/KakaoMapCustomOverlay.vue';
import KakaoMapPolyline from '../KakaoMapPolyline/KakaoMapPolyline.vue';
import type { KakaoMapMarkerPolylineProps } from '../KakaoMapPolyline/types/polyline';

const props = defineProps<KakaoMapMarkerPolylineProps>();

/**
 * 마커가 표시될 지도 객체
 */
const mapRef = inject<Ref<kakao.maps.Map>>('mapRef');

/**
 * 폴리라인이 지나갈 경로
 */
let linePath: ComputedRef<kakao.maps.LatLng[]>;

/**
 * 마커 객체 리스트 (드래그된 마커 추적)
 */
const mapMarkerList: Ref<kakao.maps.Marker[]> = ref([]);

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
 * 마커 순서를 지도에 표시하기 위한 커스텀 오버레이 content
 * @param order
 * @param orderBottomMargin
 */
const content = (order: string | number, orderBottomMargin: string | undefined): string => {
  return `<div style="position:relative; bottom:${orderBottomMargin}">
        ${order}
      </div>`;
};

/**
 * 폴리라인이 지나가는 경로인 linePath 계산
 */
onMounted(() => {
  linePath = computed(() => {
    return props.markerList.map((item) => {
      return new kakao.maps.LatLng(item.lat, item.lng);
    });
  });
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
      :draggable="marker.draggable"
      :image="marker.image"
      @on-load-kakao-map-marker="addMapMarkerList"
      @drag-end-kakao-map-marker="updateMarkerLatLng"
      @delete-kakao-map-marker="deleteMapMarker"
    >
    </KakaoMapMarker>
    <div v-for="(path, index) in linePath" :key="index">
      <KakaoMapPolyline
        v-if="index !== linePath.length - 1"
        :linePath="[path, linePath[index + 1]]"
        :endArrow="props.endArrow"
      ></KakaoMapPolyline>
    </div>
  </div>

  <div v-if="props.markerList && props.showMarkerOrder">
    <KakaoMapCustomOverlay
      v-for="(marker, index) in props.markerList"
      :key="index"
      :lat="marker.lat"
      :lng="marker.lng"
      :y-anchor="0"
      :content="content(marker.order !== undefined ? marker.order : index, marker.orderBottomMargin)"
    >
    </KakaoMapCustomOverlay>
  </div>
  <slot></slot>
</template>