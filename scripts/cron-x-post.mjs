import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { TwitterApi } from 'twitter-api-v2';

// 1. 環境変数の設定 (ローカル実行時は.envを読み込む)
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, '../.env');

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || '';
      if (value.length > 0 && value.charAt(0) === '"' && value.charAt(value.length - 1) === '"') {
        value = value.substring(1, value.length - 1);
      }
      if (!process.env[key]) {
        process.env[key] = value.trim();
      }
    }
  });
}

// 必須の環境変数の存在確認
const requiredEnv = [
  'X_CONSUMER_KEY',
  'X_CONSUMER_SECRET',
  'X_ACCESS_TOKEN',
  'X_ACCESS_TOKEN_SECRET',
  'GEMINI_API_KEY'
];

requiredEnv.forEach(envName => {
  if (!process.env[envName]) {
    console.error(`Error: Missing required environment variable: ${envName}`);
    process.exit(1);
  }
});

// 2. Gemini APIを使ってX用ツリーコンテンツを生成する
async function generatePostThread() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  // 高品質で高速なモデルを選定
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
あなたはプロの行動心理学者およびB2Bマーケティングコンサルタントです。
ビジネスパーソンや個人事業主に役立つ、日常や実務で使える「実用心理学コラム」を、X（旧Twitter）で深く刺さり拡散される「4つのポストからなるツリー（スレッド）形式」で日本語で作成してください。

【制約事項】
1. 全部で4つのポスト（スレッド）に分割し、それぞれ独立した文章にしてください。
2. 日本語のXの文字数制限（全角140文字以内、絵文字は2文字カウントなど）を絶対に厳守してください。各ポストは改行を含めて120文字〜135文字程度に収めるのが理想的です。
3. 出力フォーマットは、余計な説明文やマークダウンの装飾（「はい、以下が作成したポストです」など）は一切含めず、各ポストのテキストのみを [TWEET_BREAK] という区切り文字だけで区切って出力してください。
   例：
   [TWEET_BREAK]
   (1つ目のツイート内容。強いフックと煽り、ツリーへの誘導)
   [TWEET_BREAK]
   (2つ目のツイート内容。心理効果の名称と脳のバグのメカニズム解説)
   [TWEET_BREAK]
   (3つ目のツイート内容。ビジネスや日常での具体的な実践例)
   [TWEET_BREAK]
   (4つ目のツイート内容。「こんなことも知りたいなどあったら教えて」とコメントへ誘導)

【各ポストの構成ガイドライン】
- 第1ポスト（強烈なフックと煽り）：
  読者がスクロールする手を止め、「続き（スレッドの先）」を読みたくなるように設計してください。「一度使うと、相手の心理を操れてしまう…」などの注意喚起、強いフック、情報ギャップ、または常識を覆す問いかけから始め、最後に「（ツリーへ）👇」や「詳細はリプ欄へ👇」などの誘導を入れてください。
- 第2ポスト（心理効果の正体・理由）：
  紹介する心理効果の正式名称と、なぜその心理が働くのか（人間心理の防衛本能やバグ）をロジカルに解説してください。
- 第3ポスト（行動・実務への落とし込み）：
  「じゃあ明日からどう使えばいいのか？」を、ビジネス（交渉、営業、Webデザイン、チームビルディング、顧客対応など）の具体例とともに分かりやすく提示してください。
- 第4ポスト（コメントへの誘導・アクション）：
  「この心理効果、どう思いますか？」「こういう場面で悩んだことはある？」「こんなことも知りたいなどあったらコメントで気軽に教えてね！」など、読者がコメント欄に何か書き込みたくなる問いかけで締めくくってください。

【テーマ候補】
以下のいずれかのテーマ、またはこれらに匹敵する非常に魅力的な実用心理学テーマを選定して作成してください。
- 認知的不協和の解消（フランクリン効果）
- 返報性の原理（譲歩的要請：ドア・イン・ザ・フェイス）
- 希少性の原理
- ハロー効果
- バンドワゴン効果
- プロスペクト理論（損失回避バイアス）
- ザイオンス効果（単純接触効果）
- カリギュラ効果（禁止されるとやりたくなる）

それでは、作成を開始してください。
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  
  // [TWEET_BREAK] で分割してトリミング
  const tweets = text
    .split('[TWEET_BREAK]')
    .map(t => t.trim())
    .filter(t => t.length > 0);

  if (tweets.length !== 4) {
    throw new Error(`Gemini generated an incorrect number of tweets: ${tweets.length} (expected 4)`);
  }

  // 文字数チェック (全角140文字以内)
  tweets.forEach((tweet, index) => {
    if (tweet.length > 140) {
      throw new Error(`Tweet ${index + 1} exceeds 140 characters: ${tweet.length} chars. Content: ${tweet}`);
    }
  });

  return tweets;
}

// 3. メイン処理：生成とXへの投稿
async function main() {
  try {
    console.log("Generating tweet thread via Gemini...");
    let thread;
    
    // 最大3回リトライ（文字数制限エラー対策）
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        thread = await generatePostThread();
        break;
      } catch (e) {
        console.warn(`Attempt ${attempt} failed: ${e.message}`);
        if (attempt === 3) throw e;
        console.log("Retrying generation...");
      }
    }

    console.log("Generated Thread successfully:");
    thread.forEach((t, i) => console.log(`[Tweet ${i + 1} (${t.length} chars)]\n${t}\n`));

    // DRY_RUNモードの場合はXへの投稿をスキップ
    if (process.env.DRY_RUN === 'true') {
      console.log("DRY RUN MODE is enabled. Skipping actual posting to X.");
      return;
    }

    console.log("Connecting to X API...");
    const client = new TwitterApi({
      appKey: process.env.X_CONSUMER_KEY,
      appSecret: process.env.X_CONSUMER_SECRET,
      accessToken: process.env.X_ACCESS_TOKEN,
      accessSecret: process.env.X_ACCESS_TOKEN_SECRET,
    });

    console.log("Posting thread to X...");
    const result = await client.v2.tweetThread(thread);
    console.log("Successfully posted thread to X!", result);

  } catch (error) {
    console.error("Execution failed:", error);
    process.exit(1);
  }
}

main();
