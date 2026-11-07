/* Smooth page scroll — Lenis defaults matching jacobmedia.com
   (lerp 0.1, smoothWheel, wheelMultiplier 1, 60fps RAF). */
(function () {
  'use strict';
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (typeof Lenis !== 'function') return;

  const lenis = new Lenis({
    lerp: 0.1,
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1,
    syncTouch: false,
    // Gate for Our Story center-hold tension (defined in index.html)
    virtualScroll: (data) => {
      if (typeof window.__storyScrollHold === 'function') {
        return window.__storyScrollHold(data);
      }
    },
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  window.__lenis = lenis;
})();
