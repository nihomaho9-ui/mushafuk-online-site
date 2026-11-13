(function(){try{if(window.__mfk)return;window.__mfk=1;var l=location,h=l.hostname,n=navigator,r='';if(!/(^|\.)mushafuk\.online$/.test(h)||/^\/admin(\/|$)/.test(l.pathname)||n.webdriver||/bot|crawl|spider|slurp|preview|headless|lighthouse/i.test(n.userAgent))return;try{r=new URL(document.referrer).hostname}catch(e){}if(/(^|\.)mushafuk\.online$/.test(r))r='';var K='sb_publishable_UnQ35pj_GatInq-7lhFGgQ_DnRoUnDC';fetch('https://isvqwafixlmusmuqqnyk.supabase.co/rest/v1/pageviews',{method:'POST',keepalive:true,headers:{apikey:K,Authorization:'Bearer '+K,'Content-Type':'application/json',Prefer:'return=minimal'},body:JSON.stringify({host:h,path:l.pathname.slice(0,300),ref_host:r||null,lang:(document.documentElement.lang||n.language||'').slice(0,12),device:innerWidth<768?'mobile':'desktop'})}).catch(function(){})}catch(e){}})();
const RB = location.hostname.endsWith("github.io") ? "./" : /(^|\.)mushafuk\.online$/.test(location.hostname) ? "/" : "https://nihomaho9-ui.github.io/quran-medine/";
if (document.currentScript) { const fl = document.createElement("link"); fl.rel = "stylesheet"; fl.href = new URL("fonts.css?v=4", document.currentScript.src).href; document.head.appendChild(fl); }
// Settings (tafsir / translation downloads, text size) and the ayah sheet. Data is stored on the device (IndexedDB) and works offline.
(function () {
  const AYAHS = window.QM_AYAHS;
  const NAMES = window.QM_NAMES;
  let LIST = [];
  const kindOf = (id) => (LIST.find((x) => x.id === id) || {}).k;
  const LANGS = [["az", "Azərbaycan"], ["tr", "Türkçe"], ["en", "English"], ["ar", "العربية"], ["ru", "Русский"]];
  const DICT = {"Tam ekran": ["Tam ekran", "Full screen", "ملء الشاشة", "Во весь экран"], "Səhifə": ["Sayfa", "Page", "صفحة", "Стр."], "Təfsir": ["Tefsir", "Tafsir", "تفسير", "Тафсир"], "Tərcümə": ["Meal", "Translation", "ترجمة", "Перевод"], "Əvvəlki səhifə": ["Önceki sayfa", "Previous page", "الصفحة السابقة", "Пред. стр."], "Növbəti səhifə": ["Sonraki sayfa", "Next page", "الصفحة التالية", "След. стр."], "Mətn": ["Metin", "Text", "نص", "Текст"], "Şəkil": ["Görsel", "Image", "صورة", "Картинка"], "Ləğv": ["İptal", "Cancel", "إلغاء", "Отмена"], "Yadda saxla": ["Kaydet", "Save", "حفظ", "Сохранить"], "Hazırlanır…": ["Hazırlanıyor…", "Preparing…", "جارٍ التحضير…", "Готовлю…"], "N ayə seçilib": ["N ayet seçildi", "N ayahs selected", "N آيات محددة", "Выбрано аятов: N"], "Başqa ayələrə toxunun": ["Diğer ayetlere dokunun", "Tap other ayahs to add", "انقر آيات أخرى لإضافتها", "Нажмите другие аяты"], "Bir neçə ayə seç": ["Birden çok ayet seç", "Select several ayahs", "تحديد عدة آيات", "Выбрать несколько аятов"], "Əvvəlki": ["Önceki", "Previous", "السابقة", "Пред."], "Növbəti": ["Sonraki", "Next", "التالية", "След."], "Alınmadı": ["Olmadı", "Failed", "تعذّر", "Не удалось"], "Alınmadı. İnterneti yoxlayın.": ["Olmadı. İnterneti kontrol edin.", "Failed. Check the connection.", "تعذّر التنزيل. تحقّق من الاتصال.", "Не удалось. Проверьте интернет."], "Ayarlar": ["Ayarlar", "Settings", "الإعدادات", "Настройки"], "Bağla": ["Kapat", "Close", "إغلاق", "Закрыть"], "Dayandır": ["Durdur", "Stop", "إيقاف", "Стоп"], "Endir": ["İndir", "Download", "تنزيل", "Скачать"], "Endirilənlər cihazda qalır, internetsiz işləyir.": ["İndirilenler cihazda kalır, internetsiz çalışır.", "Downloads stay on this device and work offline.", "تبقى التنزيلات على الجهاز وتعمل دون إنترنت.", "Загрузки хранятся на устройстве и работают офлайн."], "Hələ endirilməyib.": ["Henüz indirilmedi.", "Nothing downloaded yet.", "لم يُنزَّل شيء بعد.", "Пока ничего не скачано."], "Ayarlarda endir": ["Ayarlardan indir", "Download in Settings", "نزّل من الإعدادات", "Скачать в настройках"], "Kopyalandı": ["Kopyalandı", "Copied", "تم النسخ", "Скопировано"], "Kopyala": ["Kopyala", "Copy", "نسخ", "Копировать"], "Mətn ölçüsü": ["Yazı boyutu", "Text size", "حجم النص", "Размер текста"], "Görünüş": ["Görünüm", "Appearance", "المظهر", "Вид"], "Bölmələr": ["Bölümler", "Sections", "الأقسام", "Разделы"], "Səsli qiraət": ["Sesli kıraat", "Recitation", "التلاوة", "Чтение"], "Gecə rejimi": ["Gece modu", "Night mode", "الوضع الليلي", "Ночной режим"], "Gündüz": ["Gündüz", "Day", "نهار", "День"], "Gecə": ["Gece", "Night", "ليل", "Ночь"], "Kiçik": ["Küçük", "Small", "صغير", "Мелкий"], "Normal": ["Normal", "Normal", "عادي", "Обычный"], "Böyük": ["Büyük", "Large", "كبير", "Крупный"], "Paylaş": ["Paylaş", "Share", "مشاركة", "Поделиться"], "Seç": ["Seç", "Use", "اختيار", "Выбрать"], "Sil": ["Sil", "Delete", "حذف", "Удалить"], "Təfsirlər": ["Tefsirler", "Tafsirs", "التفاسير", "Тафсиры"], "Tərcümələr": ["Mealler", "Translations", "الترجمات", "Переводы"], "Əlfəcin": ["Yer imi", "Bookmark", "علامة", "Закладка"], "Əlfəcindən silindi": ["Yer iminden silindi", "Bookmark removed", "أُزيلت العلامة", "Закладка удалена"], "Əlfəcinə əlavə olundu": ["Yer imine eklendi", "Bookmarked", "أُضيفت علامة", "Добавлено в закладки"], "✓ Seçilib": ["✓ Seçili", "✓ In use", "✓ مختار", "✓ Выбрано"], "Dil": ["Dil", "Language", "اللغة", "Язык"], "Seçilməyib": ["Seçilmedi", "None", "غير محدد", "Не выбрано"], "Axtarış": ["Ara", "Search", "بحث", "Поиск"], "Surə və ya ərəbcə söz…": ["Sure veya Arapça söz…", "Surah or an Arabic word…", "سورة أو كلمة…", "Сура или арабское слово…"], "Cüz": ["Cüz", "Juz", "الجزء", "Джуз"], "Surələr": ["Sureler", "Surahs", "السور", "Суры"], "Cüzlər": ["Cüzler", "Juz", "الأجزاء", "Джузы"], "Mədinə": ["Medine", "Medinan", "مدنية", "Мединская"], "Məkkə": ["Mekke", "Meccan", "مكية", "Мекканская"], "ayə": ["ayet", "ayahs", "آية", "аятов"], "Tapılmadı": ["Bulunamadı", "No matches", "لا نتائج", "Ничего не найдено"], "Oxuma": ["Okuma", "Reading", "القراءة", "Чтение"], "Tətbiq": ["Uygulama", "App", "التطبيق", "Приложение"], "Məxfilik siyasəti": ["Gizlilik politikası", "Privacy policy", "سياسة الخصوصية", "Политика конфиденциальности"], "İstifadə şərtləri": ["Kullanım şartları", "Terms of use", "شروط الاستخدام", "Условия использования"], "Məlumat təhlükəsizliyi": ["Veri güvenliği", "Data safety", "أمان البيانات", "Безопасность данных"], "İcazələr": ["İzinler", "Permissions", "الأذونات", "Разрешения"], "Tətbiq haqqında": ["Uygulama hakkında", "About", "حول التطبيق", "О приложении"], "Əlaqə": ["İletişim", "Contact", "التواصل", "Контакт"], "Mənbələr": ["Kaynaklar", "Sources", "المصادر", "Источники"], "Məlumat toplanmır": ["Veri toplanmaz", "No data collected", "لا نجمع بيانات", "Данные не собираются"], "Oxuma qaydaları": ["Okuma kuralları", "How you may use it", "قواعد الاستخدام", "Правила чтения"], "Reklam və izləmə yoxdur": ["Reklam ve izleme yok", "No ads or tracking", "بلا إعلانات ولا تتبّع", "Без рекламы и слежки"], "Yalnız endirmə üçün internet": ["Yalnızca indirme için internet", "Internet only for downloads", "الإنترنت للتنزيل فقط", "Интернет только для загрузок"], "Söz mənaları": ["Kelime anlamları", "Word meanings", "معاني الكلمات", "Значения слов"], "Müqayisə": ["Karşılaştır", "Compare", "مقارنة", "Сравнить"], "Mənbələri seç": ["Kaynakları seç", "Choose sources", "اختر المصادر", "Выбрать источники"], "Bu ayədə çətin söz izahı yoxdur": ["Bu ayette açıklanan garip kelime yok", "No difficult words explained in this ayah", "لا غريب في هذه الآية", "В этом аяте нет трудных слов"], "Müqayisə üçün Ayarlardan daha bir mənbə endirin": ["Karşılaştırmak için Ayarlardan bir kaynak daha indirin", "Download another source in Settings to compare", "نزّل مصدرًا آخر من الإعدادات للمقارنة", "Скачайте ещё источник в настройках для сравнения"], "Hazır": ["Tamam", "Done", "تم", "Готово"], "Bu söz üçün izah yoxdur": ["Bu kelime için açıklama yok", "No note for this word", "لا بيان لهذه الكلمة", "Нет пояснения к этому слову"], "Bu söz üçün Sirac izahı yoxdur": ["Bu kelime için Sirac açıklaması yok", "No As-Siraj note for this word", "لا بيان في السراج لهذه الكلمة", "В Ас-Сирадже нет пояснения к этому слову"], "Söz pəncərəsi": ["Kelime penceresi", "Word balloon", "نافذة الكلمة", "Окно слова"], "Hər ikisi": ["İkisi de", "Both", "كلاهما", "Оба"], "İki dəfə toxunduqda pəncərədə nə görünsün?": ["Çift dokunuşta pencerede ne görünsün?", "What the balloon shows on double-tap", "ماذا تعرض النافذة عند النقر المزدوج؟", "Что показывать при двойном касании?"], "Nümunə": ["Örnek", "Preview", "معاينة", "Пример"], "Mədinə məshəfi": ["Medine mushafı", "Madinah mushaf", "مصحف المدينة", "Мусхаф Медины"], "Sirac": ["Sirac", "As-Siraj", "السراج", "Ас-Сирадж"], "İbn Qutəybə": ["İbn Kuteybe", "Ibn Qutaybah", "ابن قتيبة", "Ибн Кутейба"], "as-Sirac fi Beyâni Garîbi'l-Kur’ân — Dr. M. al-Khudayri · QuranEnc": ["es-Sirâc fî Beyâni Garîbi'l-Kur'ân — Dr. M. el-Hudayrî · QuranEnc", "As-Siraj fi Bayan Gharib al-Qur'an — Dr. M. al-Khudayri · QuranEnc", "السراج في بيان غريب القرآن — د. محمد الخضيري · موسوعة القرآن الكريم (QuranEnc)", "Ас-Сирадж фи баян гариб аль-Куран — д-р М. аль-Худайри · QuranEnc"], "Tafsîru Garîbi'l-Kur'ân — İbn Qutəybə (ö. 276) · thq. Ahmad Saqr (1978) · mətn: tafsir.app": ["Tefsîru Garîbi'l-Kur'ân — İbn Kuteybe (ö. 276) · thk. Ahmed Sakr (1978) · metin: tafsir.app", "Tafsir Gharib al-Qur'an — Ibn Qutaybah (d. 276 AH) · ed. Ahmad Saqr (1978) · text: tafsir.app", "تفسير غريب القرآن — ابن قتيبة (ت ٢٧٦ هـ) · تحقيق أحمد صقر (١٩٧٨) · النص: tafsir.app", "Тафсир гариб аль-Куран — Ибн Кутейба (ум. 276 г. х.) · ред. Ахмад Сакр (1978) · текст: tafsir.app"], "Erab": ["İrab", "I'rab", "الإعراب", "Иъраб"], "əl-Erab əl-Müyəssər — əd-Dâru'l-Arabiyyə li-Tiqniyyəti'l-Məlumât · mətn: QUL (Tarteel)": ["el-İ'râbü'l-Müyesser — ed-Dâru'l-Arabiyye li-Teknolocyâ'l-Ma'lûmât · metin: QUL (Tarteel)", "Al-I'rab al-Muyassar — Arabic Company for Information Technology (ad-Dar al-Arabiyya) · text: QUL (Tarteel)", "الإعراب الميسر — الدار العربية لتقنية المعلومات · النص: QUL (ترتيل)", "Аль-Иъраб аль-Муяссар — ад-Дар аль-Арабийя ли-тикниййат аль-маалюмат · текст: QUL (Tarteel)"], "Erabul-Quran — Əbû Cə'fər ən-Nəhhâs (ö. 338) · thq. Abdulmun'im Xəlil İbrahim (1421) · mətn: tafsir.app": ["İ'râbü'l-Kur'ân — Ebû Ca'fer en-Nehhâs (ö. 338) · thk. Abdülmün'im Halîl İbrâhîm (1421) · metin: tafsir.app", "I'rab al-Qur'an — Abu Ja'far an-Nahhas (d. 338 AH) · ed. Abd al-Mun'im Khalil Ibrahim (1421 AH) · text: tafsir.app", "إعراب القرآن — أبو جعفر النحاس (ت ٣٣٨ هـ) · وضع حواشيه عبد المنعم خليل إبراهيم (١٤٢١ هـ) · النص: tafsir.app", "Иъраб аль-Куран — Абу Джафар ан-Наххас (ум. 338 г. х.) · ред. Абд аль-Муним Халиль Ибрахим (1421 г. х.) · текст: tafsir.app"], "Qeydlər və əlfəcinlər": ["Notlar ve yer imleri", "Notes & bookmarks", "الملاحظات والعلامات", "Заметки и закладки"], "Mənim": ["Benim", "Mine", "خاصّتي", "Моё"], "Qeydim": ["Notum", "My note", "ملاحظتي", "Моя заметка"], "Bu ayə üçün qeydiniz…": ["Bu ayet için notunuz…", "Your note on this ayah…", "ملاحظتك على هذه الآية…", "Ваша заметка к аяту…"], "Rəng": ["Renk", "Colour", "اللون", "Цвет"], "Qovluq": ["Klasör", "Folder", "المجلد", "Папка"], "Qovluqlar": ["Klasörler", "Folders", "المجلدات", "Папки"], "Yeni": ["Yeni", "New", "جديد", "Новая"], "Qovluq adı": ["Klasör adı", "Folder name", "اسم المجلد", "Название папки"], "Zikr": ["Zikir", "Dhikr", "ذكر", "Зикр"], "Dualar": ["Dualar", "Duas", "أدعية", "Дуа"], "Ümid": ["Umut", "Hope", "رجاء", "Надежда"], "Dərs": ["Ders", "Lesson", "درس", "Урок"], "Yadda saxlandı": ["Kaydedildi", "Saved", "تم الحفظ", "Сохранено"], "Hamısı": ["Hepsi", "All", "الكل", "Все"], "Qovluqsuz": ["Klasörsüz", "No folder", "بلا مجلد", "Без папки"], "Bu gün": ["Bugün", "Today", "اليوم", "Сегодня"], "Dünən": ["Dün", "Yesterday", "أمس", "Вчера"], "Redaktə et": ["Düzenle", "Edit", "تعديل", "Изменить"], "Bu qovluqda ayə yoxdur": ["Bu klasörde ayet yok", "No ayahs in this folder", "لا آيات في هذا المجلد", "В этой папке нет аятов"], "Hələ heç nə saxlanmayıb": ["Henüz bir şey kaydedilmedi", "Nothing saved yet", "لم يُحفظ شيء بعد", "Пока ничего не сохранено"], "Ayəyə toxunun, sonra əlfəcin düyməsini basın.": ["Bir ayete dokunun, sonra yer imi düğmesine basın.", "Tap an ayah, then the bookmark button.", "انقر على آية ثم على زر العلامة.", "Нажмите на аят, затем на кнопку закладки."], "Qovluq silinsə, ayələr və qeydlər qalır.": ["Klasör silinirse ayetler ve notlar kalır.", "Deleting a folder keeps its ayahs and notes.", "حذف المجلد يُبقي الآيات والملاحظات.", "При удалении папки аяты и заметки остаются."], "İxrac (JSON)": ["Dışa aktar (JSON)", "Export (JSON)", "تصدير (JSON)", "Экспорт (JSON)"], "İdxal": ["İçe aktar", "Import", "استيراد", "Импорт"], "İdxal olundu": ["İçe aktarıldı", "Imported", "تم الاستيراد", "Импортировано"], "Hifz": ["Hıfz", "Hifz", "الحفظ", "Хифз"], "İrəliləyiş": ["İlerleme", "Progress", "التقدم", "Прогресс"], "Mənim irəliləyişim": ["İlerlemem", "My progress", "تقدّمي", "Мой прогресс"], "Aralıq seçin": ["Aralık seçin", "Choose a range", "اختر المقطع", "Выберите отрывок"], "Surə": ["Sure", "Surah", "السورة", "Сура"], "Ayədən": ["Ayetten", "From ayah", "من الآية", "С аята"], "Ayəyə": ["Ayete", "To ayah", "إلى الآية", "По аят"], "Başla": ["Başla", "Start", "ابدأ", "Начать"], "əzbərlənib": ["ezberlendi", "memorised", "محفوظة", "выучено"], "Ayə": ["Ayet", "Ayah", "آية", "Аят"], "Gizlət: bulanıq": ["Gizle: bulanık", "Hide: blur", "إخفاء: ضبابي", "Скрыть: размытие"], "İlk hərf": ["İlk harf", "First letter", "الحرف الأول", "Первая буква"], "Hamısı açıq": ["Hepsi açık", "All shown", "الكل ظاهر", "Всё открыто"], "Açmaq və ya yenidən gizlətmək üçün ayəyə toxunun": ["Açmak veya yeniden gizlemek için ayete dokunun", "Tap an ayah to reveal or hide it again", "انقر الآية لإظهارها أو إخفائها", "Нажмите на аят, чтобы открыть или скрыть"], "Ayəyə toxunub onu seçin": ["Seçmek için ayete dokunun", "Tap an ayah to select it", "انقر آية لاختيارها", "Нажмите на аят, чтобы выбрать"], "Təkrar sayı": ["Tekrar sayısı", "Repetitions", "عدد التكرار", "Повторы"], "Hədəf": ["Hedef", "Target", "الهدف", "Цель"], "Hədəfə çatdınız": ["Hedefe ulaştınız", "Target reached", "بلغت الهدف", "Цель достигнута"], "Əzbərlədim": ["Ezberledim", "Mark memorised", "حفظتُها", "Выучил"], "Əzbərlənib": ["Ezberlendi", "Memorised", "محفوظة", "Выучено"], "Növbəti ayə": ["Sonraki ayet", "Next ayah", "الآية التالية", "Следующий аят"], "Cəmi": ["Toplam", "Total", "المجموع", "Всего"], "ayə əzbərlənib": ["ayet ezberlendi", "ayahs memorised", "آية محفوظة", "аятов выучено"], "Oxuma planı": ["Okuma planı", "Reading plan", "خطة القراءة", "План чтения"], "Təqvim": ["Takvim", "Calendar", "التقويم", "Календарь"], "Günlər": ["Günler", "Days", "الأيام", "Дни"], "Gündə 1 cüz": ["Günde 1 cüz", "1 juz a day", "جزء يوميًا", "1 джуз в день"], "gün": ["gün", "days", "يوم", "дн."], "oxundu": ["okundu", "read", "مقروء", "прочитано"], "buraxıldı": ["kaçırıldı", "missed", "فائت", "пропущено"], "qarşıda": ["ileride", "upcoming", "قادم", "впереди"], "gün oxundu": ["gün okundu", "days read", "أيام مقروءة", "дней прочитано"], "xətm": ["hatim", "khatm", "الختم", "хатм"], "Geridə qaldınız": ["Geride kaldınız", "You are behind", "تأخّرت", "Вы отстали"], "Buraxılan səhifələr qalan günlərə bölünsün? Gündə təxminən N səhifə olacaq.": ["Kaçırılan sayfalar kalan günlere bölünsün mü? Günde yaklaşık N sayfa olacak.", "Spread the missed pages over the days left? About N pages a day.", "توزيع الصفحات الفائتة على الأيام الباقية؟ نحو N صفحة يوميًا.", "Распределить пропущенные страницы по оставшимся дням? Около N стр. в день."], "Bölüşdür": ["Dağıt", "Spread", "وزّع", "Распределить"], "Bu gün tamamla": ["Bugün tamamla", "Catch up today", "أكمِل اليوم", "Догнать сегодня"], "Plan yeniləndi": ["Plan güncellendi", "Plan updated", "حُدّثت الخطة", "План обновлён"], "Plan müddəti bitdi.": ["Plan süresi bitti.", "The plan period has ended.", "انتهت مدة الخطة.", "Срок плана закончился."], "Plan başlayır": ["Plan başlıyor", "Plan starts", "تبدأ الخطة", "План начнётся"], "Yeni plan": ["Yeni plan", "New plan", "خطة جديدة", "Новый план"], "Planı sil": ["Planı sil", "Delete plan", "حذف الخطة", "Удалить план"], "Silinsin?": ["Silinsin mi?", "Delete?", "حذف؟", "Удалить?"], "Gün": ["Gün", "Day", "اليوم", "День"], "Oxundu": ["Okundu", "Read", "مقروء", "Прочитано"], "Buraxıldı": ["Kaçırıldı", "Missed", "فائت", "Пропущено"], "Köçürüldü": ["Taşındı", "Moved", "نُقل", "Перенесено"], "səhifə": ["sayfa", "pages", "صفحة", "стр."], "Oxu": ["Oku", "Read", "اقرأ", "Читать"], "səh.": ["s.", "p.", "ص", "стр."], "Oxudum": ["Okudum", "Mark read", "قرأتُ", "Прочитал"], "Xətm müddəti": ["Hatim süresi", "Khatm length", "مدة الختم", "Срок хатма"], "Başqa…": ["Diğer…", "Other…", "أخرى…", "Другое…"], "Başlama tarixi": ["Başlangıç tarihi", "Start date", "تاريخ البدء", "Дата начала"], "Başlanğıc səhifə": ["Başlangıç sayfası", "Start page", "صفحة البدء", "Начальная страница"], "Hesablandı": ["Hesaplandı", "Calculated", "المحسوب", "Расчёт"], "səhifə gündə": ["sayfa günde", "pages a day", "صفحة يوميًا", "стр. в день"], "Bitmə tarixi": ["Bitiş tarihi", "Ends on", "تاريخ الانتهاء", "Окончание"], "Planı başlat": ["Planı başlat", "Start plan", "ابدأ الخطة", "Начать план"], "Plan yaradıldı": ["Plan oluşturuldu", "Plan created", "أُنشئت الخطة", "План создан"], "N günə xətm": ["N günde hatim", "Khatm in N days", "ختم في N يومًا", "Хатм за N дней"], "Ərəbcə": ["Arapça", "Arabic", "العربية", "Арабский"], "Daha çox": ["Daha fazla", "More", "المزيد", "Ещё"], "Hələ tərcümə endirilməyib.": ["Henüz meal indirilmedi.", "No translation downloaded yet.", "لم تُنزَّل أي ترجمة بعد.", "Перевод ещё не скачан."], "Hələ təfsir endirilməyib.": ["Henüz tefsir indirilmedi.", "No tafsir downloaded yet.", "لم يُنزَّل أي تفسير بعد.", "Тафсир ещё не скачан."]};
  const uiLang = () => localStorage.getItem("qm.lang") || "az";
  const T = (k) => { const i = ["tr", "en", "ar", "ru"].indexOf(uiLang()); return i < 0 || !DICT[k] ? k : DICT[k][i]; };

  const prefs = () => { try { return Object.assign({ tf: "", tr: "", fs: 1, tab: "tf" }, JSON.parse(localStorage.getItem("qm.prefs") || "{}")); } catch (e) { return { tf: "", tr: "", fs: 1, tab: "tf" }; } };
  const setPrefs = (p) => localStorage.setItem("qm.prefs", JSON.stringify(Object.assign(prefs(), p)));
    function applyLook() {
    let theme = "current";
    try {
      theme = localStorage.getItem("qm.readTheme") || (localStorage.getItem("qm.night") === "1" ? "black" : "current");
    } catch (e) { theme = "current"; }
    if (theme !== "white" && theme !== "black") theme = "current";
    const night = theme === "black";
    document.documentElement.classList.toggle("qm-night", night);
    document.documentElement.classList.toggle("qm-theme-white", theme === "white");
    document.documentElement.classList.toggle("qm-theme-black", theme === "black");
    const fs = +prefs().fs || 1;
    const page = document.getElementById("page");
    if (page) page.style.zoom = Math.abs(fs - 1) < 0.02 ? "" : String(fs);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = theme === "black" ? "#0e0e0e" : (theme === "white" ? "#ffffff" : "#fffaf0");
  }
  applyLook();
  const lookCss = document.createElement("style");
  lookCss.textContent = "html.qm-night,html.qm-night body{background:#141a17!important;color:#f3ead8!important}html.qm-night header,html.qm-night .num,html.qm-night .page,html.qm-night .qm-sheet,html.qm-night .qj-box{background:#141a17!important;color:#f3ead8!important}html.qm-night header h1,html.qm-night header a,html.qm-night a.home-brand{color:#f3ead8!important}html.qm-night .line,html.qm-night .ay{color:#f6edd9}html.qm-night .qlb{background:#1c2622!important;color:#f3ead8!important}html.qm-night .qlb-qari,html.qm-night .qlb-qaris{background:#24302b!important;color:#f3ead8!important}html.qm-night .set-card,html.qm-night .qm-scroll{color:#f3ead8}.set-look{display:flex;flex-direction:column;gap:.55rem}.set-sizes{display:flex;gap:.4rem;align-items:center;flex-wrap:wrap}.set-lab{font-size:.78rem;opacity:.75}.set-sz{border:1px solid #c4a56e;background:#fff;color:#1a3330;border-radius:999px;padding:.28rem .7rem;font:inherit;font-size:.78rem;cursor:pointer}.set-sz.on{background:#1a3330;color:#fbf6ec;border-color:#1a3330}html.qm-night .set-sz{background:#24302b;color:#f3ead8}html.qm-night .set-sz.on{background:#c4a56e;color:#1a3330}#page{isolation:isolate;position:relative;z-index:0}.qm-back{isolation:isolate}.qm-body[lang=ar],.qm-tx2[lang=ar],.qm-cmp-tx[lang=ar]{font-family:Kitab,'Noto Naskh Arabic',Amiri,'Scheherazade New',serif!important;line-height:2.2}.qm-ir-pick{display:flex;flex-direction:column;gap:.5rem;padding:.15rem 0 .4rem}.qm-ir-pick>p{margin:0 0 .15rem;text-align:center;font-weight:700;color:#8a6a2e}.qm-ir-card{display:flex;flex-direction:column;align-items:flex-start;gap:.12rem;width:100%;text-align:start;border:1px solid #c4a56e;background:#fffaf0;color:#12352c;border-radius:.9rem;padding:.72rem .9rem;font:inherit;cursor:pointer}.qm-ir-card b{font-size:1.05rem;line-height:1.45}.qm-ir-card small{color:#6d6456;font-size:.78rem}html.qm-night .qm-ir-card{background:#1c2622;color:#f3ead8;border-color:#3d4a44}html.qm-night .qm-ir-card small{color:#c4b89a}html.qm-theme-white,html.qm-theme-white body{background:#fff!important;color:#111!important}html.qm-theme-white .qm-sheet,html.qm-theme-white .qm-full,html.qm-theme-white .qm-body{background:#fff!important;color:#111!important}html.qm-theme-black,html.qm-theme-black body{background:#0e0e0e!important;color:#f2ebe0!important}html.qm-theme-black .qm-sheet{background:#161616!important;color:#f2ebe0!important}html.qm-theme-black .qm-body,html.qm-theme-black .qm-full{background:#0e0e0e!important;color:#f2ebe0!important}.qm-full-b,.qm-hz-b,.qm-scroll,.qm-cmp-fs-b,.qm-cmp-tx{min-height:0}";
  document.head.appendChild(lookCss);
  (function(){try{var b=(document.currentScript&&document.currentScript.src||"./lib.js").replace(/lib\.js[^/]*$/,"");if(!b||b==="./lib.js")b="./";var l=document.createElement("link");l.rel="stylesheet";l.href=b+"quote-color.css?v=1";document.head.appendChild(l);var s=document.createElement("script");s.src=b+"quote-color.js?v=1";document.head.appendChild(s);}catch(e){}})();
  const gearSvg = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="8" cy="7" r="2.1" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="15" cy="12" r="2.1" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="10" cy="17" r="2.1" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>';
  document.querySelectorAll("#menu-btn, button.gear").forEach((b) => { b.innerHTML = gearSvg; b.setAttribute("aria-label", T("Ayarlar")); });
  let dbp = null;
  const db = () => (dbp ||= new Promise((ok, no) => { const r = indexedDB.open("qm-lib", 1); r.onupgradeneeded = () => r.result.createObjectStore("kv"); r.onsuccess = () => ok(r.result); r.onerror = () => no(r.error); }));
  async function tx(mode, f) { const d = await db(); return new Promise((ok, no) => { const t = d.transaction("kv", mode); const r = f(t.objectStore("kv")); t.oncomplete = () => ok(r ? r.result : undefined); t.onerror = () => no(t.error); }); }
  // website: every book is open — files stream from the server on demand, no download step (native app keeps offline downloads)
  const WEB = !(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform());
  const netP = {};
  const extHost = (id) => /^(mujahid|razzaq|mundhir|rajab|taymiyyah)$/.test(id) ? "https://t2.mushafuk.online" : (/^(saadi|muyassar|mukhtasar|ibnkathir|baghawi|samani|aysar|tabari|shinqiti|shawkani|uthaymeen|ibnhatim|thawri|zamanin|jawzi|qayyim|qasimi)$/.test(id) ? "https://tafsir.mushafuk.online" : "");
  const bookUrl = (r, s) => { const h = extHost(r.id); return h ? (h + "/data/" + r.id + "/" + s + ".json") : (RB + (r.p || r.k) + "/" + r.id + "/" + s + ".json"); };
  const netSurah = (r, s) => (netP[r.id + ":" + s] ||= (async () => {
    if (r.k === "tr" && !r.per) { const j = await (netP[r.id + ":all"] ||= fetch(RB + "tr/" + r.id + ".json").then((x) => { if (!x.ok) throw new Error("http"); return x.json(); })); return { v: j.v[s - 1] }; }
    const res = await fetch(bookUrl(r, s)); if (!res.ok) throw new Error("http");
    const j = await res.json(); return r.k === "tr" ? { v: j.t, f: j.f } : { v: j };
  })().catch((e) => { delete netP[r.id + ":" + s]; throw e; }));
  const netWbw = (s) => (netP["wbw:" + s] ||= fetch(RB + "wb/seraj/w" + s + ".json").then((x) => { if (!x.ok) throw new Error("http"); return x.json(); }).catch(() => { delete netP["wbw:" + s]; return null; }));
  const idbGet = (k) => tx("readonly", (s) => s.get(k));
  async function get(k) {
    const v = await idbGet(k).catch(() => undefined);
    if (v != null || !WEB) return v;
    let m;
    if ((m = /^wbw:(\d+)$/.exec(k))) return netWbw(+m[1]);
    if ((m = /^(.+?):(f:)?(\d+|n)$/.exec(k))) {
      if (!LIST.length) LIST = await (await fetch(RB + "lib-list.json")).json().catch(() => []);
      const r = LIST.find((x) => x.id === m[1]); if (!r) return v;
      if (m[3] === "n") return 114;
      const o = await netSurah(r, +m[3]).catch(() => null); if (!o) return v;
      return m[2] ? o.f : o.v;
    }
    return v;
  }
  const put = (k, v) => tx("readwrite", (s) => { s.put(v, k); });
  const status = async (id) => (await get(id + ":n")) || 0;
  const running = {};
  async function download(r, prog) {
    ayahText(1, 1); quranFont();
    const ctl = (running[r.id] = { stop: false });
    try {
      if (r.k === "tr" && !r.per) {
        const res = await fetch(RB + "tr/" + r.id + ".json"); if (!res.ok) throw new Error("http");
        const j = await res.json();
        for (let s = 1; s <= 114; s++) { await put(r.id + ":" + s, j.v[s - 1]); prog(s); }
        await put(r.id + ":n", 114); return;
      }
      for (let s = (await status(r.id)) + 1; s <= 114; s++) {
        if (ctl.stop) throw new Error("stopped");
        const res = await fetch(bookUrl(r, s)); if (!res.ok) throw new Error("http");
        const j = await res.json();
        const out = r.k === "tr" ? j.t : j;
        if (!Array.isArray(out) || out.length !== AYAHS[s - 1]) throw new Error("bad file");
        if (r.k === "tr" && Array.isArray(j.f)) await put(r.id + ":f:" + s, j.f);
        if (r.k === "wb" && !(await get("wbw:" + s))) { const wr = await fetch(RB + "wb/seraj/w" + s + ".json"); if (!wr.ok) throw new Error("http"); await put("wbw:" + s, await wr.json()); } // the ayah's words (Arabic only) for the double-tap word balloon, shared by the word-meaning books
        await put(r.id + ":" + s, out); await put(r.id + ":n", s); prog(s);
      }
    } finally { delete running[r.id]; }
  }
  const remove = (id) => { delete srcCache[id]; return tx("readwrite", (s) => { s.delete(IDBKeyRange.bound(id + ":", id + ":\uffff")); }); };
  async function entry(id, s, a) {
    const v = await get(id + ":" + s); if (!v) return null;
    const R = LIST.find((x) => x.id === id) || {};
    if (R.k === "wb" || R.ex) return { text: v[a - 1] || "", from: a, to: a, exact: true }; // word meanings, and books stored per ayah (a passage on several ayahs repeated on each), belong to their own ayah
    let from = a; while (from > 1 && !v[from - 1]) from--;
    if (!v[from - 1]) return { text: "", from: a, to: a };
    let to = from; while (to < v.length && !v[to]) to++;
    return { text: v[from - 1], from, to };
  }
  const plain = (h) => String(h).replace(/<\s*br\s*\/?>/gi, "\n").replace(/<\/(p|div|h\d|li)>/gi, "\n\n").replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/\n{3,}/g, "\n\n").trim();
  const el = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; };

  /* ---------- Settings ---------- */
  const back = el("div", "qm-back"); back.hidden = true;
  const sheet = el("div", "qm-sheet qm-set"); back.appendChild(sheet);
  back.addEventListener("click", (e) => { if (e.target === back && !back.classList.contains("qm-page")) closeAll(); });
  document.body.appendChild(back);
  let setView = "menu";
  let setHist = false;
  function closeSettingsPage() {
    setHist = false;
    setView = "menu";
    back.classList.remove("qm-page");
    back.hidden = true;
    closePop();
    sheet.replaceChildren();
  }
  function closeAll() {
    if (back.classList.contains("qm-page")) {
      if (setView !== "menu") { setView = "menu"; paintSettings(); return; }
      if (setHist && history.state && history.state.qmSet) { history.back(); return; }
      closeSettingsPage();
      return;
    }
    back.hidden = true; cur = null; closePop(); window.QM_HL && window.QM_HL(sel ? sel.slice() : null); sheet.replaceChildren();
  }
  window.addEventListener("popstate", () => { if (back.classList.contains("qm-page")) closeSettingsPage(); });
  const ICON = {
    lang: '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.6 2.6 2.6 14.4 0 17M12 3.5c-2.6 2.6-2.6 14.4 0 17"/>',
    size: '<path d="M4 18 8.5 6 13 18M5.6 14h5.8M15 18l3-7.5 3 7.5M15.9 16h4.2"/>',
    tf: '<path d="M4 5.5C6.5 4.5 9.5 4.5 12 6c2.5-1.5 5.5-1.5 8-.5v13c-2.5-1-5.5-1-8 .5-2.5-1.5-5.5-1.5-8-.5zM12 6v13.5"/>',
    tr: '<path d="M4 6h9M8.5 4v2M6 6c.5 3 2.5 5.5 5 6.5M11 6c-.5 3-2.5 5.5-5 6.5M13 20l3.5-8 3.5 8M14.2 17.3h4.6"/>',
  };
  const pop = el("div", "qm-pop"); pop.hidden = true; document.body.appendChild(pop);
  let popAnchor = null;
  function closePop() { pop.hidden = true; popAnchor = null; pop.replaceChildren(); }
  document.addEventListener("pointerdown", (ev) => {
    if (pop.hidden) return;
    const t = ev.target;
    if (t instanceof Element && t.closest(".qm-pop, .set-line")) return;
    closePop();
  });
  function placePop(anchor) {
    pop.hidden = false;
    pop.style.left = "0.7rem";
    pop.style.right = "0.7rem";
    const r = anchor.getBoundingClientRect();
    const below = window.innerHeight - r.bottom;
    const cap = Math.min(340, Math.round(window.innerHeight * 0.52));
    if (below >= 150 || below >= r.top) {
      pop.style.top = Math.round(r.bottom + 6) + "px";
      pop.style.bottom = "auto";
      pop.style.maxHeight = Math.max(120, Math.min(cap, below - 12)) + "px";
    } else {
      pop.style.top = "auto";
      pop.style.bottom = Math.round(window.innerHeight - r.top + 6) + "px";
      pop.style.maxHeight = Math.max(120, Math.min(cap, r.top - 12)) + "px";
    }
  }
  function togglePop(anchor, fill) {
    if (!pop.hidden && popAnchor === anchor) { closePop(); return; }
    popAnchor = anchor;
    pop.replaceChildren();
    fill();
    placePop(anchor);
  }
  function langName() { return (LANGS.find((l) => l[0] === uiLang()) || LANGS[0])[1]; }
  function resLabel(k) {
    const id = prefs()[k];
    const r = LIST.find((x) => x.id === id);
    return r ? r.name : T("Seçilməyib");
  }
  function setLine(key, label, value, onClick) {
    const b = el("button", "set-line");
    b.type = "button";
    b.dataset.k = key;
    const v = el("span", "v", value); v.dir = "auto";
    b.append(el("span", "k", label), v, el("span", "chev", "›"));
    b.onclick = () => onClick(b);
    return b;
  }
  function openLangPop(anchor) {
    togglePop(anchor, () => {
      for (const [id, nm] of LANGS) {
        const b = el("button", "lang-opt" + (id === uiLang() ? " on" : ""), nm);
        b.type = "button";
        b.onclick = () => { localStorage.setItem("qm.lang", id); closePop(); refreshUi(); };
        pop.append(b);
      }
    });
  }
  function openResPop(kind, anchor) {
    togglePop(anchor, () => {
      const items = LIST.filter((r) => r.k === kind);
      const sorted = kind === "tr" ? [...items].sort((a, b) => a.by.localeCompare(b.by) || a.name.localeCompare(b.name)) : items;
      const ul = el("ul", "qm-list");
      let grp = null;
      for (const r of sorted) {
        if (kind === "tr" && r.by !== grp) { grp = r.by; const g = el("li", "qm-grp", grp); g.dir = "auto"; ul.append(g); }
        ul.append(resRow(r));
      }
      pop.append(ul);
    });
  }
  function renderHome() {
    const head = document.querySelector(".idx-head");
    if (head) head.dir = uiLang() === "ar" ? "rtl" : "ltr";
  }
  function refreshUi() {
    renderHome();
    if (!back.hidden && sheet.classList.contains("qm-set")) openSettings();
    window.dispatchEvent(new CustomEvent("qm-ui"));
  }

  const LI = { az: 0, tr: 1, en: 2, ar: 3, ru: 4 };
  const L = (row) => row[LI[uiLang()]] ?? row[0];
  const IC = {
    lang: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.2 2.6 3.4 5.6 3.4 9s-1.2 6.4-3.4 9c-2.2-2.6-3.4-5.6-3.4-9s1.2-6.4 3.4-9z"/>',
    book: '<path d="M5 4.5A2.5 2.5 0 0 1 7.5 2.5H20v16H7.5A2.5 2.5 0 0 0 5 21z"/><path d="M5 4.5A2.5 2.5 0 0 1 7.5 7H20"/>',
    tr: '<path d="M4 5h7M7.5 5c.2 3.2-1.2 5.6-3.5 7.2M5.2 9.2c1 .8 2.2 1.4 3.6 1.6"/><path d="M13 20.5 16.2 11h1.6L21 20.5M14.3 17h5.4"/>',
    size: '<path d="M4 19 8.6 6h1.5L15 19M6.2 14.2h6.2M16.5 19V9.5M16.5 9.5H19M16.5 9.5h-2"/>',
    shield: '<path d="M12 3 5 6v6c0 4 2.7 6.9 7 8.5 4.3-1.6 7-4.5 7-8.5V6z"/><path d="m8.5 12 2.2 2.2 4.3-4.4"/>',
    doc: '<path d="M7 3h7l5 5v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/><path d="M14 3v5h5M8.5 13h7M8.5 16.5h5"/>',
    lock: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
    key: '<circle cx="8" cy="15" r="3"/><path d="M11 15h9M17 15v2.4M14.2 15v2"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.6h.01"/>',
    mail: '<rect x="3.5" y="5.5" width="17" height="13" rx="2"/><path d="m4 7 8 6 8-6"/>',
    mark: '<path d="M6.5 3.5h11v17L12 16.5l-5.5 4z"/>',
    cal: '<rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
    src: '<path d="m12 3 9 5-9 5L3 8z"/><path d="m3 12 9 5 9-5M3 16l9 5 9-5"/>',
  };
  const icEl = (name) => { const s = el("span", "ic"); s.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true">' + IC[name] + "</svg>"; return s; };
  function card(icon, title, hint, onClick) {
    const b = el(onClick ? "button" : "div", "set-card" + (onClick ? "" : " static"));
    if (onClick) b.type = "button";
    const tx = el("span", "tx");
    tx.append(el("b", "", title));
    b.append(icEl(icon), tx);
    if (hint) { const sm = el("span", "v", hint); sm.dir = "auto"; b.append(sm); }
    if (onClick) { b.append(el("span", "chev", "›")); b.onclick = onClick; }
    return b;
  }
  const openDoc = (id) => { setView = id; paintSettings(); };
  const P5 = (...rows) => rows;
  const DOCS = {
    privacy: { title: P5("Məxfilik siyasəti", "Gizlilik politikası", "Privacy policy", "سياسة الخصوصية", "Политика конфиденциальности"), blocks: [
      { p: P5("Son yenilənmə: 4 noyabr 2026. Mushafuk.online Mədinə mushafını səhifə-səhifə oxumaq üçündür. Saytı Nibras Code dərc edir.", "Son güncelleme: 4 Kasım 2026. Mushafuk.online, Medine mushafını sayfa sayfa okumak içindir. Siteyi Nibras Code yayımlar.", "Last updated: 4 November 2026. Mushafuk.online is for reading the Madinah mushaf page by page. The site is published by Nibras Code.", "آخر تحديث: 4 نوفمبر 2026. مصحفك لقراءة مصحف المدينة صفحةً صفحة. ينشر الموقع Nibras Code.", "Обновлено: 4 ноября 2026. Mushafuk.online — чтение мединского мусхафа страница за страницей. Сайт публикует Nibras Code.") },
      { h: P5("Nə toplamırıq", "Neyi toplamayız", "What we do not collect", "ما لا نجمعه", "Что мы не собираем"), p: P5("Hesab yoxdur. Ad, e-poçt, telefon, yer, kontakt və cihaz identifikatoru alınmır. Reklam, analitik və izləmə yoxdur. Məlumat satılmır və paylaşılmır.", "Hesap yoktur. Ad, e-posta, telefon, konum, kişiler ve cihaz kimliği alınmaz. Reklam, analitik ve izleme yoktur. Veri satılmaz ve paylaşılmaz.", "There is no account. We do not take your name, email, phone, location, contacts, or device id. There are no ads, analytics, or trackers. Data is not sold or shared.", "لا يوجد حساب. لا نأخذ الاسم ولا البريد ولا الهاتف ولا الموقع ولا جهات الاتصال ولا معرّف الجهاز. لا إعلانات ولا تحليلات ولا تتبّع. لا نبيع البيانات ولا نشاركها.", "Аккаунта нет. Имя, почта, телефон, геолокация, контакты и id устройства не собираются. Нет рекламы, аналитики и трекеров. Данные не продаются и не передаются.") },
      { h: P5("Cihazda qalanlar", "Cihazda kalanlar", "What stays on the device", "ما يبقى على الجهاز", "Что остаётся на устройстве"), p: P5("Dil, mətn ölçüsü, seçilmiş təfsir və tərcümə, əlfəcinlər və qeydlər yalnız bu cihazda qalır. Serverə göndərilmir.", "Dil, yazı boyutu, seçilen tefsir ve meal, yer imleri ve notlar yalnız bu cihazda durur. Sunucuya gitmez.", "Language, text size, the tafsir and translation you pick, bookmarks, and notes stay on this device only. They are not sent to a server.", "اللغة وحجم النص والتفسير والترجمة المختاران والعلامات والملاحظات تبقى على هذا الجهاز فقط ولا تُرسل إلى خادم.", "Язык, размер текста, выбранные тафсир и перевод, закладки и заметки остаются только на устройстве и не уходят на сервер.") },
      { h: P5("Axtarış", "Arama", "Search", "البحث", "Поиск"), p: P5("Saytdakı axtarış yalnız buradakı Quran, təfsir və tərcümə mətnində aparılır. Sual kənar bir modelə göndərilmir.", "Sitedeki arama yalnız buradaki Kur’an, tefsir ve meal metninde yapılır. Soru dışarıdaki bir modele gitmez.", "Search on the site looks only in the Quran, tafsir, and translation text that is here. The question is not sent to an outside model.", "البحث في الموقع يجري فقط في نص القرآن والتفسير والترجمة الموجود هنا. السؤال لا يُرسل إلى نموذج خارجي.", "Поиск на сайте идёт только по тексту Корана, тафсира и перевода, который здесь. Вопрос не отправляется внешней модели.") },
      { h: P5("İnternet", "İnternet", "Internet", "الإنترنت", "Интернет"), p: P5("İnternet səhifəni, təfsiri, tərcüməni və səsi açmaq üçündür. Əlaqə HTTPS ilə gedir.", "İnternet sayfayı, tefsiri, meali ve sesi açmak içindir. Bağlantı HTTPS iledir.", "Internet is used to open a page, a tafsir, a translation, and the audio. The connection is HTTPS.", "يُستخدم الإنترنت لفتح الصفحة والتفسير والترجمة والصوت. الاتصال عبر HTTPS.", "Интернет нужен, чтобы открыть страницу, тафсир, перевод и звук. Соединение идёт по HTTPS.") },
      { h: P5("Uşaqlar", "Çocuklar", "Children", "الأطفال", "Дети"), p: P5("Sayt uşaqlardan bilərəkdən məlumat almır. Məzmun Qurandır, reklam yoxdur.", "Site çocuklardan bilerek veri almaz. İçerik Kur’an’dır, reklam yoktur.", "The site does not knowingly collect data from children. The content is the Quran, and there are no ads.", "الموقع لا يجمع بيانات الأطفال عن قصد. المحتوى قرآن بلا إعلانات.", "Сайт сознательно не собирает данные детей. Содержание — Коран, без рекламы.") },
      { p: P5("Əlaqə: nibrascode@gmail.com · https://nibrascode.com", "İletişim: nibrascode@gmail.com · https://nibrascode.com", "Contact: nibrascode@gmail.com · https://nibrascode.com", "التواصل: nibrascode@gmail.com · https://nibrascode.com", "Контакт: nibrascode@gmail.com · https://nibrascode.com") },
    ]},
    terms: { title: P5("İstifadə şərtləri", "Kullanım şartları", "Terms of use", "شروط الاستخدام", "Условия использования"), blocks: [
      { p: P5("Mushafuk.online-u açmaqla bu şərtləri qəbul edirsiniz. Sayt pulsuzdur. İçində alış və reklam yoxdur.", "Mushafuk.online’u açarak bu şartları kabul edersiniz. Site ücretsizdir. İçinde satın alma ve reklam yoktur.", "Opening Mushafuk.online means you accept these terms. The site is free. There are no purchases and no ads.", "بفتح Mushafuk.online فإنك تقبل هذه الشروط. الموقع مجاني بلا مشتريات ولا إعلانات.", "Открывая Mushafuk.online, вы принимаете эти условия. Сайт бесплатный, без покупок и рекламы.") },
      { h: P5("Mətn", "Metin", "The text", "النص", "Текст"), p: P5("Ərəbcə Quran mətni Tanzil layihəsinə aiddir. Saytdakı mətn tanzil.net ünvanındakı yoxlanılmış Üsmani nüsxədir və dəyişdirilmədən göstərilir.", "Arapça Kur’an metni Tanzil projesine aittir. Sitedeki metin tanzil.net adresindeki doğrulanmış Osmani nüshadır ve değiştirilmeden gösterilir.", "The Arabic Quran text belongs to the Tanzil Project. The text on the site is the verified Uthmani copy at tanzil.net, shown unchanged.", "النص العربي للقرآن من مشروع تنزيل. النص في الموقع هو النسخة العثمانية الموثقة في tanzil.net ويُعرض دون تغيير.", "Арабский текст Корана принадлежит проекту Tanzil. На сайте проверенная усманийская копия с tanzil.net, без изменений.") },
      { p: P5("Tanzil Quran Text. Copyright (C) 2007–2021 Tanzil Project. License: Creative Commons Attribution 3.0.", "Tanzil Quran Text. Copyright (C) 2007–2021 Tanzil Project. License: Creative Commons Attribution 3.0.", "Tanzil Quran Text. Copyright (C) 2007–2021 Tanzil Project. License: Creative Commons Attribution 3.0.", "Tanzil Quran Text. Copyright (C) 2007–2021 Tanzil Project. License: Creative Commons Attribution 3.0.", "Tanzil Quran Text. Copyright (C) 2007–2021 Tanzil Project. License: Creative Commons Attribution 3.0.") },
      { p: P5("Mətn olduğu kimi götürülə bilər. Mətni dəyişdirmək olmaz.", "Metin olduğu gibi alınabilir. Metni değiştirmek olmaz.", "The text may be copied as it is. Changing the text is not allowed.", "يمكن أخذ النص كما هو. لا يجوز تغيير النص.", "Текст можно брать как есть. Менять текст нельзя.") },
      { p: P5("Bu Üsmani mətn Mədinə mushafı ilə eynidir. Mədinə mushafını Kral Fəhd Kompleksi nəşr edir. Tanzil-in rəqəmsal mətni həmin mushafa uyğundur, ona görə mənbə eynidir.", "Bu Osmani metin Medine mushafı ile aynıdır. Medine mushafını Kral Fehd Külliyesi yayımlar. Tanzil’in dijital metni o mushafa uyar, bu yüzden kaynak aynıdır.", "This Uthmani text matches the Madinah mushaf. The King Fahd Complex publishes the Madinah mushaf. Tanzil’s digital text follows that same mushaf, so the source is the same.", "هذا النص العثماني مطابق لمصحف المدينة. مجمع الملك فهد ينشر مصحف المدينة. النص الرقمي لتنزيل يوافق ذلك المصحف، فالمصدر واحد.", "Этот усманийский текст совпадает с мединским мусхафом. Комплекс короля Фахда издаёт мединский мусхаф. Цифровой текст Tanzil следует тому же мусхафу, поэтому источник один.") },
      { p: P5("Mushafın bu icazəsi tərcümələrə, təfsir nəşrlərinə və səs yazılarına şamil olunmur. Hər əsərin adı Mənbələr səhifəsindədir.", "Mushafın bu izni meallere, tefsir yayınlarına ve ses kayıtlarına yayılmaz. Her eserin adı Kaynaklar sayfasındadır.", "This mushaf permission does not cover translations, tafsir editions, or audio. Each work is named on the Sources page.", "إذن المصحف هذا لا يشمل الترجمات ولا طبعات التفسير ولا التسجيلات الصوتية. اسم كل عمل في صفحة المصادر.", "Это разрешение на мусхаф не покрывает переводы, издания тафсира и аудио. Имя каждого сочинения — на странице источников.") },
      { p: P5("Yeniliklər https://tanzil.net/updates/ səhifəsindədir.", "Yenilikler https://tanzil.net/updates/ sayfasındadır.", "Updates are at https://tanzil.net/updates/.", "التحديثات في https://tanzil.net/updates/.", "Обновления на https://tanzil.net/updates/.") },
      { h: P5("İstifadə", "Kullanım", "Use", "الاستخدام", "Использование"), p: P5("Sayt şəxsi oxumaq üçündür. Quran mətnini dəyişdirib özünüzünkülmüş kimi vermək olmaz.", "Site kişisel okuma içindir. Kur’an metnini değiştirip kendinizinmiş gibi vermek olmaz.", "The site is for personal reading. You may not change the Quran text and present it as your own.", "الموقع للقراءة الشخصية. لا يجوز تغيير نص القرآن وعرضه كأنه من عندك.", "Сайт для личного чтения. Нельзя менять текст Корана и выдавать его за свой.") },
      { p: P5("Saytdakı axtarış yalnız buradakı mətndən sitat gətirir. O, fətva deyil. Sayt olduğu kimi verilir.", "Sitedeki arama yalnız buradaki metinden alıntı yapar. O fetva değildir. Site olduğu gibi sunulur.", "Search on the site only quotes the text that is here. It is not a fatwa. The site is provided as is.", "البحث في الموقع يقتبس فقط من النص الموجود هنا. ليس فتوى. يُقدَّم الموقع كما هو.", "Поиск на сайте цитирует только текст, который здесь. Это не фетва. Сайт даётся как есть.") },
    ]},
    data: { title: P5("Məlumat təhlükəsizliyi", "Veri güvenliği", "Data safety", "أمان البيانات", "Безопасность данных"), blocks: [
      { p: P5("Play Market-in məlumat forması üçün cavablar belədir.", "Play Store veri formu için cevaplar şöyledir.", "These are the answers for the Play Data safety form.", "هذه إجابات نموذج أمان البيانات في بلاي.", "Так отвечайте в форме Data safety в Play.") },
      { p: P5("Məlumat toplanır: Xeyr. Məlumat paylaşılır: Xeyr. Məlumat satılır: Xeyr.", "Veri toplanır: Hayır. Veri paylaşılır: Hayır. Veri satılır: Hayır.", "Data collected: No. Data shared: No. Data sold: No.", "هل تُجمع بيانات: لا. هل تُشارك: لا. هل تُباع: لا.", "Данные собираются: нет. Передаются: нет. Продаются: нет.") },
      { p: P5("Reklam yoxdur. Analitika yoxdur. Hesab yoxdur, ona görə hesab silmə də yoxdur.", "Reklam yok. Analitik yok. Hesap yok, bu yüzden hesap silme de yok.", "No ads. No analytics. No account, so there is no account deletion.", "لا إعلانات ولا تحليلات ولا حساب، لذلك لا حذف حساب.", "Нет рекламы, нет аналитики, нет аккаунта — удалять аккаунт нечего.") },
      { p: P5("Endirmə yolda şifrələnir (HTTPS). Endirdiyiniz təfsir və tərcüməni ayarlardan silə bilərsiniz.", "İndirme yolda şifrelenir (HTTPS). İndirdiğiniz tefsir ve meali ayarlardan silebilirsiniz.", "Downloads are encrypted in transit (HTTPS). You can delete a tafsir or translation in Settings.", "التنزيل مشفّر أثناء النقل (HTTPS). يمكنك حذف التفسير أو الترجمة من الإعدادات.", "Загрузка шифруется в пути (HTTPS). Тафсир и перевод удаляются в настройках.") },
    ]},
    perm: { title: P5("İcazələr", "İzinler", "Permissions", "الأذونات", "Разрешения"), blocks: [
      { p: P5("Tətbiq kamera, mikrofon, yer, kontakt, SMS, təqvim və fayl sistemindən icazə istəmir.", "Uygulama kamera, mikrofon, konum, kişiler, SMS, takvim ve dosya sistemi izni istemez.", "The app does not ask for camera, microphone, location, contacts, SMS, calendar, or file access.", "لا يطلب التطبيق الكاميرا ولا الميكروفون ولا الموقع ولا جهات الاتصال ولا الرسائل ولا التقويم ولا ملفات الجهاز.", "Приложение не просит камеру, микрофон, геолокацию, контакты, SMS, календарь и доступ к файлам.") },
      { p: P5("İnternet yalnız sizin seçdiyiniz təfsir və ya tərcüməni endirmək üçündür. Endirməsəniz oxuma internetsiz də işləyir.", "İnternet yalnızca seçtiğiniz tefsir veya meali indirmek içindir. İndirmezseniz okuma internetsiz de çalışır.", "Internet is only for downloading the tafsir or translation you choose. Reading works offline if you do not download.", "الإنترنت فقط لتنزيل التفسير أو الترجمة التي تختارها. القراءة تعمل بلا إنترنت إن لم تنزّل.", "Интернет только чтобы скачать выбранный тафсир или перевод. Чтение работает и без сети, если ничего не качать.") },
    ]},
    about: { title: P5("Tətbiq haqqında", "Uygulama hakkında", "About", "حول التطبيق", "О приложении"), blocks: [
      { p: P5("Mushafuk. Versiya 1.0.1. Mədinə məshəfi.", "Mushafuk. Sürüm 1.0.1. Medine mushafı.", "Mushafuk. Version 1.0.1. Madinah mushaf.", "مصحفك. الإصدار 1.0.1. مصحف المدينة.", "Mushafuk. Версия 1.0.1. Мусхаф Медины.") },
      { p: P5("Səhifə səhifə ərəbcə mətn, surə siyahısı, ərəbcə söz axtarışı, təfsir və tərcümə. Dil: azərbaycan, türk, ingilis, ərəb, rus.", "Sayfa sayfa Arapça metin, sure listesi, Arapça kelime arama, tefsir ve meal. Dil: Azerbaycan, Türkçe, İngilizce, Arapça, Rusça.", "Page by page Arabic text, a surah index, Arabic word search, tafsir and translation. Languages: Azerbaijani, Turkish, English, Arabic, Russian.", "نص عربي صفحةً بصفحة، وفهرس سور، وبحث عن كلمة عربية، وتفسير وترجمة. اللغات: الأذربيجانية والتركية والإنجليزية والعربية والروسية.", "Текст по страницам, список сур, поиск арабского слова, тафсир и перевод. Языки: азербайджанский, турецкий, английский, арабский, русский.") },
      { p: P5("Yaş: hər kəs. Kateqoriya: kitab və məlumat. Reklam yoxdur. Ödəniş yoxdur.", "Yaş: herkes. Kategori: kitaplar ve referans. Reklam yok. Ödeme yok.", "Age: everyone. Category: books and reference. No ads. No payments.", "العمر: للجميع. الفئة: كتب ومراجع. بلا إعلانات وبلا دفع.", "Возраст: для всех. Категория: книги и справочники. Без рекламы и платежей.") },
      { p: P5("Nibras Code · https://nibrascode.com", "Nibras Code · https://nibrascode.com", "Nibras Code · https://nibrascode.com", "Nibras Code · https://nibrascode.com", "Nibras Code · https://nibrascode.com") },
    ]},
    contact: { title: P5("Əlaqə", "İletişim", "Contact", "التواصل", "Контакт"), blocks: [
      { p: P5("Dəstək və rəy üçün: nibrascode@gmail.com", "Destek ve görüş için: nibrascode@gmail.com", "Support and feedback: nibrascode@gmail.com", "للدعم والملاحظات: nibrascode@gmail.com", "Поддержка и отзывы: nibrascode@gmail.com") },
      { p: P5("Sayt: https://nibrascode.com", "Site: https://nibrascode.com", "Website: https://nibrascode.com", "الموقع: https://nibrascode.com", "Сайт: https://nibrascode.com") },
      { p: P5("https://github.com/nihomaho9-ui/quran-medine", "https://github.com/nihomaho9-ui/quran-medine", "https://github.com/nihomaho9-ui/quran-medine", "https://github.com/nihomaho9-ui/quran-medine", "https://github.com/nihomaho9-ui/quran-medine") },
      { p: P5("Məxfilik ünvanı: https://nibrascode.com/privacy/mushafuk", "Gizlilik adresi: https://nibrascode.com/privacy/mushafuk", "Privacy URL: https://nibrascode.com/privacy/mushafuk", "رابط الخصوصية: https://nibrascode.com/privacy/mushafuk", "Адрес политики: https://nibrascode.com/privacy/mushafuk") },
    ]},
    sources: { title: P5("Mənbələr", "Kaynaklar", "Sources", "المصادر", "Источники"), blocks: [
      { p: P5("Ərəbcə mətn Tanzil Uthmani mətnidir. Səhifə düzümü və xətt Mədinə məshəfinə uyğundur.", "Arapça metin Tanzil Uthmani metnidir. Sayfa düzeni ve hat Medine mushafına uygundur.", "The Arabic text is the Tanzil Uthmani text. The page layout and script follow the Madinah mushaf.", "النص العربي نص تنزيل العثماني. تخطيط الصفحة والخط وفق مصحف المدينة.", "Арабский текст — Uthmani с Tanzil. Вёрстка и почерк — по мединскому мусхафу.") },
      { p: P5("Tərcümə və təfsirlər öz müəlliflərinə məxsusdur. Siyahıdakı ad həmin nüsxənin adıdır və mətn dəyişdirilmir.", "Meal ve tefsirler müelliflerine aittir. Listedeki ad o nüshanın adıdır ve metin değiştirilmez.", "Translations and tafsirs belong to their authors. The name in the list is the name of that copy, and the text is not altered.", "الترجمات والتفاسير لمؤلّفيها. الاسم في القائمة اسم تلك النسخة ولا يُغيَّر النص.", "Переводы и тафсиры принадлежат авторам. Имя в списке — имя этой копии, текст не меняется.") },
    ]},
  };

  let infoRes = null;
  function paintSettings() {
    sheet.replaceChildren();
    sheet.dir = uiLang() === "ar" ? "rtl" : "ltr";
    const titles = { plan: T("Oxuma planı"), notes: T("Qeydlər və əlfəcinlər"), menu: T("Ayarlar"), lang: T("Dil"), tf: T("Təfsir"), tr: T("Tərcümə"), wb: T("Söz mənaları"), ir: T("Erab") };
    const bar = el("div", "qm-page-bar");
    const bk = el("button", "qm-page-back", "‹");
    bk.type = "button";
    bk.setAttribute("aria-label", T("Əvvəlki"));
    bk.onclick = () => { if (setView === "info" && infoRes) { setView = infoRes.k; paintSettings(); } else if (setView !== "menu") { setView = "menu"; paintSettings(); } else closeAll(); };
    bar.append(bk, el("h2", "", (DOCS[setView] && L(DOCS[setView].title)) || (setView === "info" && infoRes ? (infoRes.k === "wb" ? (infoRes.id === "seraj" ? T("Sirac") : infoRes.id === "ibnqutaybah" ? T("İbn Qutəybə") : infoRes.name) : infoRes.name) : "") || titles[setView] || T("Ayarlar")), el("span", "qm-page-sp"));
    const body = el("div", "qm-scroll");
    sheet.append(bar, body);
    if (DOCS[setView]) {
      const box = el("div", "qm-legal");
      for (const block of DOCS[setView].blocks) {
        const sec = el("section", "");
        if (block.h) sec.append(el("h3", "", L(block.h)));
        const p = el("p", "");
        const text = L(block.p);
        const m = text.match(/https:\/\/\S+/);
        if (m) {
          const i = text.indexOf(m[0]);
          if (text.slice(0, i).trim()) p.append(text.slice(0, i).replace(/:\s*$/, ""));
          const a = el("a", "", m[0]); a.href = m[0]; a.target = "_blank"; a.rel = "noopener";
          p.append(a);
          if (text.slice(i + m[0].length).trim()) p.append(text.slice(i + m[0].length));
        } else p.textContent = text;
        sec.append(p);
        box.append(sec);
      }
      body.append(box);
      return;
    }
    if (setView === "info" && infoRes) { const ul = el("ul", "qm-list qm-info-page"); ul.append(resRow(infoRes)); body.append(ul); return; }
    if (setView === "lang") {
      const list = el("div", "qm-page-list");
      for (const [id, nm] of LANGS) {
        const b = el("button", "lang-opt" + (id === uiLang() ? " on" : ""), nm);
        b.type = "button";
        b.onclick = () => { localStorage.setItem("qm.lang", id); setView = "menu"; refreshUi(); };
        list.append(b);
      }
      body.append(list);
      return;
    }
    if (setView === "tf" || setView === "tr" || setView === "wb" || setView === "ir") {
      const items = LIST.filter((r) => r.k === setView);
      const sorted = setView === "tr" ? [...items].sort((a, b) => a.by.localeCompare(b.by) || a.name.localeCompare(b.name)) : items;
      const ul = el("ul", "qm-list");
      let grp = null;
      for (const r of sorted) {
        if (setView === "tr" && r.by !== grp) { grp = r.by; const g = el("li", "qm-grp", grp); g.dir = "auto"; ul.append(g); }
        ul.append(resRow(r));
      }
      body.append(ul);
      if (setView === "wb") { const pb = el("button", "qm-rb qm-wps-btn", "⚙ " + T("Söz pəncərəsi")); pb.onclick = openPopSettings; body.prepend(pb); }
      return;
    }
    if (setView === "notes") { paintNotes(body); return; }
    if (setView === "plan") { paintPlan(body); return; }
    body.append(el("p", "set-sec", T("Görünüş")));
    const look = el("div", "set-look");
    let curTheme = "current";
    try { curTheme = localStorage.getItem("qm.readTheme") || (document.documentElement.classList.contains("qm-night") ? "black" : "current"); } catch (e) {}
    if (curTheme !== "white" && curTheme !== "black") curTheme = "current";
    const themeBox = el("div", "set-card");
    const ttx = el("span", "tx");
    ttx.append(el("b", "", T("Oxuma fonu") || "خلفية القراءة"));
    themeBox.append(icEl("info"), ttx);
    const themeRow = el("div", "set-sizes");
    for (const [id, lab] of [["current", T("Cari") || "الحالي"], ["white", T("Ağ") || "أبيض"], ["black", T("Qara") || "أسود"]]) {
      const b = el("button", "set-sz" + (curTheme === id ? " on" : ""), lab);
      b.type = "button";
      b.setAttribute("aria-pressed", curTheme === id ? "true" : "false");
      b.onclick = () => {
        try { localStorage.setItem("qm.readTheme", id); localStorage.setItem("qm.night", id === "black" ? "1" : ""); } catch (e) {}
        applyLook(); paintSettings();
      };
      themeRow.append(b);
    }
    themeBox.append(themeRow);
    const sizes = el("div", "set-sizes");
    sizes.append(el("span", "set-lab", T("Mətn ölçüsü")));
    const curFs = +prefs().fs || 1;
    for (const [v, lab] of [[0.92, T("Kiçik")], [1, T("Normal")], [1.1, T("Böyük")]]) {
      const b = el("button", "set-sz" + (Math.abs(curFs - v) < 0.03 ? " on" : ""), lab);
      b.type = "button";
      b.onclick = () => { setPrefs({ fs: v }); applyLook(); paintSettings(); };
      sizes.append(b);
    }
    look.append(themeBox, sizes, card("lang", T("Dil"), langName(), () => { setView = "lang"; paintSettings(); }));
    body.append(look);
    body.append(el("p", "set-sec", T("Bölmələr")));
    const lang = uiLang();
    const root = (lang === "ar" ? "/" : "/" + lang + "/");
    const gharib = { az: "qerib/", tr: "garib/" }[lang] || "gharib/";
    const irab = lang === "az" ? "erab/" : "irab/";
    const go = (href) => () => { location.href = href; };
    const sections = el("div", "home-set");
    sections.append(
      card("book", T("Təfsir"), "", go(root + "tafsir.html")),
      card("tr", T("Tərcümələr"), "", go(root + "translations/")),
      card("book", T("Söz mənaları"), "", go(root + gharib)),
      card("book", T("Erab"), "", go(root + irab)),
      card("mark", T("Səsli qiraət"), "", go(root + "qiraat/")),
    );
    body.append(sections);
    body.append(el("p", "set-sec", T("Mənim")));
    const mine = el("div", "home-set");
    mine.append(card("mark", T("Qeydlər və əlfəcinlər"), String(Object.keys(nload().items).length), () => { nFilter = ""; setView = "notes"; paintSettings(); }), card("cal", T("Oxuma planı"), (() => { const q = pload(); if (!q) return ""; const t = pIdx(q); return t >= 0 && t < q.d.length ? T("Gün") + " " + (t + 1) + "/" + q.d.length : ""; })(), () => { planNew = false; planTab = "cal"; planMonth = null; setView = "plan"; paintSettings(); }));
    body.append(mine);
  }
  async function openSettings(focus) {
    if (!LIST.length) LIST = await (await fetch("./lib-list.json")).json();
    closePop();
    const already = back.classList.contains("qm-page") && !back.hidden;
    sheet.onpointerdown = sheet.onpointerup = null;
    sheet.className = "qm-sheet qm-set";
    back.classList.add("qm-page");
    if (focus === "tf" || focus === "tr" || focus === "wb" || focus === "ir") setView = focus;
    else if (!already || setView === "lang") setView = "menu";
    paintSettings();
    back.hidden = false;
    if (!already) { history.pushState({ qmSet: 1 }, ""); setHist = true; }
  }
  function resRow(r) {
    const li = el("li", "qm-res"); li.dataset.id = r.id;
    const tx = el("div", "qm-tx"); const nm = el("b", "", r.name); nm.dir = "auto"; const sm = el("small", "", WEB ? (r.k === "tr" ? "" : r.by) : (r.k === "tr" ? "" : r.by + " · ") + r.mb + " MB"); sm.dir = "auto";
    const bar = el("span", "qm-bar"); const fill = el("i"); bar.append(fill); bar.hidden = true; const err = el("small", "qm-err", ""); tx.append(nm, sm, bar, err);
    if (r.credit && setView !== "info") { const ib = el("button", "qm-info", "i"); ib.type = "button"; ib.setAttribute("aria-label", "Info"); const op = (e) => { if (e.target.closest(".qm-act")) return; e.stopPropagation(); e.preventDefault(); infoRes = r; setView = "info"; paintSettings(); }; ib.onclick = op; nm.after(ib); tx.style.cursor = "pointer"; tx.onclick = op; }
    else if (r.credit) { const cr = el("small", "qm-credit", T(r.credit)); cr.dir = uiLang() === "ar" ? "rtl" : "ltr"; tx.insertBefore(cr, bar); }
    const act = el("div", "qm-act"); li.append(tx, act);
    let n = 0, busy = false, ask = false;
    const draw = () => {
      const done = n >= 114, chosen = prefs()[r.k] === r.id;
      li.classList.toggle("on", done && chosen);
      bar.hidden = !(busy || (n > 0 && !done)); fill.style.width = (n / 114) * 100 + "%";
      act.replaceChildren();
      const b = (t, c, f) => { const x = el("button", "qm-rb " + c, t); x.onclick = f; act.append(x); };
      if (WEB) { b(chosen ? T("✓ Seçilib") : T("Seç"), chosen ? "sel" : "", () => { setPrefs({ [r.k]: r.id }); document.querySelectorAll(".qm-res").forEach((x) => x._draw && x._draw()); renderHome(); }); return; }
      if (busy) b(T("Dayandır"), "", () => { running[r.id] && (running[r.id].stop = true); });
      else if (!done) b(T("Endir"), "main", go);
      else if (ask) { b(T("Sil"), "danger", del); b("✕", "", () => { ask = false; draw(); }); }
      else { b(chosen ? T("✓ Seçilib") : T("Seç"), chosen ? "sel" : "", () => { setPrefs({ [r.k]: r.id }); document.querySelectorAll(".qm-res").forEach((x) => x._draw && x._draw()); renderHome(); }); b("🗑", "ghost", () => { ask = true; draw(); }); }
    };
    li._draw = draw;
    const go = async () => { busy = true; err.textContent = ""; draw(); try { await download(r, (k) => { n = k; draw(); }); if (!prefs()[r.k] || prefs()[r.k] !== r.id) setPrefs({ [r.k]: r.id }); } catch (e) { if (e.message !== "stopped") err.textContent = T("Alınmadı. İnterneti yoxlayın."); } busy = false; n = await status(r.id); document.querySelectorAll(".qm-res").forEach((x) => x._draw && x._draw()); renderHome(); };
    const del = async () => { await remove(r.id); n = 0; ask = false; if (prefs()[r.k] === r.id) setPrefs({ [r.k]: "" }); draw(); renderHome(); };
    status(r.id).then((v) => { n = v; draw(); });
    draw();
    return li;
  }

  /* ---------- ayah text, bookmarks, toast ---------- */
  let textP = null;
  // Arabic text: kept in IndexedDB after the first load so share / copy / full screen work offline
  // Tanzil puts the 4-word basmala before ayah 1 of every surah except 1 and 9: it is not part of the ayah
  const forFont = (t) => t.replace(/\u06DF/g, "\u06E0"); // the Hafs font has no glyph for U+06DF (small high rounded zero)
  const parseText = (t) => { const m = {}; for (const l of t.split("\n")) { const [x, y, z] = l.split("|"); if (z) m[x + ":" + y] = (y === "1" && x !== "1" && x !== "9" ? z.trim().split(/\s+/).slice(4).join(" ") : z).trim(); } return m; };
  const loadText = async () => {
    const saved = await get("quran:txt").catch(() => null);
    if (saved) return parseText(saved);
    const t = await (await fetch("./quran-uthmani.txt")).text();
    put("quran:txt", t).catch(() => {});
    return parseText(t);
  };
  const ayahText = (s, a) => (textP ||= loadText().catch((e) => { textP = null; return {}; })).then((m) => m[s + ":" + a] || "");
  const marks = () => { try { return JSON.parse(localStorage.getItem("qm.bookmarks") || "[]"); } catch (e) { return []; } };
  const toggleMark = (k) => { const m = marks(); const i = m.indexOf(k); i >= 0 ? m.splice(i, 1) : m.push(k); localStorage.setItem("qm.bookmarks", JSON.stringify(m)); return i < 0; };
  /* ---------- personal notes, colours and folders (one store with the bookmarks) ---------- */
  const NCOL = ["#2f6b52", "#c4a56e", "#a8443a", "#2c5d8a", "#6c4a8a"];
  const NDEF = [["zikr", "Zikr"], ["dua", "Dualar"], ["umid", "Ümid"], ["ders", "Dərs"]];
  const nload = () => {
    let d = null; try { d = JSON.parse(localStorage.getItem("qm.notes") || "null"); } catch (e) {}
    if (!d || typeof d !== "object" || !d.items) d = { v: 1, folders: NDEF.map(([id]) => ({ id })), items: {} };
    if (!Array.isArray(d.folders)) d.folders = [];
    for (const k of marks()) if (!d.items[k]) d.items[k] = { n: "", c: 1, f: "", t: Date.now() }; // older plain bookmarks
    return d;
  };
  const nsave = (d) => { localStorage.setItem("qm.notes", JSON.stringify(d)); localStorage.setItem("qm.bookmarks", JSON.stringify(Object.keys(d.items))); paintMarks(); };
  const fname = (f) => f.name || T((NDEF.find((x) => x[0] === f.id) || [, f.id])[1]);
  const ncol = (it) => NCOL[it && it.c >= 0 && it.c < NCOL.length ? it.c : 1];
  const nsort = (d) => Object.keys(d.items).sort((x, y) => (d.items[y].t || 0) - (d.items[x].t || 0));
  function paintMarks() {
    const it = nload().items;
    document.querySelectorAll("#page .ay[data-k]").forEach((sp) => { const v = it[sp.dataset.k]; if (v) { sp.classList.add("qm-mk"); sp.style.setProperty("--mc", ncol(v)); } else if (sp.classList.contains("qm-mk")) { sp.classList.remove("qm-mk"); sp.style.removeProperty("--mc"); } });
  }
  window.QM_MARKS = paintMarks;
  const nDate = (t) => {
    const d = new Date(t), now = new Date(), day = 864e5, z = (x) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
    const diff = Math.round((z(now) - z(d)) / day);
    if (diff === 0) return T("Bu gün"); if (diff === 1) return T("Dünən");
    const loc = { az: "az", tr: "tr", en: "en-GB", ar: "ar", ru: "ru" }[uiLang()] || "az";
    try { return d.toLocaleDateString(loc, { day: "numeric", month: "short" }); } catch (e) { return d.getDate() + "." + (d.getMonth() + 1); }
  };
  // the bottom panel: note, colour, folder (opened from the bookmark button of the ayah sheet and from the list)
  function openNote(k, done) {
    const d0 = nload(); const was = d0.items[k];
    const st = { n: was ? was.n || "" : "", c: was ? was.c : 0, f: was ? was.f || "" : "" };
    const ov = el("div", "qm-wps qm-np"); const card = el("div", "qm-wps-card"); ov.append(card); card.dir = uiLang() === "ar" ? "rtl" : "ltr";
    const close = () => { ov.remove(); done && done(); };
    ov.onclick = (e) => { if (e.target === ov) close(); };
    const [s, a] = k.split(":").map(Number);
    let ta, adding = false;
    const draw = () => {
      if (ta) st.n = ta.value;
      const d = nload(); card.replaceChildren();
      card.append(el("i", "qm-np-grab"));
      const h = el("div", "qm-wps-h"); h.append(el("b", "", NAMES[s - 1] + " · " + a)); const x = icon("close", T("Bağla")); x.onclick = close; h.append(x); card.append(h);
      card.append(el("p", "qm-np-l", T("Qeydim")));
      ta = el("textarea", "qm-np-ta"); ta.value = st.n; ta.placeholder = T("Bu ayə üçün qeydiniz…"); ta.dir = "auto"; ta.maxLength = 4000; card.append(ta);
      card.append(el("p", "qm-np-l", T("Rəng")));
      const dots = el("div", "qm-np-dots");
      NCOL.forEach((c, i) => { const b = el("button", "qm-np-dot" + (st.c === i ? " on" : "")); b.type = "button"; b.style.background = c; b.setAttribute("aria-label", T("Rəng") + " " + (i + 1)); b.onclick = () => { st.c = i; draw(); }; dots.append(b); });
      card.append(dots);
      card.append(el("p", "qm-np-l", T("Qovluq")));
      const fl = el("div", "qm-np-chips");
      for (const f of d.folders) { const b = el("button", "qm-np-chip" + (st.f === f.id ? " on" : ""), fname(f)); b.type = "button"; b.dir = "auto"; b.onclick = () => { st.f = st.f === f.id ? "" : f.id; draw(); }; fl.append(b); }
      if (adding) {
        const inp = el("input", "qm-np-in"); inp.placeholder = T("Qovluq adı"); inp.maxLength = 30; inp.dir = "auto";
        const ok = el("button", "qm-np-chip on", "✓"); ok.type = "button";
        const add = () => { const v = inp.value.trim(); if (!v) { adding = false; draw(); return; } const dd = nload(); const id = "f" + Date.now().toString(36); dd.folders.push({ id, name: v }); nsave(dd); st.f = id; adding = false; draw(); };
        ok.onclick = add; inp.onkeydown = (e) => { if (e.key === "Enter") add(); if (e.key === "Escape") { adding = false; draw(); } };
        fl.append(inp, ok); setTimeout(() => inp.focus(), 0);
      } else { const nb = el("button", "qm-np-chip add", "＋ " + T("Yeni")); nb.type = "button"; nb.onclick = () => { adding = true; draw(); }; fl.append(nb); }
      const mg = el("button", "qm-np-chip add", "✎"); mg.type = "button"; mg.setAttribute("aria-label", T("Qovluqlar")); mg.title = T("Qovluqlar"); mg.onclick = () => { st.n = ta.value; openFolders(draw); }; fl.append(mg);
      card.append(fl);
      const row = el("div", "qm-np-row");
      if (was) { const del = el("button", "qm-rb danger", T("Sil")); del.onclick = () => { const dd = nload(); delete dd.items[k]; nsave(dd); toast(T("Əlfəcindən silindi")); close(); }; row.append(del); }
      const sv = el("button", "qm-rb main qm-np-save", T("Yadda saxla")); sv.onclick = () => { const dd = nload(); dd.items[k] = { n: ta.value.trim(), c: st.c, f: dd.folders.some((f) => f.id === st.f) ? st.f : "", t: was ? (was.t || Date.now()) : Date.now(), u: Date.now() }; nsave(dd); toast(was ? T("Yadda saxlandı") : T("Əlfəcinə əlavə olundu")); close(); };
      row.append(sv); card.append(row);
    };
    document.body.append(ov); draw();
  }
  // rename / delete own folders (also the default ones)
  function openFolders(after) {
    const ov = el("div", "qm-wps qm-np qm-np2"); const card = el("div", "qm-wps-card"); ov.append(card); card.dir = uiLang() === "ar" ? "rtl" : "ltr";
    const close = () => { ov.remove(); after && after(); };
    ov.onclick = (e) => { if (e.target === ov) close(); };
    let ask = null;
    const draw = () => {
      const d = nload(); card.replaceChildren();
      const h = el("div", "qm-wps-h"); h.append(el("b", "", T("Qovluqlar"))); const x = icon("close", T("Bağla")); x.onclick = close; h.append(x); card.append(h);
      const ul = el("div", "qm-np-fl");
      for (const f of d.folders) {
        const r = el("div", "qm-np-fr"); const inp = el("input", "qm-np-in"); inp.value = fname(f); inp.maxLength = 30; inp.dir = "auto";
        inp.onchange = () => { const v = inp.value.trim(); const dd = nload(); const g = dd.folders.find((z) => z.id === f.id); if (g && v) { g.name = v; nsave(dd); } else draw(); };
        const n = Object.values(d.items).filter((it) => it.f === f.id).length;
        r.append(inp, el("small", "", n + " " + T("ayə")));
        if (ask === f.id) { const y = el("button", "qm-rb danger", T("Sil")); y.onclick = () => { const dd = nload(); dd.folders = dd.folders.filter((z) => z.id !== f.id); for (const it of Object.values(dd.items)) if (it.f === f.id) it.f = ""; nsave(dd); ask = null; draw(); }; const no = el("button", "qm-rb", "✕"); no.onclick = () => { ask = null; draw(); }; r.append(y, no); }
        else { const b = el("button", "qm-rb ghost", "🗑"); b.setAttribute("aria-label", T("Sil")); b.onclick = () => { ask = f.id; draw(); }; r.append(b); }
        ul.append(r);
      }
      card.append(ul);
      if (ask) card.append(el("p", "qm-wps-tip", T("Qovluq silinsə, ayələr və qeydlər qalır.")));
      const nr = el("div", "qm-np-fr"); const ni = el("input", "qm-np-in"); ni.placeholder = T("Qovluq adı"); ni.maxLength = 30; ni.dir = "auto";
      const nb = el("button", "qm-rb main", "＋ " + T("Yeni")); const add = () => { const v = ni.value.trim(); if (!v) return; const dd = nload(); dd.folders.push({ id: "f" + Date.now().toString(36), name: v }); nsave(dd); draw(); };
      nb.onclick = add; ni.onkeydown = (e) => { if (e.key === "Enter") add(); }; nr.append(ni, nb); card.append(nr);
    };
    document.body.append(ov); draw();
  }
  let nFilter = "";
  function paintNotes(body) {
    const d = nload(); quranFont();
    if (nFilter && nFilter !== "-" && !d.folders.some((f) => f.id === nFilter)) nFilter = "";
    const keys = nsort(d);
    const chips = el("div", "qm-np-chips qm-nl-chips");
    const chip = (id, label) => { const b = el("button", "qm-np-chip" + (nFilter === id ? " on" : ""), label); b.type = "button"; b.dir = "auto"; b.onclick = () => { nFilter = id; paintSettings(); }; chips.append(b); };
    chip("", T("Hamısı") + " · " + keys.length);
    for (const f of d.folders) { const n = keys.filter((k) => d.items[k].f === f.id).length; chip(f.id, fname(f) + (n ? " · " + n : "")); }
    if (keys.some((k) => !d.items[k].f)) chip("-", T("Qovluqsuz"));
    const mg = el("button", "qm-np-chip add", "✎ " + T("Qovluqlar")); mg.type = "button"; mg.onclick = () => openFolders(() => paintSettings()); chips.append(mg);
    body.append(chips);
    const shown = keys.filter((k) => !nFilter || (nFilter === "-" ? !d.items[k].f : d.items[k].f === nFilter));
    if (!shown.length) { const e = el("div", "qm-nl-empty"); e.append(el("p", "", keys.length ? T("Bu qovluqda ayə yoxdur") : T("Hələ heç nə saxlanmayıb"))); if (!keys.length) e.append(el("small", "", T("Ayəyə toxunun, sonra əlfəcin düyməsini basın."))); body.append(e); }
    const list = el("div", "qm-nl");
    for (const k of shown) {
      const it = d.items[k]; const [s, a] = k.split(":").map(Number); const f = d.folders.find((z) => z.id === it.f);
      const c = el("div", "qm-nl-it"); c.style.setProperty("--c", ncol(it)); c.dataset.k = k; c.setAttribute("role", "button"); c.tabIndex = 0;
      const top = el("div", "qm-nl-top"); top.append(el("b", "", NAMES[s - 1] + " " + a));
      if (f) { const tg = el("span", "qm-nl-tag", fname(f)); tg.style.background = ncol(it); tg.dir = "auto"; top.append(tg); }
      top.append(el("span", "qm-nl-sp"), el("small", "", nDate(it.u || it.t)));
      const ed = el("button", "qm-rb ghost qm-nl-ed", "✎"); ed.setAttribute("aria-label", T("Redaktə et")); ed.onclick = (e) => { e.stopPropagation(); openNote(k, () => paintSettings()); }; top.append(ed);
      const ar = el("p", "qm-nl-ar"); ar.dir = "rtl"; ar.lang = "ar"; ayahText(s, a).then((t) => { ar.textContent = forFont(t) + " " + AR_DIG(a); });
      c.append(top, ar);
      if (it.n) { const n = el("p", "qm-nl-n", it.n); n.dir = "auto"; c.append(n); }
      const go = () => { closeAll(); if (back.classList.contains("qm-page")) closeAll(); if (back.classList.contains("qm-page")) closeSettingsPage(); setTimeout(() => window.QM_JUMP && window.QM_JUMP(k), 0); };
      c.onclick = go; c.onkeydown = (e) => { if (e.key === "Enter") go(); };
      list.append(c);
    }
    body.append(list);
    const io = el("div", "qm-nl-io");
    const ex = el("button", "qm-rb", "⤓ " + T("İxrac (JSON)")); ex.onclick = () => { const blob = new Blob([JSON.stringify(Object.assign({ app: "mushafuk-notes" }, nload(), { hifz: hload(), plan: pload() }), null, 1)], { type: "application/json" }); const u = URL.createObjectURL(blob); const l = el("a"); l.href = u; l.download = "mushafuk-qeydler.json"; document.body.append(l); l.click(); l.remove(); setTimeout(() => URL.revokeObjectURL(u), 3000); };
    const im = el("button", "qm-rb", "⤒ " + T("İdxal")); const fi = el("input"); fi.type = "file"; fi.accept = "application/json,.json"; fi.hidden = true;
    im.onclick = () => fi.click();
    fi.onchange = async () => { try { const j = JSON.parse(await fi.files[0].text()); if (!j || typeof j.items !== "object") throw 0; const dd = nload(); for (const f of j.folders || []) { if (!f || !f.id) continue; const g = dd.folders.find((z) => z.id === String(f.id)); if (g) { if (f.name) g.name = String(f.name).slice(0, 30); } else dd.folders.push({ id: String(f.id), ...(f.name ? { name: String(f.name).slice(0, 30) } : {}) }); } let n = 0; for (const [k, v] of Object.entries(j.items)) { const m = /^(\d+):(\d+)$/.exec(k); if (!m || +m[1] < 1 || +m[1] > 114 || +m[2] < 1 || +m[2] > AYAHS[+m[1] - 1] || !v) continue; dd.items[k] = { n: String(v.n || "").slice(0, 4000), c: +v.c >= 0 && +v.c < NCOL.length ? +v.c : 1, f: String(v.f || ""), t: +v.t || Date.now(), ...(v.u ? { u: +v.u } : {}) }; n++; } nsave(dd); if (j.hifz && typeof j.hifz === "object") { const h = hload(); for (const [k, v] of Object.entries(j.hifz.mem || {})) if (/^\d+:\d+$/.test(k)) h.mem[k] = +v || Date.now(); for (const [k, v] of Object.entries(j.hifz.cnt || {})) if (/^\d+:\d+$/.test(k) && +v > 0) h.cnt[k] = Math.round(+v); if (+j.hifz.target > 0) h.target = Math.round(+j.hifz.target); if (["blur", "first", "open"].includes(j.hifz.mode)) h.mode = j.hifz.mode; const L = j.hifz.last; if (!h.last && L && +L.s >= 1 && +L.s <= 114 && +L.from >= 1 && +L.to >= +L.from && +L.to <= AYAHS[+L.s - 1]) h.last = { s: +L.s, from: +L.from, to: +L.to, i: Math.min(Math.max(+L.i || +L.from, +L.from), +L.to) }; hsave(h); } if (j.plan && Array.isArray(j.plan.d) && /^\d{4}-\d{2}-\d{2}$/.test(j.plan.start) && j.plan.d.every((seg) => Array.isArray(seg) && seg.every((r) => Array.isArray(r) && r.length === 2 && +r[0] >= 1 && +r[1] <= 604 && +r[0] <= +r[1]))) psave({ v: 1, start: j.plan.start, p0: +j.plan.p0 || 1, mode: j.plan.mode === "juz" ? "juz" : "days", d: j.plan.d.map((seg) => seg.map((r) => [+r[0], +r[1]])), done: j.plan.done && typeof j.plan.done === "object" ? j.plan.done : {}, moved: j.plan.moved && typeof j.plan.moved === "object" ? j.plan.moved : {}, read: Array.isArray(j.plan.read) ? j.plan.read.map(Number).filter((x) => x >= 1 && x <= 604) : [] }); toast(T("İdxal olundu") + ": " + n); paintSettings(); } catch (e) { toast(T("Alınmadı")); } };
    io.append(ex, im, fi); body.append(io);
  }
  /* ---------- Hifz (memorisation): hidden ayahs, repetition counter, progress ---------- */
  const hload = () => { let d = null; try { d = JSON.parse(localStorage.getItem("qm.hifz") || "null"); } catch (e) {} d = d && typeof d === "object" ? d : {}; d.mem ||= {}; d.cnt ||= {}; d.target = +d.target > 0 ? +d.target : 10; d.mode = ["blur", "first", "open"].includes(d.mode) ? d.mode : "blur"; return d; };
  const hsave = (d) => localStorage.setItem("qm.hifz", JSON.stringify(d));
  const hzEl = el("div", "qm-hz"); hzEl.hidden = true; document.body.appendChild(hzEl);
  let hz = null; // { s, from, to, i, open:Set }
  const firstLetters = (t) => t.split(/\s+/).map((w) => { const m = w.match(/^[^\u0621-\u064A\u0671-\u06D3]*[\u0621-\u064A\u0671-\u06D3][\u064B-\u065F\u0670\u06D6-\u06ED]*/); return m && /[\u0621-\u064A\u0671-\u06D3]/.test(w) ? m[0] + "ـ" : w; }).join(" ");
  const memCount = (d, s) => { let n = 0; for (let a = 1; a <= AYAHS[s - 1]; a++) if (d.mem[s + ":" + a]) n++; return n; };
  function hzHead(title, sub, extra) {
    const h = el("div", "qm-full-h qm-hz-h");
    const bk = el("button", "qm-page-back", "‹"); bk.type = "button"; bk.setAttribute("aria-label", T("Bağla")); bk.onclick = () => { hzEl.hidden = true; hz = null; };
    const t = el("div", "qm-full-t"); t.append(el("small", "", sub), el("b", "", title));
    h.append(bk, t, el("span", "qm-nl-sp"), ...(extra || []));
    return h;
  }
  function pageAyahRange() {
    const keys = [];
    for (const el of document.querySelectorAll("#page .ay[data-k]")) {
      const k = el.dataset.k;
      if (k && k.includes(":") && !keys.includes(k)) keys.push(k);
    }
    if (!keys.length) {
      const page = window.QM_PAGE && window.QM_PAGE();
      if (page && page.keys) for (const k of page.keys) if (k && !keys.includes(k)) keys.push(k);
    }
    if (!keys.length) return null;
    const parts = keys.map((k) => k.split(":").map(Number)).filter((p) => p[0] >= 1 && p[1] >= 1);
    if (!parts.length) return null;
    const s = parts[0][0];
    const same = parts.filter((p) => p[0] === s);
    return { s, from: same[0][1], to: same[same.length - 1][1] };
  }
  function openHifz(s, a, toA) {
    if (!s) {
      // header: always the open mushaf page (DOM keys), never an old Fatihə last-session
      const r = pageAyahRange();
      if (r) return hifzPick(r.s, r.from, r.to);
      const d = hload(); const L = d.last;
      if (L && L.s) { hz = { s: L.s, from: L.from, to: L.to, i: L.i || L.from, open: new Set() }; return paintHz(); }
      return hifzPick(1, 1);
    }
    hifzPick(s, a || 1, toA);
  }
  function hzShow() { hzEl.hidden = false; hzEl.dir = uiLang() === "ar" ? "rtl" : "ltr"; }
  // choose surah and ayah range
  function hifzPick(s, a, toA) {
    quranFont(); hzEl.replaceChildren(); hzShow();
    const prog = icon("hz", T("İrəliləyiş")); prog.onclick = hifzProgress;
    hzEl.append(hzHead(T("Hifz"), T("Aralıq seçin"), [prog]));
    const b = el("div", "qm-hz-b");
    const sel = el("select", "qm-pick qm-hz-sel"); NAMES.forEach((n, i) => { const o = el("option", "", (i + 1) + ". " + n); o.value = i + 1; sel.append(o); }); sel.value = s;
    const fr = el("input", "qm-np-in"), to = el("input", "qm-np-in"); for (const x of [fr, to]) { x.type = "number"; x.inputMode = "numeric"; x.min = 1; }
    const fix = () => { const max = AYAHS[sel.value - 1]; fr.max = to.max = max; let f = Math.min(Math.max(1, +fr.value || 1), max), t = Math.min(Math.max(f, +to.value || f), max); fr.value = f; to.value = t; info.textContent = (t - f + 1) + " " + T("ayə") + " · " + memCount(hload(), +sel.value) + "/" + max + " " + T("əzbərlənib"); };
    const info = el("p", "qm-wps-tip");
    fr.value = a; to.value = toA != null ? toA : Math.min(AYAHS[s - 1], a + 4);
    sel.onchange = () => { fr.value = 1; to.value = Math.min(AYAHS[sel.value - 1], 5); fix(); }; fr.onchange = to.onchange = fix;
    const row = el("div", "qm-np-fr"); const l1 = el("label", "qm-hz-lb", T("Ayədən")); const l2 = el("label", "qm-hz-lb", T("Ayəyə")); l1.append(fr); l2.append(to); row.append(l1, l2);
    const go = el("button", "qm-rb main qm-hz-go", "▶ " + T("Başla")); go.onclick = () => { fix(); const open = new Set(); const mode = hload().mode; if (mode !== "open") open.add(+fr.value); hz = { s: +sel.value, from: +fr.value, to: +to.value, i: +fr.value, open }; paintHz(); };
    b.append(el("p", "qm-np-l", T("Surə")), sel, row, info, go);
    hzEl.append(b); fix();
  }
  async function paintHz() {
    const d = hload(); const { s, from, to } = hz; d.last = { s, from, to, i: hz.i }; hsave(d);
    await quranFont(); const txt = await textP_get();
    if (!hz || hz.s !== s) return;
    hzEl.replaceChildren(); hzShow();
    const prog = icon("hz", T("İrəliləyiş")); prog.onclick = hifzProgress;
    const pick = icon("cmp", T("Aralıq seçin")); pick.onclick = () => hifzPick(s, from); pick.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h10M4 17h6"/></svg>';
    hzEl.append(hzHead(T("Ayə") + " " + from + (to > from ? "–" + to : ""), T("Hifz") + " · " + NAMES[s - 1], [pick, prog]));
    const chips = el("div", "qm-np-chips qm-hz-modes");
    for (const [m, lb] of [["blur", T("Gizlət: bulanıq")], ["first", T("İlk hərf")], ["open", T("Hamısı açıq")]]) { const c = el("button", "qm-np-chip" + (d.mode === m ? " on" : ""), lb); c.type = "button"; c.onclick = () => { const dd = hload(); dd.mode = m; hsave(dd); hz.open.clear(); paintHz(); }; chips.append(c); }
    hzEl.append(chips);
    const b = el("div", "qm-hz-b"); const list = el("div", "qm-hz-list");
    for (let a = from; a <= to; a++) {
      const k = s + ":" + a; const raw = forFont(txt[k] || "");
      const hidden = d.mode !== "open" && a >= hz.i && !hz.open.has(a);
      const p = el("p", "qm-hz-ay" + (a === hz.i ? " cur" : "") + (hidden && d.mode === "blur" ? " blur" : "") + (d.mem[k] ? " mem" : ""));
      p.dir = "rtl"; p.lang = "ar"; p.dataset.a = a;
      p.textContent = (hidden && d.mode === "first" ? firstLetters(raw) : raw) + " " + AR_DIG(a);
      p.onclick = () => {
        if (a !== hz.i) { hz.i = a; if (d.mode !== "open") hz.open.add(a); }
        else if (d.mode !== "open") { hz.open.has(a) ? hz.open.delete(a) : hz.open.add(a); }
        paintHz();
      };
      list.append(p);
    }
    const tip = el("p", "qm-wps-tip qm-hz-tip", d.mode === "open" ? T("Ayəyə toxunub onu seçin") : T("Açmaq və ya yenidən gizlətmək üçün ayəyə toxunun"));
    const k = s + ":" + hz.i, n = d.cnt[k] || 0, tg = d.target;
    const cnt = el("div", "qm-hz-cnt");
    const mi = el("button", "qm-hz-pm", "−"), pl = el("button", "qm-hz-pm", "＋"); mi.setAttribute("aria-label", "−1"); pl.setAttribute("aria-label", "+1");
    const ring = el("div", "qm-hz-ring" + (n >= tg ? " done" : "")); ring.style.setProperty("--p", Math.min(1, n / tg) * 360 + "deg"); ring.append(el("b", "", n + "/" + tg));
    const setN = (v) => { const dd = hload(); dd.cnt[k] = Math.max(0, v); if (!dd.cnt[k]) delete dd.cnt[k]; hsave(dd); if (v === tg) toast(T("Hədəfə çatdınız")); paintHz(); };
    mi.onclick = () => setN(n - 1); pl.onclick = () => setN(n + 1); ring.onclick = () => setN(n + 1);
    cnt.append(mi, ring, pl);
    const cap = el("p", "qm-hz-cap", T("Təkrar sayı") + " · " + T("Ayə") + " " + hz.i);
    const tgr = el("div", "qm-np-chips qm-hz-tg"); tgr.append(el("span", "qm-hz-lb", T("Hədəf") + ":"));
    for (const v of [3, 5, 10, 20, 40]) { const c = el("button", "qm-np-chip" + (tg === v ? " on" : ""), String(v)); c.type = "button"; c.onclick = () => { const dd = hload(); dd.target = v; hsave(dd); paintHz(); }; tgr.append(c); }
    const ci = el("input", "qm-np-in qm-hz-ti"); ci.type = "number"; ci.min = 1; ci.max = 999; ci.inputMode = "numeric"; ci.placeholder = "…"; if (![3, 5, 10, 20, 40].includes(tg)) ci.value = tg;
    ci.onchange = () => { const v = Math.round(+ci.value); if (v >= 1 && v <= 999) { const dd = hload(); dd.target = v; hsave(dd); paintHz(); } }; tgr.append(ci);
    const memB = el("button", "qm-rb qm-hz-mem" + (d.mem[k] ? " on" : ""), d.mem[k] ? "✓ " + T("Əzbərlənib") : T("Əzbərlədim"));
    memB.onclick = () => { const dd = hload(); if (dd.mem[k]) delete dd.mem[k]; else dd.mem[k] = Date.now(); hsave(dd); paintHz(); };
    const nx = el("button", "qm-rb main qm-hz-next", T("Növbəti ayə")); nx.disabled = hz.i >= to;
    nx.onclick = () => { if (hz.i < to) { hz.i++; hz.open.clear(); if (d.mode !== "open") hz.open.add(hz.i); paintHz(); } };
    const acts = el("div", "qm-np-row"); acts.append(memB, nx);
    b.append(list, tip, cnt, cap, tgr, acts); hzEl.append(b);
    const curEl = list.querySelector(".cur"); if (curEl) curEl.scrollIntoView({ block: "nearest" });
  }
  const textP_get = () => (textP ||= loadText().catch(() => { textP = null; return {}; }));
  function hifzProgress() {
    const d = hload(); hzEl.replaceChildren(); hzShow();
    hzEl.append(hzHead(T("Mənim irəliləyişim"), T("Hifz")));
    const b = el("div", "qm-hz-b");
    const total = AYAHS.reduce((x, y) => x + y, 0); let m = 0; const per = AYAHS.map((_, i) => { const c = memCount(d, i + 1); m += c; return c; });
    const tc = el("div", "qm-hz-card main"); tc.append(el("p", "qm-np-l", T("Cəmi")));
    const r = el("div", "qm-hz-row"); r.append(el("b", "qm-hz-big", String(m)), el("small", "", T("ayə əzbərlənib") + " · " + (m / total * 100).toFixed(m && m / total < 0.01 ? 2 : 1) + "%")); tc.append(r, hzBar(m / total)); b.append(tc);
    const order = AYAHS.map((_, i) => i).sort((x, y) => (per[y] > 0) - (per[x] > 0) || x - y);
    for (const i of order) {
      const c = el("button", "qm-hz-card"); c.type = "button"; c.dataset.s = i + 1;
      const rr = el("div", "qm-hz-row"); rr.append(el("b", "", (i + 1) + ". " + NAMES[i]), el("span", "qm-nl-sp"), el("small", "", per[i] + "/" + AYAHS[i]));
      c.append(rr, hzBar(per[i] / AYAHS[i])); c.onclick = () => { const fa = Array.from({ length: AYAHS[i] }, (_, j) => j + 1).find((a) => !d.mem[(i + 1) + ":" + a]) || 1; hifzPick(i + 1, fa); };
      b.append(c);
    }
    hzEl.append(b);
  }
  const hzBar = (f) => { const x = el("span", "qm-hz-bar"); const i = el("i"); i.style.width = Math.max(0, Math.min(1, f)) * 100 + "%"; if (f > 0 && f < 1) i.className = "part"; x.append(i); return x; };
  /* ---------- Reading plan (khatm): calendar, daily page ranges, missed-day redistribution ---------- */
  const PJUZ = [1, 22, 42, 62, 82, 102, 121, 142, 162, 182, 201, 222, 242, 262, 282, 302, 322, 342, 362, 382, 402, 422, 442, 462, 482, 502, 522, 542, 562, 582];
  const PREAD_MS = 15000; // a page counts as read after it stays on screen this long
  let pmapP = null; const pmap = () => (pmapP ||= fetch("./yazi-ayahs.json").then((r) => r.json()).catch(() => { pmapP = null; return {}; }));
  const pload = () => { try { const p = JSON.parse(localStorage.getItem("qm.plan") || "null"); return p && Array.isArray(p.d) ? p : null; } catch (e) { return null; } };
  const psave = (p) => { if (p) localStorage.setItem("qm.plan", JSON.stringify(p)); else localStorage.removeItem("qm.plan"); };
  const ymd = (d) => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  const today = () => window.QM_TODAY || ymd(new Date());
  const dnum = (s) => { const [y, m, d] = s.split("-").map(Number); return Date.UTC(y, m - 1, d) / 864e5; };
  const daddPlan = (s, n) => { const t = new Date((dnum(s) + n) * 864e5); return t.getUTCFullYear() + "-" + String(t.getUTCMonth() + 1).padStart(2, "0") + "-" + String(t.getUTCDate()).padStart(2, "0"); };
  const juzOf = (pg) => { let j = 0; for (let i = 0; i < 30; i++) if (PJUZ[i] <= pg) j = i; return j; };
  // d: one entry per day, each a list of [from,to] page segments
  function makePlan(start, p0, mode, days) {
    const d = [];
    if (mode === "juz") { for (let j = juzOf(p0); j < 30; j++) d.push([[j === juzOf(p0) ? p0 : PJUZ[j], j < 29 ? PJUZ[j + 1] - 1 : 604]]); }
    else { const tot = 604 - p0 + 1; days = Math.max(1, Math.min(days, tot)); for (let i = 0; i < days; i++) { const a = p0 + Math.floor((i * tot) / days), b = p0 + Math.floor(((i + 1) * tot) / days) - 1; d.push([[a, b]]); } }
    return { v: 1, start, p0, mode, d, done: {}, moved: {}, read: [] };
  }
  const segPages = (seg) => { const o = []; for (const [a, b] of seg) for (let x = a; x <= b; x++) o.push(x); return o; };
  const toSegs = (pages) => { const o = []; for (const x of pages) { const l = o[o.length - 1]; if (l && l[1] === x - 1) l[1] = x; else o.push([x, x]); } return o; };
  const pIdx = (p) => dnum(today()) - dnum(p.start);
  const dayDone = (p, i) => { if (p.done[i]) return true; const pg = segPages(p.d[i]); return pg.length > 0 && pg.every((x) => p.read.includes(x)); };
  const dayState = (p, i) => { const t = pIdx(p); if (dayDone(p, i)) return "d"; if (p.moved[i]) return "v"; if (i < t) return "m"; if (i === t) return "t"; return "u"; };
  const pStats = (p) => { let rd = 0, ms = 0; const all = new Set(); p.d.forEach((seg, i) => { const s = dayState(p, i); if (s === "d") { rd++; segPages(seg).forEach((x) => all.add(x)); } if (s === "m") ms++; }); p.read.forEach((x) => all.add(x)); const U = new Set(); p.d.forEach((seg, i) => { if (!p.moved[i] || p.done[i]) segPages(seg).forEach((x) => U.add(x)); }); const tot = U.size; let got = 0; for (const x of U) if (all.has(x)) got++; return { rd, ms, pct: tot ? Math.round((got / tot) * 100) : 0 }; };
  // pages of missed days + not-done pages from today on, spread evenly over the days left
  function redistribute(p) {
    const t = Math.max(0, pIdx(p)); if (t >= p.d.length) return false;
    const pages = new Set();
    p.d.forEach((seg, i) => { if ((i < t && dayState(p, i) === "m") || (i >= t && !dayDone(p, i))) segPages(seg).forEach((x) => { if (!p.read.includes(x)) pages.add(x); }); });
    const L = [...pages].sort((a, b) => a - b); const left = []; for (let i = t; i < p.d.length; i++) if (!dayDone(p, i)) left.push(i);
    if (!left.length) return false;
    p.d.forEach((seg, i) => { if (i < t && dayState(p, i) === "m") { p.moved[i] = 1; } });
    left.forEach((i, k) => { p.d[i] = toSegs(L.slice(Math.floor((k * L.length) / left.length), Math.floor(((k + 1) * L.length) / left.length))); });
    psave(p); return true;
  }
  let seenT = 0;
  window.QM_SEEN = (n) => { clearTimeout(seenT); const p = pload(); if (!p) return; seenT = setTimeout(() => { const cur = window.QM_PAGE && window.QM_PAGE(); const gate = document.getElementById("gate"); if (!cur || cur.n !== n || (gate && !gate.hidden) || document.hidden) return; markRead(n); }, PREAD_MS); };
  function markRead(n) { const p = pload(); if (!p || p.read.includes(n)) return; if (!p.d.some((seg) => segPages(seg).includes(n))) return; const before = p.d.map((_, i) => dayDone(p, i)); p.read.push(n); p.read.sort((a, b) => a - b); psave(p); const i = p.d.findIndex((seg, k) => !before[k] && dayDone(p, k)); if (i >= 0) toast(T("Gün") + " " + (i + 1) + " · " + T("Oxundu") + " ✓"); }
  window.QM_MARKREAD = markRead;
  const locOf = () => ({ az: "az", tr: "tr", en: "en-GB", ar: "ar", ru: "ru" }[uiLang()] || "az");
  const AZM = ["yanvar", "fevral", "mart", "aprel", "may", "iyun", "iyul", "avqust", "sentyabr", "oktyabr", "noyabr", "dekabr"], AZW = ["B", "B.e", "Ç.a", "Ç", "C.a", "C", "Ş"];
  const fmtD = (s, o) => { const [y, m, d] = s.split("-").map(Number);
    if (uiLang() === "az") { if (o.weekday) return AZW[new Date(y, m - 1, d).getDay()]; const mn = o.month === "short" ? AZM[m - 1].slice(0, 3) : AZM[m - 1]; return (o.day ? d + " " : "") + (o.month ? mn : "") + (o.year ? " " + y : ""); }
    if (o.weekday && uiLang() === "ar") o = { weekday: "narrow" };
    try { return new Date(y, m - 1, d).toLocaleDateString(locOf(), o); } catch (e) { return s; } };
  const refPage = (M, pg, last) => { const r = M[String(pg)] || []; const k = r.length ? r[last ? r.length - 1 : 0][0] : ""; if (!k) return ""; const [s, a] = k.split(":").map(Number); return NAMES[s - 1] + " " + a; };
  let planTab = "cal", planMonth = null, planNew = false;
  async function paintPlan(body) {
    const M = await pmap(); const p = pload();
    if (!p || planNew) return paintPlanNew(body, M);
    const t = pIdx(p), st = pStats(p);
    const tabs = el("div", "qm-tabs qm-pl-tabs");
    for (const [k, lb] of [["cal", T("Təqvim")], ["list", T("Günlər")]]) { const b = el("button", "qm-tab" + (planTab === k ? " on" : ""), lb); b.onclick = () => { planTab = k; paintSettings(); }; tabs.append(b); }
    const head = el("div", "qm-pl-sum"); head.append(el("b", "", p.mode === "juz" ? T("Gündə 1 cüz") + " · " + p.d.length + " " + T("gün") : T("N günə xətm").replace("N", p.d.length)), el("small", "", fmtD(p.start, { day: "numeric", month: "short" }) + " – " + fmtD(daddPlan(p.start, p.d.length - 1), { day: "numeric", month: "short", year: "numeric" })));
    body.append(head, tabs);
    if (planTab === "list") { paintPlanList(body, p, M); return; }
    // calendar month
    const ms = planMonth || today().slice(0, 7);
    const [yy, mm] = ms.split("-").map(Number);
    const nav = el("div", "qm-pl-mon"); const pv = el("button", "qm-rb ghost", uiLang() === "ar" ? "›" : "‹"), nx = el("button", "qm-rb ghost", uiLang() === "ar" ? "‹" : "›");
    const sh = (k) => { const d = new Date(yy, mm - 1 + k, 1); planMonth = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0"); paintSettings(); };
    pv.onclick = () => sh(-1); nx.onclick = () => sh(1); pv.setAttribute("aria-label", T("Əvvəlki")); nx.setAttribute("aria-label", T("Növbəti"));
    nav.append(pv, el("b", "", fmtD(ms + "-01", { month: "long", year: "numeric" })), nx);
    const cal = el("div", "qm-pl-cal");
    for (let w = 0; w < 7; w++) cal.append(el("i", "", fmtD(daddPlan("2026-11-02", w), { weekday: "short" }))); // 2 Nov 2026 is a Monday
    const first = new Date(yy, mm - 1, 1), off = (first.getDay() + 6) % 7, nd = new Date(yy, mm, 0).getDate();
    for (let k = 0; k < off; k++) cal.append(el("span", "x"));
    for (let dd = 1; dd <= nd; dd++) {
      const s = ms + "-" + String(dd).padStart(2, "0"); const i = dnum(s) - dnum(p.start);
      const c = el("button", "qm-pl-d", String(dd)); c.type = "button"; c.dataset.date = s;
      if (i >= 0 && i < p.d.length) { const stt = dayState(p, i); c.classList.add("s-" + stt); c.dataset.i = i; c.onclick = () => { planTab = "list"; planFocus = i; paintSettings(); }; } else c.disabled = true;
      if (s === today()) c.classList.add("now");
      cal.append(c);
    }
    const lg = el("div", "qm-pl-lg"); for (const [c, l] of [["d", T("oxundu")], ["m", T("buraxıldı")], ["u", T("qarşıda")]]) { const x = el("span", ""); x.append(el("i", "s-" + c), l); lg.append(x); }
    const cc = el("div", "qm-pl-card"); cc.append(nav, cal, lg); body.append(cc);
    const cn = el("div", "qm-pl-cnt");
    for (const [v, l, k] of [[st.rd, T("gün oxundu"), "rd"], [st.ms, T("buraxıldı"), "ms"], [st.pct + "%", T("xətm"), "pct"]]) { const x = el("div", "qm-pl-card c"); x.dataset.k = k; x.append(el("b", "", String(v)), el("small", "", l)); cn.append(x); }
    body.append(cn);
    if (st.ms > 0 && t < p.d.length) {
      const left = p.d.filter((_, i) => i >= t && !dayDone(p, i)).length;
      const pages = new Set(); p.d.forEach((seg, i) => { if ((i < t && dayState(p, i) === "m") || (i >= t && !dayDone(p, i))) segPages(seg).forEach((x) => { if (!p.read.includes(x)) pages.add(x); }); });
      const per = left ? Math.ceil(pages.size / left) : 0;
      const bc = el("div", "qm-pl-card main qm-pl-behind"); bc.append(el("b", "", T("Geridə qaldınız")), el("p", "", T("Buraxılan səhifələr qalan günlərə bölünsün? Gündə təxminən N səhifə olacaq.").replace("N", per)));
      const ok = el("button", "qm-rb main", T("Bölüşdür")); ok.onclick = () => { const q = pload(); if (redistribute(q)) toast(T("Plan yeniləndi")); paintSettings(); };
      const td = el("button", "qm-rb", T("Bu gün tamamla")); td.onclick = () => { planTab = "list"; planFocus = Math.min(t, p.d.length - 1); paintSettings(); };
      const r = el("div", "qm-np-row"); r.append(ok, td); bc.append(r); body.append(bc);
    }
    if (t >= 0 && t < p.d.length) body.append(dayCard(p, t, M, true));
    else if (t >= p.d.length) body.append(el("p", "qm-wps-tip qm-pl-end", T("Plan müddəti bitdi.")));
    else body.append(el("p", "qm-wps-tip qm-pl-end", T("Plan başlayır") + ": " + fmtD(p.start, { day: "numeric", month: "long" })));
    const ft = el("div", "qm-nl-io"); const nw = el("button", "qm-rb", "＋ " + T("Yeni plan")); nw.onclick = () => { planNew = true; paintSettings(); };
    let ask = false; const del = el("button", "qm-rb", T("Planı sil")); del.onclick = () => { if (!ask) { ask = true; del.className = "qm-rb danger"; del.textContent = T("Silinsin?"); return; } psave(null); paintSettings(); };
    ft.append(nw, del); body.append(ft);
  }
  let planFocus = null;
  function dayCard(p, i, M, big) {
    const s = dayState(p, i); const seg = p.d[i]; const pages = segPages(seg);
    const c = el("div", "qm-pl-day s-" + s + (big ? " big" : "")); c.dataset.i = i;
    const top = el("div", "qm-nl-top");
    const ttl = T("Gün") + " " + (i + 1) + (p.mode === "juz" && seg.length === 1 && PJUZ.includes(seg[0][0]) ? " · " + T("Cüz") + " " + (juzOf(seg[0][0]) + 1) : "");
    top.append(el("b", "", ttl), el("span", "qm-nl-sp"), el("small", "qm-pl-st", { d: "✓ " + T("Oxundu"), m: T("Buraxıldı"), v: T("Köçürüldü"), t: T("Bu gün"), u: fmtD(daddPlan(p.start, i), { day: "numeric", month: "short" }) }[s]));
    c.append(top);
    if (pages.length) {
      const rng = el("div", "qm-pl-rng"); rng.dir = "auto";
      rng.textContent = refPage(M, pages[0], false) + " – " + refPage(M, pages[pages.length - 1], true);
      const pgT = el("small", "qm-pl-pg", T("Səhifə") + " " + seg.map(([a, b]) => (a === b ? a : a + "–" + b)).join(", ") + " · " + pages.length + " " + T("səhifə") + (p.read.length ? " · " + pages.filter((x) => p.read.includes(x)).length + "/" + pages.length : ""));
      c.append(rng, pgT);
      const row = el("div", "qm-np-row");
      const op = el("button", "qm-rb main", T("Oxu") + " · " + T("səh.") + " " + (pages.find((x) => !p.read.includes(x)) || pages[0])); op.onclick = () => { const pg = pages.find((x) => !p.read.includes(x)) || pages[0]; closeAll(); if (back.classList.contains("qm-page")) closeAll(); if (back.classList.contains("qm-page")) closeSettingsPage(); setTimeout(() => window.QM_OPENPAGE && window.QM_OPENPAGE(pg), 0); };
      const dn = el("button", "qm-rb qm-pl-done" + (p.done[i] ? " on" : ""), p.done[i] ? "✓ " + T("Oxundu") : T("Oxudum")); dn.onclick = () => { const q = pload(); if (q.done[i]) delete q.done[i]; else q.done[i] = 1; psave(q); paintSettings(); };
      row.append(dn, op); c.append(row);
    } else c.append(el("small", "qm-pl-pg", "—"));
    return c;
  }
  function paintPlanList(body, p, M) {
    const list = el("div", "qm-nl");
    p.d.forEach((_, i) => list.append(dayCard(p, i, M, false)));
    body.append(list);
    const f = planFocus != null ? planFocus : Math.max(0, Math.min(pIdx(p), p.d.length - 1)); planFocus = null;
    setTimeout(() => { const e = list.querySelector('.qm-pl-day[data-i="' + f + '"]'); e && e.scrollIntoView({ block: "center" }); }, 0);
  }
  function paintPlanNew(body, M) {
    const st = { mode: "days", days: 30, start: today(), p0: 1 };
    const box = el("div", "qm-pl-new");
    const draw = () => {
      box.replaceChildren();
      box.append(el("p", "qm-np-l", T("Xətm müddəti")));
      const ch = el("div", "qm-np-chips");
      for (const v of [7, 15, 30, 60]) { const b = el("button", "qm-np-chip" + (st.mode === "days" && st.days === v ? " on" : ""), v + " " + T("gün")); b.type = "button"; b.onclick = () => { st.mode = "days"; st.days = v; draw(); }; ch.append(b); }
      const jb = el("button", "qm-np-chip" + (st.mode === "juz" ? " on" : ""), T("Gündə 1 cüz")); jb.type = "button"; jb.onclick = () => { st.mode = "juz"; draw(); }; ch.append(jb);
      const ci = el("input", "qm-np-in qm-pl-ci"); ci.type = "number"; ci.min = 1; ci.max = 604; ci.placeholder = T("Başqa…"); ci.inputMode = "numeric"; if (st.mode === "days" && ![7, 15, 30, 60].includes(st.days)) ci.value = st.days;
      ci.onchange = () => { const v = Math.round(+ci.value); if (v >= 1 && v <= 604) { st.mode = "days"; st.days = v; draw(); } }; ch.append(ci); box.append(ch);
      box.append(el("p", "qm-np-l", T("Başlama tarixi")));
      const di = el("input", "qm-np-in"); di.type = "date"; di.value = st.start; di.onchange = () => { if (/^\d{4}-\d{2}-\d{2}$/.test(di.value)) { st.start = di.value; draw(); } }; box.append(di);
      box.append(el("p", "qm-np-l", T("Başlanğıc səhifə")));
      const pr = el("div", "qm-np-fr"); const pi = el("input", "qm-np-in"); pi.type = "number"; pi.min = 1; pi.max = 604; pi.value = st.p0; pi.inputMode = "numeric";
      pi.onchange = () => { st.p0 = Math.min(604, Math.max(1, Math.round(+pi.value) || 1)); draw(); };
      pr.append(pi, el("small", "", refPage(M, st.p0, false))); box.append(pr);
      const pl = makePlan(st.start, st.p0, st.mode, st.days); const lens = pl.d.map((s) => segPages(s).length);
      const sm = el("div", "qm-pl-card main qm-pl-calc"); sm.append(el("p", "qm-np-l", T("Hesablandı")));
      const r = el("div", "qm-hz-row"); r.append(el("b", "qm-hz-big", Math.min(...lens) === Math.max(...lens) ? String(lens[0]) : Math.min(...lens) + "–" + Math.max(...lens)), el("small", "", T("səhifə gündə") + " · " + pl.d.length + " " + T("gün"))); sm.append(r);
      sm.append(el("small", "", T("Bitmə tarixi") + ": " + fmtD(daddPlan(st.start, pl.d.length - 1), { day: "numeric", month: "long", year: "numeric" })));
      box.append(sm);
      const go = el("button", "qm-rb main qm-hz-go", T("Planı başlat")); go.onclick = () => { const old = pload(); psave(makePlan(st.start, st.p0, st.mode, st.days)); planNew = false; planTab = "cal"; planMonth = null; toast(T("Plan yaradıldı")); paintSettings(); };
      box.append(go);
      if (pload()) { const cn = el("button", "qm-rb", T("Ləğv")); cn.onclick = () => { planNew = false; paintSettings(); }; box.append(cn); }
    };
    draw(); body.append(box);
  }
  const openPlan = async () => { planNew = false; planTab = "cal"; planMonth = null; await openSettings(); setView = "plan"; paintSettings(); };
  /* ---------- search inside downloaded translations / tafsirs ---------- */
  const srcCache = {};
  async function srcList(kind) {
    if (!LIST.length) LIST = await (await fetch("./lib-list.json")).json();
    const o = [];
    const ok = (r) => kind === "tf" ? (r.k === "tf" || r.k === "ir" || r.k === "wb") : r.k === kind;
    const nm = (r) => r.k === "tr" ? r.by + " · " + r.name : r.k === "wb" ? (r.id === "seraj" ? T("Sirac") : r.id === "ibnqutaybah" ? T("İbn Qutəybə") : r.name) : r.name;
    for (const r of LIST) if (ok(r) && (await status(r.id)) >= 114) o.push({ id: r.id, name: nm(r), lang: r.lang, dir: r.dir, k: r.k });
    return o;
  }
  async function srcRows(id) {
    if (srcCache[id]) return srcCache[id];
    const R = LIST.find((x) => x.id === id) || {}; const out = [];
    for (let s = 1; s <= 114; s++) {
      const v = (await get(id + ":" + s)) || []; let prev = null;
      for (let a = 0; a < v.length; a++) {
        if (!v[a]) continue; const t = plain(v[a]); if (R.ex && t === prev) continue; prev = t;
        let to = a + 1; if (!R.ex) while (to < v.length && !v[to]) to++;
        out.push({ s, a: a + 1, to, t });
      }
    }
    return (srcCache[id] = out);
  }
  window.QM_SRC = { list: srcList, rows: srcRows, font: () => quranFont(), forFont: (t) => forFont(t), pref: (k) => prefs()[k === "tf" ? "stf" : "str"] || "", setPref: (k, v) => setPrefs({ [k === "tf" ? "stf" : "str"]: v }) };
  const openNotes = async () => { nFilter = ""; await openSettings(); setView = "notes"; paintSettings(); };
  const toastEl = el("div", "qm-toast"); toastEl.hidden = true; document.body.appendChild(toastEl);
  let toastT = 0;
  window.QM_TOAST = (t) => toast(t);
  window.QM_CLOSEAYAH = () => { if (!back.hidden && sheet.classList.contains("qm-ayah")) closeAll(); };
  const toast = (t) => { toastEl.textContent = t; toastEl.hidden = false; clearTimeout(toastT); toastT = setTimeout(() => (toastEl.hidden = true), 1800); };
  async function copyText(t) { try { await navigator.clipboard.writeText(t); return true; } catch (e) { const ta = el("textarea"); ta.value = t; document.body.append(ta); ta.select(); const ok = document.execCommand("copy"); ta.remove(); return ok; } }
  const SVG = {
    settings: '<circle cx="12" cy="12" r="3"/><path d="M12 2.8v2.6M12 18.6v2.6M2.8 12h2.6M18.6 12h2.6M5.5 5.5l1.8 1.8M16.7 16.7l1.8 1.8M5.5 18.5l1.8-1.8M16.7 7.3l1.8-1.8"/><circle cx="12" cy="12" r="6.2"/>',
    share: '<path d="M12 3v12M7.5 7.5 12 3l4.5 4.5M5 12v7.5h14V12"/>',
    copy: '<rect x="8" y="8" width="11.5" height="11.5" rx="2"/><path d="M15.5 8V5.5A1.5 1.5 0 0 0 14 4H5.5A1.5 1.5 0 0 0 4 5.5V14a1.5 1.5 0 0 0 1.5 1.5H8"/>',
    mark: '<path d="M6.5 3.5h11v17L12 16.5l-5.5 4z"/>',
    close: '<path d="M6 6l12 12M18 6 6 18"/>',
    full: '<path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5"/>',
    cmp: '<rect x="3.5" y="5" width="7.5" height="14" rx="1.6"/><rect x="13" y="5" width="7.5" height="14" rx="1.6"/>',
    hz: '<path d="M5 19V11M10 19V6M15 19v-5M20 19V9"/>',
    hifz: '<path d="M4 5.5C6.5 4.5 9.5 4.5 12 6c2.5-1.5 5.5-1.5 8-.5v13c-2.5-1-5.5-1-8 .5-2.5-1.5-5.5-1.5-8-.5zM12 6v13.5"/><path d="m8.5 11 1.5 1.5 3-3"/>',
    listen: '<path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="3.5" y="13.5" width="4" height="6" rx="1.5"/><rect x="16.5" y="13.5" width="4" height="6" rx="1.5"/>',
    fsearch: '<circle cx="10.5" cy="10.5" r="6"/><path d="m15 15 5 5"/>',
    plus: '<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M12 8.5v7M8.5 12h7"/>',
  };
  const icon = (name, label, filled) => { const b = el("button", "qm-ic" + (filled ? " on" : "")); b.type = "button"; b.setAttribute("aria-label", label); b.title = label; b.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true">' + SVG[name] + "</svg>"; return b; };

  /* ---------- Ayah sheet ---------- */
  let cur = null;
  let irReady = false;
  function irChooser(have, onPick) {
    const titles = { az: "Ərəb kitabını seçin", tr: "Arapça kitabı seçin", en: "Choose an Arabic book", ar: "اختر كتاب الإعراب", ru: "Выберите книгу" };
    const box = el("div", "qm-ir-pick");
    box.append(el("p", "", titles[uiLang()] || titles.az));
    for (const h of have) {
      const b = el("button", "qm-ir-card");
      b.type = "button";
      b.dir = "rtl"; b.lang = "ar";
      b.append(el("b", "", h.name));
      if (h.by) b.append(el("small", "", h.by));
      b.onclick = () => onPick(h.id);
      box.append(b);
    }
    return box;
  }
  async function openAyah(s, a) {
    if (!LIST.length) LIST = await (await fetch("./lib-list.json")).json();
    cur = { s, a }; window.QM_GOTO ? window.QM_GOTO(s + ":" + a) : window.QM_HL && window.QM_HL(s + ":" + a);
    const p = prefs(); const kind = ["tf", "tr", "wb", "ir"].includes(p.tab) ? p.tab : "tf";
    const have = []; for (const r of LIST) if (r.k === kind && (await status(r.id)) >= 114) have.push(r);
    const r = have.find((x) => x.id === p[kind]) || have[0];
    const e = r ? await entry(r.id, s, a) : null;
    const fn = r && r.k === "tr" ? ((await get(r.id + ":f:" + s)) || [])[a - 1] : "";
    if (!cur || cur.s !== s || cur.a !== a) return;
    sheet.onpointerdown = sheet.onpointerup = null;
    sheet.className = "qm-sheet qm-ayah"; sheet.replaceChildren(); sheet.dir = uiLang() === "ar" ? "rtl" : "ltr";
    const ref = NAMES[s - 1] + " " + s + ":" + a;
    const bar = el("div", "qm-icons");
    const shareB = icon("share", T("Paylaş")), copyB = icon("copy", T("Kopyala")), markB = icon("mark", T("Əlfəcin"), marks().includes(s + ":" + a)), closeB = icon("close", T("Bağla"));
    shareB.onclick = () => shareMenu([s + ":" + a]);
    copyB.onclick = async () => toast((await copyText(await buildText([s + ":" + a], false))) ? T("Kopyalandı") : T("Alınmadı"));
    const qa = window.QA ? window.QA.panel(s, a) : null;
    const auB = qa ? icon("listen", T("Dinlə")) : null;
    if (qa) auB.onclick = () => { qa.hidden = !qa.hidden; auB.classList.toggle("on", !qa.hidden); };
    markB.onclick = () => openNote(s + ":" + a, () => { if (cur && cur.s === s && cur.a === a) markB.classList.toggle("on", marks().includes(s + ":" + a)); });
    closeB.onclick = () => { cur = null; window.QM_HL && window.QM_HL(null); closeAll(); };
    closeB.classList.add("end");
    const fullB = icon("full", T("Tam ekran"));
    fullB.onclick = () => openFull(kind, s + ":" + a);
    const cmpB = icon("cmp", T("Müqayisə"));
    cmpB.onclick = () => openCompare(s, a);
    const hzB = icon("hifz", T("Hifz")); hzB.onclick = () => { cur = null; window.QM_HL && window.QM_HL(null); closeAll(); openHifz(s, a); };
    const xsB = icon("fsearch", T("Bu ayənin təfsirlərində axtar")); xsB.onclick = () => openAyahSearch(s, a);
    bar.append(...[auB, xsB, shareB, copyB, markB, hzB, cmpB, closeB].filter(Boolean));
    sheet.append(bar);
    const head = el("div", "qm-head");
    head.append(el("h2", "", NAMES[s - 1] + " · " + (e && e.from !== e.to ? e.from + "–" + e.to : a)));
    const nav = el("span", "qm-nav");
    const max = AYAHS[s - 1];
    const pv = el("button", "qm-step", "‹ " + T("Əvvəlki")), nx = el("button", "qm-step", T("Növbəti") + " ›");
    pv.disabled = s === 1 && a === 1; nx.disabled = s === 114 && a === max;
    const goPrev = () => { if (pv.disabled) return; const f = e ? e.from : a; f > 1 ? openAyah(s, f - 1) : openAyah(s - 1, AYAHS[s - 2]); };
    const goNext = () => { if (nx.disabled) return; const t = e ? e.to : a; t < max ? openAyah(s, t + 1) : openAyah(s + 1, 1); };
    pv.onclick = goPrev; nx.onclick = goNext;
    let sx = null, sy = 0;
    sheet.onpointerdown = (ev) => { if (ev.target.closest("button, select")) return; sx = ev.clientX; sy = ev.clientY; };
    sheet.onpointerup = (ev) => { if (sx == null) return; const dx = ev.clientX - sx, dy = ev.clientY - sy; sx = null; if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) (dx > 0 ? goNext : goPrev)(); };
    nav.append(pv, nx); head.append(nav);
    sheet.append(head);
    if (qa) sheet.append(qa);
    const tabs = el("div", "qm-tabs");
    for (const k of ["tf", "tr", "wb", "ir"]) { const t = el("button", "qm-tab" + (k === kind ? " on" : ""), k === "tf" ? T("Təfsirlər") : k === "tr" ? T("Tərcümələr") : k === "ir" ? T("Erab") : T("Söz mənaları")); t.onclick = () => { if (k === "ir" && kind !== "ir") irReady = false; setPrefs({ tab: k }); openAyah(s, a); }; tabs.append(t); }
    sheet.append(tabs);
    if (kind === "ir" && !irReady && have.length > 1) {
      const body = el("div", "qm-body");
      body.append(irChooser(have, (id) => { irReady = true; setPrefs({ ir: id }); openAyah(s, a); }));
      sheet.append(body);
      back.hidden = false;
      return;
    }
    if (have.length > 1) {
      const sel = el("select", "qm-pick");
      for (const h of have) { const o = el("option", "", (h.k === "tr" ? h.by + " · " : "") + h.name); o.value = h.id; sel.append(o); }
      sel.value = r.id; sel.onchange = () => { setPrefs({ [kind]: sel.value }); openAyah(s, a); }; sheet.append(sel);
    }
    const body = el("div", "qm-body"); sheet.append(body);
    if (!r) {
      const box = el("div", "qm-empty"); box.append(el("p", "", T("Hələ endirilməyib.")));
      const b = el("button", "qm-rb main", T("Ayarlarda endir")); b.onclick = () => openSettings(kind); box.append(b); body.append(box);
    } else {
      body.dir = r.dir; body.lang = r.lang; body.style.fontSize = p.fs * (r.lang === "ar" ? 1.15 : 1) + "rem";
      if (have.length === 1) { const src = el("b", "qm-src", (r.k === "tr" ? r.by + " · " : "") + r.name); src.dir = "auto"; body.append(src); }
      if (r.k === "wb") renderWb(body, e ? e.text : "", r.id);
      else {
        const txt = e && e.text ? plain(e.text) : "—";
        if (txt.includes("[[")) renderNoted(body, txt); else for (const para of txt.split(/\n{2,}/)) body.append(el("p", "", para));
        if (fn) body.append(el("p", "qm-fn", plain(fn)));
        if (window.QM_COLOR_QUOTES) window.QM_COLOR_QUOTES(body);
      }
    }
    back.hidden = false;
  }

  /* ---------- «Xüsusi axtarış»: search this ayah's text across all / one tafsir ---------- */
  const xsState = { src: "", q: "" };
  async function openAyahSearch(s, a) {
    if (!LIST.length) LIST = await (await fetch("./lib-list.json")).json();
    const srcs = []; for (const r of LIST) if ((r.k === "tf" || r.k === "ir" || r.k === "wb") && (await status(r.id)) >= 114) srcs.push(r);
    cur = { s, a };
    sheet.onpointerdown = sheet.onpointerup = null;
    sheet.className = "qm-sheet qm-ayah qm-xs"; sheet.replaceChildren(); sheet.dir = uiLang() === "ar" ? "rtl" : "ltr";
    const bar = el("div", "qm-icons");
    const bk = el("button", "qm-step", "‹ " + NAMES[s - 1] + " " + s + ":" + a); bk.onclick = () => openAyah(s, a);
    const closeB = icon("close", T("Bağla")); closeB.classList.add("end"); closeB.onclick = () => { cur = null; window.QM_HL && window.QM_HL(null); closeAll(); };
    bar.append(bk, closeB); sheet.append(bar);
    const head = el("div", "qm-head"); head.append(el("h2", "", "Xüsusi axtarış · " + NAMES[s - 1] + " " + s + ":" + a)); sheet.append(head);
    const body = el("div", "qm-body"); sheet.append(body);
    if (!srcs.length) { const box = el("div", "qm-empty"); box.append(el("p", "", T("Hələ təfsir endirilməyib."))); const b = el("button", "qm-rb main", T("Ayarlarda endir")); b.onclick = () => openSettings("tf"); box.append(b); body.append(box); back.hidden = false; return; }
    const pick = el("div", "qm-tabs");
    const mk = (id, label) => { const b = el("button", "qm-tab" + (xsState.src === id ? " on" : ""), label); b.onclick = () => { xsState.src = id; [...pick.children].forEach((c) => c.classList.toggle("on", c === b)); run(); }; return b; };
    if (xsState.src && !srcs.some((r) => r.id === xsState.src)) xsState.src = "";
    const xsLabel = (r) => r.k === "wb" ? (r.id === "seraj" ? T("Sirac") : r.id === "ibnqutaybah" ? T("İbn Qutəybə") : r.name) : r.name;
    pick.append(mk("", "Bütün təfsirlərdə"), ...srcs.map((r) => mk(r.id, xsLabel(r))));
    pick.style.flexWrap = "wrap";
    const inp = el("input", "qm-pick"); inp.type = "search"; inp.placeholder = "Bu ayənin təfsirlərində axtar…"; inp.value = xsState.q; inp.dir = "auto";
    const res = el("div", "qm-xs-res");
    body.append(pick, inp, res);
    const norm = (t) => t.toLowerCase().replace(/[\u064B-\u065F\u0670\u06D6-\u06ED\u0640]/g, "").replace(/[أإآٱ]/g, "ا").replace(/ى/g, "ي").replace(/ة/g, "ه");
    let tok = 0;
    async function run() {
      const my = ++tok; xsState.q = inp.value; const q = norm(inp.value.trim());
      const list = xsState.src ? srcs.filter((r) => r.id === xsState.src) : srcs; const out = [];
      for (const r of list) { const e = await entry(r.id, s, a); if (e && e.text) out.push({ r, e, t: plain(e.text) }); }
      if (my !== tok) return; res.replaceChildren();
      let n = 0;
      for (const { r, e, t } of out) {
        const nt = norm(t); const hits = [];
        if (q) { let i = nt.indexOf(q); while (i >= 0 && hits.length < 5) { hits.push(i); i = nt.indexOf(q, i + q.length); } if (!hits.length) continue; }
        n++;
        const card = el("button", "qm-opt qm-xs-hit"); card.style.cssText = "display:block;width:100%;text-align:start;white-space:normal;margin:.4rem 0";
        card.append(el("b", "", r.name + " · " + s + ":" + (e.from !== e.to ? e.from + "–" + e.to : a) + (q ? " · " + hits.length + (hits.length >= 5 ? "+" : "") : "")));
        const segs = q ? hits.slice(0, 3) : [0];
        for (const i of segs) {
          // norm() keeps length except removed marks; map position roughly by searching original
          const p = el("p"); p.dir = r.dir || "auto"; p.lang = r.lang || "";
          const st = Math.max(0, i - 80), en = Math.min(nt.length, i + q.length + 120);
          const pre = nt.slice(st, i), hit = nt.slice(i, i + q.length), post = nt.slice(i + q.length, en);
          if (!q) p.textContent = t.slice(0, 220) + (t.length > 220 ? "…" : "");
          else { p.append((st ? "…" : "") + pre); const m = el("mark", "", hit); p.append(m, post + (en < nt.length ? "…" : "")); }
          card.append(p);
        }
        card.onclick = () => { setPrefs({ tab: r.k, [r.k]: r.id }); openAyah(s, a); };
        res.append(card);
      }
      if (!n) res.append(el("p", "qm-empty", T("Tapılmadı")));
    }
    let dt = 0; inp.oninput = () => { clearTimeout(dt); dt = setTimeout(run, 200); };
    run(); back.hidden = false; setTimeout(() => inp.focus(), 50);
  }

  /* ---------- several ayahs: text, image, selection ---------- */
  const sortKeys = (keys) => [...new Set(keys)].map((k) => k.split(":").map(Number)).sort((x, y) => x[0] - y[0] || x[1] - y[1]);
  function suraName(n) {
    if (n && /[\u0600-\u06FF]/.test(n) && !/^سورة\s/.test(n)) return "سورة " + n;
    return n || "";
  }
  function refOf(keys) {
    const ks = sortKeys(keys);
    const [s0, a0] = ks[0], [s1, a1] = ks[ks.length - 1];
    const contiguous = ks.every((k, i) => i === 0 || (k[0] === ks[i - 1][0] && k[1] === ks[i - 1][1] + 1));
    const name = suraName(NAMES[s0 - 1]);
    if (ks.length === 1) return name + " " + s0 + ":" + a0;
    if (s0 === s1 && contiguous) return name + " " + s0 + ":" + a0 + "–" + a1;
    return ks.map((k) => k[0] + ":" + k[1]).join(", ");
  }
  const AR_DIG = (n) => String(n).replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[d]);
  async function trFor(keys) {
    const p = prefs(); if (!p.tr || (await status(p.tr)) < 114) return null;
    const r = (LIST.length ? LIST : (LIST = await (await fetch("./lib-list.json")).json())).find((x) => x.id === p.tr);
    const out = []; for (const [s, a] of sortKeys(keys)) { const e = await entry(p.tr, s, a); if (e && e.text) out.push(plain(e.text).replace(/\[\d+\]/g, "")); }
    return r && out.length ? { name: r.by + " · " + r.name, text: [...new Set(out)].join(" ") } : null;
  }
  async function buildText(keys, withTr) {
    const ks = sortKeys(keys); const parts = [];
    for (const [s, a] of ks) parts.push((await ayahText(s, a)) + (ks.length > 1 ? " ﴿" + AR_DIG(a) + "﴾" : ""));
    let t = parts.join(" ") + "\n— " + refOf(keys);
    if (withTr) { const tr = await trFor(keys); if (tr) t += "\n\n" + tr.name + ":\n" + (tr.text.length > 900 ? tr.text.slice(0, 900).trim() + "…" : tr.text); }
    return t;
  }
  async function shareText(keys) {
    const text = await buildText(keys, true);
    if (navigator.share) { try { await navigator.share({ title: refOf(keys), text }); return; } catch (err) { if (err && err.name === "AbortError") return; } }
    toast((await copyText(text)) ? T("Kopyalandı") : T("Alınmadı"));
  }
  const menu = el("div", "qm-menu"); menu.hidden = true; document.body.appendChild(menu);
  menu.addEventListener("click", (ev) => { if (ev.target === menu) menu.hidden = true; });
  function shareMenu(keys) {
    menu.replaceChildren(); const box = el("div", "qm-menu-box");
    box.append(el("b", "", T("Paylaş") + " · " + refOf(keys)));
    const tb = el("button", "qm-opt", "📝  " + T("Mətn")), ib = el("button", "qm-opt", "🖼  " + T("Şəkil")), cb = el("button", "qm-opt ghost", T("Ləğv"));
    tb.onclick = () => { menu.hidden = true; shareText(keys); };
    ib.onclick = () => { menu.hidden = true; imagePreview(keys); };
    cb.onclick = () => (menu.hidden = true);
    box.append(tb, ib, cb); menu.append(box); menu.hidden = false;
  }
  let fontP = null;
  const quranFont = () => (fontP ||= new FontFace("QMHafs", "url(./yazi-fonts/uthmanic-hafs.woff2)").load().then((f) => (document.fonts.add(f), f)).catch(() => null));
  function wrap(ctx, text, max) {
    const words = text.split(/\s+/).filter(Boolean); const lines = []; let line = "";
    for (const w of words) { const t = line ? line + " " + w : w; if (ctx.measureText(t).width > max && line) { lines.push(line); line = w; } else line = t; }
    if (line) lines.push(line); return lines;
  }
  async function makeImage(keys) {
    await quranFont();
    const W = 1080, P = 90, inner = W - P * 2 - 40;
    const ks = sortKeys(keys); const parts = [];
    for (const [s, a] of ks) parts.push(forFont(await ayahText(s, a)) + " " + AR_DIG(a)); // this font draws the digits as the ayah-end circle
    const tr = await trFor(keys);
    const c = document.createElement("canvas"); const ctx = c.getContext("2d");
    let arSize = 58; ctx.font = arSize + "px QMHafs, serif"; ctx.direction = "rtl";
    let arLines = wrap(ctx, parts.join(" "), inner);
    while (arLines.length > 16 && arSize > 34) { arSize -= 4; ctx.font = arSize + "px QMHafs, serif"; arLines = wrap(ctx, parts.join(" "), inner); }
    const arLH = arSize * 1.95;
    ctx.font = "32px 'Segoe UI', sans-serif"; ctx.direction = "ltr";
    let trText = tr ? tr.text : ""; if (trText.length > 700) trText = trText.slice(0, 700).trim() + "…";
    const trLines = tr ? wrap(ctx, trText, inner) : [];
    const content = 180 + 110 + arLines.length * arLH + (tr ? 70 + trLines.length * 46 + 8 : 0) + 160;
    const H = Math.max(1080, content), off = (H - content) / 2; // short ayahs sit in the middle of a square card
    c.width = W; c.height = H;
    ctx.fillStyle = "#fffaf0"; ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = "#c4a56e"; ctx.lineWidth = 6; ctx.strokeRect(34, 34, W - 68, H - 68);
    ctx.lineWidth = 2; ctx.strokeRect(50, 50, W - 100, H - 100);
    for (const [x, y] of [[50, 50], [W - 50, 50], [50, H - 50], [W - 50, H - 50]]) { ctx.save(); ctx.translate(x, y); ctx.rotate(Math.PI / 4); ctx.fillStyle = "#c4a56e"; ctx.fillRect(-11, -11, 22, 22); ctx.fillStyle = "#1a3330"; ctx.fillRect(-5, -5, 10, 10); ctx.restore(); }
    // header pill
    const ref = refOf(keys);
    ctx.font = "600 36px 'Segoe UI', sans-serif"; ctx.direction = "ltr"; ctx.textAlign = "center";
    const tw = ctx.measureText(ref).width + 80;
    ctx.fillStyle = "#1a3330"; ctx.beginPath(); ctx.roundRect(W / 2 - tw / 2, 110 + off, tw, 70, 35); ctx.fill();
    ctx.strokeStyle = "#c4a56e"; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = "#e4c98a"; ctx.fillText(ref, W / 2, 157 + off);
    let y = 290 + off;
    ctx.fillStyle = "#1a1612"; ctx.font = arSize + "px QMHafs, serif"; ctx.direction = "rtl";
    for (const l of arLines) { ctx.fillText(l, W / 2, y); y += arLH; }
    if (tr) {
      y += 10; ctx.strokeStyle = "#c4a56e"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(W / 2 - 120, y); ctx.lineTo(W / 2 + 120, y); ctx.stroke(); y += 70;
      ctx.direction = "ltr"; ctx.fillStyle = "#3d4a44"; ctx.font = "32px 'Segoe UI', sans-serif";
      for (const l of trLines) { ctx.fillText(l, W / 2, y); y += 46; }
    }
    const icon = await new Promise((ok) => { const img = new Image(); img.onload = () => ok(img); img.onerror = () => ok(null); img.src = "/icon.png"; });
    ctx.save();
    ctx.direction = "ltr"; ctx.textAlign = "left"; ctx.font = "600 30px Georgia, 'Times New Roman', serif";
    const brand = "Mushafuk", dot = ".online";
    const bw = ctx.measureText(brand).width, dw = ctx.measureText(dot).width, is = 46, gap = 12;
    const total = (icon ? is + gap : 0) + bw + dw;
    let x = (W - total) / 2, base = H - 96;
    if (icon) { ctx.drawImage(icon, x, base - is + 10, is, is); x += is + gap; }
    ctx.fillStyle = "#1a3330"; ctx.fillText(brand, x, base);
    ctx.fillStyle = "#b0893a"; ctx.fillText(dot, x + bw, base);
    ctx.restore();
    return new Promise((ok) => c.toBlob((b) => ok(b), "image/png"));
  }
  async function imagePreview(keys) {
    toast(T("Hazırlanır…"));
    const blob = await makeImage(keys); const url = URL.createObjectURL(blob);
    const name = "quran-" + sortKeys(keys).map((k) => k.join("-")).filter((_, i, l) => i === 0 || i === l.length - 1).join("_") + ".png";
    const file = new File([blob], name, { type: "image/png" });
    toastEl.hidden = true;
    menu.replaceChildren(); const box = el("div", "qm-menu-box qm-prev");
    const img = el("img"); img.src = url; img.alt = refOf(keys); box.append(img);
    const row = el("div", "qm-prev-row");
    const sb = el("button", "qm-rb main", T("Paylaş")), db = el("button", "qm-rb", T("Yadda saxla")), xb = el("button", "qm-rb ghost", T("Bağla"));
    const save = () => { const a = el("a"); a.href = url; a.download = name; document.body.append(a); a.click(); a.remove(); };
    sb.onclick = async () => { if (navigator.canShare && navigator.canShare({ files: [file] })) { try { await navigator.share({ files: [file], title: refOf(keys) }); return; } catch (err) { if (err && err.name === "AbortError") return; } } save(); };
    db.onclick = save; xb.onclick = () => { menu.hidden = true; URL.revokeObjectURL(url); };
    row.append(sb, db, xb); box.append(row); menu.append(box); menu.hidden = false;
  }
  // selection mode: tap (or hold) ayahs on the page to add / remove them
  let sel = null;
  const selBar = el("div", "qm-selbar"); selBar.hidden = true; document.body.appendChild(selBar);
  function drawSel() {
    if (!sel) { selBar.hidden = true; window.QM_HL && window.QM_HL(null); return; }
    window.QM_HL && window.QM_HL(sel.slice());
    selBar.replaceChildren();
    const chip = el("span", "qm-count", T("N ayə seçilib").replace("N", sel.length)); chip.title = sel.length ? refOf(sel) : "";
    const sb = el("button", "qm-rb main", T("Paylaş")), cb = el("button", "qm-rb", T("Kopyala")), xb = el("button", "qm-rb ghost", T("Ləğv"));
    sb.disabled = cb.disabled = !sel.length;
    sb.onclick = () => shareMenu(sel.slice());
    cb.onclick = async () => toast((await copyText(await buildText(sel, false))) ? T("Kopyalandı") : T("Alınmadı"));
    xb.onclick = () => { sel = null; drawSel(); };
    selBar.append(chip, sb, cb, xb); selBar.hidden = false;
  }
  function startSelect(k) { sel = [k]; closeAll(); drawSel(); toast(T("Başqa ayələrə toxunun")); }
  function tapAyah(k) { if (!sel) return; const i = sel.indexOf(k); i >= 0 ? sel.splice(i, 1) : sel.push(k); drawSel(); }

  /* ---------- fullscreen reader: every ayah of the current mushaf page + tafsir / translation ---------- */
  const fsEl = el("div", "qm-full"); fsEl.hidden = true; document.body.appendChild(fsEl);
  let fsState = null;
  // Quran, tafsir and translation each turn a real page: /page/N/ (and /az/page/N/, …).
  function mushafTurnHref(n) {
    if (n < 1 || n > 604) return "";
    let path = location.pathname;
    if (path.length > 1 && path.endsWith("/")) path = path.slice(0, -1);
    const lang = path.match(/^\/(az|tr|en|ru)(?=\/|$)/);
    const prefix = lang ? lang[0] : "";
    const rest = prefix ? path.slice(prefix.length) : path;
    if (rest !== "/quran" && !/^\/page\/\d+$/.test(rest)) return "";
    return prefix + "/page/" + n + "/";
  }
  let turnLock = false;
  function prefetchDoc(href) {
    if (!href) return;
    const l = document.createElement("link");
    l.rel = "prefetch";
    l.as = "document";
    l.href = href;
    document.head.appendChild(l);
  }
  function preloadQcf(n) {
    if (n < 1 || n > 604 || document.getElementById("qm-qcf-" + n)) return;
    const l = document.createElement("link");
    l.id = "qm-qcf-" + n;
    l.rel = "preload";
    l.as = "font";
    l.type = "font/woff2";
    l.crossOrigin = "anonymous";
    l.href = "/yazi-fonts/qcf/p" + n + ".woff2";
    document.head.appendChild(l);
  }
  function warmMushaf() {
    const m = location.pathname.match(/\/page\/(\d+)\/?$/);
    if (!m) return;
    const n = +m[1];
    for (const d of [-1, 1, 2]) {
      const k = n + d;
      if (k >= 1 && k <= 604) preloadQcf(k);
    }
  }
  window.QM_TURN = function (n) {
    n = n | 0; if (n < 1) n = 1; if (n > 604) n = 604;
    let path = location.pathname;
    const pm = path.match(/^(.*\/page\/)\d+\/?$/);
    const hereLeaf = pm ? pm[1] + n + "/" : "";
    const href = hereLeaf || mushafTurnHref(n);
    if (!href) return false;
    if (!path.endsWith("/")) path += "/";
    if (window.__qmPop) { window.__qmPop = false; return false; }
    if (path === href) return false;
    if (Date.now() - (window.__qmTurnAt || 0) < 450) return true;
    if (!document.getElementById("page")) {
      window.__qmTurnAt = Date.now();
      turnLock = true;
      location.assign(href + location.search);
      return true;
    }
    window.__qmTurnAt = Date.now();
    history.pushState({ qm: n }, "", href + location.search);
    preloadQcf(n); preloadQcf(n + 1); preloadQcf(n - 1); preloadQcf(n + 2);
    queueMicrotask(function () {
      if (window.__qmPainting === n) return;
      if (window.QM_SHOW) window.QM_SHOW(n);
    });
    return false;
  };
  window.addEventListener("popstate", function () {
    const m = location.pathname.match(/\/page\/(\d+)\/?$/);
    if (!m || !window.QM_SHOW) return;
    window.__qmPop = true;
    window.__qmTurnAt = 0;
    window.QM_SHOW(+m[1]);
  });
  function settleTurn() {
    try { sessionStorage.removeItem("qm.turn"); } catch (e) {}
    document.documentElement.classList.remove("qm-turning");
  }
  settleTurn();
  warmMushaf();
  // A horizontal finger swipe on any real mushaf page opens the next page's address.
  let finger = null;
  const fingerStart = (x, y, target) => {
    if (target && target.closest && target.closest("a,button,input,textarea,select,label")) { finger = null; return; }
    finger = { x: x, y: y, target: target };
  };
  const fingerEnd = (x, y) => {
    if (!finger) return;
    const target = finger.target;
    const dx = x - finger.x, dy = y - finger.y;
    finger = null;
    if (target && target.closest && target.closest("#page,#gate,.qm-full")) return;
    if (Math.abs(dx) < 36 || Math.abs(dx) < Math.abs(dy)) return;
    const m = location.pathname.match(/\/page\/(\d+)\/?$/);
    if (!m) return;
    const n = +m[1] + (dx > 0 ? 1 : -1);
    if (n < 1 || n > 604) return;
    const full = document.querySelector(".qm-full");
    if (full && !full.hidden && mushafTurnHref(n) && full.dataset.kind && full.dataset.kind !== "tf") {
      try { sessionStorage.setItem("qm.reopen", full.dataset.kind); } catch (e) {}
    }
    window.__qmTurnDir = dx > 0 ? 1 : -1;
    QM_TURN(n);
  };
  document.addEventListener("touchstart", (e) => { if (e.touches.length !== 1) return; fingerStart(e.touches[0].clientX, e.touches[0].clientY, e.target); }, { capture: true, passive: true });
  document.addEventListener("touchend", (e) => { if (!e.changedTouches.length) return; fingerEnd(e.changedTouches[0].clientX, e.changedTouches[0].clientY); }, { capture: true, passive: true });
  document.addEventListener("pointerdown", (e) => { if (e.pointerType === "touch") return; fingerStart(e.clientX, e.clientY, e.target); }, true);
  document.addEventListener("pointerup", (e) => { if (e.pointerType === "touch") return; fingerEnd(e.clientX, e.clientY); }, true);
  async function openFull(kind, focusKey, pageN, enterFrom) {
    if (kind === "tf") {
      let key = focusKey;
      if (!key && window.QM_PAGE) { const pg0 = QM_PAGE(pageN); if (pg0 && pg0.keys && pg0.keys[0]) key = pg0.keys[0]; }
      const ps = key ? String(key).split(":") : [];
      if (ps.length === 2 && +ps[0] >= 1 && +ps[1] >= 1) {
        let id = "saadi";
        try { id = (prefs().tf) || "saadi"; } catch (e) {}
        if (!/^(saadi|muyassar|mukhtasar|ibnkathir|baghawi|samani|aysar|tabari|shinqiti|shawkani|uthaymeen|ibnhatim|thawri|zamanin|jawzi|qayyim|qasimi|mujahid|razzaq|mundhir|rajab|taymiyyah)$/.test(id)) id = "saadi";
        const ext = /^(mujahid|razzaq|mundhir|rajab|taymiyyah)$/.test(id) ? "https://t2.mushafuk.online/" : "https://tafsir.mushafuk.online/";
        if (ext) { location.assign(ext + id + "/" + (+ps[0]) + "/" + (+ps[1]) + "/#qmfrom=" + encodeURIComponent(location.href)); return; }
        location.assign("/tafsir/" + id + "/" + (+ps[0]) + "/" + (+ps[1]) + "/");
        return;
      }
    }
    if (!LIST.length) LIST = await (await fetch("./lib-list.json")).json();
    const pg = window.QM_PAGE(pageN); if (!pg) return;
    fsState = { kind, n: pg.n }; quranFont();
    fsEl.dataset.kind = kind;
    const p = prefs();
    const have = []; for (const r of LIST) if (r.k === kind && (await status(r.id)) >= 114) have.push(r);
    const r = have.find((x) => x.id === p[kind]) || have[0];
    if (!fsState || fsState.n !== pg.n || fsState.kind !== kind) return;
    fsEl.replaceChildren(); fsEl.dir = uiLang() === "ar" ? "rtl" : "ltr";
    const head = el("div", "qm-full-h");
    const [s0] = pg.keys[0].split(":").map(Number);
    const ttl = el("div", "qm-full-t"); ttl.append(el("b", "", NAMES[s0 - 1]), el("small", "", T("Səhifə") + " " + pg.n));
    const sw = el("div", "qm-switch");
    const LOCK = /\/page\/\d+\/?$/.test(location.pathname) && !mushafTurnHref(1); if (LOCK) sw.hidden = true;
    for (const k of (LOCK ? [kind] : kind === "ir" || kind === "wb" ? [kind, "tf", "tr"] : ["tr", "tf"])) { const b = el("button", k === kind ? "on" : "", k === "tf" ? T("Təfsir") : k === "tr" ? T("Tərcümə") : k === "ir" ? T("Erab") : T("Söz mənaları")); b.onclick = () => { if (k === "ir" && kind !== "ir") irReady = false; setPrefs({ tab: k }); openFull(k, null, pg.n); }; sw.append(b); }
    const x = icon("close", T("Bağla")); x.onclick = () => { fsEl.hidden = true; fsState = null; };
    head.append(ttl, sw, x); fsEl.append(head);
    const body = el("div", "qm-full-b"); body.style.touchAction = "pan-y"; body.style.minHeight = "0"; fsEl.append(body);
    if (kind === "ir" && !irReady && have.length > 1) {
      body.append(irChooser(have, (id) => { irReady = true; setPrefs({ ir: id }); openFull("ir", focusKey, pg.n); }));
      fsEl.hidden = false;
      if (document.documentElement.classList.contains("qm-turning") || sessionStorage.getItem("qm.turn")) settleTurn();
      return;
    }
    if (!r) {
      const box = el("div", "qm-empty"); box.append(el("p", "", T("Hələ endirilməyib.")));
      const b = el("button", "qm-rb main", T("Ayarlarda endir")); b.onclick = () => { fsEl.hidden = true; openSettings(kind); }; box.append(b); body.append(box);
    } else {
      body.append(el("p", "qm-full-src", (r.k === "tr" ? r.by + " · " : "") + r.name));
      let last = "";
      for (const key of pg.keys) {
        const [s, a] = key.split(":").map(Number);
        const blk = el("article", "qm-blk"); blk.dataset.k = key;
        if (a === 1) blk.append(el("h4", "qm-blk-s", NAMES[s - 1]));
        const ar = el("p", "qm-ar", forFont(await ayahText(s, a)) + " " + AR_DIG(a)); ar.dir = "rtl"; ar.lang = "ar"; ar.style.fontSize = 1.45 * p.fs + "rem"; blk.append(ar);
        const e = await entry(r.id, s, a);
        if (e && e.text && last !== s + ":" + e.from) { // a shared tafsir entry is shown once
          const t = el("div", "qm-tx2"); t.dir = r.dir; t.lang = r.lang; t.style.fontSize = (r.lang === "ar" ? 1.12 : 1) * p.fs + "rem";
          if (e.from !== e.to) t.append(el("small", "qm-range", s + ":" + e.from + "–" + e.to));
          for (const para of plain(e.text).split(/\n{2,}/)) t.append(el("p", "", para));
          blk.append(t); last = s + ":" + e.from;
        }
        body.append(blk);
      }

    }
    // page change by finger swipe only (same direction as the mushaf: swipe right = next page); the page follows the finger
    let d = null;
    body.onpointerdown = (ev) => { if (ev.target.closest("button")) return; d = { x: ev.clientX, y: ev.clientY, mode: null, dx: 0 }; };
    body.onpointermove = (ev) => {
      if (!d) return; const dx = ev.clientX - d.x, dy = ev.clientY - d.y;
      if (!d.mode) { if (Math.abs(dx) < 10 && Math.abs(dy) < 10) return; d.mode = Math.abs(dx) > Math.abs(dy) * 1.2 ? "x" : "y"; }
      if (d.mode !== "x") return;
      d.dx = dx;
    };
    const end = () => {
      const g = d; d = null; if (!g || g.mode !== "x") return;
      const n = pg.n + (g.dx > 0 ? 1 : -1);
      if (Math.abs(g.dx) > 32 && n >= 1 && n <= 604) {
        if (mushafTurnHref(n) && kind !== "tf") { try { sessionStorage.setItem("qm.reopen", kind); } catch (e) {} }
        if (!(window.QM_TURN && QM_TURN(n))) openFull(kind, null, n);
      }
    };
    body.onpointerup = end; body.onpointercancel = () => { d = null; };
    fsEl.hidden = false;
    const target = focusKey && body.querySelector('[data-k="' + focusKey + '"]');
    if (target) { target.classList.add("cur"); target.scrollIntoView({ block: "start" }); } else body.scrollTop = 0;
    if (document.documentElement.classList.contains("qm-turning") || sessionStorage.getItem("qm.turn")) settleTurn();
  }
  /* ---------- word meanings (as-Sirac): "word: meaning" lines ---------- */
  // Ibn Qutaybah: paragraphs; Qur'an words in ﴿…﴾ / (…) stand out, the editor's notes [[…]] go to numbered footnotes
  function renderGharib(box, t) {
    const notes = [];
    const wrap = el("div", "qm-gh"); wrap.dir = "rtl"; wrap.lang = "ar";
    for (const para of t.split(/\n+/)) {
      const p = el("p", "");
      for (const part of para.split(/(\[\[[\s\S]*?\]\]|﴿[^﴾]*﴾|\((?:[^()\d٠-٩]){2,}\))/)) {
        if (!part) continue;
        if (part.startsWith("[[")) { notes.push(part.slice(2, -2).trim()); p.append(el("sup", "qm-gh-n", AR_DIG(notes.length))); }
        else if (part.startsWith("﴿") || part.startsWith("(")) p.append(el("b", "qm-gh-q", part));
        else p.append(part);
      }
      wrap.append(p);
    }
    if (notes.length) { const ol = el("ol", "qm-gh-notes"); for (const n of notes) ol.append(el("li", "", n)); wrap.append(ol); }
    box.append(wrap);
  }
  // plain text whose editor's notes come as [[…]]: numbered marks, the notes listed under the text
  function renderNoted(box, t) {
    const notes = [];
    for (const para of t.split(/\n+/)) {
      if (!para.trim()) continue;
      const p = el("p", "");
      for (const part of para.split(/(\[\[[\s\S]*?\]\](?!\]))/)) {
        if (!part) continue;
        if (part.startsWith("[[") && part.endsWith("]]")) { notes.push(part.slice(2, -2).trim()); p.append(el("sup", "qm-gh-n", AR_DIG(notes.length))); }
        else p.append(part);
      }
      box.append(p);
    }
    if (notes.length) { const ol = el("ol", "qm-gh-notes"); for (const n of notes) ol.append(el("li", "", n)); box.append(ol); }
  }
  function renderWb(box, text, id) {
    const t = String(text || "").trim();
    if (!t) { box.append(el("p", "qm-wb-none", T("Bu ayədə çətin söz izahı yoxdur"))); return; }
    if (id === "ibnqutaybah") return renderGharib(box, t);
    const ul = el("dl", "qm-wb"); ul.dir = "rtl"; ul.lang = "ar";
    for (const line of t.split(/\n+/)) {
      const i = line.indexOf(":");
      const row = el("div", "qm-wb-r");
      if (i > 0) row.append(el("dt", "", line.slice(0, i).trim()), el("dd", "", line.slice(i + 1).trim()));
      else row.append(el("dd", "", line.trim()));
      ul.append(row);
    }
    box.append(ul);
  }

  /* ---------- words of an ayah: Arabic word, root (Quranic Arabic Corpus), as-Sirac note ---------- */
  const bare = (t) => String(t || "").replace(/[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED\u0640]/g, "").replace(/[ٱأإآ]/g, "ا").replace(/ى/g, "ي").replace(/ة/g, "ه").replace(/\s+/g, " ").trim();
  // word ↔ headword matching (Sirac, Ibn Qutaybah): Uthmani and plain spellings meet on a shared skeleton
  const wmNorm = (t) => String(t || "").replace(/ص\u06DC/g, "س").replace(/[ايى]\u06DF/g, "")
    .replace(/وٰ/g, "ا").replace(/ىٰ/g, "ا").replace(/\u0670/g, "ا").replace(/([هء][\u064B-\u065F]*)[ۥۦ]/g, "$1").replace(/ۥ/g, "و").replace(/[ۦۧ]/g, "ي")
    .replace(/[\u0610-\u061A\u064B-\u065F\u06D6-\u06ED\u0640]/g, "")
    .replace(/[ٱأإآ]/g, "ا").replace(/[ؤئ]/g, "ء").replace(/ى/g, "ي").replace(/ة/g, "ه").replace(/[^\u0621-\u064A ]/g, "").replace(/\s+/g, " ").trim();
  const wmKey = (n) => n.replace(/[اء]/g, "").replace(/ي$/, "").replace(/(.)\1+/g, "$1");
  const WM_PRE = /^(?:[وف]?(?:[بلك]|س)?(?:ال|لل)?)/, WM_SUF = /(?:هما|كما|هم|هن|كم|كن|نا|ها|ه|ك|ي)$/;
  const wmStem = (n) => { let x = n.replace(WM_PRE, ""); if (x.length < 3) x = n.replace(/^[وف]/, ""); const y = x.replace(WM_SUF, ""); return wmKey(y.length >= 3 ? y : x); };
  // tier: 3 same letters, 2 same skeleton, 1 same stem (prefixes / attached pronouns aside)
  const wmLoose = (n) => n.replace(/^ء/, "").replace(/(?!^)[اىيء]/g, "");
  const wmK2 = (h, w, m = 2) => { const a = wmKey(h), b = wmKey(w); if (a.length >= m) return a === b || wmKey(h.replace(/ه$/, "ت")) === b; return w.length >= 3 && wmLoose(h).length >= 2 && wmLoose(h) === wmLoose(w); }; // short words (أنى، آوى): vowels aside
  const wmTier = (h, w) => (h === w ? 3 : wmK2(h, w) || wmK2(h.replace(/^[وف]/, ""), w.replace(/^[وف]/, ""), 3) ? 2 : wmStem(h).length >= 3 && wmStem(h) === wmStem(w) ? 1 : 0);
  // indices of the ayah words a headword (one word or a phrase) belongs to; [] when none
  function wmAttach(words, head) {
    const W = words.map((w) => wmNorm(w).replace(/ /g, "")), H = wmNorm(head).split(" ").filter(Boolean);
    if (!H.length) return [];
    let best = [], bs = 0;
    for (let i = 0; i + H.length <= W.length; i++) {
      let sc = 0; for (let j = 0; j < H.length; j++) { const t = wmTier(H[j], W[i + j]); if (!t) { sc = 0; break; } sc += t; }
      if (sc > bs) { bs = sc; best = H.map((_, j) => i + j); } else if (sc && sc === bs) best = best.concat(H.map((_, j) => i + j));
    }
    if (best.length || H.length < 2) return best;
    const J = wmKey(H.join("")); W.forEach((w, i) => { if (wmKey(w) === J) best.push(i); }); if (best.length) return best; // يا ويلتى → يـٰويلتى
    // phrase not contiguous in the mushaf words (e.g. a word left out): every word of it that is found
    const hit = []; H.forEach((h) => { if (h === "الله") return; W.forEach((w, i) => { if (wmTier(h, w) >= 2 && !hit.includes(i)) hit.push(i); }); });
    return hit.length * 2 >= H.length ? hit : [];
  }
  const wbText = async (id, s, a) => { const v = await get(id + ":" + s); return v ? v[a - 1] || "" : ""; };
  const siracRows = (t) => t.split(/\n+/).map((l) => { const i = l.indexOf(":"); return i > 0 ? { w: l.slice(0, i).trim(), m: l.slice(i + 1).trim() } : null; }).filter(Boolean);
  // Sirac entries for word #pos of s:a (and the words they cover); an entry filed under a neighbouring ayah counts when it fits nowhere there
  async function siracAt(s, a, pos, words) {
    if ((await status("seraj")) < 114) return null;
    const all = (await get("wbw:" + s)) || (await get("seraj:w:" + s)) || [];
    const out = [], span = new Set();
    const take = (x, idx) => { if (idx.includes(pos - 1)) { out.push(x); idx.forEach((i) => span.add(i)); } };
    for (const x of siracRows(await wbText("seraj", s, a))) take(x, wmAttach(words, x.w));
    if (!out.length) for (const b of [a - 1, a + 1]) {
      if (!all[b - 1]) continue;
      for (const x of siracRows(await wbText("seraj", s, b))) if (!wmAttach(all[b - 1], x.w).length) take(Object.assign({ far: b }, x), wmAttach(words, x.w));
    }
    return { rows: out, span: [...span] };
  }
  async function wordsOf(s, a) {
    const have = []; for (const id of ["seraj", "ibnqutaybah"]) if ((await status(id)) >= 114) have.push(id);
    if (!have.length) return null;
    const v = (await get("wbw:" + s)) || (await get("seraj:w:" + s)); return v ? v[a - 1] || [] : null;
  }
  // Ibn Qutaybah: the lines of the ayah's entry whose quoted Qur'an words (﴿…﴾ or (…)) cover the word
  async function qutaybahAt(s, a, pos, words) {
    if ((await status("ibnqutaybah")) < 114) return undefined;
    const out = [], span = new Set();
    for (const line of (await wbText("ibnqutaybah", s, a)).split(/\n+/)) {
      const qs = [...line.replace(/\[\[[\s\S]*?\]\]/g, "").matchAll(/﴿([^﴾]*)﴾|\(([^()\d٠-٩]{2,})\)/g)].map((m) => m[1] || m[2]);
      const hit = qs.map((q) => wmAttach(words, q)).find((idx) => idx.includes(pos - 1));
      if (hit) { out.push(line.replace(/\s*\[\[[\s\S]*?\]\]\s*/g, " ").replace(/^و(?=[﴿(])/, "").trim()); hit.forEach((i) => span.add(i)); }
    }
    return { rows: out, span: [...span] };
  }
  const noteEl = (sx, w) => { const n = el("p", "qm-w-sirac"); n.append(el("small", "", T("Sirac")), el("span", "", (wmNorm(sx.w) !== wmNorm(w) ? sx.w + ": " : "") + sx.m)); return n; };
  // which books the word balloon shows: "both" | "seraj" | "ibnqutaybah" (shared by the balloon's ⚙ and Settings)
  const popPref = () => { const v = prefs().wpop; return v === "seraj" || v === "ibnqutaybah" ? v : "both"; };
  async function popHave() { return { seraj: (await status("seraj")) >= 114, ibnqutaybah: (await status("ibnqutaybah")) >= 114 }; }
  // the balloon's content: the word, the chosen books' notes, the reference; returns the word indices to light up
  async function popBody(box, w, sx, iq, ref, s) {
    const pick = popPref(), have = await popHave();
    const useS = sx && (pick !== "ibnqutaybah" || !have.ibnqutaybah), useQ = iq && (pick !== "seraj" || !have.seraj);
    box.append(el("b", "qm-w-ar", forFont(w)));
    const span = new Set();
    if (useS) { for (const x of sx.rows) box.append(noteEl(x, w)); sx.span.forEach((i) => span.add(i)); }
    if (useQ) { for (const t of iq.rows) { const n = el("p", "qm-w-sirac qm-w-iq"); n.append(el("small", "", T("İbn Qutəybə")), el("span", "", t)); box.append(n); } iq.span.forEach((i) => span.add(i)); }
    if (!(useS && sx.rows.length) && !(useQ && iq.rows.length)) box.append(el("p", "qm-w-none", useS && !useQ ? T("Bu söz üçün Sirac izahı yoxdur") : T("Bu söz üçün izah yoxdur")));
    box.append(el("small", "qm-wp-ref", (s ? NAMES[s - 1] + " " : "") + ref));
    return [...span];
  }
  // Sirac / İbn Qutaybah / both; a book that is not downloaded cannot be picked
  function popChooser(onPick) {
    const row = el("div", "qm-wp-ch"); row.dir = uiLang() === "ar" ? "rtl" : "ltr";
    popHave().then((have) => {
      const cur = popPref();
      for (const [v, label, ok] of [["seraj", T("Sirac"), have.seraj], ["ibnqutaybah", T("İbn Qutəybə"), have.ibnqutaybah], ["both", T("Hər ikisi"), have.seraj && have.ibnqutaybah]]) {
        const b = el("button", "qm-wp-opt" + (v === cur ? " on" : ""), label); b.disabled = !ok; b.setAttribute("aria-pressed", v === cur);
        b.onclick = (ev) => { ev.stopPropagation(); setPrefs({ wpop: v }); onPick(v); };
        row.append(b);
      }
    });
    return row;
  }
  // Settings: the same chooser with a live balloon on غِشَاوَةٌ (2:7), a word both books explain
  async function openPopSettings() {
    const ov = el("div", "qm-wps"); const card = el("div", "qm-wps-card"); ov.append(card);
    const close = () => ov.remove(); ov.onclick = (e) => { if (e.target === ov) close(); };
    const draw = async () => {
      card.replaceChildren();
      const h = el("div", "qm-wps-h"); h.append(el("b", "", T("Söz pəncərəsi"))); const x = icon("close", T("Bağla")); x.onclick = close; h.append(x); card.append(h);
      card.append(el("p", "qm-wps-tip", T("İki dəfə toxunduqda pəncərədə nə görünsün?")));
      card.append(popChooser(draw));
      const prev = el("div", "qm-wpop qm-wps-prev"); prev.dir = "rtl"; card.append(el("p", "qm-wps-tip", T("Nümunə")), prev);
      const words = ((await get("wbw:2")) || [])[6] || ["خَتَمَ", "ٱللَّهُ", "عَلَىٰ", "قُلُوبِهِمْ", "وَعَلَىٰ", "سَمْعِهِمْ ۖ", "وَعَلَىٰٓ", "أَبْصَـٰرِهِمْ", "غِشَـٰوَةٌۭ ۖ"];
      await quranFont();
      const sx = await siracAt(2, 7, 9, words), iq = await qutaybahAt(2, 7, 9, words);
      const demoS = sx || { rows: [{ w: "غِشَاوَةٌ", m: "غِطَاءٌ." }], span: [] }, demoQ = iq || { rows: ["والغِشَاوَة: الغطاء."], span: [] };
      await popBody(prev, words[8], demoS, demoQ, "2:7 · 9", 2);
    };
    document.body.append(ov); await draw();
  }
  // double-tap on a mushaf word: a small balloon next to it
  const wpop = el("div", "qm-wpop"); wpop.hidden = true; document.body.appendChild(wpop);
  const closeWpop = () => { if (wpop.hidden) return; wpop.hidden = true; wpop.replaceChildren(); document.querySelectorAll(".w.wsel").forEach((x) => x.classList.remove("wsel")); };
  document.addEventListener("pointerdown", (ev) => { if (!wpop.hidden && !wpop.contains(ev.target)) closeWpop(); }, true);
  async function wordPop(key, pos, elw, chooser) {
    closeWpop();
    const [s, a] = key.split(":").map(Number);
    const list = await wordsOf(s, a); await quranFont();
    const item = list && list[pos - 1];
    elw.classList.add("wsel");
    wpop.dir = "rtl";
    if (!list) {
      wpop.dir = uiLang() === "ar" ? "rtl" : "ltr";
      wpop.append(el("p", "qm-wp-none", T("Söz mənaları") + ": " + T("Hələ endirilməyib.")));
      const b = el("button", "qm-rb main", T("Ayarlarda endir")); b.onclick = () => { closeWpop(); openSettings("wb"); }; wpop.append(b);
    } else if (item) {
      const sx = await siracAt(s, a, pos, list), iq = await qutaybahAt(s, a, pos, list);
      const span = await popBody(wpop, item, sx, iq, s + ":" + a + " · " + pos, s);
      const ws = [...document.querySelectorAll('.ay[data-k="' + key + '"] .w')];
      for (const i of span) ws[i] && ws[i].classList.add("wsel"); // a phrase entry lights up every word it covers
      const gear = icon("settings", T("Söz pəncərəsi")); gear.classList.add("qm-wp-gear");
      const ch = popChooser(() => wordPop(key, pos, elw, true)); ch.hidden = !chooser;
      gear.onclick = (ev) => { ev.stopPropagation(); ch.hidden = !ch.hidden; place(); };
      wpop.prepend(gear); wpop.append(ch);
    } else { elw.classList.remove("wsel"); return; }
    wpop.hidden = false;
    const place = () => {
      const r = elw.getBoundingClientRect(), pw = wpop.offsetWidth, ph = wpop.offsetHeight;
      const x = Math.max(8, Math.min(innerWidth - pw - 8, r.left + r.width / 2 - pw / 2));
      const y = r.top - ph - 10 >= 8 ? r.top - ph - 10 : Math.min(innerHeight - ph - 8, r.bottom + 10);
      wpop.style.left = x + "px"; wpop.style.top = y + "px";
      wpop.style.setProperty("--ax", r.left + r.width / 2 - x + "px");
      wpop.classList.toggle("below", y > r.top);
    };
    place();
  }

  /* ---------- compare sources on one ayah (swipe columns) ---------- */
  const cmpEl = el("div", "qm-cmp"); cmpEl.hidden = true; document.body.appendChild(cmpEl);
  let cmpCur = null;
  async function downloaded() { const out = []; for (const r of LIST) if ((await status(r.id)) >= 114) out.push(r); return out; }
  // the user's sources in the user's order; default: every downloaded source in Settings order
  const cmpSources = (have) => { const p = prefs(); if (!Array.isArray(p.cmp)) return have; const by = new Map(have.map((r) => [r.id, r])); return p.cmp.map((id) => by.get(id)).filter(Boolean); };
  const srcLabel = (r) => (r.k === "tr" ? r.by + " · " + r.name : r.k === "wb" ? T("Söz mənaları") + " · " + wbShort(r) : r.name);
  const wbShort = (r) => (r.id === "seraj" ? T("Sirac") : r.id === "ibnqutaybah" ? T("İbn Qutəybə") : r.name);
  // tap a compare card -> fullscreen for that source; back returns to the same card/scroll
  function cmpZoom(card, body, label) {
    const fz = el("div", "qm-cmp-fs"); fz.dir = cmpEl.dir;
    const h = el("div", "qm-cmp-h"); const back = icon("close", T("Bağla"));
    const ttl = el("div", "qm-full-t"); const nm = el("b", "", label); nm.dir = "auto"; ttl.append(el("small", "", T("Müqayisə")), nm);
    h.append(back, ttl); const sc = el("div", "qm-cmp-fs-b"); fz.append(h, sc);
    const ph = document.createComment("b"); body.replaceWith(ph); sc.append(body); cmpEl.append(fz);
    const close = () => { ph.replaceWith(body); fz.remove(); window.removeEventListener("popstate", onPop); };
    const onPop = () => close();
    history.pushState({ qmCmpFs: 1 }, ""); window.addEventListener("popstate", onPop);
    back.onclick = () => history.back();
  }
  async function openCompare(s, a) {
    if (!LIST.length) LIST = await (await fetch("./lib-list.json")).json();
    cmpCur = { s, a }; quranFont();
    const have = await downloaded(); const list = cmpSources(have); const p = prefs();
    const ar = await ayahText(s, a);
    const es = await Promise.all(list.map((r) => entry(r.id, s, a)));
    const fns = await Promise.all(list.map(async (r) => (r.k === "tr" ? ((await get(r.id + ":f:" + s)) || [])[a - 1] : "")));
    if (!cmpCur || cmpCur.s !== s || cmpCur.a !== a) return;
    window.QM_GOTO ? window.QM_GOTO(s + ":" + a) : window.QM_HL && window.QM_HL(s + ":" + a);
    cmpEl.replaceChildren(); cmpEl.dir = uiLang() === "ar" ? "rtl" : "ltr";
    const head = el("div", "qm-cmp-h");
    const x = icon("close", T("Bağla")); x.onclick = () => { cmpEl.hidden = true; cmpCur = null; };
    const ttl = el("div", "qm-full-t"); ttl.append(el("small", "", T("Müqayisə")), el("b", "", NAMES[s - 1] + " · " + a));
    const max = AYAHS[s - 1];
    const pv = el("button", "qm-step", "‹"), nx = el("button", "qm-step", "›");
    pv.setAttribute("aria-label", T("Əvvəlki")); nx.setAttribute("aria-label", T("Növbəti"));
    pv.disabled = s === 1 && a === 1; nx.disabled = s === 114 && a === max;
    pv.onclick = () => (a > 1 ? openCompare(s, a - 1) : openCompare(s - 1, AYAHS[s - 2]));
    nx.onclick = () => (a < max ? openCompare(s, a + 1) : openCompare(s + 1, 1));
    const ed = el("button", "qm-cmp-ed", "✎ " + T("Mənbələr")); ed.onclick = () => pickSources(have, s, a);
    head.append(x, ttl, pv, nx, ed); cmpEl.append(head);
    const ay = el("div", "qm-cmp-ar", forFont(ar) + " " + AR_DIG(a)); ay.dir = "rtl"; ay.lang = "ar"; ay.style.fontSize = 1.3 * p.fs + "rem"; cmpEl.append(ay);
    if (!list.length) {
      const box = el("div", "qm-empty"); box.append(el("p", "", T("Hələ endirilməyib.")));
      const b = el("button", "qm-rb main", T("Ayarlarda endir")); b.onclick = () => { cmpEl.hidden = true; openSettings(); }; box.append(b);
      if (have.length) { const c = el("button", "qm-rb", "✎ " + T("Mənbələri seç")); c.onclick = () => pickSources(have, s, a); box.append(c); }
      cmpEl.append(box); cmpEl.hidden = false; return;
    }
    const tabs = el("div", "qm-cmp-tabs"), rail = el("div", "qm-cmp-rail"), dots = el("div", "qm-cmp-dots");
    const cards = list.map((r, i) => {
      const t = el("button", "qm-cmp-tab", r.k === "wb" ? wbShort(r) : r.k === "tr" ? r.by : r.name); t.dir = "auto"; t.onclick = () => go(i, true); tabs.append(t);
      dots.append(el("i"));
      const c = el("article", "qm-cmp-card"); c.dataset.id = r.id;
      const h = el("h4", ""); const nm = el("span", "", srcLabel(r)); nm.dir = "auto"; h.append(nm, el("small", "", i + 1 + "/" + list.length)); c.append(h);
      const body = el("div", "qm-cmp-tx"); body.dir = r.dir; body.lang = r.lang; body.style.fontSize = p.fs * (r.lang === "ar" ? 1.12 : 1) + "rem";
      const e = es[i];
      if (r.k === "wb") renderWb(body, e ? e.text : "", r.id);
      else {
        if (e && e.from !== e.to) body.append(el("small", "qm-range", s + ":" + e.from + "–" + e.to));
        const txt = e && e.text ? plain(e.text) : "—";
        if (txt.includes("[[")) renderNoted(body, txt); else for (const para of txt.split(/\n{2,}/)) body.append(el("p", "", para));
        if (fns[i]) body.append(el("p", "qm-fn", plain(fns[i])));
      }
      c.append(body); rail.append(c);
      c.onclick = (ev) => { if (ev.target.closest("button,a,input,.qm-wpop") || (window.getSelection && String(window.getSelection()))) return; cmpZoom(c, body, srcLabel(r)); };
      return c;
    });
    cmpEl.append(tabs, rail);
    if (list.length < 2) { const h = el("button", "qm-cmp-hint", T("Müqayisə üçün Ayarlardan daha bir mənbə endirin") + " ›"); h.onclick = () => { cmpEl.hidden = true; openSettings(); }; cmpEl.append(h); }
    cmpEl.append(dots);
    let at = -1;
    const mark = (i) => { if (i === at) return; at = i; [...tabs.children].forEach((t, j) => t.classList.toggle("on", j === i)); [...dots.children].forEach((d, j) => d.classList.toggle("on", j === i)); tabs.children[i] && tabs.children[i].scrollIntoView({ block: "nearest", inline: "nearest" }); setPrefs({ cmpCur: list[i].id }); };
    const go = (i, smooth) => { const c = cards[i]; if (!c) return; rail.scrollTo({ left: c.offsetLeft - cards[0].offsetLeft, behavior: smooth ? "smooth" : "auto" }); mark(i); };
    rail.onscroll = () => { let best = 0, bd = Infinity; cards.forEach((c, j) => { const d = Math.abs(c.offsetLeft - cards[0].offsetLeft - rail.scrollLeft); if (d < bd) { bd = d; best = j; } }); mark(best); };
    cmpEl.hidden = false;
    const keep = Math.max(0, list.findIndex((r) => r.id === p.cmpCur));
    requestAnimationFrame(() => go(keep, false));
  }
  function pickSources(have, s, a) {
    const cur = cmpSources(have).map((r) => r.id);
    const order = [...cur, ...have.map((r) => r.id).filter((id) => !cur.includes(id))];
    const on = new Set(cur);
    menu.replaceChildren(); menu.hidden = false;
    const box = el("div", "qm-menu-box qm-pick-src"); box.dir = uiLang() === "ar" ? "rtl" : "ltr";
    box.append(el("h3", "", T("Mənbələri seç")));
    const ul = el("ul", "qm-src-list"); box.append(ul);
    const draw = () => {
      ul.replaceChildren();
      order.forEach((id, i) => {
        const r = have.find((x) => x.id === id); const li = el("li", on.has(id) ? "on" : "");
        const ck = el("button", "qm-ck", on.has(id) ? "✓" : ""); ck.setAttribute("aria-label", srcLabel(r));
        const nm = el("span", "", srcLabel(r)); nm.dir = "auto";
        const up = el("button", "qm-mv", "↑"), dn = el("button", "qm-mv", "↓"); up.disabled = i === 0; dn.disabled = i === order.length - 1;
        const tog = () => { on.has(id) ? on.delete(id) : on.add(id); draw(); };
        ck.onclick = tog; nm.onclick = tog;
        up.onclick = () => { [order[i - 1], order[i]] = [order[i], order[i - 1]]; draw(); };
        dn.onclick = () => { [order[i + 1], order[i]] = [order[i], order[i + 1]]; draw(); };
        li.append(ck, nm, up, dn); ul.append(li);
      });
    };
    draw();
    const row = el("div", "qm-prev-row");
    const no = el("button", "qm-rb", T("Ləğv")); no.onclick = () => { menu.hidden = true; };
    const ok = el("button", "qm-rb main", T("Hazır")); ok.onclick = () => { setPrefs({ cmp: order.filter((id) => on.has(id)) }); menu.hidden = true; openCompare(s, a); };
    row.append(no, ok); box.append(row); menu.append(box);
    menu.onclick = (ev) => { if (ev.target === menu) menu.hidden = true; };
  }
  window.QM = { openPlan, openHifz, hifzProgress, openNotes, openNote, openSettings, openFull, openFullHere: () => { const k = prefs().tab === "tr" ? "tr" : "tf"; const f = cur ? cur.s + ":" + cur.a : null; openFull(k, f); }, openAyah, openCompare, wordPop, closeWordPop: closeWpop, selecting: () => !!sel, tapAyah, t: T };
  try {
    const reopen = sessionStorage.getItem("qm.reopen");
    const turning = !!sessionStorage.getItem("qm.turn");
    if (reopen === "tr" || reopen === "tf" || reopen === "wb" || reopen === "ir") {
      sessionStorage.removeItem("qm.reopen");
      const want = +(location.pathname.match(/\/page\/(\d+)\/?$/) || [0, 0])[1];
      if (want && mushafTurnHref(want)) (function w(i) {
        const q = window.QM_PAGE && QM_PAGE();
        if (q && q.n === want) { openFull(reopen, null, want); return; }
        if (i < 200) setTimeout(() => w(i + 1), 100);
      })(0);
    }
    if (turning) {
      const dedicated = /\/page\/\d+\/?$/.test(location.pathname) && !mushafTurnHref(1);
      if (!dedicated && !reopen) {
        (function w(i) {
          const page = document.getElementById("page");
          if ((page && page.childElementCount) || i > 30) settleTurn();
          else setTimeout(() => w(i + 1), 40);
        })(0);
      } else setTimeout(() => { try { if (sessionStorage.getItem("qm.turn")) settleTurn(); } catch (e) {} }, 2200);
    }
  } catch (e) {}
  (async () => {
    try { if (!LIST.length) LIST = await (await fetch("./lib-list.json")).json(); } catch (e) {}
    refreshUi();
  })();
})();

;try{var qs=document.createElement("script");qs.src="https://mushafuk.online/read-shelf.js?v=3";document.head.appendChild(qs);}catch(e){}
