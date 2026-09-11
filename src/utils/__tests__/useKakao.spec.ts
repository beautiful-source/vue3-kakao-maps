import { beforeEach, describe, expect, it, vi } from 'vitest';

const scripts = (): NodeListOf<HTMLScriptElement> => document.querySelectorAll('#kakao-map-api-script');

describe('useKakao', () => {
  beforeEach(() => {
    // 로드 상태가 모듈에 남으므로 테스트마다 새로 불러온다.
    vi.resetModules();
    document.body.innerHTML = '';
    vi.stubGlobal('kakao', {
      maps: {
        load: (callback: () => void) => {
          callback();
        }
      }
    });
  });

  it('여러 번 호출해도 SDK script는 한 번만 넣는다', async () => {
    const { default: useKakao } = await import('@/utils/useKakao');
    const first = useKakao('key');
    const second = useKakao('key');
    expect(scripts()).toHaveLength(1);

    scripts()[0].dispatchEvent(new Event('load'));
    await expect(first).resolves.toBeUndefined();
    await expect(second).resolves.toBeUndefined();
  });

  it('https로 요청하고, 로드되면 isKakaoMapApiLoaded를 true로 바꾼다', async () => {
    const { default: useKakao, isKakaoMapApiLoaded } = await import('@/utils/useKakao');
    const loading = useKakao('key');
    expect(scripts()[0].src).toMatch(/^https:\/\/dapi\.kakao\.com\//);

    scripts()[0].dispatchEvent(new Event('load'));
    await expect(loading).resolves.toBeUndefined();
    expect(isKakaoMapApiLoaded.value).toBe(true);
  });

  it('로드에 실패하면 reject하고, 다시 호출하면 재시도한다', async () => {
    const { default: useKakao } = await import('@/utils/useKakao');
    const loading = useKakao('bad');
    scripts()[0].dispatchEvent(new Event('error'));
    await expect(loading).rejects.toThrow('카카오맵 SDK');
    expect(scripts()).toHaveLength(0);

    const retry = useKakao('key');
    expect(scripts()).toHaveLength(1);
    scripts()[0].dispatchEvent(new Event('load'));
    await expect(retry).resolves.toBeUndefined();
  });
});
