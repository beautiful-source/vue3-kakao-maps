<script setup lang="ts">
import { isKakaoMapApiLoaded } from '@/util/useKakao';
import { inject, onBeforeUnmount, ref, watch, type Ref } from 'vue';

const infoWindowElement = ref<HTMLDivElement>();
type infoWindowProps = {
  markerElement?: kakao.maps.Marker;
  content?: string | HTMLElement;
  lat: number;
  lng: number;
};
const props = defineProps<infoWindowProps>();
const infoWindow = ref<kakao.maps.InfoWindow | null>();
const contentSlot = ref<HTMLElement>();
// 마커가 표시될 지도의 객체
const mapRef = inject<Ref<kakao.maps.Map>>('mapRef');
watch(
  () => isKakaoMapApiLoaded.value,
  (isKakaoMapApiLoaded) => {
    if (isKakaoMapApiLoaded && mapRef?.value !== undefined) {
      initInfoWindow(mapRef.value);
    }
  }
);

onBeforeUnmount(() => {
  if (infoWindow.value != null) {
    infoWindow.value.close(); // 컴포넌트 삭제될 때 map에서 infoWindow 삭제
  }
});

const initInfoWindow = (map: kakao.maps.Map): void => {
  const infoWindowPosition = new kakao.maps.LatLng(props.lat, props.lng);
  infoWindow.value = new kakao.maps.InfoWindow({
    position: infoWindowPosition,
    content: contentSlot.value ?? props.content ?? ''
  });

  infoWindow.value.open(map, props.markerElement);
};
</script>

<template>
  <div ref="infoWindowElement">
    <div ref="contentSlot">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
