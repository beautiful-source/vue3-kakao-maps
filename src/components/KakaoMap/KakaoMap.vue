<script setup lang="ts">
import { isKakaoMapApiLoaded } from '@/util/useKakao';
import { ref, watch } from 'vue';
const map = ref<null | kakao.maps.Map>(null);

export interface KakaoMapProps {
  /**
   * 지도의 가로 길이
   */
  width?: number | string;
  /**
   * 지도의 세로 길이
   */
  height?: number | string;
  /**
   * 지도에 표시할 marker 데이터의 리스트
   */
  markerList?: any;
  /**
   * 지도의 위도 값
   */
  lat: number;
  /**
   * 지도의 경도 값
   */
  lng: number;
  /**
   * 확대 수준 (기본값: 3)
   */
  level?: number;

  /**
   * 지도 종류 (기본값: 일반 지도)
   */
  mapTypeId?: kakao.maps.MapTypeId;

  /**
   * 마우스 드래그, 휠, 모바일 터치를 이용한 시점 변경(이동, 확대, 축소) 가능 여부
   */
  draggable?: boolean;

  /**
   * 마우스 휠, 모바일 터치를 이용한 확대 및 축소 가능 여부
   */
  scrollwheel?: boolean;

  /**
   * 더블클릭 이벤트 및 더블클릭 확대 가능 여부
   */
  disableDoubleClick?: boolean;

  /**
   * 더블클릭 확대 가능 여부
   */
  disableDoubleClickZoom?: boolean;

  /**
   * 투영법 지정 (기본값: kakao.maps.ProjectionId.WCONG)
   */
  projectionId?: string;

  /**
   * 지도 타일 애니메이션 설정 여부 (기본값: true)
   */
  tileAnimation?: boolean;

  /**
   * 키보드의 방향키와 +, – 키로 지도 이동,확대,축소 가능 여부 (기본값: false)
   */
  keyboardShortcuts?:
    | boolean
    | {
        /**
         * 지도 이동 속도
         */
        speed: number;
      };
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

type MapTheme = {
  width: number | string;
  height: number | string;
};
const theme = ref<MapTheme>({
  width: typeof props.width === 'number' ? props.width + 'px' : props.width,
  height: typeof props.height === 'number' ? props.height + 'px' : props.height
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
  <div class="kakao-map" ref="kakaoMapRef">
    <slot></slot>
  </div>
</template>

<style scoped>
.kakao-map {
  width: v-bind('theme.width');
  height: v-bind('theme.height');
}
</style>
