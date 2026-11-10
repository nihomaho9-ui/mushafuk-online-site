import html, json, os, re
from datetime import date
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(R)
E = html.escape
B = "https://mushafuk.online"
LM = date.today().isoformat()
# already a full reader: do not generate again
DONE = {"az.musayev", "ru.kuliev", "turkish_shahin", "english_saheeh"}
SLUG = {
    "turkish_rwwad": "tr/rowwad",
    "english_hilali_khan": "en/hilali",
    "english_rwwad": "en/rowwad",
    "urdu_junagarhi": "ur/junagarhi",
    "persian_ih": "fa/roovad",
    "uzbek_mansour": "uz/mansour",
    "tajik_arifi": "tg/arifi",
    "kyrgyz_hakimov": "ky/hakimov",
    "uyghur_saleh": "ug/saleh",
    "pashto_rwwad": "ps/roovad",
    "kurdish_bamoki": "ku/bamoki",
    "hindi_omari": "hi/omari",
    "tamil_omar": "ta/omar",
    "french_rashid": "fr/maach",
    "german_bubenheim": "de/bubenheim",
    "dutch_center": "nl/rowwad",
    "spanish_garcia": "es/garcia",
    "portuguese_nasr": "pt/nasr",
    "hausa_gummi": "ha/gumi",
    "somali_yacob": "so/yacob",
    "japanese_saeedsato": "ja/sato",
}
ARN = re.search(r'const ARNAMES = "([^"]*)"', open("quran/index.html", encoding="utf8").read()).group(1).split(",")
starts = [(int(s), int(p)) for p, s in re.findall(r'href="page/(\d+)/#(\d+)-1"', open("az/tercume/index.html", encoding="utf8").read())]
starts.sort()
books = [r for r in json.load(open("lib-list.json", encoding="utf8")) if r.get("k") == "tr" and r["id"] not in DONE]
missing = [r["id"] for r in books if r["id"] not in SLUG]
if missing:
    raise SystemExit("no slug " + ",".join(missing))
LANGS = ("", "az", "tr", "en", "ru")  # "" is the Arabic site at the root
urls = {lg: [] for lg in LANGS}
for r in books:
    slug = SLUG[r["id"]]
    lang, d = r.get("lang") or "en", r.get("dir") or "ltr"
    name, by = r["name"], r.get("by") or ""
    items = "".join(
        f'<a href="page/{p}/"><span class="k">{s}</span><span class="nm">{E(ARN[s-1])}<small>{p}</small></span></a>'
        for s, p in starts
    )
    for lg in LANGS:
        root = f"{lg}/{slug}" if lg else slug
        shell = f"/{lg}/page/" if lg else "/page/"
        idx = f'''<!doctype html><html lang="{E(lang)}" dir="{E(d)}"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{E(name)} — {E(by)} | Mushafuk.online</title><link rel="canonical" href="{B}/{root}/"><link rel="icon" href="/icon.png"><link rel="stylesheet" href="/site.css?v=7"><style>.tw{{max-width:860px;margin:1.2rem auto;padding:0 1rem 3rem}}.tw h1{{text-align:center;font-size:1.4rem}}.tw .sub{{text-align:center;opacity:.7}}.sl{{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:.5rem}}.sl a{{display:flex;align-items:center;gap:.6rem;padding:.6rem .75rem;border:1px solid rgba(0,0,0,.08);border-radius:12px;background:#fff;text-decoration:none;color:inherit}}.k{{width:2rem;height:2rem;border-radius:50%;display:grid;place-items:center;background:#0b6b4f;color:#fff;flex:none;font-size:.8rem}}.nm{{flex:1}}.nm small{{display:block;opacity:.6}}</style></head><body><header class="nav"><div class="in"><a class="logo" href="/" dir="ltr"><img src="/icon.png" alt="">Mushafuk<span>.online</span></a><nav><a href="/quran/">القرآن</a><a href="/translations.html">الترجمات</a></nav></div></header><main class="tw"><h1>{E(name)}</h1><p class="sub">{E(by)}</p><div class="sl">{items}</div></main></body></html>'''
        os.makedirs(root, exist_ok=True)
        open(root + "/index.html", "w", encoding="utf8").write(idx)
        urls[lg].append(f"{B}/{root}/")
        for n in range(1, 605):
            url = f"{B}/{root}/page/{n}/"
            urls[lg].append(url)
            prev = (f'<a rel="prev" href="/{root}/page/{n-1}/">‹</a>' if n > 1 else '')
            nxt = (f'<a rel="next" href="/{root}/page/{n+1}/">›</a>' if n < 604 else '')
            hub = f'<a class="hub" href="/{root}/">{E(name)}</a>'
            nav = f'<nav class="seo-crawl" aria-label="{E(name)}">{prev}{hub}{nxt}</nav>'
            doc = (
                '<!doctype html><html lang="%s" dir="%s"><head><meta charset="UTF-8">'
                '<meta name="viewport" content="width=device-width,initial-scale=1">'
                '<title>%s — %d | Mushafuk.online</title>'
                '<link rel="canonical" href="%s"><link rel="icon" href="/icon.png">'
                '<style>.seo-crawl{display:flex;flex-wrap:wrap;gap:.5rem 1rem;justify-content:center;'
                'margin:1rem;font:600 .95rem/1.4 system-ui,sans-serif}.seo-crawl a{color:#0b6b4f;text-decoration:none}</style>'
                '</head><body>%s<script>'
                '(function(){var n=%d,id=%s;try{var q=JSON.parse(localStorage.getItem("qm.prefs")||"{}");'
                'q.tr=id;q.tab="tr";localStorage.setItem("qm.prefs",JSON.stringify(q));}catch(e){}'
                'window.__PAGE=n;fetch("%s"+n+"/index.html").then(function(r){return r.text()}).then(function(h){'
                'h=h.replace(/lib\\.js\\?v=\\d+/,"lib.js?v=24");'
                'h=h.replace("</body>","<script>(function w(i){if(window.QM&&window.QM_PAGE&&window.QM_PAGE("+n+"))'
                '{QM.openFull(\\"tr\\",null,"+n+");return}if(i<200)setTimeout(function(){w(i+1)},100)})(0)<\\/script></body>");'
                'document.open();document.write(h);document.close();});})();'
                '</script></body></html>'
            ) % (E(lang), E(d), E(name), n, url, nav, n, json.dumps(r["id"]), shell)
            o = f"{root}/page/{n}"
            os.makedirs(o, exist_ok=True)
            open(o + "/index.html", "w", encoding="utf8").write(doc)
    # Arabic list keeps the root reader; each other site language keeps its own copy
    for path, pre in (("translations/index.html", ""), ("az/translations/index.html", ""), ("tr/translations/index.html", ""), ("en/translations/index.html", ""), ("ru/translations/index.html", "")):
        t = open(path, encoding="utf8").read()
        pat = r'(<a class="item" href=")[^"]*("><div class="n"[^>]*>' + re.escape(name) + r'</div>)'
        t2, c = re.subn(pat, r'\1' + pre + slug + r'/page/1/\2', t, count=1)
        if c != 1:
            raise SystemExit(f"card {path} {name} {c}")
        open(path, "w", encoding="utf8").write(t2)
for lg, group in urls.items():
    fn = "sitemap-tr-more.xml" if not lg else f"sitemap-tr-{lg}.xml"
    open(fn, "w", encoding="utf8").write('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + "".join(f"<url><loc>{u}</loc><lastmod>{LM}</lastmod></url>\n" for u in group) + "</urlset>\n")
ix = open("sitemap.xml", encoding="utf8").read()
for lg in LANGS:
    fn = "sitemap-tr-more.xml" if not lg else f"sitemap-tr-{lg}.xml"
    if fn not in ix:
        ix = ix.replace("</sitemapindex>", f"<sitemap><loc>{B}/{fn}</loc></sitemap>\n</sitemapindex>")
open("sitemap.xml", "w", encoding="utf8").write(ix)
print("books", len(books), "per-lang", len(urls[""]))
