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

const renderKakaoMap: any = (args: MapMarkerProps) => ({
  components: { MapMarker, KakaoMap },
  setup() {
    useKakao(import.meta.env.VITE_KAKAO_APP_KEY ?? '');
    return { args };
  },
  template: `
    <KakaoMap :lat="args.lat" :lng="args.lng" :draggable="true">
      <MapMarker :lat="args.lat" :lng="args.lng"></MapMarker>
    </KakaoMap>
  `
});

export const Default: Story = {
  render: renderKakaoMap,
  name: '기본 마커',
  args: {
    ...서울특별시청_좌표
  }
};
