export type LabMode = 'before' | 'after';

export interface LabState {
  lead: string;
  heading: string;
  description: string;
  cta: string;
  ctaNote: string;
  items: Array<{
    label: string;
    value: string;
    note?: string;
  }>;
}

export interface LabTopic {
  id: 'hero' | 'pricing' | 'faq' | 'cta';
  label: string;
  title: string;
  fact: string;
  hypothesis: string;
  change: string;
  verify: string;
  before: LabState;
  after: LabState;
}

export const serviceLabTopics: LabTopic[] = [
  {
    id: 'hero',
    label: 'Hero',
    title: '最初の画面で「自分向けか」を判断できるようにする',
    fact: '対象者、相談できる内容、相談後の流れが最初の画面に書かれていません。',
    hypothesis: '読み手は「自分の悩みを相談できるか」を判断できず、詳しく読む前に戻る可能性があります。',
    change: '対象者と支援内容を先に示し、CTAの近くに所要時間と相談後の流れを加えます。',
    verify: '5秒表示後にサービス内容を説明できるか、CTA到達、相談内容の具体性を確認します。',
    before: {
      lead: 'ビジネスの可能性を広げる',
      heading: 'あなたの未来に寄り添います',
      description: '豊富な経験と確かな技術で、お客様に最適なソリューションをご提案します。',
      cta: 'お問い合わせ',
      ctaNote: 'お気軽にご相談ください',
      items: [
        { label: 'サービス', value: '幅広く対応' },
        { label: '品質', value: '丁寧に支援' },
        { label: '実績', value: '多数あります' },
      ],
    },
    after: {
      lead: 'Webの困りごとを、まだ整理できていない方へ',
      heading: '何を直すべきか、一緒に整理します',
      description: '地域事業者のHP・LPを確認し、読み手が迷う場所と、最初に試す改善を一枚のメモにまとめます。',
      cta: '30分の無料相談で整理する',
      ctaNote: '無理な営業は行いません。相談後に改善メモをお送りします。',
      items: [
        { label: '対象', value: 'HP・LPの反応に悩む地域事業者' },
        { label: '内容', value: '画面共有で現状と優先順位を整理' },
        { label: '次の流れ', value: '相談 → 改善メモ → 必要な場合だけ見積り' },
      ],
    },
  },
  {
    id: 'pricing',
    label: '料金',
    title: '金額だけでなく、含まれる範囲と追加条件を比較できるようにする',
    fact: '料金は「お問い合わせください」だけで、相談前に予算の見当をつけられません。',
    hypothesis: '金額が分からない不安に加え、問い合わせ後に断りにくくなる不安も生じます。',
    change: '開始価格、含まれる作業、追加になりやすい条件、見積り前の確認事項を並べます。',
    verify: '料金だけを尋ねる問い合わせと対象外相談が減るか、見積り後の辞退理由を確認します。',
    before: {
      lead: '料金について',
      heading: 'お客様に合わせてお見積りします',
      description: 'ご要望によって金額が変わります。詳しくはお問い合わせください。',
      cta: '料金を問い合わせる',
      ctaNote: '詳細は個別にご案内します',
      items: [
        { label: '相談', value: '要問い合わせ' },
        { label: '改善', value: '要問い合わせ' },
        { label: '制作', value: '要問い合わせ' },
      ],
    },
    after: {
      lead: '料金の目安',
      heading: '必要な範囲から、小さく始められます',
      description: '最初の相談で目的と変更範囲を確認し、追加費用が生じる条件まで見積書へ記載します。',
      cta: '自分に近いプランを相談する',
      ctaNote: '契約前の相談と見積りは無料です',
      items: [
        { label: '改善相談', value: '8,800円〜', note: '画面確認・改善メモ' },
        { label: 'LP改修', value: '32,000円〜', note: 'コピー・配置の部分修正' },
        { label: '新規制作', value: '64,000円〜', note: '構成・文章・デザイン' },
      ],
    },
  },
  {
    id: 'faq',
    label: 'FAQ',
    title: 'よく聞かれる質問ではなく、相談を止める不安から並べる',
    fact: 'FAQは営業時間や対応地域だけで、費用、断り方、準備物への不安に答えていません。',
    hypothesis: '興味があっても、相談後の負担や営業への不安が残り、CTAまで進めない可能性があります。',
    change: '相談前に止まりやすい質問を優先し、向いていないケースと断れる条件も明記します。',
    verify: 'FAQ閲覧後のCTA到達、相談時の重複質問、相談後の認識違いを確認します。',
    before: {
      lead: 'よくある質問',
      heading: 'ご質問にお答えします',
      description: 'そのほかのご質問は、お問い合わせフォームからご連絡ください。',
      cta: '質問する',
      ctaNote: '順次ご返信します',
      items: [
        { label: 'Q1', value: '営業時間を教えてください' },
        { label: 'Q2', value: '対応地域はどこですか' },
        { label: 'Q3', value: 'オンライン対応はできますか' },
      ],
    },
    after: {
      lead: '相談前に確認したいこと',
      heading: '不安が残ったまま、申し込まなくても大丈夫です',
      description: '相談内容が固まっていない場合や、依頼するか決めていない段階でも利用できます。',
      cta: '残っている不安を相談する',
      ctaNote: '相談後に依頼しない選択もできます',
      items: [
        { label: '料金', value: '追加費用はいつ発生しますか' },
        { label: '判断', value: '相談後に断っても大丈夫ですか' },
        { label: '準備', value: '原稿や画像がなくても相談できますか' },
      ],
    },
  },
  {
    id: 'cta',
    label: 'CTA',
    title: 'ボタンを目立たせる前に、押した後に起こることを伝える',
    fact: 'すべてのボタンが「お問い合わせ」で、相談と情報収集の目的が分かれていません。',
    hypothesis: 'まだ比較中の読み手には行動が重く感じられ、押した先への不安が残ります。',
    change: '相談用と情報収集用の導線を分け、ボタンの近くに所要時間と次の流れを示します。',
    verify: 'CTA別のクリック、フォーム到達と完了、押した後に戻る割合、相談内容を確認します。',
    before: {
      lead: 'お気軽にご連絡ください',
      heading: 'まずはお問い合わせください',
      description: 'ご相談、ご質問、お見積りなど、フォームよりお問い合わせいただけます。',
      cta: 'お問い合わせ',
      ctaNote: 'フォームへ移動します',
      items: [
        { label: '上部', value: 'お問い合わせ' },
        { label: '中部', value: 'お問い合わせ' },
        { label: '下部', value: 'お問い合わせ' },
      ],
    },
    after: {
      lead: '今の検討段階に合わせて選べます',
      heading: '相談するか、事例を見てから考えるか',
      description: '今すぐ依頼を決める必要はありません。知りたいことに近い入口を選んでください。',
      cta: '30分の無料相談を予約する',
      ctaNote: '入力は約2分。送信後に日程候補をご案内します',
      items: [
        { label: '相談したい', value: '無料相談を予約する' },
        { label: '比較したい', value: 'Before／After事例を見る' },
        { label: '料金を知りたい', value: '料金と制作範囲を確認する' },
      ],
    },
  },
];

export const labCases = [
  {
    slug: 'service-lp',
    title: '相談型サービスLP',
    summary: '対象・料金・FAQ・CTAの小さな不足を整理し、初見の読み手が相談前に判断できる状態へ整えます。',
    status: '公開中',
    topics: ['Hero', '料金', 'FAQ', 'CTA'],
  },
  {
    slug: 'local-service',
    title: '地域サービスLP',
    summary: '予約前の不安、対応範囲、当日の流れを、読み手の検討順に並べ直す事例です。',
    status: '準備中',
    topics: ['料金', '実績', '予約'],
  },
  {
    slug: 'b2b-service',
    title: 'BtoBサービスページ',
    summary: '機能説明を、導入担当者が社内で比較・説明できる判断材料へ翻訳する事例です。',
    status: '準備中',
    topics: ['情報量', '比較', '資料請求'],
  },
];
