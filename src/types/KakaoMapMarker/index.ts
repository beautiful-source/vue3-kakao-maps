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

export type KakaoMapMarkerImage = {
  imageSrc: string;
  imageWidth?: number;
  imageHeight?: number;
  imageOption: kakao.maps.MarkerImageOptions;
};

export type KakaoMapInfoWindowListItem = {
  /**
   * 인포윈도우의 고유한 key
   */
  key?: number | string;
  /**
   * 인포윈도우의 위도 값
   */
  lat: number;
  /**
   * 인포윈도우의 경도 값
   */
  lng: number;
  /**
   * 인포윈도우의 내용. 문자열, 엘리먼트 또는 HTML 문자열 형태입니다.
   */
  content?: string;
};
