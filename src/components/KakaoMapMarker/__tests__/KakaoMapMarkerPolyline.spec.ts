import { mount } from '@vue/test-utils';
import { ref } from 'vue';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { isKakaoMapApiLoaded } from '@/utils/useKakao';
import KakaoMapMarkerPolyline from '@/components/KakaoMapMarker/KakaoMapMarkerPolyline.vue';

type Position = { getLat: () => number; getLng: () => number };
type FakeMarker = { setPosition: (position: Position) => void; getPosition: () => Position };

/**
 * kakao.maps.event.addListener로 등록된 핸들러 (대상 객체 → 이벤트 이름 → 핸들러)
 */
const listeners = new Map<object, Record<string, () => void>>();

const fire = (target: object, type: string): void => {
  const handler = listeners.get(target)?.[type];
  if (handler === undefined) throw new Error(`${type} 핸들러가 등록되지 않았습니다.`);
  handler();
};

beforeEach(() => {
  listeners.clear();
  vi.stubGlobal('kakao', {
    maps: {
      LatLng: class {
        constructor(
          public lat: number,
          public lng: number
        ) {}

        getLat(): number {
          return this.lat;
        }

        getLng(): number {
          return this.lng;
        }
      },
      Size: vi.fn(),
      MarkerImage: vi.fn(),
      Marker: function (options: { position: Position }) {
        let position = options.position;
        return {
          setImage: vi.fn(),
          setMap: vi.fn(),
          setPosition: (next: Position) => {
            position = next;
          },
          getPosition: () => position
        };
      },
      Polyline: function () {
        return { setMap: vi.fn(), setPath: vi.fn(), setOptions: vi.fn(), setZIndex: vi.fn() };
      },
      event: {
        addListener: (target: object, type: string, handler: () => void) => {
          listeners.set(target, { ...listeners.get(target), [type]: handler });
        }
      }
    }
  });
  isKakaoMapApiLoaded.value = true;
});

describe('KakaoMapMarkerPolyline 마커 삭제', () => {
  it('key가 있는 마커를 지운 뒤 다른 마커를 드래그하면, 드래그한 그 마커의 좌표가 갱신된다', async () => {
    const markerList = [
      { key: 'a', lat: 1, lng: 1 },
      { key: 'b', lat: 2, lng: 2 },
      { key: 'c', lat: 3, lng: 3 }
    ];
    const wrapper = mount(KakaoMapMarkerPolyline, { props: { markerList }, global: { provide: { mapRef: ref({}) } } });
    const markerB = wrapper.emitted<[FakeMarker]>('onLoadKakaoMapMarker')?.[1]?.[0];
    if (markerB === undefined) throw new Error('마커가 생성되지 않았습니다.');

    const next = markerList.slice(1); // a 삭제 → [b, c]
    await wrapper.setProps({ markerList: next });

    markerB.setPosition({ getLat: () => 20, getLng: () => 20 });
    fire(markerB, 'dragend');

    expect(next[0]).toMatchObject({ key: 'b', lat: 20, lng: 20 });
    expect(next[1]).toMatchObject({ key: 'c', lat: 3, lng: 3 });
  });
});
