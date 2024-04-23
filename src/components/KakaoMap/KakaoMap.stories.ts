import type { Meta, StoryObj } from '@storybook/vue3';
import { KakaoMap } from '@/components';
import type { KakaoMapProps } from './KakaoMap.vue';
import useKakao from '@/util/useKakao';

const meta = {
  title: 'Components/KakaoMap',
  component: KakaoMap,
  parameters: {
    componentSubtitle: '카카오 기본 지도 컴포넌트입니다.'
  },
  tags: ['autodocs']
} satisfies Meta<typeof KakaoMap>;

export default meta;
type Story = StoryObj<typeof KakaoMap>;

const renderKakaoMap: any = (args: KakaoMapProps) => ({
  components: { KakaoMap },
  setup() {
    useKakao(import.meta.env.VITE_KAKAO_APP_KEY ?? '');
    return args;
  },
  template: `
  <KakaoMap
  :width=width
  :height=height
  :appKey=appKey
  :markerList=[]
  :lat=lat
  :lng=lng
  :draggable='draggable'
  />
`
});

export const Default: Story = {
  render: renderKakaoMap,
  args: {
    lat: 37.566826,
    lng: 126.9786567
  }
};

export const Other: Story = {
  render: renderKakaoMap,
  args: {
    width: '80rem',
    height: 300,
    lat: 37.566826,
    lng: 126.9786567,
    draggable: true
  }
};
