// X に接続しない模擬テスト。実行: node --test scripts/lib/x-post-ledger.test.mjs
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { LedgerBlockedError, guardedPublish, readLedger, releaseRecord } from './x-post-ledger.mjs';

const SCRIPT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'x-post.mjs');

function tempLedger() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'x-ledger-'));
  return path.join(dir, 'x_post_ledger.jsonl');
}

function fakeClient({ fail = false } = {}) {
  const calls = [];
  let counter = 1000;
  return {
    calls,
    v2: {
      me: async () => ({ data: { username: 'wa_node_test', name: 'test' } }),
      tweetThread: async (posts) => {
        calls.push(posts);
        if (fail) throw new Error('simulated network error');
        return posts.map(() => ({ data: { id: String((counter += 1)) } }));
      },
    },
  };
}

const day1 = () => new Date('2026-09-14T01:00:00Z'); // JST 2026-09-14 10:00
const day1Late = () => new Date('2026-09-14T14:30:00Z'); // JST 2026-09-14 23:30
const day2 = () => new Date('2026-09-14T15:30:00Z'); // JST 2026-09-15 00:30
const quiet = () => {};

test('records a successful post and blocks a second post on the same JST date', async () => {
  const ledger = tempLedger();
  const client = fakeClient();
  const result = await guardedPublish({ client, posts: ['A'], ledgerPath: ledger, now: day1, log: quiet });
  assert.match(result.url, /^https:\/\/x\.com\/wa_node_test\/status\/\d+$/);
  assert.deepEqual(readLedger(ledger).map((r) => r.status), ['started', 'posted']);

  await assert.rejects(
    guardedPublish({ client, posts: ['B'], ledgerPath: ledger, now: day1Late, log: quiet }),
    (error) => error instanceof LedgerBlockedError && /already recorded for 2026-09-14/.test(error.message),
  );
  assert.equal(client.calls.length, 1, 'second post must not reach X');
});

test('allows different content on the next JST date but blocks identical content forever', async () => {
  const ledger = tempLedger();
  const client = fakeClient();
  await guardedPublish({ client, posts: ['A', 'A2'], ledgerPath: ledger, now: day1, log: quiet });
  await assert.rejects(
    guardedPublish({ client, posts: ['A ', 'A2\r\n'], ledgerPath: ledger, now: day2, log: quiet }),
    /same content/,
  );
  await guardedPublish({ client, posts: ['C'], ledgerPath: ledger, now: day2, log: quiet });
  assert.equal(client.calls.length, 2);
});

test('refuses without a ledger path, with a missing folder, with a corrupt ledger, or while locked', async () => {
  const client = fakeClient();
  await assert.rejects(guardedPublish({ client, posts: ['A'], ledgerPath: undefined, now: day1, log: quiet }), /--ledger is required/);
  await assert.rejects(
    guardedPublish({ client, posts: ['A'], ledgerPath: path.join(os.tmpdir(), 'no-such-dir-xyz', 'l.jsonl'), now: day1, log: quiet }),
    /Ledger folder was not found/,
  );

  const corrupt = tempLedger();
  fs.writeFileSync(corrupt, '{"status":"posted"\n');
  await assert.rejects(guardedPublish({ client, posts: ['A'], ledgerPath: corrupt, now: day1, log: quiet }), /not valid JSON/);

  const locked = tempLedger();
  fs.writeFileSync(`${locked}.lock`, 'held');
  await assert.rejects(guardedPublish({ client, posts: ['A'], ledgerPath: locked, now: day1, log: quiet }), /holds the lock/);
  assert.ok(fs.existsSync(`${locked}.lock`), 'an existing lock must not be removed');
  assert.equal(client.calls.length, 0);
});

test('a failed post blocks retries until released; posted records cannot be released', async () => {
  const ledger = tempLedger();
  await assert.rejects(
    guardedPublish({ client: fakeClient({ fail: true }), posts: ['A'], ledgerPath: ledger, now: day1, log: quiet }),
    /simulated network error/,
  );
  assert.ok(!fs.existsSync(`${ledger}.lock`), 'lock must be released after failure');
  const failed = readLedger(ledger).find((r) => r.status === 'failed');
  assert.ok(failed);

  const client = fakeClient();
  await assert.rejects(guardedPublish({ client, posts: ['A'], ledgerPath: ledger, now: day1, log: quiet }), /same content/);
  assert.throws(() => releaseRecord({ ledgerPath: ledger, id: failed.id }), /--reason is required/);
  releaseRecord({ ledgerPath: ledger, id: failed.id, reason: 'confirmed not published on X' });
  const posted = await guardedPublish({ client, posts: ['A'], ledgerPath: ledger, now: day1, log: quiet });
  assert.throws(() => releaseRecord({ ledgerPath: ledger, id: posted.id, reason: 'x' }), /cannot be released/);
});

test('CLI: post without --ledger fails before contacting X, dry-run reports the ledger check', () => {
  const draft = path.join(path.dirname(tempLedger()), 'draft.txt');
  fs.writeFileSync(draft, 'hello');
  const env = { ...process.env, X_CONSUMER_KEY: '', WA_NODE_X_ENV_FILE: '' };

  const post = spawnSync(process.execPath, [SCRIPT, 'post', '--file', draft], { encoding: 'utf8', env });
  assert.notEqual(post.status, 0);
  assert.match(post.stderr, /--ledger is required for post/);

  const ledger = tempLedger();
  const ok = spawnSync(process.execPath, [SCRIPT, 'dry-run', '--file', draft, '--ledger', ledger], { encoding: 'utf8', env });
  assert.equal(ok.status, 0, ok.stderr);
  assert.match(ok.stdout, /Ledger check: OK/);

  const today = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Tokyo' }).format(new Date());
  fs.writeFileSync(ledger, `${JSON.stringify({ id: 'x1', status: 'posted', jstDate: today, account: 'wa_node', contentSha256: 'other' })}\n`);
  const blocked = spawnSync(process.execPath, [SCRIPT, 'dry-run', '--file', draft, '--ledger', ledger], { encoding: 'utf8', env });
  assert.equal(blocked.status, 1);
  assert.match(blocked.stdout, /Ledger check: BLOCKED/);
});
