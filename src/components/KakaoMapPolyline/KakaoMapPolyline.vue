<script setup lang="ts">
import { isKakaoMapApiLoaded } from '@/util/useKakao';
import { inject, onBeforeUnmount, watch, type Ref } from 'vue';

/**
 * KakaoMapPolyline 컴포넌트 생성을 위한 타입
 */
export type KakaoMapPolylineProps = {
  /**
   * 폴리라인이 지나갈 경로
   */
  linePath: kakao.maps.LatLng[];
  /**
   * 선의 화살표 여부
   */
  endArrow?: boolean;
  /**
   * 선의 두께
   */
  strokeWeight?: number;
  /**
   * 선의 색
   */
  strokeColor?: string;
  /**
   * 선의 불투명도. 1에서 0 사이의 값이며 0에 가까울수록 투명하다
   */
  strokeOpacity?: number;
  /**
   *선의 스타일
   */
  strokeStyle?: kakao.maps.StrokeStyles;
  /**
   * 선의 z-index 속성 값
   */
  zIndex?: number;
};

const props = withDefaults(defineProps<KakaoMapPolylineProps>(), {
  strokeWeight: 3,
  strokeColor: '#F10000',
  strokeOpacity: 0.6,
  strokeStyle: 'solid'
});

/**
 * 폴리라인이 표시될 지도 객체
 */
const mapRef = inject<Ref<kakao.maps.Map>>('mapRef');

/**
 * 지도에 표시할 폴리라인 객체
 */
let polyline: kakao.maps.Polyline | null = null;

/**
 * 폴리라인 객체를 생성하는 함수
 */
const initPolyline = (map: kakao.maps.Map): void => {
  polyline = new kakao.maps.Polyline({
    path: props.linePath,
    endArrow: props.endArrow,
    strokeWeight: props.strokeWeight,
    strokeColor: props.strokeColor,
    strokeOpacity: props.strokeOpacity,
    strokeStyle: props.strokeStyle,
    zIndex: props.zIndex
  });

  polyline.setMap(map);
};

/**
 * 상위 컴포넌트에서 map을 주입받으면 폴리라인 생성
 */
watch(
  [() => isKakaoMapApiLoaded.value, () => mapRef, () => mapRef?.value],
  ([isKakaoMapApiLoaded, mapRef, newMap]) => {
    if (isKakaoMapApiLoaded && mapRef !== undefined && newMap !== undefined) {
      initPolyline(newMap);
    }
  },
  { immediate: true }
);

/**
 * props의 linePath가 변경되면 폴리라인 경로 지정
 */
watch(
  () => props.linePath,
  () => {
    polyline?.setPath(props.linePath);
  },
  { deep: true }
);

/**
 * 언마운트되면 map에서 폴리라인 삭제
 */
onBeforeUnmount(() => {
  polyline?.setMap(null);
});
</script>

<template>
  <div></div>
</template>
