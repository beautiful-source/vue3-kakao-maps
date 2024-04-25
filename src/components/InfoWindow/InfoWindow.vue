<script setup lang="ts">
import { isKakaoMapApiLoaded } from '@/util/useKakao';
import { onBeforeUnmount, ref, onMounted, watch } from 'vue';

type InfoWindowProps = {
  /**
   * InfoWindow가 올라갈 지도 또는 로드뷰
   */
  map: kakao.maps.Map;

  /**
   * 지도의 위도 값
   */
  lat: number;

  /**
   * 지도의 경도 값
   */
  lng: number;

  /**
   * InfoWindow가 올라갈 marker 객체
   */
  marker?: kakao.maps.Marker;

  /**
   * 엘리먼트 또는 HTML 문자열 형태의 인포윈도우의 내용
   * slot으로도 전달 가능합니다.
   */
  content?: string | HTMLElement;

  /**
   * 인포윈도우를 열 때 지도가 자동으로 패닝하지 않을지의 여부 (기본값: false), 최초 생성시에만 적용됩니다.
   */
  disableAutoPan?: boolean;

  /**
   * 삭제 가능한 인포윈도우 여부, 최초 생성시에만 적용됩니다.
   */
  removable?: boolean;

  /**
   * 인포윈도우 엘리먼트의 z-index 속성 값
   */
  zIndex?: number;

  /**
   * 로드뷰에 올라있는 인포윈도우의 높이 값(m 단위)
   */
  altitude?: number;

  /**
   * 로드뷰 상에서 인포윈도우의 가시반경(m 단위), 두 지점 사이의 거리가 지정한 값보다 멀어지면 인포윈도우는 보이지 않게 됩니다.
   * 기본값은 500입니다.
   */
  range?: number;
};

const props = defineProps<InfoWindowProps>();
const infoWindow = ref<kakao.maps.InfoWindow | null>();
const contentSlot = ref<HTMLElement>();

onMounted(() => {
  isKakaoMapApiLoaded.value && initInfoWindow();
});

/**
 * Kakao map api script가 로드되었는지 확인 후 init Map 한다.
 */
watch(
  () => isKakaoMapApiLoaded.value,
  (isKakaoMapApiLoaded) => {
    isKakaoMapApiLoaded && initInfoWindow();
  }
);

onBeforeUnmount(() => {
  if (infoWindow.value != null) {
    infoWindow.value.close(); // 컴포넌트 삭제될 때 map에서 infoWindow 삭제
  }
});

/**
 * marker 변경 감지
 */
watch(
  () => props.marker,
  (newMarker) => {
    infoWindow.value?.close();
    newMarker !== undefined ? infoWindow?.value?.open(props.map, newMarker) : infoWindow?.value?.open(props.map);
  }
);

/**
 * LatLng 변경감지
 */
watch([() => props.lat, () => props.lng], ([newLat, newLng]) => {
  infoWindow.value?.setPosition(new kakao.maps.LatLng(newLat, newLng));
});

/**
 * content 변경 감지
 */
watch(
  () => props.content,
  (newContent) => {
    infoWindow.value?.setContent(newContent ?? '');
  }
);

/**
 * zIndex 변경 감지
 */
watch(
  () => props.zIndex,
  (newZIndex) => {
    infoWindow.value?.setZIndex(newZIndex ?? 0);
  }
);

/**
 * altitude 변경 감지
 */
watch(
  () => props.altitude,
  (newAltitude) => {
    infoWindow.value?.setAltitude(newAltitude ?? 0);
  }
);

/**
 * range 변경 감지
 */
watch(
  () => props.range,
  (newRange) => {
    infoWindow.value?.setRange(newRange ?? 500);
  }
);

const initInfoWindow = (): void => {
  if (props.lat === undefined || props.lng === undefined) {
    throw new Error('infoWindow의 위치가 없습니다.');
  }

  const position = new kakao.maps.LatLng(props.lat, props.lng);

  infoWindow.value = new kakao.maps.InfoWindow({
    position,
    content: contentSlot.value ?? props.content ?? '',
    removable: props.removable,
    disableAutoPan: props.disableAutoPan,
    zIndex: props.zIndex,
    altitude: props.altitude,
    range: props.range
  });
};
</script>

<template>
  <div v-if="$slots.default" ref="contentSlot">
    <slot></slot>
  </div>
</template>

<style scoped lang="scss"></style>
