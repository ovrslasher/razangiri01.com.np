(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Mobile nav toggle ---------- */
  var navToggle = document.getElementById("navToggle");
  var navLinks = document.getElementById("navLinks");

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      var isOpen = navLinks.classList.toggle("open");
      navToggle.classList.toggle("open", isOpen);
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navLinks.classList.remove("open");
        navToggle.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  var growthFills = document.querySelectorAll(".growth-fill");

  if ("IntersectionObserver" in window && !reduceMotion) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach(function (el) { revealObserver.observe(el); });

    var growthObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate");
            growthObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    growthFills.forEach(function (el) { growthObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
    growthFills.forEach(function (el) { el.classList.add("animate"); });
  }

  /* ---------- Active nav link on scroll ---------- */
  var sections = ["about", "education", "skills", "work", "contact"]
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);
  var navAnchors = document.querySelectorAll('.nav-links a[data-nav]');

  function updateActiveNav() {
    var scrollPos = window.scrollY + window.innerHeight * 0.35;
    var current = null;
    sections.forEach(function (sec) {
      if (sec.offsetTop <= scrollPos) current = sec.id;
    });
    navAnchors.forEach(function (a) {
      var match = a.getAttribute("href") === "#" + current;
      a.classList.toggle("active", match);
    });
  }
  window.addEventListener("scroll", updateActiveNav, { passive: true });
  updateActiveNav();

  /* ---------- Badge: scan-in + parallax tilt ---------- */
  var badge = document.getElementById("badge");
  var badgeStatus = document.getElementById("badgeStatus");

  if (badge) {
    // one-time scan animation on load
    window.addEventListener("load", function () {
      setTimeout(function () {
        badge.classList.add("scanning");
        setTimeout(function () {
          if (badgeStatus) {
            badgeStatus.textContent = "VERIFIED";
            badgeStatus.classList.add("verified");
          }
        }, 900);
      }, 500);
    });

    // subtle mouse-parallax tilt (desktop, non-touch, motion allowed)
    var isFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (isFinePointer && !reduceMotion) {
      var bounds;
      badge.addEventListener("mouseenter", function () {
        bounds = badge.getBoundingClientRect();
      });
      badge.addEventListener("mousemove", function (e) {
        if (!bounds) bounds = badge.getBoundingClientRect();
        var px = (e.clientX - bounds.left) / bounds.width - 0.5;
        var py = (e.clientY - bounds.top) / bounds.height - 0.5;
        var rotX = (-py * 10).toFixed(2);
        var rotY = (px * 12).toFixed(2);
        badge.style.transform =
          "rotateX(" + rotX + "deg) rotateY(" + rotY + "deg) translateY(-4px)";
      });
      badge.addEventListener("mouseleave", function () {
        badge.style.transform = "rotateX(0deg) rotateY(0deg) translateY(0px)";
      });
    }
  }
})();
