/**
 * Bottero Studios — Scroll reveal, smooth scroll, nav active state
 * Vanilla JS + Intersection Observer. No heavy animation libs.
 */
(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ----- Reveal on scroll ----- */
  function initReveal() {
    if (prefersReducedMotion) {
      document.querySelectorAll('.reveal-item').forEach(function (el) {
        el.classList.add('revealed');
      });
      return;
    }
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      },
      { rootMargin: '0px 0px -40px 0px', threshold: 0.01 }
    );
    document.querySelectorAll('.reveal-item').forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ----- Smooth scroll to anchors ----- */
  function initSmoothScroll() {
    document.querySelectorAll('.js-smooth-scroll').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var href = this.getAttribute('href');
        if (href && href.charAt(0) === '#' && href.length > 1) {
          e.preventDefault();
          var target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      });
    });
  }

  /* ----- Sticky header: add background on scroll ----- */
  function initHeaderScroll() {
    var header = document.getElementById('main-header');
    if (!header) return;
    function updateHeader() {
      if (window.scrollY > 40) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    }
    window.addEventListener('scroll', updateHeader, { passive: true });
    updateHeader();
  }

  /* ----- Optional: set nav active link by section in view ----- */
  function initNavActive() {
    var navLinks = document.querySelectorAll('.header__nav__menu a[href^="#"]');
    if (!navLinks.length) return;
    var sections = [];
    navLinks.forEach(function (link) {
        var id = link.getAttribute('href').slice(1);
        var section = document.getElementById(id);
        if (section) sections.push({ id: id, el: section, link: link });
    });
    function updateActive() {
      var scrollY = window.scrollY;
      var innerHeight = window.innerHeight;
      var best = null;
      sections.forEach(function (s) {
        var rect = s.el.getBoundingClientRect();
        if (rect.top <= innerHeight * 0.3 && rect.bottom >= 0) best = s;
      });
      sections.forEach(function (s) {
        s.link.parentElement.classList.toggle('active', s === best);
      });
    }
    window.addEventListener('scroll', updateActive, { passive: true });
    updateActive();
  }

  /* ----- Run when DOM ready ----- */
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  ready(function () {
    initReveal();
    initSmoothScroll();
    initHeaderScroll();
    initNavActive();
  });
})();
