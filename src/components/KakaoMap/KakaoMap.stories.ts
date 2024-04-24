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
  tags: ['autodocs'],
  argTypes: {
    mapTypeId: {
      control: 'number'
    },
    keyboardShortcuts: {
      control: 'boolean'
    }
  }
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
  :markerList=[]
  :lat=lat
  :lng=lng
  :draggable=draggable
  :level=level
  :scrollwheel=scrollwheel
  :mapTypeId=mapTypeId
  :tileAnimation=tileAnimation
  :keyboardShortcuts=keyboardShortcuts
  />
`
});

export const 기본_지도: Story = {
  render: renderKakaoMap,
  args: {
    lat: 37.566826,
    lng: 126.9786567,
    width: '40rem',
    height: '50rem',
    draggable: true,
    level: 3,
    scrollwheel: true,
    tileAnimation: true,
    keyboardShortcuts: false
  }
};
