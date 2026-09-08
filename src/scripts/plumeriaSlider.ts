let dispose = () => {};
export function disposePlumeriaSlider() { dispose(); dispose = () => {}; }

export function initPlumeriaSlider() {
  const root = document.querySelector<HTMLElement>('[data-pl-slider]');
  if (!root || root.dataset.ready) return;
  disposePlumeriaSlider();
  root.dataset.ready = 'true';
  const photos = [...root.querySelectorAll<HTMLImageElement>('.pl-hero-photo')];
  const dots = [...root.querySelectorAll<HTMLButtonElement>('[data-pl-dot]')];
  const toggle = root.querySelector<HTMLButtonElement>('[data-pl-toggle]');
  const label = root.querySelector<HTMLElement>('[data-pl-toggle-label]');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const controller = new AbortController();
  const options = { signal: controller.signal };
  let timer: number | undefined;
  let index = 0;
  let playing = !reduced.matches;
  let request = 0;

  const stop = () => { clearInterval(timer); timer = undefined; };
  const update = () => {
    if (toggle) toggle.dataset.playing = String(playing);
    if (label) label.textContent = playing ? 'スライドショーを停止' : 'スライドショーを再生';
    stop();
    if (playing && !document.hidden) timer = window.setInterval(() => show((index + 1) % photos.length), 5000);
  };
  async function show(next: number) {
    const token = ++request;
    const photo = photos[next];
    if (!photo.hasAttribute('src') && photo.dataset.src) photo.src = photo.dataset.src;
    try { await photo.decode(); } catch { return; } // Keep the current image if loading fails.
    if (token !== request || controller.signal.aborted) return;
    index = next;
    photos.forEach((img, i) => {
      img.classList.toggle('is-on', i === index);
      img.setAttribute('aria-hidden', String(i !== index));
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle('is-on', i === index);
      dot.setAttribute('aria-current', String(i === index));
    });
  }
  dots.forEach((dot, i) => dot.addEventListener('click', () => {
    playing = false; update(); void show(i);
  }, options));
  toggle?.addEventListener('click', () => { playing = !playing; update(); }, options);
  root.addEventListener('focusin', () => { playing = false; update(); }, options);
  document.addEventListener('visibilitychange', update, options);
  reduced.addEventListener('change', () => { if (reduced.matches) { playing = false; update(); } }, options);
  root.classList.add('is-ready');
  update();
  dispose = () => { stop(); controller.abort(); };
}
