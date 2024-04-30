import { KakaoMap, KakaoMapMarker } from '@/components';
import type { KakaoMapMarkerImage } from '@/types';
import { 서울특별시청_좌표, DEFAULT_MARKER_IMAGE } from '@/constants/coordinate';
import useKakao from '@/utils/useKakao';
import type { Meta, StoryObj } from '@storybook/vue3';
import type { KakaoMapMarkerProps } from './KakaoMapMarker.vue';

const meta = {
  title: 'Components/KakaoMapMarker',
  component: KakaoMapMarker,
  parameters: {
    componentSubtitle: '카카오맵 마커 컴포넌트입니다.'
  },
  tags: ['autodocs'],
  argTypes: {
    image: {
      control: 'object'
    }
  }
} satisfies Meta<typeof KakaoMapMarker>;

export default meta;
type Story = StoryObj<typeof KakaoMapMarker>;

const renderKakaoMapMarker: any = (args: KakaoMapMarkerProps) => ({
  components: { KakaoMapMarker, KakaoMap },
  setup() {
    useKakao(import.meta.env.VITE_KAKAO_APP_KEY ?? '');
    return { args };
  },
  template: `
    <KakaoMap :lat="args.lat" :lng="args.lng" :draggable="true" >
      <KakaoMapMarker :lat="args.lat" :lng="args.lng" :infoWindow="args.infoWindow" :image="args.image"></KakaoMapMarker>
    </KakaoMap>
  `
});

export const Default: Story = {
  render: renderKakaoMapMarker,
  name: '기본 마커',
  args: {
    ...서울특별시청_좌표,
    image: DEFAULT_MARKER_IMAGE
  }
};

/**
 * 마커의 다른 이미지
 */
const anotherImage: KakaoMapMarkerImage = {
  imageSrc: `https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png`,
  imageWidth: 64,
  imageHeight: 64,
  imageOption: {}
};

export const MarkerImage: Story = {
  name: '다른 이미지로 마커 생성하기',
  render: (args: any) => ({
    components: { KakaoMapMarker, KakaoMap },
    setup() {
      useKakao(import.meta.env.VITE_KAKAO_APP_KEY ?? '');
      return { args };
    },
    template: `
      <KakaoMap :lat="args.lat" :lng="args.lng" :draggable="true">
        <KakaoMapMarker :lat="args.lat" :lng="args.lng" :image="args.image"></KakaoMapMarker>
      </KakaoMap>
    `
  }),
  args: {
    ...서울특별시청_좌표,
    image: anotherImage
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

const renderKakaoMapMarkerSlot: any = (args: KakaoMapMarkerProps) => ({
  components: { KakaoMapMarker, KakaoMap },
  setup() {
    useKakao(import.meta.env.VITE_KAKAO_APP_KEY ?? '');
    return { args };
  },
  template: `
    <KakaoMap :lat="args.lat" :lng="args.lng" :draggable="true" >
      <KakaoMapMarker :lat="args.lat" :lng="args.lng" :infoWindow="args.infoWindow">
        <template v-slot:infoWindow>
          <div>v-slot으로 추가</div>
        </template>
      </KakaoMapMarker>
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
