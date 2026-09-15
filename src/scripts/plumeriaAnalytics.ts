// プルメリア修正版ラフ：GA4計測ヘルパー。
// 2026-09-15 ボス判断により、デモ（data-pl-demo）でもクリックイベントを送信する（先方からアクセス分析の依頼があるため）。
// GAは AnalyticsConsent で「解析を許可する」が選ばれた後にだけ読み込まれ、それまで window.gtag は存在しないため、
// 同意前・拒否時はここで送信されない。許可するパラメータは固定の識別子のみとし、氏名・連絡先・相談本文等は一切含めない。

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
  if (typeof window.gtag !== 'function') return;
  const events = ['service_select', 'phone_click', 'recruit_click'];
  if (!events.includes(name)) return;
  const allowed: Record<string, string[]> = {
    service_type: ['housing', 'short-stay', 'home-care', 'home-nursing', 'care-management', 'welfare-equipment', 'recruit', 'important-matters'],
    cta_location: ['header_nav', 'header_recruit', 'mobile_menu', 'hero_tile', 'top_recruit_banner', 'service_intro_card', 'services_list', 'purpose_guide', 'contact_desk', 'recruit_desk', 'floating', 'footer_contact'],
    facility_id: ['1', '2', '3'],
  };
  const safe = Object.fromEntries(Object.entries(params).filter(([key, value]) => allowed[key]?.includes(value)));
  window.gtag('event', name, safe);
}

// リンク・ボタンに data-pl-gtag="service_select" data-pl-service="housing" data-pl-cta="hero_tile" 等を付けておくと、
// 計測先はプルメリア用プロパティ（PlumeriaLayout の gaMeasurementId）。同意の取得は AnalyticsConsent が担う。
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
