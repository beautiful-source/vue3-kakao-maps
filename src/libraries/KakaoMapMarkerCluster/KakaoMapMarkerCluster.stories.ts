import type { Meta, StoryObj } from '@storybook/vue3';
import { KakaoMap, type KakaoMapMarkerListItem } from '@/components';
import type { KakaoMapProps } from '@/components/KakaoMap/KakaoMap.vue';
import useKakao from '@/util/useKakao';
import markers from '@/libraries/KakaoMapMarkerCluster/markers.json';

const meta = {
  title: 'Libraries/KakaoMapMarkerCluster',
  component: KakaoMap,
  parameters: {
    componentSubtitle: '카카오 지도 마커 클러스터러입니다.'
  },
  //   tags: ['autodocs'],
  argTypes: {}
} satisfies Meta<typeof KakaoMap>;

export default meta;
type Story = StoryObj<typeof KakaoMap>;

const list: KakaoMapMarkerListItem[] = [];
markers.positions.forEach((marker) => {
  list?.push({ lat: marker.lat, lng: marker.lng });
});

export const MarkerCluster: Story = {
  name: '마커 클러스터',
  render: (args: KakaoMapProps) => ({
    components: { KakaoMap },
    setup() {
      useKakao(import.meta.env.VITE_KAKAO_APP_KEY ?? '', ['clusterer']);
      const list: KakaoMapMarkerListItem[] = [];
      markers.positions.forEach((marker) => {
        list?.push({ lat: marker.lat, lng: marker.lng });
      });
      return { args, list };
    },
    template: `
    <KakaoMap :lat="36.34" :lng="127.77" :level="14" :markerCluster="{markers : list}" />
    `
  }),

  args: {
    markerCluster: { markers: list }
  }
};
