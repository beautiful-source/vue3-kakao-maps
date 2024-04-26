import { KakaoMap, MapMarker } from '@/components';
import { 서울특별시청_좌표 } from '@/constants/coordinate';
import useKakao from '@/util/useKakao';
import type { Meta, StoryObj } from '@storybook/vue3';
import type { MapMarkerProps } from './MapMarker.vue';

const meta = {
  title: 'Components/MapMarker',
  component: MapMarker,
  parameters: {
    componentSubtitle: '카카오맵 마커 컴포넌트입니다.'
  },
  tags: ['autodocs']
} satisfies Meta<typeof MapMarker>;

export default meta;
type Story = StoryObj<typeof MapMarker>;

const renderKakaoMapMarker: any = (args: MapMarkerProps) => ({
  components: { MapMarker, KakaoMap },
  setup() {
    useKakao(import.meta.env.VITE_KAKAO_APP_KEY ?? '');
    return { args };
  },
  template: `
    <KakaoMap :lat="args.lat" :lng="args.lng" :draggable="true" >
      <MapMarker :lat="args.lat" :lng="args.lng" :infoWindow="args.infoWindow"></MapMarker>
    </KakaoMap>
  `
});

export const Default: Story = {
  render: renderKakaoMapMarker,
  name: '기본 마커',
  args: {
    ...서울특별시청_좌표
  }
};

export const MarkerWithInfoWindow: Story = {
  render: renderKakaoMapMarker,
  name: '인포윈도우가 있는 마커1',

  args: {
    ...서울특별시청_좌표,
    infoWindow: 'props로 추가'
  }
};

const renderKakaoMapMarkerSlot: any = (args: MapMarkerProps) => ({
  components: { MapMarker, KakaoMap },
  setup() {
    useKakao(import.meta.env.VITE_KAKAO_APP_KEY ?? '');
    return { args };
  },
  template: `
    <KakaoMap :lat="args.lat" :lng="args.lng" :draggable="true" >
      <MapMarker :lat="args.lat" :lng="args.lng" :infoWindow="args.infoWindow">
        <template v-slot:infoWindow>
          <div>v-slot으로 추가</div>
        </template>
      </MapMarker>
    </KakaoMap>
  `
});

export const MarkerWithInfoWindowSlot: Story = {
  render: renderKakaoMapMarkerSlot,
  name: '인포윈도우가 있는 마커2',

  args: {
    ...서울특별시청_좌표
  }
};
