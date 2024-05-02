/**
 * KakaoMapMarker 컴포넌트 생성을 위한 타입
 */
export type KakaoMapMarkerProps = {
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
   * 마커 이미지,
   * 이미지를 설정하지 않으면 기본 마커 이미지로 보임
   */
  image?: KakaoMapMarkerImage;

  /**
   * 마커의 타이틀 속성 값 (툴팁)
   */
  title?: string;

  /**
   * 마커의 드래그 가능 여부
   */
  draggable?: boolean;

  /**
   * 마커의 클릭 가능 여부
   */
  clickable?: boolean;

  /**
   * 마커의 z-index 속성 값
   */
  zIndex?: number;

  /**
   * 마커 투명도 (0-1)
   */
  opacity?: number;

  /**
   * 로드뷰에 올라가 있는 마커의 높이 값(m 단위)
   */
  altitude?: number;

  /**
   * 로드뷰 상에서 마커의 가시반경(m 단위), 두 지점 사이의 거리가 지정한 값보다 멀어지면 마커는 로드뷰에서 보이지 않게 됨
   */
  range?: number;
};
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
   * 마커의 이미지
   */
  image?: kakao.maps.MarkerImage;

  /**
   * 마커 엘리먼트의 타이틀 속성 값 (툴팁)
   */
  title?: string;

  /**
   * 드래그 가능한 마커, 로드뷰에 올릴 경우에는 유효하지 않다.
   */
  draggable?: boolean;

  /**
   * 클릭 가능한 마커
   */
  clickable?: boolean;

  /**
   * 마커 엘리먼트의 z-index 속성 값
   */
  zIndex?: number;

  /**
   * 마커 투명도 (0-1)
   */
  opacity?: number;

  /**
   * 로드뷰에 올라있는 마커의 높이 값(m 단위)
   */
  altitude?: number;

  /**
   * 로드뷰 상에서 마커의 가시반경(m 단위), 두 지점 사이의 거리가 지정한 값보다 멀어지면 마커는 로드뷰에서 보이지 않게 된다.
   */
  range?: number;
};

export type KakaoMapMarkerImage = {
  imageSrc: string;
  imageWidth?: number;
  imageHeight?: number;
  imageOption: kakao.maps.MarkerImageOptions;
};
