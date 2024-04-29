import type { KakaoMapMarkerImage } from '@/components';

type coordinate = {
  lat: number;
  lng: number;
};

type size = {
  width: string;
  height: string;
};

export const DEFAULT_MAP_SIZE: size = {
  width: '40rem',
  height: '50rem'
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
