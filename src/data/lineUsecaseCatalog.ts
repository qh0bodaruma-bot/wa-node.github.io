// 用途別のLINE連携デモ（業務ごとの3本）の文章データ。
// 連携先別の4本（lineCaseCatalog.ts）とは別に、「どんな業務で使うか」を見せる。
// 方針：projects/wa-node-line-usecase-demos/task.md（AI-Company）

export interface UsecaseSetup {
  vendorName: string;
  setupPoints: { title: string; text: string }[];
  fitCases: string[];
  otherCases: string[];
  sources: { label: string; url: string }[];
}

export const seminarBookingSetup: UsecaseSetup = {
  vendorName: 'HubSpot',
  setupPoints: [
    { title: '本人確認と、既存のお客様との結び付け', text: '実運用ではLIFFのIDトークンをサーバーで検証し、LINEの利用者を確かめます。入力されたメールアドレスだけで既存の顧客情報を上書きせず、メールでの確認などを経て結び付けます。HubSpotへは照合済みのコンタクトIDで参加状況を記録します（メールアドレスで直接記録すると、コンタクトの作成や項目の更新が起きうるためです）。このデモはLINE利用者の確認が済んだ架空の参加者に固定しています。' },
    { title: '開催回ごとの記録の置き場所', text: '顧客情報と、開催回ごとの申込み・参加の記録を分けます。HubSpotのMarketing Events APIは、イベントへの登録・参加・キャンセルをコンタクトに関連付けて記録できます。定員やキャンセル待ちの管理は別に設計します。' },
    { title: '定員と、同じ申込みの再受付', text: '連携側に予約の正本を置き、参加者と開催回の組み合わせで重複を防ぎます。同時に申し込まれても定員を超えないように枠を確保し、HubSpotへの反映に失敗しても予約を増やさず再実行できる設計にします。' },
    { title: 'キャンセルと繰り上げの決め方', text: '取消しの期限、受付窓口、キャンセル待ちから案内する順番と回答期限を決めます。席が空いても自動で参加確定にせず、希望を確かめてから繰り上げる想定です。取消しと繰り上げの操作はこのデモには含みません。' },
    { title: '案内の希望と、送れなかったときの対応', text: '予約に必要な連絡と任意の販促案内を分け、希望した日時と案内の種類、取り消した履歴を残します。実運用の配信時には最新の希望・停止状況を確認します。LINEのブロックや送信条件、通数上限で届かない場合もあるため、再送や別の連絡方法を決めます。申込みのときに公式アカウントを友だち追加してもらう流れにするかも、あわせて決めます。' },
    { title: '契約プランと担当者の権限', text: 'HubSpot側で利用するAPIの権限、配信や自動処理に必要な契約、LINEの送信通数を確認してから範囲を決めます。顧客登録だけで販促配信に同意した扱いにはしません。予約情報を見られる担当者と保存期間も決めておきます。' },
  ],
  fitCases: [
    'HubSpotで顧客を管理していて、セミナーの申込み一覧を別の表から転記している',
    'LINEで顧客とやり取りしており、申込みから開催案内までつなげたい',
    '参加した人と欠席した人で、その後の対応を分けたい',
  ],
  otherCases: [
    '単発の受付だけで足りる場合は、既存の申込みフォームやイベント受付サービスを使う方法もあります',
    '顧客がLINEを使わない場合やHubSpotを導入していない場合は、今の受付方法に合う別の構成を検討します',
  ],
  sources: [
    { label: 'Marketing Events API（コンタクトの登録・参加・キャンセル）｜HubSpot Developers', url: 'https://developers.hubspot.com/docs/api-reference/marketing-marketing-events-v3/guide' },
    { label: 'LIFFアプリとサーバーでユーザー情報を利用する｜LINE Developers', url: 'https://developers.line.biz/ja/docs/liff/using-user-profile/' },
    { label: 'メッセージを送信する（送信方法・通数の数え方）｜LINE Developers', url: 'https://developers.line.biz/ja/docs/messaging-api/sending-messages/' },
  ],
};

export const fieldReportSetup: UsecaseSetup = {
  vendorName: 'kintone',
  setupPoints: [
    { title: '報告者をどう確かめるか', text: '最初の1回だけ、事務所から協力会社の担当者に渡した登録コードを入力してもらい、LINEの利用者とその担当者を結び付けます。入力画面（LIFF）からはユーザーIDをそのまま送らず、IDトークンを送ってサーバー側で確かめます。' },
    { title: '写真の容量と写り込み', text: '写真はスマートフォンの画質のままだと大きくなるため、送る前に縮小するかを決めます。人の顔や車のナンバー、お客様の書類が写り込んだときの扱いも、運用のルールとして決めておきます。' },
    { title: '協力会社に見せる範囲', text: 'LINEの入力画面では、自社の報告と担当する現場だけを表示します。他社の報告や、事務所側の判断・メモは見えないようにします。' },
    { title: '未提出の催促', text: '報告がまだの現場を一覧で把握し、いつ・誰に・どの文面で催促するかを決めます。催促をLINEで送る場合は、送信の数と時間帯も決めておきます。' },
    { title: '送ったあとの修正', text: '送信後に間違いに気づいたときの直し方を決めます。協力会社側で直せるのは当日中だけにして、それ以降は事務所側で修正するなど、記録の残し方までそろえます。' },
  ],
  fitCases: [
    '協力会社・パート・派遣スタッフなど、kintoneのアカウントを持たない人から報告を受けている',
    '報告を紙や写真付きのメッセージで受けていて、事務所で転記している',
    '事務所側ではkintoneで現場や対応状況を管理している',
  ],
  otherCases: [
    '報告する人が全員kintoneのアカウントを持っているなら、kintoneのスマートフォン画面から直接入力する方法もあります',
    '報告の件数が少なく、まず試したい段階なら、Googleスプレッドシートに記録する形から始める方法もあります',
  ],
  sources: [
    { label: 'kintone 料金（1ユーザーあたりの月額、ゲストユーザー）｜サイボウズ', url: 'https://kintone.cybozu.co.jp/price/' },
    { label: 'LIFFアプリとサーバーでユーザー情報を利用する｜LINE Developers', url: 'https://developers.line.biz/ja/docs/liff/using-user-profile/' },
    { label: 'フィールドの入力制限（値の重複を禁止する）｜kintone ヘルプ', url: 'https://jp.cybozu.help/k/ja/user/app_settings/form/form_parts/field_restriction.html' },
  ],
};

export const partnerVisitSetup: UsecaseSetup = {
  vendorName: 'Salesforce',
  setupPoints: [
    { title: '代理店ごとに見せる取引先', text: '入力画面に出す取引先は、その代理店が担当するものだけにします。検索もサーバー側で絞り込み、ほかの代理店のお客様の名前が画面に出ないようにします。' },
    { title: '担当者の確認と、異動・退職したときの止め方', text: '最初の1回だけ、自社から代理店の担当者に渡した登録コードで、LINEの利用者と担当者を結び付けます。担当者が異動や退職をしたら、自社側で結び付けを外して報告を受け付けないようにします。誰がいつ外すかも決めておきます。' },
    { title: '書き込みは連携専用のユーザーで', text: '代理店の担当者にSalesforceのライセンスは用意せず、書き込みは連携専用のユーザーが行います。記録の作成者は連携ユーザーになるため、どの代理店の誰の報告かは、別の項目に残します。エディションによってはAPIを使うために追加の契約が必要で、連携専用ユーザーのライセンスが使えるかもエディションと空きの数で変わります。この使い方が契約条件に合うかは、Salesforceとの契約内容で確認します。' },
    { title: '一覧にない取引先の扱い', text: '新しい取引先は、正式な取引先をすぐには作らず、確認待ちの置き場所（専用のオブジェクトやリードなど）に仮登録します。すべての取引先と照らして重複を確かめますが、その結果は代理店側には見せません。自社の担当者が登録を認めたら、その取引先をこの代理店の担当として結び付けます。' },
    { title: '訪問の記録をどこに残すか', text: 'Salesforceでは、ToDoと行動をまとめて「活動」と呼びます。訪問の報告を完了済みのToDoとして商談に関連付けるか（取引先は商談からたどれます）、行動として残すかを、今の営業の記録の仕方に合わせて決めます。進行中の商談が複数ある取引先では、どの商談に付けるかの選び方も決めます。次の予定日は、新しいToDoにします。' },
    { title: '商談の段階は誰が変えるか', text: '代理店の報告だけでは商談の段階を自動で変えず、自社の担当者が確認してから変えます。段階は売上の見込みに直接響くためです。' },
  ],
  fitCases: [
    '代理店・販売店を通じた販売があり、訪問の状況が自社に届くのが遅い',
    '代理店からの報告をメールや電話で受け、自社の営業がSalesforceに入力し直している',
    '代理店の担当者全員に、Salesforceのアカウントを用意するほどではない',
  ],
  otherCases: [
    '代理店の数が多く、案件の登録や承認、見込み客の割り振りまで代理店と一緒に管理したい場合は、Salesforceのパートナー向けの仕組み（PRM／Experience Cloud のパートナー向けサイト）を検討する方法もあります',
    '自社の営業担当者自身の訪問記録なら、Salesforceのスマートフォンアプリから直接入力するのが基本です',
  ],
  sources: [
    { label: 'Sales Cloud の料金（ユーザー/月）｜Salesforce', url: 'https://www.salesforce.com/jp/sales/pricing/' },
    { label: 'ToDo オブジェクトと行動オブジェクト｜Salesforce Developers', url: 'https://developer.salesforce.com/docs/atlas.ja-jp.object_reference.meta/object_reference/sforce_api_erd_activities.htm' },
    { label: 'パートナーリレーションシップ管理（PRM）｜Salesforce', url: 'https://www.salesforce.com/jp/sales/partner-relationship-management/' },
    { label: 'Give Integration Users API Only Access｜Salesforce Help', url: 'https://help.salesforce.com/s/articleView?language=en_US&id=platform.integration_user.htm&type=5' },
    { label: 'LIFFアプリとサーバーでユーザー情報を利用する｜LINE Developers', url: 'https://developers.line.biz/ja/docs/liff/using-user-profile/' },
  ],
};
