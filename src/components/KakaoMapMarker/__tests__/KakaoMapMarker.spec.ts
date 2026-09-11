import { mount, type VueWrapper } from '@vue/test-utils';
import { ref } from 'vue';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { isKakaoMapApiLoaded } from '@/utils/useKakao';
import KakaoMapMarker from '@/components/KakaoMapMarker/KakaoMapMarker.vue';

/**
 * 로드 시점을 테스트에서 정하는 가짜 Image. jsdom은 이미지를 실제로 불러오지 않는다.
 */
class FakeImage {
  static instances: FakeImage[] = [];

  onload: (() => void) | null = null;

  src = '';

  width = 0;

  height = 0;

  naturalWidth = 0;

  naturalHeight = 0;

  constructor() {
    FakeImage.instances.push(this);
  }

  finish(width: number, height: number): void {
    this.width = this.naturalWidth = width;
    this.height = this.naturalHeight = height;
    this.onload?.();
  }
}

const marker = {
  setImage: vi.fn(),
  setMap: vi.fn(),
  setClickable: vi.fn(),
  setDraggable: vi.fn()
};

beforeEach(() => {
  FakeImage.instances = [];
  Object.values(marker).forEach((fn) => {
    fn.mockClear();
  });
  vi.stubGlobal('Image', FakeImage);
  vi.stubGlobal('kakao', {
    maps: {
      LatLng: class {
        constructor(
          public lat: number,
          public lng: number
        ) {}
      },
      Size: class {
        constructor(
          public width: number,
          public height: number
        ) {}
      },
      MarkerImage: class {
        constructor(
          public src: string,
          public size: { width: number; height: number }
        ) {}
      },
      Marker: function () {
        return marker;
      },
      event: { addListener: vi.fn() }
    }
  });
  isKakaoMapApiLoaded.value = true;
});

const mountMarker = (props: Record<string, unknown>): VueWrapper =>
  mount(KakaoMapMarker, { props: { lat: 37, lng: 127, ...props }, global: { provide: { mapRef: ref({}) } } });

describe('KakaoMapMarker 이미지', () => {
  it('크기를 주면 이미지 로드를 기다리지 않고 바로 적용한다', () => {
    mountMarker({ image: { imageSrc: 'a.png', imageWidth: 10, imageHeight: 20 } });
    expect(marker.setImage).toHaveBeenLastCalledWith(expect.objectContaining({ src: 'a.png', size: { width: 10, height: 20 } }));
    expect(FakeImage.instances).toHaveLength(0);
  });

  it('imageSrc만 주면 로드가 끝난 뒤 원본 크기로 적용한다 (0x0 마커가 되지 않는다)', () => {
    mountMarker({ image: { imageSrc: 'a.png' } });
    expect(marker.setImage).not.toHaveBeenCalled();

    FakeImage.instances[0].finish(40, 50);
    expect(marker.setImage).toHaveBeenLastCalledWith(expect.objectContaining({ src: 'a.png', size: { width: 40, height: 50 } }));
  });

  it('로드 중에 이미지가 바뀌면 늦게 끝난 이전 로드는 무시한다', async () => {
    const wrapper = mountMarker({ image: { imageSrc: 'a.png' } });
    await wrapper.setProps({ image: { imageSrc: 'b.png', imageWidth: 10, imageHeight: 20 } });

    FakeImage.instances[0].finish(40, 50);
    expect(marker.setImage).toHaveBeenLastCalledWith(expect.objectContaining({ src: 'b.png' }));
  });
});

describe('KakaoMapMarker clickable', () => {
  it('clickable이 바뀌면 setClickable을 호출하고 draggable은 건드리지 않는다', async () => {
    const wrapper = mountMarker({});
    await wrapper.setProps({ clickable: true });
    expect(marker.setClickable).toHaveBeenLastCalledWith(true);
    expect(marker.setDraggable).not.toHaveBeenCalled();
  });
});
