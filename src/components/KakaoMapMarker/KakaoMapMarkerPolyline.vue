<script setup lang="ts">
import { inject, ref, type Ref } from 'vue';
import { KakaoMapCustomOverlay, KakaoMapMarker, KakaoMapPolyline } from '@/components';
import type { KakaoMapMarkerPolylineProps } from '../KakaoMapPolyline/types';

const emits = defineEmits([
  // Marker event
  'onLoadKakaoMapMarker',
  'onClickKakaoMapMarker',
  'dragEndKakaoMapMarker',
  'mouseOverKakaoMapMarker',
  'mouseOutKakaoMapMarker',
  'deleteKakaoMapMarker'
]);

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
 * 마커 객체를 리스트에 추가하는 함수
 * @param marker
 */
const addMapMarkerList = (marker: kakao.maps.Marker): void => {
  mapMarkerList.value.push(marker);
  emits('onLoadKakaoMapMarker', marker);
};

/**
 * 마커 객체를 리스트에서 삭제하는 함수
 * @param marker
 */
const deleteMapMarker = (marker: kakao.maps.Marker): void => {
  const targetIndex = mapMarkerList.value.indexOf(marker);
  mapMarkerList.value.splice(targetIndex, 1);
  emits('deleteKakaoMapMarker', marker);
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

  emits('dragEndKakaoMapMarker', marker);
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
      :clickable="marker.clickable"
      :image="marker.image"
      @onLoadKakaoMapMarker="addMapMarkerList"
      @dragEndKakaoMapMarker="updateMarkerLatLng"
      @deleteKakaoMapMarker="deleteMapMarker"
      @onClickKakaoMapMarker="emits('onClickKakaoMapMarker', marker)"
      @mouseOverKakaoMapMarker="emits('mouseOverKakaoMapMarker', marker)"
      @mouseOutKakaoMapMarker="emits('mouseOutKakaoMapMarker', marker)"
    />
    <div v-for="(marker, index) in props.markerList" :key="index">
      <KakaoMapPolyline
        v-if="index !== props.markerList.length - 1"
        :latLngList="[
          { lat: props.markerList[index].lat, lng: props.markerList[index].lng },
          { lat: props.markerList[index + 1].lat, lng: props.markerList[index + 1].lng }
        ]"
        :endArrow="props.endArrow"
        :strokeWeight="props.strokeWeight"
        :strokeColor="props.strokeColor"
        :strokeOpacity="props.strokeOpacity"
        :strokeStyle="props.strokeStyle"
        :zIndex="props.zIndex"
      />
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
    />
  </div>
  <slot></slot>
</template>
