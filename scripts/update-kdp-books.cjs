const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'pages', 'kdp_books.astro');
console.log('Reading file:', filePath);

let content = fs.readFileSync(filePath, 'utf8');

const replacement1 = `        <div class="book-showcase">
          {/* Item 1 */}
          <div class="book-item reveal" data-concept="気品と落ち着きを表現する、藍色とベージュの対比。">
            <div class="book-3d-wrap">
              <div class="book-3d">
                <div class="book-cover"><img src="/images/KDP/江戸旅行記/江戸旅行記vol.01 ラグドール.png" alt="江戸の旅 ラグドール" /></div>
                <div class="book-spine"></div>
              </div>
            </div>
            <div class="book-meta">
              <h3 class="title">江戸の旅 ラグドール</h3>
              <p class="price">$12.99 / €12.99</p>
              <div class="links">
                <a href="https://www.amazon.com/dp/B0GWDRMFHJ" target="_blank" class="store-link us">🇺🇸 Amazon US</a>
                <a href="https://www.amazon.fr/dp/B0GWDP7P5G" target="_blank" class="store-link fr">🇫🇷 Amazon FR</a>
              </div>
            </div>
          </div>

          {/* Item 2 */}
          <div class="book-item reveal" data-concept="エネルギッシュな構図と、親しみやすさを両立。">
            <div class="book-3d-wrap">
              <div class="book-3d">
                <div class="book-cover"><img src="/images/KDP/江戸旅行記/江戸旅行記vol.02 フレンチブルドッグ.png" alt="江戸の旅 フレンチブルドッグ" /></div>
                <div class="book-spine"></div>
              </div>
            </div>
            <div class="book-meta">
              <h3 class="title">江戸の旅 フレンチブルドッグ</h3>
              <p class="price">$12.99 / €12.99</p>
              <div class="links">
                <a href="https://www.amazon.com/dp/B0H2GRTH2R" target="_blank" class="store-link us">🇺🇸 Amazon US</a>
                <a href="https://www.amazon.fr/dp/B0GWQ56YDN" target="_blank" class="store-link fr">🇫🇷 Amazon FR</a>
              </div>
            </div>
          </div>

          {/* Item 3 */}
          <div class="book-item reveal" data-concept="静寂と可愛らしさが同居する、冬の江戸をイメージ。">
            <div class="book-3d-wrap">
              <div class="book-3d">
                <div class="book-cover"><img src="/images/KDP/江戸旅行記/江戸旅行記vol.03 シマエナガ.png" alt="江戸の旅 シマエナガ" /></div>
                <div class="book-spine"></div>
              </div>
            </div>
            <div class="book-meta">
              <h3 class="title">江戸の旅 シマエナガ</h3>
              <p class="price">$12.99 / €12.99</p>
              <div class="links">
                <a href="https://www.amazon.com/dp/B0GXKYSTSY" target="_blank" class="store-link us">🇺🇸 Amazon US</a>
                <a href="https://www.amazon.fr/dp/B0GXL5Z3ZR" target="_blank" class="store-link fr">🇫🇷 Amazon FR</a>
              </div>
            </div>
          </div>

          {/* Item 4 */}
          <div class="book-item reveal" data-concept="茶屋の温かみを、暖色系のグラデーションで表現。">
            <div class="book-3d-wrap">
              <div class="book-3d">
                <div class="book-cover"><img src="/images/KDP/江戸旅行記/江戸旅行記vol.04 狸.png" alt="江戸の旅 たぬき" /></div>
                <div class="book-spine"></div>
              </div>
            </div>
            <div class="book-meta">
              <h3 class="title">江戸の旅 たぬき</h3>
              <p class="price">$12.99 / €12.99</p>
              <div class="links">
                <a href="https://www.amazon.com/dp/B0GY95QR8G" target="_blank" class="store-link us">🇺🇸 Amazon US</a>
                <a href="https://www.amazon.fr/dp/B0GY99F4HB" target="_blank" class="store-link fr">🇫🇷 Amazon FR</a>
              </div>
            </div>
          </div>

          {/* Item 5 */}
          <div class="book-item reveal" data-concept="太古のロマンを、力強い筆致と彩度で可視化。">
            <div class="book-3d-wrap">
              <div class="book-3d">
                <div class="book-cover"><img src="/images/KDP/江戸旅行記/江戸旅行記vol.05 古代生物.png" alt="江戸の旅 古代生物" /></div>
                <div class="book-spine"></div>
              </div>
            </div>
            <div class="book-meta">
              <h3 class="title">江戸の旅 古代生物</h3>
              <p class="price">$12.99 / €12.99</p>
              <div class="links">
                <a href="https://www.amazon.com/dp/B0GYHTJRWK" target="_blank" class="store-link us">🇺🇸 Amazon US</a>
                <a href="https://www.amazon.fr/dp/B0GYHR7ZSL" target="_blank" class="store-link fr">🇫🇷 Amazon FR</a>
              </div>
            </div>
          </div>

          {/* Item 6 */}
          <div class="book-item reveal" data-concept="ミステリアスな雰囲気を、紫と黒の調和で演出。">
            <div class="book-3d-wrap">
              <div class="book-3d">
                <div class="book-cover"><img src="/images/KDP/江戸旅行記/江戸旅行記vol.06 狐.png" alt="江戸の旅 きつね" /></div>
                <div class="book-spine"></div>
              </div>
            </div>
            <div class="book-meta">
              <h3 class="title">江戸の旅 きつね</h3>
              <p class="price">$12.99 / €12.99</p>
              <div class="links">
                <a href="https://www.amazon.com/dp/B0GZ2Z1QY1" target="_blank" class="store-link us">🇺🇸 Amazon US</a>
                <a href="https://www.amazon.fr/dp/B0GZ2ZZKXG" target="_blank" class="store-link fr">🇫🇷 Amazon FR</a>
              </div>
            </div>
          </div>

          {/* Item 7 */}
          <div class="book-item reveal" data-concept="江戸の芝居小屋を背景に、愛らしい三毛猫が新たな旅を彩ります。">
            <div class="book-3d-wrap">
              <div class="book-3d">
                <div class="book-cover"><img src="/images/KDP/江戸旅行記/江戸旅行記vol.07 三毛猫.png" alt="江戸の旅 三毛猫" /></div>
                <div class="book-spine"></div>
              </div>
            </div>
            <div class="book-meta">
              <h3 class="title">江戸の旅 三毛猫</h3>
              <p class="price">$12.99 / €12.99</p>
              <div class="links">
                <a href="https://www.amazon.com/dp/B0GZZ7R7H6" target="_blank" class="store-link us">🇺🇸 Amazon US</a>
                <a href="https://www.amazon.fr/dp/B0GZYT239J" target="_blank" class="store-link fr">🇫🇷 Amazon FR</a>
              </div>
            </div>
          </div>

          {/* Item 8: Wolf (狼) */}
          <div class="book-item reveal" data-concept="静寂の中に宿る力強さ。冬の月夜に佇む狼を、江戸の筆致で描き出しました。">
            <div class="book-3d-wrap">
              <div class="book-3d">
                <div class="book-cover"><img src="/images/KDP/江戸旅行記/江戸旅行記vol.08 狼.png" alt="江戸の旅 狼" /></div>
                <div class="book-spine"></div>
              </div>
            </div>
            <div class="book-meta">
              <h3 class="title">江戸の旅 狼 (Wolf)</h3>
              <p class="price">$12.99 / €12.99</p>
              <div class="links">
                <a href="https://www.amazon.com/dp/B0H1M3FN28" target="_blank" class="store-link us">🇺🇸 Amazon US</a>
                <a href="https://www.amazon.fr/dp/B0H1M3FN28" target="_blank" class="store-link fr">🇫🇷 Amazon FR</a>
              </div>
            </div>
          </div>

          {/* Item 9: Frog (蛙) */}
          <div class="book-item reveal" data-concept="愛嬌たっぷりの蛙たちが、雨上がりの江戸の名所をユニークな視点で巡る旅。">
            <div class="book-3d-wrap">
              <div class="book-3d">
                <div class="book-cover"><img src="/images/KDP/江戸旅行記/江戸旅行記vol.09 蛙.png" alt="江戸の旅 蛙" /></div>
                <div class="book-spine"></div>
              </div>
            </div>
            <div class="book-meta">
              <h3 class="title">江戸の旅 蛙 (Frog)</h3>
              <p class="price">$12.99 / €12.99</p>
              <div class="links">
                <a href="https://www.amazon.com/dp/B0H24Y9MDN" target="_blank" class="store-link us">🇺🇸 Amazon US</a>
                <a href="https://www.amazon.fr/dp/B0H2552VV8" target="_blank" class="store-link fr">🇫🇷 Amazon FR</a>
              </div>
            </div>
          </div>

          {/* Item 10: Owl (梟) */}
          <div class="book-item reveal" data-concept="夜の江戸に佇む知恵の象徴・梟。月明かりに照らされた神秘的な旅情を描く、最新作。">
            <div class="book-3d-wrap">
              <div class="book-3d">
                <div class="book-cover"><img src="/images/KDP/江戸旅行記/江戸旅行記vol.10 梟.png" alt="江戸の旅 梟" /></div>
                <div class="book-spine"></div>
              </div>
            </div>
            <div class="book-meta">
              <h3 class="title">江戸の旅 梟 (Owl)</h3>
              <p class="price">近日公開 / Coming Soon</p>
              <div class="links">
                <span class="store-link us" style="opacity: 0.6; cursor: default;">🇺🇸 Amazon US (準備中)</span>
                <span class="store-link fr" style="opacity: 0.6; cursor: default;">🇫🇷 Amazon FR (準備中)</span>
              </div>
            </div>
          </div>
        </div>`;

// Replace Section 1
const section1Start = content.indexOf('<section class="kdp-section premium-dark">');
if (section1Start !== -1) {
  const showcaseStart = content.indexOf('<div class="book-showcase">', section1Start);
  const nextSection = content.indexOf('<!-- Section 2:', showcaseStart);
  if (showcaseStart !== -1 && nextSection !== -1) {
    const showcaseEnd = content.lastIndexOf('</div>', nextSection);
    if (showcaseEnd !== -1 && showcaseEnd > showcaseStart) {
      const targetSegment = content.substring(showcaseStart, showcaseEnd + 6);
      content = content.replace(targetSegment, replacement1);
      console.log('Processed Section 1 (Edo Travelogue)');
    }
  }
}

// Replace Section 2 & 3
const section2Start = content.indexOf('<!-- Section 2: かわいい浮世絵シリーズ');
const footerCtaStart = content.indexOf('<section class="kdp-cta');

if (section2Start !== -1 && footerCtaStart !== -1) {
  const targetSegment2 = content.substring(section2Start, footerCtaStart);
  
  const replacement2 = `<!-- Section 2: かわいい浮世絵シリーズ (Modern pop) -->
    <section class="kdp-section">
      <div class="section-container">
        <h2 class="section-title">かわいい浮世絵シリーズ</h2>
        <div class="book-showcase">
          {/* Repeat for Kawaii series */}
          <div class="book-item reveal" data-concept="動物本来の愛らしさを、江戸の画風に落とし込む。">
            <div class="book-3d-wrap">
              <div class="book-3d">
                <div class="book-cover"><img src="/images/KDP/かわいい浮世絵/かわいい浮世絵vol.01 犬.png" alt="かわいい浮世絵 犬" /></div>
                <div class="book-spine"></div>
              </div>
            </div>
            <div class="book-meta">
              <h3 class="title">かわいい浮世絵 犬</h3>
              <p class="price">$7.99 / €7.90</p>
              <div class="links">
                <a href="https://www.amazon.com/dp/B0GJZFH8P4" target="_blank" class="store-link">🇺🇸 US</a>
                <a href="https://www.amazon.fr/dp/B0GMCLLZYX" target="_blank" class="store-link">🇫🇷 FR</a>
              </div>
            </div>
          </div>
          <div class="book-item reveal" data-concept="気ままな猫たちの日常を、色鮮やかに描写。">
            <div class="book-3d-wrap">
              <div class="book-3d">
                <div class="book-cover"><img src="/images/KDP/かわいい浮世絵/かわいい浮世絵vol.02 猫.png" alt="かわいい浮世絵 猫" /></div>
                <div class="book-spine"></div>
              </div>
            </div>
            <div class="book-meta">
              <h3 class="title">かわいい浮世絵 猫</h3>
              <p class="price">$7.99 / €8.99</p>
              <div class="links">
                <a href="https://www.amazon.com/dp/B0GYYFY4FP" target="_blank" class="store-link">🇺🇸 US</a>
                <a href="https://www.amazon.fr/dp/B0GMCLT7CM" target="_blank" class="store-link">🇫🇷 FR</a>
              </div>
            </div>
          </div>
          <div class="book-item reveal" data-concept="愛らしく跳ねる兎たちを、繊細な浮世絵の筆致でモダンに描写。">
            <div class="book-3d-wrap">
              <div class="book-3d">
                <div class="book-cover"><img src="/images/KDP/かわいい浮世絵/かわいい浮世絵vol.03 兎.png" alt="かわいい浮世絵 兎" /></div>
                <div class="book-spine"></div>
              </div>
            </div>
            <div class="book-meta">
              <h3 class="title">かわいい浮世絵 兎</h3>
              <p class="price">$7.99 / €8.99</p>
              <div class="links">
                <a href="https://www.amazon.com/dp/B0GYYPBYPF" target="_blank" class="store-link">🇺🇸 US</a>
                <a href="https://www.amazon.fr/dp/B0GMCLKHT5" target="_blank" class="store-link">🇫🇷 FR</a>
              </div>
            </div>
          </div>
          <div class="book-item reveal" data-concept="江戸の町に現れた動物たちの賑やかな楽園を色鮮やかに表現。">
            <div class="book-3d-wrap">
              <div class="book-3d">
                <div class="book-cover"><img src="/images/KDP/かわいい浮世絵/かわいい浮世絵vol.04 動物園.png" alt="かわいい浮世絵 動物園" /></div>
                <div class="book-spine"></div>
              </div>
            </div>
            <div class="book-meta">
              <h3 class="title">かわいい浮世絵 動物園</h3>
              <p class="price">$7.99 / €8.99</p>
              <div class="links">
                <a href="https://www.amazon.com/dp/B0GKDGFTVS" target="_blank" class="store-link">🇺🇸 US</a>
                <a href="https://www.amazon.fr/dp/B0GMCNWNW7" target="_blank" class="store-link">🇫🇷 FR</a>
              </div>
            </div>
          </div>
          <div class="book-item reveal" data-concept="爬虫類や両生類たちのユニークな生態を、伝統とポップさの融合で表現。">
            <div class="book-3d-wrap">
              <div class="book-3d">
                <div class="book-cover"><img src="/images/KDP/かわいい浮世絵/かわいい浮世絵vol.05 爬虫類＆両生類.png" alt="かわいい浮世絵 爬虫類" /></div>
                <div class="book-spine"></div>
              </div>
            </div>
            <div class="book-meta">
              <h3 class="title">かわいい浮世絵 爬虫類</h3>
              <p class="price">$7.99 / €8.99</p>
              <div class="links">
                <a href="https://www.amazon.com/dp/B0GXJLMWCX" target="_blank" class="store-link">🇺🇸 US</a>
                <a href="https://www.amazon.fr/dp/B0GXJP7HB7" target="_blank" class="store-link">🇫🇷 FR</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Section 3: Choju-giga -->
    <section class="kdp-section bg-paper">
      <div class="section-container">
        <h2 class="section-title">オリジナル鳥獣戯画</h2>
        <div class="book-item reveal single-focus" data-concept="国宝「鳥獣戯画」をリスペクトし、独自のユーモアを注入。">
          <div class="book-3d-wrap">
            <div class="book-3d">
              <div class="book-cover"><img src="/images/KDP/鳥獣戯画/鳥獣戯画風 en_title.png" alt="オリジナル鳥獣戯画" /></div>
              <div class="book-spine"></div>
            </div>
          </div>
          <div class="book-meta">
            <h3 class="title">オリジナル鳥獣戯画</h3>
            <p class="price">$7.99 / €7.49</p>
            <div class="links">
              <a href="https://www.amazon.com/dp/B0GJZY49SH" target="_blank" class="store-link">🇺🇸 Amazon US</a>
              <a href="https://www.amazon.fr/dp/B0GW8N8HQP" target="_blank" class="store-link">🇫🇷 Amazon FR</a>
            </div>
          </div>
        </div>
      </div>
    </section>
`;
  
  content = content.replace(targetSegment2, replacement2);
  console.log('Processed Section 2 and 3');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('KDP books update completed successfully.');
