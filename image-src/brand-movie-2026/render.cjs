// 紹介動画の書き出し。movie.html を 30fps でコマ撮りし、ffmpeg で MP4 にまとめる。
// 使い方: node render.cjs <playwrightのパス> <出力MP4> [ポスターJPG] [ポスターの時刻(秒)]
// ブラウザはインストール済みの Chrome を使う。ffmpeg は PATH 上のものを使う。
const path = require('path');
const { spawn } = require('child_process');
const { pathToFileURL } = require('url');
const [, , playwrightPath, outMp4, posterJpg, posterAt = '22'] = process.argv;
const { chromium } = require(playwrightPath);
const FPS = 30;

(async () => {
  const browser = await chromium.launch({ channel: 'chrome' });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  await page.goto(pathToFileURL(path.resolve(__dirname, 'movie.html')).href);
  await page.evaluate(() => window.ready);
  const duration = await page.evaluate(() => window.DURATION);
  const ff = spawn('ffmpeg', ['-y', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '20', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-an', outMp4], { stdio: ['pipe', 'inherit', 'inherit'] });
  const frames = Math.round(duration * FPS);
  for (let f = 0; f < frames; f++) {
    await page.evaluate((t) => window.seek(t), f / FPS);
    const buf = await page.screenshot({ type: 'png' });
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r));
  }
  ff.stdin.end();
  await new Promise((r) => ff.on('close', r));
  if (posterJpg) {
    await page.evaluate((t) => window.seek(t), Number(posterAt));
    await page.screenshot({ path: posterJpg, type: 'jpeg', quality: 86 });
  }
  await browser.close();
})();
