<script setup lang="ts">
import { isKakaoMapApiLoaded } from '@/util/useKakao';
import { onBeforeUnmount, ref, watch, onMounted } from 'vue';
import type { MapMarkerProps } from './types';

const props = defineProps<MapMarkerProps>();

const marker = ref<null | kakao.maps.Marker>(null);
const markerElement = ref<HTMLDivElement>();
const lat = ref<number>(props.lat);
const lng = ref<number>(props.lng);

watch(
  () => isKakaoMapApiLoaded.value,
  (isKakaoMapApiLoaded) => {
    if (isKakaoMapApiLoaded) {
      initMarker(props.map);
    }
  }
);

onMounted(() => {
  if (isKakaoMapApiLoaded.value) {
    initMarker(props.map);
  }
});
onBeforeUnmount(() => {
  marker.value?.setMap(null); // 컴포넌트 삭제될 때 map에서 marker 삭제
});

/**
 * 이미지 변경 감지
 */
watch([() => props.image], (newImage) => {
  if (isKakaoMapApiLoaded.value) {
    marker.value?.setImage(newImage);
  }
});

const initMarker = (map: kakao.maps.Map): void => {
  if (lat.value === undefined || lng.value === undefined) {
    throw new Error('marker의 위치가 없습니다.');
  }
  const markerPosition = new kakao.maps.LatLng(lat.value, lng.value);
  marker.value = new kakao.maps.Marker({
    position: markerPosition
  });

  if (props.image !== undefined) {
    if (props.image.imageSrc === undefined) {
      throw new Error('이미지가 존재하지 않습니다.');
    }

    if (props.image.imageWidth === undefined || props.image.imageHeight === undefined) {
      throw new Error('이미지 사이즈가 지정되지 않았습니다');
    }

    const MarkerImage = new kakao.maps.MarkerImage(
      props.image.imageSrc,
      new kakao.maps.Size(props.image.imageWidth, props.image.imageHeight),
      props.image.imageOption
    );

    marker.value.setImage(MarkerImage);
  }

  marker.value.setMap(map);
};
</script>

<template>
  <div ref="markerElement">
    <slot></slot>
  </div>
</template>
