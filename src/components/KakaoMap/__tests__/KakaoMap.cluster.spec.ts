import { flushPromises, mount, type VueWrapper } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { isKakaoMapApiLoaded } from '@/utils/useKakao';
import KakaoMap from '@/components/KakaoMap/KakaoMap.vue';

type Item = { kind: string; position: { lat: number; lng: number } };

class FakeClusterer {
  static instances: FakeClusterer[] = [];

  items: Item[];

  addMarkers = vi.fn((markers: Item[]) => {
    this.items.push(...markers);
  });

  removeMarkers = vi.fn((markers: Item[]) => {
    this.items = this.items.filter((item) => !markers.includes(item));
  });

  redraw = vi.fn();

  clear = vi.fn(() => {
    this.items = [];
  });

  setMap = vi.fn();

  constructor(public options: { markers?: Item[]; gridSize?: number }) {
    this.items = [...(options.markers ?? [])];
    FakeClusterer.instances.push(this);
  }
}

beforeEach(() => {
  FakeClusterer.instances = [];
  vi.stubGlobal('kakao', {
    maps: {
      LatLng: class {
        constructor(
          public lat: number,
          public lng: number
        ) {}
      },
      Map: function () {
        return { getCenter: vi.fn(), getLevel: vi.fn() };
      },
      Marker: function (options: object) {
        return { kind: 'marker', ...options };
      },
      CustomOverlay: function (options: object) {
        return { kind: 'overlay', ...options };
      },
      MarkerClusterer: FakeClusterer,
      event: { addListener: vi.fn(), removeListener: vi.fn() }
    }
  });
  isKakaoMapApiLoaded.value = true;
});

const points = (...latLngs: Array<[number, number]>): Array<{ lat: number; lng: number }> =>
  latLngs.map(([lat, lng]) => ({ lat, lng }));

const mountMap = async (markerCluster?: object): Promise<VueWrapper> => {
  const wrapper = mount(KakaoMap, { props: { lat: 37, lng: 127, markerCluster } });
  await flushPromises();
  return wrapper;
};

const latestClusterer = (): FakeClusterer => {
  const clusterer = FakeClusterer.instances[FakeClusterer.instances.length - 1];
  if (clusterer === undefined) throw new Error('클러스터가 만들어지지 않았습니다.');
  return clusterer;
};

const itemAt = (lat: number, lng: number): unknown =>
  expect.objectContaining({ position: expect.objectContaining({ lat, lng }) });

describe('KakaoMap 반응형 클러스터', () => {
  it('마운트 뒤에 들어온 데이터로 클러스터를 만든다', async () => {
    const wrapper = await mountMap();
    expect(FakeClusterer.instances).toHaveLength(0);

    await wrapper.setProps({ markerCluster: { markers: points([1, 1], [2, 2]) } });
    await flushPromises();
    expect(FakeClusterer.instances).toHaveLength(1);
    expect(latestClusterer().items).toHaveLength(2);
    expect(wrapper.emitted('onLoadKakaoMapMarkerCluster')).toHaveLength(1);
  });

  it('항목이 추가·삭제되면 클러스터를 새로 만들지 않고 바뀐 항목만 반영한다', async () => {
    const wrapper = await mountMap({ markers: points([1, 1], [2, 2]) });
    const clusterer = latestClusterer();

    await wrapper.setProps({ markerCluster: { markers: points([1, 1], [2, 2], [3, 3]) } });
    await flushPromises();
    expect(FakeClusterer.instances).toHaveLength(1);
    expect(clusterer.addMarkers).toHaveBeenLastCalledWith([itemAt(3, 3)], true);

    await wrapper.setProps({ markerCluster: { markers: points([2, 2], [3, 3]) } });
    await flushPromises();
    expect(clusterer.removeMarkers).toHaveBeenLastCalledWith([itemAt(1, 1)], true);
    expect(clusterer.items).toHaveLength(2);
  });

  it('템플릿에서 매번 새로 만든 객체라도 내용이 같으면 아무것도 다시 만들지 않는다', async () => {
    const wrapper = await mountMap({ markers: points([1, 1], [2, 2]), styles: [{ width: '30px' }] });
    const clusterer = latestClusterer();

    await wrapper.setProps({ markerCluster: { markers: points([1, 1], [2, 2]), styles: [{ width: '30px' }] } });
    await flushPromises();
    expect(FakeClusterer.instances).toHaveLength(1);
    expect(clusterer.addMarkers).not.toHaveBeenCalled();
    expect(clusterer.removeMarkers).not.toHaveBeenCalled();
  });

  it('항목 내용이 바뀌면 그 항목만 교체한다', async () => {
    const wrapper = await mountMap({ markers: points([1, 1], [2, 2]) });
    const clusterer = latestClusterer();

    await wrapper.setProps({ markerCluster: { markers: points([1, 1], [2, 9]) } });
    await flushPromises();
    expect(clusterer.removeMarkers).toHaveBeenLastCalledWith([itemAt(2, 2)], true);
    expect(clusterer.addMarkers).toHaveBeenLastCalledWith([itemAt(2, 9)], true);
  });

  it('옵션이 바뀌면 기존 kakao 객체를 재사용해 클러스터를 새로 만든다', async () => {
    const wrapper = await mountMap({ markers: points([1, 1], [2, 2]), gridSize: 60 });
    const before = latestClusterer();
    const reused = [...before.items];

    await wrapper.setProps({ markerCluster: { markers: points([1, 1], [2, 2]), gridSize: 80 } });
    await flushPromises();
    const after = latestClusterer();
    expect(FakeClusterer.instances).toHaveLength(2);
    expect(before.clear).toHaveBeenCalled();
    expect(after.options.gridSize).toBe(80);
    expect(after.items).toHaveLength(reused.length);
    after.items.forEach((item, index) => {
      expect(item).toBe(reused[index]);
    });
  });

  it('markerCluster를 없애면 클러스터를 지운다', async () => {
    const wrapper = await mountMap({ markers: points([1, 1]) });
    const clusterer = latestClusterer();

    await wrapper.setProps({ markerCluster: undefined });
    await flushPromises();
    expect(clusterer.clear).toHaveBeenCalled();
    expect(clusterer.setMap).toHaveBeenCalledWith(null);
  });

  it('마커와 커스텀 오버레이를 함께 클러스터링한다', async () => {
    await mountMap({ markers: points([1, 1]), customOverlayProps: [{ lat: 2, lng: 2, content: 'x' }] });
    expect(FakeClusterer.instances).toHaveLength(1);
    expect(latestClusterer().items.map((item) => item.kind)).toEqual(['marker', 'overlay']);
  });
});
