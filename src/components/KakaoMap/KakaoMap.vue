<script setup lang="ts">
import { isKakaoMapApiLoaded } from '@/util/useKakao';
import { ref, watch, computed, onMounted, provide } from 'vue';
import { KakaoMapMarker } from '@/components';
import type { KakaoMapMarkerListItem } from '@/components';
import type { markerClusterInfo } from './types';

export type KakaoMapProps = {
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
  markerList?: KakaoMapMarkerListItem[];
  /**
   * 지도에 표시할 marker cluster의 속성 및 데이터 리스트
   */
  markerCluster?: markerClusterInfo;
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
   *  지도 종류를 설정합니다. 기본값은 일반 지도(1), (베이스) 일반 지도: 1, (베이스) 스카이뷰:2, (베이스) 하이브리드(스카이뷰 + 레이블): 3, (오버레이) 레이블: 4, (오버레이) 로드뷰: 5, (오버레이) 교통정보: 6, (오버레이) 지형도: 7, (오버레이) 자전거: 8, (오버레이) 스카이뷰를 위한 자전거 (어두운 지도에서 활용): 9, (오버레이) 지적편집도: 10
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
   * 더블클릭 이벤트 및 더블클릭 확대 가능 여부, 최초 생성시에만 적용됩니다.
   */
  disableDoubleClick?: boolean;

  /**
   * 더블클릭 확대 가능 여부, 최초 생성시에만 적용됩니다.
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
   * 키보드의 방향키와 +,-키로 지도 이동,확대,축소 가능여부를 설정한다. speed 속성은 지도의 이동속도이며, 처음 생성시에만 적용된다.
   */
  keyboardShortcuts?:
    | boolean
    | {
        speed: number;
      };
};

const props = withDefaults(defineProps<KakaoMapProps>(), {
  width: '40rem',
  height: '30rem',
  level: 3,
  draggable: true,
  scrollwheel: true,
  disableDoubleClick: false,
  disableDoubleClickZoom: false,
  projectionId: 'kakao.maps.ProjectionId.WCONG',
  tileAnimation: true
});
const emits = defineEmits(['onLoadKakaoMap']);

const kakaoMapRef = ref<null | HTMLElement>(null);
const map = ref<kakao.maps.Map>();
provide('mapRef', map);
provide('marerkList', props.markerCluster);
onMounted(() => {
  if (isKakaoMapApiLoaded.value) {
    initMap();
  }
});

/**
 * Kakao map api script가 로드되었는지 확인 후 init Map 한다.
 */
watch(
  () => isKakaoMapApiLoaded.value,
  (isKakaoMapApiLoaded) => {
    if (isKakaoMapApiLoaded) {
      initMap();
    }
  }
);

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

/**
 * width, height 변경감지
 */
watch(
  [() => props.width, () => props.height],
  ([newWidth, newHeight]) => {
    mapStyle.value.width = newWidth;
    mapStyle.value.height = newHeight;
  },
  {
    deep: true
  }
);

/**
 * LatLng 변경감지
 */
watch([() => props.lat, () => props.lng], ([newLat, newLng]) => {
  map.value?.panTo(new kakao.maps.LatLng(newLat, newLng));
});

/**
 * draggable 변경 감지
 */
watch(
  () => props.draggable,
  (draggable) => {
    if (draggable === undefined || draggable) {
      map.value?.setDraggable(true);
    } else {
      map.value?.setDraggable(false);
    }
  }
);

/**
 * level 변경 감지
 */
watch(
  () => props.level,
  (level) => {
    if (level === undefined) {
      map.value?.setLevel(3);
    } else {
      map.value?.setLevel(level);
    }
  }
);

/**
 * mapTypeId 변경 감지
 */
watch(
  () => props.mapTypeId,
  (mapTypeId) => {
    if (mapTypeId === undefined) {
      map.value?.setMapTypeId(3);
    } else {
      map.value?.setMapTypeId(mapTypeId);
    }
  }
);

/**
 * scrollwheel 변경 감지
 */
watch(
  () => props.scrollwheel,
  (scrollwheel) => {
    if (scrollwheel === undefined) {
      map.value?.setZoomable(true);
    } else {
      map.value?.setZoomable(scrollwheel);
    }
  }
);

/**
 * projectionId 변경 감지
 */
watch(
  () => props.projectionId,
  (projectionId) => {
    if (projectionId === undefined) {
      map.value?.setProjectionId(kakao.maps.ProjectionId.WCONG);
    } else {
      map.value?.setProjectionId(projectionId);
    }
  }
);

/**
 * keyboardShortcuts 변경 감지
 */
watch(
  () => props.keyboardShortcuts,
  (keyboardShortcuts) => {
    if (keyboardShortcuts === undefined) {
      map.value?.setKeyboardShortcuts(false);
    } else {
      if (typeof keyboardShortcuts === 'boolean') {
        map.value?.setKeyboardShortcuts(keyboardShortcuts);
      }
    }
  }
);

/**
 * 지도를 생성하는 함수
 */
const initMap = (): void => {
  const options = {
    center: new kakao.maps.LatLng(props.lat, props.lng),
    ...props
  };
  if (kakaoMapRef.value !== null) {
    map.value = new window.kakao.maps.Map(kakaoMapRef.value, options);
    emits('onLoadKakaoMap', map.value);
  }
  if (props.markerCluster !== undefined) {
    initCluster(props.markerCluster);
  }
};

/**
 * Marker Cluster 기능
 */
const clusterer = ref<kakao.maps.MarkerClusterer>();
const initCluster = (info: markerClusterInfo): void => {
  if (info.markers === undefined) {
    throw new Error('MarkerList가 없습니다.');
  }
  if (map.value !== null) {
    /**
     * kakao.maps.Marker[] 생성
     */
    const markers = ref<kakao.maps.Marker[]>([]);
    info.markers.forEach((markerInfo) => {
      const marker = new kakao.maps.Marker({
        map: map.value,
        position: new kakao.maps.LatLng(markerInfo.lat, markerInfo.lng),
        image: markerInfo.image ?? undefined,
        title: markerInfo.title ?? undefined,
        draggable: typeof markerInfo.draggable === 'boolean' ? markerInfo.draggable : false,
        clickable: typeof markerInfo.clickable === 'boolean' ? markerInfo.clickable : false,
        zIndex: typeof markerInfo.zIndex === 'number' ? markerInfo.zIndex : 0,
        opacity: markerInfo.opacity ?? 1.0,
        altitude: markerInfo.altitude ?? 0,
        range: markerInfo.range ?? undefined
      });
      markers.value?.push(marker);
    });
    clusterer.value = new kakao.maps.MarkerClusterer({
      map: map.value,
      ...info,
      markers: markers.value
    });
  }
};
</script>

<template>
  <div ref="kakaoMapRef" :style="mapStyle">
    <div v-if="props.markerList && props.markerCluster == undefined && map !== null">
      <KakaoMapMarker
        v-for="(marker, index) in props.markerList"
        :id="index"
        :key="marker.key === undefined ? index : marker.key"
        :map="map"
        :lat="marker.lat"
        :lng="marker.lng"
      >
      </KakaoMapMarker>
    </div>
    <slot></slot>
  </div>
</template>
