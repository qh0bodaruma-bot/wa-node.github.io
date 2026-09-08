// プルメリア 修正版ラフ 共通データモデル
// 将来の拡張（独立サイト化・CMS化）に備え、サービス識別子・ルート・文言を一箇所に集約する。
// 未確定の値は null または「確認中」表記とし、確定した事実として扱わない。

export const PLUMERIA_BASE = '/lab/demos/plumeria/1a';

export interface PlumeriaCorp {
  name: string;
  nameEn: string;
  tel: string | null; // 確認中は null。ダミー番号は使わない。
  address: string | null;
  groupName: string | null; // 正式なグループ表記が未確定のため null
  currentSiteUrl: string | null; // 現HPの確認済みURLが未確定のため null
}

export const corp: PlumeriaCorp = {
  name: 'プルメリア',
  nameEn: 'PLUMERIA',
  tel: null,
  address: null,
  groupName: null,
  currentSiteUrl: null,
};

export type PlumeriaServiceId =
  | 'housing'
  | 'home-care'
  | 'home-nursing'
  | 'care-management'
  | 'welfare-equipment';

export interface PlumeriaHousingUnit {
  id: '1' | '2' | '3';
  name: string;
  kind: string; // サービス付き高齢者向け住宅
  status: string | null; // 空室あり／満室等。仮値のため運用時に確定情報へ差し替える
  open: boolean | null;
  img: string;
  alt: string;
}

export const housingUnits: PlumeriaHousingUnit[] = [
  {
    id: '1', name: 'プルメリアⅠ', kind: 'サービス付き高齢者向け住宅',
    status: '確認中', open: null,
    img: '/images/plumeria/services-01.webp',
    alt: '窓から光の入る居室で、入居者が自分らしく過ごしている様子（イメージ）',
  },
  {
    id: '2', name: 'プルメリアⅡ', kind: 'サービス付き高齢者向け住宅',
    status: '確認中', open: null,
    img: '/images/plumeria/services-02.webp',
    alt: '共用ラウンジで入居者どうしが穏やかに会話している様子（イメージ）',
  },
  {
    id: '3', name: 'プルメリアⅢ', kind: 'サービス付き高齢者向け住宅',
    status: '確認中', open: null,
    img: '/images/plumeria/services-03.webp',
    alt: '共用スペースの入口で入居者を迎えているスタッフ（イメージ）',
  },
];

export interface PlumeriaService {
  id: PlumeriaServiceId;
  name: string;
  short: string;
  tagline: string;
  icon: string;
  href: string;
  summary: string;
  img: string;
  alt: string;
}

export const services: PlumeriaService[] = [
  {
    id: 'housing', name: 'サービス付き高齢者向け住宅', short: '住宅', tagline: 'プルメリアⅠ・Ⅱ・Ⅲ',
    icon: 'home', href: `${PLUMERIA_BASE}/housing/`,
    summary: '安否確認と生活相談のあるバリアフリー住宅です。3つの住宅の特徴を比較してご案内します。',
    img: '/images/plumeria/services-01.webp',
    alt: '窓から光の入る居室で、入居者が自分らしく過ごしている様子（イメージ）',
  },
  {
    id: 'home-care', name: '訪問介護', short: '訪問介護', tagline: 'ご自宅での身体介護・生活援助',
    icon: 'staff', href: `${PLUMERIA_BASE}/home-care/`,
    summary: 'ホームヘルパーがご自宅を訪問し、身体介護・生活援助を行います。',
    img: '/images/plumeria/feature-01.webp',
    alt: '入居者とスタッフが同じ目線の高さで話している様子（イメージ）',
  },
  {
    id: 'home-nursing', name: '訪問看護', short: '訪問看護', tagline: '看護師がご自宅へ訪問します',
    icon: 'care', href: `${PLUMERIA_BASE}/home-nursing/`,
    summary: '看護師がご自宅を訪問し、健康状態の確認や医療的なケアを行います。',
    img: '/images/plumeria/services-04.webp',
    alt: 'ご自宅のリビングで看護師が健康状態を確認している様子（イメージ）',
  },
  {
    id: 'care-management', name: '居宅介護支援', short: '居宅介護支援', tagline: 'ケアプランの作成・相談',
    icon: 'sprout', href: `${PLUMERIA_BASE}/care-management/`,
    summary: 'ケアマネジャーが介護サービス全体の計画・調整をお手伝いします。',
    img: '/images/plumeria/feature-03.webp',
    alt: 'ご家族が自宅のダイニングで相談している様子（イメージ）',
  },
  {
    id: 'welfare-equipment', name: '福祉用具', short: '福祉用具', tagline: '用具の貸与・選定相談',
    icon: 'chair', href: `${PLUMERIA_BASE}/welfare-equipment/`,
    summary: '歩行器や介護ベッドなど、暮らしに合う福祉用具をご提案します。',
    img: '/images/plumeria/services-05.webp',
    alt: '歩行器の使い方をスタッフが説明している様子（イメージ）',
  },
];

export const recruitEntry = {
  id: 'recruit' as const,
  name: '採用情報',
  short: '採用情報',
  tagline: 'いっしょに働く方を募集しています',
  icon: 'bird',
  href: `${PLUMERIA_BASE}/recruit/`,
  summary: '介護スタッフ・看護師を募集しています。見学だけでもお気軽にお越しください。',
};

export const routes = {
  top: `${PLUMERIA_BASE}/`,
  services: `${PLUMERIA_BASE}/services/`,
  housing: `${PLUMERIA_BASE}/housing/`,
  housingUnit: (id: string) => `${PLUMERIA_BASE}/housing/${id}/`,
  homeCare: `${PLUMERIA_BASE}/home-care/`,
  homeNursing: `${PLUMERIA_BASE}/home-nursing/`,
  careManagement: `${PLUMERIA_BASE}/care-management/`,
  welfareEquipment: `${PLUMERIA_BASE}/welfare-equipment/`,
  contact: `${PLUMERIA_BASE}/contact/`,
  recruit: `${PLUMERIA_BASE}/recruit/`,
  privacy: `${PLUMERIA_BASE}/privacy/`,
  importantMatters: `${PLUMERIA_BASE}/important-matters/`,
};

export interface PlumeriaFaq { q: string; a: string }

export const genericFaqs: PlumeriaFaq[] = [
  { q: '相談だけでも利用できますか？', a: 'はい。ご利用が未定の段階でもご相談いただけます。まずは現在の状況をお聞かせください。' },
  { q: '費用はどのくらいかかりますか？', a: '内容によって異なるため、正式なご案内は個別にご説明します。（費用の目安は確認中）' },
  { q: '対応エリアはどこまでですか？', a: '対応地域は確認中です。まずはお問い合わせください。' },
];

export const news: { date: string; cat: string; catTone: 'green' | 'accent' | 'beige'; text: string }[] = [
  // 実データ未提供のため空配列。表示側は「掲載準備中」を出す。
];

export const contactCategories = [
  { value: 'housing', label: 'サービス付き高齢者向け住宅（Ⅰ／Ⅱ／Ⅲ）' },
  { value: 'home-care', label: '訪問介護' },
  { value: 'home-nursing', label: '訪問看護' },
  { value: 'care-management', label: '居宅介護支援' },
  { value: 'welfare-equipment', label: '福祉用具' },
  { value: 'undecided', label: 'まだ決まっていない' },
] as const;
