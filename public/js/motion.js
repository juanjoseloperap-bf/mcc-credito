// motion.js — v2: Lenis + GSAP + ScrollTrigger + Vanta + cursor + magnetic + tilt + text mask

(function () {
  'use strict';

  // ─── LENIS smooth scroll ───────────────────────────────────────────────────
  const lenis = new Lenis({
    duration: 1.15,
    easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 0.9
  });

  gsap.registerPlugin(ScrollTrigger);
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(time => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: -64, duration: 1.4 });
    });
  });

  // ─── VANTA 3D hero background ─────────────────────────────────────────────
  if (window.innerWidth > 768 && typeof VANTA !== 'undefined') {
    VANTA.NET({
      el: '#hero',
      THREE,
      mouseControls: true,
      touchControls: false,
      gyroControls: false,
      color: 0x14b8a6,
      backgroundColor: 0x083b7a,
      points: 8.0,
      maxDistance: 24.0,
      spacing: 20.0,
      showDots: true
    });
  }

  // ─── TEXT MASK REVEAL — H1 word by word desde clip ────────────────────────
  const h1 = document.getElementById('hero-heading');
  if (h1) {
    const words = h1.textContent.trim().split(/\s+/);
    h1.innerHTML = words.map(w =>
      `<span class="word-wrap"><span class="word">${w}</span></span>`
    ).join(' ');
  }

  // ─── HERO ENTRANCE ────────────────────────────────────────────────────────
  gsap.set('.hero-grid', { position: 'relative', zIndex: 3 });

  const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' }, delay: 0.1 });
  heroTl
    .from('.hero-eyebrow',       { y: -28, opacity: 0, duration: 0.55 })
    .from('#hero-heading .word', { y: '110%', duration: 0.72, stagger: 0.065 }, '-=0.2')
    .from('.hero-desc',          { y: 28, opacity: 0, duration: 0.60 }, '-=0.45')
    .from('.hero-buttons a',     { y: 20, opacity: 0, duration: 0.50, stagger: 0.11 }, '-=0.28')
    .from('.hero-card',          { x: 88, opacity: 0, duration: 0.95, ease: 'power2.out' }, '-=0.50');

  // ─── COUNTERS ────────────────────────────────────────────────────────────
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
    onEnter: () => document.querySelectorAll('[data-counter]').forEach(runCounter)
  });

  // ─── MAGNETIC BUTTONS ─────────────────────────────────────────────────────
  document.querySelectorAll('.btn-accent, .btn-primary').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      gsap.to(btn, {
        x: (e.clientX - r.left - r.width  / 2) * 0.33,
        y: (e.clientY - r.top  - r.height / 2) * 0.33,
        duration: 0.4, ease: 'power2.out'
      });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.55, ease: 'elastic.out(1.2, 0.5)' });
    });
  });

  // ─── NAVBAR SCROLL ────────────────────────────────────────────────────────
  ScrollTrigger.create({
    start: 'top -50px', end: 99999,
    onUpdate: self => document.getElementById('navbar').classList.toggle('scrolled', self.progress > 0)
  });

  // ─── SERVICIOS — reveal escalonado, luego VanillaTilt ─────────────────────
  gsap.from('.service-card', {
    scrollTrigger: { trigger: '#servicios', start: 'top 78%' },
    y: 70, opacity: 0, duration: 0.7, stagger: 0.18, ease: 'power2.out',
    onComplete() {
      if (typeof VanillaTilt !== 'undefined' && window.innerWidth > 768) {
        document.querySelectorAll('.service-card').forEach(c => c.classList.add('has-tilt'));
        VanillaTilt.init(document.querySelectorAll('.service-card'), {
          max: 10, speed: 400, glare: true, 'max-glare': 0.10, gyroscope: false
        });
      }
    }
  });

  // ─── CALCULADORA ─────────────────────────────────────────────────────────
  gsap.from('.calc-card', {
    scrollTrigger: { trigger: '#calculadora', start: 'top 80%' },
    x: -60, opacity: 0, duration: 0.85, ease: 'power2.out'
  });
  gsap.from('.calc-result', {
    scrollTrigger: { trigger: '#calculadora', start: 'top 80%' },
    x: 60, opacity: 0, duration: 0.85, ease: 'power2.out'
  });

  // ─── PRECALIFICACIÓN ─────────────────────────────────────────────────────
  gsap.from('.precal-info', {
    scrollTrigger: { trigger: '#precalificacion', start: 'top 78%' },
    x: -70, opacity: 0, duration: 0.9, ease: 'power2.out'
  });
  gsap.from('.precal-card', {
    scrollTrigger: { trigger: '#precalificacion', start: 'top 78%' },
    x: 70, opacity: 0, duration: 0.9, ease: 'power2.out'
  });

  // ─── VENTAJAS — spring ────────────────────────────────────────────────────
  gsap.from('.ventaja', {
    scrollTrigger: { trigger: '#ventajas', start: 'top 80%' },
    y: 50, opacity: 0, scale: 0.94, duration: 0.65, stagger: 0.13, ease: 'back.out(1.6)'
  });

  // ─── FAQ ──────────────────────────────────────────────────────────────────
  gsap.from('.faq-item', {
    scrollTrigger: { trigger: '#faq', start: 'top 82%' },
    y: 35, opacity: 0, duration: 0.55, stagger: 0.1, ease: 'power2.out'
  });

  // ─── SECCIÓN TÍTULOS ─────────────────────────────────────────────────────
  gsap.utils.toArray('.section-title').forEach(el => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 88%' },
      y: 28, opacity: 0, duration: 0.6, ease: 'power2.out'
    });
  });
  gsap.utils.toArray('.section-label').forEach(el => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 90%' },
      y: 15, opacity: 0, duration: 0.45, ease: 'power1.out'
    });
  });

  // ─── VANILLA TILT hero card (vs float en mobile) ─────────────────────────
  if (typeof VanillaTilt !== 'undefined' && window.innerWidth > 768) {
    VanillaTilt.init(document.querySelectorAll('.hero-card'), {
      max: 7, speed: 600, glare: true, 'max-glare': 0.12, gyroscope: false
    });
  } else {
    gsap.to('.hero-card', {
      y: -16, duration: 3.8, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 1.2
    });
  }

}());
