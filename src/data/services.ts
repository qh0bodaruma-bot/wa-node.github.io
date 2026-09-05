import { MULTILANG_PAGES } from '../i18n/navigation';
/** Public starting prices carried over from pricing/works, excluding tax.
 * Edit this catalog to keep the homepage, pricing and featured work in sync.
 */
export type SiteLanguage = 'ja' | 'en' | 'fr';
export const consultationMinutes = 30;
export const servicePrices = {
  lineSheets: 100000, lineHubspot: 200000, lineKintone: 250000, lineSalesforce: 400000,
  businessApp: 800000, customerApp: 1500000, storeSupport: 150000,
  lpReview: 15000, lp: 64000, website: 120000, webSystem: 80000,
};
export function startingPrice(amount: number, lang: SiteLanguage = 'ja') {
  return lang === 'ja' ? `${amount.toLocaleString('ja-JP')}円〜` : lang === 'en' ? `From ¥${amount.toLocaleString('en-US')}` : `Dès ${amount.toLocaleString('fr-FR')} ¥`;
}
export function localizedPath(path: string, lang: SiteLanguage = 'ja') {
  const [pathname, ...suffix] = path.split(/(?=[?#])/);
  const rest = suffix.join('');
  const base = pathname.replace(/\/+$/, '') || '/';
  const translated = MULTILANG_PAGES;
  const target = lang !== 'ja' && translated.includes(base) ? (base === '/' ? `/${lang}/` : `/${lang}${base}/`) : (base === '/' ? '/' : `${base}/`);
  if (lang === 'ja' || translated.includes(base)) return target + rest;
  const hashAt = rest.indexOf('#');
  const query = hashAt < 0 ? rest : rest.slice(0, hashAt);
  const hash = hashAt < 0 ? '' : rest.slice(hashAt);
  return `${target}${query}${query.includes('?') ? '&' : '?'}lang=${lang}${hash}`;
}
export const serviceLabels = {
  ja: { line: 'LINE連携', app: 'アプリ開発', web: 'Web・LP制作', consultation: `初回${consultationMinutes}分・無料相談`, tax: '表示価格は税別の開始価格です。仕様・作業範囲を確認して正式にお見積りします。' },
  en: { line: 'LINE integration', app: 'App development', web: 'Websites & landing pages', consultation: `Free ${consultationMinutes}-minute consultation`, tax: 'Starting prices in JPY, excluding tax. A final quote follows confirmation of scope and requirements.' },
  fr: { line: 'Intégration LINE', app: 'Applications mobiles', web: 'Sites web & pages de vente', consultation: `Premier échange gratuit de ${consultationMinutes} min`, tax: 'Prix de départ en yens, hors taxes. Le devis définitif dépend du périmètre et des besoins confirmés.' },
};
