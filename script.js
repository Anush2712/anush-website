/* ─────────────────────────────────────────────────────────────
   MAKKENA BALA ANUSH CHOUDHARY — PORTFOLIO  —  script.js
   Lenis smooth scroll + GSAP ScrollTrigger animations
   ───────────────────────────────────────────────────────────── */

(function () {
  'use strict';

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer    = window.matchMedia('(pointer: fine)').matches;

  var lenis = null;

  /* ── LENIS SMOOTH SCROLL ─────────────────────────────────── */
  function initLenis() {
    if (prefersReduced || typeof Lenis === 'undefined') return;

    lenis = new Lenis({
      duration: 1.1,
      easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.6
    });

    // Keep ScrollTrigger in sync with Lenis
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (time) {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  }

  /* ── THEME SWITCHER ──────────────────────────────────────── */
  function initThemeSwitcher() {
    var dots = document.querySelectorAll('.theme-dot');
    if (!dots.length) return;

    var saved = null;
    try { saved = localStorage.getItem('theme'); } catch (e) {}
    var current = saved || document.documentElement.getAttribute('data-theme') || 'champagne';

    function apply(name) {
      if (name === 'champagne') {
        document.documentElement.removeAttribute('data-theme');
      } else {
        document.documentElement.setAttribute('data-theme', name);
      }
      try { localStorage.setItem('theme', name); } catch (e) {}
      dots.forEach(function (d) {
        d.classList.toggle('active', d.getAttribute('data-theme') === name);
      });
      document.dispatchEvent(new CustomEvent('themechange'));
    }

    dots.forEach(function (d) {
      d.addEventListener('click', function () {
        apply(d.getAttribute('data-theme'));
      });
    });

    apply(current);
  }

  /* ── ANCHOR LINKS ────────────────────────────────────────── */
  function initAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var href = a.getAttribute('href');
        // Placeholder links (e.g. certificate links awaiting a Drive URL)
        if (!href || href === '#') { e.preventDefault(); return; }
        var target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        if (lenis) {
          lenis.scrollTo(target, { offset: -70, duration: 1.4 });
        } else {
          target.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth' });
        }
      });
    });
  }

  /* ── PRELOADER ───────────────────────────────────────────── */
  function runPreloader(onComplete) {
    var counter = document.getElementById('pre-counter');
    var fill    = document.getElementById('pre-bar-fill');
    var loader  = document.getElementById('preloader');

    if (!counter || !loader || prefersReduced) {
      if (loader) loader.style.display = 'none';
      onComplete();
      return;
    }

    var progress = { val: 0 };
    gsap.to(progress, {
      val: 100,
      duration: 1.5,
      ease: 'power2.inOut',
      onUpdate: function () {
        var v = Math.round(progress.val);
        counter.textContent = String(v).padStart(2, '0');
        if (fill) fill.style.width = v + '%';
      },
      onComplete: function () {
        gsap.to(loader, {
          yPercent: -100,
          duration: 1,
          delay: 0.15,
          ease: 'expo.inOut',
          onComplete: function () {
            loader.style.display = 'none';
            onComplete();
          }
        });
      }
    });
  }

  /* ── CURSOR ──────────────────────────────────────────────── */
  function initCursor() {
    if (!finePointer || prefersReduced) return;

    var dot  = document.getElementById('cursor-dot');
    var ring = document.getElementById('cursor-ring');
    if (!dot || !ring) return;

    var mx = 0, my = 0;
    var rx = 0, ry = 0;

    document.addEventListener('mousemove', function (e) {
      mx = e.clientX;
      my = e.clientY;
      gsap.set(dot, { x: mx, y: my });
    });

    // Ring follows with smooth lag
    gsap.ticker.add(function () {
      rx += (mx - rx) * 0.14;
      ry += (my - ry) * 0.14;
      gsap.set(ring, { x: rx, y: ry });
    });

    // Expand ring on interactive elements
    document.querySelectorAll('a, button').forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        gsap.to(ring, { scale: 2, opacity: 0.5, duration: 0.4, ease: 'power3.out' });
        gsap.to(dot,  { scale: 0, duration: 0.25, ease: 'power3.out' });
      });
      el.addEventListener('mouseleave', function () {
        gsap.to(ring, { scale: 1, opacity: 1, duration: 0.4, ease: 'power3.out' });
        gsap.to(dot,  { scale: 1, duration: 0.25, ease: 'power3.out' });
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
    var nav = document.getElementById('nav');
    if (!nav) return;

    ScrollTrigger.create({
      start: 'top -80px',
      onEnter:     function () { nav.classList.add('scrolled'); },
      onLeaveBack: function () { nav.classList.remove('scrolled'); }
    });
  }

  /* ── HERO ENTRANCE ───────────────────────────────────────── */
  function initHero() {
    var tl = gsap.timeline({ delay: 0.1 });

    tl.to('.hero-line span, .hero-line em', {
      y: '0%',
      duration: 1.3,
      ease: 'expo.out',
      stagger: 0.14,
      onComplete: function () {
        // Reveal done — drop the mask so descenders (the y!) never clip
        gsap.set('.hero-line', { overflow: 'visible' });
      }
    })
    .to('.hero-eyebrow', {
      opacity: 1,
      duration: 0.9,
      ease: 'power3.out'
    }, '-=0.9')
    .to('.hero-descriptor', {
      opacity: 1,
      duration: 0.9,
      ease: 'power3.out'
    }, '-=0.6')
    .to('.hero-sub', {
      opacity: 1,
      duration: 0.9,
      ease: 'power3.out'
    }, '-=0.7')
    .to('.scroll-hint', {
      opacity: 1,
      duration: 0.7,
      ease: 'power3.out'
    }, '-=0.5');

    // Hero progress bar tied to scroll
    var heroProgress = document.getElementById('hero-progress');
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

    // Gentle parallax + fade on hero content
    gsap.to('.hero-inner', {
      yPercent: -18,
      opacity: 0.25,
      ease: 'none',
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 0.6
      }
    });
  }

  /* ── MANIFESTO ───────────────────────────────────────────── */
  function initManifesto() {
    document.querySelectorAll('.manifesto-item').forEach(function (item) {
      var text = item.querySelector('.mf-text');
      var num  = item.querySelector('.mf-num');

      gsap.from([num, text], {
        opacity: 0,
        y: 50,
        duration: 1.1,
        stagger: 0.12,
        ease: 'expo.out',
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
    var targets = [
      '.section-label',
      '.about-big',
      '.about-meta-item',
      '.exp-card',
      '.cert-card',
      '.edu-row',
      '.lead-col',
      '.contact-eyebrow',
      '.contact-heading',
      '.contact-email',
      '.contact-socials'
    ];

    targets.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el) {
        gsap.from(el, {
          opacity: 0,
          y: 45,
          duration: 1.1,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        });
      });
    });
  }

  /* ── PROJECT ROWS ────────────────────────────────────────── */
  function initProjects() {
    document.querySelectorAll('.project-row').forEach(function (row) {
      var media = row.querySelector('.project-media');
      var info  = row.querySelectorAll('.project-num, .project-name, .project-tagline, .project-desc, .project-stat, .project-tag-row, .project-link');
      var isReversed = row.classList.contains('reverse');

      // Slide media in from the side
      gsap.from(media, {
        x: isReversed ? 70 : -70,
        opacity: 0,
        duration: 1.3,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: row,
          start: 'top 78%',
          toggleActions: 'play none none none'
        }
      });

      // Stagger info elements
      gsap.from(info, {
        opacity: 0,
        y: 30,
        duration: 0.9,
        stagger: 0.07,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: row,
          start: 'top 72%',
          toggleActions: 'play none none none'
        }
      });
    });
  }

  /* ── SKILLS STAGGER ──────────────────────────────────────── */
  function initSkills() {
    gsap.from('.skills-col', {
      opacity: 0,
      y: 45,
      duration: 0.9,
      stagger: 0.09,
      ease: 'expo.out',
      scrollTrigger: {
        trigger: '.skills-grid',
        start: 'top 82%',
        toggleActions: 'play none none none'
      }
    });
  }

  /* ── HERO DITHERING CANVAS ──────────────────────────────── */
  function initDitheringCanvas() {
    var canvas = document.getElementById('hero-dither');
    if (!canvas) return;

    var ctx  = canvas.getContext('2d');
    var time = 0;
    var heroVisible = true;

    // Pause rendering when the hero scrolls out of view
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        heroVisible = entries[0].isIntersecting;
      }).observe(canvas);
    }

    // 4×4 Bayer ordered-dither matrix
    var BAYER = [
      [ 0,  8,  2, 10],
      [12,  4, 14,  6],
      [ 3, 11,  1,  9],
      [15,  7, 13,  5]
    ];

    // Accent colour follows the active theme via --accent-rgb
    var rgb = [216, 185, 140];

    function refreshAccent() {
      var v = getComputedStyle(document.documentElement)
        .getPropertyValue('--accent-rgb').trim();
      var parts = v.split(',').map(function (s) { return parseInt(s, 10); });
      if (parts.length === 3 && parts.every(function (n) { return !isNaN(n); })) {
        rgb = parts;
      }
    }

    document.addEventListener('themechange', function () {
      refreshAccent();
      if (prefersReduced) drawFrame();
    });
    refreshAccent();

    function resize() {
      canvas.width  = canvas.offsetWidth  || 1;
      canvas.height = canvas.offsetHeight || 1;
    }

    /* ── Shape fields ─────────────────────────────────────────
       Each returns brightness 0–1 at normalised coords
       (nx right, ny down). The blob morphs through these shapes
       in a dithered pixel-dissolve: blob → heart → star → smiley. */

    function clamp01(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }

    function blobField(nx, ny, t) {
      var r = Math.sqrt(nx * nx + ny * ny);
      var a = Math.atan2(ny, nx);
      var radius =
        0.36
        + 0.07 * Math.sin(2 * a + t * 0.55)
        + 0.05 * Math.sin(3 * a - t * 0.38)
        + 0.03 * Math.sin(5 * a + t * 0.72)
        + 0.02 * Math.sin(7 * a - t * 0.28);
      return clamp01(1 - (r - radius) / 0.07);
    }

    function heartField(nx, ny, t) {
      // Classic implicit heart curve, gently beating
      var s = 0.40 * (1 + 0.04 * Math.sin(t * 2.4));
      var X = nx / s;
      var Y = (-ny + 0.02) / s;
      var q = X * X + Y * Y - 1;
      var F = q * q * q - X * X * Y * Y * Y;
      return clamp01(0.5 - F * 4);
    }

    function starField(nx, ny, t) {
      var r = Math.sqrt(nx * nx + ny * ny);
      var a = Math.atan2(-ny, nx) + t * 0.16; // slow spin
      var u = 0.5 + 0.5 * Math.cos(5 * (a - Math.PI / 2));
      var radius = 0.17 + 0.31 * Math.pow(u, 2.4);
      return clamp01(1 - (r - radius) / 0.06);
    }

    function smileyField(nx, ny, t) {
      var my = -ny + 0.015 * Math.sin(t * 0.9); // gentle bob
      var r = Math.sqrt(nx * nx + my * my);
      var face = clamp01(1 - (r - 0.34) / 0.05);
      var dl = Math.sqrt((nx + 0.12) * (nx + 0.12) + (my - 0.11) * (my - 0.11));
      var dr = Math.sqrt((nx - 0.12) * (nx - 0.12) + (my - 0.11) * (my - 0.11));
      var eyes = clamp01(1 - (Math.min(dl, dr) - 0.05) / 0.03);
      var phi = Math.atan2(my + 0.02, nx);
      var band = clamp01(1 - (Math.abs(r - 0.21) - 0.035) / 0.03);
      var mouth = (phi > -2.35 && phi < -0.79) ? band : 0;
      return Math.max(0, face - eyes - mouth);
    }

    var SHAPES = [blobField, heartField, starField, smileyField];
    var HOLD = 2.2;  // ≈3.7 s per shape (time advances 0.01/frame)
    var FADE = 0.9;  // ≈1.5 s dissolve between shapes

    function field(nx, ny, t) {
      var cycle = HOLD + FADE;
      var ct = t % (SHAPES.length * cycle);
      var idx = Math.floor(ct / cycle);
      var within = ct - idx * cycle;
      var vA = SHAPES[idx](nx, ny, t);
      if (within <= HOLD) return vA;
      var e = (within - HOLD) / FADE;
      e = e * e * (3 - 2 * e); // smoothstep
      var vB = SHAPES[(idx + 1) % SHAPES.length](nx, ny, t);
      return vA * (1 - e) + vB * e;
    }

    function drawFrame() {
      var w  = canvas.width;
      var h  = canvas.height;
      var s  = Math.min(w, h);
      var px = 4;

      var imgData = ctx.createImageData(w, h);
      var data    = imgData.data;

      for (var y = 0; y < h; y += px) {
        for (var x = 0; x < w; x += px) {
          var nx = (x - w * 0.5) / s;
          var ny = (y - h * 0.45) / s;

          var v   = field(nx, ny, time);
          var bx  = Math.floor(x / px) & 3;
          var by  = Math.floor(y / px) & 3;
          var thr = BAYER[by][bx] / 16;

          if (v > thr) {
            for (var py = 0; py < px && (y + py) < h; py++) {
              var row = (y + py) * w * 4;
              for (var qx = 0; qx < px && (x + qx) < w; qx++) {
                var i       = row + (x + qx) * 4;
                data[i]     = rgb[0];
                data[i + 1] = rgb[1];
                data[i + 2] = rgb[2];
                data[i + 3] = 220;
              }
            }
          }
        }
      }

      ctx.clearRect(0, 0, w, h);
      ctx.putImageData(imgData, 0, 0);
    }

    function render() {
      requestAnimationFrame(render);
      if (!heroVisible) return;
      time += 0.010;
      drawFrame();
    }

    window.addEventListener('resize', resize);
    resize();

    if (prefersReduced) {
      drawFrame(); // single static frame
    } else {
      render();
    }
  }

  /* ── BOOT ────────────────────────────────────────────────── */
  function boot() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      console.warn('[portfolio] GSAP not loaded — animations disabled.');
      document.documentElement.classList.add('no-anim');
      var loader = document.getElementById('preloader');
      if (loader) loader.style.display = 'none';
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    initThemeSwitcher();
    initLenis();
    initAnchors();
    initDitheringCanvas();

    runPreloader(function () {
      initCursor();
      initNav();
      initHero();

      if (!prefersReduced) {
        initManifesto();
        initReveal();
        initProjects();
        initSkills();
      }

      // Refresh ScrollTrigger after layout settles
      setTimeout(function () {
        ScrollTrigger.refresh();
      }, 150);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

})();
