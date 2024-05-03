import { ref } from 'vue';

export const isKakaoMapApiLoaded = ref<boolean>(false);

const useKakao = (appKey: string, libraries?: string[]): void => {
  const script = document.createElement('script');
  const librariesParam =
    libraries !== null && libraries !== undefined && libraries.length > 0 ? `&libraries=${libraries.join(',')}` : '';
  script.id = 'kakao-map-api-script';
  script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false${librariesParam}`;
  document.body.appendChild(script);
  script.onload = () => {
    kakao.maps.load(() => {
      isKakaoMapApiLoaded.value = true;
    });
  };
};
export default useKakao;
