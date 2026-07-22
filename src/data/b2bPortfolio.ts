export type B2BFeature = {
  icon: string;
  title: string;
  text: string;
};

export type B2BPage = {
  slug: string;
  navLabel: string;
  eyebrow: string;
  title: string;
  lead: string;
  features: B2BFeature[];
  noteTitle: string;
  noteText: string;
  ctaLabel: string;
};

export const b2bCompany = {
  name: '北辰精機株式会社',
  englishName: 'HOKUSHIN PRECISION',
  statement: '止めない製造を、設計から。',
  description: '精密加工・治具設計・量産改善を一つの窓口で支援する、架空のBtoB製造企業です。',
};

export const b2bPages: B2BPage[] = [
  {
    slug: 'solutions',
    navLabel: '課題解決',
    eyebrow: 'SOLUTIONS',
    title: '設備ではなく、製造課題から考える。',
    lead: '図面、品質、納期、量産移行。それぞれの課題を分断せず、現場で使える改善案にまとめます。',
    features: [
      { icon: 'precision_manufacturing', title: '量産立ち上げ', text: '試作から量産までの条件を整理し、工程と検査項目を設計します。' },
      { icon: 'troubleshoot', title: '品質課題の整理', text: '不具合の現象、発生条件、検査データを分けて再発防止へつなげます。' },
      { icon: 'cycle', title: '工程改善', text: '段取り、治具、加工順を見直し、品質を守りながら負荷を減らします。' },
    ],
    noteTitle: 'まだ仕様が固まっていなくても大丈夫です',
    noteText: '必要な精度、数量、使用環境が分かる範囲から伺い、確認すべき条件を一覧にして返します。',
    ctaLabel: '製造課題を相談する',
  },
  {
    slug: 'products',
    navLabel: '技術・製品',
    eyebrow: 'TECHNOLOGY',
    title: '加工・治具・検査を、ひと続きに。',
    lead: '単品の部品加工だけでなく、組付け、検査、量産後の改善までを見越した技術提案を行います。',
    features: [
      { icon: 'settings', title: '精密切削部品', text: 'アルミ、ステンレス、特殊鋼に対応。小ロット試作から量産まで扱います。' },
      { icon: 'handyman', title: '専用治具・省力化', text: '作業者の負担とばらつきを減らす、現場に合わせた治具を設計します。' },
      { icon: 'fact_check', title: '検査・品質保証', text: '測定方法と記録項目を明確にし、後から追える品質情報を残します。' },
    ],
    noteTitle: '図面だけでは分からない条件も確認します',
    noteText: '用途、相手部品、使用温度、交換頻度などを確認し、過剰品質や確認漏れを防ぎます。',
    ctaLabel: '加工可否を確認する',
  },
  {
    slug: 'cases',
    navLabel: '導入事例',
    eyebrow: 'CASE STUDIES',
    title: '判断の背景まで伝える、導入事例。',
    lead: '成果を大きく見せるのではなく、何が課題で、どこを変え、どのように確認したかを紹介します。',
    features: [
      { icon: 'speed', title: '段取り工程の見直し', text: '治具と作業順を見直し、担当者が変わっても同じ手順で進められる状態へ。' },
      { icon: 'verified', title: '検査基準の共通化', text: '部署ごとに異なっていた確認方法を整理し、記録様式を統一しました。' },
      { icon: 'hub', title: '試作から量産への移行', text: '設計変更と加工条件を一つの表で管理し、確認の往復を減らしました。' },
    ],
    noteTitle: '掲載内容は自主制作の架空事例です',
    noteText: '実在企業の成果や数値ではありません。事例ページで何を説明するかを示す情報設計サンプルです。',
    ctaLabel: '近い課題を相談する',
  },
  {
    slug: 'company',
    navLabel: '会社情報',
    eyebrow: 'COMPANY',
    title: '技術の前に、相談できる関係をつくる。',
    lead: '受注できるかだけでなく、難しい条件や懸念点も早い段階で共有することを大切にしています。',
    features: [
      { icon: 'history', title: '沿革', text: '試作加工から始まり、治具・量産改善へと対応領域を広げてきた想定です。' },
      { icon: 'policy', title: '品質方針', text: '確認できた事実と未確認事項を分け、記録に残る進め方を徹底します。' },
      { icon: 'location_on', title: '国内一貫対応', text: '設計相談、加工、検査、納品後の振り返りまで同じ窓口で対応します。' },
    ],
    noteTitle: 'この会社情報はポートフォリオ用の架空設定です',
    noteText: '所在地、沿革、認証、設備数など、実在する企業情報としては使用していません。',
    ctaLabel: '会社への相談内容を送る',
  },
  {
    slug: 'recruit',
    navLabel: '採用情報',
    eyebrow: 'RECRUIT',
    title: '考えて、つくって、確かめる人へ。',
    lead: '経験年数だけで判断せず、質問できること、記録できること、改善を続けられることを大切にします。',
    features: [
      { icon: 'school', title: '現場で学ぶ', text: '加工、測定、図面の読み方を、実物と記録を行き来しながら学びます。' },
      { icon: 'groups', title: '一人にしない', text: '判断に迷う工程はレビューし、属人化しない手順へ整えます。' },
      { icon: 'monitoring', title: '改善を評価する', text: '速さだけでなく、再現性や確認のしやすさも改善として評価します。' },
    ],
    noteTitle: '応募前に工場見学ができます',
    noteText: '働く環境と業務内容を確認してから、選考へ進むか判断できる想定の導線です。',
    ctaLabel: '採用について問い合わせる',
  },
  {
    slug: 'contact',
    navLabel: 'お問い合わせ',
    eyebrow: 'CONTACT',
    title: '図面がなくても、分かる範囲から。',
    lead: '秘密保持が必要な情報はフォームへ書かず、最初は製品用途や困っている状況だけお知らせください。',
    features: [
      { icon: 'description', title: '図面・仕様の相談', text: '材質、数量、希望時期、用途など、分かる範囲から確認します。' },
      { icon: 'construction', title: '工程・治具の相談', text: '写真や現場情報の共有方法は、初回返信後に個別にご案内します。' },
      { icon: 'support_agent', title: 'その他のご相談', text: '依頼先が決まっていない段階でも、対応範囲を整理してお返事します。' },
    ],
    noteTitle: '通常2営業日以内に担当者から返信します',
    noteText: '営業目的の送信、機密情報、個人情報を含む図面の直接添付は避けてください。',
    ctaLabel: '相談内容を確認する',
  },
];

export const b2bNav = [
  { href: '/portfolio-b2b/', label: 'トップ' },
  ...b2bPages.map((page) => ({ href: `/portfolio-b2b/${page.slug}/`, label: page.navLabel })),
];
