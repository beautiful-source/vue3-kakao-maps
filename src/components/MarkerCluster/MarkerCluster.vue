<script setup lang="ts">
import { isKakaoMapApiLoaded } from '@/util/useKakao';
import { ref, watch } from 'vue';

const props = defineProps<{
  map: kakao.maps.Map;
  markerList: kakao.maps.Marker[] | undefined;
}>();

const clusterer = ref<null | kakao.maps.MarkerClusterer>(null);

watch(
  () => isKakaoMapApiLoaded.value,
  (isKakaoMapApiLoaded) => {
    if (isKakaoMapApiLoaded) {
      initCluster();
    }
  }
);

const initCluster = (): void => {
  if (props.markerList === undefined) {
    throw new Error('MarkerList가 없습니다.');
  }
  clusterer.value = new kakao.maps.MarkerClusterer({
    map: props.map,
    markers: props.markerList
  });
};
</script>

<template>
  <div></div>
</template>

<style scoped></style>
