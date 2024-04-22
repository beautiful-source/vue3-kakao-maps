<script setup lang="ts">
import { isKakaoMapApiLoaded } from '@/util/useKakao';
import { ref, watch, computed } from 'vue';
const map = ref<null | kakao.maps.Map>(null);
export interface KakaoMapProps extends /* @vue-ignore */ Omit<kakao.maps.MapOptions, 'center'> {
  width?: number | string;
  height?: number | string;
  markerList?: any;
  // x, y로 받는건 안해서 추후 요청이 있다면 수정 필요
  lat: number;
  lng: number;
}

const props = withDefaults(defineProps<KakaoMapProps>(), {
  width: '40rem',
  height: '30rem',
  level: 3
});
const emits = defineEmits(['onLoadMap']);

// LatLng 변경감지
watch([() => props.lat, () => props.lng], ([newLat, newLng]) => {
  map.value?.panTo(new kakao.maps.LatLng(newLat, newLng));
});

// 기본지도 생성

type MapStyle = {
  width: number | string;
  height: number | string;
};

const mapStyle = computed<MapStyle>(() => {
  return {
    width: typeof props.width === 'number' ? props.width + 'px' : props.width,
    height: typeof props.height === 'number' ? props.height + 'px' : props.height
  };
});

const kakaoMapRef = ref<null | HTMLElement>(null);

watch(
  () => isKakaoMapApiLoaded.value,
  (isKakaoMapApiLoaded) => {
    if (isKakaoMapApiLoaded) {
      initMap();
    }
  }
);

const initMap = (): void => {
  const options = {
    center: new kakao.maps.LatLng(props.lat, props.lng),
    ...props
  };
  if (kakaoMapRef.value !== null) {
    map.value = new window.kakao.maps.Map(kakaoMapRef.value, options);
    emits('onLoadMap', map.value);
  }
};
</script>

<template>
  <div ref="kakaoMapRef" :style="mapStyle">
    <slot></slot>
  </div>
</template>

<style scoped></style>
