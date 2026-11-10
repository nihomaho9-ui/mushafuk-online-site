import html, json, os, re
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(R)
E = html.escape
B = "https://mushafuk.online"
ARN = re.search(r'const ARNAMES = "([^"]*)"', open("quran/index.html", encoding="utf8").read()).group(1).split(",")
TXT = {}
for line in open("quran-uthmani.txt", encoding="utf8"):
    p = line.rstrip("\n").split("|")
    if len(p) == 3:
        TXT[(int(p[0]), int(p[1]))] = p[2]
DIG = "٠١٢٣٤٥٦٧٨٩"
def ar(n):
    return "".join(DIG[int(c)] for c in str(n))
ayahs = []
for s in range(1, 115):
    v = json.load(open(f"tf/saadi/{s}.json", encoding="utf8"))
    for a, raw in enumerate(v, 1):
        ayahs.append((s, a, raw or ""))
# a passage stored on the first ayah covers the following empty ones
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
urls = [f"{B}/tafsir/saadi/"]
for n, (s, a) in enumerate(order):
    fr, to, raw = span.get((s, a), (a, a, ""))
    prev = f"/tafsir/saadi/{order[n-1][0]}/{order[n-1][1]}/" if n else ""
    nxt = f"/tafsir/saadi/{order[n+1][0]}/{order[n+1][1]}/" if n + 1 < len(order) else ""
    name = ARN[s - 1]
    title = f"تفسير السعدي — سورة {name}، الآية {ar(a)}"
    desc = re.sub(r"\s+", " ", raw).strip()[:160]
    ay = TXT.get((s, a), "")
    rng = f'<small class="rng">الآيات {ar(fr)}–{ar(to)}</small>' if fr != to else ""
    links = []
    if prev:
        links.append(f'<link rel="prev" href="{B}{prev}">')
    if nxt:
        links.append(f'<link rel="next" href="{B}{nxt}">')
    pn = '<nav class="pn">'
    pn += f'<a href="{prev}">الآية السابقة</a>' if prev else "<span></span>"
    pn += f'<a href="{nxt}">الآية التالية</a>' if nxt else "<span></span>"
    pn += "</nav>"
    url = f"{B}/tafsir/saadi/{s}/{a}/"
    urls.append(url)
    doc = f'''<!doctype html><html lang="ar" dir="rtl"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{E(title)} | Mushafuk.online</title><meta name="description" content="{E(desc)}"><link rel="canonical" href="{url}">{''.join(links)}<link rel="icon" href="/icon.png"><link rel="stylesheet" href="/tafsir/saadi.css"><link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Amiri&display=swap" rel="stylesheet"></head><body><header class="bar"><a class="x" href="/tafsir/saadi/" aria-label="إغلاق">×</a><div class="who"><b>{E(name)}</b><small>الآية {ar(a)}</small></div></header><main id="tf"><p class="src">تيسير الكريم الرحمن — السعدي</p><p class="ay" dir="rtl" lang="ar">{E(ay)} ﴿{ar(a)}﴾</p><div class="tx" lang="ar">{rng}{E(raw)}</div>{pn}</main><script>(function(){{var next={json.dumps(nxt)},prev={json.dumps(prev)},x=null,y=null,el=document.getElementById("tf");el.addEventListener("pointerdown",function(e){{if(e.target.closest("a"))return;x=e.clientX;y=e.clientY;}});el.addEventListener("pointerup",function(e){{if(x==null)return;var dx=e.clientX-x,dy=e.clientY-y;x=null;if(Math.abs(dx)<48||Math.abs(dx)<Math.abs(dy))return;var u=dx>0?next:prev;if(u)location.assign(u);}});}})();</script></body></html>'''
    o = f"tafsir/saadi/{s}/{a}"
    os.makedirs(o, exist_ok=True)
    open(o + "/index.html", "w", encoding="utf8").write(doc)
items = "".join(
    f'<a href="/tafsir/saadi/{s}/1/"><span class="k">{s}</span><span class="nm">{E(ARN[s-1])}<small>{sum(1 for x,y in order if x==s)} آية</small></span></a>'
    for s in range(1, 115)
)
idx = f'''<!doctype html><html lang="ar" dir="rtl"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>تفسير السعدي — تيسير الكريم الرحمن | Mushafuk.online</title><meta name="description" content="تفسير القرآن للسعدي، تيسير الكريم الرحمن، آية بآية."><link rel="canonical" href="{B}/tafsir/saadi/"><link rel="icon" href="/icon.png"><link rel="stylesheet" href="/site.css?v=7"><link rel="stylesheet" href="/tafsir/saadi.css"></head><body><header class="nav"><div class="in"><a class="logo" href="/" dir="ltr"><img src="/icon.png" alt="">Mushafuk<span>.online</span></a><nav><a href="/quran/">القرآن</a><a href="/tafsir.html" class=on>التفاسير</a><a href="/translations.html">الترجمات</a></nav></div></header><main class="idx"><h1>تيسير الكريم الرحمن</h1><p class="sub">تفسير السعدي — بالعربية، كل آية في صفحة</p><div class="sl">{items}</div></main><footer>© 2026 Mushafuk.online</footer></body></html>'''
open("tafsir/saadi/index.html", "w", encoding="utf8").write(idx)
for path, href in (("tafsir.html", "tafsir/saadi/"), ("az/tafsir.html", "../tafsir/saadi/"), ("tr/tafsir.html", "../tafsir/saadi/"), ("en/tafsir.html", "../tafsir/saadi/"), ("ru/tafsir.html", "../tafsir/saadi/")):
    t = open(path, encoding="utf8").read()
    t2 = t.replace('href="quran/"><div class="n" dir="rtl">تيسير الكريم الرحمن</div>', f'href="{href}"><div class="n" dir="rtl">تيسير الكريم الرحمن</div>', 1)
    if t2 == t:
        raise SystemExit("card not updated: " + path)
    open(path, "w", encoding="utf8").write(t2)
sm = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + "".join(f"<url><loc>{u}</loc></url>\n" for u in urls) + "</urlset>\n"
open("sitemap-tafsir.xml", "w", encoding="utf8").write(sm)
ix = open("sitemap.xml", encoding="utf8").read()
if "sitemap-tafsir.xml" not in ix:
    open("sitemap.xml", "w", encoding="utf8").write(ix.replace("</sitemapindex>", f"<sitemap><loc>{B}/sitemap-tafsir.xml</loc></sitemap>\n</sitemapindex>"))
print(len(urls))
