<script setup lang="ts">
import { KakaoMap } from '@/components';
import useKakao from '@/utils/useKakao';
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
