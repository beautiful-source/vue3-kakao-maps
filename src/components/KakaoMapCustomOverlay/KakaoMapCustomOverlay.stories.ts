import type { Meta, StoryObj } from '@storybook/vue3';
import { KakaoMap, KakaoMapCustomOverlay, KakaoMapMarker } from '@/components';
import type { KakaoMapCustomOverlayProps } from './KakaoMapCustomOverlay.vue';
import { 서울특별시청_좌표 } from '@/constants/coordinate';
import useKakao from '@/util/useKakao';
import { ref } from 'vue';

const meta = {
  title: 'Components/KakaoMapCustomOverlay',
  component: KakaoMapCustomOverlay,
  parameters: {
    componentSubtitle: '기본 커스텀 오버레이 컴포넌트입니다.',
    slots: {
      default: {
        description: 'content는 slot으로도 전달 가능합니다'
      }
    }
  },
  tags: ['autodocs']
} satisfies Meta<typeof KakaoMapCustomOverlay>;

export default meta;
type Story = StoryObj<typeof KakaoMapCustomOverlay>;

export const Default: Story = {
  name: '커스텀 오버레이 생성하기',
  render: (args: KakaoMapCustomOverlayProps) => ({
    components: { KakaoMap, KakaoMapCustomOverlay },
    tags: ['autodocs'],
    setup() {
      useKakao(import.meta.env.VITE_KAKAO_APP_KEY ?? '');
      return { args, KakaoMapCustomOverlay };
    },
    template: `
    <KakaoMap
      :lat='37.566826'
      :lng='126.9786567'
    >
      <KakaoMapCustomOverlay :lat="args.lat" :lng="args.lng" >
        <div style="padding: 10px; background-color: white; border: 1px solid #ccc; border-radius: 5px; ">
          <div style="font-weight: bold; margin-bottom: 5px;">
            카카오 스페이스닷원
          </div>
          <div style="display: flex;">
            <div style="margin-right: 10px;">
              <img src="https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/thumnail.png" width="73" height="70"/>
            </div>
            <div style="flex-grow: 1;">
              <div style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">제주특별자치도 제주시 첨단로 242</div>
              <div style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">(우) 63309 (지번) 영평동 2181</div>
              <div><a href="https://www.kakaocorp.com/main" target="_blank" style="color: blue;">홈페이지</a></div>
            </div>
          </div>
        </div>
      </KakaoMapCustomOverlay>
    </KakaoMap>
    `
  }),
  args: {
    ...서울특별시청_좌표
  }
};

export const ContentDefault: Story = {
  name: '커스텀 오버레이 생성하기2',
  render: (args: KakaoMapCustomOverlayProps) => ({
    components: { KakaoMap, KakaoMapCustomOverlay },
    tags: ['autodocs'],
    setup() {
      const content = `<div style='padding: 10px; background-color: white; border: 1px solid #ccc; border-radius: 5px;'><div style='font-weight: bold; margin-bottom: 5px;'>카카오 스페이스닷원</div><div style='display: flex;'><div style='margin-right: 10px;'><img src='https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/thumnail.png' width='73' height='70'/></div><div style='flex-grow: 1;'><div style='overflow: hidden; text-overflow: ellipsis; white-space: nowrap;'>제주특별자치도 제주시 첨단로 242</div><div style='overflow: hidden; text-overflow: ellipsis; white-space: nowrap;'>(우) 63309 (지번) 영평동 2181</div><div><a href='https://www.kakaocorp.com/main' target='_blank' style='color: blue;'>홈페이지</a></div></div></div></div>`;
      useKakao(import.meta.env.VITE_KAKAO_APP_KEY ?? '');
      return { args, KakaoMapCustomOverlay, content };
    },
    template: `
          <KakaoMap :lat="37.566826" :lng="126.9786567">
            <KakaoMapCustomOverlay :lat="args.lat" :lng="args.lng" :content="content">
            </KakaoMapCustomOverlay>
          </KakaoMap>
        `
  }),
  args: {
    ...서울특별시청_좌표
  }
};

export const WithMarker: Story = {
  name: '커스텀 오버레이 마커에 연결하기',
  render: (args: KakaoMapCustomOverlayProps) => ({
    components: { KakaoMap, KakaoMapCustomOverlay, KakaoMapMarker },
    tags: ['autodocs'],
    setup() {
      useKakao(import.meta.env.VITE_KAKAO_APP_KEY ?? '');
      return { args, KakaoMapCustomOverlay, KakaoMapMarker };
    },
    template: `
    <KakaoMap
      :lat='37.566826'
      :lng='126.9786567'
    >
    <KakaoMapMarker :lat="37.566826" :lng="126.9786567" />
      <KakaoMapCustomOverlay :lat="args.lat" :lng="args.lng" :yAnchor="args.yAnchor">
        <div style="padding: 10px; background-color: white; border: 1px solid #ccc; border-radius: 5px; ">
        <div style="font-weight: bold; margin-bottom: 5px;">
            카카오 스페이스닷원
        </div>
        <div style="display: flex;">
            <div style="margin-right: 10px;">
                <img src="https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/thumnail.png" width="73" height="70"/>
            </div>
            <div style="flex-grow: 1;">
                <div style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">제주특별자치도 제주시 첨단로 242</div>
                <div style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">(우) 63309 (지번) 영평동 2181</div>
                <div><a href="https://www.kakaocorp.com/main" target="_blank" style="color: blue;">홈페이지</a></div>
            </div>
          </div>
        </div>
      </KakaoMapCustomOverlay>
    </KakaoMap>
  `
  }),
  args: {
    ...서울특별시청_좌표,
    yAnchor: 1.4
  }
};

export const CloseCustomOverlay: Story = {
  name: '닫기가 가능한 커스텀 오버레이',
  render: (args: KakaoMapCustomOverlayProps, { argTypes }) => ({
    components: { KakaoMap, KakaoMapCustomOverlay, KakaoMapMarker },
    tags: ['autodocs'],
    methods: {
      closeOverlay() {
        this.overlay?.setMap(null);
      }
    },
    setup() {
      useKakao(import.meta.env.VITE_KAKAO_APP_KEY ?? '');

      const overlay = ref<kakao.maps.CustomOverlay>();
      const onLoadKakaoMapCustomOverlay = (newCustomOverlay: kakao.maps.CustomOverlay): void => {
        overlay.value = newCustomOverlay;
      };

      return { args, overlay, KakaoMapCustomOverlay, KakaoMapMarker, onLoadKakaoMapCustomOverlay };
    },
    template: `
    <KakaoMap
      :lat='37.566826'
      :lng='126.9786567'
    >
      <KakaoMapMarker :lat="37.566826" :lng="126.9786567" />
      <KakaoMapCustomOverlay :lat="args.lat" :lng="args.lng" :yAnchor="args.yAnchor" @onLoadKakaoMapCustomOverlay="onLoadKakaoMapCustomOverlay">
        <div style="padding: 10px; background-color: white; border: 1px solid #ccc; border-radius: 5px; ">
          <div style="font-weight: bold; margin-bottom: 5px;">
            카카오 스페이스닷원
            <span style="float: right; cursor: pointer;" @click="closeOverlay" title="닫기">X</span>
          </div>
          <div style="display: flex;">
            <div style="margin-right: 10px;">
              <img src="https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/thumnail.png" width="73" height="70"/>
            </div>
            <div style="flex-grow: 1;">
              <div style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">제주특별자치도 제주시 첨단로 242</div>
              <div style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">(우) 63309 (지번) 영평동 2181</div>
              <div><a href="https://www.kakaocorp.com/main" target="_blank" style="color: blue;">홈페이지</a></div>
            </div>
          </div>
        </div>
      </KakaoMapCustomOverlay>
    </KakaoMap>
    `
  }),
  args: {
    ...서울특별시청_좌표,
    yAnchor: 1.4
  }
};
