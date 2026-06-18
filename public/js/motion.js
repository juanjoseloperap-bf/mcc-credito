// motion.js — GSAP + Lenis + ScrollTrigger + Vanta + VanillaTilt

(function () {
  'use strict';

  // ── Lenis smooth scroll ───────────────────────────────────────────────────
  const lenis = new Lenis({
    duration: 1.1,
    easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 0.9,
  });

  // Exponer para que el iframe resize pueda llamar lenis.resize()
  window.__lenis = lenis;

  gsap.registerPlugin(ScrollTrigger);
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(time => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // Smooth scroll al hacer click en anclas — offset = altura del navbar
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: -66, duration: 1.35 });
    });
  });

  // ── Vanta 3D hero background ─────────────────────────────────────────────
  if (window.innerWidth > 768 && typeof VANTA !== 'undefined') {
    VANTA.NET({
      el: '#hero',
      THREE,
      mouseControls: true,
      touchControls: false,
      gyroControls: false,
      color: 0x2a9fd6,        // brand blue-light
      backgroundColor: 0x1b2360, // brand navy
      points: 7.0,
      maxDistance: 22.0,
      spacing: 22.0,
      showDots: true,
    });
  }

  // ── Text mask reveal — H1 palabra a palabra ───────────────────────────────
  const h1 = document.getElementById('hero-heading');
  if (h1) {
    const words = h1.textContent.trim().split(/\s+/);
    h1.innerHTML = words
      .map(w => `<span class="word-wrap"><span class="word">${w}</span></span>`)
      .join(' ');
  }

  // ── Hero entrance ─────────────────────────────────────────────────────────
  gsap.set('.hero-grid', { position: 'relative', zIndex: 3 });

  const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' }, delay: 0.1 });
  heroTl
    .from('.hero-logo',          { y: -20, opacity: 0, duration: 0.50 })
    .from('.hero-eyebrow',       { y: -22, opacity: 0, duration: 0.50 }, '-=0.25')
    .from('#hero-heading .word', { y: '110%', duration: 0.70, stagger: 0.065 }, '-=0.2')
    .from('.hero-desc',          { y: 26, opacity: 0, duration: 0.58 }, '-=0.42')
    .from('.hero-buttons a',     { y: 18, opacity: 0, duration: 0.48, stagger: 0.11 }, '-=0.28')
    .from('.hero-card',          { x: 80, opacity: 0, duration: 0.90, ease: 'power2.out' }, '-=0.48');

  // ── Contadores en stats ───────────────────────────────────────────────────
  function runCounter(el) {
    const target = parseInt(el.dataset.counter, 10);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const dur    = 1600;
    const t0     = performance.now();
    function step(now) {
      const p = Math.min((now - t0) / dur, 1);
      el.textContent = prefix + Math.round((1 - Math.pow(1 - p, 3)) * target).toLocaleString('es-CO') + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  ScrollTrigger.create({
    trigger: '.hero-card', start: 'top 85%', once: true,
    onEnter: () => document.querySelectorAll('[data-counter]').forEach(runCounter),
  });

  // ── Botones magnéticos ────────────────────────────────────────────────────
  document.querySelectorAll('.btn-accent, .btn-primary').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      gsap.to(btn, {
        x: (e.clientX - r.left - r.width  / 2) * 0.30,
        y: (e.clientY - r.top  - r.height / 2) * 0.30,
        duration: 0.38, ease: 'power2.out',
      });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.52, ease: 'elastic.out(1.1, 0.5)' });
    });
  });

  // ── Navbar scroll shadow ──────────────────────────────────────────────────
  ScrollTrigger.create({
    start: 'top -50px', end: 99999,
    onUpdate: self => document.getElementById('navbar').classList.toggle('scrolled', self.progress > 0),
  });

  // ── Servicios — reveal + VanillaTilt ─────────────────────────────────────
  gsap.from('.service-card', {
    scrollTrigger: { trigger: '#servicios', start: 'top 78%' },
    y: 60, opacity: 0, duration: 0.68, stagger: 0.16, ease: 'power2.out',
    onComplete() {
      if (typeof VanillaTilt !== 'undefined' && window.innerWidth > 768) {
        document.querySelectorAll('.service-card').forEach(c => c.classList.add('has-tilt'));
        VanillaTilt.init(document.querySelectorAll('.service-card'), {
          max: 8, speed: 400, glare: false, gyroscope: false,
        });
      }
    },
  });

  // ── Calculadora iframe reveal ─────────────────────────────────────────────
  const calcWrapper = document.querySelector('#calculadora > .container > div');
  if (calcWrapper) {
    gsap.from(calcWrapper, {
      scrollTrigger: { trigger: '#calculadora', start: 'top 78%' },
      y: 50, opacity: 0, duration: 0.85, ease: 'power2.out',
    });
  }

  // ── Precalificación ───────────────────────────────────────────────────────
  gsap.from('.precal-info', {
    scrollTrigger: { trigger: '#precalificacion', start: 'top 78%' },
    x: -60, opacity: 0, duration: 0.85, ease: 'power2.out',
  });
  gsap.from('.precal-card', {
    scrollTrigger: { trigger: '#precalificacion', start: 'top 78%' },
    x: 60, opacity: 0, duration: 0.85, ease: 'power2.out',
  });

  // ── Ventajas ──────────────────────────────────────────────────────────────
  gsap.from('.ventaja', {
    scrollTrigger: { trigger: '#ventajas', start: 'top 80%' },
    y: 48, opacity: 0, scale: 0.95, duration: 0.62, stagger: 0.12, ease: 'back.out(1.5)',
  });

  // ── FAQ ───────────────────────────────────────────────────────────────────
  gsap.from('.faq-item', {
    scrollTrigger: { trigger: '#faq', start: 'top 82%' },
    y: 30, opacity: 0, duration: 0.52, stagger: 0.09, ease: 'power2.out',
  });

  // ── Section títulos & labels ──────────────────────────────────────────────
  gsap.utils.toArray('.section-title').forEach(el => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 88%' },
      y: 24, opacity: 0, duration: 0.58, ease: 'power2.out',
    });
  });
  gsap.utils.toArray('.section-label').forEach(el => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 92%' },
      y: 14, opacity: 0, duration: 0.42, ease: 'power1.out',
    });
  });

  // ── Hero card — VanillaTilt en desktop, float en mobile ───────────────────
  if (typeof VanillaTilt !== 'undefined' && window.innerWidth > 768) {
    VanillaTilt.init(document.querySelectorAll('.hero-card'), {
      max: 6, speed: 600, glare: true, 'max-glare': 0.10, gyroscope: false,
    });
  } else {
    gsap.to('.hero-card', {
      y: -14, duration: 3.8, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 1.2,
    });
  }

}());
