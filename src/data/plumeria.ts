// プルメリア 修正版ラフ 共通データモデル
// 実在サイト（https://home-plumeria.jp/ 、2026年時点の公開情報）を基に事実情報を反映している。
// 福祉用具はクライアントの6事業の説明に基づく。開設時期・取扱範囲は未確認。
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

export interface PlumeriaRoomType {
  /** 見出し（例：Aタイプ 1DK） */
  heading: string;
  /** 居室タイプの説明（掲載元の表記） */
  roomLabel: string;
  /** 間取りと面積 */
  layout: string;
  equipment: string[];
}

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
  /** 居室タイプ別の内訳（公式サイト「施設・設備紹介」の掲載内容） */
  roomTypes: PlumeriaRoomType[];
}

// 自立・介護予防向け居室（A・B・Cタイプ）の設備。3タイプとも掲載内容は同一。
const SELF_RELIANT_ROOM_EQUIPMENT = [
  '一般賃貸住宅機能',
  '冷暖房完備',
  '居室内バリアフリー',
  '高齢者用具設置（手摺など）',
  '緊急時通報システム（呼び出しボタン・水センサー）',
  '電磁調理コンロ',
  '介助バー付きトイレ',
  '浴室',
];

export const housingUnits: PlumeriaHousingUnit[] = [
  {
    id: '1', name: 'プルメリアⅠ',
    kind: '自立・介護予防向け',
    roomType: '1DK・1LDK（A/B/Cタイプ）',
    roomSize: '居室36.00〜45.80㎡（ベランダ別）',
    priceFrom: '月額 100,540円〜',
    deposit: '敷金 300,000〜360,000円',
    target: '原則60歳以上（その他は応相談）',
    img: '/images/plumeria/services-01.webp',
    alt: '窓から光の入る居室で、入居者が自分らしく過ごしている様子（イメージ）',
    roomTypes: [
      {
        heading: 'Aタイプ 1DK',
        roomLabel: 'プルメリアⅠ Aタイプ居室／1〜2人用個室',
        layout: '1DK 40.50㎡（居室36.00㎡＋ベランダ4.50㎡）',
        equipment: SELF_RELIANT_ROOM_EQUIPMENT,
      },
      {
        heading: 'Bタイプ 1LDK',
        roomLabel: 'プルメリアⅠ Bタイプ居室／1〜2人用個室',
        layout: '1LDK 48.39㎡（居室42.99㎡＋ベランダ5.40㎡）',
        equipment: SELF_RELIANT_ROOM_EQUIPMENT,
      },
      {
        heading: 'Cタイプ 1LDK',
        roomLabel: 'プルメリアⅠ Cタイプ居室／1〜2人用個室',
        layout: '1LDK 49.05㎡（居室45.80㎡＋ベランダ3.25㎡）',
        equipment: SELF_RELIANT_ROOM_EQUIPMENT,
      },
    ],
  },
  {
    id: '2', name: 'プルメリアⅡ',
    kind: '介護対応型',
    roomType: 'ワンルーム',
    roomSize: '25.16㎡',
    priceFrom: '月額 150,400円〜（1名）',
    deposit: '敷金 300,000円',
    target: '要介護1以上（要支援は応相談）',
    img: '/images/plumeria/services-02.webp',
    alt: '共用ラウンジで入居者どうしが穏やかに会話している様子（イメージ）',
    roomTypes: [
      {
        heading: '介護対応型居室 ワンルーム',
        roomLabel: 'プルメリアⅡ 介護対応型居室／1〜2人用個室（要介護1以上の方向け）',
        layout: 'ワンルーム 居室25.16㎡',
        equipment: [
          '冷暖房完備',
          '居室内バリアフリー',
          '高齢者用具設置（手摺など）',
          '緊急時通報システム（呼び出しボタン）',
          '介助バー付きトイレ',
        ],
      },
    ],
  },
];

// プルメリアⅠ・Ⅱ 共用部（公式サイト「施設・設備紹介」）
export const housingCommonAreas: { name: string; body: string }[] = [
  {
    name: 'コミュニティー広場',
    body: '大きなソファのある談話室です。入居者どうしの交流の場として、また来訪されたご家族・ご友人との語らいの場としてご利用いただけます。',
  },
  {
    name: '食堂',
    body: 'プルメリアⅡの1階フロアに、広々とした食堂スペースがあります。食事だけでなく、ゆったりとお過ごしいただけるよう設備にも配慮しています。',
  },
];

// 基礎サービス（サービス管理費に含まれる）
export const housingBasicServices: { name: string; body: string }[] = [
  {
    name: '状況把握サービス',
    body: '通報に対する一時的対応（安否確認等）を行い、状況に応じて関係機関へ連絡・通報します。24時間対応。居室のリビング・トイレ・浴室に緊急通報ボタンを設置し、水センサーでも管理しています。',
  },
  {
    name: '健康相談サービス',
    body: '日常生活の悩みごとや希望サービスの相談に、ケアマネジャー・相談員が随時対応します。協力医療機関との連携により、定期的な往診や急な体調の変化にも対応します。',
  },
  {
    name: 'フロントサービス',
    body: '1年365日、館内にフロントスタッフが8:30〜17:00の間常勤します。来訪者の受付、宅配便・郵便物の受け取り、各種情報のご案内を行います。',
  },
  {
    name: 'セキュリティ',
    body: 'セコム株式会社による防犯カメラを設置し、IDカードで入館者を管理します。部外者や高齢者を狙う訪問販売などは管理事務所で対応します。',
  },
  {
    name: '共用施設利用サービス',
    body: '庭園、菜園、コミュニティ広場、活動室、カラオケルームを無料でご利用いただけます。',
  },
  {
    name: 'アクティビティサービス',
    body: '入居者どうしの交流のためのサークル活動やイベントをご案内します。',
  },
];

// 希望サービス（基礎サービスに追加して利用するもの）
export const housingOptionalServices: { name: string; body: string }[] = [
  {
    name: 'お手伝いサービス',
    body: '買い物から掃除まで、さまざまなお手伝いでサポートします。お手伝いチケット6枚綴り 2,100円。',
  },
  { name: '訪問介護サービス', body: '入浴・食事・排せつなどの身体介護と、洗濯・掃除などの生活支援を行います。' },
  { name: '居宅介護支援サービス', body: '介護相談、ケアプラン作成に関わる相談・援助、認定手続きの代行を行います。相談・代行は無料です。' },
  { name: '食事提供サービス', body: '栄養士によるバランスの良い食事を、ご希望に応じて提供します。' },
  { name: '訪問看護サービス', body: '経験豊富な看護師が、専門的な知識と技術でケアを行います。' },
];

// 安全への取り組み（公式サイト プルメリアⅠ・Ⅱ トップ）
export const housingSafetyItems: string[] = [
  '24時間体制の専門スタッフによる緊急対応',
  '警備会社セコムのIDカードによるセキュリティ',
  'AED（自動体外式除細動器）の設置',
  '防犯カメラによる入館者の管理',
  '非常コールシステム',
  '協力クリニックとの連携による体調管理',
  'プライバシーを考慮したライフセンサー',
];

// 入居条件（公式サイト「入居・料金案内」）
export const housingAdmissionConditions: { title: string; items: string[] }[] = [
  {
    title: '自立・介護予防の方',
    items: [
      '入居される方の年齢が60歳以上の方（介護保険の設定を受けられている方は60歳以下でも相談に応じます）',
      '独り暮らしの方、同居されるご夫婦の方、同居される方が親族の方等',
      '入居時において、自立した日常生活を営むことができる方',
      'ホームヘルプサービス等の利用をしながら日常生活を営むことができる方',
      '身元引受人、連帯保証人またはこれに代わる機関保証等を受けられる方',
      '円満な共同生活が営める方（住宅内では、小鳥・魚以外の動物は飼育できません）',
    ],
  },
  {
    title: '要介護1以上の方',
    items: [
      '独り暮らしの方、同居されるご夫婦の方、同居される方が親族の方等',
      '要介護1以上の認定の方（要支援の方もご相談ください）',
      'ホームヘルプサービス等を利用しながら日常生活を営むことができる方',
      '円満な共同生活が営める方、暴言暴行等で他の入居者に迷惑がかからない方',
      '身元引受人、連帯保証人またはこれに代わる機関保証等を受けられる方',
      '協力医院による健康診断を受診され、入居基準に達していると判断された方',
    ],
  },
];

export const housingAdmissionCautions: string[] = [
  '介護対応型住宅への入居予約をされる方については、当社規定に基づく入居者審査を行います。予約申込時より身体状況の悪化等があり、当館で対応が困難と判断した場合は入居いただけない場合があります。',
  '経管栄養（胃ろうの方）等、医療頻度の高い方や、協力医院による往診での対応が困難な方の入居をお断りする場合があります。',
];

export const housingAdmissionFlow: string[] = [
  '施設見学',
  '入居申込書記入',
  '面接',
  '入居判定会議',
  '入居決定',
  '正式入居',
];

// 月々の料金（公式サイト「入居・料金案内」の表をそのまま）
export const housingFeeTable = {
  columns: ['Aタイプ', 'B・Cタイプ', '介護対応型居室', '介護対応型居室（2名入居）'],
  rows: [
    { label: '敷金（入居時）', values: ['300,000円', '360,000円', '300,000円', '300,000円'] },
    { label: '面積', values: ['36.00㎡', '42.99〜45.80㎡', '25.16㎡', '25.16㎡'] },
    { label: '家賃', values: ['57,300円', '68,750円', '63,700円', '65,700円'] },
    { label: '共益費', values: ['12,000円', '12,000円', '35,000円', '45,000円'] },
    { label: 'サービス管理費（税込）', values: ['31,240円', '31,240円', '51,700円', '103,400円'] },
    { label: '水道光熱費', values: ['各居室', '各居室', '共通費に込み', '共通費に込み'] },
    { label: '月額合計', values: ['100,540円〜', '111,990円〜', '150,400円〜', '214,100円〜'] },
  ],
  notes: [
    '上記のほかに、介護保険サービスを受けられる方は介護保険自己負担分がかかります。',
    '駐車場（4,000円／月）、貸倉庫（2,000円／月）をご希望の場合は、それぞれ毎月の利用料が加わります。',
    'A〜Cタイプはいずれもお二人での入居が可能です。その場合、管理費・サービス費は＋10,000円となり、家賃は変わりません。',
  ],
};

// プルメリアⅠ・Ⅱ の周辺環境（公式サイト プルメリアⅠ・Ⅱ トップ）
export const housingNeighborhood =
  '名鉄「日本ライン今渡」駅へは徒歩3分程度。周囲100〜400m以内に駅・銀行・公共ホール・病院が整備されており、ショッピングセンターでの買い物も徒歩3分です。';


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
    icon: 'clipboard', href: `${PLUMERIA_BASE}/care-management/`,
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
  icon: 'people',
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
  company: `${PLUMERIA_BASE}/company/`,
  magazine: `${PLUMERIA_BASE}/magazine/`,
  sitemap: `${PLUMERIA_BASE}/sitemap/`,
};

export interface PlumeriaFaq { q: string; a: string }

export const genericFaqs: PlumeriaFaq[] = [
  { q: '相談だけでも利用できますか？', a: 'はい。ご利用が未定の段階でもご相談いただけます。まずは現在の状況をお聞かせください。' },
  { q: '費用はどのくらいかかりますか？', a: '内容や介護度によって異なります。正式なご案内は個別にご説明します。' },
  { q: '自宅でも利用できますか？', a: '対応する地域や条件はサービスによって異なります。お住まいの市町村と、ご希望の支援内容を窓口へお伝えください。' },
];

// 公式サイトのお知らせ一覧（https://home-plumeria.jp/information/ 、2026年9月9日確認）の実掲載分。
// 見出しは掲載元の表記のまま。本文はPDFのため、詳細は公式の一覧ページへ誘導する。
export const news: { date: string; cat: string; catTone: 'green' | 'accent' | 'beige'; text: string }[] = [
  { date: '2026.08.28', cat: 'お知らせ', catTone: 'green', text: 'プルメリア便りが届きました' },
  { date: '2026.07.29', cat: 'お知らせ', catTone: 'green', text: 'プルメリア便りが届きました' },
  { date: '2026.06.23', cat: 'お知らせ', catTone: 'green', text: 'プルメリア便りが届きました' },
];

export const newsListUrl = 'https://home-plumeria.jp/information/';

export const contactCategories = [
  { value: 'housing', label: 'サービス付き高齢者向け住宅（Ⅰ／Ⅱ）' },
  { value: 'short-stay', label: 'ショートステイ（Ⅲ）' },
  { value: 'home-care', label: '訪問介護' },
  { value: 'home-nursing', label: '訪問看護' },
  { value: 'care-management', label: '居宅介護支援' },
  { value: 'welfare-equipment', label: '福祉用具' },
  { value: 'undecided', label: 'まだ決まっていない' },
] as const;

// ── 以下は現在の公式サイト（https://home-plumeria.jp/）の公開情報。2026年9月16日に取得・確認した。
// 金額・番号・氏名はいずれも掲載元の表記をそのまま写している。当方で補った記述は入れていない。

/** 会社概要（出典：https://home-plumeria.jp/company/） */
export const companyProfile = {
  rows: [
    { label: '名称', value: 'DS TOKAI（株）介護事業部 プルメリア' },
    { label: '所在地', value: '〒509-0207 岐阜県可児市今渡1880番地' },
    { label: 'TEL', value: '0574-61-1201' },
    { label: 'FAX', value: '0574-61-1202' },
    { label: '代表者', value: '代表取締役社長 池城俊郎' },
    { label: '設立', value: '昭和47年6月1日（高齢者専用賃貸住宅 開設 平成17年5月21日）' },
    { label: '資本金', value: '80,000,000円（平成15年現在）' },
  ],
  business: [
    '介護保険法に基づくケアプランの作成・相談等',
    '介護保険法に基づく訪問介護',
    '高齢者賃貸住宅の運営',
    '介護保険法に基づく訪問看護',
  ],
  licenses: [
    { label: '訪問介護事業所', no: '2173100674' },
    { label: '居宅支援事業所', no: '2173100674' },
    { label: '短期入所者生活介護', no: '2171400274' },
    { label: '訪問看護事業所', no: '2163190214' },
  ],
  /** 訪問介護と居宅支援が同一番号で掲載されているため、正誤は運営法人に確認中。 */
  licenseNote:
    '事業所番号は掲載元の表記どおりです。訪問介護事業所と居宅支援事業所が同じ番号で掲載されているため、正しい番号を確認しています。',
  partnerClinics: [
    {
      name: 'アカシクリニック',
      address: '可児郡御嵩町上恵土1285-1',
      tel: '0574-66-6611',
      url: 'http://www.akashi-clinic.org/',
    },
    {
      name: '岐阜健康管理センター',
      address: '美濃加茂市西町2丁目43番地',
      tel: '0574-25-2982',
      url: 'http://www.kanri.or.jp',
    },
  ],
  sourceUrl: 'https://home-plumeria.jp/company/',
};

/** 親会社（出典：公式サイト トップのリンク先） */
export const parentCompany = {
  name: 'DS TOKAI株式会社',
  url: 'http://www.tokai-kani.co.jp/',
  body: '建築事業・介護事業・不動産事業の3本の柱を中心に、多角経営を行っています。',
};

/** 社名の由来（出典：公式サイト トップ／プルメリアⅢ） */
export const brandOrigin = {
  flowerWord: 'ひだまり',
  body:
    'プルメリアの花言葉は「ひだまり」。また「あなたに出会えて本当に私は恵まれています」という意味もあり、ご利用いただく方との出会い・ご縁を大切にしたいという思いを込めています。甘く癒される花の香りのように、心穏やかにお過ごしいただける場所を目指しています。',
};

/** プルメリアだより（広報誌）のバックナンバー。本文PDFは現在の公式サイトで配信されている。 */
export const magazineIssues: { title: string; url: string }[] = [
  { title: 'プルメリア便り 令和8年9月号', url: 'https://home-plumeria.jp/uploads/magazine/0000000198.pdf' },
  { title: 'プルメリア便り 令和8年8月号', url: 'https://home-plumeria.jp/uploads/magazine/0000000193.pdf' },
  { title: 'プルメリア便り 令和8年7月号', url: 'https://home-plumeria.jp/uploads/magazine/0000000188.pdf' },
  { title: 'プルメリア便り 令和8年6月号', url: 'https://home-plumeria.jp/uploads/magazine/0000000182.pdf' },
  { title: 'プルメリア便り 令和8年5月号', url: 'https://home-plumeria.jp/uploads/magazine/0000000178.pdf' },
  { title: 'プルメリア便り 令和8年4月号', url: 'https://home-plumeria.jp/uploads/magazine/0000000160.pdf' },
  { title: 'プルメリア便り 令和8年3月号', url: 'https://home-plumeria.jp/uploads/magazine/0000000155.pdf' },
  { title: 'プルメリア便り 令和8年2月号', url: 'https://home-plumeria.jp/uploads/magazine/0000000170.pdf' },
];

export const magazineListUrl = 'https://home-plumeria.jp/magazine/';

/** ショートステイ（プルメリアⅢ）の施設・設備（出典：公式サイト 施設・設備紹介） */
export const shortStayFacilities: { name: string; body: string }[] = [
  { name: '居室（洋室タイプ）', body: '茶色を基調とした落ち着いた内装です。各居室に洗面・トイレを設置し、テレビ・エアコンも備えています。' },
  { name: '居室（和室タイプ）', body: '畳のお部屋です。設備は洋室タイプと同じです。' },
  { name: 'エントランスホール', body: '正面に受付カウンターがあります。地域の方がいつでも介護の相談をできるよう、365日スタッフが常駐しています。' },
  { name: 'マカナホール', body: 'ハワイ語で「プレゼント」を意味します。1階の床面積の約4割を占める広さで、研究会・勉強会・音楽コンサート等に地域の方もご利用いただけます。' },
  { name: 'コミュニケーションスペース', body: '2階・3階に1つずつ。正面の広いバルコニーから季節の花や景色を眺められます。歓談や読書の場としてお使いいただけます。' },
  { name: '共同生活室', body: '施設建築基準（2㎡×10人）の4倍の広さ。キッチン、大型テレビ、ソファーを設置しています。' },
  { name: '浴室', body: 'ヒノキ風呂・一般浴槽（またぎタイプ）・一般浴槽（降下タイプ）・機械座浴・特浴チェアー浴から選べます。床は冷たさを感じにくい滑りにくいタイルです。' },
  { name: '脱衣室', body: '広々とした洗面脱衣所です。入浴後はベンチに腰掛けて身支度を整えられます。浴室入口はバリアフリーです。' },
];

/** ショートステイの医療行為の受け入れ（出典：公式サイト 料金案内） */
export const shortStayMedicalCare: { item: string; accepted: '○' | '×' | '要相談'; note: string }[] = [
  { item: '経管栄養（胃ろう・腸ろう）', accepted: '○', note: '自己抜去しない方。認知症状の方、マーゲンチューブの方は要相談' },
  { item: '人工肛門', accepted: '○', note: 'ストマ用装具を持ち込める方' },
  { item: '在宅酸素', accepted: '○', note: '持ち込める方。全身症状が悪い場合、認知症状の方は要相談' },
  { item: 'バルーンカテーテル', accepted: '○', note: '全身状態が悪い場合、認知症状の方は要相談' },
  { item: 'インスリン注射', accepted: '○', note: '' },
  { item: 'MRSA', accepted: '○', note: '症状・程度・全身状態が良好の方' },
  { item: '肝炎', accepted: '○', note: '症状の安定が確認できる方' },
  { item: '摘便', accepted: '○', note: '' },
  { item: '吸引', accepted: '×', note: 'ただし、食事前後のみの対応であれば可' },
  { item: 'その他の医療行為', accepted: '要相談', note: '' },
];

export const shortStayNotAccepted: string[] = [
  '入院加療や通院治療、高度医療措置が必要な方。常時治療や24時間看護が必要な方',
  '精神疾患で治療の必要な方。他の利用者に暴力・暴言等の危険行為や、迷惑をかける恐れのある方',
  'その他の疥癬等、協力医院医師・看護師が利用不可と判断したとき',
  '入所受入時の健康状態が悪いと判断したとき',
];

/** 低所得の方の居住・滞在費＋食費の減額（出典：公式サイト 料金案内） */
export const shortStayReducedFees: { label: string; value: string }[] = [
  { label: '第1段階', value: '1,180円／日' },
  { label: '第2段階', value: '1,480円／日' },
  { label: '第3段階①', value: '2,370円／日' },
  { label: '第3段階②', value: '2,670円／日' },
];

/** 物品・サービスの利用回数に応じた費用（出典：公式サイト 料金案内） */
export const shortStayOptionalFees: { label: string; value: string }[] = [
  { label: 'カット＆ブロー（理美容代）', value: '2,730円' },
  { label: 'クリーニング代', value: '650円（1回につき）' },
  { label: '冷蔵庫本体代（電気代込）', value: '60円（1日につき）' },
  { label: 'コンセント代', value: '60円（1日につき）' },
  { label: 'インターネット代', value: '110円（1日につき）' },
  { label: '送迎加算', value: '184円（回数につき）' },
];

/** 訪問介護の具体的なサービス内容（出典：公式サイト 訪問介護サービス） */
export const homeCareTasks: { title: string; items: string[] }[] = [
  {
    title: '身体介護サービス',
    items: ['排泄介助（トイレ介助、おむつ交換など）', '入浴介助（清拭）', '食事介助', '通院・外出介助', '体位交換（床ずれの防止）'],
  },
  {
    title: '生活援助サービス',
    items: ['調理', '室内清掃・整頓', '洗濯', '食材・日常雑貨の買い物'],
  },
];

/** 訪問介護の特長（出典：公式サイト 訪問介護サービス） */
export const homeCareStrengths: { name: string; body: string }[] = [
  {
    name: '専門性の高いスタッフ',
    body: '介護福祉士（国家資格取得者）が多数在籍しています。介護プロフェッショナル・キャリア段位制度に取り組み、アセッサー（評価者）による内部評価を行っています。',
  },
  {
    name: 'ケアマネジメントと多職種連携',
    body: 'ご利用者ごとに専属のサービス提供責任者を選任し、ケアプランに沿った訪問介護計画を作成・調整します。医療・介護の他業種や行政とも連携します。',
  },
  {
    name: '保険外の独自サービス',
    body: '介護保険では提供できない支援も、独自サービスとして柔軟に対応しています（内容により対応できない場合があります）。',
  },
  {
    name: '継続的な研修',
    body: '毎月の社内研修と外部研修を活用し、ホームヘルプサービス・介護技術の向上を図っています。',
  },
];

/** 訪問看護の具体的なサービス内容（出典：公式サイト 訪問看護サービス） */
export const homeNursingTasks: { title: string; items: string[] }[] = [
  {
    title: '医療保険サービス',
    items: ['点滴の管理', '胃ろう（経管栄養）の管理', '喀痰吸引', '注射', 'ストマ・カテーテルの管理', '褥瘡の管理など'],
  },
  {
    title: '介護保険サービス',
    items: ['服薬管理', '体調管理', '療養上の介護', 'ターミナルのケア（最後までご自宅で過ごしたい方）'],
  },
];

/** 訪問看護の特長（出典：公式サイト 訪問看護サービス） */
export const homeNursingStrengths: { name: string; body: string }[] = [
  { name: '専門的な知識と技術', body: '特定行為専門看護師が在籍しています。専門的な評価を行い、経験豊富な看護スタッフがケアにあたります。' },
  { name: '寄り添う看護', body: '痛みの緩和ケアなど、24時間365日の緊急時対応で医療・生活支援を行います。' },
  { name: '生活・想い・心のケア', body: 'ご本人やご家族が望む生活を確認し、多職種と連携しながら「その人らしい生活」を支えます。' },
  { name: 'ご家族の支援', body: 'ご家族の不安や疲労にも寄り添い、相談しながらサービスを提供します。' },
];

/** ケアプラン作成の流れ（出典：公式サイト 居宅介護支援サービス） */
export const careManagementFlow: { title: string; body: string }[] = [
  { title: '要介護認定の申請', body: 'ケアマネジャーが申請の代行も行います。' },
  { title: '要介護認定', body: '市町村による認定を受けます。' },
  { title: 'ケアプランの作成', body: 'ケアマネジャーがご自宅を訪問し、1日の過ごし方や身体の状況をうかがったうえで、ご本人・ご家族の希望に沿ったプランを作成します。' },
  { title: 'サービス開始', body: '訪問介護・デイサービス・デイケア・ショートステイなど、適切なサービスを利用します。' },
  { title: 'ケアプランの見直し', body: 'ご様子に変化がみられたときは、随時サービス内容を調整します。状態が悪化した場合は介護認定の見直しも行います。' },
];

/** ショートステイ利用の実務条件（出典：公式サイト サービス案内） */
export const shortStayUseNotes: string[] = [
  'ご利用の2か月前より申し込みを受け付けています。申し込みの前に、担当のケアマネジャーにご相談ください。',
  '担当のケアマネジャーを通して「予約申込書」「ご利用者様の心身の状況」等の情報をいただき、受け付けます。',
  '初回申し込みの方には、ご本人と在宅の様子をうかがいに訪問します。2回目以降の面談は不要です。',
  'ご利用時は持ち物チェック表を記入してご持参ください。入所の際の送迎も可能です（別途費用）。',
];
