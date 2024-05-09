import type { Meta, StoryObj } from '@storybook/vue3';
import { KakaoMap, KakaoMapInfoWindow, KakaoMapMarker } from '@/components';
import type { KakaoMapInfoWindowProps } from '@/components/KakaoMapInfoWindow/types';
import { ref } from 'vue';
import { 서울특별시청_좌표 } from '@/constants/coordinate';
import useKakao from '@/utils/useKakao';

const meta = {
  title: 'Components/KakaoMapInfoWindow',
  component: KakaoMapInfoWindow,
  parameters: {
    componentSubtitle: '기본 커스텀 오버레이 컴포넌트입니다.'
  },
  tags: ['autodocs'],
  argTypes: {
    marker: {
      table: {
        type: {
          summary: 'kakao.maps.Marker'
        }
      },
      control: false
    },
    removable: {
      control: false
    },
    visible: {
      control: {
        type: 'boolean'
      }
    },
    default: {
      name: 'KakaoMapInfoWindow의 content',
      description: 'KakaoMapInfoWindow 내부 content는 slot으로도 전달 가능합니다.',
      control: {
        type: 'text'
      },
      table: {
        category: 'Slots',
        type: {
          summary: 'html | string'
        }
      }
    }
  }
} satisfies Meta<typeof KakaoMapInfoWindow>;

export default meta;
type Story = StoryObj<typeof KakaoMapInfoWindow>;

const renderKakaoMap: any = (
  args: KakaoMapInfoWindowProps & {
    default: string;
  }
) => ({
  components: { KakaoMap, KakaoMapInfoWindow },
  tags: ['autodocs'],
  setup() {
    useKakao(import.meta.env.VITE_KAKAO_APP_KEY ?? '');
    return { args, KakaoMapInfoWindow };
  },
  template: `
  <KakaoMap
  :lat='37.566826'
  :lng='126.9786567'
  >
  <KakaoMapInfoWindow :lat="args.lat" :lng="args.lng" :removable="args.removable" :content="args?.content" :visible="args?.visible">
  ${args.default}
  </KakaoMapInfoWindow>
  </KakaoMap>
`
});

export const Default: Story = {
  name: '인포윈도우 생성하기',
  render: renderKakaoMap,
  args: {
    ...서울특별시청_좌표,
    removable: true,
    default: '<div>Hello World!</div>'
  }
};

export const ContentDefault: Story = {
  name: '인포윈도우 생성하기2',
  render: (args: KakaoMapInfoWindowProps) => ({
    components: { KakaoMap, KakaoMapInfoWindow },
    tags: ['autodocs'],
    setup() {
      useKakao(import.meta.env.VITE_KAKAO_APP_KEY ?? '');
      return { args, KakaoMapInfoWindow };
    },
    template: `
    <KakaoMap :lat="37.566826" :lng="126.9786567" :draggable="true">
      <KakaoMapInfoWindow :lat="args.lat" :lng="args.lng" :content="args.content" :visible="args?.visible"/>
    </KakaoMap>
    `
  }),
  args: {
    ...서울특별시청_좌표,
    content: 'Hello World!',
    removable: true
  }
};

export const WithMarker: Story = {
  name: '인포윈도우 마커에 연결하기',
  render: (args: KakaoMapInfoWindowProps) => ({
    components: { KakaoMap, KakaoMapInfoWindow, KakaoMapMarker },
    tags: ['autodocs'],
    setup() {
      useKakao(import.meta.env.VITE_KAKAO_APP_KEY ?? '');

      const marker = ref<kakao.maps.Marker>();
      const onLoadKakaoMapMarker = (newMarker: kakao.maps.Marker): void => {
        marker.value = newMarker;
      };

      return { args, onLoadKakaoMapMarker, marker };
    },
    template: `
    <KakaoMap :lat="37.566826" :lng="126.9786567" :draggable="true">
      <KakaoMapMarker :lat="37.566826" :lng="126.9786567" @onLoadKakaoMapMarker="onLoadKakaoMapMarker" />
      <KakaoMapInfoWindow :marker="marker" :lat="args.lat" :lng="args.lng" removable  :visible="args?.visible">
        <div>Hello World!</div>
      </KakaoMapInfoWindow>
    </KakaoMap>
    `
  }),
  args: {
    ...서울특별시청_좌표
  }
};

export const InVisible: Story = {
  name: '보이지 않게 인포윈도우 생성하기',
  render: (args: KakaoMapInfoWindowProps) => ({
    components: { KakaoMap, KakaoMapInfoWindow, KakaoMapMarker },
    tags: ['autodocs'],
    setup() {
      useKakao(import.meta.env.VITE_KAKAO_APP_KEY ?? '');

      const marker = ref<kakao.maps.Marker>();
      const onLoadKakaoMapMarker = (newMarker: kakao.maps.Marker): void => {
        marker.value = newMarker;
      };

      return { args, onLoadKakaoMapMarker, marker };
    },
    template: `
    <KakaoMap :lat="37.566826" :lng="126.9786567" :draggable="true">
      <KakaoMapMarker :lat="37.566826" :lng="126.9786567" @onLoadKakaoMapMarker="onLoadKakaoMapMarker" />
      <KakaoMapInfoWindow :marker="marker" :lat="args.lat" :lng="args.lng" removable :visible="args.visible">
        <div>Hello World!</div>
      </KakaoMapInfoWindow>
    </KakaoMap>
    `
  }),
  args: {
    ...서울특별시청_좌표,
    visible: false
  }
};
