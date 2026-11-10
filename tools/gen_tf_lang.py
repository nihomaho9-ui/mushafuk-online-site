#!/usr/bin/env python3
"""Ayah pages for tafsir translations that exist as open JSON (spa5k/QUL)."""
import html, json, os, re, sys, time, urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(R)
E = html.escape
B = "https://mushafuk.online"
CACHE = "/tmp/tfsrc"
DIG = "٠١٢٣٤٥٦٧٨٩"

def arn(n):
    return "".join(DIG[int(c)] for c in str(n))

ARN = re.search(r'const ARNAMES = "([^"]*)"', open("quran/index.html", encoding="utf8").read()).group(1).split(",")
TXT = {}
for line in open("quran-uthmani.txt", encoding="utf8"):
    p = line.rstrip("\n").split("|")
    if len(p) == 3:
        TXT[(int(p[0]), int(p[1]))] = p[2]
ORDER = sorted(TXT)
assert len(ORDER) == 6236, len(ORDER)

# Turkish "Ibn Kathir" on this API is a meal, not a tafsir. Muyassar has no translation.
EDITIONS = {
    "ibnkathir": {
        "en": dict(slug="en-tafisr-ibn-kathir", src="Tafsir Ibn Kathir", dir="ltr", lang="en",
                   ayah="Ayah", prev="Previous ayah", nxt="Next ayah", sub="Each ayah on its own page"),
        "ru": dict(slug="ru-tafsir-ibne-kahtir", src="Тафсир Ибн Касир", dir="ltr", lang="ru",
                   ayah="Аят", prev="Предыдущий аят", nxt="Следующий аят", sub="Каждый аят — отдельная страница"),
        "ur": dict(slug="tafseer-ibn-e-kaseer-urdu", src="تفسیر ابن کثیر", dir="rtl", lang="ur",
                   ayah="آیت", prev="پچھلی آیت", nxt="اگلی آیت", sub="ہر آیت الگ صفحہ"),
        "bn": dict(slug="bn-tafseer-ibn-e-kaseer", src="তাফসীর ইবনে কাসির", dir="ltr", lang="bn",
                   ayah="আয়াত", prev="আগের আয়াত", nxt="পরের আয়াত", sub="প্রতিটি আয়াত আলাদা পাতা"),
    },
    "saadi": {
        "tr": dict(slug="turkish-tafsir-as-saadi-turkish", src="Tefsirü's-Sa'dî", dir="ltr", lang="tr",
                   ayah="Ayet", prev="Önceki ayet", nxt="Sonraki ayet", sub="Her ayet bir sayfa"),
        "ru": dict(slug="tafsir-as-saadi-russian", src="Тафсир ас-Саади", dir="ltr", lang="ru",
                   ayah="Аят", prev="Предыдущий аят", nxt="Следующий аят", sub="Каждый аят — отдельная страница"),
        "ur": dict(slug="ur-tafsir-as-saadi-urdu", src="تفسیر السعدی", dir="rtl", lang="ur",
                   ayah="آیت", prev="پچھلی آیت", nxt="اگلی آیت", sub="ہر آیت الگ صفحہ"),
        "id": dict(slug="id-tafsir-as-saadi", src="Tafsir As-Saadi", dir="ltr", lang="id",
                   ayah="Ayat", prev="Ayat sebelumnya", nxt="Ayat berikutnya", sub="Setiap ayat satu halaman"),
        "fa": dict(slug="fr-tafsir-as-saadi", src="تفسیر السعدی", dir="rtl", lang="fa",
                   ayah="آیه", prev="آیهٔ پیشین", nxt="آیهٔ بعد", sub="هر آیه یک صفحه"),
        "sq": dict(slug="sq-saadi", src="Tefsiri i Saadiut", dir="ltr", lang="sq",
                   ayah="Ajeti", prev="Ajeti i mëparshëm", nxt="Ajeti tjetër", sub="Çdo ajet një faqe"),
    },
    "mukhtasar": {
        "az": dict(slug="azeri-mokhtasar", src="Muxtəsər təfsir", dir="ltr", lang="az",
                   ayah="Ayə", prev="Əvvəlki ayə", nxt="Növbəti ayə", sub="Hər ayə bir səhifə"),
        "tr": dict(slug="turkish-mokhtasar", src="Muhtasar Tefsir", dir="ltr", lang="tr",
                   ayah="Ayet", prev="Önceki ayet", nxt="Sonraki ayet", sub="Her ayet bir sayfa"),
        "en": dict(slug="en-tafsir-al-mukhtasar", src="Al-Mukhtasar", dir="ltr", lang="en",
                   ayah="Ayah", prev="Previous ayah", nxt="Next ayah", sub="Each ayah on its own page"),
        "ru": dict(slug="russian-mokhtasar", src="Тафсир аль-Мухтасар", dir="ltr", lang="ru",
                   ayah="Аят", prev="Предыдущий аят", nxt="Следующий аят", sub="Каждый аят — отдельная страница"),
        "uz": dict(slug="uzbek-mokhtasar", src="Мухтасар тафсир", dir="ltr", lang="uz",
                   ayah="Оят", prev="Олдинги оят", nxt="Кейинги оят", sub="Ҳар бир оят алоҳида саҳифа"),
        "ug": dict(slug="uyghur-mokhtasar", src="مۇختەسەر تەفسىر", dir="rtl", lang="ug",
                   ayah="ئايەت", prev="ئالدىنقى ئايەت", nxt="كېيىنكى ئايەت", sub="ھەر بىر ئايەت ئايرىم بەت"),
        "ky": dict(slug="kyrgyz-mokhtasar", src="Мухтасар тафсир", dir="ltr", lang="ky",
                   ayah="Аят", prev="Мурунку аят", nxt="Кийинки аят", sub="Ар бир аят өзүнчө барак"),
        "ku": dict(slug="kurdish-mokhtasar", src="تەفسیری موختەسەر", dir="rtl", lang="ku",
                   ayah="ئایەت", prev="ئایەتی پێشوو", nxt="ئایەتی داهاتوو", sub="هەر ئایەتێک لاپەڕەیەک"),
        "fa": dict(slug="persian-mokhtasar", src="تفسیر المختصر", dir="rtl", lang="fa",
                   ayah="آیه", prev="آیهٔ پیشین", nxt="آیهٔ بعد", sub="هر آیه یک صفحه"),
        "ps": dict(slug="pashto-mokhtasar", src="مختصر تفسیر", dir="rtl", lang="ps",
                   ayah="آیت", prev="مخکینۍ آیت", nxt="راتلونکې آیت", sub="هر آیت جلا پاڼه"),
        "id": dict(slug="indonesian-mokhtasar", src="Tafsir Al-Mukhtasar", dir="ltr", lang="id",
                   ayah="Ayat", prev="Ayat sebelumnya", nxt="Ayat berikutnya", sub="Setiap ayat satu halaman"),
        "bn": dict(slug="bengali-mokhtasar", src="আল-মুখতাসার", dir="ltr", lang="bn",
                   ayah="আয়াত", prev="আগের আয়াত", nxt="পরের আয়াত", sub="প্রতিটি আয়াত আলাদা পাতা"),
        "as": dict(slug="assamese-mokhtasar", src="আল-মুখতাচাৰ", dir="ltr", lang="as",
                   ayah="আয়াত", prev="আগৰ আয়াত", nxt="পৰৱৰ্তী আয়াত", sub="প্ৰতিটো আয়াত এটা পৃষ্ঠা"),
        "hi": dict(slug="hindi-mokhtasar", src="तफ़सीर अल-मुख़्तसर", dir="ltr", lang="hi",
                   ayah="आयत", prev="पिछली आयत", nxt="अगली आयत", sub="हर आयत एक पृष्ठ"),
        "fr": dict(slug="french-mokhtasar", src="Tafsir Al-Mukhtasar", dir="ltr", lang="fr",
                   ayah="Verset", prev="Verset précédent", nxt="Verset suivant", sub="Chaque verset a sa page"),
        "es": dict(slug="spanish-mokhtasar", src="Tafsir Al-Mujtasar", dir="ltr", lang="es",
                   ayah="Aleya", prev="Aleya anterior", nxt="Aleya siguiente", sub="Cada aleya en su página"),
        "bs": dict(slug="bosnian-mokhtasar", src="Tefsir El-Muhtesar", dir="ltr", lang="bs",
                   ayah="Ajet", prev="Prethodni ajet", nxt="Sljedeći ajet", sub="Svaki ajet je posebna stranica"),
        "sr": dict(slug="serbian-mokhtasar", src="Тефсир Ел-Мухтасар", dir="ltr", lang="sr",
                   ayah="Ајет", prev="Претходни ајет", nxt="Следећи ајет", sub="Сваки ајет је посебна страница"),
        "it": dict(slug="italian-mokhtasar", src="Tafsir Al-Mukhtasar", dir="ltr", lang="it",
                   ayah="Versetto", prev="Versetto precedente", nxt="Versetto successivo", sub="Ogni versetto è una pagina"),
        "ff": dict(slug="fulani-mokhtasar", src="Tafsir Al-Mukhtasar", dir="ltr", lang="ff",
                   ayah="Aaya", prev="Aaya ɓennuɗo", nxt="Aaya garoowo", sub="Aaya kala ko hello"),
        "zh": dict(slug="chinese-mokhtasar", src="简明古兰经注", dir="ltr", lang="zh",
                   ayah="节", prev="上一节", nxt="下一节", sub="每节一页"),
        "ja": dict(slug="japanese-mokhtasar", src="ムフタサル", dir="ltr", lang="ja",
                   ayah="節", prev="前の節", nxt="次の節", sub="各節が一ページ"),
        "vi": dict(slug="vietnamese-mokhtasar", src="Tafsir Al-Mukhtasar", dir="ltr", lang="vi",
                   ayah="Câu", prev="Câu trước", nxt="Câu sau", sub="Mỗi câu một trang"),
        "th": dict(slug="thai-mokhtasar", src="อัล-มุคตะศ็อร", dir="ltr", lang="th",
                   ayah="อายะฮ์", prev="อายะฮ์ก่อนหน้า", nxt="อายะฮ์ถัดไป", sub="แต่ละอายะฮ์หนึ่งหน้า"),
        "km": dict(slug="khmer-mokhtasar", src="អាល់មុខតាស័រ", dir="ltr", lang="km",
                   ayah="អាយ៉ាត់", prev="អាយ៉ាត់មុន", nxt="អាយ៉ាត់បន្ទាប់", sub="អាយ៉ាត់នីមួយៗមួយទំព័រ"),
        "ml": dict(slug="malayalam-mokhtasar", src="അൽ-മുഖ്തസർ", dir="ltr", lang="ml",
                   ayah="ആയത്ത്", prev="മുൻ ആയത്ത്", nxt="അടുത്ത ആയത്ത്", sub="ഓരോ ആയത്തും ഒരു പേജ്"),
        "ta": dict(slug="tamil-mokhtasar", src="அல்-முக்தஸர்", dir="ltr", lang="ta",
                   ayah="வசனம்", prev="முந்தைய வசனம்", nxt="அடுத்த வசனம்", sub="ஒவ்வொரு வசனமும் ஒரு பக்கம்"),
        "te": dict(slug="telugu-mokhtasar", src="అల్-ముఖ్తసర్", dir="ltr", lang="te",
                   ayah="ఆయత్", prev="మునుపటి ఆయత్", nxt="తరువాతి ఆయత్", sub="ప్రతి ఆయత్ ఒక పేజీ"),
        "si": dict(slug="sinhalese-mokhtasar", src="අල්-මුඛ්තසර්", dir="ltr", lang="si",
                   ayah="ආයත්", prev="පෙර ආයත්", nxt="ඊළඟ ආයත්", sub="සෑම ආයතක්ම වෙනම පිටුවකි"),
        "tl": dict(slug="tagalog-mokhtasar", src="Tafsir Al-Mukhtasar", dir="ltr", lang="tl",
                   ayah="Ayah", prev="Nakaraang ayah", nxt="Susunod na ayah", sub="Bawat ayah ay isang pahina"),
    },
}

FONT = {
    "ur": '<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Noto+Naskh+Arabic&display=swap" rel="stylesheet"><style>.tx{font-family:"Noto Naskh Arabic","Scheherazade New",serif}</style>',
    "fa": '<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Noto+Naskh+Arabic&display=swap" rel="stylesheet"><style>.tx{font-family:"Noto Naskh Arabic","Scheherazade New",serif}</style>',
    "bn": '<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali&display=swap" rel="stylesheet"><style>.tx{font-family:"Noto Sans Bengali",sans-serif}</style>',
    "ug": '<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Noto+Naskh+Arabic&display=swap" rel="stylesheet"><style>.tx{font-family:"Noto Naskh Arabic","Scheherazade New",serif}</style>',
    "ku": '<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Noto+Naskh+Arabic&display=swap" rel="stylesheet"><style>.tx{font-family:"Noto Naskh Arabic","Scheherazade New",serif}</style>',
    "uz": '<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Noto+Sans&display=swap" rel="stylesheet"><style>.tx{font-family:"Noto Sans",sans-serif}</style>',
    "ky": '<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Noto+Sans&display=swap" rel="stylesheet"><style>.tx{font-family:"Noto Sans",sans-serif}</style>',
    "ps": '<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Noto+Naskh+Arabic&display=swap" rel="stylesheet"><style>.tx{font-family:"Noto Naskh Arabic","Scheherazade New",serif}</style>',
    "as": '<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali&display=swap" rel="stylesheet"><style>.tx{font-family:"Noto Sans Bengali",sans-serif}</style>',
    "hi": '<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari&display=swap" rel="stylesheet"><style>.tx{font-family:"Noto Sans Devanagari",sans-serif}</style>',
    "zh": '<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC&display=swap" rel="stylesheet"><style>.tx{font-family:"Noto Sans SC",sans-serif}</style>',
    "ja": '<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP&display=swap" rel="stylesheet"><style>.tx{font-family:"Noto Sans JP",sans-serif}</style>',
    "th": '<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Thai&display=swap" rel="stylesheet"><style>.tx{font-family:"Noto Sans Thai",sans-serif}</style>',
    "km": '<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Khmer&display=swap" rel="stylesheet"><style>.tx{font-family:"Noto Sans Khmer",sans-serif}</style>',
    "ml": '<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Malayalam&display=swap" rel="stylesheet"><style>.tx{font-family:"Noto Sans Malayalam",sans-serif}</style>',
    "ta": '<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Tamil&display=swap" rel="stylesheet"><style>.tx{font-family:"Noto Sans Tamil",sans-serif}</style>',
    "te": '<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Telugu&display=swap" rel="stylesheet"><style>.tx{font-family:"Noto Sans Telugu",sans-serif}</style>',
    "si": '<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Sinhala&display=swap" rel="stylesheet"><style>.tx{font-family:"Noto Sans Sinhala",sans-serif}</style>',
    "sr": '<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Noto+Sans&display=swap" rel="stylesheet"><style>.tx{font-family:"Noto Sans",sans-serif}</style>',
}

NAV = {
    "az": ("/az/", [("/az/quran/", "Quran"), ("/az/tafsir.html", "Təfsirlər"), ("/az/translations/", "Tərcümələr"), ("/az/about.html", "Haqqında")],
           [("/az/faq.html", "Suallar"), ("/az/sources.html", "Mənbələr"), ("/az/privacy.html", "Məxfilik"), ("/az/terms.html", "Şərtlər")]),
    "tr": ("/tr/", [("/tr/quran/", "Kuran"), ("/tr/tafsir.html", "Tefsirler"), ("/tr/translations/", "Mealler"), ("/tr/about.html", "Hakkında")],
           [("/tr/faq.html", "Sorular"), ("/tr/sources.html", "Kaynaklar"), ("/tr/privacy.html", "Gizlilik"), ("/tr/terms.html", "Şartlar")]),
    "en": ("/en/", [("/en/quran/", "Quran"), ("/en/tafsir.html", "Tafsir"), ("/en/translations/", "Translations"), ("/en/about.html", "About")],
           [("/en/faq.html", "Questions"), ("/en/sources.html", "Sources"), ("/en/privacy.html", "Privacy"), ("/en/terms.html", "Terms")]),
    "ru": ("/ru/", [("/ru/quran/", "Коран"), ("/ru/tafsir.html", "Тафсиры"), ("/ru/translations/", "Переводы"), ("/ru/about.html", "О нас")],
           [("/ru/faq.html", "Вопросы"), ("/ru/sources.html", "Источники"), ("/ru/privacy.html", "Конфиденциальность"), ("/ru/terms.html", "Условия")]),
}
DEFAULT_NAV = ("/", [("/quran/", "القرآن"), ("/tafsir.html", "التفاسير"), ("/translations/", "الترجمات"), ("/about.html", "من نحن")],
               [("/faq.html", "الأسئلة"), ("/sources.html", "المصادر"), ("/privacy.html", "الخصوصية"), ("/terms.html", "الشروط")])

# language name shown on the chooser, per site UI
LABEL = {
    "az": {"ar": "الأذربيجانية", "az": "Azərbaycan", "tr": "Azerbaycan", "en": "Azerbaijani", "ru": "Азербайджанский"},
    "en": {"ar": "الإنجليزية", "az": "İngilis", "tr": "İngilizce", "en": "English", "ru": "Английский"},
    "tr": {"ar": "التركية", "az": "Türk", "tr": "Türkçe", "en": "Turkish", "ru": "Турецкий"},
    "ru": {"ar": "الروسية", "az": "Rus", "tr": "Rusça", "en": "Russian", "ru": "Русский"},
    "ur": {"ar": "الأردية", "az": "Urdu", "tr": "Urduca", "en": "Urdu", "ru": "Урду"},
    "bn": {"ar": "البنغالية", "az": "Benqal", "tr": "Bengalce", "en": "Bengali", "ru": "Бенгальский"},
    "id": {"ar": "الإندونيسية", "az": "İndoneziya", "tr": "Endonezce", "en": "Indonesian", "ru": "Индонезийский"},
    "fa": {"ar": "الفارسية", "az": "Fars", "tr": "Farsça", "en": "Persian", "ru": "Персидский"},
    "sq": {"ar": "الألبانية", "az": "Alban", "tr": "Arnavutça", "en": "Albanian", "ru": "Албанский"},
    "uz": {"ar": "الأوزبكية", "az": "Özbək", "tr": "Özbekçe", "en": "Uzbek", "ru": "Узбекский"},
    "ug": {"ar": "الأويغورية", "az": "Uyğur", "tr": "Uygurca", "en": "Uyghur", "ru": "Уйгурский"},
    "ky": {"ar": "القيرغيزية", "az": "Qırğız", "tr": "Kırgızca", "en": "Kyrgyz", "ru": "Кыргызский"},
    "ku": {"ar": "الكردية", "az": "Kürd", "tr": "Kürtçe", "en": "Kurdish", "ru": "Курдский"},
    "as": {"ar": "الآسامية", "az": "Assam", "tr": "Assamca", "en": "Assamese", "ru": "Ассамский"},
    "bs": {"ar": "البوسنية", "az": "Bosniya", "tr": "Boşnakça", "en": "Bosnian", "ru": "Боснийский"},
    "zh": {"ar": "الصينية", "az": "Çin", "tr": "Çince", "en": "Chinese", "ru": "Китайский"},
    "fr": {"ar": "الفرنسية", "az": "Fransız", "tr": "Fransızca", "en": "French", "ru": "Французский"},
    "ff": {"ar": "الفولانية", "az": "Fula", "tr": "Fulaca", "en": "Fulani", "ru": "Фула"},
    "hi": {"ar": "الهندية", "az": "Hindi", "tr": "Hintçe", "en": "Hindi", "ru": "Хинди"},
    "it": {"ar": "الإيطالية", "az": "İtalyan", "tr": "İtalyanca", "en": "Italian", "ru": "Итальянский"},
    "ja": {"ar": "اليابانية", "az": "Yapon", "tr": "Japonca", "en": "Japanese", "ru": "Японский"},
    "km": {"ar": "الخميرية", "az": "Kxmer", "tr": "Kmerce", "en": "Khmer", "ru": "Кхмерский"},
    "ml": {"ar": "المالايالامية", "az": "Malayalam", "tr": "Malayalamca", "en": "Malayalam", "ru": "Малаялам"},
    "ps": {"ar": "البشتوية", "az": "Puştu", "tr": "Peştuca", "en": "Pashto", "ru": "Пушту"},
    "sr": {"ar": "الصربية", "az": "Serb", "tr": "Sırpça", "en": "Serbian", "ru": "Сербский"},
    "si": {"ar": "السنهالية", "az": "Sinhala", "tr": "Sinhalaca", "en": "Sinhala", "ru": "Сингальский"},
    "es": {"ar": "الإسبانية", "az": "İspan", "tr": "İspanyolca", "en": "Spanish", "ru": "Испанский"},
    "tl": {"ar": "التاغالوغية", "az": "Taqaloq", "tr": "Tagalogca", "en": "Tagalog", "ru": "Тагальский"},
    "ta": {"ar": "التاميلية", "az": "Tamil", "tr": "Tamilce", "en": "Tamil", "ru": "Тамильский"},
    "te": {"ar": "التيلوغوية", "az": "Teluqu", "tr": "Teluguca", "en": "Telugu", "ru": "Телугу"},
    "th": {"ar": "التايلاندية", "az": "Tay", "tr": "Tayca", "en": "Thai", "ru": "Тайский"},
    "vi": {"ar": "الفيتنامية", "az": "Vyetnam", "tr": "Vietnamca", "en": "Vietnamese", "ru": "Вьетнамский"},
}
LEAD = {
    "ar": "اختر اللغة. كل آية في صفحة: النص العربي، ثم التفسير.",
    "az": "Dili seçin. Hər ayə bir səhifədir: əvvəl ərəbcə ayə, sonra təfsir.",
    "tr": "Dili seçin. Her ayet bir sayfadır: önce Arapça ayet, sonra tefsir.",
    "en": "Choose a language. Each ayah is its own page: the Arabic first, then the tafsir.",
    "ru": "Выберите язык. Каждый аят — отдельная страница: сначала арабский текст, затем тафсир.",
}
HUB_BLURB = {
    "ar": "السعدي وابن كثير. الآية بالعربية، ثم التفسير المترجم.",
    "az": "Sədi və İbn Kəsir. Əvvəl ayənin ərəbcəsi, sonra tərcümə təfsiri.",
    "tr": "Sa'dî ve İbn Kesîr. Önce ayetin Arapçası, sonra tercüme tefsir.",
    "en": "Al-Sa'di and Ibn Kathir. The Arabic ayah first, then the translated tafsir.",
    "ru": "Ас-Саади и Ибн Касир. Сначала арабский аят, затем перевод тафсира.",
}

def fetch(slug, s):
    dest = os.path.join(CACHE, slug, f"{s}.json")
    if os.path.exists(dest) and os.path.getsize(dest) > 20:
        return dest
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    url = f"https://raw.githubusercontent.com/spa5k/tafsir_api/main/tafsir/{slug}/{s}.json"
    last = None
    for attempt in range(4):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
            data = urllib.request.urlopen(req, timeout=120).read()
            if len(data) < 20:
                raise OSError("short")
            open(dest, "wb").write(data)
            return dest
        except Exception as e:
            last = e
            time.sleep(1.2 * (attempt + 1))
    raise SystemExit(f"fetch {slug}/{s}: {last}")

def load_edition(slug):
    jobs = []
    with ThreadPoolExecutor(max_workers=12) as ex:
        futs = [ex.submit(fetch, slug, s) for s in range(1, 115)]
        for f in as_completed(futs):
            f.result()
    by = {}
    for s in range(1, 115):
        d = json.load(open(os.path.join(CACHE, slug, f"{s}.json"), encoding="utf8"))
        if not isinstance(d, list):
            raise SystemExit(f"bad json {slug} {s}")
        for it in d:
            if not isinstance(it, dict):
                continue
            by[(int(it["surah"]), int(it["ayah"]))] = it.get("text") or ""
    missing = [k for k in ORDER if k not in by]
    if missing[:5]:
        print(" missing", slug, len(missing), missing[:5])
    return by

def page(meta, book, lang, s, a, raw, prev, nxt):
    name = ARN[s - 1]
    title = f"{meta['src']} — {name} {a}"
    desc = re.sub(r"\s+", " ", raw).strip()[:160]
    ay = TXT[(s, a)]
    url = f"{B}/tafsir/tercume/{book}/{lang}/{s}/{a}/"
    links = ""
    if prev:
        links += f'<link rel="prev" href="{B}{prev}">'
    if nxt:
        links += f'<link rel="next" href="{B}{nxt}">'
    pn = "<nav class=\"pn\">"
    pn += f'<a href="{prev}">{E(meta["prev"])}</a>' if prev else "<span></span>"
    pn += f'<a href="{nxt}">{E(meta["nxt"])}</a>' if nxt else "<span></span>"
    pn += "</nav>"
    font = FONT.get(lang, "")
    return f'''<!doctype html><html lang="{meta["lang"]}" dir="{meta["dir"]}"><head><script>try{{if(sessionStorage.getItem("qm.tfdir"))document.documentElement.classList.add("qm-turning")}}catch(e){{}}</script><style>html.qm-turning body{{opacity:0}}</style><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{E(title)} | Mushafuk.online</title><meta name="description" content="{E(desc)}"><meta property="og:title" content="{E(title)} | Mushafuk.online"><meta property="og:description" content="{E(desc)}"><meta property="og:image" content="{B}/share.jpg"><link rel="canonical" href="{url}">{links}<link rel="icon" href="/icon.png"><link rel="stylesheet" href="/tafsir/saadi.css?v=3"><link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Amiri&display=swap" rel="stylesheet">{font}</head><body><header class="bar"><a class="x" href="/tafsir/tercume/{book}/{lang}/" aria-label="×">×</a><div class="who"><b>{E(name)}</b><small>{E(meta["ayah"])} {a}</small></div></header><main id="tf"><p class="src">{E(meta["src"])}</p><p class="ay" dir="rtl" lang="ar">{E(ay)} ﴿{arn(a)}﴾</p><div class="tx" lang="{meta["lang"]}">{E(raw)}</div>{pn}</main><script src="/tafsir/turn.js?v=4" data-next="{nxt}" data-prev="{prev}"></script></body></html>'''

def index_page(book, lang, meta, counts):
    home, links, foot = NAV.get(lang, DEFAULT_NAV)
    codes = ["ar"] + list(EDITIONS[book])
    menu = []
    for code in codes:
        if code == "ar":
            href = f"/tafsir/{book}/"
            on = ""
            lab = "AR"
        else:
            href = f"/tafsir/tercume/{book}/{code}/"
            on = " class=on" if code == lang else ""
            lab = code.upper()
        menu.append(f'<a href="{href}"{on}>{lab}</a>')
    nav = "".join(f'<a href="{h}">{E(n)}</a>' for h, n in links)
    nav += f'<span class="langs"><button type="button" class="lbtn" aria-haspopup="true" aria-expanded="false">🌐 {lang.upper()} ▾</button><span class="lmenu">{"".join(menu)}</span></span>'
    fn = "".join(f'<a href="{h}">{E(n)}</a>' for h, n in foot)
    items = "".join(
        f'<a href="/tafsir/tercume/{book}/{lang}/{s}/1/"><span class="k">{s}</span><span class="nm" dir="rtl">{E(ARN[s-1])}<small>{counts[s]}</small></span></a>'
        for s in range(1, 115)
    )
    font = FONT.get(lang, "")
    return f'''<!doctype html><html lang="{meta["lang"]}" dir="{meta["dir"]}"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{E(meta["src"])} — Mushafuk.online</title><meta name="description" content="{E(meta["sub"])}"><link rel="canonical" href="{B}/tafsir/tercume/{book}/{lang}/"><link rel="icon" href="/icon.png"><link rel="stylesheet" href="/site.css?v=8"><link rel="stylesheet" href="/tafsir/saadi.css?v=3">{font}</head><body><header class="nav"><div class="in"><a class="logo" href="{home}" dir="ltr"><img src="/icon.png" alt="">Mushafuk<span>.online</span></a><nav>{nav}</nav></div></header><section class="ph"><h1>{E(meta["src"])}</h1><p>{E(meta["sub"])}</p></section><div class="wrap"><div class="sl">{items}</div></div><footer><nav>{fn}</nav><p>© 2026 Mushafuk.online</p></footer><script src="/site.js?v=7"></script></body></html>'''

def build(book, lang, meta):
    print("build", book, lang, meta["slug"], flush=True)
    by = load_edition(meta["slug"])
    counts = {s: 0 for s in range(1, 115)}
    urls = [f"{B}/tafsir/tercume/{book}/{lang}/"]
    for n, (s, a) in enumerate(ORDER):
        counts[s] += 1
        prev = f"/tafsir/tercume/{book}/{lang}/{ORDER[n-1][0]}/{ORDER[n-1][1]}/" if n else ""
        nxt = f"/tafsir/tercume/{book}/{lang}/{ORDER[n+1][0]}/{ORDER[n+1][1]}/" if n + 1 < len(ORDER) else ""
        raw = by.get((s, a), "")
        doc = page(meta, book, lang, s, a, raw, prev, nxt)
        o = f"tafsir/tercume/{book}/{lang}/{s}/{a}"
        os.makedirs(o, exist_ok=True)
        open(o + "/index.html", "w", encoding="utf8").write(doc)
        urls.append(f"{B}/tafsir/tercume/{book}/{lang}/{s}/{a}/")
    open(f"tafsir/tercume/{book}/{lang}/index.html", "w", encoding="utf8").write(index_page(book, lang, meta, counts))
    sm = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    sm += "".join(f"<url><loc>{u}</loc></url>\n" for u in urls)
    sm += "</urlset>\n"
    name = f"sitemap-tft-{book}-{lang}.xml"
    open(name, "w", encoding="utf8").write(sm)
    print(" wrote", book, lang, len(urls), flush=True)
    return name

def redirect(path, url):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    open(path, "w", encoding="utf8").write(
        f'<!doctype html><html><head><meta charset="utf-8"><meta http-equiv="refresh" content="0;url={url}"><link rel="canonical" href="{B}{url}"><script>location.replace("{url}")</script></head><body></body></html>'
    )

def chooser_cards(book, ui):
    go = "←" if ui == "ar" else "→"
    bits = []
    for code in EDITIONS[book]:
        lab = LABEL[code][ui]
        bits.append(f'<a class="card" href="/tafsir/tercume/{book}/{code}/"><h3>{E(lab)}</h3><span class="go">{go}</span></a>')
    return '<div class="cards">' + "".join(bits) + "</div>"

def patch_choosers():
    for ui, prefix in (("ar", ""), ("az", "az/"), ("tr", "tr/"), ("en", "en/"), ("ru", "ru/")):
        for book in EDITIONS:
            p = f"{prefix}tafsir/tercume/{book}/index.html"
            t = open(p, encoding="utf8").read()
            t2, n = re.subn(r'<div class="cards">.*?</div>', chooser_cards(book, ui), t, count=1)
            t2, n2 = re.subn(r'(<section class="ph"><h1>.*?</h1><p>).*?(</p>)', r"\1" + LEAD[ui] + r"\2", t2, count=1)
            if n != 1 or n2 != 1:
                raise SystemExit(f"patch fail {p} {n} {n2}")
            open(p, "w", encoding="utf8").write(t2)
        hub = f"{prefix}tafsir/tercume/index.html"
        t = open(hub, encoding="utf8").read()
        t2, n = re.subn(r'<a class="card" href="muyassar/">.*?</a>', "", t, count=1)
        if n != 1:
            raise SystemExit("hub " + hub)
        open(hub, "w", encoding="utf8").write(t2)
        land = "tafsir.html" if ui == "ar" else f"{ui}/tafsir.html"
        t = open(land, encoding="utf8").read()
        old = {
            "ar": "الميسر، السعدي وابن كثير. الآية بالعربية، ثم التفسير المترجم.",
            "az": "Müyəssər, Sədi və İbn Kəsir. Əvvəl ayənin ərəbcəsi, sonra tərcümə təfsiri.",
            "tr": "Müyesser, Sa'dî ve İbn Kesîr. Önce ayetin Arapçası, sonra tercüme tefsir.",
            "en": "Al-Muyassar, al-Sa'di and Ibn Kathir. The Arabic ayah first, then the translated tafsir.",
            "ru": "Аль-Муйассар, ас-Саади и Ибн Касир. Сначала арабский аят, затем перевод тафсира.",
        }[ui]
        if old not in t:
            raise SystemExit("blurb missing " + land)
        open(land, "w", encoding="utf8").write(t.replace(old, HUB_BLURB[ui], 1))
        # Muyassar has no translated edition: send the empty chooser back to the list
        back = "/tafsir/tercume/" if ui == "ar" else f"/{ui}/tafsir/tercume/"
        redirect(f"{prefix}tafsir/tercume/muyassar/index.html", back)

def drop_empty_langs():
    # old placeholder pages for languages that have no tafsir text
    gone = [
        ("muyassar", "az"), ("muyassar", "tr"), ("muyassar", "en"), ("muyassar", "ru"),
        ("saadi", "az"), ("saadi", "en"),
        ("ibnkathir", "az"), ("ibnkathir", "tr"),
    ]
    for book, lang in gone:
        redirect(f"tafsir/tercume/{book}/{lang}/index.html", f"/tafsir/tercume/{book}/" if book != "muyassar" else "/tafsir/tercume/")

def sitemap_index(names):
    ix = open("sitemap.xml", encoding="utf8").read()
    add = ""
    for name in names:
        loc = f"<sitemap><loc>{B}/{name}</loc></sitemap>\n"
        if name not in ix:
            add += loc
    if add:
        open("sitemap.xml", "w", encoding="utf8").write(ix.replace("</sitemapindex>", add + "</sitemapindex>"))

def publish_mukhtasar():
    title = "المختصر في التفسير"
    local = {"ar": "المختصر", "az": "Muxtəsər", "tr": "Muhtasar", "en": "Al-Mukhtasar", "ru": "Аль-Мухтасар"}
    blurb = {
        "ar": "المختصر، السعدي وابن كثير. الآية بالعربية، ثم التفسير المترجم.",
        "az": "Muxtəsər, Sədi və İbn Kəsir. Əvvəl ayənin ərəbcəsi, sonra tərcümə təfsiri.",
        "tr": "Muhtasar, Sa'dî ve İbn Kesîr. Önce ayetin Arapçası, sonra tercüme tefsir.",
        "en": "Al-Mukhtasar, al-Sa'di and Ibn Kathir. The Arabic ayah first, then the translated tafsir.",
        "ru": "Аль-Мухтасар, ас-Саади и Ибн Касир. Сначала арабский аят, затем перевод тафсира.",
    }
    old = {
        "ar": "السعدي وابن كثير. الآية بالعربية، ثم التفسير المترجم.",
        "az": "Sədi və İbn Kəsir. Əvvəl ayənin ərəbcəsi, sonra tərcümə təfsiri.",
        "tr": "Sa'dî ve İbn Kesîr. Önce ayetin Arapçası, sonra tercüme tefsir.",
        "en": "Al-Sa'di and Ibn Kathir. The Arabic ayah first, then the translated tafsir.",
        "ru": "Ас-Саади и Ибн Касир. Сначала арабский аят, затем перевод тафсира.",
    }
    for ui, prefix in (("ar", ""), ("az", "az/"), ("tr", "tr/"), ("en", "en/"), ("ru", "ru/")):
        home, links, foot = NAV.get(ui, DEFAULT_NAV)
        here = "/tafsir/tercume/mukhtasar/" if ui == "ar" else f"/{ui}/tafsir/tercume/mukhtasar/"
        menu = []
        for code, lab in (("ar", "AR"), ("az", "AZ"), ("tr", "TR"), ("en", "EN"), ("ru", "RU")):
            href = "/tafsir/tercume/mukhtasar/" if code == "ar" else f"/{code}/tafsir/tercume/mukhtasar/"
            on = " class=on" if code == ui else ""
            menu.append(f'<a href="{href}"{on}>{lab}</a>')
        nav = "".join(f'<a href="{h}">{E(n)}</a>' for h, n in links)
        nav += f'<span class="langs"><button type="button" class="lbtn" aria-haspopup="true" aria-expanded="false">🌐 {ui.upper()} ▾</button><span class="lmenu">{"".join(menu)}</span></span>'
        fn = "".join(f'<a href="{h}">{E(n)}</a>' for h, n in foot)
        direction = "rtl" if ui == "ar" else "ltr"
        doc = f'''<!doctype html><html lang="{ui}" dir="{direction}"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{E(title)} — Mushafuk.online</title><meta property="og:title" content="{E(title)} — Mushafuk.online"><meta property="og:image" content="{B}/share.jpg"><link rel="canonical" href="{B}{here}"><link rel="icon" href="/icon.png"><link rel="stylesheet" href="/site.css?v=8"></head><body><header class="nav"><div class="in"><a class="logo" href="{home}" dir="ltr"><img src="/icon.png" alt="">Mushafuk<span>.online</span></a><nav>{nav}</nav></div></header><section class="ph"><h1>{E(title)}</h1><p>{E(LEAD[ui])}</p></section><div class="wrap">{chooser_cards("mukhtasar", ui)}</div><footer><nav>{fn}</nav><p>© 2026 Mushafuk.online</p></footer><script src="/site.js?v=7"></script></body></html>'''
        path = f"{prefix}tafsir/tercume/mukhtasar/index.html"
        os.makedirs(os.path.dirname(path), exist_ok=True)
        open(path, "w", encoding="utf8").write(doc)
        hub = f"{prefix}tafsir/tercume/index.html"
        t = open(hub, encoding="utf8").read()
        if 'href="mukhtasar/"' not in t:
            go = "←" if ui == "ar" else "→"
            card = f'<a class="card" href="mukhtasar/"><h3 dir="rtl">{title}</h3><p>{E(local[ui])}</p><span class="go">{go}</span></a>'
            t = t.replace('<div class="cards">', '<div class="cards">' + card, 1)
        if old[ui] in t:
            pass
        land = "tafsir.html" if ui == "ar" else f"{ui}/tafsir.html"
        lt = open(land, encoding="utf8").read()
        if blurb[ui] in lt:
            pass
        elif old[ui] in lt:
            lt = lt.replace(old[ui], blurb[ui], 1)
            open(land, "w", encoding="utf8").write(lt)
        else:
            raise SystemExit("blurb missing " + land)
        open(hub, "w", encoding="utf8").write(t)

if __name__ == "__main__":
    only = sys.argv[1:]
    names = []
    for book, langs in EDITIONS.items():
        for lang, meta in langs.items():
            key = f"{book}/{lang}"
            if only and book not in only and key not in only:
                continue
            names.append(build(book, lang, meta))
    if not only:
        patch_choosers()
        drop_empty_langs()
    if (not only) or any(x == "mukhtasar" or x.startswith("mukhtasar/") for x in only):
        publish_mukhtasar()
    sitemap_index(names)
    print("done", names)
