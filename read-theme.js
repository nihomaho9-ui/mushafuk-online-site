(function () {
  var KEY = "qm.readTheme";
  var opts = [
    { id: "current", label: "الحالي", en: "Current" },
    { id: "white", label: "أبيض", en: "White" },
    { id: "black", label: "أسود", en: "Black" }
  ];

  function get() {
    try {
      var v = localStorage.getItem(KEY);
      if (v === "white" || v === "black" || v === "current") return v;
      // migrate binary night
      if (localStorage.getItem("qm.night") === "1") return "black";
    } catch (e) {}
    return "current";
  }

  function set(v) {
    try { localStorage.setItem(KEY, v); } catch (e) {}
    try {
      if (v === "black") localStorage.setItem("qm.night", "1");
      else localStorage.setItem("qm.night", "");
    } catch (e) {}
    apply(v);
  }

  function apply(v) {
    v = v || get();
    var r = document.documentElement;
    r.classList.remove("qm-theme-white", "qm-theme-black", "qm-night");
    if (v === "white") r.classList.add("qm-theme-white");
    if (v === "black") { r.classList.add("qm-theme-black"); r.classList.add("qm-night"); }
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = v === "black" ? "#0e0e0e" : (v === "white" ? "#ffffff" : "#fffaf0");
    var root = document.getElementById("qm-theme-root");
    if (root) {
      opts.forEach(function (o) {
        var b = root.querySelector('[data-theme="' + o.id + '"]');
        if (b) {
          var on = o.id === v;
          b.setAttribute("aria-pressed", on ? "true" : "false");
          b.classList.toggle("on", on);
        }
      });
    }
  }

  function ensureCss() {
    if (document.getElementById("qm-theme-css")) return;
    var st = document.createElement("style");
    st.id = "qm-theme-css";
    st.textContent = [
      "#qm-theme-root{position:fixed;top:calc(.45rem + env(safe-area-inset-top));inset-inline-start:.55rem;z-index:40}",
      "#qm-theme-btn{width:2.15rem;height:2.15rem;border-radius:50%;border:1.5px solid #c4a56e;background:#f6f1e4;color:#1a3330;display:grid;place-items:center;cursor:pointer;box-shadow:0 4px 14px rgba(0,0,0,.08)}",
      "#qm-theme-btn:focus-visible{outline:2px solid #0f4d3a;outline-offset:2px}",
      "#qm-theme-menu{display:none;position:absolute;top:calc(100% + .35rem);inset-inline-start:0;min-width:9.5rem;background:#fffaf0;border:1px solid #e2d5b8;border-radius:12px;padding:.35rem;box-shadow:0 12px 28px rgba(0,0,0,.14)}",
      "#qm-theme-root.open #qm-theme-menu{display:block}",
      "#qm-theme-menu button{display:block;width:100%;text-align:start;border:0;background:transparent;padding:.55rem .65rem;border-radius:8px;font:inherit;cursor:pointer;color:#1a3330}",
      "#qm-theme-menu button.on,#qm-theme-menu button[aria-pressed=true]{background:#0f4d3a;color:#fbf7ee}",
      "#qm-theme-menu button:focus-visible{outline:2px solid #b8923a;outline-offset:1px}",
      /* white */
      "html.qm-theme-white,html.qm-theme-white body{background:#fff!important;color:#111!important}",
      "html.qm-theme-white .bar,html.qm-theme-white .ulum-card,html.qm-theme-white .qm-sheet{background:#fff!important;color:#111!important}",
      "html.qm-theme-white .ulum-book .body,html.qm-theme-black .ulum-book .body{background:transparent!important;color:inherit!important}html.qm-theme-white .tx,html.qm-theme-white .ulum-book .body p,html.qm-theme-white .qm-body{color:#111!important}",
      "html.qm-theme-white a,html.qm-theme-white .pn a,html.qm-theme-white .ulum-pn a{color:#0b4a38!important}",
      "html.qm-theme-white .ay{color:#111!important}",
      "html.qm-theme-white #qm-theme-btn{background:#fff;border-color:#bbb}",
      "html.qm-theme-white #qm-theme-menu{background:#fff;border-color:#ddd}",
      /* black */
      "html.qm-theme-black,html.qm-theme-black body{background:#0e0e0e!important;color:#f2ebe0!important}",
      "html.qm-theme-black .bar,html.qm-theme-black .ulum-card,html.qm-theme-black .qm-sheet{background:#161616!important;color:#f2ebe0!important}",
      "html.qm-theme-black .tx,html.qm-theme-black .ulum-book .body p,html.qm-theme-black .qm-body,html.qm-theme-black .ay{color:#f2ebe0!important}",
      "html.qm-theme-black a,html.qm-theme-black .pn a,html.qm-theme-black .ulum-pn a{color:#d7b56a!important}",
      "html.qm-theme-black .src,html.qm-theme-black .meta,html.qm-theme-black .ulum-credit{color:#b7aa95!important}",
      "html.qm-theme-black #qm-theme-btn{background:#1c1c1c;color:#f2ebe0;border-color:#6a5a3a}",
      "html.qm-theme-black #qm-theme-menu{background:#1a1a1a;border-color:#333}",
      "html.qm-theme-black #qm-theme-menu button{color:#f2ebe0}",
      "html.qm-theme-black .ulum-hero{filter:none}",
      /* don't invert images */
      "html.qm-theme-black img,html.qm-theme-white img{filter:none!important}"
    ].join("");
    document.head.appendChild(st);
  }

  function mount() {
    if (document.getElementById("qm-theme-root")) { apply(); return; }
    ensureCss();
    var root = document.createElement("div");
    root.id = "qm-theme-root";
    var btn = document.createElement("button");
    btn.type = "button";
    btn.id = "qm-theme-btn";
    btn.setAttribute("aria-haspopup", "menu");
    btn.setAttribute("aria-expanded", "false");
    btn.setAttribute("aria-label", "خلفية القراءة / Reading background");
    btn.title = "خلفية القراءة";
    btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
    var menu = document.createElement("div");
    menu.id = "qm-theme-menu";
    menu.setAttribute("role", "menu");
    menu.setAttribute("aria-label", "اختيار الخلفية");
    opts.forEach(function (o) {
      var b = document.createElement("button");
      b.type = "button";
      b.setAttribute("role", "menuitemradio");
      b.setAttribute("data-theme", o.id);
      b.textContent = o.label + " · " + o.en;
      b.onclick = function () { set(o.id); root.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); };
      menu.appendChild(b);
    });
    btn.onclick = function () {
      var open = !root.classList.contains("open");
      root.classList.toggle("open", open);
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      if (open) menu.querySelector("button") && menu.querySelector("button").focus();
    };
    document.addEventListener("click", function (e) {
      if (!root.contains(e.target)) { root.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { root.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); }
    });
    root.appendChild(btn);
    root.appendChild(menu);
    document.body.appendChild(root);
    // avoid overlap with .bar close button on tafsir: nudge if bar exists
    if (document.querySelector(".bar .x")) {
      root.style.insetInlineStart = "auto";
      root.style.insetInlineEnd = ".55rem";
      root.style.top = "calc(3.35rem + env(safe-area-inset-top))";
    }
    apply();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount);
  else mount();
  window.QMReadTheme = { get: get, set: set, apply: apply };
})();

/* QM-ULUM-SWIPE: horizontal swipe = prev/next chapter on Ulum book pages (same direction as tafsir turn.js) */
(function () {
  function init() {
    if (!document.querySelector("main.ulum-book")) return;
    var pn = document.querySelector(".ulum-pn"); if (!pn) return;
    var next = null, prev = null, as = pn.querySelectorAll("a[href]");
    for (var i = 0; i < as.length; i++) { var t = (as[i].textContent || "").trim(); if (/التالي/.test(t)) next = as[i].href; else if (/السابق/.test(t)) prev = as[i].href; }
    if (!next && !prev) return;
    var x = null, y = null, lock = null, dx = 0;
    function selecting() { try { var s = window.getSelection(); return s && String(s).length > 0; } catch (e) { return false; } }
    document.addEventListener("touchstart", function (e) {
      var t = e.target; if (e.touches.length !== 1 || (t && t.closest && t.closest("a,button,input,textarea,select,#qm-theme-root"))) { x = null; return; }
      x = e.touches[0].clientX; y = e.touches[0].clientY; lock = null; dx = 0;
    }, { passive: true });
    document.addEventListener("touchmove", function (e) {
      if (x == null) return; var ddx = e.touches[0].clientX - x, ddy = e.touches[0].clientY - y; dx = ddx;
      if (!lock && (Math.abs(ddx) > 8 || Math.abs(ddy) > 8)) lock = Math.abs(ddx) > Math.abs(ddy) * 1.3 ? "x" : "y";
    }, { passive: true });
    document.addEventListener("touchend", function () {
      if (x == null) return; var was = lock, d = dx; x = null; lock = null;
      if (was !== "x" || Math.abs(d) < 48 || selecting()) return;
      var u = d > 0 ? next : prev; if (u) location.assign(u);
    }, { passive: true });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
