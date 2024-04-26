<script setup lang="ts">
import { isKakaoMapApiLoaded } from '@/util/useKakao';
import { inject, onBeforeUnmount, ref, watch, type Ref } from 'vue';

export type KakaoMapInfoWindowProps = {
  /**
   * 인포윈도우의 위도 값
   */
  lat: number;

  /**
   * 인포윈도우의 경도 값
   */
  lng: number;

  /**
   * 인포윈도우가 올라갈 marker 객체
   */
  marker?: kakao.maps.Marker;

  /**
   * 엘리먼트 또는 HTML 문자열 형태의 인포윈도우의 내용
   * slot으로도 전달 가능합니다.
   */
  content?: string;

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

const emits = defineEmits(['onLoadKakaoMapInfoWindow']);

const props = withDefaults(defineProps<KakaoMapInfoWindowProps>(), {
  removable: false,
  range: 500
});

/**
 * kakao api로 생성한 KakaoMapInfoWindow 객체
 */
const infoWindow = ref<kakao.maps.InfoWindow | null>();

/**
 * content 표시될 slot 객체
 */
const contentSlot = ref<HTMLElement>();

/**
 * KakaoMapInfoWindow가 표시될 지도의 객체
 */
const mapRef = inject<Ref<kakao.maps.Map>>('mapRef');

/**
 * 카카오맵 위에 인포윈도우를 생성합니다.
 * @param map가 생성될 카카오맵
 */
const initKakaoMapInfoWindow = (map: kakao.maps.Map): void => {
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

  emits('onLoadKakaoMapInfoWindow', infoWindow.value);
  props.marker !== undefined ? infoWindow?.value?.open(map, props.marker) : infoWindow?.value?.open(map);
};

/**
 * 컴포넌트 언마운트 시 map에서 infoWindow 삭제
 */
onBeforeUnmount(() => {
  if (infoWindow?.value === null) return;
  infoWindow.value !== undefined && infoWindow.value.close();
});

/**
 * Kakao map api script가 로드되었는지 확인 후 initKakaoMapInfoWindow 한다.
 */
watch(
  [() => isKakaoMapApiLoaded.value, () => mapRef?.value, () => isKakaoMapApiLoaded, () => mapRef],
  ([isKakaoMapApiLoaded, mapRef]) => {
    if (isKakaoMapApiLoaded && mapRef !== undefined && mapRef !== null) {
      initKakaoMapInfoWindow(mapRef);
    }
  },
  { immediate: true }
);

/**
 * marker 변경 감지
 */
watch(
  () => props.marker,
  (newMarker) => {
    if (mapRef?.value === undefined) return;
    infoWindow.value != null && infoWindow.value?.close();
    newMarker !== undefined ? infoWindow?.value?.open(mapRef?.value, newMarker) : infoWindow?.value?.open(mapRef?.value);
  },
  {
    immediate: true
  }
);

/**
 * slot 변경 감지
 */
watch(
  [() => contentSlot?.value, () => contentSlot],
  ([content, contentSlot]) => {
    content !== undefined && infoWindow.value?.setContent(content);
  },
  { deep: true }
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
 * 로드뷰에 올라있는 인포윈도우의 높이 값 변경 감지
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
</script>

<template>
  <div v-if="(props.content && props.content.length > 0) || $slots.default">
    <div v-if="$slots.default" ref="contentSlot">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
