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
const emits = defineEmits([
  'onLoadKakaoMap',
  'onLoadKakaoMapMarkerCluster',
  // v-model:lat, v-model:lng, v-model:level
  'update:lat',
  'update:lng',
  'update:level',
  // 지도 이벤트: 마우스 이벤트는 (mouseEvent, map), 나머지는 (map)을 전달한다.
  'click',
  'dblclick',
  'rightclick',
  'mousemove',
  'dragstart',
  'drag',
  'dragend',
  'zoomStart',
  'zoomChanged',
  'centerChanged',
  'boundsChanged',
  'idle',
  'tilesloaded',
  'maptypeidChanged'
]);

const kakaoMapRef = ref<null | HTMLElement>(null);
const map = ref<kakao.maps.Map>();
provide('mapRef', map);

/**
 * 좌표 비교. 지도에서 읽은 좌표는 투영 변환을 거치며 소수점 끝자리가 달라질 수 있다.
 */
const isSameCoordinate = (a: number, b: number): boolean => Math.abs(a - b) < 1e-9;

/**
 * 이동·확대가 끝난 지도의 상태를 v-model(lat, lng, level)로 올려보낸다.
 * 값이 같으면 보내지 않아서, 부모가 받은 값을 다시 내려줘도 지도가 또 움직이지 않는다.
 */
const syncModel = (kakaoMap: kakao.maps.Map): void => {
  const center = kakaoMap.getCenter();
  if (!isSameCoordinate(center.getLat(), props.lat)) emits('update:lat', center.getLat());
  if (!isSameCoordinate(center.getLng(), props.lng)) emits('update:lng', center.getLng());
  if (kakaoMap.getLevel() !== props.level) emits('update:level', kakaoMap.getLevel());
};

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
  if (info.markers === undefined && info.customOverlayProps === undefined) {
    throw new Error('클러스터 할 입력값이 없습니다.');
  } else if (map.value !== null) {
    if (info.markers !== undefined) {
      const inputList = ref<kakao.maps.Marker[]>([]);
      /**
       * markers로 리스트 생성
       */
      info.markers?.forEach((markerInfo) => {
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
        inputList.value?.push(marker);
      });
      clusterer.value = new kakao.maps.MarkerClusterer({
        map: toRaw(map.value),
        ...info,
        markers: inputList.value
      });
    }
    if (info.customOverlayProps !== undefined) {
      const inputList = ref<kakao.maps.CustomOverlay[]>([]);
      /**
       * customOverlayProps로 리스트 생성
       */
      info.customOverlayProps?.forEach((markerInfo) => {
        const customOverlay = new kakao.maps.CustomOverlay({
          position: new kakao.maps.LatLng(markerInfo.lat, markerInfo.lng),
          content: markerInfo.content,
          xAnchor: markerInfo.xAnchor,
          yAnchor: markerInfo.yAnchor,
          zIndex: markerInfo.zIndex,
          clickable: markerInfo.clickable
        });
        inputList.value?.push(customOverlay);
      });
      clusterer.value = new kakao.maps.MarkerClusterer({
        map: toRaw(map.value),
        ...info,
        markers: inputList.value
      });
    }
    emits('onLoadKakaoMapMarkerCluster', clusterer.value);
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
  if (map.value === undefined) return;
  const center = map.value.getCenter();
  // v-model로 지도에서 올라온 값이면 이미 그 위치라서 다시 이동하지 않는다.
  if (isSameCoordinate(center.getLat(), newLat) && isSameCoordinate(center.getLng(), newLng)) return;
  map.value.panTo(new kakao.maps.LatLng(newLat, newLng));
});

/**
 * 카카오맵 이벤트 이름 → 컴포넌트 이벤트 이름
 * 마우스 이벤트는 카카오가 넘겨준 MouseEvent 뒤에 map을, 나머지 이벤트는 map만 전달한다.
 */
const MAP_EVENTS = {
  click: 'click',
  dblclick: 'dblclick',
  rightclick: 'rightclick',
  mousemove: 'mousemove',
  dragstart: 'dragstart',
  drag: 'drag',
  dragend: 'dragend',
  zoom_start: 'zoomStart',
  zoom_changed: 'zoomChanged',
  center_changed: 'centerChanged',
  bounds_changed: 'boundsChanged',
  idle: 'idle',
  tilesloaded: 'tilesloaded',
  maptypeid_changed: 'maptypeidChanged'
} as const;

/**
 * 카카오맵 이벤트를 컴포넌트 이벤트로 전달한다.
 * 지도가 다시 만들어지거나 컴포넌트가 사라지면 등록한 리스너를 해제한다.
 */
watch(
  () => map.value,
  (newMap, _, onCleanup) => {
    if (newMap === undefined) return;
    const kakaoMap = toRaw(newMap);
    const listeners = Object.entries(MAP_EVENTS).map(([type, name]): [string, (...args: unknown[]) => void] => [
      type,
      (...args) => {
        // 이동·확대가 끝나면 v-model 값을 먼저 갱신한 뒤 idle을 알린다.
        if (type === 'idle') syncModel(kakaoMap);
        emits(name, ...args, kakaoMap);
      }
    ]);

    listeners.forEach(([type, handler]) => {
      kakao.maps.event.addListener(kakaoMap, type, handler);
    });
    onCleanup(() => {
      listeners.forEach(([type, handler]) => {
        kakao.maps.event.removeListener(kakaoMap, type, handler);
      });
    });
  }
);

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
    const nextLevel = level ?? 3;
    // v-model로 지도에서 올라온 값이면 이미 그 레벨이라서 다시 설정하지 않는다.
    if (map.value === undefined || map.value.getLevel() === nextLevel) return;
    map.value.setLevel(nextLevel);
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
        :draggable="marker.draggable"
        :image="marker.image"
        :order="marker.order"
        :order-bottom-margin="marker.orderBottomMargin"
      />
    </template>

    <template v-if="props.infoWindowList && props.markerCluster === undefined">
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
