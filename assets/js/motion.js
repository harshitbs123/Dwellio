/**
 * ==========================================================================
 * DWELLIO LIGHTWEIGHT MOTION SCRIPT
 * Preserved Cinematic Hero Entrance + Pure CSS Interactive Animations
 * ==========================================================================
 */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.addEventListener('DOMContentLoaded', () => {
    // 1. Preloader & Cinematic Hero Entrance (Preserved exactly as designed)
    initPreloaderAndHero();

    // 2. Simple Passive Navbar Scroll State (Pure CSS-driven styling)
    initNavbarScroll();

    // 3. Lightweight Click Interactions
    initMicroInteractions();
  });

  /* --------------------------------------------------------------------------
     1. PRELOADER & CINEMATIC HERO ENTRANCE SEQUENCE
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
    const duration = hasEnteredBefore ? 200 : 650;
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
            if (preloader) preloader.remove();
          },
        });

        tl.to(preloader, {
          yPercent: -100,
          duration: 0.55,
          ease: 'expo.inOut',
        });

        tl.add(() => {
          playHeroEntranceTimeline();
        }, '-=0.3');
      } else {
        preloader.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
        preloader.style.transform = 'translateY(-100%)';
        setTimeout(() => {
          if (preloader) preloader.remove();
          revealHeroDirectly();
        }, 400);
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
        const elementsToClean = document.querySelectorAll(
          '.hero-eyebrow, .hero-title-line, .hero-subtitle, .hero-search-wrap, .hero-trending-tag'
        );
        elementsToClean.forEach((el) => {
          el.style.transform = '';
          el.style.opacity = '';
        });
      },
    });

    tl.fromTo('header nav', { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, clearProps: 'transform,opacity' }, 0.05);

    const eyebrow = document.querySelector('.hero-eyebrow');
    if (eyebrow) {
      tl.fromTo(eyebrow, { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, 0.1);
    }

    const titleLines = document.querySelectorAll('.hero-title-line');
    if (titleLines.length > 0) {
      tl.fromTo(titleLines, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.65, stagger: 0.07 }, 0.16);
    }

    const subtitle = document.querySelector('.hero-subtitle');
    if (subtitle) {
      tl.fromTo(subtitle, { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55 }, 0.28);
    }

    const searchWrap = document.querySelector('.hero-search-wrap');
    if (searchWrap) {
      tl.fromTo(searchWrap, { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, 0.35);
    }

    const tags = document.querySelectorAll('.hero-trending-tag');
    if (tags.length > 0) {
      tl.fromTo(tags, { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, stagger: 0.02 }, 0.45);
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
     2. NAVBAR DYNAMIC SCROLL STATE (PASSIVE, 0% CPU)
     -------------------------------------------------------------------------- */
  function initNavbarScroll() {
    const nav = document.querySelector('header nav');
    if (!nav) return;

    let isScrolled = false;

    function onScroll() {
      const shouldScroll = (window.scrollY || window.pageYOffset) > 40;
      if (shouldScroll !== isScrolled) {
        isScrolled = shouldScroll;
        nav.classList.toggle('nav-scrolled', isScrolled);
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* --------------------------------------------------------------------------
     3. LIGHTWEIGHT CLICK INTERACTIONS (PURE CSS ANIMATION TRIGGER)
     -------------------------------------------------------------------------- */
  function initMicroInteractions() {
    // Wishlist Heart Pop (Triggers pure CSS @keyframes heartPop)
    const heartBtns = document.querySelectorAll('.heart-btn-motion');
    heartBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        btn.classList.toggle('liked');

        // Trigger CSS keyframe pop animation without GSAP
        btn.classList.remove('pop');
        void btn.offsetWidth; // Force reflow for re-trigger
        btn.classList.add('pop');
      });
    });

    // Categories Strip Horizontal Drag (mousedown only)
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
