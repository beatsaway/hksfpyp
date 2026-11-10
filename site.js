(function () {
  var body = document.body;
  var toggle = document.querySelector("[data-nav-toggle]");
  var backdrop = document.querySelector("[data-nav-backdrop]");
  var sidebar = document.getElementById("site-nav");

  function setOpen(open) {
    body.classList.toggle("nav-open", open);
    if (toggle) toggle.setAttribute("aria-expanded", open ? "true" : "false");
    if (sidebar) sidebar.setAttribute("aria-hidden", open ? "false" : String(window.matchMedia("(max-width: 920px)").matches));
  }

  function close() { setOpen(false); }

  if (toggle) {
    toggle.addEventListener("click", function () {
      setOpen(!body.classList.contains("nav-open"));
    });
  }
  if (backdrop) backdrop.addEventListener("click", close);

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") close();
  });

  if (sidebar) {
    sidebar.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener("click", function () {
        if (window.matchMedia("(max-width: 920px)").matches) close();
      });
    });
  }

  // Mark in-page section links active while scrolling
  var sectionLinks = sidebar ? Array.prototype.slice.call(sidebar.querySelectorAll('a[href^="#"]')) : [];
  var sections = sectionLinks
    .map(function (a) { return document.getElementById(a.getAttribute("href").slice(1)); })
    .filter(Boolean);

  function syncActive() {
    if (!sections.length) return;
    var y = window.scrollY + 120;
    var current = sections[0];
    sections.forEach(function (sec) {
      if (sec.offsetTop <= y) current = sec;
    });
    sectionLinks.forEach(function (a) {
      a.classList.toggle("is-active", a.getAttribute("href") === "#" + current.id);
    });
  }

  if (sections.length) {
    window.addEventListener("scroll", syncActive, { passive: true });
    syncActive();
  }
})();
