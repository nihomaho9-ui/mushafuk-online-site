/* Azerbaijani Musayev reader on /az/tercume/page/{n}/ — one mushaf page per URL. */
(function () {
  const BISM = "بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ";
  const ROOT = new URL("/", location.href);
  const MUSAYEV_URL = new URL("tr/az.musayev.json", ROOT).href;
  const UTHMANI_URL = new URL("quran-uthmani.txt", ROOT).href;
  const ARNAMES = "الفاتحة,البقرة,آل عمران,النساء,المائدة,الأنعام,الأعراف,الأنفال,التوبة,يونس,هود,يوسف,الرعد,إبراهيم,الحجر,النحل,الإسراء,الكهف,مريم,طه,الأنبياء,الحج,المؤمنون,النور,الفرقان,الشعراء,النمل,القصص,العنكبوت,الروم,لقمان,السجدة,الأحزاب,سبأ,فاطر,يس,الصافات,ص,الزمر,غافر,فصلت,الشورى,الزخرف,الدخان,الجاثية,الأحقاف,محمد,الفتح,الحجرات,ق,الذاريات,الطور,النجم,القمر,الرحمن,الواقعة,الحديد,المجادلة,الحشر,الممتحنة,الصف,الجمعة,المنافقون,التغابن,الطلاق,التحريم,الملك,القلم,الحاقة,المعارج,نوح,الجن,المزمل,المدثر,القيامة,الإنسان,المرسلات,النبأ,النازعات,عبس,التكوير,الانفطار,المطففين,الانشقاق,البروج,الطارق,الأعلى,الغاشية,الفجر,البلد,الشمس,الليل,الضحى,الشرح,التين,العلق,القدر,البينة,الزلزلة,العاديات,القارعة,التكاثر,العصر,الهمزة,الفيل,قريش,الماعون,الكوثر,الكافرون,النصر,المسد,الإخلاص,الفلق,الناس".split(",");
  const TRANSLATOR = { id: "az.musayev", lang: "AZ", name: "Əlixan Musayev", by: "Azərbaycanca" };
  const MADANI = new Set([2, 3, 4, 5, 8, 9, 13, 22, 24, 33, 47, 48, 49, 55, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 76, 98, 99, 110]);
  const OTHERS = [
    ["ru.kuliev", "Эльмир Кулиев", "Русский"],
    ["turkish_shahin", "Ali Özek ve diğerleri", "Türkçe"],
    ["turkish_rwwad", "Rowwad Tercüme Merkezi", "Türkçe"],
    ["english_saheeh", "Saheeh International", "English"],
    ["english_hilali_khan", "Muhammad Taqi-ud-Din al-Hilali, Muhammad Muhsin Khan", "English"],
    ["english_rwwad", "Rowwad Translation Center", "English"],
    ["urdu_junagarhi", "محمد جوناگڑھی", "اردو"],
    ["persian_ih", "مرکز ترجمه رواد", "فارسی"],
    ["uzbek_mansour", "Алоуддин Мансур", "Oʻzbekcha"],
    ["tajik_arifi", "Маркази тарҷумаи Равод", "Тоҷикӣ"],
    ["kyrgyz_hakimov", "Шамсуддин Хакимов", "Кыргызча"],
    ["uyghur_saleh", "مۇھەممەد سالىھ", "ئۇيغۇرچە"],
    ["pashto_rwwad", "د رواد د ژباړې مرکز", "پښتو"],
    ["kurdish_bamoki", "محمد صالح بامۆکی", "Kurdî"],
    ["hindi_omari", "अज़ीज़ुल-हक़ उमरी", "हिन्दी"],
    ["tamil_omar", "உமர் ஷரீஃப்", "தமிழ்"],
    ["french_rashid", "Rachid Maach", "Français"],
    ["german_bubenheim", "Frank Bubenheim, Nadeem Elyas", "Deutsch"],
    ["dutch_center", "Rowwad Vertaalcentrum", "Nederlands"],
    ["spanish_garcia", "Isa García", "Español"],
    ["portuguese_nasr", "Helmi Nasr", "Português"],
    ["hausa_gummi", "Abubakar Mahmoud Gumi", "Hausa"],
    ["somali_yacob", "Cabdullaahi Xasan Yacquub", "Soomaali"],
    ["japanese_saeedsato", "サイード佐藤", "日本語"]
  ];

  const ICO = {
    back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5 8 12l7 7"/></svg>',
    play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" fill="currentColor"/></svg>',
    pause: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M7 5.5h3.2v13H7zm6.8 0H17v13h-3.2z"/></svg>',
    gear: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M10.3 3.2h3.4l.5 2.4c.6.2 1.2.5 1.7.9l2.3-.8 1.7 2.9-1.8 1.6c.1.6.1 1.2 0 1.8l1.8 1.6-1.7 2.9-2.3-.8c-.5.4-1.1.7-1.7.9l-.5 2.4h-3.4l-.5-2.4c-.6-.2-1.2-.5-1.7-.9l-2.3.8-1.7-2.9 1.8-1.6a5.6 5.6 0 0 1 0-1.8L4.1 8.6l1.7-2.9 2.3.8c.5-.4 1.1-.7 1.7-.9z"/><circle cx="12" cy="12" r="2.6" fill="#fffaf0"/></svg>',
    mark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" aria-hidden="true"><path d="M6.5 3.5h11v17L12 16.5l-5.5 4z"/></svg>',
    markOn: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6.5 3.5h11v17L12 16.5l-5.5 4z"/></svg>',
    copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><rect x="8" y="8" width="11.5" height="11.5" rx="2"/><path d="M15.5 8V5.5A1.5 1.5 0 0 0 14 4H5.5A1.5 1.5 0 0 0 4 5.5V14a1.5 1.5 0 0 0 1.5 1.5H8"/></svg>',
    share: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12M7.5 7.5 12 3l4.5 4.5M5 12v7.5h14V12"/></svg>',
    tick: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 5 5 9-9"/></svg>',
    chev: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>'
  };

  const cache = {};
  let curN = 0;
  let swiping = false;

  function names() { return window.QM_NAMES || []; }
  function ayahs() { return window.QM_AYAHS || []; }

  function pageNoFromUrl() {
    const m = location.pathname.match(/\/az\/tercume\/page\/(\d+)\/?$/);
    if (!m) return 0;
    const n = +m[1];
    return n >= 1 && n <= 604 ? n : 0;
  }
  function marks() {
    try { return JSON.parse(localStorage.getItem("qm.bookmarks") || "[]"); } catch (e) { return []; }
  }
  function setMarks(m) { localStorage.setItem("qm.bookmarks", JSON.stringify(m)); }
  function isMarked(k) { return marks().includes(k); }
  function toggleMark(k) {
    const m = marks();
    const i = m.indexOf(k);
    if (i >= 0) m.splice(i, 1); else m.push(k);
    setMarks(m);
    return i < 0;
  }
  async function arabicMap() {
    if (!cache.uth) {
      const t = await (await fetch(UTHMANI_URL)).text();
      const map = {};
      for (const line of t.split("\n")) {
        const p = line.split("|");
        if (p.length === 3) {
          const sn = +p[0], an = +p[1];
          (map[sn] || (map[sn] = []))[an - 1] = p[2];
        }
      }
      cache.uth = map;
    }
    return cache.uth;
  }
  async function musayevAll() {
    if (!cache.az) {
      const j = await (await fetch(MUSAYEV_URL)).json();
      cache.az = j.v;
    }
    return cache.az;
  }
  // Same mapping as lib.js forFont: uthmanic-hafs.woff2 maps U+06DF (small high rounded zero)
  // to a wide composite of U+0600, which paints as a black dotted ring after words like ءَامِنُوا۟.
  // The site displays U+06E0 (small high upright rectangular zero) instead, which this font has.
  function forFont(t) {
    return String(t || "").replace(/\u06DF/g, "\u06E0");
  }
  function stripBism(ar, s, a) {
    if (a !== 1 || s === 9) return ar;
    if (ar.indexOf(BISM) === 0) {
      const rest = ar.slice(BISM.length).trim();
      return rest || ar;
    }
    return ar;
  }
  function showBism(s) { return s !== 9 && s !== 1; }
  function el(tag, cls, html) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  function toast(msg) {
    let t = document.getElementById("sr-toast");
    if (!t) {
      t = el("div");
      t.id = "sr-toast";
      t.style.cssText = "position:fixed;left:50%;bottom:5rem;transform:translateX(-50%);background:#12352c;color:#fff;padding:.4rem .8rem;border-radius:999px;font-size:.8rem;z-index:80;opacity:0;transition:opacity .2s";
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.style.opacity = "1";
    clearTimeout(t._h);
    t._h = setTimeout(() => { t.style.opacity = "0"; }, 1400);
  }
  function ayahText(s, a, ar, tr) {
    const N = names();
    return (N[s - 1] || s) + " " + s + ":" + a + "\n" + ar + "\n" + tr + "\n— " + TRANSLATOR.name;
  }
  async function copyAyah(s, a, ar, tr) {
    const tx = ayahText(s, a, ar, tr);
    try { await navigator.clipboard.writeText(tx); toast("Kopyalandı"); }
    catch (e) {
      const ta = document.createElement("textarea");
      ta.value = tx; document.body.appendChild(ta); ta.select();
      toast(document.execCommand("copy") ? "Kopyalandı" : "Alınmadı");
      ta.remove();
    }
  }
  async function shareAyah(s, a, ar, tr) {
    const tx = ayahText(s, a, ar, tr);
    const url = location.origin + "/az/tercume/page/" + curN + "/#" + s + "-" + a;
    if (navigator.share) {
      try { await navigator.share({ title: names()[s - 1] + " " + s + ":" + a, text: tx, url: url }); return; }
      catch (e) { if (e && e.name === "AbortError") return; }
    }
    copyAyah(s, a, ar, tr);
  }
  async function playAyah(s, a) {
    if (window.QA && window.QA.play) window.QA.play(s, a);
  }
  async function playFrom(s, a, btn) {
    if (!window.QA || !window.QA.play) return;
    if (window.QA.stop && btn.classList.contains("on")) {
      window.QA.stop();
      btn.classList.remove("on");
      btn.innerHTML = ICO.play;
      btn.setAttribute("aria-label", "Dinlə");
      return;
    }
    await window.QA.play(s, a);
    btn.classList.add("on");
    btn.innerHTML = ICO.pause;
    btn.setAttribute("aria-label", "Dayandır");
  }
  function openSettings() {
    if (window.QM && window.QM.openSettings) window.QM.openSettings();
  }
  function closePicker() {
    const a = document.getElementById("sr-scrim");
    const b = document.getElementById("sr-sheet");
    if (a) a.remove();
    if (b) b.remove();
  }
  function openPicker() {
    closePicker();
    const scrim = el("div", "sr-scrim");
    scrim.id = "sr-scrim";
    scrim.onclick = closePicker;
    const sheet = el("div", "sr-sheet");
    sheet.id = "sr-sheet";
    sheet.innerHTML = '<div class="handle"></div><h2>Tərcümə</h2>';
    const on = el("button", "tr on");
    on.type = "button";
    on.innerHTML = "<span>" + TRANSLATOR.name + "</span><small style='color:#6b6253'>" + TRANSLATOR.by + "</small><span class='tick'>" + ICO.tick + "</span>";
    on.onclick = closePicker;
    sheet.appendChild(on);
    let last = "";
    for (const [id, name, by] of OTHERS) {
      if (by !== last) {
        sheet.appendChild(el("div", "grp", by));
        last = by;
      }
      const b = el("button", "tr");
      b.type = "button";
      b.disabled = true;
      b.innerHTML = "<span>" + name + "</span><span class='soon'>tezliklə</span>";
      sheet.appendChild(b);
    }
    document.body.append(scrim, sheet);
  }

  function goPage(n) {
    n = n | 0;
    if (n < 1 || n > 604 || n === curN) return;
    closePicker();
    if (window.QM_TURN) window.QM_TURN(n);
    else location.assign("/az/tercume/page/" + n + "/");
  }

  function surahCard(s) {
    const N = names();
    const AN = ARNAMES;
    const A = ayahs();
    const card = el("section", "sr-card");
    card.dataset.k = s + "-1";
    card.innerHTML =
      '<div class="sr-arname">' + (AN[s - 1] || "") + "</div>" +
      '<div class="sr-name">' + (N[s - 1] || "") + "</div>" +
      '<div class="sr-meta"><span>' + (MADANI.has(s) ? "Mədinədə nazil olmuşdur" : "Məkkədə nazil olmuşdur") + "</span>" +
      "<span>" + (A[s - 1] || "") + " ayədir</span></div>" +
      (showBism(s) ? '<div class="sr-bism">' + forFont(BISM) + "</div>" : "");
    return card;
  }

  async function open(n) {
    n = n | 0;
    if (n < 1 || n > 604) return;
    curN = n;
    const pg = window.QM_PAGE && window.QM_PAGE(n);
    if (!pg || !pg.keys || !pg.keys.length) return;
    document.body.classList.add("sr-on");
    document.documentElement.classList.remove("qm-turning");
    try { sessionStorage.removeItem("qm.turn"); } catch (e) {}

    let root = document.getElementById("sr-root");
    if (!root) {
      root = document.createElement("div");
      root.id = "sr-root";
      document.body.appendChild(root);
    }
    const N = names();
    const first = pg.keys[0].split(":").map(Number);
    const title = (N[first[0] - 1] || "") + " surəsi";
    document.title = "Quran, səhifə " + n + " — " + title + " | Mushafuk.online";

    root.innerHTML = "";
    const top = el("header", "sr-top");
    const back = document.createElement("a");
    back.className = "sr-ico";
    back.href = "/az/tercume/";
    back.setAttribute("aria-label", "Geri");
    back.innerHTML = ICO.back;
    const h1 = document.createElement("h1");
    h1.innerHTML = title + '<small class="sr-pageno">Səhifə ' + n + "</small>";
    const play = document.createElement("button");
    play.type = "button";
    play.setAttribute("aria-label", "Dinlə");
    play.title = "Dinlə";
    play.innerHTML = ICO.play;
    play.onclick = () => playFrom(first[0], first[1], play);
    const gear = document.createElement("button");
    gear.type = "button";
    gear.setAttribute("aria-label", "Ayarlar");
    gear.title = "Ayarlar";
    gear.innerHTML = ICO.gear;
    gear.onclick = openSettings;
    top.append(back, h1, play, gear);

    const page = el("div", "sr-page");
    const wait = el("p", "sr-wait", "Yüklənir…");
    page.appendChild(wait);
    root.append(top, page);

    try {
      const [uth, az] = await Promise.all([arabicMap(), musayevAll()]);
      if (curN !== n) return;
      wait.remove();

      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "sr-chip";
      chip.setAttribute("aria-haspopup", "listbox");
      chip.innerHTML = '<span class="dot">AZ</span><span class="who"><b>' + TRANSLATOR.name + "</b><small>" + TRANSLATOR.by + '</small></span><span class="chev">' + ICO.chev + "</span>";
      chip.onclick = openPicker;

      const frag = document.createDocumentFragment();
      let chipDone = false;
      for (const key of pg.keys) {
        const [s, a] = key.split(":").map(Number);
        if (a === 1) {
          if (!chipDone) { page.appendChild(chip); chipDone = true; }
          page.appendChild(surahCard(s));
        }
        if (!chipDone) { page.appendChild(chip); chipDone = true; }
        const raw = (uth[s] && uth[s][a - 1]) || "";
        const ar = stripBism(raw, s, a);
        const tr = (az[s - 1] && az[s - 1][a - 1]) || "";
        const art = el("article", "sr-ayah");
        art.dataset.k = s + "-" + a;
        const bar = el("div", "sr-abar");
        bar.innerHTML = '<span class="sr-anum">' + a + "</span>";
        const mk = document.createElement("button");
        mk.type = "button"; mk.title = "Əlfəcin"; mk.setAttribute("aria-label", "Əlfəcin");
        const paintMk = () => { const on = isMarked(s + ":" + a); mk.classList.toggle("on", on); mk.innerHTML = on ? ICO.markOn : ICO.mark; };
        paintMk();
        mk.onclick = () => { toggleMark(s + ":" + a); paintMk(); };
        const pb = document.createElement("button");
        pb.type = "button"; pb.title = "Dinlə"; pb.setAttribute("aria-label", "Dinlə");
        pb.innerHTML = ICO.play;
        pb.onclick = () => playAyah(s, a);
        const cp = document.createElement("button");
        cp.type = "button"; cp.title = "Kopyala"; cp.setAttribute("aria-label", "Kopyala");
        cp.innerHTML = ICO.copy;
        cp.onclick = () => copyAyah(s, a, ar, tr);
        const sh = document.createElement("button");
        sh.type = "button"; sh.title = "Paylaş"; sh.setAttribute("aria-label", "Paylaş");
        sh.innerHTML = ICO.share;
        sh.onclick = () => shareAyah(s, a, ar, tr);
        bar.append(mk, pb, cp, sh);
        const body = el("div", "sr-abody");
        const arP = el("p", "sr-arabic"); arP.textContent = forFont(ar);
        const trP = el("p", "sr-tr"); trP.textContent = tr;
        const by = el("p", "sr-by"); by.textContent = TRANSLATOR.name;
        body.append(arP, trP, by);
        art.append(bar, body);
        page.appendChild(art);
      }

      const nav = el("nav", "sr-nav");
      if (n > 1) {
        const a = document.createElement("a");
        a.rel = "prev"; a.href = "/az/tercume/page/" + (n - 1) + "/"; a.textContent = "Əvvəlki";
        a.addEventListener("click", (e) => { e.preventDefault(); goPage(n - 1); });
        nav.appendChild(a);
      } else {
        nav.appendChild(el("span", "", ""));
      }
      const mid = document.createElement("span");
      mid.textContent = "Səhifə " + n;
      nav.appendChild(mid);
      if (n < 604) {
        const a = document.createElement("a");
        a.rel = "next"; a.href = "/az/tercume/page/" + (n + 1) + "/"; a.textContent = "Sonrakı";
        a.addEventListener("click", (e) => { e.preventDefault(); goPage(n + 1); });
        nav.appendChild(a);
      }
      page.appendChild(nav);

      document.body.dataset.sr = "ready";
      const hash = (location.hash || "").replace(/^#/, "");
      if (hash) {
        const t = root.querySelector('[data-k="' + hash + '"]');
        if (t) t.scrollIntoView({ block: "start" });
      } else {
        root.querySelector(".sr-page").scrollTop = 0;
        window.scrollTo(0, 0);
      }
    } catch (e) {
      wait.className = "sr-err";
      wait.textContent = "Tərcümə yüklənmədi. İnterneti yoxlayıb yenidən açın.";
    }
  }

  window.SR = { open: open, goPage: goPage };

  (function hookTurn() {
    if (!window.QM_TURN) { setTimeout(hookTurn, 50); return; }
    if (window.QM_TURN.__sr) return;
    const orig = window.QM_TURN;
    function wrapped(n) {
      const r = orig(n);
      if (!r) {
        const now = pageNoFromUrl();
        if (now) open(now);
      }
      return r;
    }
    wrapped.__sr = true;
    window.QM_TURN = wrapped;
  })();


  window.addEventListener("popstate", function () {
    const n = pageNoFromUrl();
    if (n) open(n);
  });
})();
