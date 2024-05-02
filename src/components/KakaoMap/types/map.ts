import type { MarkerClusterInfo } from '@/components/KakaoMap/types';

/**
 * KakaoMap 컴포넌트 생성을 위한 타입
 */
export type KakaoMapProps = {
  /**
   * 지도의 가로 길이
   */
  width?: number | string;
  /**
   * 지도의 세로 길이
   */
  height?: number | string;
  /**
   * 지도에 표시할 marker 데이터의 리스트
   */
  markerList?: KakaoMapMarkerListItem[];
  /**
   * 지도에 표시할 marker cluster의 속성 및 데이터 리스트
   */
  markerCluster?: MarkerClusterInfo;
  /**
   * 지도의 위도 값
   */
  lat: number;
  /**
   * 지도의 경도 값
   */
  lng: number;
  /**
   * 확대 수준 (기본값: 3)
   */
  level?: number;

  /**
   *  지도 종류를 설정합니다. 기본값은 일반 지도(1), (베이스) 일반 지도: 1, (베이스) 스카이뷰:2, (베이스) 하이브리드(스카이뷰 + 레이블): 3, (오버레이) 레이블: 4, (오버레이) 로드뷰: 5, (오버레이) 교통정보: 6, (오버레이) 지형도: 7, (오버레이) 자전거: 8, (오버레이) 스카이뷰를 위한 자전거 (어두운 지도에서 활용): 9, (오버레이) 지적편집도: 10
   */
  mapTypeId?: kakao.maps.MapTypeId;

  /**
   * 마우스 드래그, 휠, 모바일 터치를 이용한 시점 변경(이동, 확대, 축소) 가능 여부
   */
  draggable?: boolean;

  /**
   * 마우스 휠, 모바일 터치를 이용한 확대 및 축소 가능 여부
   */
  scrollwheel?: boolean;

  /**
   * 더블클릭 이벤트 및 더블클릭 확대 가능 여부, 최초 생성시에만 적용됩니다.
   */
  disableDoubleClick?: boolean;

  /**
   * 더블클릭 확대 가능 여부, 최초 생성시에만 적용됩니다.
   */
  disableDoubleClickZoom?: boolean;

  /**
   * 투영법 지정 (기본값: kakao.maps.ProjectionId.WCONG)
   */
  projectionId?: string;

  /**
   * 지도 타일 애니메이션 설정 여부 (기본값: true)
   */
  tileAnimation?: boolean;

  /**
   * 키보드의 방향키와 +,-키로 지도 이동,확대,축소 가능여부를 설정한다. speed 속성은 지도의 이동속도이며, 처음 생성시에만 적용된다.
   */
  keyboardShortcuts?:
    | boolean
    | {
        speed: number;
      };
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
