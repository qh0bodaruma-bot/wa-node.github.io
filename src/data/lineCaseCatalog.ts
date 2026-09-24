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
  /** 連携先ごとに、つなぐ前に決めること（デモページの差別化用） */
  setupPoints: { title: string; text: string }[];
  fitCases: string[];
  otherCases: string[];
  sources: { label: string; url: string }[];
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
    setupPoints: [
      { title: '顧客と問い合わせを別のアプリにする', text: '問い合わせは1件ごとに新しいレコード、顧客は1人1レコードに分けます。顧客アプリでは、LINEのユーザーIDを入れる「文字列（1行）」フィールドに重複禁止を設定し、その値（updateKey）とUPSERTモードで、登録済みの人は更新、初めての人は新しく登録します。' },
      { title: 'APIトークンは必要な権限だけ', text: 'APIトークンはアプリごとに発行し、顧客アプリは「レコード追加」と「レコード編集」、問い合わせアプリは「レコード追加」というように、用途に必要なアクセス権だけにチェックを入れます。削除やアプリ管理の権限は付けません。' },
      { title: 'プロセス管理で状態をそろえる', text: '「新着→対応中→完了」をプロセス管理で定義し、連携で自動的に入れる状態と、担当者が進める状態を分けます。' },
      { title: 'ルックアップを使うアプリの注意', text: 'ルックアップを含むアプリへ登録するときは、参照先のアプリのAPIトークンも必要になります。アプリ間の関係を先に整理します。' },
      { title: 'IPアドレス制限との関係', text: 'kintoneにIPアドレス制限をかけている場合は、連携サーバーからの接続をどう許可するかを最初に確認します。' },
    ],
    fitCases: ['問い合わせを業務アプリとして管理し、担当・状態・履歴を残したい', '部署や担当ごとに、見られる範囲を分けたい', 'すでにkintoneで顧客や案件を管理している'],
    otherCases: ['営業の流れ（リード→商談→受注）や商談化率を追うのが主な目的なら、SalesforceやHubSpotとの連携が合う場合があります', '件数が少なく、まず試したい段階なら、Googleスプレッドシートから始める方法もあります'],
    sources: [
      { label: '複数のレコードを更新する（updateKey・UPSERTモード）｜cybozu developer network', url: 'https://cybozu.dev/ja/kintone/docs/rest-api/records/update-records/' },
      { label: 'kintone REST APIの認証（複数のAPIトークン）｜cybozu developer network', url: 'https://cybozu.dev/ja/kintone/docs/rest-api/overview/authentication/' },
      { label: 'APIトークンを使ってみよう｜cybozu developer network', url: 'https://cybozu.dev/ja/kintone/tips/development/customize/development-know-how/api-tokens/' },
    ],
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
    heroDesc: 'LINEから届いた問い合わせを、展示会やWebからの問い合わせと同じようにSalesforceのリードとして登録。既存の割り当てと商談管理の流れに、そのまま乗せます。',
    autoReply: '受け付けました。担当者より折り返しご連絡いたします。',
    setupPoints: [
      { title: 'リードか、取引先責任者か', text: '初めての問い合わせはリード、既存の顧客からの連絡は取引先責任者やケースに結び付けるなど、問い合わせの種類ごとに登録先を決めます。' },
      { title: 'LINEのユーザーIDを外部IDにする', text: 'LINEのユーザーIDを入れるカスタム項目に「外部ID」と「一意」を設定し、その値で新規作成と更新を切り分けます（upsert）。取引開始前のリードは、同じ人から2回届いても1件にまとめます。取引開始後の人は、取引先責任者にもLINEのユーザーIDを持たせて照合します。' },
      { title: '重複ルールで止められたとき', text: '組織で有効にしている重複ルールは、APIからの登録にも働くことがあります。既存のルールで登録が止められたときに、誰に知らせて、どう判断するかを決めておきます。' },
      { title: '連携専用のユーザーと権限セット', text: '連携ごとにAPIからの操作に限った専用のユーザーを用意し、権限セットで必要なオブジェクトと項目だけを許可します。Salesforce Integrationユーザーのライセンスを使えるかは、エディションと空きの数によって変わるため最初に確認します。担当者個人のアカウントでは接続しません。' },
      { title: 'エディションとAPIの上限', text: 'エディションによっては、APIを使うために追加の契約が必要な場合があります。24時間あたりのAPI呼び出し数にも上限があるため、問い合わせ件数の見込みと合わせて確認します。' },
    ],
    fitCases: ['すでにリードと割り当てルールで営業を回している', '展示会やWebと同じ流れで、LINEからのリードも扱いたい', 'LINE経由の問い合わせが商談・受注につながったかまで追いたい'],
    otherCases: ['問い合わせの大半が既存顧客のサポートで営業の流れに乗らない場合は、ケース管理の設計から検討します', 'Apexによる独自開発が前提の案件は、和-Nodeではお受けしていません'],
    sources: [
      { label: 'Upsert Records Using sObject Rows by External ID｜Salesforce Developers', url: 'https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/resources_sobject_upsert_patch.htm' },
      { label: 'Duplicate Rule Header｜Salesforce Developers', url: 'https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/headers_duplicaterules.htm' },
      { label: 'Give Integration Users API Only Access｜Salesforce Help', url: 'https://help.salesforce.com/s/articleView?language=en_US&id=platform.integration_user.htm&type=5' },
    ],
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
    heroDesc: 'LINEから届いた問い合わせをHubSpotのコンタクトとして登録し、ライフサイクルステージやメール配信の流れにつなげます。メールアドレスが分からない問い合わせも、同じ人として扱えるように設計します。',
    autoReply: '受け付けました。担当者より折り返しご連絡いたします。',
    setupPoints: [
      { title: 'メールアドレスがない問い合わせ', text: 'HubSpotのコンタクトは、メールアドレスで同じ人かどうかを判断するのが基本です。LINEだけではメールアドレスが分からないことが多いため、LINEのユーザーIDを一意の値として持つカスタムプロパティを作り、その値で新規作成と更新を切り分けます。' },
      { title: '接続キーと、その替え方', text: '新しく構築する連携では、HubSpotが勧めるサービスキー（Service Keys）で、必要なスコープだけを許可します。従来のプライベートアプリは2026年10月26日から新しく作れなくなりますが、既存のものはそのまま動きます。どちらの場合も、キーを替える手順と担当を決めておきます。' },
      { title: 'ライフサイクルステージを誰が進めるか', text: '連携で自動的に入れるのは「リード」まで、それ以降は担当者が判断する、というように、自動と人の境界を決めます。' },
      { title: 'メール配信に使うときの同意', text: 'LINEで受け取った連絡先をHubSpotのマーケティングメールにも使う場合は、配信の同意をどの画面で、どう取るかを先に決めます。' },
      { title: 'プランで使える機能', text: 'ワークフローなど一部の自動化は、契約しているプランによって使えるかどうかが変わります。連携側で作るか、HubSpotの機能で済ませるかを確認します。' },
    ],
    fitCases: ['HubSpotでメール配信や見込み客の育成をしている', '問い合わせの入口をLINE・Web・広告で比べたい', 'コンタクトの属性や行動で、対応や配信を分けたい'],
    otherCases: ['承認や作業の進み具合など、業務アプリとしての管理が中心なら、kintoneとの連携が合う場合があります', 'メール配信をせず件数も少ないなら、Googleスプレッドシートから始める方法もあります'],
    sources: [
      { label: 'Upsert contacts｜HubSpot docs', url: 'https://developers.hubspot.com/docs/api-reference/latest/crm/objects/contacts/batch/upsert-contacts' },
      { label: 'Legacy private app creation sunset｜HubSpot Developers', url: 'https://developers.hubspot.com/changelog/legacy-private-app-creation-sunset' },
      { label: 'Legacy private apps｜HubSpot docs', url: 'https://developers.hubspot.com/docs/api/private-apps' },
    ],
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
    heroDesc: 'LINEから届いた問い合わせを、いまお使いのGoogleスプレッドシートに1行ずつ記録し、担当者に知らせます。管理の形を変えずに、まず転記の手間から減らせます。',
    autoReply: '受け付けました。担当者より折り返しご連絡いたします。',
    setupPoints: [
      { title: 'Webhookは連携サーバーで受ける', text: 'LINEからの通知は、署名の確認とすぐの応答ができる連携サーバーで受け、スプレッドシートへの書き込みだけをGoogle Apps Scriptなどに任せます。Apps Scriptだけで受けると、通知に付く署名を確認できず、本物のLINEからの通知かを確かめられないためです。' },
      { title: '同時に届いたときの取りこぼし', text: '問い合わせがほぼ同時に届くと、行の書き込みがぶつかることがあります。Google Apps ScriptのLockServiceで、書き込みの部分を1件ずつ順番に処理します。' },
      { title: '列を足しても壊れない作り', text: '担当者がシートに列を追加しても書き込み先がずれないよう、列の位置ではなく見出しの名前で書き込み先を決めます。' },
      { title: '誰のアカウントで動かすか', text: 'スクリプトは、デプロイやトリガーを設定したアカウントの権限で動きます。担当者個人ではなく業務用のアカウントで設定し、ファイルは共有ドライブに置いて、異動や退職で止まらないようにします。' },
      { title: '個人情報が見える範囲', text: 'シートの共有設定が、そのまま個人情報を見られる範囲になります。「リンクを知っている全員」での共有は使わず、見る人を絞ります。' },
      { title: '上限と、移行を考える目安', text: 'Apps Scriptは1回の実行が6分までなどの上限があり、スプレッドシートにもセル数の上限があります。件数や担当者が増えてきたら、kintoneなどへの移行を考える目安にします。' },
    ],
    fitCases: ['まず小さく始めて、効果を確かめたい', '担当が数人で、表で全体を見渡せる', 'すでにスプレッドシートで管理していて、その形を変えたくない'],
    otherCases: ['担当者が多く、見られる範囲を細かく分けたい場合は、kintoneとの連携が合う場合があります', '対応履歴から商談・受注まで追いたい場合は、SalesforceやHubSpotとの連携を検討します'],
    sources: [
      { label: 'Lock Service｜Google Apps Script', url: 'https://developers.google.com/apps-script/reference/lock' },
      { label: 'Quotas for Google Services｜Google Apps Script', url: 'https://developers.google.com/apps-script/guides/services/quotas' },
      { label: 'Web Apps（doPostのイベントオブジェクト）｜Google Apps Script', url: 'https://developers.google.com/apps-script/guides/web' },
      { label: 'Googleドライブに保存できるファイル（スプレッドシートのセル数上限）｜Google ドライブ ヘルプ', url: 'https://support.google.com/drive/answer/37603?hl=ja' },
    ],
  },
];

export function getLineCase(id: LineCaseConfig['id']): LineCaseConfig {
  const found = lineCaseCatalog.find((item) => item.id === id);
  if (!found) throw new Error(`Unknown LINE case id: ${id}`);
  return found;
}
