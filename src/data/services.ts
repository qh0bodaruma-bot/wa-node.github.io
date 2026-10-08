import { MULTILANG_PAGES } from '../i18n/navigation';
/** Public starting prices carried over from pricing/works, excluding tax.
 * Edit this catalog to keep the homepage, pricing and featured work in sync.
 */
export type SiteLanguage = 'ja' | 'en' | 'fr';
export const consultationMinutes = 30;
/** LINE連携の3プラン（ベーシック／スタンダード／プレミアム）。
 * 構成はランサーズのパッケージに合わせ、金額はランサーズの表示価格からシステム手数料16.5%を引き、10,000円単位に丸めた値（2026-10-09）。
 */
export type LineConnector = 'sheets' | 'hubspot' | 'kintone' | 'salesforce';
export const lineTierPrices: Record<LineConnector, readonly [number, number, number]> = {
  sheets: [80000, 130000, 180000],
  hubspot: [170000, 250000, 380000],
  kintone: [210000, 290000, 420000],
  salesforce: [330000, 460000, 630000],
};
/** 実績づくりのための先着限定価格（ランサーズの30,000円から手数料を引いた値）。件数に達したら外して通常価格に戻す。 */
export const lineCampaign = { connector: 'sheets' as LineConnector, tier: 0, price: 25000, regular: lineTierPrices.sheets[0], slots: 3 };
/** プランの表示価格（キャンペーン適用後）。 */
export function lineTierPrice(connector: LineConnector, tier: number) {
  return connector === lineCampaign.connector && tier === lineCampaign.tier ? lineCampaign.price : lineTierPrices[connector][tier];
}
export const servicePrices = {
  lineSheets: lineTierPrice('sheets', 0), lineHubspot: lineTierPrices.hubspot[0], lineKintone: lineTierPrices.kintone[0], lineSalesforce: lineTierPrices.salesforce[0],
  businessApp: 800000, customerApp: 1500000, storeSupport: 150000,
  lpReview: 15000, lp: 64000, website: 120000, webSystem: 80000,
};
export const lineTierText = {
  ja: {
    tiers: ['ベーシック', 'スタンダード', 'プレミアム'],
    connectors: { sheets: 'Googleスプレッドシート連携', hubspot: 'HubSpot連携', kintone: 'kintone連携', salesforce: 'Salesforce連携' },
    plans: {
      sheets: ['単方向・1シート・1フロー', '複数シート・条件分岐', 'Googleフォーム併用・通知設定を含む複合構成'],
      hubspot: ['コンタクト自動登録・1フロー', 'ディール自動生成・複数フロー', 'ワークフロー連携を含む複合構成'],
      kintone: ['LINE→kintoneの単方向・1フロー', '双方向・複数フロー', '複合構成（要件を確認してお見積り）'],
      salesforce: ['入力画面1つ・リード自動登録', '入力画面3つまで・条件分岐・あいさつメッセージ', '入力画面5つまで・複数オブジェクト・自動返信・納品後1か月の修正'],
    },
    badge: `先着${lineCampaign.slots}件限定`,
    regular: '通常',
    campaignTitle: `Googleスプレッドシート連携のベーシックを、先着${lineCampaign.slots}件まで${lineCampaign.price.toLocaleString('ja-JP')}円〜でお受けします`,
    campaignReason: `LINE連携の制作実績を増やすため、いちばん小さく始められるスプレッドシート連携のベーシックを値下げしています。作業内容は通常価格（${lineCampaign.regular.toLocaleString('ja-JP')}円〜）のベーシックと同じです。${lineCampaign.slots}件のお申し込みに達した時点で、通常価格に戻します。`,
  },
  en: {
    tiers: ['Basic', 'Standard', 'Premium'],
    connectors: { sheets: 'Google Sheets integration', hubspot: 'HubSpot integration', kintone: 'kintone integration', salesforce: 'Salesforce integration' },
    plans: {
      sheets: ['One-way, one sheet, one flow', 'Multiple sheets and conditional branching', 'Combined setup with Google Forms and notifications'],
      hubspot: ['Automatic contact creation, one flow', 'Automatic deal creation, multiple flows', 'Combined setup with HubSpot workflows'],
      kintone: ['One-way LINE → kintone, one flow', 'Two-way, multiple flows', 'Combined setup, quoted after requirements'],
      salesforce: ['One form screen, automatic lead creation', 'Up to 3 form screens, branching and a welcome message', 'Up to 5 form screens, multiple objects, auto-reply and one month of fixes after delivery'],
    },
    badge: `First ${lineCampaign.slots} orders`,
    regular: 'Regular',
    campaignTitle: `Google Sheets Basic from ¥${lineCampaign.price.toLocaleString('en-US')} for the first ${lineCampaign.slots} orders`,
    campaignReason: `To build our track record of LINE integrations, we have reduced the price of the smallest starting point, the Google Sheets Basic plan. The work is the same as the regular Basic plan (from ¥${lineCampaign.regular.toLocaleString('en-US')}). The regular price returns once ${lineCampaign.slots} orders are received.`,
  },
  fr: {
    tiers: ['Basique', 'Standard', 'Premium'],
    connectors: { sheets: 'Intégration Google Sheets', hubspot: 'Intégration HubSpot', kintone: 'Intégration kintone', salesforce: 'Intégration Salesforce' },
    plans: {
      sheets: ['Sens unique, une feuille, un flux', 'Plusieurs feuilles et conditions', 'Configuration combinée avec Google Forms et notifications'],
      hubspot: ['Création automatique de contacts, un flux', 'Création automatique d’affaires, plusieurs flux', 'Configuration combinée avec les workflows HubSpot'],
      kintone: ['LINE → kintone en sens unique, un flux', 'Bidirectionnel, plusieurs flux', 'Configuration combinée, sur devis après analyse'],
      salesforce: ['Un écran de formulaire, création automatique de pistes', 'Jusqu’à 3 écrans, conditions et message d’accueil', 'Jusqu’à 5 écrans, plusieurs objets, réponse automatique et un mois de corrections après livraison'],
    },
    badge: `${lineCampaign.slots} premières commandes`,
    regular: 'Prix normal',
    campaignTitle: `Google Sheets Basique dès ${lineCampaign.price.toLocaleString('fr-FR')} ¥ pour les ${lineCampaign.slots} premières commandes`,
    campaignReason: `Pour étoffer nos références d’intégrations LINE, nous réduisons le prix du point de départ le plus simple : l’offre Basique Google Sheets. Le travail est identique à l’offre Basique au prix normal (dès ${lineCampaign.regular.toLocaleString('fr-FR')} ¥). Le prix normal s’applique de nouveau après ${lineCampaign.slots} commandes.`,
  },
};
export function startingPrice(amount: number, lang: SiteLanguage = 'ja') {
  return lang === 'ja' ? `${amount.toLocaleString('ja-JP')}円〜` : lang === 'en' ? `From ¥${amount.toLocaleString('en-US')}` : `Dès ${amount.toLocaleString('fr-FR')} ¥`;
}
/** 接続先によって価格差が大きいサービス向けの下限〜上限表示。
 * 最安値だけを示すと、上位構成を想定した相談者との期待値がずれるため。
 */
export function priceRange(min: number, max: number, lang: SiteLanguage = 'ja') {
  return lang === 'ja' ? `${min.toLocaleString('ja-JP')}〜${max.toLocaleString('ja-JP')}円` : lang === 'en' ? `¥${min.toLocaleString('en-US')} – ¥${max.toLocaleString('en-US')}` : `${min.toLocaleString('fr-FR')} – ${max.toLocaleString('fr-FR')} ¥`;
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
