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
