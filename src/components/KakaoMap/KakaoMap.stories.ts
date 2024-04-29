import type { Meta, StoryObj } from '@storybook/vue3';
import { KakaoMap } from '@/components';
import type { KakaoMapProps } from './KakaoMap.vue';
import useKakao from '@/util/useKakao';
import KakaoMapMoveCenter from './KakaoMapMoveCenter.vue';
import { computed, ref } from 'vue';
import { 서울특별시청_좌표 } from '@/constants/coordinate';

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
    components: { KakaoMapMoveCenter },
    setup() {
      return { args };
    },
    template: '<KakaoMapMoveCenter />'
  }),
  parameters: {
    docs: {
      source: {
        type: 'dynamic',
        code: `
        <script setup lang="ts">
          import { KakaoMap } from '@/components';
          import useKakao from '@/util/useKakao';
          import { ref } from 'vue';

          useKakao(import.meta.env.VITE_KAKAO_APP_KEY ?? '');

          const curLat = ref(33.450701);
          const curLng = ref(126.570667);

          const move = (newLat: number, newLng: number): void => {
            curLat.value = newLat;
            curLng.value = newLng;
          };
          </script>

          <template>
            <KakaoMap :lat="curLat" :lng="curLng"></KakaoMap>
            <button @click="move(33.452613, 126.570888)">moveTo1</button>
            <button @click="move(33.45058, 126.574942)">moveTo2</button>
          </template>
        `
      },
      showSource: true
    }
  }
};

const renderGetMapInfo: any = (args: KakaoMapProps) => ({
  components: { KakaoMap },
  setup() {
    useKakao(import.meta.env.VITE_KAKAO_APP_KEY ?? '');
    const ourKakaoMap = ref<kakao.maps.Map>();
    const isKakaoMapLoaded = ref<boolean>(false);
    const buttonMessage = computed<string>(() => (isKakaoMapLoaded.value ? '지도 정보 얻어오기' : '지도 로딩중'));
    const mapInfo = ref<string>('');
    const getMapInfo = (map: kakao.maps.Map): void => {
      if (map === undefined) return;

      // 지도의 현재 중심좌표를 얻어옵니다
      const center = map.getCenter();

      // 지도의 현재 레벨을 얻어옵니다
      const level = map.getLevel();

      // 지도타입을 얻어옵니다
      const mapTypeId = map.getMapTypeId();

      // 지도의 현재 영역을 얻어옵니다
      const bounds = map.getBounds();

      // 영역의 남서쪽 좌표를 얻어옵니다
      const swLatLng = bounds.getSouthWest();

      // 영역의 북동쪽 좌표를 얻어옵니다
      const neLatLng = bounds.getNorthEast();

      // 영역정보를 문자열로 얻어옵니다. ((남,서), (북,동)) 형식입니다
      const boundsStr = bounds.toString();

      mapInfo.value = `지도 중심좌표는 위도 ${center.getLat()}, <br /> 경도 ${center.getLng()} 이고,
        지도 레벨은 ${level} 입니다. <br />
        지도 타입은 ${mapTypeId} 이고
        지도의 남서쪽 좌표는 ${swLatLng.getLat()}, ${swLatLng.getLng()} 이고 <br />
        북동쪽 좌표는 ${neLatLng.getLat()}, ${neLatLng.getLng()} 입니다. <br />
        영역 정보는 ${boundsStr} 입니다.`;
    };

    return {
      args,
      ourKakaoMap,
      buttonMessage,
      isKakaoMapLoaded,
      mapInfo,
      getMapInfo
    };
  },
  template: `
      <KakaoMap
        @onLoadKakaoMap="(map) => {isKakaoMapLoaded = true; ourKakaoMap = map}"
        :lat="args.lat"
        :lng="args.lng"
        :draggable="true"
      >
      </KakaoMap>
      <button @click="getMapInfo(ourKakaoMap)" :disabled="!isKakaoMapLoaded">
        {{ buttonMessage }}
      </button>
      <p v-html="mapInfo"></p>
    `
});

export const GetMapInfo: Story = {
  name: '지도 정보 얻어오기',
  render: renderGetMapInfo,
  args: {
    ...서울특별시청_좌표
  }
};
