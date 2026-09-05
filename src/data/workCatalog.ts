import type { SiteLanguage } from './services';
import { servicePrices } from './services';
export type WorkCategory = 'line' | 'app' | 'web' | 'system' | 'tool' | 'kdp';
export interface WorkItem { id:string; category:WorkCategory; title:Record<SiteLanguage,string>; description:Record<SiteLanguage,string>; href:string; image:string; priceKey?:keyof typeof servicePrices; featured:boolean }
export const workCatalog: WorkItem[] = [
  {
    "category": "line",
    "title": {
      "ja": "LINE × kintone 問い合わせ管理",
      "en": "LINE × kintone inquiry management",
      "fr": "LINE × kintone : gestion des demandes"
    },
    "description": {
      "ja": "問い合わせ受信からkintone自動登録・担当者割り当て・対応完了通知まで、一連のフローをインタラクティブデモで体験できるケーススタディです。",
      "en": "Try recording a LINE inquiry, assigning an owner and sending a completion notification.",
      "fr": "Tester la création d’une fiche, l’attribution et la notification de fin de traitement."
    },
    "href": "/case-studies/line-kintone-demo/",
    "image": "",
    "id": "work-01",
    "priceKey": "lineKintone",
    "featured": true
  },
  {
    "category": "line",
    "title": {
      "ja": "LINE × Salesforce リード管理",
      "en": "LINE × Salesforce lead management",
      "fr": "LINE × Salesforce : gestion des prospects"
    },
    "description": {
      "ja": "問い合わせ受信からSalesforceリード自動登録・担当者割り当て・商談ステータス管理まで、一連のフローをインタラクティブデモで体験できるケーススタディです。",
      "en": "Explore a sample journey from a LINE inquiry to lead registration and follow-up.",
      "fr": "Explorer le parcours entre une demande LINE, son enregistrement et son suivi."
    },
    "href": "/case-studies/line-salesforce-demo/",
    "image": "",
    "id": "work-02",
    "priceKey": "lineSalesforce",
    "featured": false
  },
  {
    "category": "line",
    "title": {
      "ja": "LINE × HubSpot コンタクト管理",
      "en": "LINE × HubSpot contact management",
      "fr": "LINE × HubSpot : gestion des contacts"
    },
    "description": {
      "ja": "問い合わせ受信からHubSpotコンタクト自動登録・スコアリング・MA配信連動まで、一連のフローをインタラクティブデモで体験できるケーススタディです。",
      "en": "Try the flow from LINE inquiry capture to contact management and notifications.",
      "fr": "Tester la réception des demandes, la gestion des contacts et les notifications."
    },
    "href": "/case-studies/line-hubspot-demo/",
    "image": "",
    "id": "work-03",
    "priceKey": "lineHubspot",
    "featured": false
  },
  {
    "category": "line",
    "title": {
      "ja": "LINE × スプレッドシート 問い合わせ記録",
      "en": "LINE × Google Sheets inquiry records",
      "fr": "LINE × Google Sheets : suivi des demandes"
    },
    "description": {
      "ja": "問い合わせ受信からスプレッドシート自動記録・担当者通知まで、一連のフローをインタラクティブデモで体験できるケーススタディです。10万円〜のスモールスタートに最適。",
      "en": "Try recording inquiries in a spreadsheet and notifying the responsible team.",
      "fr": "Tester l’enregistrement dans un tableur et la notification de l’équipe."
    },
    "href": "/case-studies/line-spreadsheet-demo/",
    "image": "",
    "id": "work-04",
    "priceKey": "lineSheets",
    "featured": false
  },
  {
    "category": "web",
    "title": {
      "ja": "講座販売サイト ワイヤーフレーム",
      "en": "Course sales website wireframe",
      "fr": "Maquette de vente de formations"
    },
    "description": {
      "ja": "架空のオンライン講座を題材に、管理者が更新する情報と、将来の会員・動画・進捗機能の追加余地も示した制作例です。",
      "en": "Explore how course information, pricing and the purchase journey fit together.",
      "fr": "Explorer l’organisation des cours, des tarifs et du parcours d’achat."
    },
    "href": "/course-sales-demo/",
    "image": "",
    "id": "work-05",
    "featured": false
  },
  {
    "category": "web",
    "title": {
      "ja": "Canva制作サンプル 3パターン",
      "en": "Three Canva website samples",
      "fr": "Trois exemples de sites Canva"
    },
    "description": {
      "ja": "弊社サイトを題材にした自主制作の制作例です。編集できるひな形として納品する場合の仕上がりの幅を、現物で比較できます。",
      "en": "Compare three editable design approaches for different business needs.",
      "fr": "Comparer trois directions de design modifiables selon les besoins d’une activité."
    },
    "href": "/canva-portfolio/",
    "image": "/images/works-canva.webp",
    "id": "work-06",
    "featured": false
  },
  {
    "category": "web",
    "title": {
      "ja": "Web改善ラボ",
      "en": "Website improvement lab",
      "fr": "Laboratoire d’amélioration web"
    },
    "description": {
      "ja": "相談型サービスLPを題材に、Hero・料金・FAQ・CTAの小さな説明不足を、読み手の判断材料へ変える過程を確認できます。",
      "en": "Compare before and after versions with observations, proposed changes and verification ideas.",
      "fr": "Comparer les versions avant et après, les observations et les vérifications proposées."
    },
    "href": "/lab/",
    "image": "/images/ogp-lab.png",
    "id": "work-07",
    "priceKey": "lpReview",
    "featured": false
  },
  {
    "category": "web",
    "title": {
      "ja": "BtoB企業サイト再構成",
      "en": "B2B company website",
      "fr": "Site d’entreprise BtoB"
    },
    "description": {
      "ja": "架空の精密製造企業を題材に、企業サイト7ページ、問い合わせ導線、導入事例のCMS更新デモまで制作した自主制作ケーススタディです。",
      "en": "Explore a fictional company site, information structure and a proposed CMS workflow.",
      "fr": "Explorer une entreprise fictive, sa structure d’information et un fonctionnement CMS envisagé."
    },
    "href": "/case-studies/b2b-corporate-renewal/",
    "image": "/images/case-studies/b2b/hokushin-factory-hero.webp",
    "id": "work-08",
    "priceKey": "website",
    "featured": true
  },
  {
    "category": "tool",
    "title": {
      "ja": "広告・LP・計測改善",
      "en": "Advertising, landing pages & measurement",
      "fr": "Publicité, pages de vente et mesure"
    },
    "description": {
      "ja": "Yahoo・LINE広告を想定し、広告文からLP、フォーム、問い合わせ品質までを週次で改善する判断例です。",
      "en": "See how ad copy, landing pages, forms and inquiry quality can be reviewed together.",
      "fr": "Examiner ensemble annonces, pages, formulaires et qualité des demandes."
    },
    "href": "/case-studies/ad-lp-measurement/",
    "image": "",
    "id": "work-09",
    "featured": false
  },
  {
    "category": "system",
    "title": {
      "ja": "予約受付・店舗管理システム",
      "en": "Booking & store management",
      "fr": "Réservation et gestion de boutique"
    },
    "description": {
      "ja": "架空サロンを題材に、空き枠選択、受付完了、店舗側の状態変更、CSV出力をブラウザ内で試せます。",
      "en": "Try a customer booking screen and the store-side workflow, including status and CSV export.",
      "fr": "Tester la réservation côté client, le traitement des statuts et l’export CSV."
    },
    "href": "/case-studies/reservation-operations/",
    "image": "",
    "id": "work-10",
    "priceKey": "webSystem",
    "featured": false
  },
  {
    "category": "app",
    "title": {
      "ja": "ペット健康手帳・Flow",
      "en": "Pet Health Note & Flow",
      "fr": "Pet Health Note et Flow"
    },
    "description": {
      "ja": "体重・体調の記録とケア予定、サブスクの費用一覧・請求カレンダー・支出分析を操作できるアプリデモです。",
      "en": "Try pet records and schedules, plus subscription expenses, billing calendars and analysis.",
      "fr": "Tester le suivi d’un animal, les agendas, les dépenses d’abonnements et leur analyse."
    },
    "href": "/mobile-app-demo/",
    "image": "",
    "id": "work-11",
    "priceKey": "businessApp",
    "featured": true
  },
  {
    "category": "web",
    "title": {
      "ja": "選ばれる導線デモ",
      "en": "Psychology-informed website demo",
      "fr": "Démo web inspirée de la psychologie"
    },
    "description": {
      "ja": "なぜそのボタンはそこにあるのか？心理学的根拠に基づいた情報配置の「正解」を、解説付きで体験できる特別なデモページです。",
      "en": "Explore information order and interactions designed to make decisions easier.",
      "fr": "Explorer l’ordre des informations et les interactions qui facilitent les décisions."
    },
    "href": "/psychology-demo/",
    "image": "/images/works-psy-demo.webp",
    "id": "work-12",
    "priceKey": "lp",
    "featured": false
  },
  {
    "category": "web",
    "title": {
      "ja": "地域サロン・整体向け予約導線LP",
      "en": "Local salon booking landing page",
      "fr": "Page de réservation pour salon local"
    },
    "description": {
      "ja": "初回来店前の不安を減らすために、料金、流れ、アクセス、LINE予約導線をスマホで確認しやすく整理した架空サンプルです。",
      "en": "Follow a sample journey from understanding a salon service to a booking inquiry.",
      "fr": "Suivre un parcours de présentation du service jusqu’à la demande de réservation."
    },
    "href": "/salon-reservation-demo/",
    "image": "/portfolio-lp/images/hero_sekkotsu.webp",
    "id": "work-13",
    "priceKey": "lp",
    "featured": false
  },
  {
    "category": "web",
    "title": {
      "ja": "クリニック・医療系LP",
      "en": "Medical & clinic landing page",
      "fr": "Page pour cabinet médical"
    },
    "description": {
      "ja": "美容クリニック、心療内科等を想定したLP制作サンプル。医療広告ガイドラインに配慮しつつ、安心感と予約導線を両立させた構成例です。",
      "en": "A sample landing page with service information and a clear route to contact.",
      "fr": "Un exemple de présentation des services et de parcours de prise de contact."
    },
    "href": "/portfolio-lp/lp_clinic.html",
    "image": "/portfolio-lp/images/hero_clinic.webp",
    "id": "work-14",
    "priceKey": "lp",
    "featured": false
  },
  {
    "category": "web",
    "title": {
      "ja": "LP制作サンプル集",
      "en": "Landing page sample collection",
      "fr": "Collection de pages de vente"
    },
    "description": {
      "ja": "業種別のLP制作サンプルをまとめたギャラリーです。第一印象、信頼形成、相談ボタンに加えて「なぜその工夫を入れたか」まで比較できます。",
      "en": "Compare examples for different industries and find a direction for your own site.",
      "fr": "Comparer des exemples de différents secteurs pour définir votre propre direction."
    },
    "href": "/lp-portfolio/",
    "image": "/portfolio-lp/images/hero_corporate.webp",
    "id": "work-15",
    "priceKey": "lp",
    "featured": false
  },
  {
    "category": "system",
    "title": {
      "ja": "AI相談内容整理ナビ",
      "en": "AI inquiry assistant",
      "fr": "Assistant IA de prise de contact"
    },
    "description": {
      "ja": "ユーザーの漠然とした悩みを、Web制作やICT活用の切り口でAIが整理。OpenAI APIを活用した実用的なAI接客のデモアプリケーションです。",
      "en": "An AI interaction that helps organize an initial business inquiry before consultation.",
      "fr": "Une interaction IA pour organiser une première demande avant la consultation."
    },
    "href": "/ai-chat-demo/",
    "image": "/images/works-system.webp",
    "id": "work-16",
    "featured": false
  },
  {
    "category": "tool",
    "title": {
      "ja": "ファーストビュー・色彩診断",
      "en": "First-view & color check",
      "fr": "Diagnostic du premier écran et des couleurs"
    },
    "description": {
      "ja": "見出し・CTA・信頼材料のバランスと配色をブラウザ内で簡易診断。相談前セルフチェックや公開前チェックなど、自社サイト用ツールの見本として使えます。",
      "en": "Try a browser-based check of headings, calls to action and color combinations.",
      "fr": "Tester l’organisation des titres, des appels à l’action et des couleurs dans le navigateur."
    },
    "href": "/wasm-diagnosis/",
    "image": "",
    "id": "work-17",
    "featured": false
  },
  {
    "category": "tool",
    "title": {
      "ja": "こころの疲労度診断",
      "en": "Mental fatigue self-check",
      "fr": "Auto-évaluation de la fatigue mentale"
    },
    "description": {
      "ja": "産業カウンセラーの知見をシステム化。現在のストレス要因を可視化し、適切なケアへの気づきを促すインタラクティブな診断ツールです。",
      "en": "An interactive example of presenting questions, branching results and supportive information.",
      "fr": "Un exemple interactif de questions, de résultats conditionnels et d’informations de soutien."
    },
    "href": "/mental_care/",
    "image": "/images/works-mental.webp",
    "id": "work-18",
    "featured": false
  },
  {
    "category": "tool",
    "title": {
      "ja": "セルフ・バリアフリー診断",
      "en": "Accessibility self-check",
      "fr": "Auto-évaluation de l’accessibilité"
    },
    "description": {
      "ja": "車いすユーザー視点でのアクセシビリティチェック。物理的な障壁を可視化し、改善の第一歩をサポートするための診断アプリです。",
      "en": "Explore an interactive assessment interface that presents accessibility considerations.",
      "fr": "Explorer une interface présentant différents points d’attention sur l’accessibilité."
    },
    "href": "/barrier_free/",
    "image": "/images/works-accessibility.webp",
    "id": "work-19",
    "featured": false
  },
  {
    "category": "tool",
    "title": {
      "ja": "SEO/AEO内部診断",
      "en": "SEO/AEO self-check",
      "fr": "Auto-évaluation SEO/AEO"
    },
    "description": {
      "ja": "Webサイトの健全性を30項目でチェック。検索エンジンだけでなく、AI検索に読まれやすい構造まで分かりやすく確認できます。",
      "en": "Try a checklist that helps organize website structure and content improvement points.",
      "fr": "Une liste de vérification pour organiser les pistes d’amélioration du site et de ses contenus."
    },
    "href": "/seo_check/",
    "image": "/images/works-seo.webp",
    "id": "work-20",
    "priceKey": "lpReview",
    "featured": false
  },
  {
    "category": "kdp",
    "title": {
      "ja": "Amazon KDP 出版実績",
      "en": "Amazon KDP publications",
      "fr": "Publications Amazon KDP"
    },
    "description": {
      "ja": "浮世絵や伝統文様をモチーフにした海外市場向け書籍制作。和の美しさを世界へ届けるブランディング支援の実績です。",
      "en": "Explore the published books and the associated content production work.",
      "fr": "Découvrir les livres publiés et le travail de création de contenu associé."
    },
    "href": "/kdp_books/",
    "image": "/images/works-kdp.webp",
    "id": "work-21",
    "featured": false
  }
];
