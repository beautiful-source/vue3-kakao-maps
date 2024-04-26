import type { Meta, StoryObj } from '@storybook/vue3';
import { KakaoMap, KakaoMapCustomOverlay, MapMarker } from '@/components';
import type { KakaoMapCustomOverlayProps } from './KakaoMapCustomOverlay.vue';
import { 서울특별시청_좌표 } from '@/constants/coordinate';
import useKakao from '@/util/useKakao';

const meta = {
  title: 'Components/KakaoMapCustomOverlay',
  component: KakaoMapCustomOverlay,
  parameters: {
    componentSubtitle: '카카오 기본 KakaoMapInfoWindow 컴포넌트입니다.',
    slots: {
      default: {
        description: 'content는 slot으로도 전달 가능합니다'
      }
    }
  },
  tags: ['autodocs']
} satisfies Meta<typeof KakaoMapCustomOverlay>;

export default meta;
type Story = StoryObj<typeof KakaoMapCustomOverlay>;

const renderKakaoMap: any = (args: KakaoMapCustomOverlayProps) => ({
  components: { KakaoMap, KakaoMapCustomOverlay },
  tags: ['autodocs'],
  setup() {
    useKakao(import.meta.env.VITE_KAKAO_APP_KEY ?? '');
    return { args, KakaoMapCustomOverlay };
  },
  template: `
  <KakaoMap
  :lat='37.566826'
  :lng='126.9786567'
  >
  <KakaoMapCustomOverlay :lat="args.lat" :lng="args.lng" >
  <div
  style='
    background-color: #ffc107;
    color: #333;
    padding: 1rem 2rem;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    font-size: 1.2rem;
    font-weight: bold;
  '>
  Hello World!
  </div>
  </KakaoMapCustomOverlay>
  </KakaoMap>
`
});

export const Default: Story = {
  name: '커스텀오버레이 생성하기',
  render: renderKakaoMap,
  args: {
    ...서울특별시청_좌표
  }
};

export const WithMarker: Story = {
  name: '마커에 커스텀오버레이 표시하기',
  render: (args: KakaoMapCustomOverlayProps) => ({
    components: { KakaoMap, KakaoMapCustomOverlay, MapMarker },
    tags: ['autodocs'],
    setup() {
      useKakao(import.meta.env.VITE_KAKAO_APP_KEY ?? '');
      return { args, KakaoMapCustomOverlay, MapMarker };
    },
    template: `
    <KakaoMap
    :lat='33.450701'
    :lng='126.570667'
    >    
    <MapMarker :lat="33.450701" :lng="126.570667" />
    <KakaoMapCustomOverlay :lat="args.lat" :lng="args.lng" yAnchor='1.8'>
    <div
    style='
      background-color: #ffc107;
      color: #333;
      padding: 1rem 2rem;
      border-radius: 10px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
      font-size: 1.2rem;
      font-weight: bold;
    '>
    Hello World!
    </div>
    </KakaoMapCustomOverlay>
    </KakaoMap>
  `
  }),
  args: {
    ...서울특별시청_좌표
  }
};
