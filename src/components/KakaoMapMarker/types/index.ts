/**
 * KakaoMap의 markerList의 아이템 타입
 */
export type KakaoMapMarkerListItem = {
  /**
   * 마커의 고유한 key
   */
  key?: number | string;
  /**
   * 마커의 위도 값
   */
  lat: number;
  /**
   * 마커의 경도 값
   */
  lng: number;
  /**
   * 마커에 추가할 인포윈도우 content
   */
  infoWindow?: KakaoMapMarkerInfoWindow;
  /**
   * 마커 클릭 전 인포윈도우 표시 여부(기본값: true)
   */
  visible?: boolean;
};

export type KakaoMapMarkerImage = {
  imageSrc: string;
  imageWidth?: number;
  imageHeight?: number;
  imageOption: kakao.maps.MarkerImageOptions;
};

export type KakaoMapMarkerInfoWindow = {
  content: string | undefined;
  visible?: boolean | undefined;
};
