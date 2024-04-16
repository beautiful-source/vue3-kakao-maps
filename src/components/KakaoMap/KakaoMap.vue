<template>
  <div id="map" />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

type MapProps = {
  width?: number
  height?: number
  appKey: string
  lat?: number
  lng?: number
}

const {
  width = 40,
  height = 30,
  appKey,
  lat = 37.566826,
  lng = 126.9786567
} = defineProps<MapProps>()

const theme = {
  width: width + 'rem',
  height: height + 'rem',
  appKey: appKey
}

onMounted(() => {
  if (window.kakao && window.kakao.maps) {
    initMap()
  } else {
    const script = document.createElement('script')
    script.onload = () => {
      kakao.maps.load(() => initMap())
    }
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${theme.appKey}&autoload=false`
    document.body.appendChild(script)
  }
})

const initMap = () => {
  const container = document.getElementById('map')
  const options = {
    center: new kakao.maps.LatLng(lat, lng),
    level: 3
  }
  const kakaoMap = new kakao.maps.Map(container, options)
}
</script>

<style scoped>
#map {
  width: v-bind('theme.width');
  height: v-bind('theme.height');
}
</style>
