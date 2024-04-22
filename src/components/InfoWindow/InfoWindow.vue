<script setup lang="ts">
import { isKakaoMapApiLoaded } from '@/util/useKakao';
import { onBeforeUnmount, ref, watch } from 'vue';

const infoWindowElement = ref<HTMLDivElement>();
type infoWindowProps = {
  map: kakao.maps.Map;
  markerElement?: kakao.maps.Marker;
  content?: string | HTMLElement;
  lat: number;
  lng: number;
};
const props = defineProps<infoWindowProps>();
const infoWindow = ref<kakao.maps.InfoWindow | null>();
const contentSlot = ref<HTMLElement>();

watch(
  () => isKakaoMapApiLoaded.value,
  (isKakaoMapApiLoaded) => {
    if (isKakaoMapApiLoaded) {
      initInfoWindow();
    }
  }
);

onBeforeUnmount(() => {
  if (infoWindow.value != null) {
    infoWindow.value.close(); // 컴포넌트 삭제될 때 map에서 infoWindow 삭제
  }
});

const initInfoWindow = (): void => {
  const infoWindowPosition = new kakao.maps.LatLng(props.lat, props.lng);
  infoWindow.value = new kakao.maps.InfoWindow({
    position: infoWindowPosition,
    content: contentSlot.value ?? props.content ?? ''
  });
  console.log(contentSlot.value);

  infoWindow.value.open(props.map, props.markerElement);
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
