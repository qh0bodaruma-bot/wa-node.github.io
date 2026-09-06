// 和-Node モーション制御（アニメーション設計書 v1 準拠）
// M01登場の対象登録・再生・破棄を担当する。低減設定・IO非対応ではフェイルオープンで即時表示にする。

const playedKeys = new Set<string>();
let reduced = false;
let mql: MediaQueryList | null = null;

function motionKey(el: Element): string {
  const dataset = (el as HTMLElement).dataset;
  if (dataset.motionId) return `${location.pathname}::${dataset.motionId}`;
  const group = dataset.motionGroup || '__default__';
  const parent = el.parentElement;
  const index = parent ? [...parent.children].indexOf(el) : 0;
  return `${location.pathname}::${group}::${index}`;
}

function applyStagger(root: ParentNode) {
  const groups = new Map<string, HTMLElement[]>();
  root.querySelectorAll<HTMLElement>('[data-motion-enter]').forEach((el) => {
    const group = el.dataset.motionGroup || '__default__';
    if (!groups.has(group)) groups.set(group, []);
    groups.get(group)!.push(el);
  });
  const isDesktop = window.matchMedia('(min-width: 821px)').matches;
  groups.forEach((list) => {
    list.forEach((el, i) => {
      el.style.transitionDelay = isDesktop && i < 3 ? `${i * 60}ms` : '0ms';
    });
  });
}

export function initMotion(root: ParentNode = document): () => void {
  document.documentElement.classList.add('motion-ready');
  const targets = [...root.querySelectorAll<HTMLElement>('[data-motion-enter]')];
  if (!targets.length) return () => {};

  if (reduced || !('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('is-visible'));
    return () => {};
  }

  applyStagger(root);

  const already = targets.filter((el) => playedKeys.has(motionKey(el)));
  const pending = targets.filter((el) => !playedKeys.has(motionKey(el)));
  already.forEach((el) => el.classList.add('is-visible'));
  if (!pending.length) return () => {};

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          playedKeys.add(motionKey(entry.target));
          io.unobserve(entry.target);
        }
      });
    },
    { root: null, rootMargin: '0px', threshold: 0.15 }
  );

  pending.forEach((el) => io.observe(el));
  return () => io.disconnect();
}

// ページ内で1つだけ保持するべきグローバル監視。低減設定へ変わった時点で登場演出をcancelする。
export function watchReducedMotion(onChange?: (reduced: boolean) => void) {
  if (mql) return;
  mql = window.matchMedia('(prefers-reduced-motion: reduce)');
  reduced = mql.matches;
  mql.addEventListener('change', (event) => {
    reduced = event.matches;
    if (reduced) {
      document.querySelectorAll('[data-motion-enter]').forEach((el) => el.classList.add('is-visible'));
    }
    onChange?.(reduced);
  });
}

export function isReducedMotion(): boolean {
  return reduced;
}
