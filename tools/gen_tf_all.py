import html, os, re
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(R)
E = html.escape
B = "https://mushafuk.online"
ARN = re.search(r'const ARNAMES = "([^"]*)"', open("quran/index.html", encoding="utf8").read()).group(1).split(",")
AYAHS = [int(x) for x in "7,286,200,176,120,165,206,75,129,109,123,111,43,52,99,128,111,110,98,135,112,78,118,64,77,227,93,88,69,60,34,30,73,54,45,83,182,88,75,85,54,53,89,59,37,35,38,29,18,45,60,49,62,55,78,96,29,22,24,13,14,11,11,18,12,12,30,52,52,44,28,28,20,56,40,31,50,40,46,42,29,19,36,25,22,17,19,26,30,20,15,21,11,8,8,19,5,8,8,11,11,8,3,9,5,4,7,3,6,3,5,4,5,6".split(",")]
DIG = "٠١٢٣٤٥٦٧٨٩"
def ar(n):
    return "".join(DIG[int(c)] for c in str(n))
TXT = {}
for line in open("quran-uthmani.txt", encoding="utf8"):
    p = line.rstrip("\n").split("|")
    if len(p) == 3:
        TXT[(int(p[0]), int(p[1]))] = p[2]
order = [(s, a) for s in range(1, 115) for a in range(1, AYAHS[s - 1] + 1)]
urls = [f"{B}/tafsir/all/"]
for n, (s, a) in enumerate(order):
    prev = f"/tafsir/all/{order[n-1][0]}/{order[n-1][1]}/" if n else ""
    nxt = f"/tafsir/all/{order[n+1][0]}/{order[n+1][1]}/" if n + 1 < len(order) else ""
    name = ARN[s - 1]
    title = f"جميع التفاسير — سورة {name}، الآية {ar(a)}"
    ay = TXT.get((s, a), "")
    links = []
    if prev:
        links.append(f'<link rel="prev" href="{B}{prev}">')
    if nxt:
        links.append(f'<link rel="next" href="{B}{nxt}">')
    url = f"{B}/tafsir/all/{s}/{a}/"
    urls.append(url)
    doc = (
        '<!doctype html><html lang="ar" dir="rtl"><head><meta charset="UTF-8">'
        '<meta name="viewport" content="width=device-width,initial-scale=1">'
        f'<title>{E(title)} | Mushafuk.online</title>'
        f'<link rel="canonical" href="{url}">{"".join(links)}'
        '<link rel="icon" href="/icon.png"><link rel="stylesheet" href="/tafsir/all/all.css">'
        '<link href="https://fonts.googleapis.com/css2?family=Amiri&display=swap" rel="stylesheet"></head><body>'
        f'<header class="bar"><a class="x" href="/tafsir/all/" aria-label="إغلاق">×</a>'
        f'<div class="who"><b>{E(name)}</b><small>جميع التفاسير — الآية {ar(a)}</small></div></header>'
        f'<main><p class="ay" dir="rtl" lang="ar">{E(ay)} ﴿{ar(a)}﴾</p><div id="cards"></div></main>'
        f'<script>window.QM_ALL={{s:{s},a:{a},next:"{nxt}",prev:"{prev}"}}</script>'
        '<script src="/tafsir/all/app.js"></script></body></html>'
    )
    o = f"tafsir/all/{s}/{a}"
    os.makedirs(o, exist_ok=True)
    open(o + "/index.html", "w", encoding="utf8").write(doc)
items = "".join(
    f'<a href="/tafsir/all/{s}/1/"><span class="k">{s}</span><span class="nm">{E(ARN[s-1])}<small>{AYAHS[s-1]} آية</small></span></a>'
    for s in range(1, 115)
)
idx = f'''<!doctype html><html lang="ar" dir="rtl"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>جميع التفاسير | Mushafuk.online</title><link rel="canonical" href="{B}/tafsir/all/"><link rel="icon" href="/icon.png"><link rel="stylesheet" href="/site.css?v=7"><link rel="stylesheet" href="/tafsir/all/all.css"></head><body><header class="nav"><div class="in"><a class="logo" href="/" dir="ltr"><img src="/icon.png" alt="">Mushafuk<span>.online</span></a><nav><a href="/quran/">القرآن</a><a href="/tafsir.html" class=on>التفاسير</a><a href="/translations/">الترجمات</a></nav></div></header><main class="idx"><h1>جميع التفاسير</h1><p class="sub">كل آية في صفحة، وتحتها التفاسير الثمانية في بطاقات</p><div class="sl">{items}</div></main><footer>© 2026 Mushafuk.online</footer></body></html>'''
open("tafsir/all/index.html", "w", encoding="utf8").write(idx)
cards = {
    "tafsir.html": '<a class="item" href="tafsir/all/"><div class="n" dir="rtl">جميع التفاسير</div><div class="b">كل آية، كل التفاسير</div><span class="tag">٨</span></a>',
    "az/tafsir.html": '<a class="item" href="../tafsir/all/"><div class="n">Bütün təfsirlər</div><div class="b">Hər ayə, bütün təfsirlər</div><span class="tag">8</span></a>',
    "tr/tafsir.html": '<a class="item" href="../tafsir/all/"><div class="n">Tüm tefsirler</div><div class="b">Her ayet, bütün tefsirler</div><span class="tag">8</span></a>',
    "en/tafsir.html": '<a class="item" href="../tafsir/all/"><div class="n">All tafsirs</div><div class="b">Every verse, every tafsir</div><span class="tag">8</span></a>',
    "ru/tafsir.html": '<a class="item" href="../tafsir/all/"><div class="n">Все тафсиры</div><div class="b">Каждый аят, все тафсиры</div><span class="tag">8</span></a>',
}
for path, card in cards.items():
    t = open(path, encoding="utf8").read()
    if "tafsir/all/" in t:
        continue
    t2 = t.replace('<div class="list">', '<div class="list">' + card, 1)
    if t2 == t:
        raise SystemExit("list not found " + path)
    open(path, "w", encoding="utf8").write(t2)
sm = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + "".join(f"<url><loc>{u}</loc></url>\n" for u in urls) + "</urlset>\n"
open("sitemap-tf-all.xml", "w", encoding="utf8").write(sm)
ix = open("sitemap.xml", encoding="utf8").read()
if "sitemap-tf-all.xml" not in ix:
    open("sitemap.xml", "w", encoding="utf8").write(ix.replace("</sitemapindex>", f"<sitemap><loc>{B}/sitemap-tf-all.xml</loc></sitemap>\n</sitemapindex>"))
print(len(urls))
