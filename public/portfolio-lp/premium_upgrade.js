/* 
  Wa-Node Premium Upgrade JS v1.0
  Handles animations and interactive elements for portfolio LPs.
*/

document.addEventListener('DOMContentLoaded', () => {
  // Inject Showroom Bar
  const bar = document.createElement('div');
  bar.className = 'showroom-bar';
  
  // Determine back link based on current page
  const isLP = window.location.pathname.includes('lp_');
  const backLabel = isLP ? '← LP実績一覧に戻る' : '← パッケージ一覧に戻る';
  const backLink = isLP ? '/lp-portfolio' : '/demos';

  bar.innerHTML = `<span>和-Node Digital Showroom</span><a href="${backLink}">${backLabel}</a>`;
  document.body.prepend(bar);

  // Reveal Animation Logic
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // If it's a one-time animation, unobserve
        // observer.unobserve(entry.target); 
      }
    });
  }, observerOptions);

  // Target common elements for reveal
  const revealElements = document.querySelectorAll('.reveal, .card, .item, .service-card, .menu-card, section h2, .hero-content > *');
  revealElements.forEach(el => {
    el.classList.add('reveal'); // Ensure class is present
    observer.observe(el);
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });

});
