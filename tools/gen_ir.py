# I'rab (ir) and Gharib (wb) sections: surah list + 604 reader pages opening the in-Mushaf panel
import json,html,os,re
from datetime import date
R=os.path.dirname(os.path.dirname(os.path.abspath(__file__)));os.chdir(R)
B="https://mushafuk.online";E=html.escape;LM=date.today().isoformat()
g=open('tools/gen_tr.py').read();ns={"__file__":os.path.abspath("tools/gen_tr.py")}
exec(g.split('urls=[]')[0].replace("os.chdir(R)","os.chdir(R)"),ns)
AR,AZ,EN,START,CNT,CSS,FS=[ns[x] for x in 'AR AZ EN START CNT CSS FS'.split()]
NAMES={'ar':AR,'az':AZ,'tr':EN,'en':EN,'ru':EN}
KIND={'ir':('irab_muyassar',{'ar':('irab','الإعراب','إعراب القرآن الكريم','إعراب الآيات صفحةً صفحة: الإعراب الميسر، النحاس، الدرويش، الجدول.'),
 'az':('erab','Erab','Quranın erabı (الإعراب)','Quran ayələrinin ərəb qrammatikası ilə erabı, səhifə-səhifə.'),
 'tr':('irab','İrab',"Kur'an i'rabı (الإعراب)","Kur'an ayetlerinin i'rabı, sayfa sayfa."),
 'en':('irab',"I'rab","Quran i'rab (الإعراب)","Grammatical analysis (i'rab) of Quran verses, page by page."),
 'ru':('irab','Иараб','Иараб Корана (الإعراب)','Грамматический разбор (иараб) аятов Корана, по страницам.')}),
'wb':('seraj',{'ar':('gharib','غريب القرآن','غريب القرآن','معاني الكلمات الغريبة في القرآن: السراج، ابن قتيبة.'),
 'az':('qerib','Qəribul-Quran','Qəribul-Quran (غريب القرآن)','Quranda çətin sözlərin mənaları, səhifə-səhifə.'),
 'tr':('garib','Garîbu’l-Kur’ân',"Garîbu'l-Kur'ân (غريب القرآن)","Kur'an'daki garip kelimelerin anlamları, sayfa sayfa."),
 'en':('gharib','Gharib al-Quran','Gharib al-Quran (غريب القرآن)','Meanings of rare Quranic words, page by page.'),
 'ru':('gharib','Гариб аль-Куран','Гариб аль-Куран (غريب القرآن)','Значения редких слов Корана, по страницам.')})}
UI={'ar':('آية','صفحة','المصحف','rtl'),'az':('ayə','Səhifə','Mushaf','ltr'),'tr':('ayet','Sayfa','Mushaf','ltr'),'en':('verses','Page','Mushaf','ltr'),'ru':('аятов','Страница','Мусхаф','ltr')}
PICK={'ar':('اختر الكتاب','تغيير الكتاب',[('seraj','السراج في بيان غريب القرآن','د. محمد الخضيري'),('ibnqutaybah','تفسير غريب القرآن','ابن قتيبة')]),
 'az':('Kitabı seçin','Kitabı dəyiş',[('seraj','əs-Sirac fi Bəyani Qaribil-Quran','Dr. M. əl-Xudayri'),('ibnqutaybah','Təfsiru Qaribil-Quran','İbn Qüteybə')]),
 'tr':('Kitabı seçin','Kitabı değiştir',[('seraj',"es-Sirâc fî Beyâni Garîbi'l-Kur'ân",'Dr. M. el-Hudayrî'),('ibnqutaybah',"Tefsîru Garîbi'l-Kur'ân",'İbn Kuteybe')]),
 'en':('Choose a book','Change book',[('seraj','As-Siraj fi Bayan Gharib al-Qur\'an','Dr. M. al-Khudayri'),('ibnqutaybah','Tafsir Gharib al-Qur\'an','Ibn Qutaybah')]),
 'ru':('Выберите книгу','Сменить книгу',[('seraj','Ас-Сирадж фи баян гариб аль-Куран','д-р М. аль-Худайри'),('ibnqutaybah','Тафсир гариб аль-Куран','Ибн Кутейба')])}
BS={'seraj':'sirac','ibnqutaybah':'ibn-qutayba'}
WB_CSS='.wbp a.wbb{display:flex;flex-direction:column;gap:.2rem;align-items:flex-start;text-align:start;padding:1rem 1.05rem;border-radius:16px;border:1px solid #e3d3ac;background:linear-gradient(#fffdf8,#f7f0e1);color:#0f3d2a;text-decoration:none}.wbp a.wbb b{font-size:1.12rem}.wbp a.wbb small{opacity:.68}.wbp-ch{padding:.4rem .8rem;border-radius:10px;border:1px solid #e3d3ac;color:#0f3d2a;text-decoration:none}.wbp{display:grid;gap:.75rem;margin:1.1rem auto 1.4rem;max-width:640px}.wbp-h{margin:0;text-align:center;font-weight:800;color:#0f3d2a}.wbp button[data-wb]{display:flex;flex-direction:column;gap:.2rem;align-items:flex-start;text-align:start;padding:1rem 1.05rem;border-radius:16px;border:1px solid #e3d3ac;background:linear-gradient(#fffdf8,#f7f0e1);color:#0f3d2a;font:inherit;cursor:pointer}.wbp button[data-wb] b{font-size:1.12rem}.wbp button[data-wb] small{opacity:.68}.wbp-bar{display:flex;justify-content:space-between;align-items:center;gap:.6rem;margin:.2rem 0 .8rem}.wbp-bar button{border:0;background:#0f3d2a;color:#fff;border-radius:20px;padding:.4rem .85rem;cursor:pointer;font:inherit}@media(min-width:720px){.wbp{grid-template-columns:1fr 1fr}.wbp-h{grid-column:1/-1}}'
WB_JS='<script>(function(){var pick=document.getElementById("wb-pick"),list=document.getElementById("wb-list"),label=document.getElementById("wb-on");function apply(id,name){try{var q=JSON.parse(localStorage.getItem("qm.prefs")||"{}");q.wb=id;q.tab="wb";localStorage.setItem("qm.prefs",JSON.stringify(q));}catch(e){}list.querySelectorAll("a").forEach(function(a){var h=a.getAttribute("href")||"";if(h.indexOf("page/")<0)return;var hash="",i=h.indexOf("#");if(i>=0){hash=h.slice(i);h=h.slice(0,i);}h=h.replace(/([?&])wb=[^&]*/g,"").replace(/[?&]$/,"");a.setAttribute("href",h+(h.indexOf("?")>=0?"&":"?")+"wb="+encodeURIComponent(id)+hash);});label.textContent=name;pick.hidden=true;list.hidden=false;}pick.addEventListener("click",function(e){var b=e.target.closest("[data-wb]");if(!b)return;apply(b.getAttribute("data-wb"),b.getAttribute("data-name"));});document.getElementById("wb-back").addEventListener("click",function(){list.hidden=true;pick.hidden=false;});})();</script>'
urls=[]
for kind,(bid,LL) in KIND.items():
  for lg,(slug,title,h1,desc) in LL.items():
    pre='' if lg=='ar' else lg+'/';base=pre+slug;ay,pg,mu,d=UI[lg];N=NAMES[lg]
    up='../' if lg=='ar' else '../../';url=f"{B}/{base}/";urls.append(url)
    items=''.join(f'<a href="page/{START[s]}/#{s}-1"><span class="k">{s}</span><span class="nm">{E(N[s-1])}<small>{CNT[s]} {ay} · {pg} {START[s]}</small></span>'+('' if lg=='ar' else f'<span class="a" dir="rtl">{E(AR[s-1])}</span>')+'</a>' for s in range(1,115))
    def page(base,up,main,style,url,tail=''):
      return (f'<!doctype html><html lang="{lg}" dir="{d}"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{E(h1)} | Mushafuk.online</title><meta name="description" content="{E(desc)}"><link rel="canonical" href="{url}"><meta property="og:title" content="{E(h1)}"><meta property="og:url" content="{url}"><meta property="og:image" content="{B}/icon.png"><link rel="icon" href="{up}icon.png"><link rel="stylesheet" href="{up}site.css?v=7">{FS}<style>{style}</style></head><body>'
        f'<header class="nav"><div class="in"><a class="logo" href="{up}{pre}" dir="ltr"><img src="{up}icon.png" alt="">Mushafuk<span>.online</span></a><nav><a href="{up}{pre}quran/">{mu}</a><a href="{up}{base}/" class=on>{E(title)}</a></nav></div></header>'
        f'<main class="tw">{main}</main><footer>© 2026 Mushafuk.online</footer><script src="{up}site.js?v=7"></script>{tail}</body></html>')
    if kind=='wb':
      choose,back,books=PICK[lg]
      btns=''.join(f'<a class="wbb" href="{BS[i]}/"><b>{E(n)}</b><small>{E(by)}</small></a>' for i,n,by in books)
      main=(f'<h1>{E(h1)}</h1><p style="text-align:center">{E(desc)}</p>'
        f'<div id="wb-pick" class="wbp"><p class="wbp-h">{E(choose)}</p>{btns}</div>')
      for i,n,by in books:
        bu=f"{url}{BS[i]}/";urls.append(bu)
        bitems=''.join(f'<a href="../page/{START[s]}/?wb={i}#{s}-1"><span class="k">{s}</span><span class="nm">{E(N[s-1])}<small>{CNT[s]} {ay} · {pg} {START[s]}</small></span>'+('' if lg=='ar' else f'<span class="a" dir="rtl">{E(AR[s-1])}</span>')+'</a>' for s in range(1,115))
        bm=(f'<h1>{E(n)}</h1><p style="text-align:center">{E(by)}</p><div class="wbp-bar"><b>{E(h1)}</b><a class="wbp-ch" href="../">{E(back)}</a></div><div class="sl">{bitems}</div>')
        os.makedirs(base+'/'+BS[i],exist_ok=True);open(base+'/'+BS[i]+'/index.html','w',encoding='utf8').write(page(base,up+'../',bm,CSS+WB_CSS,bu,f'<script>try{{var q=JSON.parse(localStorage.getItem("qm.prefs")||"{{}}");q.wb="{i}";q.tab="wb";localStorage.setItem("qm.prefs",JSON.stringify(q));}}catch(e){{}}</script>'))
      style,tail=CSS+WB_CSS,''
    else:
      main=f'<h1>{E(h1)}</h1><p style="text-align:center">{E(desc)}</p><div class="sl">{items}</div>'
      style,tail=CSS,''
    h=page(base,up,main,style,url,tail)
    os.makedirs(base,exist_ok=True);open(base+'/index.html','w',encoding='utf8').write(h)
    for p in range(1,605):
      url=f"{B}/{base}/page/{p}/";urls.append(url)
      h=open(f"{pre}page/{p}/index.html",encoding='utf8').read()
      h=re.sub(r'<link rel="canonical" href="[^"]*">','',h)
      h=h.replace('<base href="/">','<base href="/">'+f'<link rel="canonical" href="{url}">',1)
      h=re.sub(r'<link rel="alternate" hreflang[^>]*>','',h)
      boot=f'if(!q.{kind})q.{kind}="{bid}";q.tab="{kind}";'
      if kind=='wb': boot='var w=new URLSearchParams(location.search).get("wb");if(w==="seraj"||w==="ibnqutaybah")q.wb=w;else if(!q.wb)q.wb="seraj";q.tab="wb";'
      h=h.replace('<base href="/">','<base href="/">'+f'<script>try{{var q=JSON.parse(localStorage.getItem("qm.prefs")||"{{}}");{boot}localStorage.setItem("qm.prefs",JSON.stringify(q));}}catch(e){{}}</script>',1)
      h=h.replace('</body>',f'<script>(function w(i){{if(window.QM&&window.QM_PAGE&&window.QM_PAGE({p})){{QM.openFull("{kind}",null,{p});return}}if(i<200)setTimeout(function(){{w(i+1)}},100)}})(0)</script></body>',1)
      # Point crawl nav at this section (not the mushaf pages it was copied from)
      hub=f"/{base}/"; hub_lbl=E(title)
      def _nav(pp):
        parts=[]
        if pp>1: parts.append(f'<a rel="prev" href="/{base}/page/{pp-1}/">‹</a>')
        parts.append(f'<a class="hub" href="{hub}">{hub_lbl}</a>')
        if pp<604: parts.append(f'<a rel="next" href="/{base}/page/{pp+1}/">›</a>')
        return '<nav class="seo-crawl" aria-label="%s">%s</nav>'%(hub_lbl,''.join(parts))
      h=re.sub(r'<nav class="seo-crawl"[^>]*>.*?</nav>', _nav(p), h, count=1, flags=re.S)
      o=f"{base}/page/{p}";os.makedirs(o,exist_ok=True);open(o+'/index.html','w',encoding='utf8').write(h)
open('sitemap-ir.xml','w').write('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+''.join(f'<url><loc>{u}</loc><lastmod>{LM}</lastmod></url>\n' for u in urls)+'</urlset>\n')
sm=open('sitemap.xml').read()
if 'sitemap-ir.xml' not in sm: open('sitemap.xml','w').write(sm.replace('</sitemapindex>',f'<sitemap><loc>{B}/sitemap-ir.xml</loc></sitemap>\n</sitemapindex>'))
print(len(urls))
