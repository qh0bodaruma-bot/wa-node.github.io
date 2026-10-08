// 和-Node 動きの量の設定。
// 端末の「視差効果を減らす」設定（prefers-reduced-motion）に加えて、ヘッダーの切替で「控えめ」を選べる。
// 選択は <html data-motion="reduce"> と localStorage（キー wa-motion）に保持し、切替時に wa:motion-change を発火する。
// 端末側が「減らす」の場合は常に控えめとし、サイト側から動きを増やすことはしない。

export const MOTION_STORAGE_KEY = 'wa-motion';
export const MOTION_CHANGE_EVENT = 'wa:motion-change';

const mql = window.matchMedia('(prefers-reduced-motion: reduce)');

export function isSystemReducedMotion(): boolean {
  return mql.matches;
}

export function isUserReducedMotion(): boolean {
  return document.documentElement.dataset.motion === 'reduce';
}

export function isReducedMotion(): boolean {
  return isSystemReducedMotion() || isUserReducedMotion();
}

// 端末の設定変更とサイト上の切替の両方を受け取る。登録した関数には現在の判定結果を渡す。
export function onReducedMotionChange(callback: (reduced: boolean) => void): () => void {
  const notify = () => callback(isReducedMotion());
  mql.addEventListener('change', notify);
  document.addEventListener(MOTION_CHANGE_EVENT, notify);
  return () => {
    mql.removeEventListener('change', notify);
    document.removeEventListener(MOTION_CHANGE_EVENT, notify);
  };
}
