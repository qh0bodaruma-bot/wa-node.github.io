// 相談帯のCTAボタンが画面に入ったとき、一度だけ矢印を動かして押せる場所を示す（styles/cta-flow.css の .is-cued）。
// 動きを減らす設定・IntersectionObserver 非対応では何もしない。ボタンは最初から表示されているため、動かなくても見え方は変わらない。

import { isReducedMotion } from './motion-pref';

export function initCtaCue(root: ParentNode = document): () => void {
  const targets = [...root.querySelectorAll<HTMLElement>('.s-contact-band .s-button')];
  if (!targets.length || isReducedMotion() || !('IntersectionObserver' in window)) return () => {};

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-cued');
        io.unobserve(entry.target);
      });
    },
    { threshold: 0.6 }
  );
  targets.forEach((el) => io.observe(el));
  return () => io.disconnect();
}
