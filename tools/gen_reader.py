import os,re,json,html
from datetime import date
R=os.path.dirname(os.path.dirname(os.path.abspath(__file__)));os.chdir(R)
exec(open('tools/gen_pages.py').read().split("urls=[]")[0])  # reuse L, AY, TXT, names
B="https://mushafuk.online";E=html.escape
QP='+new URLSearchParams(location.search).get("page")'
LM=date.today().isoformat()
QSTYLE='#qtext{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:normal;border:0}#qtext p{margin:.35rem 0}#qtext h2{font-size:1rem}#qtext nav.seo-crawl{display:flex;flex-wrap:wrap;gap:.5rem 1rem;justify-content:center;margin:1.25rem 0 0;padding:.75rem 0 0;border-top:1px solid rgba(0,0,0,.08);font:600 .95rem/1.4 system-ui,sans-serif}#qtext nav.seo-crawl a{color:#0b6b4f;text-decoration:none}'
NSSTYLE="html,body{height:auto!important;overflow:auto!important;display:block!important}#qtext{position:static;width:auto;height:auto;margin:0 auto;padding:1.25rem 1rem 3rem;overflow:visible;clip:auto;max-width:42rem;font:1.2rem/2 Amiri,'Noto Naskh Arabic',serif}"
urls=[]
for lg,c in L.items():
  pre=c['pre'];src=f"{pre}quran.html"
  s=open(src,encoding="utf8").read()
  if "location.replace" in s: s=open(f"{pre}quran/index.html",encoding="utf8").read()
  s=re.sub(r'<base [^>]*>','<base href="/">',s,1)
  if '<base ' not in s: s=s.replace('<head>','<head><base href="/">',1)
  s=s.replace(QP,'+(window.__PAGE||new URLSearchParams(location.search).get("page"))')
  s=s.replace('quran.html','quran/')
  os.makedirs(f"{pre}quran",exist_ok=True)
  open(f"{pre}quran/index.html",'w',encoding='utf8').write(s)
  open(src,'w').write(f'<!doctype html><meta charset="utf-8"><link rel="canonical" href="{B}/{pre}quran/"><script>var p=+new URLSearchParams(location.search).get("page");location.replace("/{pre}"+(p>=1&&p<=604?"page/"+p+"/":"quran/"))</script>')
  for p in range(1,605):
    keys=[tuple(map(int,k.split(':'))) for k,_ in AY[str(p)]]
    ss=[];[ss.append(x) for x,_ in keys if x not in ss]
    sn=' / '.join(c['n'][x-1] for x in ss)
    f=dict(p=p,s=sn,r=f"{keys[0][0]}:{keys[0][1]}–{keys[-1][0]}:{keys[-1][1]}")
    url=f"{B}/{pre}page/{p}/";urls.append(url)
    t=E(c['t'].format(**f))+' | Mushafuk.online';d=E(c['d'].format(**f))
    alts=''.join(f'<link rel="alternate" hreflang="{l2}" href="{B}/{L[l2]["pre"]}page/{p}/">' for l2 in L)+f'<link rel="alternate" hreflang="x-default" href="{B}/page/{p}/">'
    head=f'<title>{t}</title><meta name="description" content="{d}"><link rel="canonical" href="{url}">{alts}<meta property="og:title" content="{t}"><meta property="og:description" content="{d}"><meta property="og:url" content="{url}"><meta property="og:image" content="{B}/icon.png"><script>window.__PAGE={p}</script>'
    h=re.sub(r'<title>.*?</title>','',s,1,flags=re.S)
    h=re.sub(r'<meta name="description"[^>]*>','',h)
    h=re.sub(r'<style>#qtext\{.*?</style>','',h,flags=re.S)
    h=re.sub(r'<noscript><style>html,body\{.*?</noscript>','',h,flags=re.S)
    h=re.sub(r'<article id="qtext"[^>]*>.*?</article>','',h,flags=re.S)
    h=re.sub(r'<noscript><div lang="ar"[\s\S]*?</noscript>','',h)
    h=h.replace('<base href="/">','<base href="/">'+head,1)
    txt=''.join(f'<p>{E(TXT.get(k,""))} ﴿{k[1]}﴾</p>' for k in keys)
    parts=[]
    if p>1: parts.append(f'<a rel="prev" href="/{pre}page/{p-1}/">{E(c["pv"])}</a>')
    parts.append(f'<a class="hub" href="/{pre}quran/">{E(c["o"])}</a>')
    if p<604: parts.append(f'<a rel="next" href="/{pre}page/{p+1}/">{E(c["nx"])}</a>')
    nav='<nav class="seo-crawl" aria-label="%s">%s</nav>'%(E(c['h'].format(**f)),''.join(parts))
    block=f'<style>{QSTYLE}</style><noscript><style>{NSSTYLE}</style></noscript><article id="qtext" lang="ar" dir="rtl">{txt}{nav}</article>'
    if '</body>' in h: h=h.replace('</body>', block+'</body>',1)
    else: h+=block
    o=f"{pre}page/{p}";os.makedirs(o,exist_ok=True);open(o+'/index.html','w',encoding='utf8').write(h)
for lg,c in L.items():
  us=[u for u in urls if u.startswith(f"{B}/{c['pre']}page/")]
  open(f"sitemap-pages-{lg}.xml",'w').write('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+''.join(f'<url><loc>{u}</loc><lastmod>{LM}</lastmod></url>' for u in us)+'</urlset>')
print('pages',len(urls),'lastmod',LM)
