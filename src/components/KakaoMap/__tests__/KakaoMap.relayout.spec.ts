import { flushPromises, mount, type VueWrapper } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { isKakaoMapApiLoaded } from '@/utils/useKakao';
import KakaoMap from '@/components/KakaoMap/KakaoMap.vue';

class FakeResizeObserver {
  static instances: FakeResizeObserver[] = [];

  observe = vi.fn();

  disconnect = vi.fn();

  constructor(public callback: () => void) {
    FakeResizeObserver.instances.push(this);
  }
}

const center = { lat: 37, lng: 127 };

const map = {
  getCenter: vi.fn(() => center),
  getLevel: vi.fn(),
  relayout: vi.fn(),
  setCenter: vi.fn()
};

beforeEach(() => {
  FakeResizeObserver.instances = [];
  Object.values(map).forEach((fn) => {
    fn.mockClear();
  });
  vi.stubGlobal('ResizeObserver', FakeResizeObserver);
  vi.stubGlobal('kakao', {
    maps: {
      LatLng: vi.fn(),
      Map: function () {
        return map;
      },
      event: { addListener: vi.fn(), removeListener: vi.fn() }
    }
  });
  isKakaoMapApiLoaded.value = true;
});

const mountMap = async (): Promise<VueWrapper> => {
  const wrapper = mount(KakaoMap, { props: { lat: 37, lng: 127 } });
  await flushPromises();
  return wrapper;
};

describe('KakaoMap 크기 변경 대응', () => {
  it('지도 영역을 관찰하고, 크기가 바뀌면 중심을 유지한 채 relayout한다', async () => {
    const wrapper = await mountMap();
    const observer = FakeResizeObserver.instances[0];
    expect(observer.observe).toHaveBeenCalledWith(wrapper.element);

    observer.callback();
    expect(map.relayout).toHaveBeenCalledTimes(1);
    expect(map.setCenter).toHaveBeenCalledWith(center);
    // 중심은 relayout 전에 읽어야 한다.
    expect(map.getCenter.mock.invocationCallOrder[0]).toBeLessThan(map.relayout.mock.invocationCallOrder[0]);
  });

  it('지도가 만들어지기 전의 크기 변화는 무시한다', async () => {
    isKakaoMapApiLoaded.value = false;
    await mountMap();

    expect(() => {
      FakeResizeObserver.instances[0].callback();
    }).not.toThrow();
    expect(map.relayout).not.toHaveBeenCalled();
  });

  it('언마운트하면 관찰을 끝낸다', async () => {
    const wrapper = await mountMap();
    wrapper.unmount();
    expect(FakeResizeObserver.instances[0].disconnect).toHaveBeenCalled();
  });

  it('ResizeObserver가 없는 환경에서도 에러 없이 마운트된다', async () => {
    vi.stubGlobal('ResizeObserver', undefined);
    await expect(mountMap()).resolves.toBeDefined();
  });
});
