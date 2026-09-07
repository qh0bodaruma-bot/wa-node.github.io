// プルメリア修正版ラフ：GA4計測ヘルパー。
// ラフ段階ではGoogleAnalytics.astroのenabled=falseにより実送信は行われず、
// window.gtagはconsole.infoへ差し替わっている（GoogleAnalytics.astro参照）。
// 送信するパラメータは非個人情報の識別子のみ（service_type / cta_location / facility_id）とし、
// 氏名・連絡先・相談本文等は一切含めない。

type PlumeriaEventName =
  | 'service_select'
  | 'phone_click'
  | 'recruit_click'
  | 'consultation_submit_success'
  | 'application_submit_success';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackPlumeriaEvent(name: PlumeriaEventName, params: Record<string, string> = {}) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  window.gtag('event', name, params);
}

// リンク・ボタンに data-pl-gtag="service_select" data-pl-service="housing" data-pl-cta="hero_tile" 等を付けておくと、
// クリック時に自動でイベントを送る（本番稼働先確定後、enabledをtrueにすれば実送信に切り替わる）。
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
