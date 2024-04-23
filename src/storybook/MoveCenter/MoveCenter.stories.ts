import type { StoryObj } from '@storybook/vue3';
import { KakaoMap } from '@/components';
import { ref } from 'vue';

import type { KakaoMapProps } from '@/components/KakaoMap/KakaoMap.vue';
const meta = {
  title: 'Components/MoveCenter',
  parameters: {
    layout: 'fullscreen'
  },
  tags: ['autodocs']
};

export default meta;

const renderKakaoMap: any = (args: KakaoMapProps) => ({
  components: { KakaoMap },
  setup() {
    const curlat = ref(33.450701);
    const curlng = ref(126.570667);

    const move = (newlat: number, newlng: number): void => {
      curlat.value = newlat;
      curlng.value = newlng;
    };

    return {
      curlat,
      curlng,
      move
    };
  },
  template: `
    <KakaoMap app-key="${import.meta.env.VITE_KAKAO_APP_KEY}" :lat="curlat" :lng="curlng"></KakaoMap>
    <button @click="move(33.452613, 126.570888)">moveTo1</button>
    <button @click="move(33.45058, 126.574942)">moveTo2</button>
  `
});

export const Move: StoryObj = {
  render: renderKakaoMap
};
