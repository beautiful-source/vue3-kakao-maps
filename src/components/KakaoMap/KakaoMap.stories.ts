import type { Meta, StoryObj } from '@storybook/vue3';
import { KakaoMap } from '@/components';
import type { KakaoMapProps } from './KakaoMap.vue';

const meta = {
  title: 'Components/KakaoMap',
  component: KakaoMap,
  parameters: {
    componentSubtitle: '카카오 기본 지도 컴포넌트입니다.'
  },
  tags: ['autodocs'],
  argTypes: {
    width: {
      description: '맵의 가로 길이입니다. number로 설정할 시 단위는 px로 결정됩니다.',
      table: {
        type: { summary: 'number | string' },
        defaultValue: { summary: '40rem' }
      }
    },
    height: {
      description: '맵의 세로 길이입니다. number로 설정할 시 단위는 px로 결정됩니다.',
      table: {
        type: { summary: 'number | string' },
        defaultValue: { summary: '50rem' }
      }
    },
    appKey: {
      description: '카카오 맵의 API Key입니다.',
      table: {
        type: { summary: 'string' }
      },
      control: false
    },
    lat: {
      description: '초기 center 위도 좌표입니다.',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: 37.566826 }
      }
    },
    lng: {
      description: '초기 center 경도 좌표입니다.',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: 126.9786567 }
      }
    },
    markerList: {
      description: '맵 내부에 표시될 marker 배열입니다.',
      table: {
        type: { summary: 'any' },
        defaultValue: { summary: [] }
      }
    },
    draggable: {
      description: '지도를 드래그 가능한지 여부입니다.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: true }
      }
    }
  }
} satisfies Meta<typeof KakaoMap>;

export default meta;
type Story = StoryObj<typeof KakaoMap>;

const renderKakaoMap: any = (args: KakaoMapProps) => ({
  components: { KakaoMap },
  setup() {
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
    appKey: import.meta.env.VITE_KAKAO_APP_KEY,
    lat: 37.566826,
    lng: 126.9786567
  }
};

export const Other: Story = {
  render: renderKakaoMap,
  args: {
    width: '80rem',
    height: 300,
    appKey: import.meta.env.VITE_KAKAO_APP_KEY,
    lat: 37.566826,
    lng: 126.9786567,
    draggable: true
  }
};
