<script setup lang="ts">
import { KakaoMap } from '@/components';
import useKakao from '@/utils/useKakao';
import { ref } from 'vue';

useKakao(import.meta.env.VITE_KAKAO_APP_KEY ?? '');

const curLat = ref(37.566826);
const curLng = ref(126.9786567);

const move = (newLat: number, newLng: number): void => {
  curLat.value = newLat;
  curLng.value = newLng;
};
</script>

<template>
  <KakaoMap :lat="curLat" :lng="curLng"></KakaoMap>
  <button @click="move(37.576826, 126.9786567)">moveTo1</button>
  <button @click="move(37.566826, 126.9886567)">moveTo2</button>
</template>
