document.addEventListener('DOMContentLoaded', () => {
  // 1. パーティクル（浮遊する光の粒子）の生成
  initParticles();

  // 2. BGMプレイヤーの制御
  initBgmPlayer();
});

/**
 * 浮遊する光の粒子（パーティクル）を動的に生成する関数
 */
function initParticles() {
  const container = document.getElementById('particle-container');
  if (!container) return;

  const maxParticles = 30; // パフォーマンス考慮し最大30個に制限
  let particleCount = 0;

  const createParticle = () => {
    if (particleCount >= maxParticles) return;

    const particle = document.createElement('div');
    particle.classList.add('particle');

    // ランダムなパラメータ設定
    const size = Math.random() * 8 + 3; // 3px 〜 11px
    const left = Math.random() * 100; // 0% 〜 100%
    const duration = Math.random() * 10 + 10; // 10秒 〜 20秒で上昇
    const delay = Math.random() * 5; // 0秒 〜 5秒のディレイ

    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${left}%`;
    particle.style.bottom = `-20px`; // 画面下部から開始
    particle.style.animationDuration = `${duration}s`;
    particle.style.animationDelay = `${delay}s`;

    // 粒子がほんのり黄色〜オレンジに揺らぐようにする
    const hue = 40 + Math.random() * 20; // 40(オレンジ寄り) 〜 60(黄色)
    particle.style.background = `radial-gradient(circle, hsla(${hue}, 90%, 70%, 0.8) 0%, hsla(${hue}, 90%, 70%, 0) 70%)`;

    container.appendChild(particle);
    particleCount++;

    // アニメーションが終了したら削除してカウントを減らす
    particle.addEventListener('animationend', () => {
      particle.remove();
      particleCount--;
    });
  };

  // 初期粒子をいくつか生成
  for (let i = 0; i < 15; i++) {
    setTimeout(createParticle, Math.random() * 6000);
  }

  // ループで粒子を追加し続ける
  setInterval(createParticle, 1000);
}

/**
 * BGMプレイヤーのコントロールを初期化する関数
 */
function initBgmPlayer() {
  const playBtn = document.getElementById('play-btn');
  const bgm = document.getElementById('bgm-player');
  const equalizer = document.getElementById('equalizer');

  if (!playBtn || !bgm || !equalizer) return;

  // 再生/一時停止の切り替え
  const togglePlay = () => {
    if (bgm.paused) {
      // 再生する
      bgm.play()
        .then(() => {
          playBtn.classList.add('playing');
          equalizer.classList.add('playing');
          playBtn.setAttribute('aria-label', '音楽を一時停止する');
        })
        .catch(err => {
          console.error('Audio playback failed:', err);
          alert('ブラウザのセキュリティ設定により、インタラクションなしでの自動再生がブロックされる場合があります。ボタンを再度クリックしてください。');
        });
    } else {
      // 一時停止する
      bgm.pause();
      playBtn.classList.remove('playing');
      equalizer.classList.remove('playing');
      playBtn.setAttribute('aria-label', '音楽を再生する');
    }
  };

  playBtn.addEventListener('click', togglePlay);

  // 音声が終了したらUIを初期状態に戻す
  bgm.addEventListener('ended', () => {
    playBtn.classList.remove('playing');
    equalizer.classList.remove('playing');
    playBtn.setAttribute('aria-label', '音楽を再生する');
  });
}
