<script setup lang="ts">
import { isKakaoMapApiLoaded } from '@/utils/useKakao';
import { inject, onBeforeUnmount, ref, watch, type Ref } from 'vue';
import KakaoMapInfoWindow from '../KakaoMapInfoWindow/KakaoMapInfoWindow.vue';
import type { KakaoMapMarkerProps, KakaoMapMarkerImage } from '@/components/KakaoMapMarker/types';
import { DEFAULT_MARKER_IMAGE, DEFAULT_MARKER_IMAGE_HEIGHT, DEFAULT_MARKER_IMAGE_WIDTH } from '@/constants/markerImage';

const emits = defineEmits(['onLoadKakaoMapMarker']);

const props = defineProps<KakaoMapMarkerProps>();
/**
 * kakao api로 생성한 marker 객체
 */
const marker = ref<kakao.maps.Marker | undefined>();
/**
 * 마커가 표시될 지도의 객체
 */
const mapRef = inject<Ref<kakao.maps.Map>>('mapRef');

/**
 * 마커 이미지를 변경함
 * @param image 기본 마커 대신 표시될 이미지
 */
const changeMarkerImage = (image: KakaoMapMarkerImage | undefined): void => {
  if (image !== undefined && image !== null) {
    if (image.imageSrc === undefined) {
      throw new Error('이미지 경로가 존재하지 않습니다.');
    }
  } else {
    image = DEFAULT_MARKER_IMAGE;
  }

  const markerImage = new kakao.maps.MarkerImage(
    image.imageSrc,
    new kakao.maps.Size(image.imageWidth ?? DEFAULT_MARKER_IMAGE_WIDTH, image.imageHeight ?? DEFAULT_MARKER_IMAGE_HEIGHT),
    image.imageOption
  );

  if (marker.value !== undefined) {
    marker.value.setImage(markerImage);
  }
};

/*
 * 카카오맵 위에 마커를 생성합니다.
 * @param map 마커가 생성될 카카오맵
 */
const initMarker = (map: kakao.maps.Map): void => {
  if (props.lat === undefined || props.lng === undefined) {
    throw new Error('marker의 위치가 없습니다.');
  }
  const markerPosition = new kakao.maps.LatLng(props.lat, props.lng);
  marker.value = new kakao.maps.Marker({
    position: markerPosition
  });

  changeMarkerImage(props.image);
  emits('onLoadKakaoMapMarker', marker.value);
  marker.value.setMap(map);
};

/**
 * 컴포넌트 언마운트 시 map에서 marker 삭제
 */
onBeforeUnmount(() => {
  marker.value?.setMap(null);
});

/**
 * 상위 컴포넌트에서 `map`을 주입받으면 마커를 생성
 */
watch(
  [() => isKakaoMapApiLoaded.value, () => mapRef, () => mapRef?.value],
  ([isKakaoMapApiLoaded, mapRef, newMap]) => {
    if (isKakaoMapApiLoaded && mapRef !== undefined && newMap !== undefined) {
      initMarker(newMap);
    }
  },
  { immediate: true }
);

/**
 * lat, lng 변경감지
 */
watch([() => props.lat, () => props.lng], ([newLat, newLng]) => {
  if (isKakaoMapApiLoaded.value) {
    marker.value?.setPosition(new kakao.maps.LatLng(newLat, newLng));
  }
});

/**
 * 이미지 변경 감지
 */
watch([() => props.image], () => {
  changeMarkerImage(props.image);
});
</script>

<template>
  <div>
    <KakaoMapInfoWindow
      v-if="props.infoWindow && props.infoWindow.length > 0"
      :marker="marker"
      :lat="props.lat"
      :lng="props.lng"
      :content="props.infoWindow"
    >
    </KakaoMapInfoWindow>

    <KakaoMapInfoWindow v-if="$slots.infoWindow" :marker="marker" :lat="props.lat" :lng="props.lng">
      <slot name="infoWindow"> </slot>
    </KakaoMapInfoWindow>
  </div>
</template>
