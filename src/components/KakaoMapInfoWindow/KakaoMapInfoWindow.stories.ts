import type { Meta, StoryObj } from '@storybook/vue3';
import { KakaoMap, KakaoMapInfoWindow, MapMarker } from '@/components';
import type { KakaoMapInfoWindowProps } from './KakaoMapInfoWindow.vue';
import { ref } from 'vue';
import { 서울특별시청_좌표 } from '@/constants/coordinate';
import useKakao from '@/util/useKakao';

const meta = {
  title: 'Components/KakaoMapInfoWindow',
  component: KakaoMapInfoWindow,
  parameters: {
    componentSubtitle: '카카오 기본 KakaoMapInfoWindow 컴포넌트입니다.'
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
    default: HTMLElement | string;
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
  <KakaoMapInfoWindow :lat="args.lat" :lng="args.lng" :removable="args.removable">
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

export const WithMarker: Story = {
  name: '인포윈도우 마커에 연결하기',
  render: (args: KakaoMapInfoWindowProps) => ({
    components: { KakaoMap, KakaoMapInfoWindow, MapMarker },
    tags: ['autodocs'],
    setup() {
      useKakao(import.meta.env.VITE_KAKAO_APP_KEY ?? '');

      const marker = ref<kakao.maps.Marker>();
      const onLoadKakaoMarker = (newMarker: kakao.maps.Marker): void => {
        marker.value = newMarker;
      };

      return { args, KakaoMapInfoWindow, MapMarker, onLoadKakaoMarker, marker };
    },
    template: `
    <KakaoMap :lat="37.566826" :lng="126.9786567" :draggable="true">
    <MapMarker :lat="37.566826" :lng="126.9786567" @onLoadKakaoMarker="onLoadKakaoMarker" />
    <KakaoMapInfoWindow :marker="marker" :lat="33.450701" :lng="126.570667" removable>
      <div>
        Hello World!
      </div>
    </KakaoMapInfoWindow>
  </KakaoMap>
  `
  }),
  args: {
    ...서울특별시청_좌표
  }
};
