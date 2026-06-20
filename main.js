/* ============================================================
   Gabriel Aires — portfolio
   Small, dependency-free progressive enhancements:
     1. Dynamic footer year
     2. On-appear (page load) word-by-word hero reveal
     3. Reveal-on-scroll (mirrors Framer's "appear" effect)
   ============================================================ */

(function () {
  "use strict";

  // 1. Keep the footer year current.
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  var prefersReduced =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // 2. On-appear: split the hero heading into words and reveal them
  //    one after another on page load, like the Framer "appear" effect.
  var heading = document.querySelector(".intro .display");
  if (heading && !prefersReduced) {
    var words = heading.textContent.trim().split(/\s+/);
    heading.textContent = "";
    var wrappers = [];
    words.forEach(function (word, i) {
      var outer = document.createElement("span");
      outer.className = "split-word";
      var inner = document.createElement("span");
      inner.textContent = word;
      inner.style.setProperty("--word-delay", (i * 0.09).toFixed(2) + "s");
      outer.appendChild(inner);
      heading.appendChild(outer);
      // Preserve spaces between words.
      if (i < words.length - 1) heading.appendChild(document.createTextNode(" "));
      wrappers.push(outer);
    });
    // Trigger on next frame so the initial (hidden) state paints first.
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        wrappers.forEach(function (w) { w.classList.add("is-in"); });
      });
    });
  }

  // 3. Reveal elements as they enter the viewport.
  var revealEls = document.querySelectorAll("[data-reveal]");
  if (!revealEls.length) return;

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
