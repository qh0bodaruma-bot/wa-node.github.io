// プルメリア 修正版ラフ 共通データモデル
// 実在サイト（https://home-plumeria.jp/ 、2026年時点の公開情報）を基に事実情報を反映している。
// 福祉用具（welfare-equipment）は同サイト未掲載の新サービスで、ボスからの直接の指摘に基づく（2026年時点）。
// 出典に記載のない項目は null または「確認中」表記のままとし、確定した事実として扱わない。
// 写真はすべて生成画像の「イメージ写真」であり、実際の施設・スタッフの記録ではない。

export const PLUMERIA_BASE = '/lab/demos/plumeria/1a';

export interface PlumeriaCorp {
  name: string;
  nameEn: string;
  tel: string | null; // サービス付き高齢者向け住宅（プルメリアⅠ・Ⅱ）の窓口
  address: string | null;
  groupName: string | null;
  currentSiteUrl: string | null;
}

export const corp: PlumeriaCorp = {
  name: 'プルメリア',
  nameEn: 'PLUMERIA',
  tel: '0574-61-1201',
  address: '岐阜県可児市今渡1880番地',
  groupName: 'DS TOKAI株式会社',
  currentSiteUrl: 'https://home-plumeria.jp/',
};

// ショートステイ（プルメリアⅢ）は建物・受付が別のため、専用の電話番号を持つ。
export const shortStayTel = '0574-48-8311';

export type PlumeriaServiceId =
  | 'housing'
  | 'short-stay'
  | 'home-care'
  | 'home-nursing'
  | 'care-management'
  | 'welfare-equipment';

export interface PlumeriaHousingUnit {
  id: '1' | '2';
  name: string;
  kind: string;
  roomType: string;
  roomSize: string;
  priceFrom: string;
  deposit: string;
  target: string;
  img: string;
  alt: string;
}

export const housingUnits: PlumeriaHousingUnit[] = [
  {
    id: '1', name: 'プルメリアⅠ',
    kind: '自立・介護予防向け',
    roomType: '1DK・1LDK（A/B/Cタイプ）',
    roomSize: '居室36.00〜45.80㎡（ベランダ別）',
    priceFrom: '月額 100,540円〜',
    deposit: '敷金 300,000〜360,000円',
    target: '60歳以上の方',
    img: '/images/plumeria/services-01.webp',
    alt: '窓から光の入る居室で、入居者が自分らしく過ごしている様子（イメージ）',
  },
  {
    id: '2', name: 'プルメリアⅡ',
    kind: '介護対応型',
    roomType: 'ワンルーム',
    roomSize: '25.16㎡',
    priceFrom: '月額 150,400円〜（1名）',
    deposit: '敷金 300,000円',
    target: '要介護1以上の方',
    img: '/images/plumeria/services-02.webp',
    alt: '共用ラウンジで入居者どうしが穏やかに会話している様子（イメージ）',
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
    id: 'housing', name: 'サービス付き高齢者向け住宅', short: '住宅', tagline: 'プルメリアⅠ・Ⅱ',
    icon: 'home', href: `${PLUMERIA_BASE}/housing/`,
    summary: '安否確認と生活相談のある住宅です。自立向け（Ⅰ）と介護対応型（Ⅱ）があります。',
    img: '/images/plumeria/services-01.webp',
    alt: '窓から光の入る居室で、入居者が自分らしく過ごしている様子（イメージ）',
  },
  {
    id: 'short-stay', name: 'ショートステイ', short: 'ショートステイ', tagline: 'プルメリアⅢ（短期入所）',
    icon: 'bed', href: `${PLUMERIA_BASE}/short-stay/`,
    summary: 'ご家族の休息や外出の間、短期間宿泊して介護を受けられます。',
    img: '/images/plumeria/services-03.webp',
    alt: '共用スペースの入口で入居者を迎えているスタッフ（イメージ）',
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
    summary: '看護師がご自宅で、体調の確認や医師の指示に基づくケアを行います。',
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
    id: 'welfare-equipment', name: '福祉用具', short: '福祉用具', tagline: '用具選びのご相談',
    icon: 'chair', href: `${PLUMERIA_BASE}/welfare-equipment/`,
    summary: '歩行器や介護ベッドなど、暮らしに合う用具を相談するサービスです。',
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
  summary: '介護職員・看護師を募集しています。見学だけでもお気軽にお越しください。',
};

export const routes = {
  top: `${PLUMERIA_BASE}/`,
  services: `${PLUMERIA_BASE}/services/`,
  housing: `${PLUMERIA_BASE}/housing/`,
  housingUnit: (id: string) => `${PLUMERIA_BASE}/housing/${id}/`,
  shortStay: `${PLUMERIA_BASE}/short-stay/`,
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
  { q: '費用はどのくらいかかりますか？', a: '内容や介護度によって異なります。正式なご案内は個別にご説明します。' },
  { q: '対応エリアはどこまでですか？', a: '岐阜県可児市周辺が中心です。詳しい対応可否はお問い合わせください。' },
];

export const news: { date: string; cat: string; catTone: 'green' | 'accent' | 'beige'; text: string }[] = [
  // 実データ未提供のため空配列。表示側は「掲載準備中」を出す。
];

export const contactCategories = [
  { value: 'housing', label: 'サービス付き高齢者向け住宅（Ⅰ／Ⅱ）' },
  { value: 'short-stay', label: 'ショートステイ（Ⅲ）' },
  { value: 'home-care', label: '訪問介護' },
  { value: 'home-nursing', label: '訪問看護' },
  { value: 'care-management', label: '居宅介護支援' },
  { value: 'welfare-equipment', label: '福祉用具' },
  { value: 'undecided', label: 'まだ決まっていない' },
] as const;
