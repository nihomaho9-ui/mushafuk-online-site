// Recitation (EveryAyah): stream an ayah, play on through the surah, download an ayah or a whole surah to the device.
(function () {
  const AYAHS = window.QM_AYAHS;
  const RECITERS = [
    { id: "maher", name: "Maher Al Muaiqly", ea: "MaherAlMuaiqly128kbps", rel: "maher-128kbps-v1" },
    { id: "husary", name: "Husary", ea: "Husary_128kbps", rel: "husary-128kbps-v1" },
    { id: "qatami", name: "Nasser Al Qatami", ea: "Nasser_Alqatami_128kbps", rel: "qatami-128kbps-v1" },
    { id: "dosari", name: "Yasser Al Dosari", ea: "Yasser_Ad-Dussary_128kbps", rel: "dosari-128kbps-v1" },
    { id: "ayyub", name: "Muhammad Ayyub", ea: "Muhammad_Ayyoub_128kbps", rel: "ayyub-128kbps-v1" },
    { id: "jibreel", name: "Muhammad Jibreel", ea: "Muhammad_Jibreel_128kbps", rel: "jibreel-128kbps-v1" },
    { id: "shuraim", name: "Saud Ash-Shuraim", ea: "Saood_ash-Shuraym_128kbps", rel: "shuraym-128kbps-v1" },
  ];
  const CACHE = "qm-audio-v1";
  const p3 = (n) => String(n).padStart(3, "0");
  const rec = () => RECITERS.find((r) => r.id === localStorage.getItem("qm.reciter")) || RECITERS[0];
  const url = (r, s, a) => "https://everyayah.com/data/" + r.ea + "/" + p3(s) + p3(a) + ".mp3";
  const zipUrl = (r, s) => "https://github.com/nihomaho9-ui/quran-medine-audio/releases/download/" + r.rel + "/" + p3(s) + ".zip";
  const doneKey = (r, s) => "qm.audio." + r.id + "." + s;
  const el = (t, c, x) => { const e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; };

  const memo = new Map(); // "rec:s:a" → blob: URL kept for the session so Cache API is not hit between ayahs
  const mkey = (r, s, a) => r.id + ":" + s + ":" + a;
  function memoPut(r, s, a, buf) {
    const k = mkey(r, s, a);
    const prev = memo.get(k); if (prev) { try { URL.revokeObjectURL(prev); } catch (e) {} }
    const u = URL.createObjectURL(new Blob([buf], { type: "audio/mpeg" }));
    memo.set(k, u); return u;
  }
  async function cached(r, s, a) {
    const k = mkey(r, s, a); if (memo.has(k)) return memo.get(k);
    try {
      const c = await caches.open(CACHE); const h = await c.match(url(r, s, a));
      if (!h) return null;
      const buf = await h.arrayBuffer();
      return memoPut(r, s, a, buf);
    } catch (e) { return null; }
  }
  async function putMp3(c, r, s, a, buf) {
    await c.put(url(r, s, a), new Response(buf, { headers: { "Content-Type": "audio/mpeg" } }));
    memoPut(r, s, a, buf);
  }

  // the release zips are "stored" (no compression): read entries straight from the local headers
  function unzipStored(buf) {
    const v = new DataView(buf), out = {}; let o = 0;
    while (o + 30 < buf.byteLength && v.getUint32(o, true) === 0x04034b50) {
      const m = v.getUint16(o + 8, true), sz = v.getUint32(o + 18, true), nl = v.getUint16(o + 26, true), xl = v.getUint16(o + 28, true);
      const name = new TextDecoder().decode(new Uint8Array(buf, o + 30, nl)); const start = o + 30 + nl + xl;
      if (m === 0) out[name] = buf.slice(start, start + sz);
      o = start + sz;
    }
    return out;
  }

  async function saveAyah(r, s, a) {
    if (memo.has(mkey(r, s, a))) return;
    const c = await caches.open(CACHE);
    const hit = await c.match(url(r, s, a));
    if (hit) { memoPut(r, s, a, await hit.arrayBuffer()); return; }
    const res = await fetch(url(r, s, a)); if (!res.ok) throw new Error("HTTP " + res.status);
    await putMp3(c, r, s, a, await res.arrayBuffer());
  }
  async function saveSurah(r, s, prog) {
    const c = await caches.open(CACHE), n = AYAHS[s - 1];
    try { // one zip from the GitHub release (works in the app; browsers may block it — then ayah by ayah)
      prog(0, 1);
      if (!r.rel) throw new Error("no zip");
      const res = await fetch(zipUrl(r, s)); if (!res.ok) throw new Error("HTTP " + res.status);
      const files = unzipStored(await res.arrayBuffer());
      let k = 0; for (let a = 1; a <= n; a++) { const f = files[p3(s) + p3(a) + ".mp3"]; if (!f) throw new Error("zip"); await putMp3(c, r, s, a, f); prog(++k, n); }
    } catch (e) {
      if (!navigator.onLine) throw e;
      let done = 0, next = 1, failed = 0;
      async function worker() { while (next <= n) { const a = next++; let ok = false; for (let t = 0; t < 3 && !ok; t++) { try { await saveAyah(r, s, a); ok = true; } catch (er) {} } if (!ok) failed++; prog(++done, n); } }
      await Promise.all(Array.from({ length: 6 }, worker));
      if (failed) throw new Error(failed + " ayə");
    }
    localStorage.setItem(doneKey(r, s), "1");
  }

  const A = [new Audio(), new Audio()];
  A.forEach((x) => { x.preload = "auto"; });
  let curA = 0;
  const audio = () => A[curA];
  let st = { s: 0, a: 0, cont: false, playing: false, paused: false, left: 0, gen: 0, bism: false }, ui = null;
  let nextReady = null, surahPull = null, hydrateJob = null;
  const listeners = new Set();
  const notify = () => { listeners.forEach((f) => f()); paintBar && paintBar(); };
  const reps = () => Math.min(9, Math.max(1, +localStorage.getItem("qm.audio.rep") || 1));
  const kick = (el) => { const p = el.play(); if (p && p.catch) p.catch(() => {}); };

  function markSurahIfFull(r, s) {
    if (st.playing) return; // never scan Cache during playback
    (async () => {
      try {
        if (localStorage.getItem(doneKey(r, s))) return;
        const c = await caches.open(CACHE), n = AYAHS[s - 1];
        for (let a = 1; a <= n; a++) if (!(await c.match(url(r, s, a)))) return;
        localStorage.setItem(doneKey(r, s), "1");
        notify();
      } catch (e) {}
    })();
  }
  function warm(r, s, a) {
    if (a < 1 || a > AYAHS[s - 1]) return;
    if (memo.has(mkey(r, s, a))) return;
    saveAyah(r, s, a).then(() => markSurahIfFull(r, s)).catch(() => {});
  }
  function pullSurah(r, s) {
    if (!navigator.onLine || localStorage.getItem(doneKey(r, s))) return;
    const key = r.id + ":" + s;
    if (surahPull && surahPull.key === key) return;
    const job = { key };
    surahPull = job;
    saveSurah(r, s, () => {}).then(() => {
      if (surahPull === job) surahPull = null;
      hydrateSurah(r, s);
      notify();
    }).catch(() => { if (surahPull === job) surahPull = null; });
  }
  // Load every ayah of this surah into RAM blob URLs once — then ayah switches are sync
  async function hydrateSurah(r, s) {
    const key = r.id + ":" + s, n = AYAHS[s - 1], prefix = key + ":";
    hydrateJob = key;
    for (const k of [...memo.keys()]) {
      if (k.startsWith(prefix)) continue;
      const u = memo.get(k);
      try { URL.revokeObjectURL(u); } catch (e) {}
      memo.delete(k);
    }
    try {
      const c = await caches.open(CACHE);
      for (let a = 1; a <= n; a++) {
        if (hydrateJob !== key) return;
        if (memo.has(mkey(r, s, a))) continue;
        const h = await c.match(url(r, s, a));
        if (h) memoPut(r, s, a, await h.arrayBuffer());
        if (a % 10 === 0) await new Promise((res) => setTimeout(res, 0));
      }
    } catch (e) {}
    if (hydrateJob === key && st.playing && st.s === s) armStandby(r, s, st.a);
  }
  async function resolveSrc(r, s, a) {
    const k = mkey(r, s, a);
    if (memo.has(k)) return memo.get(k);
    const hit = await cached(r, s, a);
    if (hit) return hit;
    if (localStorage.getItem(doneKey(r, s))) localStorage.removeItem(doneKey(r, s));
    return url(r, s, a);
  }
  function nextPos(s, a) {
    if (!s) return null;
    if (a < AYAHS[s - 1]) return [s, a + 1];
    if (s < 114) return [s + 1, 1];
    return null;
  }
  function prevPos(s, a) {
    if (!s) return null;
    if (a > 1) return [s, a - 1];
    if (s > 1) return [s - 1, AYAHS[s - 2]];
    return null;
  }
  function needsBism(s, a) {
    return a === 1 && s !== 1 && s !== 9 && !(st.playing && st.s === s && !st.bism);
  }
  function prime(r, s, a) {
    const stand = A[1 - curA];
    const token = { r: r.id, s, a, el: stand };
    nextReady = token;
    const apply = (src) => {
      if (nextReady !== token) return;
      token.src = src;
      if (stand.src !== src) {
        try { stand.pause(); stand.src = src; stand.load(); } catch (e) {}
      }
    };
    const k = mkey(r, s, a);
    if (memo.has(k)) apply(memo.get(k));
    else resolveSrc(r, s, a).then(apply).catch(() => {});
  }
  function armStandby(r, s, a) {
    const nxt = st.cont ? nextPos(s, a) : null;
    if (!nxt) { nextReady = null; return; }
    const ns = nxt[0], n = nxt[1];
    const stand = A[1 - curA];
    const token = { r: r.id, s: ns, a: n, el: stand };
    nextReady = token;
    const apply = (src) => {
      if (nextReady !== token) return;
      token.src = src;
      if (stand.src !== src) {
        try { stand.pause(); stand.src = src; stand.load(); } catch (e) {}
      }
    };
    const k = mkey(r, ns, n);
    if (ns !== s && n === 1 && ns !== 9) warm(r, 1, 1);
    if (memo.has(k)) apply(memo.get(k));
    else resolveSrc(r, ns, n).then(apply).catch(() => {});
    // also keep the next three ayahs as blobs so the handoff does not wait on the network
    let cs = ns, ca = n;
    for (let i = 0; i < 3 && cs; i++) {
      if (!memo.has(mkey(r, cs, ca))) {
        const xs = cs, xa = ca, ii = i;
        saveAyah(r, xs, xa).then(() => {
          if (ii === 0 && nextReady === token) {
            const src = memo.get(mkey(r, xs, xa));
            if (src) apply(src);
          }
        }).catch(() => {});
      }
      const step = nextPos(cs, ca);
      if (!step) break;
      cs = step[0]; ca = step[1];
    }
  }
  // Instant handoff when next blob is already on the standby element
  function advance() {
    if (st.left > 0) { st.left--; play(st.s, st.a, true); return; }
    const nxt = st.cont ? nextPos(st.s, st.a) : null;
    if (!nxt) { st.playing = false; st.paused = false; notify(); return; }
    const s = nxt[0], a = nxt[1], r = rec();
    if (needsBism(s, a)) {
      play(s, a).then(() => setTimeout(() => { if (st.playing && st.s === s && st.a === a) window.QM_GOTO && window.QM_GOTO(s + ":" + a); }, 150));
      return;
    }
    if (s !== st.s) hydrateSurah(r, s);
    const ready = nextReady && nextReady.r === r.id && nextReady.s === s && nextReady.a === a && nextReady.src;
    if (ready) {
      const gen = ++st.gen;
      A[curA].pause();
      curA = 1 - curA;
      nextReady = null;
      st.s = s; st.a = a; st.playing = true; st.paused = false;
      kick(audio());
      armStandby(r, s, a);
      notify();
      queueMicrotask(() => { if (st.gen === gen) window.QM_HL && window.QM_HL(s + ":" + a); });
      setTimeout(() => { if (st.gen === gen && st.playing) window.QM_GOTO && window.QM_GOTO(s + ":" + a); }, 150);
      return;
    }
    // memo hit without standby — still sync-ish
    const src = memo.get(mkey(r, s, a));
    if (src) {
      const gen = ++st.gen;
      A[1 - curA].pause();
      st.s = s; st.a = a; st.playing = true; st.paused = false;
      try { audio().src = src; } catch (e) {}
      kick(audio());
      armStandby(r, s, a);
      notify();
      queueMicrotask(() => { if (st.gen === gen) window.QM_HL && window.QM_HL(s + ":" + a); });
      setTimeout(() => { if (st.gen === gen && st.playing) window.QM_GOTO && window.QM_GOTO(s + ":" + a); }, 150);
      return;
    }
    play(s, a).then(() => setTimeout(() => { if (st.playing && st.s === s && st.a === a) window.QM_GOTO && window.QM_GOTO(s + ":" + a); }, 150));
  }
  async function playBism(s) {
    const r = rec(); const gen = ++st.gen;
    if (st.s !== s || st.a !== 1) st.left = reps() - 1;
    st.s = s; st.a = 1; st.bism = true; st.playing = true; st.paused = false; notify();
    if (hydrateJob !== r.id + ":" + s) hydrateSurah(r, s);
    const src = memo.has(mkey(r, 1, 1)) ? memo.get(mkey(r, 1, 1)) : await resolveSrc(r, 1, 1);
    if (gen !== st.gen) return;
    A[1 - curA].pause();
    try { audio().src = src; } catch (e) {}
    if (!(nextReady && nextReady.r === r.id && nextReady.s === s && nextReady.a === 1)) prime(r, s, 1);
    try { await audio().play(); } catch (e) {
      if (gen !== st.gen) return;
      st.bism = false;
      play(s, 1, true);
      return;
    }
    if (gen === st.gen) {
      window.QM_HL && window.QM_HL(s + ":1");
      setTimeout(() => { if (st.gen === gen && st.playing) window.QM_GOTO && window.QM_GOTO(s + ":1"); }, 150);
    }
  }
  async function play(s, a, rep) {
    if (!rep && needsBism(s, a)) return playBism(s);
    st.bism = false;
    const r = rec(); const gen = ++st.gen;
    if (st.s !== s || st.a !== a || !rep) st.left = reps() - 1;
    st.s = s; st.a = a; st.playing = true; st.paused = false; notify();
    if (hydrateJob !== r.id + ":" + s) hydrateSurah(r, s);
    let src = null, useStandby = false;
    if (nextReady && nextReady.r === r.id && nextReady.s === s && nextReady.a === a && nextReady.src) {
      src = nextReady.src; useStandby = true;
    }
    nextReady = null;
    if (!src) {
      const k = mkey(r, s, a);
      src = memo.has(k) ? memo.get(k) : await resolveSrc(r, s, a);
    }
    if (gen !== st.gen) return;
    if (useStandby) {
      A[curA].pause();
      curA = 1 - curA;
    } else {
      A[1 - curA].pause();
      try { audio().src = src; } catch (e) {}
    }
    const el = audio();
    if (!String(src).startsWith("blob:") && navigator.onLine) warm(r, s, a);
    if (st.cont) armStandby(r, s, a);
    else if (navigator.onLine) { for (let i = 1; i <= 3; i++) warm(r, s, a + i); }
    try { await el.play(); } catch (e) {
      if (gen !== st.gen) return;
      st.playing = false; st.paused = false; notify();
      window.QM_TOAST && window.QM_TOAST(navigator.onLine ? "Səs açılmadı" : "İnternet yoxdur — surəni əvvəlcə endirin");
    }
    if (gen === st.gen) window.QM_HL && window.QM_HL(s + ":" + a);
  }
  function pause() {
    if (!st.playing || st.paused) return;
    audio().pause(); st.paused = true; notify();
  }
  function resume() {
    if (!st.playing || !st.paused) return;
    audio().play().then(() => { st.paused = false; notify(); }).catch(() => {
      st.playing = false; st.paused = false; notify();
    });
  }
  function stop() {
    st.gen++; hydrateJob = null;
    A.forEach((x) => { x.pause(); try { x.removeAttribute("src"); x.load(); } catch (e) {} });
    st.playing = false; st.paused = false; st.bism = false; nextReady = null; notify();
  }
  function onEnded() {
    if (st.bism) { st.bism = false; play(st.s, 1, true); return; }
    advance();
  }
  function onErr() {
    if (!st.playing) return;
    if (st.bism) { st.bism = false; play(st.s, 1, true); return; }
    // if continuous and next exists, skip the broken ayah instead of dying
    if (st.cont && nextPos(st.s, st.a)) { advance(); return; }
    st.playing = false; st.paused = false; notify();
    window.QM_TOAST && window.QM_TOAST(navigator.onLine ? "Səs açılmadı" : "İnternet yoxdur — surəni əvvəlcə endirin");
  }
  A.forEach((x) => {
    x.addEventListener("ended", () => { if (x === audio()) onEnded(); });
    x.addEventListener("error", () => { if (x === audio()) onErr(); });
    x.addEventListener("canplaythrough", () => {
      if (nextReady && nextReady.el === x) nextReady.can = true;
    });
  });

  // listen mini-bar (style C): shows while an ayah plays
  const lb = el("div", "qlb"); lb.hidden = true;
  const lbLine = el("div", "qlb-line"), lbFill = el("i"); lbLine.append(lbFill);
  const lbT = el("span", "qlb-t", "0:00");
  const lbPrev = el("button", "qlb-n", "⏮"), lbPause = el("button", "qlb-pause"), lbStop = el("button", "qlb-stop"), lbNext = el("button", "qlb-n", "⏭");
  lbPause.append(el("i")); lbStop.append(el("i"));
  lbStop.title = "Dayandır"; lbPause.title = "Pauza"; lbPrev.title = "Əvvəlki ayə"; lbNext.title = "Növbəti ayə";
  lbPause.setAttribute("aria-label", "Pauza");
  const lbCont = el("button", "qlb-cont", "»"); lbCont.title = "Davam et — ayələri ard-arda oxu";
  lbCont.setAttribute("aria-label", "Davam et"); lbCont.setAttribute("aria-pressed", "false");
  const lbRep = el("div", "qlb-rep"), lbM = el("button", "", "−"), lbN = el("b", "", "1×"), lbP = el("button", "", "+");
  lbRep.append(lbM, lbN, lbP);
  const lbMid = el("div", "qlb-mid"); lbMid.append(lbPrev, lbPause, lbStop, lbNext);
  const SHORT = { maher: "Maher", husary: "Husary", qatami: "Qatami", dosari: "Dosari", ayyub: "Ayyub", jibreel: "Jibreel", shuraim: "Shuraim" };
  const lbQari = el("button", "qlb-qari");
  lbQari.type = "button";
  lbQari.setAttribute("aria-label", "Qari");
  lbQari.setAttribute("aria-expanded", "false");
  const qariMenu = el("div", "qlb-qaris");
  qariMenu.hidden = true;
  function closeQari() { qariMenu.hidden = true; lbQari.setAttribute("aria-expanded", "false"); }
  function pickReciter(id) {
    localStorage.setItem("qm.reciter", id);
    nextReady = null;
    closeQari();
    paintBar();
    if (st.playing && st.s) play(st.s, st.a);
  }
  for (const r of RECITERS) {
    const b = el("button", "", r.name);
    b.type = "button";
    b.onclick = (e) => { e.stopPropagation(); pickReciter(r.id); };
    qariMenu.append(b);
  }
  lbQari.onclick = (e) => {
    e.stopPropagation();
    if (!qariMenu.hidden) { closeQari(); return; }
    qariMenu.hidden = false;
    const r = lbQari.getBoundingClientRect();
    qariMenu.style.left = Math.max(8, Math.min(r.left, window.innerWidth - 220)) + "px";
    qariMenu.style.top = Math.max(8, r.top - 6) + "px";
    lbQari.setAttribute("aria-expanded", "true");
  };
  document.addEventListener("pointerdown", (e) => {
    if (qariMenu.hidden) return;
    const t = e.target;
    if (t instanceof Element && t.closest(".qlb-qari, .qlb-qaris")) return;
    closeQari();
  });
  lb.append(lbLine, lbT, lbQari, lbMid, lbCont, lbRep);
  st.cont = localStorage.getItem("qm.audio.cont") === "1";
  const setCont = (on) => {
    st.cont = !!on;
    localStorage.setItem("qm.audio.cont", st.cont ? "1" : "");
    lbCont.classList.toggle("on", st.cont);
    lbCont.setAttribute("aria-pressed", st.cont ? "true" : "false");
    if (st.cont && st.playing) {
      const r = rec();
      pullSurah(r, st.s);
      armStandby(r, st.s, st.a);
    }
    notify();
  };
  lbCont.onclick = () => setCont(!st.cont);
  const go = (d) => { const nxt = d > 0 ? nextPos(st.s, st.a) : prevPos(st.s, st.a); if (!nxt) return; play(nxt[0], nxt[1]); setTimeout(() => { if (st.playing && st.s === nxt[0] && st.a === nxt[1]) window.QM_GOTO && window.QM_GOTO(nxt[0] + ":" + nxt[1]); }, 150); };
  lbPrev.onclick = () => go(-1); lbNext.onclick = () => go(1); lbStop.onclick = stop;
  lbPause.onclick = () => { if (st.paused) resume(); else pause(); };
  const setRep = (d) => { const n = Math.min(9, Math.max(1, reps() + d)); localStorage.setItem("qm.audio.rep", n); st.left = Math.max(0, Math.min(st.left + d, n - 1)); paintBar(); };
  lbM.onclick = () => setRep(-1); lbP.onclick = () => setRep(1);
  const fmt = (x) => { x = Math.max(0, Math.floor(x || 0)); return Math.floor(x / 60) + ":" + String(x % 60).padStart(2, "0"); };
  function paintBar() {
    lb.hidden = !st.playing; document.body.classList.toggle("qlb-on", st.playing);
    lbN.textContent = reps() + "×";
    lbCont.classList.toggle("on", !!st.cont);
    lbCont.setAttribute("aria-pressed", st.cont ? "true" : "false");
    lbPause.classList.toggle("paused", !!st.paused);
    lbPause.title = st.paused ? "Davam et" : "Pauza";
    lbPause.setAttribute("aria-label", st.paused ? "Davam et" : "Pauza");
    const el = audio();
    const d = el.duration, c = el.currentTime;
    lbT.textContent = fmt(isFinite(d) ? d - c : 0);
    lbFill.style.width = isFinite(d) && d ? (c / d * 100) + "%" : "0";
    lbPrev.disabled = !prevPos(st.s, st.a); lbNext.disabled = !nextPos(st.s, st.a);
    const cur = rec();
    lbQari.textContent = (SHORT[cur.id] || cur.name) + " ▾";
    qariMenu.querySelectorAll("button").forEach((b, i) => b.classList.toggle("on", RECITERS[i].id === cur.id));
    if (playBtn) playBtn.classList.toggle("on", st.playing && !st.paused);
  }
  A.forEach((x) => { x.addEventListener("timeupdate", () => { if (x === audio()) paintBar(); }); x.addEventListener("loadedmetadata", () => { if (x === audio()) paintBar(); }); });
  let playBtn = null;
  function mountPlay() {
    var acts = document.querySelector(".hdr-acts");
    if (!acts || document.getElementById("qm-play")) return;
    playBtn = el("button", "gear");
    playBtn.id = "qm-play";
    playBtn.type = "button";
    playBtn.title = "Qiraət";
    playBtn.setAttribute("aria-label", "Qiraət");
    playBtn.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" fill="currentColor"/></svg>';
    playBtn.onclick = function () {
      if (st.playing && !st.paused) { pause(); return; }
      if (st.playing && st.paused) { resume(); return; }
      var pg = window.QM_PAGE && window.QM_PAGE();
      var key = pg && pg.keys && pg.keys[0];
      var ps = String(key || "").split(":");
      if (ps.length !== 2) return;
      setCont(true);
      play(+ps[0], +ps[1]);
    };
    acts.insertBefore(playBtn, acts.firstChild);
    paintBar();
  }
  (document.body ? Promise.resolve() : new Promise((r) => addEventListener("DOMContentLoaded", r))).then(() => { document.body.append(lb, qariMenu); mountPlay(); });

  // panel for the ayah sheet
  function panel(s, a) {
    const box = el("div", "qa-box");
    const row = el("div", "qa-row");
    const pick = el("select", "qa-pick"); for (const r of RECITERS) { const o = el("option", "", r.name); o.value = r.id; pick.append(o); }
    pick.value = rec().id; pick.onchange = () => { localStorage.setItem("qm.reciter", pick.value); if (st.playing) play(st.s, st.a); paint(); };
    const pb = el("button", "qa-b main"); const cont = el("label", "qa-cont"); const cb = el("input"); cb.type = "checkbox"; cb.checked = !!st.cont; cont.append(cb, el("span", "", " Davamlı"));
    cb.onchange = () => setCont(cb.checked);
    pb.onclick = () => { if (st.playing && st.s === s) { if (st.paused) resume(); else pause(); return; } window.QM_CLOSEAYAH && window.QM_CLOSEAYAH(); play(s, a); };
    const rp = el("select", "qa-pick qa-rep"); for (let i = 1; i <= 9; i++) { const o = el("option", "", "×" + i); o.value = i; rp.append(o); }
    rp.title = "Təkrar"; rp.value = reps(); rp.onchange = () => { localStorage.setItem("qm.audio.rep", rp.value); };
    row.append(pb, pick, rp, cont);
    const row2 = el("div", "qa-row");
    const da = el("button", "qa-b", "⬇ Bu ayə"), ds = el("button", "qa-b"), msg = el("span", "qa-msg");
    da.onclick = async () => { msg.textContent = "Endirilir…"; try { await saveAyah(rec(), s, a); msg.textContent = "✓ Ayə cihazda"; } catch (e) { msg.textContent = navigator.onLine ? "Alınmadı" : "İnternet yoxdur"; } };
    ds.onclick = async () => {
      const r = rec();
      if (localStorage.getItem(doneKey(r, s))) return;
      ds.disabled = true;
      try { await saveSurah(r, s, (d, n) => (msg.textContent = "Endirilir " + d + "/" + n)); msg.textContent = "✓ Surə cihazda (internetsiz)"; hydrateSurah(r, s); }
      catch (e) { msg.textContent = navigator.onLine ? "Alınmadı: " + e.message : "İnternet yoxdur"; }
      ds.disabled = false; paint();
    };
    row2.append(da, ds, msg);
    box.append(row, row2);
    function paint() { pb.textContent = st.playing && st.s === s ? (st.paused ? "▶ Davam" : "⏸ Pauza") : "▶ Dinlə"; pb.onclick = () => { if (st.playing && st.s === s) { if (st.paused) resume(); else pause(); return; } window.QM_CLOSEAYAH && window.QM_CLOSEAYAH(); play(s, a); }; const done = !!localStorage.getItem(doneKey(rec(), s)); ds.textContent = done ? "✓ Surə cihazda" : "⬇ Tam surə"; ds.disabled = done; }
    paint(); listeners.clear(); listeners.add(paint);
    box.hidden = true;
    return box;
  }
  const css = el("style"); css.textContent = ".qa-box[hidden]{display:none}.qa-box{margin:0 0 .5rem;padding:.55rem .6rem;border:1px solid rgba(196,165,110,.35);border-radius:12px;background:#fdfaf3;display:flex;flex-direction:column;gap:.4rem;font-size:.82rem;color:#1a3330}.qa-row{display:flex;flex-wrap:wrap;gap:.35rem;align-items:center}.qa-row+.qa-row{padding-top:.4rem;border-top:1px solid rgba(196,165,110,.22)}.qa-b{border:1px solid rgba(196,165,110,.5);background:transparent;color:#1a3330;border-radius:999px;padding:.28rem .7rem;font:inherit;font-size:.78rem;letter-spacing:.01em;cursor:pointer}.qa-b:disabled{opacity:.5}.qa-b.main{background:#1a3330;color:#fbf6ec;border-color:#1a3330;font-weight:600;padding:.32rem .85rem}.qa-pick{flex:1;min-width:7rem;font:inherit;font-size:.8rem;padding:.28rem .5rem;border:1px solid rgba(196,165,110,.5);border-radius:999px;background:#fff;color:#1a3330}.qa-rep{flex:0 0 auto;min-width:3.4rem}.qa-cont{display:flex;align-items:center;gap:.2rem;font-size:.78rem;opacity:.85}.qa-cont input{accent-color:#1a3330;margin:0}.qa-msg{flex-basis:100%;font-size:.72rem;opacity:.65}.qa-msg:empty{display:none}.qlb[hidden]{display:none}.qlb{position:fixed;left:50%;transform:translateX(-50%);bottom:calc(1.15rem + env(safe-area-inset-bottom));width:min(96vw,640px);z-index:60;display:flex;flex-wrap:nowrap;align-items:center;justify-content:space-between;gap:.28rem;padding:.16rem .38rem;background:#fbf6ec;color:#1a3330;font-size:.72rem}.qlb-qari{flex:0 1 auto;max-width:4.4rem;border:1px solid #c4a56e;border-radius:999px;background:#fff;color:#1a3330;font:inherit;font-size:.64rem;font-weight:600;padding:.06rem .36rem;cursor:pointer;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.qlb-qaris{position:fixed;z-index:80;transform:translateY(-100%);display:flex;flex-direction:column;min-width:12.5rem;padding:.28rem;background:#fbf6ec;border:1px solid #c4a56e;border-radius:14px;box-shadow:0 10px 28px rgba(26,51,48,.16)}.qlb-qaris[hidden]{display:none}.qlb-qaris button{border:0;background:transparent;color:#1a3330;font:inherit;font-size:.8rem;text-align:start;padding:.42rem .6rem;border-radius:9px;cursor:pointer}.qlb-qaris button.on{background:#1a3330;color:#fbf6ec}.qlb-line{position:absolute;left:0;right:0;top:0;height:1.5px;background:rgba(196,165,110,.45)}.qlb-line i{display:block;height:100%;width:0;background:#c4a56e}.qlb-t{min-width:2.05rem;color:#a8893f;font-weight:600;font-variant-numeric:tabular-nums;font-size:.66rem}.qlb-mid{display:flex;align-items:center;gap:.32rem}.qlb-n{border:0;background:none;font-size:.92rem;color:#2c3a2a;cursor:pointer;padding:.02rem;line-height:1}.qlb-n:disabled{opacity:.3}.qlb-stop,.qlb-pause{width:28px;height:28px;border-radius:50%;border:0;display:grid;place-items:center;cursor:pointer}.qlb-stop{background:#5f6b2f}.qlb-pause{background:#1a3330}.qlb-stop i{width:8px;height:8px;border-radius:1px;background:#fbf6ec}.qlb-pause i{width:0;height:0;border-style:solid;border-width:5px 0 5px 8px;border-color:transparent transparent transparent #fbf6ec;background:none;border-radius:0}.qlb-pause:not(.paused) i{width:7px;height:9px;border:0;background:transparent;box-shadow:inset 2px 0 0 #fbf6ec, inset -2px 0 0 #fbf6ec;border-radius:0}.qlb-rep{display:flex;align-items:center;gap:.22rem;border:1px solid #c4a56e;border-radius:999px;padding:.02rem .32rem}.qlb-rep button{border:0;background:none;color:#1a3330;font-size:.74rem;cursor:pointer;padding:0}.qlb-rep b{min-width:1.25rem;text-align:center;font-size:.66rem}.qlb-cont{border:1px solid #c4a56e;border-radius:999px;background:transparent;color:#1a3330;font:inherit;font-size:.78rem;font-weight:700;letter-spacing:-.05em;padding:.05rem .34rem;cursor:pointer;line-height:1}.qlb-cont.on{background:#1a3330;color:#fbf6ec;border-color:#1a3330}body:has(.qlb:not([hidden])) .page{padding-bottom:2.15rem}#qm-play.on{color:#0b6b4f}";
  document.head.append(css);
  document.addEventListener("click", (e) => {
    if (sessionStorage.getItem("qm.autotilawa") !== "1") return;
    const btn = e.target instanceof Element && e.target.closest("#gate .srow");
    if (!btn) return;
    const s = +btn.dataset.n;
    if (!(s >= 1 && s <= 114)) return;
    setCont(true);
    setTimeout(() => play(s, 1), 250);
  });
  window.QA = { panel, play, stop, RECITERS };
})();
