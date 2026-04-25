// Lenis Smooth Scroll Setup
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
  direction: 'vertical',
  gestureDirection: 'vertical',
  smooth: true,
  mouseMultiplier: 1,
  smoothTouch: false,
  touchMultiplier: 2,
  infinite: false,
})

function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}
requestAnimationFrame(raf)

// GSAP ScrollTrigger Setup
gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
  // Hero Animation
  const heroTl = gsap.timeline();
  
  heroTl.from('.hero-bg-enso', {
    scale: 0.8,
    opacity: 0,
    duration: 2,
    ease: 'power3.out'
  })
  .from('.title-line', {
    y: 50,
    opacity: 0,
    duration: 1,
    stagger: 0.2,
    ease: 'power3.out'
  }, "-=1.5")
  .from('.hero-subtitle', {
    y: 30,
    opacity: 0,
    duration: 1,
    ease: 'power3.out'
  }, "-=0.8")
  .from('.hero-action .btn', {
    y: 20,
    opacity: 0,
    duration: 0.8,
    stagger: 0.1,
    ease: 'power3.out'
  }, "-=0.6")
  .from('.header', {
    y: -100,
    opacity: 0,
    duration: 1,
    ease: 'power3.out'
  }, "-=1");

  // Story Section Parallax & Reveal
  gsap.from('.story-image-wrapper', {
    scrollTrigger: {
      trigger: '.story',
      start: 'top 80%',
    },
    y: 100,
    opacity: 0,
    duration: 1.5,
    ease: 'power4.out'
  });

  gsap.from('.story-content-item', {
    scrollTrigger: {
      trigger: '.story',
      start: 'top 60%',
    },
    y: 50,
    opacity: 0,
    duration: 1,
    stagger: 0.2,
    ease: 'power3.out'
  });

  // Services Bento Grid Animation
  const serviceCards = gsap.utils.toArray('.bento-card');
  serviceCards.forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: '.services',
        start: 'top 70%',
      },
      y: 50,
      opacity: 0,
      duration: 1,
      delay: i * 0.1,
      ease: 'power3.out'
    });
  });

  // Targets Section
  gsap.from('.tg-card', {
    scrollTrigger: {
      trigger: '.targets',
      start: 'top 70%',
    },
    y: 50,
    opacity: 0,
    duration: 0.8,
    stagger: 0.1,
    ease: 'power3.out'
  });

  // Portfolio Section
  gsap.from('.portfolio-item', {
    scrollTrigger: {
      trigger: '#portfolio',
      start: 'top 70%',
    },
    y: 40,
    opacity: 0,
    duration: 0.8,
    stagger: 0.1,
    ease: 'power3.out'
  });

  // Custom Cursor (Magnetic effect on buttons)
  const cursor = document.querySelector('.custom-cursor');
  if(cursor) {
    document.addEventListener('mousemove', (e) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: 'power2.out'
      });
    });

    const magneticElements = document.querySelectorAll('.magnetic');
    magneticElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        gsap.to(cursor, { scale: 2, backgroundColor: 'rgba(196, 160, 82, 0.5)', duration: 0.3 });
      });
      el.addEventListener('mouseleave', () => {
        gsap.to(cursor, { scale: 1, backgroundColor: 'var(--color-accent)', duration: 0.3 });
        gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'power3.out' }); // Reset position
      });
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        gsap.to(el, { x: x * 0.3, y: y * 0.3, duration: 0.3, ease: 'power2.out' });
      });
    });
  }

  // Header Scroll Effect
  const header = document.querySelector('.header');
  ScrollTrigger.create({
    start: 'top -50',
    onUpdate: (self) => {
      if(self.direction === 1) {
        header.classList.add('scrolled');
      } else if(self.progress === 0) {
        header.classList.remove('scrolled');
      }
    }
  });

  // Services Tab Logic (Custom)
  const tabBtns = document.querySelectorAll('.tab-btn-premium');
  const tabPanels = document.querySelectorAll('.bento-grid-panel');
  
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      
      // Update buttons
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Update panels with animation
      tabPanels.forEach(panel => {
        if(panel.id === targetId) {
          panel.style.display = 'grid';
          gsap.fromTo(panel.children, 
            { opacity: 0, y: 30 }, 
            { opacity: 1, y: 0, duration: 0.6, stagger: 0.05, ease: 'power3.out' }
          );
        } else {
          panel.style.display = 'none';
        }
      });
    });
  });
});
