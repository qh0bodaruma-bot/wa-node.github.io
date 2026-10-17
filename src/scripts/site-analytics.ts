// 入力文・個人情報・URLパラメータは取得せず、承認済みの解析に固定の分類だけを渡す。
type SiteEvent = 'system_select' | 'demo_complete' | 'consultation_click';
const systems = new Set(['kintone', 'salesforce', 'hubspot', 'sheets', 'app', 'general']);
const surfaces = new Set(['home', 'system_demo', 'field_report', 'partner_visit', 'seminar_booking', 'pricing']);

export function trackSiteEvent(event: SiteEvent, system: string, surface: string): void {
  if (!systems.has(system) || !surfaces.has(surface)) return;
  try {
    if (localStorage.getItem('wa-node-analytics-consent-v1') !== 'granted') return;
    if (document.getElementById('analytics-consent')?.dataset.gaEnabled !== 'true') return;
    const gtag = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag;
    if (typeof gtag !== 'function') return;
    gtag('event', event, { integration_system: system, ui_surface: surface });
  } catch { /* 保存領域や解析が利用できない場合も、画面の操作は継続する。 */ }
}

document.addEventListener('click', (event) => {
  if (!(event.target instanceof Element)) return;
  const link = event.target.closest<HTMLElement>('[data-consult-cta]');
  if (link) trackSiteEvent('consultation_click', link.dataset.analyticsSystem ?? 'general', link.dataset.analyticsSurface ?? '');
});
for (const [domEvent, name] of [['wa:system-select', 'system_select'], ['wa:demo-complete', 'demo_complete']] as const) {
  document.addEventListener(domEvent, (event) => {
    if (!(event.target instanceof HTMLElement)) return;
    const root = event.target.closest<HTMLElement>('[data-home-demo], [data-lc-root]');
    if (root) trackSiteEvent(name, root.dataset.analyticsSystem ?? '', root.dataset.analyticsSurface ?? '');
  });
}
