import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { TwitterApi } from 'twitter-api-v2';
import {
  contentHash,
  findBlockingReason,
  guardedPublish,
  jstDate,
  readLedger,
  recordExternalPost,
  releaseRecord,
} from './lib/x-post-ledger.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
const REQUIRED_ENV = [
  'X_CONSUMER_KEY',
  'X_CONSUMER_SECRET',
  'X_ACCESS_TOKEN',
  'X_ACCESS_TOKEN_SECRET',
];
const MAX_POSTS_PER_THREAD = 20;
const MAX_POST_LENGTH = 25_000;

function usage() {
  console.log(`
Usage:
  node scripts/x-post.mjs verify [--env-file <path>]
  node scripts/x-post.mjs test [--env-file <path>]
  node scripts/x-post.mjs dry-run --file <approved-draft.txt> [--ledger <x_post_ledger.jsonl>] [--env-file <path>]
  node scripts/x-post.mjs post --file <approved-draft.txt> --ledger <x_post_ledger.jsonl> [--env-file <path>]
  node scripts/x-post.mjs record --file <approved-draft.txt> --ledger <x_post_ledger.jsonl> --url <post-url> [--date <YYYY-MM-DD>] [--account <name>]
  node scripts/x-post.mjs release --ledger <x_post_ledger.jsonl> --id <record-id> --reason <text>

Draft format:
  Separate posts with a line containing only ---

Safety:
  - verify only checks the X account connection.
  - test creates one clearly labelled test post, then deletes it immediately.
  - dry-run never contacts X. With --ledger it also reports whether the ledger would block the post.
  - post publishes only the explicitly supplied, approved draft file, and refuses to run without --ledger.
    It blocks a second post on the same JST date for the same account, content already recorded,
    and concurrent runs. The record is written before contacting X.
  - record never contacts X. Use it when a draft was published outside this script (for example by hand)
    so the ledger keeps blocking the same content later. --date defaults to today in JST.
  - release never contacts X. Use it only after confirming on X that a started/failed record was not published.
`);
}

function parseArgs(args) {
  const [command, ...rest] = args;
  const options = {
    command,
    file: undefined,
    envFile: undefined,
    ledger: undefined,
    id: undefined,
    reason: undefined,
    url: undefined,
    date: undefined,
    account: undefined,
  };
  const valueOptions = {
    '--file': 'file',
    '--env-file': 'envFile',
    '--ledger': 'ledger',
    '--id': 'id',
    '--reason': 'reason',
    '--url': 'url',
    '--date': 'date',
    '--account': 'account',
  };

  for (let index = 0; index < rest.length; index += 1) {
    const argument = rest[index];
    if (argument in valueOptions) {
      options[valueOptions[argument]] = rest[index + 1];
      index += 1;
    } else {
      throw new Error(`Unknown argument: ${argument}`);
    }
  }

  return options;
}

function loadEnvFile(envFile) {
  if (!fs.existsSync(envFile)) {
    throw new Error(`Environment file was not found: ${envFile}`);
  }

  for (const rawLine of fs.readFileSync(envFile, 'utf8').split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;

    const separator = line.indexOf('=');
    if (separator === -1) continue;

    const key = line.slice(0, separator).trim();
    let value = line.slice(separator + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}

function loadConfiguredEnv(explicitPath) {
  if (explicitPath) {
    loadEnvFile(path.resolve(explicitPath));
    return;
  }

  if (process.env.WA_NODE_X_ENV_FILE) {
    loadEnvFile(path.resolve(process.env.WA_NODE_X_ENV_FILE));
    return;
  }

  // GitHub Actions supplies secrets as process environment variables, so a local
  // .env file is optional there. Locally, use it when present for convenience.
  const localEnvPath = path.join(REPO_ROOT, '.env');
  if (fs.existsSync(localEnvPath)) loadEnvFile(localEnvPath);
}

function createClient() {
  const missing = REQUIRED_ENV.filter((name) => !process.env[name]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  return new TwitterApi({
    appKey: process.env.X_CONSUMER_KEY,
    appSecret: process.env.X_CONSUMER_SECRET,
    accessToken: process.env.X_ACCESS_TOKEN,
    accessSecret: process.env.X_ACCESS_TOKEN_SECRET,
  });
}

function readThread(draftPath) {
  if (!draftPath) throw new Error('--file is required for dry-run and post.');

  const absolutePath = path.resolve(draftPath);
  if (!fs.existsSync(absolutePath)) {
    throw new Error(`Draft file was not found: ${absolutePath}`);
  }

  const posts = fs
    .readFileSync(absolutePath, 'utf8')
    .split(/^---\s*$/m)
    .map((post) => post.trim())
    .filter(Boolean);

  if (posts.length === 0) throw new Error('The draft does not contain any posts.');
  if (posts.length > MAX_POSTS_PER_THREAD) {
    throw new Error(`A thread may contain at most ${MAX_POSTS_PER_THREAD} posts.`);
  }

  posts.forEach((post, index) => {
    if (post.length > MAX_POST_LENGTH) {
      throw new Error(`Post ${index + 1} is ${post.length} characters; maximum is ${MAX_POST_LENGTH}.`);
    }
  });

  return posts;
}

async function verify(client) {
  const me = await client.v2.me({ 'user.fields': ['username', 'name'] });
  const { username, name } = me.data;
  console.log(`X API connection verified for ${name ?? username} (@${username}).`);
  return me.data;
}

async function runConnectionTest(client) {
  const user = await verify(client);
  const created = await client.v2.tweet(
    `Wa-Node X API connection test. This post will be deleted automatically. (${new Date().toISOString()})`,
  );
  const postId = created.data.id;

  try {
    const deletion = await client.v2.deleteTweet(postId);
    if (!deletion.data.deleted) throw new Error('X accepted the deletion request but did not confirm deletion.');
    console.log(`Posting and deletion test passed for @${user.username}. Test post ID: ${postId}`);
  } catch (error) {
    console.error(`Test post was created but could not be deleted. URL: https://x.com/${user.username}/status/${postId}`);
    throw error;
  }
}

async function main() {
  let options;
  try {
    options = parseArgs(process.argv.slice(2));
  } catch (error) {
    console.error(error.message);
    usage();
    process.exitCode = 1;
    return;
  }

  if (!['verify', 'test', 'dry-run', 'post', 'record', 'release'].includes(options.command)) {
    usage();
    process.exitCode = 1;
    return;
  }

  try {
    if (options.command === 'dry-run') {
      const posts = readThread(options.file);
      console.log(`Dry run passed. ${posts.length} post(s) are ready for review.`);
      posts.forEach((post, index) => console.log(`\n--- Post ${index + 1} (${post.length} chars) ---\n${post}`));
      if (options.ledger) {
        // dry-run は X に接続しないため、アカウントを問わず同日の記録で判定する
        const reason = findBlockingReason(readLedger(options.ledger), {
          account: undefined,
          date: jstDate(),
          hash: contentHash(posts),
        });
        console.log(reason ? `\nLedger check: BLOCKED. ${reason}` : '\nLedger check: OK (no post recorded today, content not posted before).');
        if (reason) process.exitCode = 1;
      }
      return;
    }

    if (options.command === 'record') {
      if (!options.ledger) throw new Error('--ledger is required for record.');
      const recorded = recordExternalPost({
        ledgerPath: options.ledger,
        posts: readThread(options.file),
        draftFile: options.file,
        url: options.url,
        date: options.date,
        account: options.account,
      });
      console.log(
        `Recorded an already published post: ${recorded.id} (${recorded.jstDate} JST, @${recorded.account}, ${recorded.postCount} post(s)).`,
      );
      console.log(`Ledger: ${path.resolve(options.ledger)}`);
      console.log('X was not contacted. The record relies on the URL you supplied.');
      return;
    }

    if (options.command === 'release') {
      const released = releaseRecord({ ledgerPath: options.ledger, id: options.id, reason: options.reason });
      console.log(`Released ledger record ${released.id} (${released.status}, ${released.jstDate}).`);
      return;
    }

    if (options.command === 'post' && !options.ledger) {
      throw new Error('--ledger is required for post. Posting without the ledger is not allowed.');
    }

    loadConfiguredEnv(options.envFile);
    const client = createClient();

    if (options.command === 'verify') {
      await verify(client);
      return;
    }

    if (options.command === 'test') {
      await runConnectionTest(client);
      return;
    }

    await guardedPublish({
      client,
      posts: readThread(options.file),
      ledgerPath: options.ledger,
      draftFile: options.file,
    });
  } catch (error) {
    console.error(`X post operation failed: ${error.message}`);
    process.exitCode = 1;
  }
}

main();
