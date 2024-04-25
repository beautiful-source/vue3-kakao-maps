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
   * 마커에 추가할 InfoWindow content
   */
  infoWindow?: string;
};

/**
 * MapMarker 컴포넌트 생성을 위한 타입
 */
export type MapMarkerProps = {
  /**
   * 마커의 위도 값
   */
  lat: number;
  /**
   * 마커의 경도 값
   */
  lng: number;
  /**
   * 마커에 추가할 InfoWindow content
   */
  infoWindow?: string;
  /**
   * kakao map api의 kakao.maps.Map, KakaoMap 컴포넌트의 onLoadMap 이벤트의 반환값
   */
  map: kakao.maps.Map;
  image?: KakaoMarkerImage;
};

export type KakaoMarkerImage = {
  imageSrc: string;
  imageWidth: number;
  imageHeight: number;
  imageOption: kakao.maps.MarkerImageOptions;
};
