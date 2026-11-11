(function () {
  var body = document.body;
  var toggles = Array.prototype.slice.call(document.querySelectorAll("[data-nav-toggle]"));
  var backdrop = document.querySelector("[data-nav-backdrop]");
  var sidebar = document.getElementById("site-nav");
  var content = document.querySelector(".content");
  var mq = window.matchMedia("(max-width: 920px)");
  var storageKey = "hksf-nav-collapsed";

  function isMobile() {
    return mq.matches;
  }

  function syncToggleState() {
    var expanded;
    if (isMobile()) {
      expanded = body.classList.contains("nav-open");
    } else {
      expanded = !body.classList.contains("nav-collapsed");
    }
    toggles.forEach(function (btn) {
      btn.setAttribute("aria-expanded", expanded ? "true" : "false");
      var label = btn.querySelector(".home-btn-label");
      if (label) {
        label.textContent = expanded ? "Collapse navigation" : "Expand navigation";
      }
      btn.setAttribute("aria-label", expanded ? "Collapse navigation" : "Expand navigation");
      btn.title = expanded ? "Collapse left panel" : "Expand left panel";
    });
    if (sidebar) {
      if (isMobile()) {
        sidebar.setAttribute("aria-hidden", expanded ? "false" : "true");
      } else {
        sidebar.removeAttribute("aria-hidden");
      }
    }
  }

  function setMobileOpen(open) {
    body.classList.toggle("nav-open", open);
    syncToggleState();
  }

  function setCollapsed(collapsed) {
    body.classList.toggle("nav-collapsed", collapsed);
    try {
      localStorage.setItem(storageKey, collapsed ? "1" : "0");
    } catch (err) {}
    syncToggleState();
  }

  function toggleNav() {
    if (isMobile()) {
      setMobileOpen(!body.classList.contains("nav-open"));
      return;
    }
    setCollapsed(!body.classList.contains("nav-collapsed"));
  }

  try {
    if (!isMobile() && localStorage.getItem(storageKey) === "1") {
      body.classList.add("nav-collapsed");
    }
  } catch (err) {}

  toggles.forEach(function (btn) {
    btn.addEventListener("click", toggleNav);
  });

  if (backdrop) {
    backdrop.hidden = false;
    backdrop.addEventListener("click", function () {
      setMobileOpen(false);
    });
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && isMobile()) setMobileOpen(false);
  });

  if (typeof mq.addEventListener === "function") {
    mq.addEventListener("change", function () {
      if (!isMobile()) body.classList.remove("nav-open");
      syncToggleState();
    });
  } else if (typeof mq.addListener === "function") {
    mq.addListener(function () {
      if (!isMobile()) body.classList.remove("nav-open");
      syncToggleState();
    });
  }

  if (sidebar) {
    sidebar.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener("click", function () {
        if (isMobile()) setMobileOpen(false);
      });
    });
  }

  var sectionLinks = sidebar ? Array.prototype.slice.call(sidebar.querySelectorAll('a[href^="#"]')) : [];
  var sections = sectionLinks
    .map(function (a) { return document.getElementById(a.getAttribute("href").slice(1)); })
    .filter(Boolean);

  function syncActive() {
    if (!sections.length) return;
    var scrollTop = content ? content.scrollTop : window.scrollY;
    var y = scrollTop + 120;
    var current = sections[0];
    sections.forEach(function (sec) {
      var top = content
        ? sec.getBoundingClientRect().top - content.getBoundingClientRect().top + content.scrollTop
        : sec.offsetTop;
      if (top <= y) current = sec;
    });
    sectionLinks.forEach(function (a) {
      a.classList.toggle("is-active", a.getAttribute("href") === "#" + current.id);
    });
  }

  if (sections.length) {
    var scrollTarget = content || window;
    scrollTarget.addEventListener("scroll", syncActive, { passive: true });
    syncActive();
  }

  syncToggleState();
})();
