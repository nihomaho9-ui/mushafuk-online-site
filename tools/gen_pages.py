from datetime import date
import json,html,os,re
R=os.path.dirname(os.path.dirname(os.path.abspath(__file__)));os.chdir(R)
B="https://mushafuk.online";LM=date.today().isoformat()
AR=re.search(r'const ARNAMES = "([^"]*)"',open('quran/index.html').read()).group(1).split(',')
AZ=re.search(r'NAMES = "([^"]*)"',open('az/quran/index.html').read()).group(1).split(',')
EN="Al-Fatihah,Al-Baqarah,Ali 'Imran,An-Nisa,Al-Ma'idah,Al-An'am,Al-A'raf,Al-Anfal,At-Tawbah,Yunus,Hud,Yusuf,Ar-Ra'd,Ibrahim,Al-Hijr,An-Nahl,Al-Isra,Al-Kahf,Maryam,Ta-Ha,Al-Anbiya,Al-Hajj,Al-Mu'minun,An-Nur,Al-Furqan,Ash-Shu'ara,An-Naml,Al-Qasas,Al-'Ankabut,Ar-Rum,Luqman,As-Sajdah,Al-Ahzab,Saba,Fatir,Ya-Sin,As-Saffat,Sad,Az-Zumar,Ghafir,Fussilat,Ash-Shura,Az-Zukhruf,Ad-Dukhan,Al-Jathiyah,Al-Ahqaf,Muhammad,Al-Fath,Al-Hujurat,Qaf,Adh-Dhariyat,At-Tur,An-Najm,Al-Qamar,Ar-Rahman,Al-Waqi'ah,Al-Hadid,Al-Mujadilah,Al-Hashr,Al-Mumtahanah,As-Saff,Al-Jumu'ah,Al-Munafiqun,At-Taghabun,At-Talaq,At-Tahrim,Al-Mulk,Al-Qalam,Al-Haqqah,Al-Ma'arij,Nuh,Al-Jinn,Al-Muzzammil,Al-Muddaththir,Al-Qiyamah,Al-Insan,Al-Mursalat,An-Naba,An-Nazi'at,'Abasa,At-Takwir,Al-Infitar,Al-Mutaffifin,Al-Inshiqaq,Al-Buruj,At-Tariq,Al-A'la,Al-Ghashiyah,Al-Fajr,Al-Balad,Ash-Shams,Al-Layl,Ad-Duha,Ash-Sharh,At-Tin,Al-'Alaq,Al-Qadr,Al-Bayyinah,Az-Zalzalah,Al-'Adiyat,Al-Qari'ah,At-Takathur,Al-'Asr,Al-Humazah,Al-Fil,Quraysh,Al-Ma'un,Al-Kawthar,Al-Kafirun,An-Nasr,Al-Masad,Al-Ikhlas,Al-Falaq,An-Nas".split(',')
assert len(AR)==len(AZ)==len(EN)==114
TXT={}
for l in open('quran-uthmani.txt',encoding='utf8'):
  p=l.rstrip('\n').split('|')
  if len(p)==3:TXT[(int(p[0]),int(p[1]))]=p[2]
AY=json.load(open('yazi-ayahs.json'))
L={
'ar':dict(n=AR,dir='rtl',pre='',t='الصفحة {p} من المصحف — سورة {s}',d='اقرأ الصفحة {p} من مصحف المدينة: سورة {s}، الآيات {r}. مع التفاسير والترجمات.',h='الصفحة {p}',o='افتح المصحف',pv='السابقة',nx='التالية',su='سورة',home='الرئيسية'),
'az':dict(n=AZ,dir='ltr',pre='az/',t='Quran, səhifə {p} — {s} surəsi',d='Mədinə mushafı, səhifə {p}: {s} surəsi, ayələr {r}. Təfsir və tərcümələrlə oxu.',h='Səhifə {p}',o='Quranı aç',pv='Əvvəlki',nx='Sonrakı',su='Surə',home='Ana səhifə'),
'tr':dict(n=EN,dir='ltr',pre='tr/',t="Kur'an Sayfa {p} — {s} Suresi",d="Medine mushafı {p}. sayfa: {s} suresi, ayetler {r}. Tefsir ve meallerle oku.",h='Sayfa {p}',o="Mushafı aç",pv='Önceki',nx='Sonraki',su='Sure',home='Ana sayfa'),
'en':dict(n=EN,dir='ltr',pre='en/',t='Quran Page {p} — Surah {s}',d='Read page {p} of the Madinah Mushaf: Surah {s}, verses {r}. With tafsir and translations.',h='Page {p}',o='Open Mushaf',pv='Previous',nx='Next',su='Surah',home='Home'),
'ru':dict(n=EN,dir='ltr',pre='ru/',t='Коран, страница {p} — сура {s}',d='Страница {p} Мединского мусхафа: сура {s}, аяты {r}. С тафсирами и переводами.',h='Страница {p}',o='Открыть мусхаф',pv='Назад',nx='Далее',su='Сура',home='Главная'),
}
E=html.escape
urls=[]
for lg,c in L.items():
  for p in range(1,605):
    keys=[tuple(map(int,k.split(':'))) for k,_ in AY[str(p)]]
    ss=[];[ss.append(s) for s,_ in keys if s not in ss]
    sn=' / '.join(c['n'][s-1] for s in ss)
    rng=f"{keys[0][0]}:{keys[0][1]}–{keys[-1][0]}:{keys[-1][1]}"
    f=dict(p=p,s=sn,r=rng)
    url=f"{B}/{c['pre']}page/{p}/";urls.append(url)
    up='../../' if lg=='ar' else '../../../'
    alts=''.join(f'<link rel="alternate" hreflang="{l2}" href="{B}/{L[l2]["pre"]}page/{p}/">' for l2 in L)+f'<link rel="alternate" hreflang="x-default" href="{B}/page/{p}/">'
    body='';last=None
    for s,a in keys:
      if s!=last: body+=f'<h2 class="ar">{c["su"]} {E(AR[s-1])}' + ('' if lg=='ar' else f' <small dir="ltr">({E(c["n"][s-1])})</small>')+'</h2>';last=s
      body+=f'<p class="ar ay" dir="rtl" lang="ar">{E(TXT.get((s,a),""))} <span class="n">﴿{a}﴾</span></p>'
    nav=(f'<a rel="prev" href="../{p-1}/">← {c["pv"]}</a>' if p>1 else '<span></span>')+(f'<a rel="next" href="../{p+1}/">{c["nx"]} →</a>' if p<604 else '<span></span>')
    t=E(c['t'].format(**f))+' | Mushafuk.online';d=E(c['d'].format(**f))
    h=f'''<!doctype html><html lang="{lg}" dir="{c['dir']}"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{t}</title><meta name="description" content="{d}"><link rel="canonical" href="{url}">{alts}{f'<link rel="prev" href="../{p-1}/">' if p>1 else ''}{f'<link rel="next" href="../{p+1}/">' if p<604 else ''}<meta property="og:type" content="article"><meta property="og:title" content="{t}"><meta property="og:description" content="{d}"><meta property="og:url" content="{url}"><meta property="og:image" content="{B}/icon.png"><meta property="og:site_name" content="Mushafuk.online"><link rel="icon" href="{up}icon.png"><link rel="stylesheet" href="{up}site.css?v=5"><style>.pg{{max-width:820px;margin:2rem auto;padding:0 1.25rem 4rem}}.pg h1{{text-align:center}}.pg h2{{text-align:center;color:var(--em);margin:2rem 0 1rem}}.ay{{font-size:1.6rem;line-height:2.4;text-align:right;margin:.4rem 0}}.ay .n{{color:var(--gold);font-size:1.1rem}}.pn{{display:flex;justify-content:space-between;margin:2rem 0}}.cta{{text-align:center;margin:1.5rem 0}}</style></head><body><header class="nav"><div class="in"><a class="logo" href="{up}{c['pre']}" dir="ltr"><img src="{up}icon.png" alt="">Mushafuk<span>.online</span></a><nav><a href="{up}{c['pre']}">{c['home']}</a><a href="{up}{c['pre']}quran/">{c['o']}</a></nav></div></header><main class="pg"><h1>{E(c['h'].format(**f))}</h1><p style="text-align:center">{E(sn)} · {rng}</p><div class="cta"><a class="btn" href="{up}{c['pre']}quran/?page={p}">{c['o']}</a></div>{body}<div class="cta"><a class="btn" href="{up}{c['pre']}quran/?page={p}">{c['o']}</a></div><nav class="pn">{nav}</nav></main><footer>© 2026 Mushafuk.online</footer></body></html>'''
    o=f"{c['pre']}page/{p}";os.makedirs(o,exist_ok=True);open(o+'/index.html','w',encoding='utf8').write(h)
land=[f"{B}/{L[l]['pre']}{x}" for l in L for x in ['','quran/','tafsir.html','translations.html','about.html']]
def sm(name,us):
  open(name,'w').write('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+''.join(f'<url><loc>{u}</loc><lastmod>{LM}</lastmod></url>\n' for u in us)+'</urlset>\n')
sm('sitemap-main.xml',land)
for l in L: sm(f'sitemap-pages-{l}.xml',[u for u in urls if u.startswith(f"{B}/{L[l]['pre']}page/")])
open('sitemap.xml','w').write('<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+''.join(f'<sitemap><loc>{B}/{n}</loc></sitemap>\n' for n in ['sitemap-main.xml']+[f'sitemap-pages-{l}.xml' for l in L])+'</sitemapindex>\n')
open('robots.txt','w').write(f'User-agent: *\nAllow: /\nSitemap: {B}/sitemap.xml\n')
print(len(urls))
