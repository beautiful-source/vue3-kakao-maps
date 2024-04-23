import type { StoryObj } from '@storybook/vue3';
import type { KakaoMapProps } from '@/components/KakaoMap/KakaoMap.vue';
import { KakaoMap } from '@/components';
import { ref } from 'vue';
import useKakao from '@/util/useKakao';

const meta = {
  title: 'Components/MoveCenter',
  parameters: {
    layout: 'fullscreen'
  },
  tags: ['autodocs']
};

export default meta;

const renderMoveCenter: any = (args: KakaoMapProps) => ({
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
});

export const MoveCenter: StoryObj = {
  render: renderMoveCenter
};
