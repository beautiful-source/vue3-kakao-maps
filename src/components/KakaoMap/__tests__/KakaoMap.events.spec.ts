import { flushPromises, mount, type VueWrapper } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { isKakaoMapApiLoaded } from '@/utils/useKakao';
import KakaoMap from '@/components/KakaoMap/KakaoMap.vue';

type Handler = (...args: unknown[]) => void;

/**
 * 가짜 지도의 현재 상태
 */
let state = { lat: 37, lng: 127, level: 3 };

/**
 * kakao.maps.event.addListener로 등록된 핸들러 (이벤트 이름 → 핸들러)
 */
const listeners = new Map<string, Handler>();

const map = {
  getCenter: vi.fn(() => ({ getLat: () => state.lat, getLng: () => state.lng })),
  getLevel: vi.fn(() => state.level),
  panTo: vi.fn(),
  setLevel: vi.fn()
};

const removeListener = vi.fn((_target: unknown, type: string, handler: Handler) => {
  if (listeners.get(type) === handler) listeners.delete(type);
});

const fire = (type: string, ...args: unknown[]): void => {
  const handler = listeners.get(type);
  if (handler === undefined) throw new Error(`${type} 핸들러가 등록되지 않았습니다.`);
  handler(...args);
};

beforeEach(() => {
  state = { lat: 37, lng: 127, level: 3 };
  listeners.clear();
  [map.getCenter, map.getLevel, map.panTo, map.setLevel, removeListener].forEach((fn) => {
    fn.mockClear();
  });
  vi.stubGlobal('kakao', {
    maps: {
      LatLng: class {
        constructor(
          public lat: number,
          public lng: number
        ) {}
      },
      Map: function () {
        return map;
      },
      event: {
        addListener: (_target: unknown, type: string, handler: Handler) => {
          listeners.set(type, handler);
        },
        removeListener
      }
    }
  });
  isKakaoMapApiLoaded.value = true;
});

const mountMap = async (props: Record<string, unknown> = {}): Promise<VueWrapper> => {
  const wrapper = mount(KakaoMap, { props: { lat: 37, lng: 127, ...props } });
  await flushPromises();
  return wrapper;
};

describe('KakaoMap 지도 이벤트', () => {
  it('마우스 이벤트는 (mouseEvent, map), 나머지 이벤트는 (map)으로 전달한다', async () => {
    const wrapper = await mountMap();
    const mouseEvent = { latLng: 'clicked' };
    fire('click', mouseEvent);
    fire('zoom_changed');
    fire('center_changed');

    expect(wrapper.emitted('click')).toEqual([[mouseEvent, map]]);
    expect(wrapper.emitted('zoomChanged')).toEqual([[map]]);
    expect(wrapper.emitted('centerChanged')).toEqual([[map]]);
  });

  it('14개 카카오 이벤트를 모두 등록하고, 언마운트하면 모두 해제한다', async () => {
    const wrapper = await mountMap();
    expect(listeners.size).toBe(14);

    wrapper.unmount();
    expect(removeListener).toHaveBeenCalledTimes(14);
    expect(listeners.size).toBe(0);
  });
});

describe('KakaoMap v-model (lat, lng, level)', () => {
  it('이동·확대가 끝나면(idle) 바뀐 값을 update 이벤트로 올려보낸다', async () => {
    const wrapper = await mountMap();
    state = { lat: 38, lng: 128, level: 5 };
    fire('idle');

    expect(wrapper.emitted('update:lat')).toEqual([[38]]);
    expect(wrapper.emitted('update:lng')).toEqual([[128]]);
    expect(wrapper.emitted('update:level')).toEqual([[5]]);
    expect(wrapper.emitted('idle')).toEqual([[map]]);
  });

  it('값이 그대로면 update 이벤트를 보내지 않는다', async () => {
    const wrapper = await mountMap();
    fire('idle');

    expect(wrapper.emitted('update:lat')).toBeUndefined();
    expect(wrapper.emitted('update:level')).toBeUndefined();
  });

  it('올려보낸 값을 부모가 다시 내려줘도 지도를 또 움직이지 않는다', async () => {
    const wrapper = await mountMap();
    state = { lat: 38, lng: 128, level: 5 };
    fire('idle');

    await wrapper.setProps({ lat: 38, lng: 128, level: 5 });
    expect(map.panTo).not.toHaveBeenCalled();
    expect(map.setLevel).not.toHaveBeenCalled();
  });

  it('부모가 다른 값을 내려주면 지도를 그 위치·레벨로 옮긴다', async () => {
    const wrapper = await mountMap();

    await wrapper.setProps({ lat: 36 });
    expect(map.panTo).toHaveBeenCalledTimes(1);
    expect(map.panTo).toHaveBeenLastCalledWith(expect.objectContaining({ lat: 36, lng: 127 }));

    await wrapper.setProps({ level: 7 });
    expect(map.setLevel).toHaveBeenLastCalledWith(7);
  });
});
