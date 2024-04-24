/**
 * 지도의 마커를 추가하기 위한 옵션 타입
 */
export type MapMarkerOptions = {
  /**
   * 마커를 표시할 지도의 위도 값
   */
  lat: number;
  /**
   * 마커를 표시할 지도의 경도 값
   */
  lng: number;
  /**
   * 마커에 추가할 InfoWindow comtent
   */
  infoWindow?: string;
};

/**
 * MapMarker 컴포넌트 생성을 위한 타입
 */
export type MapMarkerProps = {
  /**
   * 카카오 맵 지도 객체, KakaoMap 컴포넌트의 onLoadMap 이벤트의 반환값
   */
  map: kakao.maps.Map;
} & MapMarkerOptions;
