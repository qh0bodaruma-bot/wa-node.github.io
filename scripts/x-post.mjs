import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { TwitterApi } from 'twitter-api-v2';

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
  node scripts/x-post.mjs dry-run --file <approved-draft.txt> [--env-file <path>]
  node scripts/x-post.mjs post --file <approved-draft.txt> [--env-file <path>]

Draft format:
  Separate posts with a line containing only ---

Safety:
  - verify only checks the X account connection.
  - test creates one clearly labelled test post, then deletes it immediately.
  - dry-run never contacts X.
  - post publishes only the explicitly supplied, approved draft file.
`);
}

function parseArgs(args) {
  const [command, ...rest] = args;
  const options = { command, file: undefined, envFile: undefined };

  for (let index = 0; index < rest.length; index += 1) {
    const argument = rest[index];
    if (argument === '--file') {
      options.file = rest[index + 1];
      index += 1;
    } else if (argument === '--env-file') {
      options.envFile = rest[index + 1];
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

async function publishThread(client, posts) {
  const user = await verify(client);
  const published = await client.v2.tweetThread(posts);
  const firstPostId = published[0]?.data?.id;

  if (!firstPostId) throw new Error('X did not return an ID for the first post.');
  console.log(`Published ${published.length} post(s): https://x.com/${user.username}/status/${firstPostId}`);
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

  if (!['verify', 'test', 'dry-run', 'post'].includes(options.command)) {
    usage();
    process.exitCode = 1;
    return;
  }

  try {
    if (options.command === 'dry-run') {
      const posts = readThread(options.file);
      console.log(`Dry run passed. ${posts.length} post(s) are ready for review.`);
      posts.forEach((post, index) => console.log(`\n--- Post ${index + 1} (${post.length} chars) ---\n${post}`));
      return;
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

    await publishThread(client, readThread(options.file));
  } catch (error) {
    console.error(`X post operation failed: ${error.message}`);
    process.exitCode = 1;
  }
}

main();
