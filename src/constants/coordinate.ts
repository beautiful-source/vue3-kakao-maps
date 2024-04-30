import type { KakaoMapMarkerImage } from '@/types';

type coordinate = {
  lat: number;
  lng: number;
};
export const 서울특별시청_좌표: coordinate = {
  lat: 37.566826,
  lng: 126.9786567
};

export const DEFAULT_MARKER_IMAGE_WIDTH: number = 30;
export const DEFAULT_MARKER_IMAGE_HEIGHT: number = 30;

export const DEFAULT_MARKER_IMAGE: KakaoMapMarkerImage = {
  imageSrc: `https://t1.daumcdn.net/mapjsapi/images/2x/marker.png`,
  imageWidth: 29,
  imageHeight: 42,
  imageOption: {}
};
