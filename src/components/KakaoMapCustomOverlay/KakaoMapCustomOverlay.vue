<script setup lang="ts">
import { isKakaoMapApiLoaded } from '@/util/useKakao';
import { inject, onBeforeUnmount, ref, watch, type Ref } from 'vue';

export type KakaoMapCustomOverlayProps = {
  /**
   * 커스텀 오버레이의 위도 값
   */
  lat: number;

  /**
   * 커스텀 오버레이의 경도 값
   */
  lng: number;

  /**
   * KakaoMapCustomOverlay 컴포넌트
   */
  content?: string | HTMLElement;

  /**
   * 컨텐츠의 x축 위치. 0_1 사이의 값을 가진다. 기본값은 0.5, 최초 생성시에만 적용됩니다.
   */
  xAnchor?: number;

  /**
   * 컨텐츠의 y축 위치. 0_1 사이의 값을 가진다. 기본값은 0.5, 최초 생성시에만 적용됩니다.
   */
  yAnchor?: number;

  /**
   * 커스텀 오버레이의 z-index
   */
  zIndex?: number;

  /**
   * true 로 설정하면 컨텐츠 영역을 클릭했을 경우 지도 이벤트를 막아준다, 최초 생성시에만 적용됩니다.
,   */
  clickable?: boolean;
};

const props = withDefaults(defineProps<KakaoMapCustomOverlayProps>(), {
  yAnchor: 0.5,
  xAnchor: 0.5,
  clickable: false
});
/**
 * kakao api로 생성한 KakaoMapCustomOverlay 객체
 */
const customOverlay = ref<kakao.maps.CustomOverlay | null>();

/**
 * content가 표시될 slot 객체
 */
const contentSlot = ref<HTMLElement>();

/**
 * 커스텀오버레이가 표시될 지도의 객체
 */
const mapRef = inject<Ref<kakao.maps.Map>>('mapRef');

/**
 * 카카오맵 위에 커스텀오버레이를 생성합니다
 * @param map 커스텀오버레이가 생성될 카카오맵
 */
const initKakaoMapCustomOverlay = (map: kakao.maps.Map): void => {
  if (props.lat === undefined || props.lng === undefined) {
    throw new Error('KakaoMapCustomOverlay의 위치가 없습니다.');
  }

  const position = new kakao.maps.LatLng(props.lat, props.lng);

  customOverlay.value = new kakao.maps.CustomOverlay({
    position,
    content: contentSlot.value ?? props.content ?? '',
    xAnchor: props.xAnchor,
    yAnchor: props.yAnchor,
    zIndex: props.zIndex,
    clickable: props.clickable
  });

  customOverlay.value.setMap(map);
};

/**
 * 컴포넌트 언마운트 시 map에서 KakaoMapCustomOverlay 삭제
 */
onBeforeUnmount(() => {
  if (customOverlay.value !== null) {
    customOverlay.value?.setMap(null);
  }
});

/**
 * Kakao map api script가 로드되었는지 확인 후 initKakaoMapCustomOverlay한다.
 */
watch(
  [() => isKakaoMapApiLoaded.value, () => mapRef?.value, () => isKakaoMapApiLoaded, () => mapRef],
  ([isKakaoMapApiLoaded, mapRef]) => {
    if (isKakaoMapApiLoaded && mapRef !== undefined && mapRef !== null) {
      initKakaoMapCustomOverlay(mapRef);
    }
  },
  { immediate: true }
);

/**
 * LatLng 변경 감지
 */
watch([() => props.lat, () => props.lng], ([newLat, newLng]) => {
  customOverlay.value?.setPosition(new kakao.maps.LatLng(newLat, newLng));
});

/**
 * content 변경 감지
 */
watch(
  () => props.content,
  (newContent) => {
    customOverlay.value?.setContent(newContent ?? '');
  }
);

/**
 * zIndex 변경 감지
 */
watch(
  () => props.zIndex,
  (newZIndex) => {
    customOverlay.value?.setZIndex(newZIndex ?? 0);
  }
);
</script>

<template>
  <div v-if="$slots.default" ref="contentSlot">
    <slot></slot>
  </div>
</template>

<style scoped lang="scss"></style>
