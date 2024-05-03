import type { Meta, StoryObj } from '@storybook/vue3';
import { KakaoMap } from '@/components';
import type { KakaoMapProps, KakaoMapMarkerListItem } from '@/components/KakaoMap/types';
import useKakao from '@/utils/useKakao';

const meta = {
  title: 'Libraries/KakaoMapMarkerCluster',
  component: KakaoMap,
  parameters: {
    componentSubtitle: '카카오 지도 마커 클러스터러입니다.'
  },
  argTypes: {}
} satisfies Meta<typeof KakaoMap>;

export default meta;
type Story = StoryObj<typeof KakaoMap>;

const list: KakaoMapMarkerListItem[] = [
  {
    lat: 37.27943075229118,
    lng: 127.01763998406159
  },
  {
    lat: 37.55915668706214,
    lng: 126.92536526611102
  },
  {
    lat: 35.13854258261161,
    lng: 129.1014781294671
  },
  {
    lat: 37.55518388656961,
    lng: 126.92926237742505
  },
  {
    lat: 35.20618517638034,
    lng: 129.07944301057026
  },
  {
    lat: 37.561110808242056,
    lng: 126.9831268386891
  }
];

export const MarkerCluster: Story = {
  name: '마커 클러스터',
  render: (args: KakaoMapProps) => ({
    components: { KakaoMap },
    setup() {
      useKakao(import.meta.env.VITE_KAKAO_APP_KEY ?? '', ['clusterer']);

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
