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
  /**
   * 마커의 드래그 여부
   */
  draggable?: boolean;
  /**
   * 마커 이미지,
   * 이미지를 설정하지 않으면 기본 마커 이미지로 보임
   */
  image?: KakaoMapMarkerImage;
  /**
   * 지도에 표시되는 마커의 순서
   */
  order?: number | string;
  /**
   * 마커의 순서가 표시될 y축 방향 높이
   */
  orderBottomMargin?: string;
};

export type KakaoMapMarkerImage = {
  imageSrc: string;
  imageWidth?: number;
  imageHeight?: number;
  imageOption?: kakao.maps.MarkerImageOptions;
};
