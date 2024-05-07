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
