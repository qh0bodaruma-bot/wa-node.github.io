import { createClient } from "microcms-js-sdk";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

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

console.log("Service Domain:", process.env.MICROCMS_SERVICE_DOMAIN);
console.log("API Key (truncated):", process.env.MICROCMS_API_KEY ? process.env.MICROCMS_API_KEY.substring(0, 5) + "..." : "undefined");

const client = createClient({
  serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN,
  apiKey: process.env.MICROCMS_API_KEY,
});

async function test() {
  try {
    const response = await client.get({
      endpoint: "blogs",
    });
    console.log("Success! Fetched articles count:", response.contents.length);
    response.contents.forEach((post, i) => {
      console.log(`\n[Post ${i + 1}]`);
      console.log("ID:", post.id);
      console.log("Title:", post.title);
      console.log("PublishedAt:", post.publishedAt);
      console.log("CreatedAt:", post.createdAt);
      console.log("UpdatedAt:", post.updatedAt);
      console.log("Has Eyecatch:", !!post.eyecatch);
      console.log("Has Content:", !!post.content);
    });
  } catch (error) {
    console.error("MicroCMS Fetch Failed:", error);
  }
}

test();
