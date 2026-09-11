import { ref } from 'vue';

export const isKakaoMapApiLoaded = ref<boolean>(false);

/**
 * 진행 중이거나 완료된 SDK 로드.
 * 여러 번 호출돼도 script는 한 번만 삽입하고, 처음 호출한 appKey와 libraries가 적용된다.
 */
let loadPromise: Promise<void> | null = null;

const useKakao = async (appKey: string, libraries?: string[]): Promise<void> => {
  if (loadPromise !== null) {
    await loadPromise;
    return;
  }

  loadPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    const librariesParam =
      libraries !== null && libraries !== undefined && libraries.length > 0 ? `&libraries=${libraries.join(',')}` : '';
    script.id = 'kakao-map-api-script';
    // 프로토콜 상대 경로(//)는 file:// 환경(Electron, Capacitor 등)에서 file://dapi.kakao.com으로 해석된다.
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false${librariesParam}`;
    script.onload = () => {
      kakao.maps.load(() => {
        isKakaoMapApiLoaded.value = true;
        resolve();
      });
    };
    // 앱 키가 잘못됐거나 인증에 실패하면 sdk.js가 401 등 오류 응답을 주고, script는 error 이벤트를 발생시킨다.
    script.onerror = () => {
      script.remove();
      loadPromise = null;
      reject(
        new Error(
          '카카오맵 SDK를 불러오지 못했습니다. 앱 키(JavaScript 키), 사이트 도메인 등록, 카카오맵 활성화 설정을 확인해주세요.'
        )
      );
    };
    document.body.appendChild(script);
  });
  await loadPromise;
};
export default useKakao;
