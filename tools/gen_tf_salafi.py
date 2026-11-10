#!/usr/bin/env python3
"""Arabic ayah pages for Shinqiti, Shawkani and Ibn Uthaymeen."""
import html, json, os, re, urllib.request
from concurrent.futures import ThreadPoolExecutor

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(R)
E = html.escape
B = "https://mushafuk.online"
ARN = re.search(r'const ARNAMES = "([^"]*)"', open("quran/index.html", encoding="utf8").read()).group(1).split(",")
AYAHS = [int(x) for x in "7,286,200,176,120,165,206,75,129,109,123,111,43,52,99,128,111,110,98,135,112,78,118,64,77,227,93,88,69,60,34,30,73,54,45,83,182,88,75,85,54,53,89,59,37,35,38,29,18,45,60,49,62,55,78,96,29,22,24,13,14,11,11,18,12,12,30,52,52,44,28,28,20,56,40,31,50,40,46,42,29,19,36,25,22,17,19,26,30,20,15,21,11,8,8,19,5,8,8,11,11,8,3,9,5,4,7,3,6,3,5,4,5,6".split(",")]
assert sum(AYAHS) == 6236
DIG = "٠١٢٣٤٥٦٧٨٩"
PAGE = re.compile(r"\(p-[0-9٠-٩]+\)")
TXT = {}
for line in open("quran-uthmani.txt", encoding="utf8"):
    p = line.rstrip("\n").split("|")
    if len(p) == 3:
        TXT[(int(p[0]), int(p[1]))] = p[2]

def ar(n):
    return "".join(DIG[int(c)] for c in str(n))

def clean(raw):
    t = PAGE.sub("", raw or "")
    return re.sub(r"[ \t]+\n", "\n", t).strip()

BOOKS = [
    ("shinqiti", "adwa-al-bayan", "أضواء البيان", "الشنقيطي"),
    ("shawkani", "fath-al-qadir-al-shawkani", "فتح القدير", "الشوكاني"),
    ("uthaymeen", "tafsir-ibn-uthaymeen", "تفسير ابن عثيمين", "ابن عثيمين"),
]
CACHE = "/tmp/tfsrc"

def fetch(slug, s):
    dest = os.path.join(CACHE, slug, f"{s}.json")
    if os.path.exists(dest) and os.path.getsize(dest) > 20:
        return dest
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    url = f"https://raw.githubusercontent.com/spa5k/tafsir_api/main/tafsir/{slug}/{s}.json"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    data = urllib.request.urlopen(req, timeout=90).read()
    open(dest, "wb").write(data)
    return dest

def load(slug):
    by = {}
    with ThreadPoolExecutor(12) as pool:
        futs = [pool.submit(fetch, slug, s) for s in range(1, 115)]
        for f in futs:
            f.result()
    for s in range(1, 115):
        rows = json.load(open(os.path.join(CACHE, slug, f"{s}.json"), encoding="utf8"))
        arr = [""] * AYAHS[s - 1]
        for it in rows:
            a = int(it.get("ayah") or 0)
            if 1 <= a <= AYAHS[s - 1]:
                arr[a - 1] = clean(it.get("text") or "")
        by[s] = arr
    return by

def build(bid, slug, name, by):
    print("build", bid, flush=True)
    text = load(slug)
    os.makedirs(f"tf/{bid}", exist_ok=True)
    for s, arr in text.items():
        if len(arr) != AYAHS[s - 1]:
            raise SystemExit(f"bad length {bid} {s}")
        open(f"tf/{bid}/{s}.json", "w", encoding="utf8").write(json.dumps(arr, ensure_ascii=False, separators=(",", ":")))
    order = [(s, a) for s in range(1, 115) for a in range(1, AYAHS[s - 1] + 1)]
    urls = [f"{B}/tafsir/{bid}/"]
    noted = 0
    for n, (s, a) in enumerate(order):
        raw = text[s][a - 1]
        prev = f"/tafsir/{bid}/{order[n-1][0]}/{order[n-1][1]}/" if n else ""
        nxt = f"/tafsir/{bid}/{order[n+1][0]}/{order[n+1][1]}/" if n + 1 < len(order) else ""
        sname = ARN[s - 1]
        title = f"{name} — سورة {sname}، الآية {ar(a)}"
        if raw:
            body = E(raw)
            desc = re.sub(r"\s+", " ", raw)[:160]
        else:
            body = "لا يوجد نص لهذه الآية في هذا التفسير."
            desc = body
            noted += 1
        links = []
        if prev:
            links.append(f'<link rel="prev" href="{B}{prev}">')
        if nxt:
            links.append(f'<link rel="next" href="{B}{nxt}">')
        pn = "<nav class=\"pn\">"
        pn += f'<a href="{prev}">الآية السابقة</a>' if prev else "<span></span>"
        pn += f'<a href="{nxt}">الآية التالية</a>' if nxt else "<span></span>"
        pn += "</nav>"
        url = f"{B}/tafsir/{bid}/{s}/{a}/"
        urls.append(url)
        ay = TXT.get((s, a), "")
        doc = (
            '<!doctype html><html lang="ar" dir="rtl"><head><meta charset="UTF-8">'
            '<meta name="viewport" content="width=device-width,initial-scale=1">'
            f'<title>{E(title)} | Mushafuk.online</title>'
            f'<meta name="description" content="{E(desc)}">'
            f'<link rel="canonical" href="{url}">{"".join(links)}<link rel="icon" href="/icon.png">'
            '<link rel="stylesheet" href="/tafsir/saadi.css?v=2">'
            '<link href="https://fonts.googleapis.com/css2?family=Amiri&display=swap" rel="stylesheet"></head><body>'
            f'<header class="bar"><a class="x" href="/tafsir/{bid}/" aria-label="إغلاق">×</a>'
            f'<div class="who"><b>{E(sname)}</b><small>الآية {ar(a)}</small></div></header>'
            f'<main id="tf"><p class="src">{E(name)} — {E(by)}</p>'
            f'<p class="ay" dir="rtl" lang="ar">{E(ay)} ﴿{ar(a)}﴾</p>'
            f'<div class="tx" lang="ar">{body}</div>{pn}</main>'
            f'<script src="/tafsir/turn.js?v=4" data-next="{E(nxt)}" data-prev="{E(prev)}"></script>'
            "</body></html>"
        )
        # ayah HTML is not written: GitHub Pages rejected the extra size.
        # the book index loads /tf/{bid}/{s}.json through tafsir/tfread.js
        pass
    items = "".join(
        f'<a href="/tafsir/{bid}/{s}/1/"><span class="k">{s}</span><span class="nm">{E(ARN[s-1])}<small>{AYAHS[s-1]} آية</small></span></a>'
        for s in range(1, 115)
    )
    idx = (
        '<!doctype html><html lang="ar" dir="rtl"><head><meta charset="UTF-8">'
        '<meta name="viewport" content="width=device-width,initial-scale=1">'
        f'<title>{E(name)} | Mushafuk.online</title>'
        f'<meta name="description" content="{E(name)} — {E(by)}، آية بآية.">'
        f'<link rel="canonical" href="{B}/tafsir/{bid}/"><link rel="icon" href="/icon.png">'
        '<link rel="stylesheet" href="/site.css?v=8"><link rel="stylesheet" href="/tafsir/saadi.css?v=2"></head><body>'
        '<header class="nav"><div class="in"><a class="logo" href="/" dir="ltr"><img src="/icon.png" alt="">Mushafuk<span>.online</span></a>'
        '<nav><a href="/quran/">القرآن</a><a href="/tafsir.html" class=on>التفاسير</a><a href="/translations/">الترجمات</a></nav></div></header>'
        f'<main class="idx"><h1>{E(name)}</h1><p class="sub">{E(by)} — بالعربية، كل آية في صفحة</p><div class="sl">{items}</div></main>'
        "<footer>© 2026 Mushafuk.online</footer></body></html>"
    )
    open(f"tafsir/{bid}/index.html", "w", encoding="utf8").write(idx)
    sm = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    sm += "".join(f"<url><loc>{u}</loc></url>\n" for u in urls) + "</urlset>\n"
    fn = f"sitemap-tf-{bid}.xml"
    open(fn, "w", encoding="utf8").write(sm)
    ix = open("sitemap.xml", encoding="utf8").read()
    if fn not in ix:
        open("sitemap.xml", "w", encoding="utf8").write(ix.replace("</sitemapindex>", f"<sitemap><loc>{B}/{fn}</loc></sitemap>\n</sitemapindex>"))
    filled = sum(1 for s in text.values() for x in s if x)
    print(" wrote", bid, "filled", filled, "empty", noted, flush=True)

def lists():
    rows = [
        ("shinqiti", "أضواء البيان", "الشنقيطي"),
        ("shawkani", "فتح القدير", "الشوكاني"),
        ("uthaymeen", "تفسير ابن عثيمين", "ابن عثيمين"),
    ]
    for path, href in (
        ("tafsir/ereb/index.html", "../{id}/"),
        ("az/tafsir/ereb/index.html", "../../../tafsir/{id}/"),
        ("tr/tafsir/ereb/index.html", "../../../tafsir/{id}/"),
        ("en/tafsir/ereb/index.html", "../../../tafsir/{id}/"),
        ("ru/tafsir/ereb/index.html", "../../../tafsir/{id}/"),
    ):
        t = open(path, encoding="utf8").read()
        bits = ""
        for bid, name, who in rows:
            if f"tafsir/{bid}/" in t or f"../{bid}/" in t:
                continue
            bits += f'<a class="item" href="{href.format(id=bid)}"><div class="n" dir="rtl">{name}</div><div class="b">{who}</div><span class="tag">العربية</span></a>'
        if bits:
            t = t.replace("</div></div><footer>", bits + "</div></div><footer>", 1)
        if path.endswith("tafsir/ereb/index.html") and not path.startswith(("az/", "tr/", "en/", "ru/")):
            t = t.replace('<span class="tag">٨</span>', '<span class="tag">١١</span>', 1)
        else:
            t = t.replace('<span class="tag">8</span>', '<span class="tag">11</span>', 1)
        open(path, "w", encoding="utf8").write(t)
    allp = "tafsir/all/index.html"
    t = open(allp, encoding="utf8").read()
    t = t.replace("التفاسير الثمانية", "التفاسير الأحد عشر")
    open(allp, "w", encoding="utf8").write(t)
    js = open("tafsir/all/app.js", encoding="utf8").read()
    extra = '''    ["tabari", "جامع البيان", "الطبري"],
    ["shinqiti", "أضواء البيان", "الشنقيطي"],
    ["shawkani", "فتح القدير", "الشوكاني"],
    ["uthaymeen", "تفسير ابن عثيمين", "ابن عثيمين"]'''
    if "shinqiti" not in js:
        js = js.replace('    ["tabari", "جامع البيان", "الطبري"]', extra, 1)
        js = js.replace("var HEAVY = { ibnkathir: 1, baghawi: 1, tabari: 1 };",
                        "var HEAVY = { ibnkathir: 1, baghawi: 1, tabari: 1, shawkani: 1, uthaymeen: 1 };", 1)
        open("tafsir/all/app.js", "w", encoding="utf8").write(js)
    lib = open("lib.js", encoding="utf8").read()
    old = "saadi|muyassar|mukhtasar|ibnkathir|baghawi|samani|aysar|tabari"
    new = old + "|shinqiti|shawkani|uthaymeen"
    if old in lib and "shinqiti" not in lib:
        lib = lib.replace(old, new, 1)
        open("lib.js", "w", encoding="utf8").write(lib)
    data = json.load(open("lib-list.json", encoding="utf8"))
    if not any(x.get("id") == "shinqiti" for x in data):
        i = next(n for n, x in enumerate(data) if x.get("id") == "tabari") + 1
        data[i:i] = [
            {"id": "shinqiti", "k": "tf", "name": "أضواء البيان", "by": "الشنقيطي", "lang": "ar", "dir": "rtl", "per": True, "mb": 8},
            {"id": "shawkani", "k": "tf", "name": "فتح القدير", "by": "الشوكاني", "lang": "ar", "dir": "rtl", "per": True, "mb": 20},
            {"id": "uthaymeen", "k": "tf", "name": "تفسير ابن عثيمين", "by": "ابن عثيمين", "lang": "ar", "dir": "rtl", "per": True, "mb": 40},
        ]
        open("lib-list.json", "w", encoding="utf8").write(json.dumps(data, ensure_ascii=False, separators=(", ", ": ")))

if __name__ == "__main__":
    for bid, slug, name, who in BOOKS:
        build(bid, slug, name, who)
    lists()
    print("done")
