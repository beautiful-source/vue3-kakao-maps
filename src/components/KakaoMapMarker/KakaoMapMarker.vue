<script setup lang="ts">
import { isKakaoMapApiLoaded } from '@/utils/useKakao';
import { inject, onBeforeUnmount, ref, watch, type Ref } from 'vue';
import KakaoMapInfoWindow from '../KakaoMapInfoWindow/KakaoMapInfoWindow.vue';
import type { KakaoMapMarkerImage } from '@/types';
import { DEFAULT_MARKER_IMAGE, DEFAULT_MARKER_IMAGE_HEIGHT, DEFAULT_MARKER_IMAGE_WIDTH } from '@/constants/coordinate';

/**
 * KakaoMapMarker 컴포넌트 생성을 위한 타입
 */
export type KakaoMapMarkerProps = {
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
   * 마커 이미지,
   * 이미지를 설정하지 않으면 기본 마커 이미지로 보임
   */
  image?: KakaoMapMarkerImage;

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
