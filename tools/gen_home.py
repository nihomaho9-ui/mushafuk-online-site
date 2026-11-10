#!/usr/bin/env python3
"""Generate language home pages for Mushafuk.online.

Rich homes (ar root, az/tr/en/ru) are hand-maintained to match the live design.
This script regenerates the thinner language homes: fr, id, bn, ms, ur — with
substantive intros, crawlable section links, and the same card/layout pattern.

Usage:
  python3 tools/gen_home.py
"""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def ico(*paths: str) -> str:
    inner = "".join(f'<path d="{p}"/>' for p in paths)
    return (
        '<svg class="si" viewBox="0 0 24 24" fill="none" stroke="currentColor" '
        'stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'
        f"{inner}</svg>"
    )


ICO = {
    "book": ico("M4 4h12a3 3 0 0 1 3 3v13H7a3 3 0 0 1-3-3zM4 17a3 3 0 0 1 3-3h12"),
    "tafsir": ico(
        "M2 5c4-1 7 0 10 2 3-2 6-3 10-2v14c-4-1-7 0-10 2-3-2-6-3-10-2zM12 7v14"
    ),
    "trans": ico(
        "M3 5h10M8 3v2m-3 0c1 4 4 7 8 8M11 5c-1 4-4 7-7 9M13 21l4-10 4 10m-6.5-3h5"
    ),
    "about": ico("M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 9v6m0-10v.5"),
    "irab": ico("M4 6h16M4 12h10M4 18h7M17 14l3 3-3 3"),
    "gharib": ico("M5 4h14v16H5zM9 9h6M9 13h4"),
    "qiraat": ico(
        "M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3zM6 11a6 6 0 0 0 12 0M12 17v3"
    ),
    "ai": (
        '<svg class="si" viewBox="0 0 24 24" fill="none" stroke="currentColor" '
        'stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'
        '<circle cx="11" cy="11" r="6"/><path d="M20 20l-3.5-3.5"/></svg>'
    ),
    "ulum": ico(
        "M4 19.5A2.5 2.5 0 0 1 6.5 17H20",
        "M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z",
        "M8 7h8M8 11h6",
    ),
    "read": ico(
        "M4 19.5A2.5 2.5 0 0 1 6.5 17H20",
        "M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z",
    ),
}

MOSQ = (
    '<svg viewBox="0 0 400 90" preserveAspectRatio="none">'
    '<path fill="#04170f" d="M0 90V70h20V40l4-8 4 8v30h20V60q15-25 30 0v10h10V50q20-35 40 0v20h20V30l4-10 4 10v40h30V55q25-40 50 0v15h30V30l4-10 4 10v40h20V60q15-25 30 0v10h20V40l4-8 4 8v30h20v20z"/>'
    "</svg>"
)

LANGS_MENU = [
    ("ar", "../"),
    ("en", "../en/"),
    ("id", "../id/"),
    ("ur", "../ur/"),
    ("tr", "../tr/"),
    ("fr", "../fr/"),
    ("bn", "../bn/"),
    ("ms", "../ms/"),
    ("ru", "../ru/"),
    ("az", "../az/"),
]

HREFLANG = [
    ("ar", "https://mushafuk.online/"),
    ("en", "https://mushafuk.online/en/"),
    ("id", "https://mushafuk.online/id/"),
    ("ur", "https://mushafuk.online/ur/"),
    ("tr", "https://mushafuk.online/tr/"),
    ("fr", "https://mushafuk.online/fr/"),
    ("bn", "https://mushafuk.online/bn/"),
    ("ms", "https://mushafuk.online/ms/"),
    ("ru", "https://mushafuk.online/ru/"),
    ("az", "https://mushafuk.online/az/"),
    ("x-default", "https://mushafuk.online/"),
]

# Substantive thin-language homes only. az/tr/en/ru/ar are not overwritten.
DATA = {
    "fr": {
        "dir": "ltr",
        "arr": "→",
        "h1": "Le Coran que voici guide les hommes vers la voie la plus droite",
        "desc": "Mushaf de Médine page par page, tafsir, iʿrāb, gharīb et traduction française de Rachid Maach — gratuit, sans publicité.",
        "ld_desc": "Le mushaf de Médine, avec tafsir et traductions. Gratuit et sans publicité.",
        "tagline": "Mushafuk.online vous ouvre le mushaf de Médine page par page, avec des outils de lecture clairs.",
        "intro": [
            "Ici vous lisez le texte arabe du mushaf (604 pages, récit Hafs), vous écoutez la récitation verset par verset, et vous consultez des tafsirs classiques ainsi que des traductions des sens — le tout sans compte ni publicité.",
            "En français, la traduction de Rachid Maach est disponible page par page. Le tafsir al-Mukhtasar a aussi une version française. Les sections iʿrāb (analyse grammaticale) et gharīb (mots rares) aident à comprendre le texte arabe.",
            "D’autres livres se trouvent sur les sous-domaines : tafsir.mushafuk.online (tafsirs arabes), t2 (ouvrages anciens), t3 (ʿulūm al-Qurʾān et uṣūl), et t1 pour d’autres traductions. Le catalogue général des langues est sous Traductions.",
        ],
        "cta": "Ouvrir le mushaf",
        "resume": "Continuer",
        "nav": [
            ("Coran", "../en/quran/"),
            ("Tafsir", "../en/tafsir.html"),
            ("Traductions", "../en/translations/"),
            ("À propos", "about.html"),
        ],
        "readmode": (
            "Mode lecture",
            "Ouvrez un livre du site : la dernière page est mémorisée (jusqu'à 5 livres).",
        ),
        "cards": [
            ("../en/quran/", "Coran", "Le mushaf de Médine, 604 pages, avec récitation.", "book"),
            ("../en/tafsir.html", "Tafsir", "As-Saʿdî, Ibn Kathîr, at-Tabarî et d’autres tafsirs.", "tafsir"),
            ("https://t3.mushafuk.online/ulum-quran/", "Ulûm al-Qurʾân", "Al-Itqân de as-Suyûtî et Fadâʾil al-Qurʾân d’Abû ʿUbayd.", "ulum"),
            ("https://t3.mushafuk.online/usul/", "Uṣûl at-tafsîr", "Introduction aux principes du tafsir (Ibn Taymiyya).", "ulum"),
            ("../en/translations/", "Traductions", "Les sens du Coran en plus de vingt langues.", "trans"),
            ("maach/", "Maach (français)", "Traduction française de Rachid Maach, page par page.", "trans"),
            ("https://t1.mushafuk.online/", "Autres traductions (t1)", "Traductions supplémentaires sur le sous-domaine t1.", "trans"),
            ("../en/irab/", "Iʿrāb", "Analyse grammaticale des versets (الإعراب).", "irab"),
            ("../en/gharib/", "Gharîb al-Qurʾân", "Sens des mots rares (غريب القرآن).", "gharib"),
            ("../en/qiraat/", "Récitation", "Sept récitants. Écoutez verset par verset.", "qiraat"),
            ("../ai/", "Mushafuk AI", "Recherche dans le Coran, le tafsir et les traductions.", "ai"),
        ],
        "verses_label": "Versets connus",
        "verses": [
            ("../en/page/1/", "Al-Fâtiha"),
            ("../en/page/42/", "Coran 2:255 — Âyat al-Kursî"),
            ("../en/page/604/", "Al-Ikhlâs"),
        ],
        "books_label": "Livres et sections",
        "books": [
            ("maach/", "Traduction Rachid Maach"),
            ("../tafsir/tercume/mukhtasar/fr/", "al-Mukhtasar (français)"),
            ("../en/quran/", "Index des sourates"),
            ("../en/page/1/", "Page 1 du mushaf"),
            ("https://t1.mushafuk.online/", "Autres traductions (t1)"),
            ("https://tafsir.mushafuk.online/aysar/", "Tafsir Aysar"),
            ("https://tafsir.mushafuk.online/mukhtasar/", "al-Mukhtasar (arabe)"),
            ("https://tafsir.mushafuk.online/muyassar/", "at-Tafsîr al-muyassar"),
            ("https://tafsir.mushafuk.online/saadi/", "Tafsir as-Saʿdî"),
            ("https://tafsir.mushafuk.online/ibnkathir/", "Tafsir Ibn Kathîr"),
            ("https://tafsir.mushafuk.online/baghawi/", "Tafsir al-Baghawî"),
            ("https://tafsir.mushafuk.online/tabari/", "Tafsir at-Tabarî"),
            ("https://t2.mushafuk.online/mujahid/", "Tafsir Mujâhid"),
            ("https://t3.mushafuk.online/ulum/itqan/", "al-Itqân, as-Suyûtî"),
            ("https://t3.mushafuk.online/ulum/muqaddima-usul/", "Muqaddima, Ibn Taymiyya"),
        ],
        "footer": [
            ("/en/faq.html", "Questions"),
            ("/en/sources.html", "Sources"),
            ("/en/privacy.html", "Confidentialité"),
            ("/en/terms.html", "Conditions"),
        ],
    },
    "id": {
        "dir": "ltr",
        "arr": "→",
        "h1": "Sungguh, Al-Qur'an ini memberi petunjuk ke jalan yang paling lurus",
        "desc": "Mushaf Madinah halaman demi halaman, tafsir, iʿrāb, gharīb, serta tafsir Mukhtasar dan Sa'di berbahasa Indonesia — gratis tanpa iklan.",
        "ld_desc": "Mushaf Madinah, dengan tafsir dan terjemahan. Gratis dan tanpa iklan.",
        "tagline": "Mushafuk.online menampilkan mushaf Madinah halaman demi halaman, dengan alat baca yang jelas.",
        "intro": [
            "Di situs ini Anda membaca teks Arab mushaf (604 halaman, riwayat Hafs), mendengarkan tilawah ayat demi ayat, dan membuka tafsir klasik serta terjemahan makna — tanpa akun dan tanpa iklan.",
            "Untuk bahasa Indonesia tersedia terjemahan tafsir al-Mukhtasar dan tafsir as-Sa'di. Katalog terjemahan mushaf di banyak bahasa ada di menu Terjemahan; terjemahan tambahan ada di subdomain t1.",
            "Bagian iʿrāb (analisis tata bahasa) dan gharīb (kata jarang) membantu memahami teks Arab. Tafsir Arab ada di tafsir.mushafuk.online; karya awal di t2; ʿulūm al-Qurʾān dan uṣūl di t3.",
        ],
        "cta": "Buka Mushaf",
        "resume": "Lanjutkan",
        "nav": [
            ("Quran", "../en/quran/"),
            ("Tafsir", "../en/tafsir.html"),
            ("Terjemahan", "../en/translations/"),
            ("Tentang", "about.html"),
        ],
        "readmode": (
            "Mode baca",
            "Buka buku apa pun di situs; halaman terakhir tersimpan (paling banyak 5 buku).",
        ),
        "cards": [
            ("../en/quran/", "Quran", "Mushaf Madinah 604 halaman dengan tilawah.", "book"),
            ("../en/tafsir.html", "Tafsir", "As-Sa'di, Ibnu Katsir, ath-Thabari, dan lainnya.", "tafsir"),
            ("https://t3.mushafuk.online/ulum-quran/", "Ulum al-Quran", "Al-Itqan karya as-Suyuthi dan Fadhail al-Quran karya Abu Ubaid.", "ulum"),
            ("https://t3.mushafuk.online/usul/", "Ushul tafsir", "Pengantar kaidah tafsir (Ibnu Taimiyah).", "ulum"),
            ("../en/translations/", "Terjemahan", "Makna Al-Qur'an dalam 20+ bahasa.", "trans"),
            ("../tafsir/tercume/mukhtasar/id/", "Mukhtasar (Indonesia)", "Tafsir al-Mukhtasar dalam bahasa Indonesia.", "tafsir"),
            ("../tafsir/tercume/saadi/id/", "Sa'di (Indonesia)", "Tafsir as-Sa'di dalam bahasa Indonesia.", "tafsir"),
            ("https://t1.mushafuk.online/", "Terjemahan lain (t1)", "Terjemahan tambahan di subdomain t1.", "trans"),
            ("../en/irab/", "I'rab", "Analisis tata bahasa ayat (الإعراب).", "irab"),
            ("../en/gharib/", "Gharib al-Quran", "Makna kata-kata yang jarang (غريب القرآن).", "gharib"),
            ("../en/qiraat/", "Tilawah", "Tujuh qari. Dengarkan ayat demi ayat.", "qiraat"),
            ("../ai/", "Mushafuk AI", "Cari di Al-Qur'an, tafsir, dan terjemahan.", "ai"),
        ],
        "verses_label": "Ayat terkenal",
        "verses": [
            ("../en/page/1/", "Al-Fatihah"),
            ("../en/page/42/", "Quran 2:255 — Ayat Kursi"),
            ("../en/page/604/", "Al-Ikhlas"),
        ],
        "books_label": "Kitab dan bagian",
        "books": [
            ("../tafsir/tercume/mukhtasar/id/", "al-Mukhtasar (Indonesia)"),
            ("../tafsir/tercume/saadi/id/", "Tafsir as-Sa'di (Indonesia)"),
            ("../en/quran/", "Indeks surah"),
            ("../en/page/1/", "Halaman 1 mushaf"),
            ("https://t1.mushafuk.online/", "Terjemahan lain (t1)"),
            ("https://tafsir.mushafuk.online/aysar/", "Tafsir Aysar"),
            ("https://tafsir.mushafuk.online/mukhtasar/", "al-Mukhtasar (Arab)"),
            ("https://tafsir.mushafuk.online/muyassar/", "at-Tafsir al-muyassar"),
            ("https://tafsir.mushafuk.online/saadi/", "Tafsir as-Sa'di (Arab)"),
            ("https://tafsir.mushafuk.online/ibnkathir/", "Tafsir Ibnu Katsir"),
            ("https://tafsir.mushafuk.online/tabari/", "Tafsir ath-Thabari"),
            ("https://t2.mushafuk.online/mujahid/", "Tafsir Mujahid"),
            ("https://t3.mushafuk.online/ulum/itqan/", "al-Itqan, as-Suyuthi"),
            ("https://t3.mushafuk.online/ulum/muqaddima-usul/", "Muqaddimah, Ibnu Taimiyah"),
        ],
        "footer": [
            ("/en/faq.html", "Pertanyaan"),
            ("/en/sources.html", "Sumber"),
            ("/en/privacy.html", "Privasi"),
            ("/en/terms.html", "Ketentuan"),
        ],
    },
    "bn": {
        "dir": "ltr",
        "arr": "→",
        "h1": "নিশ্চয় এই কুরআন সরলতম পথ দেখায়",
        "desc": "মদিনার মুশহাফ পৃষ্ঠায় পৃষ্ঠায়, তাফসির, ইরাব, গারীব এবং বাংলা মুখতাসার ও ইবনে কাসির — বিনামূল্যে, বিজ্ঞাপনমুক্ত।",
        "ld_desc": "মদিনার মুশহাফ, তাফসির ও অনুবাদসহ। বিনামূল্যে এবং বিজ্ঞাপনমুক্ত।",
        "tagline": "Mushafuk.online মদিনার মুশহাফ পৃষ্ঠায় পৃষ্ঠায় খুলে দেয়, সহজ পাঠসরঞ্জামসহ।",
        "intro": [
            "এখানে আপনি আরবি মুশহাফের পাঠ (৬০৪ পৃষ্ঠা, হাফস বর্ণনা) পড়তে পারেন, আয়াতভিত্তিক তিলাওয়াত শুনতে পারেন এবং ক্লাসিক তাফসির ও অর্থের অনুবাদ দেখতে পারেন — কোনো অ্যাকাউন্ট বা বিজ্ঞাপন ছাড়াই।",
            "বাংলায় আল-মুখতাসার তাফসির এবং ইবনে কাসিরের তাফসিরের অনুবাদ আছে। অনেক ভাষার মুশহাফ-অনুবাদের তালিকা «অনুবাদ» মেনুতে; অতিরিক্ত অনুবাদ t1 সাবডোমেইনে।",
            "ইরাব (ব্যাকরণ বিশ্লেষণ) ও গারীব (দুর্লভ শব্দ) আরবি পাঠ বুঝতে সাহায্য করে। আরবি তাফসির tafsir.mushafuk.online-এ; প্রাচীন গ্রন্থ t2-তে; উলুমুল-কুরআন ও উসুল t3-তে।",
        ],
        "cta": "মুশহাফ খুলুন",
        "resume": "চালিয়ে যান",
        "nav": [
            ("কুরআন", "../en/quran/"),
            ("তাফসির", "../en/tafsir.html"),
            ("অনুবাদ", "../en/translations/"),
            ("সম্পর্কে", "about.html"),
        ],
        "readmode": (
            "পঠন মোড",
            "সাইটের যেকোনো বই খুলুন; শেষ পাতা মনে থাকবে (সর্বোচ্চ ৫টি)।",
        ),
        "cards": [
            ("../en/quran/", "কুরআন", "৬০৪ পৃষ্ঠার মদিনা মুশহাফ, তিলাওয়াতসহ।", "book"),
            ("../en/tafsir.html", "তাফসির", "আস-সা‘দি, ইবনে কাসির, আত-তাবারি ও অন্যান্য।", "tafsir"),
            ("https://t3.mushafuk.online/ulum-quran/", "উলুমুল-কুরআন", "সুয়ূতীর আল-ইতকান ও আবু উবাইদের ফাদাইলুল-কুরআন।", "ulum"),
            ("https://t3.mushafuk.online/usul/", "উসুলুত-তাফসির", "তাফসিরের মূলনীতির ভূমিকা (ইবনে তাইমিয়া)।", "ulum"),
            ("../en/translations/", "অনুবাদ", "২০+ ভাষায় কুরআনের অর্থ।", "trans"),
            ("../tafsir/tercume/mukhtasar/bn/", "মুখতাসার (বাংলা)", "আল-মুখতাসার তাফসিরের বাংলা অনুবাদ।", "tafsir"),
            ("../tafsir/tercume/ibnkathir/bn/", "ইবনে কাসির (বাংলা)", "ইবনে কাসির তাফসিরের বাংলা অনুবাদ।", "tafsir"),
            ("https://t1.mushafuk.online/", "অন্যান্য অনুবাদ (t1)", "t1 সাবডোমেইনের অতিরিক্ত অনুবাদ।", "trans"),
            ("../en/irab/", "ইরাব", "আয়াতের ব্যাকরণ বিশ্লেষণ (الإعراب)।", "irab"),
            ("../en/gharib/", "গারীবুল-কুরআন", "দুর্লভ শব্দের অর্থ (غريب القرآن)।", "gharib"),
            ("../en/qiraat/", "তিলাওয়াত", "সাত কারী। আয়াতভিত্তিক শুনুন।", "qiraat"),
            ("../ai/", "Mushafuk AI", "কুরআন, তাফসির ও অনুবাদে অনুসন্ধান।", "ai"),
        ],
        "verses_label": "পরিচিত আয়াত",
        "verses": [
            ("../en/page/1/", "আল-ফাতিহা"),
            ("../en/page/42/", "কুরআন ২:২৫৫ — আয়াতুল-কুরসী"),
            ("../en/page/604/", "আল-ইখলাস"),
        ],
        "books_label": "কিতাব ও বিভাগ",
        "books": [
            ("../tafsir/tercume/mukhtasar/bn/", "আল-মুখতাসার (বাংলা)"),
            ("../tafsir/tercume/ibnkathir/bn/", "ইবনে কাসির (বাংলা)"),
            ("../en/quran/", "সূরা সূচি"),
            ("../en/page/1/", "মুশহাফের ১ম পৃষ্ঠা"),
            ("https://t1.mushafuk.online/", "অন্যান্য অনুবাদ (t1)"),
            ("https://tafsir.mushafuk.online/aysar/", "আয়সার তাফসির"),
            ("https://tafsir.mushafuk.online/mukhtasar/", "আল-মুখতাসার (আরবি)"),
            ("https://tafsir.mushafuk.online/saadi/", "সা‘দি তাফসির"),
            ("https://tafsir.mushafuk.online/ibnkathir/", "ইবনে কাসির (আরবি)"),
            ("https://tafsir.mushafuk.online/tabari/", "তাবারি তাফসির"),
            ("https://t2.mushafuk.online/mujahid/", "মুজাহিদের তাফসির"),
            ("https://t3.mushafuk.online/ulum/itqan/", "আল-ইতকান, সুয়ূতী"),
            ("https://t3.mushafuk.online/ulum/muqaddima-usul/", "মুকাদ্দিমা, ইবনে তাইমিয়া"),
        ],
        "footer": [
            ("/en/faq.html", "প্রশ্ন"),
            ("/en/sources.html", "উৎস"),
            ("/en/privacy.html", "গোপনীয়তা"),
            ("/en/terms.html", "শর্তাবলি"),
        ],
    },
    "ms": {
        "dir": "ltr",
        "arr": "→",
        "h1": "Sesungguhnya Al-Quran ini memberi petunjuk ke jalan yang paling lurus",
        "desc": "Mushaf Madinah muka surat demi muka surat, tafsir Arab, iʿrāb, gharīb dan katalog terjemahan pelbagai bahasa — percuma tanpa iklan.",
        "ld_desc": "Mushaf Madinah, dengan tafsir dan terjemahan. Percuma dan tanpa iklan.",
        "tagline": "Mushafuk.online membuka mushaf Madinah muka surat demi muka surat, dengan alat bacaan yang kemas.",
        "intro": [
            "Di laman ini anda membaca teks Arab mushaf (604 muka surat, riwayat Hafs), mendengar tilawah ayat demi ayat, dan membuka tafsir klasik serta terjemahan makna — tanpa akaun dan tanpa iklan.",
            "Buat masa ini terjemahan mushaf berbahasa Melayu belum disenaraikan di katalog utama; anda masih boleh membaca mushaf Arab, menggunakan indeks surah, dan memilih terjemahan lain daripada katalog serta subdomain t1.",
            "Bahagian iʿrāb (analisis nahu) dan gharīb (perkataan jarang) membantu memahami teks Arab. Tafsir Arab di tafsir.mushafuk.online; karya awal di t2; ʿulūm al-Qurʾān dan uṣūl di t3.",
        ],
        "cta": "Buka Mushaf",
        "resume": "Teruskan",
        "nav": [
            ("Quran", "../en/quran/"),
            ("Tafsir", "../en/tafsir.html"),
            ("Terjemahan", "../en/translations/"),
            ("Perihal", "about.html"),
        ],
        "readmode": (
            "Mod bacaan",
            "Buka mana-mana kitab di laman; halaman terakhir disimpan (paling banyak 5 kitab).",
        ),
        "cards": [
            ("../en/quran/", "Quran", "Mushaf Madinah 604 muka surat dengan tilawah.", "book"),
            ("../en/tafsir.html", "Tafsir", "Al-Sa'di, Ibn Kathir, al-Tabari dan lain-lain.", "tafsir"),
            ("https://t3.mushafuk.online/ulum-quran/", "Ulum al-Quran", "Al-Itqan oleh al-Suyuti dan Fada'il al-Quran oleh Abu Ubayd.", "ulum"),
            ("https://t3.mushafuk.online/usul/", "Usul tafsir", "Pengenalan kaedah tafsir (Ibn Taymiyyah).", "ulum"),
            ("../en/translations/", "Terjemahan", "Makna Al-Quran dalam 20+ bahasa.", "trans"),
            ("https://t1.mushafuk.online/", "Terjemahan lain (t1)", "Terjemahan tambahan di subdomain t1.", "trans"),
            ("../en/irab/", "I'rab", "Analisis nahu ayat (الإعراب).", "irab"),
            ("../en/gharib/", "Gharib al-Quran", "Makna perkataan jarang (غريب القرآن).", "gharib"),
            ("../en/qiraat/", "Tilawah", "Tujuh qari. Dengar ayat demi ayat.", "qiraat"),
            ("../ai/", "Mushafuk AI", "Cari dalam Al-Quran, tafsir dan terjemahan.", "ai"),
        ],
        "verses_label": "Ayat terkenal",
        "verses": [
            ("../en/page/1/", "Al-Fatihah"),
            ("../en/page/42/", "Quran 2:255 — Ayat al-Kursi"),
            ("../en/page/604/", "Al-Ikhlas"),
        ],
        "books_label": "Kitab dan bahagian",
        "books": [
            ("../en/translations/", "Katalog terjemahan"),
            ("../en/quran/", "Indeks surah"),
            ("../en/page/1/", "Halaman 1 mushaf"),
            ("https://t1.mushafuk.online/", "Terjemahan lain (t1)"),
            ("https://tafsir.mushafuk.online/aysar/", "Tafsir Aysar"),
            ("https://tafsir.mushafuk.online/mukhtasar/", "al-Mukhtasar (Arab)"),
            ("https://tafsir.mushafuk.online/saadi/", "Tafsir al-Sa'di"),
            ("https://tafsir.mushafuk.online/ibnkathir/", "Tafsir Ibn Kathir"),
            ("https://tafsir.mushafuk.online/tabari/", "Tafsir al-Tabari"),
            ("https://t2.mushafuk.online/mujahid/", "Tafsir Mujahid"),
            ("https://t3.mushafuk.online/ulum/itqan/", "al-Itqan, al-Suyuti"),
            ("https://t3.mushafuk.online/ulum/muqaddima-usul/", "Muqaddimah, Ibn Taymiyyah"),
        ],
        "footer": [
            ("/en/faq.html", "Soalan"),
            ("/en/sources.html", "Sumber"),
            ("/en/privacy.html", "Privasi"),
            ("/en/terms.html", "Syarat"),
        ],
    },
    "ur": {
        "dir": "rtl",
        "arr": "←",
        "h1": "یقیناً یہ قرآن وه راستہ دکھاتا ہے جو بہت ہی سیدھا ہے",
        "desc": "مدینہ مصحف صفحہ بہ صفحہ، تفسیر، اعراب، غریب اور اردو ترجمہ جوناگڑھی — مفت اور بغیر اشتہار۔",
        "ld_desc": "مدینہ مصحف، تفسیر اور تراجم کے ساتھ۔ مفت اور بغیر اشتہار۔",
        "tagline": "Mushafuk.online مدینہ کے مصحف کو صفحہ بہ صفحہ کھولتا ہے، واضح وسائلِ مطالعہ کے ساتھ۔",
        "intro": [
            "یہاں آپ مصحف کا عربی متن (۶۰۴ صفحات، روایتِ حفص) پڑھ سکتے ہیں، آیت وار تلاوت سن سکتے ہیں، اور کلاسیکی تفاسیر و معانی کے تراجم دیکھ سکتے ہیں — بغیر اکاؤنٹ اور بغیر اشتہار۔",
            "اردو میں محمد جوناگڑھی کا ترجمہ صفحہ بہ صفحہ دستیاب ہے۔ سعدی اور ابن کثیر کی تفاسیر کے اردو تراجم بھی موجود ہیں۔ مزید تراجم t1 ذیلی دامن پر ہیں۔",
            "اعراب (نحوی تجزیہ) اور غریب القرآن مشکل الفاظ سمجھنے میں مدد دیتے ہیں۔ عربی تفاسیر tafsir.mushafuk.online پر، متقدمین کے آثار t2 پر، اور علوم القرآن و اصول t3 پر ہیں۔",
        ],
        "cta": "مصحف کھولیں",
        "resume": "جاری رکھیں",
        "nav": [
            ("قرآن", "../en/quran/"),
            ("تفسیر", "../en/tafsir.html"),
            ("تراجم", "../en/translations/"),
            ("تعارف", "about.html"),
        ],
        "readmode": (
            "مطالعے کا انداز",
            "سائٹ کی کوئی بھی کتاب کھولیں؛ آخری صفحہ محفوظ رہتا ہے (زیادہ سے زیادہ ۵ کتابیں)۔",
        ),
        "cards": [
            ("../en/quran/", "قرآن", "۶۰۴ صفحات کا مدینہ مصحف، تلاوت کے ساتھ۔", "book"),
            ("../en/tafsir.html", "تفسیر", "السعدی، ابن کثیر، الطبری اور دیگر۔", "tafsir"),
            ("https://t3.mushafuk.online/ulum-quran/", "علوم القرآن", "سیوطی کی الاتقان اور ابو عبید کی فضائل القرآن۔", "ulum"),
            ("https://t3.mushafuk.online/usul/", "اصول تفسیر", "تفسیر کے اصول کا تعارف (ابن تیمیہ)۔", "ulum"),
            ("../en/translations/", "تراجم", "بیس سے زائد زبانوں میں معانی۔", "trans"),
            ("junagarhi/", "جوناگڑھی (اردو)", "محمد جوناگڑھی کا اردو ترجمہ، صفحہ بہ صفحہ۔", "trans"),
            ("../tafsir/tercume/saadi/ur/", "سعدی (اردو)", "تفسیر السعدی کا اردو ترجمہ۔", "tafsir"),
            ("../tafsir/tercume/ibnkathir/ur/", "ابن کثیر (اردو)", "تفسیر ابن کثیر کا اردو ترجمہ۔", "tafsir"),
            ("https://t1.mushafuk.online/", "دیگر تراجم (t1)", "t1 ذیلی دامن پر اضافی تراجم۔", "trans"),
            ("../en/irab/", "اعراب", "آیات کا نحوی تجزیہ (الإعراب)۔", "irab"),
            ("../en/gharib/", "غریب القرآن", "نادر الفاظ کے معانی (غريب القرآن)۔", "gharib"),
            ("../en/qiraat/", "تلاوت", "سات قاری۔ آیت وار سنیں۔", "qiraat"),
            ("../ai/", "Mushafuk AI", "قرآن، تفسیر اور تراجم میں تلاش۔", "ai"),
        ],
        "verses_label": "مشہور آیات",
        "verses": [
            ("../en/page/1/", "الفاتحہ"),
            ("../en/page/42/", "القرآن ۲:۲۵۵ — آیت الکرسی"),
            ("../en/page/604/", "الاخلاص"),
        ],
        "books_label": "کتب اور اقسام",
        "books": [
            ("junagarhi/", "ترجمہ جوناگڑھی"),
            ("../tafsir/tercume/saadi/ur/", "تفسیر سعدی (اردو)"),
            ("../tafsir/tercume/ibnkathir/ur/", "ابن کثیر (اردو)"),
            ("../en/quran/", "فہرستِ سورت"),
            ("../en/page/1/", "مصحف کا صفحہ ۱"),
            ("https://t1.mushafuk.online/", "دیگر تراجم (t1)"),
            ("https://tafsir.mushafuk.online/aysar/", "تفسیر ایسر"),
            ("https://tafsir.mushafuk.online/mukhtasar/", "المختصر (عربی)"),
            ("https://tafsir.mushafuk.online/saadi/", "تفسیر سعدی (عربی)"),
            ("https://tafsir.mushafuk.online/ibnkathir/", "ابن کثیر (عربی)"),
            ("https://tafsir.mushafuk.online/tabari/", "تفسیر طبری"),
            ("https://t2.mushafuk.online/mujahid/", "تفسیر مجاہد"),
            ("https://t3.mushafuk.online/ulum/itqan/", "الاتقان، سیوطی"),
            ("https://t3.mushafuk.online/ulum/muqaddima-usul/", "مقدمہ، ابن تیمیہ"),
        ],
        "footer": [
            ("/en/faq.html", "سوالات"),
            ("/en/sources.html", "مصادر"),
            ("/en/privacy.html", "رازداری"),
            ("/en/terms.html", "شرائط"),
        ],
    },
}


def esc_attr(s: str) -> str:
    return s.replace("&", "&amp;").replace('"', "&quot;")


def card(href: str, title: str, desc: str, kind: str, arr: str) -> str:
    return (
        f'<a class="card" href="{href}"><div class="ic">{ICO[kind]}</div>'
        f"<h3>{title}</h3><p>{desc}</p><span class=\"go\">{arr}</span></a>"
    )


def build(lang: str, d: dict) -> str:
    title = f"{d['h1']} — Mushafuk.online"
    menu = "".join(
        f'<a href="{href}"{" class=on" if code == lang else ""}>{code.upper()}</a>'
        for code, href in LANGS_MENU
    )
    hreflang = "".join(
        f'<link rel="alternate" hreflang="{code}" href="{url}">'
        for code, url in HREFLANG
    )
    nav_icons = ["book", "tafsir", "trans", "about"]
    nav = "".join(
        f'<a href="{href}">{ICO[nav_icons[i]]} {label}</a>'
        for i, (label, href) in enumerate(d["nav"])
    )
    intro_html = "".join(f"<p>{p}</p>" for p in [d["tagline"], *d["intro"]])
    rm_title, rm_desc = d["readmode"]
    readmode = (
        f'<div class="card readmode" id="readmode"><button type="button" class="rm-face" '
        f'aria-expanded="false"><div class="ic">{ICO["read"]}</div><h3>{rm_title}</h3>'
        f'<p>{rm_desc}</p><span class="go">{d["arr"]}</span></button>'
        f'<div class="rm-body" hidden><div class="rm-list"></div></div></div>'
    )
    cards = readmode + "".join(
        card(h, t, dd, k, d["arr"]) for h, t, dd, k in d["cards"]
    )
    verses = (
        f'<nav class="known" aria-label="{d["verses_label"]}">'
        + "".join(f'<a href="{h}">{t}</a>' for h, t in d["verses"])
        + "</nav>"
    )
    books = (
        f'<nav class="known" aria-label="{d["books_label"]}">'
        + "".join(f'<a href="{h}">{t}</a>' for h, t in d["books"])
        + "</nav>"
    )
    foot = "".join(f'<a href="{h}">{t}</a>' for h, t in d["footer"])
    ld = json.dumps(
        {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Mushafuk",
            "url": f"https://mushafuk.online/{lang}/",
            "inLanguage": lang,
            "description": d["ld_desc"],
            "publisher": {
                "@type": "Organization",
                "name": "Mushafuk",
                "url": "https://mushafuk.online/",
            },
        },
        ensure_ascii=False,
        separators=(",", ":"),
    )
    return (
        f'<!doctype html><html lang="{lang}" dir="{d["dir"]}"><head><meta charset="UTF-8">'
        f'<meta name="viewport" content="width=device-width,initial-scale=1">'
        f"<title>{title}</title>"
        f'<link rel="describedby" href="https://mushafuk.online/llms.txt" type="text/plain">'
        f'<script type="application/ld+json">{ld}</script>'
        f'<meta property="og:title" content="{esc_attr(title)}">'
        f'<meta property="og:description" content="{esc_attr(d["desc"])}">'
        f'<meta property="og:image" content="https://mushafuk.online/share.jpg">'
        f'<meta property="og:image:width" content="1200">'
        f'<meta property="og:image:height" content="630">'
        f'<meta name="twitter:card" content="summary_large_image">'
        f'<meta name="description" content="{esc_attr(d["desc"])}">'
        f'<link rel="icon" href="../icon.png">'
        f'<link rel="stylesheet" href="../home.css?v=12">'
        f'<link rel="canonical" href="https://mushafuk.online/{lang}/">'
        f"{hreflang}</head><body class=\"h\"><header class=\"top\"><div class=\"bar\">"
        f'<div class="row"><a class="logo" href="./" dir="ltr"><img src="../icon.png" alt="">'
        f'Mushafuk<span>.online</span></a><span class="langs">'
        f'<button type="button" class="lbtn" aria-haspopup="true" aria-expanded="false">'
        f"🌐 {lang.upper()} ▾</button><span class=\"lmenu\">{menu}</span></span></div>"
        f"<nav>{nav}</nav></div></header><section class=\"hero\">"
        f'<div class="bism" aria-label="بسم الله الرحمن الرحيم">&#xFC41;&#xFC42;&#xFC43;&#xFC44;</div>'
        f'<h1 class="verse">{d["h1"]}</h1>{intro_html}'
        f'<a class="cta" href="../en/quran/">{ICO["tafsir"]} {d["cta"]}</a>'
        f'<a class="cta resume" id="resume" hidden href="../en/page/1/">{d["resume"]}</a>'
        f'<img class="rehal" src="../home-rehal.webp" alt="Quran"></section>'
        f'<main class="cards">{cards}{verses}{books}</main>'
        f'<footer><img src="../icon.png" alt=""><div class="c" dir="ltr">© 2026 Mushafuk.online</div>'
        f'<div class="l">{foot}</div>{MOSQ}<div class="gb"></div></footer>'
        f'<script src="../site.js?v=10"></script>\n'
        f'<script src="/read-shelf.js?v=3" defer></script></body></html>'
    )


def main() -> None:
    for lang, data in DATA.items():
        out = ROOT / lang / "index.html"
        out.write_text(build(lang, data), encoding="utf-8")
        print(f"wrote {out.relative_to(ROOT)} ({out.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
