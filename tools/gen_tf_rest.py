import html, json, os, re
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(R)
E = html.escape
B = "https://mushafuk.online"
ARN = re.search(r'const ARNAMES = "([^"]*)"', open("quran/index.html", encoding="utf8").read()).group(1).split(",")
LIST = json.load(open("lib-list.json", encoding="utf8"))
BOOKS = [r for r in LIST if r.get("k") == "tf" and r["id"] != "saadi"]
TXT = {}
for line in open("quran-uthmani.txt", encoding="utf8"):
    p = line.rstrip("\n").split("|")
    if len(p) == 3:
        TXT[(int(p[0]), int(p[1]))] = p[2]
DIG = "٠١٢٣٤٥٦٧٨٩"
def ar(n):
    return "".join(DIG[int(c)] for c in str(n))
HEAD = '<script>try{if(sessionStorage.getItem("qm.tfdir"))document.documentElement.classList.add("qm-turning")}catch(e){}</script><style>html.qm-turning body{opacity:0}</style>'
for book in BOOKS:
    bid, name, by = book["id"], book["name"], book.get("by") or ""
    ayahs = []
    for s in range(1, 115):
        v = json.load(open(f"tf/{bid}/{s}.json", encoding="utf8"))
        for a, raw in enumerate(v, 1):
            ayahs.append((s, a, raw or ""))
    span = {}
    i = 0
    while i < len(ayahs):
        s, a, raw = ayahs[i]
        if not raw.strip():
            i += 1
            continue
        j = i
        while j + 1 < len(ayahs) and ayahs[j + 1][0] == s and not ayahs[j + 1][2].strip():
            j += 1
        for k in range(i, j + 1):
            span[ayahs[k][0], ayahs[k][1]] = (a, ayahs[j][1], raw)
        i = j + 1
    order = [(s, a) for s, a, _ in ayahs]
    urls = [f"{B}/tafsir/{bid}/"]
    for n, (s, a) in enumerate(order):
        fr, to, raw = span.get((s, a), (a, a, ""))
        prev = f"/tafsir/{bid}/{order[n-1][0]}/{order[n-1][1]}/" if n else ""
        nxt = f"/tafsir/{bid}/{order[n+1][0]}/{order[n+1][1]}/" if n + 1 < len(order) else ""
        sname = ARN[s - 1]
        title = f"{name} — سورة {sname}، الآية {ar(a)}"
        desc = re.sub(r"\s+", " ", raw).strip()[:160]
        ay = TXT.get((s, a), "")
        rng = f'<small class="rng">الآيات {ar(fr)}–{ar(to)}</small>' if fr != to else ""
        body = E(raw) if raw.strip() else "لا يوجد نص مستقل لهذه الآية في هذا التفسير."
        links = []
        if prev:
            links.append(f'<link rel="prev" href="{B}{prev}">')
        if nxt:
            links.append(f'<link rel="next" href="{B}{nxt}">')
        pn = '<nav class="pn">'
        pn += f'<a href="{prev}">الآية السابقة</a>' if prev else "<span></span>"
        pn += f'<a href="{nxt}">الآية التالية</a>' if nxt else "<span></span>"
        pn += "</nav>"
        url = f"{B}/tafsir/{bid}/{s}/{a}/"
        urls.append(url)
        doc = (
            '<!doctype html><html lang="ar" dir="rtl"><head>' + HEAD +
            '<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
            f'<title>{E(title)} | Mushafuk.online</title><meta name="description" content="{E(desc)}">'
            f'<link rel="canonical" href="{url}">{"".join(links)}<link rel="icon" href="/icon.png">'
            '<link rel="stylesheet" href="/tafsir/saadi.css?v=2"><link rel="preconnect" href="https://fonts.googleapis.com">'
            '<link href="https://fonts.googleapis.com/css2?family=Amiri&display=swap" rel="stylesheet"></head><body>'
            f'<header class="bar"><a class="x" href="/tafsir/{bid}/" aria-label="إغلاق">×</a>'
            f'<div class="who"><b>{E(sname)}</b><small>الآية {ar(a)}</small></div></header>'
            f'<main id="tf"><p class="src">{E(name)} — {E(by)}</p>'
            f'<p class="ay" dir="rtl" lang="ar">{E(ay)} ﴿{ar(a)}﴾</p>'
            f'<div class="tx" lang="ar">{rng}{body}</div>{pn}</main>'
            f'<script src="/tafsir/turn.js?v=2" data-next="{E(nxt)}" data-prev="{E(prev)}"></script>'
            '</body></html>'
        )
        o = f"tafsir/{bid}/{s}/{a}"
        os.makedirs(o, exist_ok=True)
        open(o + "/index.html", "w", encoding="utf8").write(doc)
    items = "".join(
        f'<a href="/tafsir/{bid}/{s}/1/"><span class="k">{s}</span><span class="nm">{E(ARN[s-1])}<small>{sum(1 for x, y in order if x == s)} آية</small></span></a>'
        for s in range(1, 115)
    )
    idx = f'''<!doctype html><html lang="ar" dir="rtl"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{E(name)} | Mushafuk.online</title><meta name="description" content="{E(name)} — {E(by)}، آية بآية."><link rel="canonical" href="{B}/tafsir/{bid}/"><link rel="icon" href="/icon.png"><link rel="stylesheet" href="/site.css?v=7"><link rel="stylesheet" href="/tafsir/saadi.css"></head><body><header class="nav"><div class="in"><a class="logo" href="/" dir="ltr"><img src="/icon.png" alt="">Mushafuk<span>.online</span></a><nav><a href="/quran/">القرآن</a><a href="/tafsir.html" class=on>التفاسير</a><a href="/translations/">الترجمات</a></nav></div></header><main class="idx"><h1>{E(name)}</h1><p class="sub">{E(by)} — بالعربية، كل آية في صفحة</p><div class="sl">{items}</div></main><footer>© 2026 Mushafuk.online</footer></body></html>'''
    open(f"tafsir/{bid}/index.html", "w", encoding="utf8").write(idx)
    for path, pre in (("tafsir.html", "tafsir/"), ("az/tafsir.html", "../tafsir/"), ("tr/tafsir.html", "../tafsir/"), ("en/tafsir.html", "../tafsir/"), ("ru/tafsir.html", "../tafsir/")):
        t = open(path, encoding="utf8").read()
        old = f'href="quran/"><div class="n" dir="rtl">{name}</div>'
        new = f'href="{pre}{bid}/"><div class="n" dir="rtl">{name}</div>'
        t2 = t.replace(old, new, 1)
        if t2 == t:
            raise SystemExit("card not updated: " + path + " " + name)
        open(path, "w", encoding="utf8").write(t2)
    sm = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + "".join(f"<url><loc>{u}</loc></url>\n" for u in urls) + "</urlset>\n"
    fn = f"sitemap-tf-{bid}.xml"
    open(fn, "w", encoding="utf8").write(sm)
    ix = open("sitemap.xml", encoding="utf8").read()
    if fn not in ix:
        open("sitemap.xml", "w", encoding="utf8").write(ix.replace("</sitemapindex>", f"<sitemap><loc>{B}/{fn}</loc></sitemap>\n</sitemapindex>"))
    print(bid, len(urls))
print("done", len(BOOKS))
