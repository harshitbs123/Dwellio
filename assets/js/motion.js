/**
 * ==========================================================================
 * DWELLIO ULTRA-LIGHT MOTION & INTERACTION ENGINE
 * 100% GPU-composited, minimal CPU footprint, battery & resource friendly
 * ==========================================================================
 */

(function () {
  'use strict';

  // Check reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Wait for DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    initMotionSystem();
  });

  function initMotionSystem() {
    // 1. Initialize Lenis Smooth Scrolling (Unified RAF loop with GSAP ticker)
    const lenis = initLenis();

    // 2. Preloader & Hero Entrance (Preserved look, 100% GPU-composited)
    initPreloaderAndHero();

    // 3. Navbar Dynamic Scroll State
    initNavbarScroll(lenis);

    // 4. Fast, Responsive Section Animations (Single parent triggers)
    initSectionAnimations();

    // 5. Lightweight Micro-Interactions (Click-only, 0% scroll overhead)
    initMicroInteractions();
  }

  /* --------------------------------------------------------------------------
     1. LENIS SMOOTH SCROLLING (COMPACT & LAG-FREE)
     -------------------------------------------------------------------------- */
  function initLenis() {
    if (prefersReducedMotion || typeof Lenis === 'undefined') {
      return null;
    }

    try {
      const lenis = new Lenis({
        lerp: 0.1, // Fast, natural 60/120fps momentum without rubber-band lag
        smoothWheel: true,
      });

      // Direct display vsync loop
      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);

      // Sync with ScrollTrigger
      if (typeof ScrollTrigger !== 'undefined') {
        lenis.on('scroll', ScrollTrigger.update);
      }

      // Smooth internal anchor jumps (#about, etc.)
      document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (e) => {
          const href = anchor.getAttribute('href');
          if (href && href.length > 1) {
            const target = document.querySelector(href);
            if (target) {
              e.preventDefault();
              lenis.scrollTo(target, { offset: -70 });
            }
          }
        });
      });

      window.dwellioLenis = lenis;
      return lenis;
    } catch (e) {
      console.warn('Lenis bypass:', e);
      return null;
    }
  }

  /* --------------------------------------------------------------------------
     2. PRELOADER & HERO ENTRANCE SEQUENCE (100% GPU COMPOSITED)
     -------------------------------------------------------------------------- */
  function initPreloaderAndHero() {
    const preloader = document.getElementById('dwellioPreloader');
    const counter = document.getElementById('preloaderCounter');
    const bar = document.getElementById('preloaderBar');

    if (!preloader || prefersReducedMotion) {
      if (preloader) preloader.remove();
      revealHeroDirectly();
      return;
    }

    const hasEnteredBefore = sessionStorage.getItem('dwellio_session_entered');
    const duration = hasEnteredBefore ? 1520 : 5000; // keep first-visit preloader visible for 5 seconds

    const startTime = performance.now();

    function updateCounter(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const percentage = Math.round(progress * 100);

      if (counter) counter.textContent = percentage + '%';
      if (bar) bar.style.width = percentage + '%';

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        completePreloader();
      }
    }

    requestAnimationFrame(updateCounter);

    function completePreloader() {
      sessionStorage.setItem('dwellio_session_entered', 'true');

      if (typeof gsap !== 'undefined') {
        const tl = gsap.timeline({
          onComplete: () => {
            // Completely remove preloader node from DOM to free GPU & memory
            if (preloader) preloader.remove();
          },
        });

        tl.to(preloader, {
          yPercent: -100,
          duration: 0.6,
          ease: 'expo.inOut',
        });

        tl.add(() => {
          playHeroEntranceTimeline();
        }, '-=0.35');
      } else {
        preloader.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
        preloader.style.transform = 'translateY(-100%)';
        setTimeout(() => {
          if (preloader) preloader.remove();
          revealHeroDirectly();
        }, 500);
      }
    }
  }

  function playHeroEntranceTimeline() {
    if (typeof gsap === 'undefined') {
      revealHeroDirectly();
      return;
    }

    const tl = gsap.timeline({
      defaults: { ease: 'power2.out' },
      onComplete: () => {
        // Clear all inline styles so elements return to pure static CSS tree
        const elementsToClean = document.querySelectorAll(
          '.hero-eyebrow, .hero-title-line, .hero-subtitle, .hero-search-wrap, .hero-trending-tag'
        );
        elementsToClean.forEach((el) => {
          el.style.transform = '';
          el.style.opacity = '';
          el.style.filter = '';
        });
      },
    });

    // Navbar entrance (transform & opacity only - 0% CPU)
    tl.fromTo(
      'header nav',
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.65, clearProps: 'transform,opacity' },
      0.05
    );

    // Eyebrow tag
    const eyebrow = document.querySelector('.hero-eyebrow');
    if (eyebrow) {
      tl.fromTo(eyebrow, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55 }, 0.1);
    }

    // Hero title lines (slide up smoothly inside line masks)
    const titleLines = document.querySelectorAll('.hero-title-line');
    if (titleLines.length > 0) {
      tl.fromTo(
        titleLines,
        { y: 32, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.08 },
        0.18
      );
    }

    // Subtitle
    const subtitle = document.querySelector('.hero-subtitle');
    if (subtitle) {
      tl.fromTo(subtitle, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, 0.32);
    }

    // Search bar container
    const searchWrap = document.querySelector('.hero-search-wrap');
    if (searchWrap) {
      tl.fromTo(
        searchWrap,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.65 },
        0.4
      );
    }

    // Trending destination tags
    const tags = document.querySelectorAll('.hero-trending-tag');
    if (tags.length > 0) {
      tl.fromTo(tags, { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, stagger: 0.025 }, 0.5);
    }
  }

  function revealHeroDirectly() {
    const eyebrow = document.querySelector('.hero-eyebrow');
    const titleLines = document.querySelectorAll('.hero-title-line');
    const subtitle = document.querySelector('.hero-subtitle');
    const searchWrap = document.querySelector('.hero-search-wrap');
    const tags = document.querySelectorAll('.hero-trending-tag');

    if (eyebrow) eyebrow.style.opacity = '1';
    titleLines.forEach((l) => {
      l.style.opacity = '1';
      l.style.transform = 'none';
    });
    if (subtitle) subtitle.style.opacity = '1';
    if (searchWrap) searchWrap.style.opacity = '1';
    tags.forEach((t) => (t.style.opacity = '1'));
  }

  /* --------------------------------------------------------------------------
     3. NAVBAR DYNAMIC SCROLL STATE (ZERO DOM THRASHING)
     -------------------------------------------------------------------------- */
  function initNavbarScroll(lenis) {
    const nav = document.querySelector('header nav');
    if (!nav) return;

    let isScrolled = false;

    function updateNavState(scrollY) {
      const shouldScroll = scrollY > 40;
      if (shouldScroll !== isScrolled) {
        isScrolled = shouldScroll;
        nav.classList.toggle('nav-scrolled', isScrolled);
      }
    }

    if (lenis) {
      lenis.on('scroll', ({ scroll }) => {
        updateNavState(scroll);
      });
    } else {
      window.addEventListener(
        'scroll',
        () => {
          updateNavState(window.scrollY || window.pageYOffset || 0);
        },
        { passive: true }
      );
    }

    updateNavState(window.scrollY || window.pageYOffset || 0);
  }

  /* --------------------------------------------------------------------------
     4. FAST, LOW-CPU SECTION ANIMATIONS (SINGLE PARENT TRIGGERS)
     -------------------------------------------------------------------------- */
  function initSectionAnimations() {
    if (prefersReducedMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      return;
    }

    // A. CATEGORIES STRIP: Quick, clean reveal
    const categoryStrip = document.querySelector('.categories-strip-section');
    if (categoryStrip) {
      const items = categoryStrip.querySelectorAll('.category-pill');
      if (items.length > 0) {
        gsap.fromTo(
          items,
          { opacity: 0, y: 12 },
          {
            opacity: 1,
            y: 0,
            duration: 0.35,
            stagger: 0.025,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: categoryStrip,
              start: 'top 92%',
              once: true,
            },
            clearProps: 'transform,opacity',
          }
        );
      }
    }

    // B. FEATURED LISTINGS: Fast slide-up + fade-in (single parent trigger)
    const featuredSection = document.getElementById('featuredStaysSection');
    if (featuredSection) {
      const staysHeader = featuredSection.querySelector('.featured-stays-header');
      const cards = featuredSection.querySelectorAll('.featured-listing-card');

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: featuredSection,
          start: 'top 85%',
          once: true,
        },
      });

      if (staysHeader) {
        tl.fromTo(
          staysHeader,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out', clearProps: 'transform,opacity' },
          0
        );
      }

      if (cards.length > 0) {
        tl.fromTo(
          cards,
          { opacity: 0, y: 22 },
          {
            opacity: 1,
            y: 0,
            duration: 0.42,
            stagger: 0.05,
            ease: 'power2.out',
            clearProps: 'transform,opacity',
          },
          0.04
        );
      }
    }

    // C. WHY DWELLIO PILLARS: Single parent trigger
    const pillarsSection = document.getElementById('pillarsSection');
    if (pillarsSection) {
      const pillarsHeader = pillarsSection.querySelector('.pillars-header');
      const pillarCards = pillarsSection.querySelectorAll('.pillar-card');

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pillarsSection,
          start: 'top 85%',
          once: true,
        },
      });

      if (pillarsHeader) {
        tl.fromTo(
          pillarsHeader,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out', clearProps: 'transform,opacity' },
          0
        );
      }

      if (pillarCards.length > 0) {
        tl.fromTo(
          pillarCards,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            stagger: 0.05,
            ease: 'power2.out',
            clearProps: 'transform,opacity',
          },
          0.04
        );
      }
    }

    // D. BECOME A HOST CALLOUT: Single parent trigger
    const hostSection = document.getElementById('hostSection');
    if (hostSection) {
      const hostCard = hostSection.querySelector('.host-callout-card');
      if (hostCard) {
        gsap.fromTo(
          hostCard,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.45,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: hostSection,
              start: 'top 85%',
              once: true,
            },
            clearProps: 'transform,opacity',
          }
        );
      }
    }
  }

  /* --------------------------------------------------------------------------
     5. LIGHTWEIGHT MICRO-INTERACTIONS (ZERO SCROLL OVERHEAD)
     -------------------------------------------------------------------------- */
  function initMicroInteractions() {
    // A. Wishlist Heart Pop (click-only, 0% CPU on scroll)
    const heartBtns = document.querySelectorAll('.heart-btn-motion');
    heartBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        btn.classList.toggle('liked');

        if (typeof gsap !== 'undefined') {
          gsap.fromTo(
            btn,
            { scale: 0.8 },
            { scale: 1.18, duration: 0.18, yoyo: true, repeat: 1, ease: 'back.out(2)', clearProps: 'transform' }
          );
        }
      });
    });

    // B. Categories Strip Horizontal Drag (mousedown only)
    const slider = document.querySelector('.categories-drag-strip');
    if (slider) {
      let isDown = false;
      let startX = 0;
      let scrollLeft = 0;

      slider.addEventListener('mousedown', (e) => {
        isDown = true;
        slider.classList.add('active');
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
      });

      window.addEventListener('mouseup', () => {
        isDown = false;
        slider.classList.remove('active');
      });

      slider.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 1.5;
        slider.scrollLeft = scrollLeft - walk;
      });
    }
  }
})();
