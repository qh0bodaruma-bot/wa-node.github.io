import fs from 'node:fs';
import path from 'node:path';
import { createClient } from 'microcms-js-sdk';

const args = process.argv.slice(2);
const draftPathArg = args[0];
const shouldCreate = args.includes('--create');
const readOption = (name) => {
  const index = args.indexOf(name);
  return index === -1 ? undefined : args[index + 1];
};
const contentId = readOption('--content-id');
const eyecatchUrl = readOption('--eyecatch-url');

if (!draftPathArg) {
  console.error('Usage: node --env-file=.env scripts/create-blog-draft.mjs <draft.md> [--create]');
  process.exit(1);
}

const draftPath = path.resolve(draftPathArg);
const source = fs.readFileSync(draftPath, 'utf8');

const readSection = (name, nextName) => {
  const start = source.indexOf(`## ${name}`);
  if (start === -1) return '';

  const contentStart = start + `## ${name}`.length;
  const end = nextName ? source.indexOf(`## ${nextName}`, contentStart) : source.length;
  return source.slice(contentStart, end === -1 ? source.length : end).trim();
};

const title = readSection('Title', 'Description');
const content = readSection('Body HTML');

if (!title || !content) {
  console.error('Draft must include non-empty "## Title" and "## Body HTML" sections.');
  process.exit(1);
}

if (!shouldCreate) {
  console.log(JSON.stringify({
    mode: 'dry-run',
    title,
    contentId,
    hasEyecatch: Boolean(eyecatchUrl),
    contentLength: content.length,
    paragraphCount: (content.match(/<p>/g) || []).length,
    headingCount: (content.match(/<h[2-3]>/g) || []).length,
  }, null, 2));
  process.exit(0);
}

if (!process.env.MICROCMS_SERVICE_DOMAIN || !process.env.MICROCMS_API_KEY) {
  console.error('MICROCMS_SERVICE_DOMAIN and MICROCMS_API_KEY are required.');
  process.exit(1);
}

const client = createClient({
  serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN,
  apiKey: process.env.MICROCMS_API_KEY,
});

const result = await client.create({
  endpoint: 'blogs',
  contentId,
  content: {
    title,
    content,
    ...(eyecatchUrl ? { eyecatch: eyecatchUrl } : {}),
  },
});

console.log(JSON.stringify({
  mode: 'created-draft',
  id: result.id,
  title,
}, null, 2));
