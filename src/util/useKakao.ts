import { ref } from 'vue';

export const isKakaoMapApiLoaded = ref<boolean>(false);

const useKakao = (appKey: string): void => {
  const script = document.createElement('script');
  script.id = 'kakao-map-api-script';
  script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false`;
  document.body.appendChild(script);
  script.onload = () => {
    kakao.maps.load(() => {
      isKakaoMapApiLoaded.value = true;
    });
  };
};
export default useKakao;
