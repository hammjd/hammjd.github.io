(function () {
  "use strict";

  var header = document.querySelector(".site-header");
  var navLinks = Array.prototype.slice.call(
    document.querySelectorAll(".site-nav a[href*=\"#\"]")
  );

  var sections = [];
  navLinks.forEach(function (link) {
    var hash = link.getAttribute("href").split("#")[1];
    if (!hash) return;
    var el = document.getElementById(hash);
    if (el) sections.push({ link: link, el: el, id: hash });
  });

  // Nothing to track on this page (e.g. /course/, /impressum/): no-op.
  if (!sections.length) return;

  var ticking = false;
  var activeId = null;

  function setActive(id) {
    if (id === activeId) return;
    activeId = id;
    sections.forEach(function (s) {
      var isActive = s.id === id;
      s.link.classList.toggle("active", isActive);
      if (isActive) {
        s.link.setAttribute("aria-current", "location");
      } else {
        s.link.removeAttribute("aria-current");
      }
    });
  }

  function currentSectionId() {
    var headerHeight = header ? header.offsetHeight : 0;
    var activationLine = headerHeight + 8;
    var currentId = sections[0].id;

    for (var i = 0; i < sections.length; i++) {
      var top = sections[i].el.getBoundingClientRect().top;
      if (top - activationLine <= 0) {
        currentId = sections[i].id;
      }
    }

    var atBottom =
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 2;
    if (atBottom) {
      currentId = sections[sections.length - 1].id;
    }

    return currentId;
  }

  function update() {
    ticking = false;
    setActive(currentSectionId());
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(update);
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);

  // Immediate feedback on click, ahead of the smooth-scroll animation.
  sections.forEach(function (s) {
    s.link.addEventListener("click", function () {
      setActive(s.id);
    });
  });

  update();
})();
