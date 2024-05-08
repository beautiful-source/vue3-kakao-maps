<script setup lang="ts">
import { KakaoMapInfoWindow, KakaoMapMarker } from '@/components';
import { isKakaoMapApiLoaded } from '@/utils/useKakao';
import { computed, onMounted, provide, ref, toRaw, watch } from 'vue';
import type { KakaoMapProps, MarkerClusterInfo } from './types';

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
};

/**
 * Marker Cluster 기능
 */
const clusterer = ref<kakao.maps.MarkerClusterer>();
const initCluster = (info: MarkerClusterInfo): void => {
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
      map: toRaw(map.value),
      ...info,
      markers: markers.value
    });
  }
};

onMounted(() => {
  if (isKakaoMapApiLoaded.value) {
    initMap();
    if (props.markerCluster !== undefined) {
      initCluster(props.markerCluster);
    }
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
      if (props.markerCluster !== undefined) {
        initCluster(props.markerCluster);
      }
    }
  }
);

type MapStyle = {
  width: number | string;
  height: number | string;
};

const mapStyle = computed<MapStyle>(() => {
  return {
    width: isFinite(+props.width) ? props.width + 'px' : props.width,
    height: isFinite(+props.height) ? props.height + 'px' : props.height
  };
});

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
</script>

<template>
  <div ref="kakaoMapRef" :style="mapStyle">
    <template v-if="props.markerList && props.markerCluster === undefined">
      <KakaoMapMarker
        v-for="(marker, index) in props.markerList"
        :key="marker.key === undefined ? index : marker.key"
        :lat="marker.lat"
        :lng="marker.lng"
        :info-window="marker?.infoWindow"
      />
    </template>

    <template v-if="props.infoWindowList">
      <KakaoMapInfoWindow
        v-for="(infoWindow, index) in props.infoWindowList"
        :key="infoWindow.key === undefined ? index : infoWindow.key"
        :lat="infoWindow.lat"
        :lng="infoWindow.lng"
        :content="infoWindow.content"
        :visible="infoWindow.visible"
      />
    </template>
    <slot></slot>
  </div>
</template>
