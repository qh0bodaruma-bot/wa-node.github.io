// プルメリア管理画面 お試し版のブラウザ側の処理。
// 依存を増やさないため、Supabase の Auth（GoTrue）と REST（PostgREST）を fetch で直接呼ぶ。
// 権限の判定はすべてデータベース側（supabase/plumeria-trial/001_schema.sql）で行い、ここでは表示の出し分けだけをする。
import { TRIAL_SUPABASE_URL as URL_BASE, TRIAL_SUPABASE_KEY as KEY, trialRoutes } from '../data/plumeriaTrial';

const SESSION_KEY = 'pl-trial-session';

export interface Session {
  access_token: string;
  refresh_token: string;
  expires_at: number; // 秒
  user: { id: string; email?: string };
}

export interface Profile { id: string; display_name: string; role: 'writer' | 'approver' }

export class AuthError extends Error {}
export class ApiError extends Error {
  constructor(message: string, public status: number) { super(message); }
}

// ---------- セッション（保存できないブラウザでも画面が壊れないよう try/catch で包む） ----------
let memorySession: Session | null = null;

export function loadSession(): Session | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (raw) return JSON.parse(raw) as Session;
  } catch { /* 保存領域が使えない */ }
  return memorySession;
}

function saveSession(s: Session | null) {
  memorySession = s;
  try {
    if (s) localStorage.setItem(SESSION_KEY, JSON.stringify(s));
    else localStorage.removeItem(SESSION_KEY);
  } catch { /* 保存領域が使えない場合はこのページの間だけ保持 */ }
}

function toSession(j: any): Session {
  return {
    access_token: j.access_token,
    refresh_token: j.refresh_token,
    expires_at: j.expires_at ?? Math.floor(Date.now() / 1000) + (j.expires_in ?? 3600),
    user: { id: j.user?.id, email: j.user?.email },
  };
}

async function tokenRequest(grant: 'password' | 'refresh_token', body: Record<string, string>) {
  const res = await fetch(`${URL_BASE}/auth/v1/token?grant_type=${grant}`, {
    method: 'POST',
    headers: { apikey: KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const j = await res.json().catch(() => ({}));
  if (!res.ok) throw new AuthError(j.error_description || j.msg || j.message || 'ログインできませんでした');
  return toSession(j);
}

export async function signIn(email: string, password: string) {
  try {
    const s = await tokenRequest('password', { email, password });
    saveSession(s);
    return s;
  } catch (e) {
    throw new AuthError('メールアドレスかパスワードが違います。');
  }
}

export async function signOut() {
  const s = loadSession();
  saveSession(null);
  if (!s) return;
  try {
    await fetch(`${URL_BASE}/auth/v1/logout`, {
      method: 'POST',
      headers: { apikey: KEY, Authorization: `Bearer ${s.access_token}` },
    });
  } catch { /* 手元のセッションは消したので、通信の失敗は無視する */ }
}

let refreshing: Promise<Session> | null = null;
async function refresh(s: Session): Promise<Session> {
  if (!refreshing) {
    refreshing = tokenRequest('refresh_token', { refresh_token: s.refresh_token })
      .then((n) => { saveSession(n); return n; })
      .catch((e) => { saveSession(null); throw new AuthError('ログインの有効期限が切れました。'); })
      .finally(() => { refreshing = null; });
  }
  return refreshing;
}

async function freshSession(): Promise<Session> {
  const s = loadSession();
  if (!s) throw new AuthError('ログインしてください。');
  if (s.expires_at * 1000 - Date.now() < 60_000) return refresh(s);
  return s;
}

// ---------- REST ----------
interface ApiOptions { method?: string; body?: unknown; prefer?: string; anon?: boolean }

export async function api<T = any>(path: string, opts: ApiOptions = {}): Promise<T> {
  const call = async (token: string | null) => {
    const headers: Record<string, string> = { apikey: KEY };
    if (token) headers.Authorization = `Bearer ${token}`;
    if (opts.body !== undefined) headers['Content-Type'] = 'application/json';
    if (opts.prefer) headers.Prefer = opts.prefer;
    return fetch(`${URL_BASE}/rest/v1/${path}`, {
      method: opts.method ?? 'GET',
      headers,
      body: opts.body === undefined ? undefined : JSON.stringify(opts.body),
    });
  };

  let res: Response;
  if (opts.anon) {
    res = await call(null);
  } else {
    let s = await freshSession();
    res = await call(s.access_token);
    if (res.status === 401) {
      s = await refresh(s);
      res = await call(s.access_token);
      if (res.status === 401) { saveSession(null); throw new AuthError('ログインの有効期限が切れました。'); }
    }
  }
  if (res.status === 204) return undefined as T;
  const text = await res.text();
  const j = text ? JSON.parse(text) : undefined;
  if (!res.ok) throw new ApiError(friendlyError(j), res.status);
  return j as T;
}

function friendlyError(j: any): string {
  const msg: string = j?.message ?? '';
  // データベースのトリガーが返す日本語のメッセージはそのまま見せる
  if (/[ぁ-んァ-ン一-龥]/.test(msg)) return msg;
  if (j?.code === '42501') return 'この操作をする権限がありません。';
  if (j?.code === '23514') return '入力内容を確認してください（文字数や必須の項目）。';
  return '保存できませんでした。時間をおいてもう一度お試しください。';
}

// ---------- 画面の共通処理 ----------
export function goLogin() {
  const next = location.pathname + location.search;
  location.href = `${trialRoutes.login}?next=${encodeURIComponent(next)}`;
}

let profileCache: { uid: string; p: Profile | null } | null = null;
export async function currentProfile(): Promise<Profile | null> {
  const s = loadSession();
  if (!s) return null;
  if (profileCache && profileCache.uid === s.user.id) return profileCache.p;
  const rows = await api<Profile[]>(`profiles?select=id,display_name,role&id=eq.${s.user.id}`);
  const p = rows[0] ?? null;
  profileCache = { uid: s.user.id, p };
  return p;
}

// 画面上部のお知らせ欄（保存した・失敗した）
export function showMsg(text: string, error = false) {
  const el = document.querySelector<HTMLElement>('[data-trial-msg]');
  if (!el) { if (error) alert(text); return; }
  el.textContent = text;
  el.classList.toggle('is-error', error);
  el.hidden = false;
}

// 認証エラーならログイン画面へ。それ以外は画面にメッセージを出す
export function handleError(e: unknown, show?: (m: string) => void) {
  if (e instanceof AuthError) { goLogin(); return; }
  const m = e instanceof ApiError ? e.message : '通信できませんでした。電波の状態を確認して、もう一度お試しください。';
  if (show) show(m); else alert(m);
}

// ---------- 日付（日本時間） ----------
const dtFmt = new Intl.DateTimeFormat('ja-JP', { timeZone: 'Asia/Tokyo', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' });
const dFmt = new Intl.DateTimeFormat('ja-JP', { timeZone: 'Asia/Tokyo', year: 'numeric', month: 'numeric', day: 'numeric' });
export const fmtDateTime = (iso?: string | null) => (iso ? dtFmt.format(new Date(iso)) : '—');
export const fmtDate = (ymd?: string | null) => (ymd ? dFmt.format(new Date(`${ymd}T00:00:00+09:00`)) : '—');
export function todayJst(): string {
  const p = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Tokyo', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
  return p; // YYYY-MM-DD
}

// ---------- DOM（文字は必ず textContent で入れる） ----------
type Child = Node | string | null | undefined | false;
export function h(tag: string, attrs: Record<string, any> = {}, ...children: Child[]): HTMLElement {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v === undefined || v === null || v === false) continue;
    if (k === 'class') el.className = v;
    else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2), v);
    else el.setAttribute(k, v === true ? '' : String(v));
  }
  for (const c of children) {
    if (c === null || c === undefined || c === false) continue;
    el.append(typeof c === 'string' ? document.createTextNode(c) : c);
  }
  return el;
}

export const statusLabel: Record<string, { t: string; badge: string }> = {
  draft: { t: '下書き', badge: 'off' },
  pending: { t: '確認まち', badge: 'wait' },
  published: { t: '公開中', badge: 'live' },
  returned: { t: '差し戻し', badge: 'warn' },
  hidden: { t: '非公開', badge: 'off' },
};

// ---------- 空室 ----------
export interface Vacancy { facility: string; name: string; sub: string; sort: number; state: string; updated_at: string; updater?: { display_name: string } | null }

export async function loadVacancies(anon = false): Promise<Vacancy[]> {
  const sel = anon ? 'facility,name,sub,sort,state,updated_at' : 'facility,name,sub,sort,state,updated_at,updater:profiles(display_name)';
  return api<Vacancy[]>(`vacancies?select=${sel}&order=sort`, { anon });
}

export async function setVacancy(facility: string, state: string) {
  await api(`vacancies?facility=eq.${encodeURIComponent(facility)}`, { method: 'PATCH', body: { state }, prefer: 'return=minimal' });
}
