import type { KakaoMapMarkerListItem } from '@/components/KakaoMap/types';

/**
 * KakaoMapPolyline 컴포넌트 생성을 위한 타입
 */
export type KakaoMapPolylineProps = {
  /**
   * 폴리라인이 지나갈 경로
   */
  linePath: kakao.maps.LatLng[];
  /**
   * 선의 화살표 여부
   */
  endArrow?: boolean;
  /**
   * 선의 두께
   */
  strokeWeight?: number;
  /**
   * 선의 색
   */
  strokeColor?: string;
  /**
   * 선의 불투명도. 1에서 0 사이의 값이며 0에 가까울수록 투명하다
   */
  strokeOpacity?: number;
  /**
   *선의 스타일
   */
  strokeStyle?: kakao.maps.StrokeStyles;
  /**
   * 선의 z-index 속성 값
   */
  zIndex?: number;
};

/**
 * KakaoMapMarkerPolyline 컴포넌트 생성을 위한 타입
 */
export type KakaoMapMarkerPolylineProps = {
  /**
   * 지도에 표시할 마커 리스트
   */
  markerList: KakaoMapMarkerListItem[];
  /**
   * 선의 화살표 여부
   */
  endArrow?: boolean;
  /**
   * 선의 두께
   */
  strokeWeight?: number;
  /**
   * 선의 색
   */
  strokeColor?: string;
  /**
   * 선의 불투명도. 1에서 0 사이의 값이며 0에 가까울수록 투명하다
   */
  strokeOpacity?: number;
  /**
   *선의 스타일
   */
  strokeStyle?: kakao.maps.StrokeStyles;
  /**
   * 마커의 순서 표시 여부
   */
  showMarkerOrder?: boolean;
};
