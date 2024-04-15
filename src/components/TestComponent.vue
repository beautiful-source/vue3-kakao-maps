<script setup lang="ts">
export interface Props {
  msg?: string
  labels?: string[]
  content: 'Vitest' | 'Vite' | 'Vue'
}

defineProps<Props>()
let x: string | number = 1
</script>

<template>
  <div>
    <div>Hello {{ content }}</div>
    <div>{{ (x as number).toFixed(2) }}</div>
    {{ msg ?? '' + labels }}
  </div>
</template>

<style></style>
