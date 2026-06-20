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

  // 3. Reveal elements as they enter the viewport (and on first load).
  var revealEls = document.querySelectorAll("[data-reveal]");

  if (revealEls.length) {
    // No motion / no observer support → just show everything immediately.
    if (prefersReduced || !("IntersectionObserver" in window)) {
      revealEls.forEach(function (el) { el.classList.add("is-visible"); });
    } else {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target); // reveal once, then stop watching
            }
          });
        },
        // Reveal a touch before fully in view; trigger as soon as any part shows.
        { rootMargin: "0px 0px -5% 0px", threshold: 0 }
      );

      revealEls.forEach(function (el) { observer.observe(el); });

      // Safety net: if anything is already within the viewport on load
      // (e.g. above the fold), reveal it right away so the page is never
      // blank on first paint. Also a final fallback after 1.2s.
      var revealInView = function () {
        var vh = window.innerHeight || document.documentElement.clientHeight;
        revealEls.forEach(function (el) {
          if (el.classList.contains("is-visible")) return;
          var r = el.getBoundingClientRect();
          if (r.top < vh && r.bottom > 0) el.classList.add("is-visible");
        });
      };
      requestAnimationFrame(revealInView);
      window.addEventListener("load", revealInView);
      setTimeout(function () {
        revealEls.forEach(function (el) { el.classList.add("is-visible"); });
      }, 1200);
    }
  }

  // 4. Adaptive header: flip to light text when a dark-backed section is
  //    under the top bar. The page is light overall, so this mainly keeps
  //    the header readable as content scrolls past. Sections (or elements)
  //    tagged with [data-dark] drive the toggle.
  var topbar = document.querySelector(".topbar");
  var darkZones = document.querySelectorAll("[data-dark]");
  if (topbar && darkZones.length && "IntersectionObserver" in window) {
    var headerH = topbar.offsetHeight || 80;
    var darkObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          entry.target.__overHeader = entry.isIntersecting;
        });
        var anyDark = Array.prototype.some.call(darkZones, function (z) {
          return z.__overHeader;
        });
        topbar.classList.toggle("is-dark", anyDark);
      },
      // A thin band right under the header; when a dark zone overlaps it, flip.
      { rootMargin: "0px 0px -" + (window.innerHeight - headerH) + "px 0px", threshold: 0 }
    );
    darkZones.forEach(function (z) { darkObserver.observe(z); });
  }
})();
