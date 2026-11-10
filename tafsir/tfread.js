(function () {
  var parts = location.pathname.split("/").filter(Boolean);
  var id = parts[parts.length - 1] === "index.html" ? parts[parts.length - 2] : parts[parts.length - 1];
  var AYAHS = "7,286,200,176,120,165,206,75,129,109,123,111,43,52,99,128,111,110,98,135,112,78,118,64,77,227,93,88,69,60,34,30,73,54,45,83,182,88,75,85,54,53,89,59,37,35,38,29,18,45,60,49,62,55,78,96,29,22,24,13,14,11,11,18,12,12,30,52,52,44,28,28,20,56,40,31,50,40,46,42,29,19,36,25,22,17,19,26,30,20,15,21,11,8,8,19,5,8,8,11,11,8,3,9,5,4,7,3,6,3,5,4,5,6".split(",").map(Number);
  var DIG = "٠١٢٣٤٥٦٧٨٩";
  function ar(n) { return String(n).replace(/\d/g, function (c) { return DIG[c]; }); }
  var quran = null, cache = {}, box = null;
  function loadQuran() {
    if (quran) return Promise.resolve(quran);
    return fetch("/quran-uthmani.txt").then(function (r) { if (!r.ok) throw new Error(); return r.text(); }).then(function (t) {
      quran = {};
      t.split("\n").forEach(function (line) {
        var p = line.split("|");
        if (p.length >= 3) quran[p[0] + ":" + p[1]] = p.slice(2).join("|");
      });
      return quran;
    });
  }
  function loadSurah(s) {
    if (cache[s]) return Promise.resolve(cache[s]);
    return fetch("/tf/" + id + "/" + s + ".json").then(function (r) { if (!r.ok) throw new Error(); return r.json(); }).then(function (a) { cache[s] = a; return a; });
  }
  function parse() {
    var m = /^(\d+)\/(\d+)$/.exec((location.hash || "").replace(/^#/, ""));
    if (!m) return null;
    var s = +m[1], a = +m[2];
    if (s < 1 || s > 114 || a < 1 || a > AYAHS[s - 1]) return null;
    return { s: s, a: a };
  }
  function show() {
    var p = parse();
    var main = document.querySelector("main.idx");
    if (!p) {
      if (box) box.hidden = true;
      if (main) main.hidden = false;
      return;
    }
    if (main) main.hidden = true;
    if (!box) { box = document.createElement("div"); box.id = "tfread"; document.body.appendChild(box); }
    box.hidden = false;
    var prev = p.a > 1 ? "#" + p.s + "/" + (p.a - 1) : (p.s > 1 ? "#" + (p.s - 1) + "/" + AYAHS[p.s - 2] : "");
    var next = p.a < AYAHS[p.s - 1] ? "#" + p.s + "/" + (p.a + 1) : (p.s < 114 ? "#" + (p.s + 1) + "/1" : "");
    var link = document.querySelector('.sl a[href="#' + p.s + '/1"] .nm');
    var sn = link ? link.childNodes[0].textContent : "";
    var title = document.querySelector("h1");
    box.innerHTML = '<header class="bar"><a class="x" href="/tafsir/' + id + '/" aria-label="إغلاق">×</a><div class="who"><b></b><small></small></div></header><main id="tf"><p class="src"></p><p class="ay" dir="rtl" lang="ar"></p><div class="tx" lang="ar">…</div><nav class="pn"></nav></main>';
    box.querySelector(".who b").textContent = sn;
    box.querySelector(".who small").textContent = "الآية " + ar(p.a);
    box.querySelector(".src").textContent = title ? title.textContent : "";
    box.querySelector(".pn").innerHTML = (prev ? '<a href="' + prev + '">الآية السابقة</a>' : "<span></span>") + (next ? '<a href="' + next + '">الآية التالية</a>' : "<span></span>");
    Promise.all([loadQuran(), loadSurah(p.s)]).then(function (res) {
      if (!parse() || parse().s !== p.s || parse().a !== p.a) return;
      box.querySelector(".ay").textContent = (res[0][p.s + ":" + p.a] || "") + " ﴿" + ar(p.a) + "﴾";
      var raw = String(res[1][p.a - 1] || "").trim();
      box.querySelector(".tx").textContent = raw || "لا يوجد نص لهذه الآية في هذا التفسير.";
    }).catch(function () {
      box.querySelector(".tx").textContent = "تعذر تحميل هذا التفسير.";
    });
  }
  window.addEventListener("hashchange", show);
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", show);
  else show();
})();
