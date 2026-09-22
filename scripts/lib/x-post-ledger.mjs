// X 投稿台帳による重複投稿ガード。
// 投稿前に台帳（JSON Lines）を確認し、同じアカウントの同日2本目・過去と同一内容・同時実行を拒否する。
// 判定できない状態（台帳の破損、残ったロックなど）では投稿しない側に倒す。
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const LOCK_SUFFIX = '.lock';
// 日本語を含むパスでは Node のファイル削除がプロセスごと落ちるため（TRB-202609-054）、
// ロックは削除ではなく中身の書き換えで解放する。解放前に落ちた場合に備えて有効期限も持つ。
const LOCK_RELEASED = 'released';
const LOCK_STALE_MS = 10 * 60 * 1000;
// 投稿前に書く started と、結果が確定しなかった failed は、解除記録（released）があるまで投稿済みとみなす。
const BLOCKING_STATUSES = new Set(['started', 'posted', 'failed']);

export class LedgerBlockedError extends Error {
  constructor(message) {
    super(message);
    this.name = 'LedgerBlockedError';
  }
}

export function jstDate(date = new Date()) {
  return new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

export function contentHash(posts) {
  const normalized = posts.map((post) => post.replace(/\r\n/g, '\n').trim()).join('\n---\n');
  return crypto.createHash('sha256').update(normalized, 'utf8').digest('hex');
}

export function readLedger(ledgerPath) {
  if (!ledgerPath) throw new LedgerBlockedError('--ledger is required for post.');
  const absolute = path.resolve(ledgerPath);
  if (!fs.existsSync(path.dirname(absolute))) {
    throw new LedgerBlockedError(`Ledger folder was not found: ${path.dirname(absolute)}`);
  }
  if (!fs.existsSync(absolute)) return [];

  return fs
    .readFileSync(absolute, 'utf8')
    .split(/\r?\n/)
    .filter((line) => line.trim())
    .map((line, index) => {
      try {
        return JSON.parse(line);
      } catch {
        throw new LedgerBlockedError(`Ledger line ${index + 1} is not valid JSON. Posting is blocked until it is fixed.`);
      }
    });
}

function activeRecords(records) {
  const released = new Set(records.filter((record) => record.status === 'released').map((record) => record.releases));
  // 同じ id の最新状態だけを見る
  const latest = new Map();
  for (const record of records) {
    if (record.status === 'released') continue;
    latest.set(record.id, record);
  }
  return [...latest.values()].filter((record) => BLOCKING_STATUSES.has(record.status) && !released.has(record.id));
}

export function findBlockingReason(records, { account, date, hash }) {
  const active = activeRecords(records);
  const sameContent = active.find((record) => record.contentSha256 === hash);
  if (sameContent) {
    return `The same content is already recorded (${sameContent.status}, ${sameContent.jstDate}, id ${sameContent.id}${sameContent.url ? `, ${sameContent.url}` : ''}).`;
  }
  const sameDay = active.find(
    (record) => record.jstDate === date && (account === undefined || record.account === account),
  );
  if (sameDay) {
    return `A post is already recorded for ${date} JST (${sameDay.status}, @${sameDay.account}, id ${sameDay.id}${sameDay.url ? `, ${sameDay.url}` : ''}).`;
  }
  return null;
}

export function appendRecord(ledgerPath, record) {
  fs.appendFileSync(path.resolve(ledgerPath), `${JSON.stringify(record)}\n`, 'utf8');
}

export function acquireLock(ledgerPath, now = () => new Date()) {
  const lockPath = `${path.resolve(ledgerPath)}${LOCK_SUFFIX}`;
  const stamp = () => `${process.pid} ${now().toISOString()}\n`;

  try {
    const handle = fs.openSync(lockPath, 'wx');
    fs.writeSync(handle, stamp());
    fs.closeSync(handle);
  } catch (error) {
    if (error.code !== 'EEXIST') throw error;

    const raw = fs.readFileSync(lockPath, 'utf8').trim();
    const released = raw === '' || raw.startsWith(LOCK_RELEASED);
    const heldSince = Date.parse(raw.split(/\s+/)[1] ?? '');
    // 解放前に落ちたロックを残し続けない。10分を超えたものは引き継ぐ。
    const stale = Number.isFinite(heldSince) && now().getTime() - heldSince > LOCK_STALE_MS;

    if (!released && !stale) {
      throw new LedgerBlockedError(
        `Another post operation holds the lock (${lockPath}, "${raw}"). If no post is running, confirm on X first, then write "${LOCK_RELEASED}" into that file.`,
      );
    }
    fs.writeFileSync(lockPath, stamp(), 'utf8');
  }

  // ロックの解放はファイル削除ではなく上書きで行う（TRB-202609-054）。
  return () => {
    try {
      fs.writeFileSync(lockPath, `${LOCK_RELEASED} ${now().toISOString()}\n`, 'utf8');
    } catch {
      // 解放に失敗しても処理は止めない。次回は stale として引き継がれる。
    }
  };
}

function newId(now) {
  return `${now.toISOString().replace(/[-:.TZ]/g, '').slice(0, 14)}-${crypto.randomBytes(3).toString('hex')}`;
}

// 台帳を確認してから投稿する。client は twitter-api-v2 の TwitterApi 相当（v2.me, v2.tweetThread）。
export async function guardedPublish({ client, posts, ledgerPath, draftFile, now = () => new Date(), log = console.log }) {
  // 台帳の指定と保存先フォルダを、ロック取得より先に検査する
  readLedger(ledgerPath);
  const release = acquireLock(ledgerPath);
  try {
    const me = await client.v2.me({ 'user.fields': ['username', 'name'] });
    const account = me.data.username;
    const startedAt = now();
    const date = jstDate(startedAt);
    const hash = contentHash(posts);
    const records = readLedger(ledgerPath);
    const reason = findBlockingReason(records, { account, date, hash });
    if (reason) throw new LedgerBlockedError(`Post blocked by ledger: ${reason}`);

    const base = {
      id: newId(startedAt),
      jstDate: date,
      account,
      source: 'x-post.mjs',
      draftFile: draftFile ? path.resolve(draftFile) : undefined,
      contentSha256: hash,
      postCount: posts.length,
    };
    // X に送る前に記録する。途中で止まっても、解除するまで同日・同一内容の再投稿を止めるため。
    appendRecord(ledgerPath, { ...base, status: 'started', recordedAt: startedAt.toISOString() });

    let published;
    try {
      published = await client.v2.tweetThread(posts);
    } catch (error) {
      appendRecord(ledgerPath, {
        ...base,
        status: 'failed',
        recordedAt: now().toISOString(),
        error: error.message,
        note: 'Some posts may have been published. Check X before releasing this record.',
      });
      throw error;
    }

    const postIds = published.map((item) => item?.data?.id).filter(Boolean);
    const url = postIds[0] ? `https://x.com/${account}/status/${postIds[0]}` : undefined;
    appendRecord(ledgerPath, { ...base, status: 'posted', recordedAt: now().toISOString(), url, postIds });
    if (!url) throw new Error('X did not return an ID for the first post. The ledger records it as posted; check X.');
    log(`Published ${published.length} post(s): ${url}`);
    log(`Ledger: recorded ${base.id} (${date} JST) in ${path.resolve(ledgerPath)}`);
    return { id: base.id, url, postIds, date };
  } finally {
    release();
  }
}

// X 以外の経路（ボスの手動投稿など）で公開済みの投稿を、台帳へ後から記録する。X には接続しない。
// 下書きファイルの内容から contentSha256 を作るため、以後は同じ内容の再投稿を post 側が拒否できる。
export function recordExternalPost({ ledgerPath, posts, draftFile, url, date, account, now = () => new Date() }) {
  if (!url) throw new LedgerBlockedError('--url is required for record. Give the URL of the post that is already published.');
  const parsed = parsePostUrl(url);
  const recordedAccount = account ?? parsed.account;
  if (!recordedAccount) {
    throw new LedgerBlockedError('The account could not be read from --url. Pass --account explicitly.');
  }

  const recordedAt = now();
  const recordDate = date ?? jstDate(recordedAt);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(recordDate)) {
    throw new LedgerBlockedError(`--date must be written as YYYY-MM-DD (JST). Received: ${recordDate}`);
  }
  if (recordDate > jstDate(recordedAt)) {
    throw new LedgerBlockedError(`--date ${recordDate} is in the future (JST today is ${jstDate(recordedAt)}).`);
  }

  readLedger(ledgerPath);
  const release = acquireLock(ledgerPath);
  try {
    const hash = contentHash(posts);
    const records = readLedger(ledgerPath);
    const reason = findBlockingReason(records, { account: recordedAccount, date: recordDate, hash });
    // すでに同じ内容・同じ日の記録があるなら、二重に記録しない。
    if (reason) throw new LedgerBlockedError(`Record blocked by ledger: ${reason}`);

    const record = {
      id: newId(recordedAt),
      status: 'posted',
      jstDate: recordDate,
      account: recordedAccount,
      source: 'manual-external',
      draftFile: draftFile ? path.resolve(draftFile) : undefined,
      contentSha256: hash,
      postCount: posts.length,
      recordedAt: recordedAt.toISOString(),
      url,
      postIds: [parsed.postId],
      note: 'Published outside x-post.mjs and recorded afterwards. Not verified against X.',
    };
    appendRecord(ledgerPath, record);
    return record;
  } finally {
    release();
  }
}

function parsePostUrl(url) {
  const match = /^https:\/\/(?:x|twitter)\.com\/([A-Za-z0-9_]{1,15})\/status\/(\d+)(?:[/?#].*)?$/.exec(url.trim());
  if (!match) {
    throw new LedgerBlockedError(`--url must look like https://x.com/<account>/status/<id>. Received: ${url}`);
  }
  return { account: match[1], postId: match[2] };
}

// 投稿されていないことを X 上で確認した started / failed 記録を解除する。posted は解除できない。
export function releaseRecord({ ledgerPath, id, reason, now = () => new Date() }) {
  if (!id) throw new LedgerBlockedError('--id is required for release.');
  if (!reason) throw new LedgerBlockedError('--reason is required for release.');
  const records = readLedger(ledgerPath);
  const target = activeRecords(records).find((record) => record.id === id);
  if (!target) throw new LedgerBlockedError(`No active record with id ${id} was found.`);
  if (target.status === 'posted') throw new LedgerBlockedError('A posted record cannot be released.');
  appendRecord(ledgerPath, { status: 'released', releases: id, reason, recordedAt: now().toISOString() });
  return target;
}
