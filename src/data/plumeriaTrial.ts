// プルメリア管理画面 お試し版（Supabase・責任者2名・期間限定）の設定。
// お試し専用。本番は Cloudflare Workers＋D1（E:\dev\plumeria-admin）で作る方針（2026-11-14 ボス判断・案A）。
// 片付けるときは、この設定・src/lib/plumeriaTrial.ts・src/pages/lab/plumeria/trial/・
// src/layouts/PlumeriaTrialLayout.astro・src/components/plumeria/PlumeriaTrialPublic.astro を削除する。
import { PLUMERIA_BASE } from './plumeria';

// false にすると、公開側のお試し表示が消える（管理画面のお試し版ページ自体は残る）。
export const PLUMERIA_TRIAL_ENABLED = true;

// ブラウザに出してよい公開情報だけを置く（publishable キーは公開前提の値）。
// secret / service_role のキーは絶対にここへ書かない。
export const TRIAL_SUPABASE_URL = 'https://zjitnpliogobzmpthgsb.supabase.co';
export const TRIAL_SUPABASE_KEY = 'sb_publishable_wjDauOrN7fPlryom3srXNQ_ysbomSez';

export const trialBase = `${PLUMERIA_BASE}/trial/`;
export const trialRoutes = {
  home: trialBase,
  login: `${trialBase}login/`,
  vacancy: `${trialBase}vacancy/`,
  post: `${trialBase}post/`,
  approve: `${trialBase}approve/`,
};

export const vacancyStates = ['空きあり', '残りわずか', '満室'] as const;
export const postCategories = ['お知らせ', '事業課からの通知', '採用情報', 'コンプライアンス掲示'] as const;
export const postTargets = ['プルメリアⅠ', 'プルメリアⅡ', 'プルメリアⅢ', '訪問看護', '訪問介護・居宅介護支援', '福祉用具貸与'] as const;
