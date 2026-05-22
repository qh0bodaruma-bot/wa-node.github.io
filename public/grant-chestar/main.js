document.addEventListener('DOMContentLoaded', () => {
  // 1. パーティクル（浮遊する光の粒子）の生成
  initParticles();

  // 2. カレンダー登録モーダルの制御
  initCalendarModal();
});

/**
 * 浮遊する光の粒子（パーティクル）を動的に生成する関数
 */
function initParticles() {
  const container = document.getElementById('particle-container');
  if (!container) return;

  const maxParticles = 45; // 華やかにするために最大45個に増加
  let particleCount = 0;

  const createParticle = () => {
    if (particleCount >= maxParticles) return;

    const wrapper = document.createElement('div');
    wrapper.classList.add('particle-wrapper');

    const inner = document.createElement('div');
    inner.classList.add('particle-inner');

    // 星型か丸型かをランダムで決定
    const isStar = Math.random() > 0.4; // 60%が星型
    if (isStar) {
      inner.classList.add('star');
    } else {
      inner.classList.add('dot');
    }

    // ランダムなパラメータ設定
    const size = isStar ? (Math.random() * 10 + 6) : (Math.random() * 6 + 3); // 星は6〜16px、ドットは3〜9px
    const left = Math.random() * 100; // 0% 〜 100%
    const duration = Math.random() * 10 + 8; // 8秒 〜 18秒で落下
    const delay = Math.random() * 5; // 0秒 〜 5秒のディレイ
    
    // 左右の揺れと回転、透明度の設定
    const driftX = Math.random() * 50 - 25; // -25px 〜 25px 左右に揺れる
    const targetRotate = (Math.random() * 360 + 180) * (Math.random() > 0.5 ? 1 : -1); // 180〜540度回転
    const maxOpacity = Math.random() * 0.35 + 0.65; // 0.65 〜 1.0

    // スタイル適用
    wrapper.style.width = `${size}px`;
    wrapper.style.height = `${size}px`;
    wrapper.style.left = `${left}%`;
    wrapper.style.top = `-20px`; // 画面上部から開始
    wrapper.style.animationDuration = `${duration}s`;
    wrapper.style.animationDelay = `${delay}s`;
    
    // カスタムプロパティ設定
    wrapper.style.setProperty('--drift-x', `${driftX}px`);
    wrapper.style.setProperty('--target-rotate', `${targetRotate}deg`);
    wrapper.style.setProperty('--max-opacity', maxOpacity);

    // インナーにランダムな明滅（twinkle）のアニメーションディレイを適用
    inner.style.animationDelay = `${Math.random() * 1.5}s`;
    inner.style.animationDuration = `${Math.random() * 1.0 + 1.0}s`; // 1.0s 〜 2.0s で明滅

    wrapper.appendChild(inner);
    container.appendChild(wrapper);
    particleCount++;

    // アニメーションが終了したら削除
    wrapper.addEventListener('animationend', () => {
      wrapper.remove();
      particleCount--;
    });
  };

  // 初期粒子をいくつか生成
  for (let i = 0; i < 20; i++) {
    setTimeout(createParticle, Math.random() * 5000);
  }

  // ループで粒子を追加し続ける
  setInterval(createParticle, 800); // 発生頻度を少し上げる（1000ms -> 800ms）
}

/**
 * カレンダー登録モーダルの表示制御と、.icsファイルの動的生成・ダウンロード処理
 */
function initCalendarModal() {
  const trigger = document.getElementById('event-calendar-trigger');
  const modal = document.getElementById('calendar-modal');
  const closeBtn = document.getElementById('modal-close-btn');
  const icsBtn = document.getElementById('ics-cal-btn');

  if (!trigger || !modal || !closeBtn || !icsBtn) return;

  // モーダルを開く
  const openModal = () => {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // 背後のスクロールを防止
  };

  // モーダルを閉じる
  const closeModal = () => {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = ''; // スクロール防止を解除
  };

  trigger.addEventListener('click', openModal);
  trigger.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openModal();
    }
  });

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // ESCキーでモーダルを閉じる
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  // iCalendar (.ics) ファイルのダウンロード生成
  icsBtn.addEventListener('click', () => {
    const event = {
      title: 'GRANT-CHESTAR mini-concert',
      description: '東北シスターズと魚住英史(drums)による、夏の夜に懐かしいメロディをお届けするミニコンサート。',
      location: '小牧市郷中2-1',
      start: '20260718T183000',
      end: '20260718T200000',
    };

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//GRANT-CHESTAR//CalendarEvent//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:grant-chestar-20260718@tohokusisters`,
      `DTSTART;TZID=Asia/Tokyo:${event.start}`,
      `DTEND;TZID=Asia/Tokyo:${event.end}`,
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${event.description}`,
      `LOCATION:${event.location}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    // Blobを作成してダウンロードを発火
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'grant-chestar-concert.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    // 登録完了後にモーダルを閉じる
    closeModal();
  });
}
