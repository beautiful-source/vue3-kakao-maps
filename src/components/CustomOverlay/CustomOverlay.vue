<script setup lang="ts">
import { isKakaoMapApiLoaded } from '@/util/useKakao';
import { ref, watch, onBeforeUnmount, onMounted } from 'vue';

export type CustomOverlayProps = {
  /**
   * CustomOverlay가 올라갈 지도 또는 로드뷰
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
   * 커스텀 CustomOverlay 컴포넌트
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

const props = withDefaults(defineProps<CustomOverlayProps>(), {
  yAnchor: 0.5,
  xAnchor: 0.5,
  clickable: false
});
const customOverlay = ref<kakao.maps.CustomOverlay | null>();
const contentSlot = ref<HTMLElement>();

onMounted(() => {
  isKakaoMapApiLoaded.value && initCustomOverlay();
});

/**
 * Kakao map api script가 로드되었는지 확인 후 init Map 한다.
 */
watch(
  () => isKakaoMapApiLoaded.value,
  (isKakaoMapApiLoaded) => {
    isKakaoMapApiLoaded && initCustomOverlay();
  }
);

onBeforeUnmount(() => {
  if (customOverlay.value != null) {
    customOverlay.value?.setMap(null); // 컴포넌트 삭제될 때 커스텀 오버레이를 닫기
  }
});

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

const initCustomOverlay = (): void => {
  if (props.lat === undefined || props.lng === undefined) {
    throw new Error('CustomOverlay의 위치가 없습니다.');
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

  customOverlay.value.setMap(props.map);
};
</script>

<template>
  <div v-if="$slots.default" ref="contentSlot">
    <slot></slot>
  </div>
</template>

<style scoped lang="scss"></style>
