// ランサーズのパッケージ用GIFの書き出し。登録先を1つに固定し、「確かめて登録→通知」の場面だけをループにする。
// 使い方: node render-gif.cjs <playwrightのパス> <登録先 0=kintone 1=Salesforce 2=HubSpot 3=スプレッドシート> <出力GIF>
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');
const { pathToFileURL } = require('url');
const [, , playwrightPath, lock, outGif] = process.argv;
const { chromium } = require(playwrightPath);
const FPS = 12, START = 9.7, END = 19.6, HOLD = 1.2, WIDTH = 960;

(async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'wa-gif-'));
  const browser = await chromium.launch({ channel: 'chrome' });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  const url = pathToFileURL(path.resolve(__dirname, 'movie.html'));
  url.searchParams.set('lock', lock);
  await page.goto(url.href);
  await page.evaluate(() => window.ready);
  const frames = Math.round((END - START) * FPS);
  for (let f = 0; f <= frames; f++) {
    await page.evaluate((t) => window.seek(t), START + f / FPS);
    await page.screenshot({ path: path.join(dir, `f${String(f).padStart(4, '0')}.png`) });
  }
  await browser.close();
  // 最後のコマで少し止め、パレットを全コマから作って色の濁りを抑える
  const filter = `tpad=stop_mode=clone:stop_duration=${HOLD},scale=${WIDTH}:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=128:stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=4:diff_mode=rectangle`;
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-framerate', String(FPS), '-i', path.join(dir, 'f%04d.png'), '-filter_complex', filter, '-loop', '0', outGif], { stdio: 'inherit' });
  fs.rmSync(dir, { recursive: true, force: true });
})();
