import { flushPromises, mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { isKakaoMapApiLoaded } from '@/utils/useKakao';
import KakaoMap from '@/components/KakaoMap/KakaoMap.vue';

const map = { setMapTypeId: vi.fn() };

beforeEach(() => {
  map.setMapTypeId.mockClear();
  vi.stubGlobal('kakao', {
    maps: {
      LatLng: vi.fn(),
      Map: function () {
        return map;
      },
      MapTypeId: { ROADMAP: 1, SKYVIEW: 2, HYBRID: 3 },
      event: { addListener: vi.fn(), removeListener: vi.fn() }
    }
  });
  isKakaoMapApiLoaded.value = true;
});

describe('KakaoMap mapTypeId', () => {
  it('mapTypeId를 해제하면 기본 지도(ROADMAP)로 돌아간다', async () => {
    const wrapper = mount(KakaoMap, { props: { lat: 37, lng: 127, mapTypeId: 2 } });
    await flushPromises();

    await wrapper.setProps({ mapTypeId: undefined });
    expect(map.setMapTypeId).toHaveBeenLastCalledWith(1);
  });
});
