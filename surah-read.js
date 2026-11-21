/* Surah translation reader for /az/tercume/?s=N (Əlixan Musayev). Other works stay on their existing pages. */
(function () {
  const NAMES = "Fatihə,Bəqərə,Ali-İmran,Nisa,Maidə,Ənam,Əraf,Ənfal,Tövbə,Yunus,Hud,Yusuf,Rəd,İbrahim,Hicr,Nəhl,İsra,Kəhf,Məryəm,Taha,Ənbiya,Həcc,Muminun,Nur,Furqan,Şuəra,Nəml,Qəsəs,Ankəbut,Rum,Loğman,Səcdə,Əhzab,Səba,Fatir,Yasin,Saffat,Sad,Zumər,Ğafir,Fussilət,Şura,Zuxruf,Duxan,Casiyə,Əhqaf,Muhəmməd,Fəth,Hucurat,Qaf,Zariyat,Tur,Nəcm,Qəmər,Rəhman,Vaqiə,Hədid,Mucadələ,Həşr,Mumtəhinə,Saff,Cumə,Munafiqun,Təğabun,Talaq,Təhrim,Mulk,Qələm,Haqqə,Məaric,Nuh,Cin,Muzzəmmil,Muddəssir,Qiyamə,İnsan,Mursəlat,Nəbə,Naziat,Əbəsə,Təkvir,İnfitar,Mutəffifin,İnşiqaq,Buruc,Tariq,Əla,Ğaşiyə,Fəcr,Bələd,Şəms,Leyl,Duha,İnşirah,Tin,Ələq,Qədr,Bəyyinə,Zəlzələ,Adiyat,Qariə,Təkasur,Əsr,Huməzə,Fil,Qureyş,Maun,Kövsər,Kafirun,Nəsr,Məsəd,İxlas,Fələq,Nas".split(",");
  const ARNAMES = "الفاتحة,البقرة,آل عمران,النساء,المائدة,الأنعام,الأعراف,الأنفال,التوبة,يونس,هود,يوسف,الرعد,إبراهيم,الحجر,النحل,الإسراء,الكهف,مريم,طه,الأنبياء,الحج,المؤمنون,النور,الفرقان,الشعراء,النمل,القصص,العنكبوت,الروم,لقمان,السجدة,الأحزاب,سبأ,فاطر,يس,الصافات,ص,الزمر,غافر,فصلت,الشورى,الزخرف,الدخان,الجاثية,الأحقاف,محمد,الفتح,الحجرات,ق,الذاريات,الطور,النجم,القمر,الرحمن,الواقعة,الحديد,المجادلة,الحشر,الممتحنة,الصف,الجمعة,المنافقون,التغابن,الطلاق,التحريم,الملك,القلم,الحاقة,المعارج,نوح,الجن,المزمل,المدثر,القيامة,الإنسان,المرسلات,النبأ,النازعات,عبس,التكوير,الانفطار,المطففين,الانشقاق,البروج,الطارق,الأعلى,الغاشية,الفجر,البلد,الشمس,الليل,الضحى,الشرح,التين,العلق,القدر,البينة,الزلزلة,العاديات,القارعة,التكاثر,العصر,الهمزة,الفيل,قريش,الماعون,الكوثر,الكافرون,النصر,المسد,الإخلاص,الفلق,الناس".split(",");
  const AYAHS = "7,286,200,176,120,165,206,75,129,109,123,111,43,52,99,128,111,110,98,135,112,78,118,64,77,227,93,88,69,60,34,30,73,54,45,83,182,88,75,85,54,53,89,59,37,35,38,29,18,45,60,49,62,55,78,96,29,22,24,13,14,11,11,18,12,12,30,52,52,44,28,28,20,56,40,31,50,40,46,42,29,19,36,25,22,17,19,26,30,20,15,21,11,8,8,19,5,8,8,11,11,8,3,9,5,4,7,3,6,3,5,4,5,6".split(",").map(Number);
  const MADANI = new Set([2, 3, 4, 5, 8, 9, 13, 22, 24, 33, 47, 48, 49, 55, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 76, 98, 99, 110]);
  const STARTS = {};
  "1:1:2,2:2:3,3:50:3,4:77:2,5:106:8,6:128:3,7:151:3,8:177:3,9:187:2,10:208:2,11:221:9,12:235:11,13:249:3,14:255:5,15:262:3,16:267:9,17:282:3,18:293:12,19:305:3,20:312:7,21:322:3,22:332:2,23:342:2,24:350:2,25:359:13,26:367:2,27:377:2,28:385:10,29:396:10,30:404:12,31:411:3,32:415:2,33:418:2,34:428:3,35:434:10,36:440:6,37:446:2,38:453:2,39:458:6,40:467:5,41:477:3,42:483:3,43:489:7,44:496:3,45:499:2,46:502:9,47:507:2,48:511:3,49:515:9,50:518:3,51:520:14,52:523:10,53:526:2,54:528:12,55:531:7,56:534:9,57:537:13,58:542:3,59:545:9,60:549:2,61:551:9,62:553:3,63:554:9,64:556:2,65:558:2,66:560:3,67:562:3,68:564:8,69:566:12,70:568:11,71:570:7,72:572:3,73:574:3,74:575:10,75:577:8,76:578:12,77:580:9,78:582:3,79:583:10,80:585:2,81:586:4,82:587:3,83:587:14,84:589:5,85:590:4,86:591:3,87:591:12,88:592:7,89:593:5,90:594:8,91:595:4,92:595:13,93:596:8,94:596:15,95:597:5,96:597:11,97:598:6,98:598:11,99:599:8,100:599:14,101:600:6,102:600:13,103:601:3,104:601:7,105:601:13,106:602:3,107:602:8,108:602:14,109:603:3,110:603:8,111:603:13,112:604:3,113:604:7,114:604:12".split(",").forEach((p) => {
    const [id, page] = p.split(":");
    STARTS[+id] = +page;
  });

  const BISM = "بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ";
  const ROOT = new URL("../../", location.href);
  const MUSAYEV_URL = new URL("tr/az.musayev.json", ROOT).href;
  const UTHMANI_URL = new URL("quran-uthmani.txt", ROOT).href;
  const LIB = new URL("lib.js?v=sr1", ROOT).href;
  const AUDIO = new URL("audio.js?v=sr1", ROOT).href;
  const TRANSLATOR = { id: "az.musayev", lang: "AZ", name: "Əlixan Musayev", by: "Azərbaycanca" };

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
  let libsP = null;
  let curS = 0;

  function paramS() {
    const q = new URLSearchParams(location.search).get("s");
    const n = q ? parseInt(q, 10) : 0;
    return n >= 1 && n <= 114 ? n : 0;
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
  function loadScript(src) {
    return new Promise((ok, no) => {
      const s = document.createElement("script");
      s.src = src;
      s.onload = () => ok();
      s.onerror = () => no(new Error(src));
      document.head.appendChild(s);
    });
  }
  function ensureLibs() {
    return (libsP ||= (async () => {
      window.QM_AYAHS = AYAHS;
      window.QM_NAMES = NAMES;
      await loadScript(LIB);
      await loadScript(AUDIO);
    })());
  }
  async function arabicOf(s) {
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
    return cache.uth[s] || [];
  }
  async function musayevOf(s) {
    if (!cache.az) {
      const j = await (await fetch(MUSAYEV_URL)).json();
      cache.az = j.v;
    }
    return { t: cache.az[s - 1], f: null };
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
    return NAMES[s - 1] + " " + s + ":" + a + "\n" + ar + "\n" + tr + "\n— " + TRANSLATOR.name;
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
    const url = new URL(location.href);
    url.searchParams.set("s", String(s));
    if (navigator.share) {
      try { await navigator.share({ title: NAMES[s - 1] + " " + s + ":" + a, text: tx, url: url.href }); return; }
      catch (e) { if (e && e.name === "AbortError") return; }
    }
    copyAyah(s, a, ar, tr);
  }
  async function playAyah(s, a) {
    await ensureLibs();
    if (window.QA) {
      const st = window.QA;
      // play() starts that ayah and continues through the surah
      window.QA.play(s, a);
    }
  }
  async function playSurah(s, btn) {
    await ensureLibs();
    if (!window.QA) return;
    if (window.QA.stop && btn.classList.contains("on")) {
      window.QA.stop();
      btn.classList.remove("on");
      btn.innerHTML = ICO.play;
      btn.setAttribute("aria-label", "Dinlə");
      return;
    }
    await window.QA.play(s, 1);
    btn.classList.add("on");
    btn.innerHTML = ICO.pause;
    btn.setAttribute("aria-label", "Dayandır");
  }
  async function openSettings() {
    await ensureLibs();
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
        const g = el("div", "grp", by);
        sheet.appendChild(g);
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

  function renderShell(s) {
    document.body.classList.add("sr-on");
    let root = document.getElementById("sr-root");
    if (!root) {
      root = document.createElement("div");
      root.id = "sr-root";
      document.body.appendChild(root);
    }
    const title = NAMES[s - 1] + " surəsi";
    document.title = title + " — " + TRANSLATOR.name + " | Mushafuk.online";
    root.innerHTML = "";
    const top = el("header", "sr-top");
    const back = document.createElement("a");
    back.className = "sr-ico";
    back.href = "./";
    back.setAttribute("aria-label", "Geri");
    back.innerHTML = ICO.back;
    back.addEventListener("click", (e) => {
      if (location.search) {
        e.preventDefault();
        history.pushState({}, "", "./");
        hideReader();
      }
    });
    const h1 = document.createElement("h1");
    h1.textContent = title;
    const play = document.createElement("button");
    play.type = "button";
    play.setAttribute("aria-label", "Dinlə");
    play.title = "Dinlə";
    play.innerHTML = ICO.play;
    play.onclick = () => playSurah(s, play);
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
    return { page, wait };
  }

  async function render(s) {
    curS = s;
    const { page, wait } = renderShell(s);
    try {
      const [arAll, trAll] = await Promise.all([arabicOf(s), musayevOf(s)]);
      if (curS !== s) return;
      wait.remove();
      const n = AYAHS[s - 1];
      const card = el("section", "sr-card");
      card.innerHTML =
        '<div class="sr-arname">' + ARNAMES[s - 1] + "</div>" +
        '<div class="sr-name">' + NAMES[s - 1] + "</div>" +
        '<div class="sr-meta"><span>' + (MADANI.has(s) ? "Mədinədə nazil olmuşdur" : "Məkkədə nazil olmuşdur") + "</span>" +
        "<span>" + n + " ayədir</span></div>" +
        (showBism(s) ? '<div class="sr-bism">' + BISM + "</div>" : "") +
        '<div><a class="sr-mushaf" href="page/' + STARTS[s] + "/#" + s + '-1">Mushafda aç</a></div>';
      page.appendChild(card);

      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "sr-chip";
      chip.setAttribute("aria-haspopup", "listbox");
      chip.innerHTML = '<span class="dot">AZ</span><span class="who"><b>' + TRANSLATOR.name + "</b><small>" + TRANSLATOR.by + '</small></span><span class="chev">' + ICO.chev + "</span>";
      chip.onclick = openPicker;
      page.appendChild(chip);

      const list = document.createElement("div");
      for (let a = 1; a <= n; a++) {
        const raw = arAll[a - 1] || "";
        const ar = stripBism(raw, s, a);
        const tr = (trAll.t && trAll.t[a - 1]) || "";
        const fn = trAll.f && trAll.f[a - 1];
        const key = s + ":" + a;
        const art = el("article", "sr-ayah");
        art.dataset.ayah = String(a);
        const bar = el("div", "sr-abar");
        bar.innerHTML = '<span class="sr-anum">' + a + "</span>";
        const mk = document.createElement("button");
        mk.type = "button"; mk.title = "Əlfəcin"; mk.setAttribute("aria-label", "Əlfəcin");
        const paintMk = () => { const on = isMarked(key); mk.classList.toggle("on", on); mk.innerHTML = on ? ICO.markOn : ICO.mark; };
        paintMk();
        mk.onclick = () => { toggleMark(key); paintMk(); };
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
        const arP = el("p", "sr-arabic"); arP.textContent = ar;
        const trP = el("p", "sr-tr"); trP.textContent = tr;
        body.append(arP, trP);
        if (fn) {
          const f = el("p", "sr-fn"); f.textContent = fn; body.appendChild(f);
        }
        const by = el("p", "sr-by"); by.textContent = TRANSLATOR.name; body.appendChild(by);
        art.append(bar, body);
        list.appendChild(art);
      }
      page.appendChild(list);
      document.body.dataset.sr = "ready";
      ensureLibs(); // warm audio/settings in the background
    } catch (e) {
      wait.className = "sr-err";
      wait.textContent = "Tərcümə yüklənmədi. İnterneti yoxlayıb yenidən açın.";
    }
  }

  function hideReader() {
    curS = 0;
    document.body.classList.remove("sr-on");
    delete document.body.dataset.sr;
    const root = document.getElementById("sr-root");
    if (root) root.innerHTML = "";
    closePicker();
    document.title = "Quran tərcüməsi — Azərbaycanca | Mushafuk.online";
  }

  function apply() {
    const s = paramS();
    if (s) render(s);
    else hideReader();
  }

  window.addEventListener("popstate", apply);
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", apply);
  else apply();
})();
