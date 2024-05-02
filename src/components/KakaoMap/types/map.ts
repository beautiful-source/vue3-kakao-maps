import type { KakaoMapMarkerListItem } from '@/components/KakaoMapMarker/types';
import type { MarkerClusterInfo } from '@/components/KakaoMap/types';

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
