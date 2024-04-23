import { KakaoMap, MapMarker } from '@/components';
import useKakao from '@/util/useKakao';
import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';
import type { MapMarkerProps } from './MapMarker.vue';

const meta = {
  title: 'Components/MapMarker',
  component: MapMarker,
  parameters: {
    componentSubtitle: '카카오 맵 마커 컴포넌트입니다.'
  },
  tags: ['autodocs'],
  argTypes: {
    map: {
      description: '마커가 표시될 맵입니다.',
      table: {
        type: { summary: 'kakao.maps.Map' }
      }
    },
    lat: {
      description: '위도 좌표입니다.',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: 37.566826 }
      }
    },
    lng: {
      description: '경도 좌표입니다.',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: 126.9786567 }
      }
    },
    infoWindow: {
      description: '마커의 인포윈도우에 표시될 문자열입니다.',
      table: {
        type: { summary: 'string' }
      }
    }
  }
} satisfies Meta<typeof MapMarker>;

export default meta;
type Story = StoryObj<typeof MapMarker>;

const renderKakaoMap: any = (args: MapMarkerProps) => ({
  components: { MapMarker, KakaoMap },
  setup() {
    useKakao(import.meta.env.VITE_KAKAO_APP_KEY ?? '');
    const map = ref<kakao.maps.Map>();

    const onLoadMap = (newMap: kakao.maps.Map): void => {
      map.value = newMap;
    };
    return { args, map, onLoadMap };
  },
  template: `
  <KakaoMap
    ref="map"
    :lat="33.450701"
    :lng="126.570667"
    @onLoadMap="onLoadMap"
    :draggable="false"
  >
    <MapMarker
      v-if="map"
      :map="map"
      :lat="33.450701"
      :lng="126.570667"
    ></MapMarker>
  </KakaoMap>
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
    lat: 37.566826,
    lng: 126.9786567
  }
};
