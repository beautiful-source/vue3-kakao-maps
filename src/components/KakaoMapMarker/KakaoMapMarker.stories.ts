import { KakaoMap, KakaoMapMarker } from '@/components';
import type { KakaoMapMarkerProps, KakaoMapMarkerImage, KakaoMapMarkerInfoWindow } from '@/components/KakaoMapMarker/types';
import { 서울특별시청_좌표 } from '@/constants/coordinate';
import useKakao from '@/utils/useKakao';
import type { Meta, StoryObj } from '@storybook/vue3';
import { DEFAULT_MARKER_IMAGE } from '@/constants/markerImage';
import { ref } from 'vue';
import type { KakaoMapMarkerListItem } from '../KakaoMap/types';

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
      <KakaoMapMarker :lat="args.lat" :lng="args.lng" :infoWindow="args.infoWindow" :image="args.image"/>
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
        <KakaoMapMarker :lat="args.lat" :lng="args.lng" :image="args.image"/>
      </KakaoMap>
    `
  }),
  args: {
    ...서울특별시청_좌표,
    image: anotherImage
  }
};

export const MarkerWithInfoWindow: Story = {
  render: (args: any) => ({
    components: { KakaoMapMarker, KakaoMap },
    setup() {
      useKakao(import.meta.env.VITE_KAKAO_APP_KEY ?? '');
      const infoWindow: KakaoMapMarkerInfoWindow = {
        content: 'hi',
        visible: true
      };
      return { args, infoWindow };
    },
    template: `
      <KakaoMap :lat="args.lat" :lng="args.lng" :draggable="true">
        <KakaoMapMarker :lat="args.lat" :lng="args.lng" :image="args.image" :infoWindow="infoWindow"/>
      </KakaoMap>
    `
  }),
  name: '인포윈도우가 있는 마커1',
  args: {
    ...서울특별시청_좌표
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
      <KakaoMapMarker :lat="args.lat" :lng="args.lng">
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

export const MarkerWithInfoWindowEvent: Story = {
  name: '마커에 클릭 이벤트 등록하기1',
  render: (args: any) => ({
    components: { KakaoMapMarker, KakaoMap },
    setup() {
      useKakao(import.meta.env.VITE_KAKAO_APP_KEY ?? '');
      const visibleRef = ref<boolean>(true);

      const onClickKakaoMapMarker = (): void => {
        visibleRef.value = !visibleRef.value;
      };
      return { args, onClickKakaoMapMarker, visibleRef };
    },
    template: `
    <KakaoMap :lat="37.566826" :lng="126.9786567">
    <KakaoMapMarker
      :lat="args.lat"
      :lng="args.lng"
      :infoWindow="{ content: 'Hello World', visible: visibleRef }"
      @onClickKakaoMapMarker="onClickKakaoMapMarker"
    />
    </KakaoMap>
    `
  }),
  args: {
    ...서울특별시청_좌표
  }
};

export const MarkerWithInfoWindowListEvent: Story = {
  name: '마커에 클릭 이벤트 등록하기2',
  render: (args: any) => ({
    components: { KakaoMapMarker, KakaoMap },
    setup() {
      useKakao(import.meta.env.VITE_KAKAO_APP_KEY ?? '');
      const list = ref<KakaoMapMarkerListItem[]>([
        {
          lat: 37.56562,
          lng: 126.978,
          infoWindow: {
            content: '서울',
            visible: false
          }
        },
        {
          lat: 37.5682,
          lng: 126.9766,
          infoWindow: {
            content: '서울2',
            visible: true
          }
        },
        { lat: 37.5678, lng: 126.97985 },
        { lat: 37.566826, lng: 126.9786567 }
      ]);

      const onClickKakaoMapMarker = (markerItem: KakaoMapMarkerListItem): void => {
        if (markerItem.infoWindow?.visible !== null && markerItem.infoWindow?.visible !== undefined) {
          markerItem.infoWindow.visible = !markerItem.infoWindow.visible;
        }
      };
      return { args, onClickKakaoMapMarker, list };
    },
    template: `
    <KakaoMap :lat="37.566826" :lng="126.9786567">
      <KakaoMapMarker
        v-for="(marker, index) in list"
        :key="marker.key === undefined ? index : marker.key"
        :lat="marker.lat"
        :lng="marker.lng"
        :infoWindow="{
          content: marker.infoWindow?.content || '',
          visible: marker.infoWindow?.visible ?? true,
        }"
        @on-click-kakao-map-marker="onClickKakaoMapMarker(marker)"
      />
    </KakaoMap>
    `
  }),
  args: {
    ...서울특별시청_좌표
  }
};
