(function () {
  var body = document.body;
  var toggles = Array.prototype.slice.call(document.querySelectorAll("[data-nav-toggle]"));
  var backdrop = document.querySelector("[data-nav-backdrop]");
  var sidebar = document.getElementById("site-nav");
  var mq = window.matchMedia("(max-width: 920px)");

  function isMobile() {
    return mq.matches;
  }

  function syncToggleState() {
    var expanded = isMobile()
      ? body.classList.contains("nav-open")
      : !body.classList.contains("nav-collapsed");
    toggles.forEach(function (btn) {
      btn.setAttribute("aria-expanded", expanded ? "true" : "false");
      var label = btn.querySelector(".home-btn-label");
      if (label) label.textContent = expanded ? "Collapse navigation" : "Expand navigation";
      btn.setAttribute("aria-label", expanded ? "Collapse navigation" : "Expand navigation");
      btn.title = expanded ? "Collapse left panel" : "Expand left panel";
    });
    if (sidebar) {
      if (isMobile()) sidebar.setAttribute("aria-hidden", expanded ? "false" : "true");
      else sidebar.removeAttribute("aria-hidden");
    }
  }

  function setMobileOpen(open) {
    body.classList.toggle("nav-open", open);
    syncToggleState();
  }

  function toggleNav() {
    if (isMobile()) {
      setMobileOpen(!body.classList.contains("nav-open"));
      return;
    }
    body.classList.toggle("nav-collapsed");
    syncToggleState();
  }

  if (!isMobile()) body.classList.add("nav-collapsed");

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

  function onMqChange() {
    if (!isMobile()) body.classList.remove("nav-open");
    syncToggleState();
  }
  if (typeof mq.addEventListener === "function") mq.addEventListener("change", onMqChange);
  else if (typeof mq.addListener === "function") mq.addListener(onMqChange);

  if (sidebar) {
    sidebar.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener("click", function () {
        if (isMobile()) setMobileOpen(false);
      });
    });
  }

  syncToggleState();
})();
