/**
 * KakaoMapCustomOverlay 컴포넌트 생성을 위한 타입
 */
export type KakaoMapCustomOverlayProps = {
  /**
   * 커스텀 오버레이의 위도 값
   */
  lat: number;

  /**
   * 커스텀 오버레이의 경도 값
   */
  lng: number;

  /**
   * KakaoMapCustomOverlay 컴포넌트
   */
  content?: string;

  /**
   * 컨텐츠의 x축 위치. 0_1 사이의 값을 가진다. 기본값은 0.5, 최초 생성시에만 적용됩니다.
   */
  xAnchor?: number;

  /**
   * 컨텐츠의 y축 위치. 0_1 사이의 값을 가진다. 기본값은 0.5, 최초 생성시에만 적용됩니다.
   */
  yAnchor?: number;

  /**
   * 커스텀 오버레이의 z-index
   */
  zIndex?: number;

  /**
   * true 로 설정하면 컨텐츠 영역을 클릭했을 경우 지도 이벤트를 막아준다, 최초 생성시에만 적용됩니다.
   */
  clickable?: boolean;

  /**
   * 사용자가 좌표를 클릭하기 전에 커스텀 오버레이를 표시할 것인지 여부 (기본값: true)
   */
  visible?: boolean;
};
