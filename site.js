(function(){try{if(window.__mfk)return;window.__mfk=1;var l=location,h=l.hostname,n=navigator,r='';if(!/(^|\.)mushafuk\.online$/.test(h)||/^\/admin(\/|$)/.test(l.pathname)||n.webdriver||/bot|crawl|spider|slurp|preview|headless|lighthouse/i.test(n.userAgent))return;try{r=new URL(document.referrer).hostname}catch(e){}if(/(^|\.)mushafuk\.online$/.test(r))r='';var K='sb_publishable_UnQ35pj_GatInq-7lhFGgQ_DnRoUnDC';fetch('https://isvqwafixlmusmuqqnyk.supabase.co/rest/v1/pageviews',{method:'POST',keepalive:true,headers:{apikey:K,Authorization:'Bearer '+K,'Content-Type':'application/json',Prefer:'return=minimal'},body:JSON.stringify({host:h,path:l.pathname.slice(0,300),ref_host:r||null,lang:(document.documentElement.lang||n.language||'').slice(0,12),device:innerWidth<768?'mobile':'desktop'})}).catch(function(){})}catch(e){}})();
document.querySelectorAll('.langs').forEach(function(l){var b=l.querySelector('.lbtn');b.onclick=function(e){e.stopPropagation();var o=l.classList.toggle('open');b.setAttribute('aria-expanded',o)}});
function closeL(){document.querySelectorAll('.langs.open').forEach(function(l){l.classList.remove('open');l.querySelector('.lbtn').setAttribute('aria-expanded','false')})}
document.addEventListener('click',function(e){if(!e.target.closest('.langs'))closeL()});document.addEventListener('keydown',function(e){if(e.key==='Escape')closeL()});
(function(){
  var a=document.getElementById('resume'); if(!a) return;
  var h=[]; try{h=JSON.parse(localStorage.getItem('qm-recent')||'[]')}catch(e){}
  if(!h.length||!h[0].p) return;
  var lang=document.documentElement.lang||'ar';
  var words={ar:'تابع — الصفحة ',az:'Davam et — səhifə ',tr:'Devam et — sayfa ',en:'Continue — page ',ru:'Продолжить — стр. ',id:'Lanjutkan — halaman ',ur:'جاری رکھیں — صفحہ ',fr:'Continuer — page ',bn:'চালিয়ে যান — পৃষ্ঠা ',ms:'Teruskan — muka surat '};
  a.textContent=(words[lang]||words.en)+h[0].p;
  var own={ar:1,az:1,tr:1,en:1,ru:1};
  a.href=(own[lang]?'page/':'/en/page/')+h[0].p+'/';
  a.hidden=false;
})();

;try{var qs=document.createElement("script");qs.src="https://mushafuk.online/read-shelf.js?v=3";document.head.appendChild(qs);}catch(e){}
