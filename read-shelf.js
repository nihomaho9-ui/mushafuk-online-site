(function () {
  if (window.__qmShelf) return;
  window.__qmShelf = 1;
  var KEY = "qm_shelf";
  var MAX = 5;
  function read() {
    var raw = "";
    var m = document.cookie.match(/(?:^|; )qm_shelf=([^;]*)/);
    if (m) { try { raw = decodeURIComponent(m[1]); } catch (e) {} }
    if (!raw) { try { raw = localStorage.getItem(KEY) || ""; } catch (e) {} }
    try { var a = JSON.parse(raw); return Array.isArray(a) ? a.slice(0, MAX) : []; } catch (e) { return []; }
  }
  function write(list) {
    var raw = JSON.stringify(list.slice(0, MAX));
    try { localStorage.setItem(KEY, raw); } catch (e) {}
    document.cookie = "qm_shelf=" + encodeURIComponent(raw) + "; Domain=mushafuk.online; Path=/; Max-Age=31536000; SameSite=Lax; Secure";
  }
  function bookOf() {
    var host = location.hostname.replace(/^www\./, "");
    if (host !== "mushafuk.online" && host.slice(-16) !== ".mushafuk.online") return null;
    var parts = location.pathname.split("/").filter(Boolean);
    var n = parts.length, page = "", base;
    if (n >= 2 && parts[n - 2] === "page" && /^\d+$/.test(parts[n - 1])) {
      page = parts[n - 1];
      base = parts.slice(0, -2);
      if (!base.length) base = ["quran"];
    } else if (n >= 3 && /^\d+$/.test(parts[n - 1]) && /^\d+$/.test(parts[n - 2]) && (host.indexOf("tafsir.") === 0 || host.indexOf("t2.") === 0 || parts[0] === "tafsir")) {
      page = parts[n - 2] + ":" + parts[n - 1];
      base = parts.slice(0, -2);
    } else if (n >= 2 && /^\d+$/.test(parts[n - 1]) && (host.indexOf("t3.") === 0 || parts[0] === "ulum")) {
      page = parts[n - 1];
      base = parts.slice(0, -1);
    } else return null;
    if (!page || !base.length) return null;
    var title = (document.title || "").replace(/\s*\|\s*Mushafuk(?:\.online)?\s*$/, "").trim();
    if (title.length > 70) title = title.slice(0, 67) + "...";
    var path = "/" + parts.join("/") + "/";
    return { k: host + "/" + base.join("/"), u: location.origin + path, p: page, t: title || base[base.length - 1] };
  }
  function save() {
    var info = bookOf();
    if (!info) return;
    var list = read();
    var i = -1;
    for (var j = 0; j < list.length; j++) if (list[j].k === info.k) i = j;
    if (i >= 0) {
      var item = list.splice(i, 1)[0];
      item.u = info.u; item.p = info.p; if (info.t) item.t = info.t;
      list.unshift(item);
      write(list);
    } else {
      list.unshift(info);
      if (list.length > MAX) list.length = MAX;
      write(list);
    }
  }
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      if (c === "&") return "&" + "amp;";
      if (c === "<") return "&" + "lt;";
      if (c === ">") return "&" + "gt;";
      return "&" + "quot;";
    });
  }
  function render() {
    var box = document.getElementById("readmode");
    if (!box) return;
    var list = read();
    var lang = document.documentElement.lang || "az";
    var words = {
      az: "səhifə ", tr: "sayfa ", en: "page ", ru: "стр. ", ar: "صفحة ",
      id: "halaman ", fr: "page ", bn: "পৃষ্ঠা ", ms: "muka ", ur: "صفحہ "
    };
    var rm = { az: "Sil", tr: "Sil", en: "Remove", ru: "Удалить", ar: "حذف", id: "Hapus", fr: "Retirer", bn: "সরান", ms: "Buang", ur: "ہٹائیں" };
    var empty = {
      az: "Hələ kitab yoxdur. Bir kitabı açın, son səhifəsi burada qalacaq.",
      tr: "Henüz kitap yok. Bir kitabı açın, son sayfası burada kalır.",
      en: "No book yet. Open one and its last page stays here.",
      ru: "Книг пока нет. Откройте книгу — последняя страница сохранится.",
      ar: "لا كتب بعد. افتح كتابًا وتُحفظ آخر صفحة.",
      id: "Belum ada buku. Buka satu buku, halaman terakhir tersimpan di sini.",
      fr: "Pas encore de livre. Ouvrez-en un, la dernière page reste ici.",
      bn: "এখনো কোনো বই নেই। একটি বই খুলুন, শেষ পাতা এখানে থাকবে।",
      ms: "Belum ada kitab. Buka satu kitab, halaman terakhir kekal di sini.",
      ur: "ابھی کوئی کتاب نہیں۔ ایک کتاب کھولیں، آخری صفحہ یہاں رہے گا۔"
    };
    var hold = box.querySelector(".rm-list");
    if (!list.length) { hold.innerHTML = '<p class="rm-empty">' + (empty[lang] || empty.en) + "</p>"; return; }
    hold.innerHTML = list.map(function (b, i) {
      return '<div class="rm-row"><a class="rm-item" href="' + esc(b.u) + '"><b>' + esc(b.t) + '</b><span>' + (words[lang] || "page ") + esc(b.p) + '</span></a><button type="button" class="rm-x" data-i="' + i + '" aria-label="' + (rm[lang] || "Remove") + '">×</button></div>';
    }).join("");
  }
  save();
  window.addEventListener("pageshow", render);
  var box = document.getElementById("readmode");
  if (box) {
    render();
    var face = box.querySelector(".rm-face");
    if (face) face.addEventListener("click", function () {
      render();
      var open = box.classList.toggle("open");
      var body = box.querySelector(".rm-body");
      if (body) body.hidden = !open;
      face.setAttribute("aria-expanded", open ? "true" : "false");
      var go = face.querySelector(".go");
      if (go) {
        if (!go.getAttribute("data-shut")) go.setAttribute("data-shut", go.textContent);
        go.textContent = open ? "▾" : go.getAttribute("data-shut");
      }
    });
    box.addEventListener("click", function (e) {
      var btn = e.target.closest ? e.target.closest(".rm-x") : null;
      if (!btn) return;
      var list = read();
      list.splice(+btn.getAttribute("data-i"), 1);
      write(list);
      render();
    });
  }
})();
