<!-- <script setup lang="ts">
import { isKakaoMapApiLoaded } from '@/util/useKakao';
import { inject, onBeforeUnmount, ref, watch, type Ref } from 'vue';

/**
 * MarkerCluster 컴포넌트 생성을 위한 타입
 */
export type MarkerClustererProps = {
  // /**
  //  * 클러스터링 마커를 표시할 지도 객체
  //  */
  // map?: kakao.maps.Map;

  // /**
  //  * 클러스터링 할 마커 배열
  //  */
  // markers?: Array<kakao.maps.Marker | kakao.maps.CustomOverlay>;

  /**
   * 클러스터의 격자 크기 (기본값: 60)
   */
  gridSize?: number;

  /**
   * 마커들의 좌표 평균을 클러스터 좌표 설정 여부 (기본값 : false)
   */
  averageCenter?: boolean;

  /**
   * 클러스터링 할 지도의 최소 레벨 값 (기본값: 0)
   */
  minLevel?: number;

  /**
   * 클러스터링 할 최소 마커 수 (기본값: 2)
   */
  minClusterSize?: number;

  /**
   * 클러스터의 스타일
   */
  styles?: object[];

  /**
   * 클러스터에 표시할 문자열 또는 문자열 생성 함수.
   * @default "클러스터에 포함된 숫자"
   */

  texts?: string[] | ((size: number) => string);
  /**
   * 클러스터 크기를 구분하는 값을 가진 배열 또는 구분값 생성함수
   * @default [10, 100, 1000, 10000]
   */
  calculator?: number[] | ((size: number) => number[]);

  /**
   * 클러스터 클릭 시 지도 확대 여부 (기본값: true)
   */
  disableClickZoom?: boolean;

  /**
   * 클러스터 클릭 가능 여부 지정 옵션 (기본값: true)
   */
  clickable?: boolean;

  /**
   * 클러스터에 마우스 over/out 가능 여부 지정 옵션 (기본값: true)
   */
  hoverable?: boolean;
};

const props = defineProps<MarkerClusterProps>();
/**
 * kakao api로 생성한 clusterer 객체
 */
const clusterer = ref<null | kakao.maps.MarkerClusterer>(null);
/**
 * 마커가 표시될 지도의 객체
 */
const mapRef = inject<Ref<kakao.maps.Map>>('mapRef');
const markerList = inject<kakao.maps.Marker[]>('markerList');

const initCluster = (map: kakao.maps.Map, markers: Array<kakao.maps.Marker | kakao.maps.CustomOverlay>): void => {
  if (markers === undefined) {
    throw new Error('MarkerList가 없습니다.');
  }
  clusterer.value = new kakao.maps.MarkerClusterer({
    map,
    markers
  });
};

/**
 * 컴포넌트 언마운트 시 map에서 clusterer 삭제
 */
onBeforeUnmount(() => {
  clusterer.value?.setMap(null);
});

watch(
  [() => isKakaoMapApiLoaded.value, () => mapRef, () => markerList],
  ([isKakaoMapApiLoaded, mapRef, markers]) => {
    if (isKakaoMapApiLoaded && mapRef?.value !== undefined && markers !== null && markers !== undefined) {
      initCluster(mapRef.value, markers);
    }
  },
  { immediate: true }
);
</script>

<template>
  <div></div>
</template>

<style scoped></style> -->

<script setup lang="ts"></script>

<template>
  <div></div>
</template>

<style scoped></style>
