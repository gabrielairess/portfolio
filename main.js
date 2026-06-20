/* ============================================================
   Gabriel Aires — portfolio
   Small, dependency-free progressive enhancements:
     1. Dynamic footer year
     2. Reveal-on-scroll (mirrors Framer's "appear" effect)
   ============================================================ */

(function () {
  "use strict";

  // 1. Keep the footer year current.
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // 2. Reveal elements as they enter the viewport.
  var revealEls = document.querySelectorAll("[data-reveal]");
  if (!revealEls.length) return;

  var prefersReduced =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // No motion / no observer support → just show everything immediately.
  if (prefersReduced || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target); // reveal once, then stop watching
        }
      });
    },
    { rootMargin: "0px 0px -10% 0px", threshold: 0.1 }
  );

  revealEls.forEach(function (el) {
    observer.observe(el);
  });
})();
