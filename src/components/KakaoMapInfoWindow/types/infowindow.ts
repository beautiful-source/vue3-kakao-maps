export type KakaoMapInfoWindowProps = {
  /**
   * 인포윈도우의 위도 값
   */
  lat: number;

  /**
   * 인포윈도우의 경도 값
   */
  lng: number;

  /**
   * 인포윈도우가 올라갈 marker 객체
   */
  marker?: kakao.maps.Marker;

  /**
   * 엘리먼트 또는 HTML 문자열 형태의 인포윈도우의 내용
   * slot으로도 전달 가능합니다.
   */
  content?: string;

  /**
   * 인포윈도우를 열 때 지도가 자동으로 패닝하지 않을지의 여부 (기본값: false), 최초 생성시에만 적용됩니다.
   */
  disableAutoPan?: boolean;

  /**
   * 삭제 가능한 인포윈도우 여부, 최초 생성시에만 적용됩니다.
   */
  removable?: boolean;

  /**
   * 인포윈도우 엘리먼트의 z-index 속성 값
   */
  zIndex?: number;

  /**
   * 로드뷰에 올라있는 인포윈도우의 높이 값(m 단위)
   */
  altitude?: number;

  /**
   * 로드뷰 상에서 인포윈도우의 가시반경(m 단위), 두 지점 사이의 거리가 지정한 값보다 멀어지면 인포윈도우는 보이지 않게 됩니다.
   * 기본값은 500입니다.
   */
  range?: number;
};
