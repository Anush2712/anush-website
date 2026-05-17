/* ─────────────────────────────────────────────────────────────
   ANUSH CHOUDHARY PORTFOLIO  —  script.js
   GSAP + ScrollTrigger animations
   ───────────────────────────────────────────────────────────── */

(function () {
  'use strict';

  /* ── PRELOADER ───────────────────────────────────────────── */
  function runPreloader(onComplete) {
    const counter = document.getElementById('pre-counter');
    const fill    = document.getElementById('pre-bar-fill');
    const loader  = document.getElementById('preloader');

    if (!counter || !loader) { onComplete(); return; }

    let count = 0;
    const duration = 1800; // ms
    const steps    = 60;
    const interval = duration / steps;

    const tick = setInterval(function () {
      count = Math.min(count + Math.ceil(Math.random() * 3), 100);
      counter.textContent = String(count).padStart(2, '0');
      if (fill) fill.style.width = count + '%';

      if (count >= 100) {
        clearInterval(tick);
        counter.textContent = '100';
        if (fill) fill.style.width = '100%';

        setTimeout(function () {
          gsap.to(loader, {
            yPercent: -100,
            duration: 0.9,
            ease: 'power3.inOut',
            onComplete: function () {
              loader.style.display = 'none';
              onComplete();
            }
          });
        }, 200);
      }
    }, interval);
  }

  /* ── CURSOR ──────────────────────────────────────────────── */
  function initCursor() {
    const dot  = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');
    if (!dot || !ring) return;

    let mx = 0, my = 0;
    let rx = 0, ry = 0;

    document.addEventListener('mousemove', function (e) {
      mx = e.clientX;
      my = e.clientY;
      gsap.set(dot, { x: mx, y: my });
    });

    // Ring follows with lag
    gsap.ticker.add(function () {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      gsap.set(ring, { x: rx, y: ry });
    });

    // Expand ring on interactive elements
    const interactives = document.querySelectorAll('a, button');
    interactives.forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        gsap.to(ring, { scale: 2, opacity: 0.5, duration: 0.3, ease: 'power2.out' });
        gsap.to(dot,  { scale: 0, duration: 0.2 });
      });
      el.addEventListener('mouseleave', function () {
        gsap.to(ring, { scale: 1, opacity: 1, duration: 0.3, ease: 'power2.out' });
        gsap.to(dot,  { scale: 1, duration: 0.2 });
      });
    });

    // Hide cursor when out of window
    document.addEventListener('mouseleave', function () {
      gsap.to([dot, ring], { opacity: 0, duration: 0.3 });
    });
    document.addEventListener('mouseenter', function () {
      gsap.to([dot, ring], { opacity: 1, duration: 0.3 });
    });
  }

  /* ── NAV SCROLL EFFECT ───────────────────────────────────── */
  function initNav() {
    const nav = document.getElementById('nav');
    if (!nav) return;

    ScrollTrigger.create({
      start: 'top -80px',
      onEnter:        function () { nav.classList.add('scrolled'); },
      onLeaveBack:    function () { nav.classList.remove('scrolled'); }
    });

    // Smooth scroll for nav links
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        const href = a.getAttribute('href');
        if (!href || href === '#') return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        gsap.to(window, {
          scrollTo: { y: target, offsetY: 80 },
          duration: 1.2,
          ease: 'power3.inOut'
        });
      });
    });
  }

  /* ── HERO ENTRANCE ───────────────────────────────────────── */
  function initHero() {
    const tl = gsap.timeline({ delay: 0.2 });

    tl.to('.hero-line span, .hero-line em', {
      y: '0%',
      duration: 1.1,
      ease: 'power4.out',
      stagger: 0.12
    })
    .to('.hero-eyebrow', {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out'
    }, '-=0.7')
    .to('.hero-descriptor', {
      opacity: 1,
      duration: 0.8,
      ease: 'power3.out'
    }, '-=0.5')
    .to('.scroll-hint', {
      opacity: 1,
      duration: 0.6,
      ease: 'power3.out'
    }, '-=0.3');

    // Hero progress bar tied to scroll
    const heroProgress = document.getElementById('hero-progress');
    if (heroProgress) {
      ScrollTrigger.create({
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        onUpdate: function (self) {
          gsap.set(heroProgress, { width: (self.progress * 100) + '%' });
        }
      });
    }

    // Parallax on hero name
    gsap.to('.hero-inner', {
      yPercent: -20,
      ease: 'none',
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });
  }

  /* ── MANIFESTO ───────────────────────────────────────────── */
  function initManifesto() {
    // Each manifesto statement fades in / dims as you scroll past
    document.querySelectorAll('.manifesto-item').forEach(function (item, i) {
      const text = item.querySelector('.mf-text');
      const num  = item.querySelector('.mf-num');

      gsap.from([num, text], {
        opacity: 0,
        y: 40,
        duration: 0.9,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: item,
          start: 'top 65%',
          toggleActions: 'play none none reverse'
        }
      });
    });
  }

  /* ── GENERIC REVEAL ──────────────────────────────────────── */
  function initReveal() {
    // About, experience, skills, education — any element with .section-label,
    // .about-big, .about-meta-item, .exp-card, .skills-col, .edu-row, etc.
    const targets = [
      '.section-label',
      '.about-big',
      '.about-meta-item',
      '.exp-card',
      '.exp-top',
      '.exp-bullets',
      '.exp-tag-row',
      '.skills-col',
      '.edu-row',
      '.contact-eyebrow',
      '.contact-heading',
      '.contact-email',
      '.contact-socials'
    ];

    targets.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el) {
        gsap.from(el, {
          opacity: 0,
          y: 35,
          duration: 0.85,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 82%',
            toggleActions: 'play none none none'
          }
        });
      });
    });
  }

  /* ── PROJECT ROWS ────────────────────────────────────────── */
  function initProjects() {
    document.querySelectorAll('.project-row').forEach(function (row) {
      const media = row.querySelector('.project-media');
      const info  = row.querySelectorAll('.project-num, .project-name, .project-tagline, .project-desc, .project-stat, .project-tag-row, .project-link');
      const isReversed = row.classList.contains('reverse');

      // Slide media in from the side
      gsap.from(media, {
        x: isReversed ? 60 : -60,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: row,
          start: 'top 75%',
          toggleActions: 'play none none none'
        }
      });

      // Stagger info elements
      gsap.from(info, {
        opacity: 0,
        y: 25,
        duration: 0.7,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: row,
          start: 'top 70%',
          toggleActions: 'play none none none'
        }
      });

      // Subtle image scale on scroll
      gsap.to(media, {
        scale: 1.04,
        ease: 'none',
        scrollTrigger: {
          trigger: row,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5
        }
      });
    });
  }

  /* ── SKILLS STAGGER ──────────────────────────────────────── */
  function initSkills() {
    gsap.from('.skills-col', {
      opacity: 0,
      y: 40,
      duration: 0.7,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.skills-grid',
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });
  }

  /* ── HERO DITHERING CANVAS ──────────────────────────────── */
  function initDitheringCanvas() {
    const canvas = document.getElementById('hero-dither');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let time = 0;

    // 4×4 Bayer ordered-dither matrix
    const BAYER = [
      [ 0,  8,  2, 10],
      [12,  4, 14,  6],
      [ 3, 11,  1,  9],
      [15,  7, 13,  5]
    ];

    // Portfolio accent colour #c4a882
    const DR = 196, DG = 168, DB = 130;

    function resize() {
      canvas.width  = canvas.offsetWidth  || 1;
      canvas.height = canvas.offsetHeight || 1;
    }

    // Returns brightness 0–1 at normalised coords (nx, ny) at time t.
    // Uses square-normalised space so the blob looks circular at any aspect ratio.
    function field(nx, ny, t) {
      const r = Math.sqrt(nx * nx + ny * ny);
      const a = Math.atan2(ny, nx);
      const radius =
        0.36
        + 0.07 * Math.sin(2 * a + t * 0.55)
        + 0.05 * Math.sin(3 * a - t * 0.38)
        + 0.03 * Math.sin(5 * a + t * 0.72)
        + 0.02 * Math.sin(7 * a - t * 0.28);
      return Math.max(0, Math.min(1, 1 - (r - radius) / 0.07));
    }

    function render() {
      time += 0.010;
      requestAnimationFrame(render);

      const w  = canvas.width;
      const h  = canvas.height;
      const s  = Math.min(w, h); // square normalisation base
      const px = 4;              // dot block size in pixels

      // createImageData initialises all pixels to (0,0,0,0) — transparent
      const imgData = ctx.createImageData(w, h);
      const data    = imgData.data;

      for (let y = 0; y < h; y += px) {
        for (let x = 0; x < w; x += px) {
          // Square-normalised coords, centred
          const nx = (x - w * 0.5) / s;
          const ny = (y - h * 0.45) / s; // slightly above centre for visual weight

          const v   = field(nx, ny, time);
          const bx  = Math.floor(x / px) & 3;
          const by  = Math.floor(y / px) & 3;
          const thr = BAYER[by][bx] / 16;

          if (v > thr) {
            for (let py = 0; py < px && (y + py) < h; py++) {
              const row = (y + py) * w * 4;
              for (let qx = 0; qx < px && (x + qx) < w; qx++) {
                const i    = row + (x + qx) * 4;
                data[i]     = DR;
                data[i + 1] = DG;
                data[i + 2] = DB;
                data[i + 3] = 220; // ~86% alpha for softness
              }
            }
          }
          // else: pixels stay transparent (0,0,0,0)
        }
      }

      ctx.clearRect(0, 0, w, h);
      ctx.putImageData(imgData, 0, 0);
    }

    window.addEventListener('resize', resize);
    resize();
    render();
  }

  /* ── CONTACT HEADING CLIP ────────────────────────────────── */
  function initContact() {
    const spans = document.querySelectorAll('.contact-heading span, .contact-heading em');
    spans.forEach(function (span) {
      gsap.from(span, {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: span,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      });
    });
  }

  /* ── SMOOTH SCROLL POLYFILL ──────────────────────────────── */
  function loadScrollToPlugin() {
    // GSAP ScrollToPlugin via CDN — load dynamically so it's optional
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollToPlugin.min.js';
    document.head.appendChild(s);
  }

  /* ── BOOT ────────────────────────────────────────────────── */
  function boot() {
    // Register GSAP plugin
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      console.warn('[portfolio] GSAP not loaded — animations disabled.');
      document.getElementById('preloader') && (document.getElementById('preloader').style.display = 'none');
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    loadScrollToPlugin();

    runPreloader(function () {
      initCursor();
      initNav();
      initHero();
      initDitheringCanvas();
      initManifesto();
      initReveal();
      initProjects();
      initSkills();
      initContact();

      // Refresh ScrollTrigger after layout settles
      setTimeout(function () {
        ScrollTrigger.refresh();
      }, 100);
    });
  }

  // Wait for GSAP to be available (loaded with defer in <head>)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

})();
