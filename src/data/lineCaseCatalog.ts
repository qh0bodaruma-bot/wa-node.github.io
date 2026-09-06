export interface LineCasePreset { label: string; message: string }

export interface LineCaseConfig {
  id: 'kintone' | 'salesforce' | 'hubspot' | 'sheets';
  vendorName: string;
  vendorColor: string;
  vendorColorDark: string;
  recordLabel: string;
  columns: { status: string; content: string; time: string; assignee: string };
  newBadge: string;
  assignedBadge: string;
  presets: LineCasePreset[];
  seedRecords: { badge: 'done' | 'inprogress'; content: string; time: string; assignee: string }[];
  automatedTasks: string[];
  humanTasks: string[];
  priceKey: 'lineKintone' | 'lineSalesforce' | 'lineHubspot' | 'lineSheets';
  contactSource: string;
  contactCategory: string;
  heroTitle: string;
  heroDesc: string;
  autoReply: string;
}

export const lineCaseCatalog: LineCaseConfig[] = [
  {
    id: 'kintone',
    vendorName: 'kintone',
    vendorColor: '#0f4c81',
    vendorColorDark: '#0f4c81',
    recordLabel: '問い合わせ',
    columns: { status: '状態', content: '内容', time: '受信時刻', assignee: '担当' },
    newBadge: '新着',
    assignedBadge: '対応中',
    presets: [
      { label: '見積もり依頼', message: '見積もりをお願いできますか？' },
      { label: 'サポート確認', message: 'サポートについて確認したいことがあります。' },
      { label: '契約変更相談', message: '契約内容の変更を相談したいです。' },
    ],
    seedRecords: [
      { badge: 'done', content: '製品カタログ請求', time: '09:15', assignee: '山田' },
      { badge: 'inprogress', content: '価格改定の確認', time: '09:52', assignee: '田中' },
    ],
    automatedTasks: ['受信内容の形式確認', '決めた項目への転記', '既定ルールによる担当候補の設定', '未処理一覧への反映'],
    humanTasks: ['担当の例外判断', '回答内容の作成', '完了判定'],
    priceKey: 'lineKintone',
    contactSource: 'line_kintone_demo',
    contactCategory: 'line_kintone',
    heroTitle: 'LINEの問い合わせが、kintoneに自動で届く。',
    heroDesc: '担当者がLINEを手作業でチェックして転記する作業を減らし、問い合わせ受信から担当者確認まで一本のフローでつなぎます。',
    autoReply: '受け付けました。担当者より折り返しご連絡いたします。',
  },
  {
    id: 'salesforce',
    vendorName: 'Salesforce',
    vendorColor: '#00a1e0',
    vendorColorDark: '#0176a3',
    recordLabel: 'リード',
    columns: { status: 'ステータス', content: 'リード内容', time: '受信時刻', assignee: '担当' },
    newBadge: '新規リード',
    assignedBadge: '商談化',
    presets: [
      { label: '見積もり依頼', message: '見積もりをお願いできますか？' },
      { label: '導入相談', message: '導入について相談したいのですが。' },
      { label: '契約更新の相談', message: '契約更新について相談したいです。' },
    ],
    seedRecords: [
      { badge: 'done', content: '製品資料請求', time: '09:15', assignee: '山田' },
      { badge: 'inprogress', content: '導入時期の確認', time: '09:52', assignee: '田中' },
    ],
    automatedTasks: ['受信内容の形式確認', 'リードレコードの作成', '既定ルールによる担当候補の設定', '未処理一覧への反映'],
    humanTasks: ['既存顧客との照合', '担当の例外判断', '商談化の判定'],
    priceKey: 'lineSalesforce',
    contactSource: 'line_salesforce_demo',
    contactCategory: 'line_sf',
    heroTitle: 'LINEの問い合わせが、Salesforceのリードになる。',
    heroDesc: '担当者がLINEを手作業でチェックして転記する作業を減らし、問い合わせ受信から担当者確認まで一本のフローでつなぎます。',
    autoReply: '受け付けました。担当者より折り返しご連絡いたします。',
  },
  {
    id: 'hubspot',
    vendorName: 'HubSpot',
    vendorColor: '#ff7a59',
    vendorColorDark: '#e66444',
    recordLabel: 'コンタクト',
    columns: { status: 'ステージ', content: 'コンタクト内容', time: '受信時刻', assignee: '担当' },
    newBadge: '新規コンタクト',
    assignedBadge: 'MQL',
    presets: [
      { label: '資料請求', message: '資料をいただけますか？' },
      { label: 'サービス確認', message: 'サービスについて確認したいことがあります。' },
      { label: '料金相談', message: '料金プランを相談したいです。' },
    ],
    seedRecords: [
      { badge: 'done', content: '導入事例の問い合わせ', time: '09:15', assignee: '山田' },
      { badge: 'inprogress', content: '料金プランの確認', time: '09:52', assignee: '田中' },
    ],
    automatedTasks: ['受信内容の形式確認', 'コンタクトレコードの作成', '既定ルールによるスコアリング', '未処理一覧への反映'],
    humanTasks: ['重複統合の判断', 'ステージ妥当性の確認', '配信条件の判断'],
    priceKey: 'lineHubspot',
    contactSource: 'line_hubspot_demo',
    contactCategory: 'line_hubspot',
    heroTitle: 'LINEの問い合わせが、HubSpotのコンタクトになる。',
    heroDesc: '担当者がLINEを手作業でチェックして転記する作業を減らし、問い合わせ受信から担当者確認まで一本のフローでつなぎます。',
    autoReply: '受け付けました。担当者より折り返しご連絡いたします。',
  },
  {
    id: 'sheets',
    vendorName: 'Googleスプレッドシート',
    vendorColor: '#0f9d58',
    vendorColorDark: '#0b8043',
    recordLabel: '問い合わせ行',
    columns: { status: '状態', content: '内容', time: '受信時刻', assignee: '担当' },
    newBadge: '新着',
    assignedBadge: '対応中',
    presets: [
      { label: '見積もり依頼', message: '見積もりをお願いできますか？' },
      { label: 'サポート確認', message: 'サポートについて確認したいことがあります。' },
      { label: '契約変更相談', message: '契約内容の変更を相談したいです。' },
    ],
    seedRecords: [
      { badge: 'done', content: '製品カタログ請求', time: '09:15', assignee: '山田' },
      { badge: 'inprogress', content: '価格改定の確認', time: '09:52', assignee: '田中' },
    ],
    automatedTasks: ['受信内容の形式確認', 'シートへの行追加', '既定ルールによる担当候補の設定', '未処理一覧への反映'],
    humanTasks: ['重複確認', '担当の調整', '完了判定'],
    priceKey: 'lineSheets',
    contactSource: 'line_sheets_demo',
    contactCategory: 'line_sheets',
    heroTitle: 'LINEの問い合わせが、スプレッドシートに自動で届く。',
    heroDesc: '担当者がLINEを手作業でチェックして転記する作業を減らし、問い合わせ受信から担当者確認まで一本のフローでつなぎます。',
    autoReply: '受け付けました。担当者より折り返しご連絡いたします。',
  },
];

export function getLineCase(id: LineCaseConfig['id']): LineCaseConfig {
  const found = lineCaseCatalog.find((item) => item.id === id);
  if (!found) throw new Error(`Unknown LINE case id: ${id}`);
  return found;
}
