import type { Meta, StoryObj } from '@storybook/vue3';
import { KakaoMap } from '@/components';
import type { KakaoMapProps } from './KakaoMap.vue';
import useKakao from '@/util/useKakao';
import { ref } from 'vue';

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
    return { args };
  },
  template: `
  <KakaoMap
  :width=args.width
  :height=args.height
  :markerList=args.markerList
  :lat=args.lat
  :lng=args.lng
  :draggable=args.draggable
  :level=args.level
  :scrollwheel=args.scrollwheel
  :mapTypeId=args.mapTypeId
  :tileAnimation=args.tileAnimation
  :keyboardShortcuts=args.keyboardShortcuts
  />
  `
});

export const Default: Story = {
  name: '지도 생성하기',
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

const markerList = [
  {
    lat: 33.450705,
    lng: 126.570667
  },
  {
    lat: 33.450936,
    lng: 126.569477
  },
  { lat: 33.450879, lng: 126.56994 },
  { lat: 33.451393, lng: 126.570738 }
];

export const MapWithMarkerList: Story = {
  name: '여러개 마커 표시하기',
  render: renderKakaoMap,
  args: {
    lat: 33.450705,
    lng: 126.570667,
    width: '20rem',
    height: '20rem',
    draggable: true,
    level: 3,
    scrollwheel: true,
    tileAnimation: true,
    keyboardShortcuts: false,
    markerList
  }
};

export const MoveCenter: Story = {
  name: '지도 이동시키기',
  render: (args: any) => ({
    components: { KakaoMap },
    setup() {
      useKakao(import.meta.env.VITE_KAKAO_APP_KEY ?? '');
      const curLat = ref(33.450701);
      const curLng = ref(126.570667);

      const move = (newLat: number, newLng: number): void => {
        curLat.value = newLat;
        curLng.value = newLng;
      };

      return {
        curLat,
        curLng,
        move
      };
    },
    template: `
      <KakaoMap :lat="curLat" :lng="curLng"></KakaoMap>
      <button @click="move(33.452613, 126.570888)">moveTo1</button>
      <button @click="move(33.45058, 126.574942)">moveTo2</button>
    `
  })
};
