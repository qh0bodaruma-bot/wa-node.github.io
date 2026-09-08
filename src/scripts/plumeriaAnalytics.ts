// プルメリア修正版ラフ：GA4計測ヘルパー。
// ラフ段階ではGoogleAnalytics.astroのenabled=falseにより実送信は行われず、
// window.gtagはconsole.infoへ差し替わっている（GoogleAnalytics.astro参照）。
// デモのdata-pl-demoガードでも送信を止める。許可するパラメータは固定の識別子のみとし、
// 氏名・連絡先・相談本文等は一切含めない。

type PlumeriaEventName =
  | 'service_select'
  | 'phone_click'
  | 'recruit_click';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackPlumeriaEvent(name: PlumeriaEventName, params: Record<string, string> = {}) {
  if (typeof window === 'undefined') return;
  // Hard stop for this proposal demo, even if another page left a live gtag on window.
  if (document.querySelector('.pl[data-pl-demo="true"]')) return;
  if (typeof window.gtag !== 'function') return;
  const events = ['service_select', 'phone_click', 'recruit_click'];
  if (!events.includes(name)) return;
  const allowed: Record<string, string[]> = {
    service_type: ['housing', 'short-stay', 'home-care', 'home-nursing', 'care-management', 'welfare-equipment', 'recruit', 'important-matters'],
    cta_location: ['header_nav', 'header_recruit', 'mobile_menu', 'hero_tile', 'top_recruit_banner', 'service_intro_card', 'services_list', 'purpose_guide', 'contact_desk', 'recruit_desk', 'floating'],
    facility_id: ['1', '2', '3'],
  };
  const safe = Object.fromEntries(Object.entries(params).filter(([key, value]) => allowed[key]?.includes(value)));
  window.gtag('event', name, safe);
}

// リンク・ボタンに data-pl-gtag="service_select" data-pl-service="housing" data-pl-cta="hero_tile" 等を付けておくと、
// 本番計測の開始には、承認済みの計測先・同意方針とデモガード解除の別途レビューが必要。
export function initPlumeriaClickTracking(root: ParentNode = document) {
  root.querySelectorAll<HTMLElement>('[data-pl-gtag]').forEach((el) => {
    if (el.dataset.plTracked) return;
    el.dataset.plTracked = 'true';
    el.addEventListener('click', () => {
      const name = el.dataset.plGtag as PlumeriaEventName | undefined;
      if (!name) return;
      trackPlumeriaEvent(name, {
        service_type: el.dataset.plService || '',
        cta_location: el.dataset.plCta || '',
      });
    });
  });
}
