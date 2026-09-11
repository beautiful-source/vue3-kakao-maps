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
const emits = defineEmits(['onLoadKakaoMap', 'onLoadKakaoMapMarkerCluster']);

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
 * markerCluster가 바뀌면 클러스터를 매번 새로 만들지 않고, 추가·삭제·변경된 항목만 반영한다.
 * 템플릿에 객체를 바로 쓰면 렌더링마다 새 객체가 오므로, 항목은 객체가 아니라 내용(JSON)으로 비교한다.
 */
type ClusterItem = kakao.maps.Marker | kakao.maps.CustomOverlay;
type ClusterEntry = { key: string; item: ClusterItem };
type ClusterMarkerInfo = NonNullable<MarkerClusterInfo['markers']>[number];
type ClusterOverlayInfo = NonNullable<MarkerClusterInfo['customOverlayProps']>[number];

/**
 * 클러스터 옵션. 이 중 disableClickZoom, clickable, hoverable은 setter가 없어서 옵션이 바뀌면 클러스터를 새로 만든다.
 */
const CLUSTER_OPTION_KEYS = [
  'gridSize',
  'averageCenter',
  'minLevel',
  'minClusterSize',
  'styles',
  'texts',
  'calculator',
  'disableClickZoom',
  'clickable',
  'hoverable'
] as const;

let clusterer: kakao.maps.MarkerClusterer | undefined;
let clusterOptionsKey = '';
let clusterEntries: ClusterEntry[] = [];

const createClusterMarker = (markerInfo: ClusterMarkerInfo): kakao.maps.Marker =>
  new kakao.maps.Marker({
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

const createClusterOverlay = (overlayInfo: ClusterOverlayInfo): kakao.maps.CustomOverlay =>
  new kakao.maps.CustomOverlay({
    position: new kakao.maps.LatLng(overlayInfo.lat, overlayInfo.lng),
    content: overlayInfo.content,
    xAnchor: overlayInfo.xAnchor,
    yAnchor: overlayInfo.yAnchor,
    zIndex: overlayInfo.zIndex,
    clickable: overlayInfo.clickable
  });

/**
 * 옵션 비교용 문자열. 함수 옵션(texts, calculator)은 소스 문자열로 비교한다.
 */
const toClusterOptionsKey = (info: MarkerClusterInfo): string =>
  JSON.stringify(
    CLUSTER_OPTION_KEYS.map((key) => {
      const value = info[key];
      return typeof value === 'function' ? value.toString() : value;
    })
  );

/**
 * 이전 항목과 비교해, 내용이 같은 항목은 기존 kakao 객체를 재사용하고 나머지만 새로 만든다.
 */
const diffClusterItems = (info: MarkerClusterInfo): { entries: ClusterEntry[]; added: ClusterItem[]; removed: ClusterItem[] } => {
  const reusable = new Map<string, ClusterItem[]>();
  clusterEntries.forEach(({ key, item }) => {
    reusable.set(key, [...(reusable.get(key) ?? []), item]);
  });

  const entries: ClusterEntry[] = [];
  const added: ClusterItem[] = [];
  const take = (key: string, create: () => ClusterItem): void => {
    const reused = reusable.get(key)?.pop();
    const item = reused ?? create();
    if (reused === undefined) added.push(item);
    entries.push({ key, item });
  };
  info.markers?.forEach((markerInfo) => {
    take(`marker:${JSON.stringify(markerInfo)}`, () => createClusterMarker(markerInfo));
  });
  info.customOverlayProps?.forEach((overlayInfo) => {
    take(`overlay:${JSON.stringify(overlayInfo)}`, () => createClusterOverlay(overlayInfo));
  });

  return { entries, added, removed: Array.from(reusable.values()).flat() };
};

const removeCluster = (): void => {
  clusterer?.clear();
  clusterer?.setMap(null);
  clusterer = undefined;
  clusterOptionsKey = '';
  clusterEntries = [];
};

/**
 * markerCluster의 현재 값을 지도에 반영한다.
 */
const syncCluster = (info: MarkerClusterInfo | undefined): void => {
  if (map.value === undefined) return;
  if (info === undefined) {
    removeCluster();
    return;
  }
  if (info.markers === undefined && info.customOverlayProps === undefined) {
    throw new Error('클러스터 할 입력값이 없습니다.');
  }

  const { entries, added, removed } = diffClusterItems(info);
  const optionsKey = toClusterOptionsKey(info);
  if (clusterer === undefined || optionsKey !== clusterOptionsKey) {
    clusterer?.clear();
    clusterer?.setMap(null);
    clusterer = new kakao.maps.MarkerClusterer({
      map: toRaw(map.value),
      ...info,
      markers: entries.map(({ item }) => item)
    });
    clusterOptionsKey = optionsKey;
    emits('onLoadKakaoMapMarkerCluster', clusterer);
  } else if (added.length > 0 || removed.length > 0) {
    clusterer.removeMarkers(removed, true);
    clusterer.addMarkers(added, true);
    clusterer.redraw();
  }
  clusterEntries = entries;
};

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

/**
 * 지도가 만들어졌을 때와 markerCluster가 바뀔 때마다 클러스터를 맞춘다.
 * 마운트 뒤에 데이터를 받아와도 클러스터가 생긴다.
 */
watch(
  () => map.value,
  () => {
    syncCluster(props.markerCluster);
  }
);
watch(
  () => props.markerCluster,
  (info) => {
    syncCluster(info);
  },
  { deep: true }
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
