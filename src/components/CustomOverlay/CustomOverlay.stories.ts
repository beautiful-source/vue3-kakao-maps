import type { Meta, StoryObj } from '@storybook/vue3';
import { KakaoMap, CustomOverlay } from '@/components';
import type { KakaoMapProps } from '../KakaoMap/KakaoMap.vue';
import useKakao from '@/util/useKakao';

const meta = {
  title: 'Components/CustomOverlay',
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
  components: { KakaoMap, CustomOverlay },
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
  >
  <CustomOverlay v-if="map" :map="map" :lat="33.450701" :lng="126.570667" removable>
  <div
    style="
      background-color: #ffc107;
      color: #333;
      padding: 0.5rem 1rem;
      border-radius: 50%;
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
      font-size: 1rem;
      font-weight: bold;
      display: inline-block;
      cursor: pointer;
      transition: transform 0.2s;
    "
  >
    카카오
  </div>
</CustomOverlay>
  </KakaoMap>
`
});

export const 기본_지도: Story = {
  render: renderKakaoMap,
  args: {
    lat: 33.450701,
    lng: 126.570667,
    width: '40rem',
    height: '50rem',
    draggable: true,
    level: 3,
    scrollwheel: true,
    tileAnimation: true,
    keyboardShortcuts: false
  }
};
