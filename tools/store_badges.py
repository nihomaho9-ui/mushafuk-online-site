#!/usr/bin/env python3
"""Homepage AppGallery + Google Play (coming soon) badge markup."""

from __future__ import annotations

AGC_URL = "https://appgallery.huawei.com/app/C119644671"

# Official-looking store badges in the site green/gold palette (no rainbow).
# Flower and Play marks are monochrome so they stay on-brand in RTL and LTR.

AGC_SVG = """\
<svg class="store-svg" viewBox="0 0 180 54" width="180" height="54" aria-hidden="true" focusable="false">
  <rect width="180" height="54" rx="8" fill="#0c3323"/>
  <rect x="0.75" y="0.75" width="178.5" height="52.5" rx="7.25" fill="none" stroke="#c9a24f" stroke-width="1.5"/>
  <g transform="translate(27 27)" fill="#f1e6c8">
    <path d="M0-5c2.2-3.6 3.4-8.2 0-16.2-3.4 8-2.2 12.6 0 16.2z" transform="rotate(0)"/>
    <path d="M0-5c2.2-3.6 3.4-8.2 0-16.2-3.4 8-2.2 12.6 0 16.2z" transform="rotate(45)"/>
    <path d="M0-5c2.2-3.6 3.4-8.2 0-16.2-3.4 8-2.2 12.6 0 16.2z" transform="rotate(90)"/>
    <path d="M0-5c2.2-3.6 3.4-8.2 0-16.2-3.4 8-2.2 12.6 0 16.2z" transform="rotate(135)"/>
    <path d="M0-5c2.2-3.6 3.4-8.2 0-16.2-3.4 8-2.2 12.6 0 16.2z" transform="rotate(180)"/>
    <path d="M0-5c2.2-3.6 3.4-8.2 0-16.2-3.4 8-2.2 12.6 0 16.2z" transform="rotate(225)"/>
    <path d="M0-5c2.2-3.6 3.4-8.2 0-16.2-3.4 8-2.2 12.6 0 16.2z" transform="rotate(270)"/>
    <path d="M0-5c2.2-3.6 3.4-8.2 0-16.2-3.4 8-2.2 12.6 0 16.2z" transform="rotate(315)"/>
    <circle r="3.1" fill="#0c3323"/>
    <circle r="1.6" fill="#c9a24f"/>
  </g>
  <text x="50" y="20" fill="#d7c89a" font-family="Segoe UI,Helvetica,Arial,sans-serif" font-size="8" font-weight="600" letter-spacing="0.8">EXPLORE IT ON</text>
  <text x="50" y="40" fill="#fffdf8" font-family="Segoe UI,Helvetica,Arial,sans-serif" font-size="16" font-weight="700">AppGallery</text>
</svg>"""

PLAY_SVG = """\
<svg class="store-svg" viewBox="0 0 180 54" width="180" height="54" aria-hidden="true" focusable="false">
  <rect width="180" height="54" rx="8" fill="#1a2a22"/>
  <rect x="0.75" y="0.75" width="178.5" height="52.5" rx="7.25" fill="none" stroke="#8a7a50" stroke-width="1.5"/>
  <g transform="translate(14 12)">
    <path fill="#c9a24f" d="M2.2 1.6c0-.9.7-1.4 1.5-1 8.6 4.8 17.2 9.7 25.8 14.5.8.5.8 1.4 0 1.9L3.7 31.4c-.8.5-1.5 0-1.5-1V1.6z"/>
    <path fill="#0c3323" opacity=".35" d="M3.2 16.2 27.4 15.2 3.2 30.4z"/>
  </g>
  <text x="52" y="33" fill="#e8dfc8" font-family="Segoe UI,Helvetica,Arial,sans-serif" font-size="18" font-weight="700">Google Play</text>
</svg>"""

# Homepage languages only (ar is the site root).
TEXT = {
    "ar": {
        "title": "حمّل التطبيق",
        "agc": "حمّل من AppGallery",
        "play": "قريبًا على Google Play",
    },
    "az": {
        "title": "Tətbiqi yüklə",
        "agc": "AppGallery-dən yüklə",
        "play": "Google Play-də tezliklə",
    },
    "en": {
        "title": "Get the app",
        "agc": "Download on AppGallery",
        "play": "Coming soon on Google Play",
    },
    "tr": {
        "title": "Uygulamayı indir",
        "agc": "AppGallery'den indir",
        "play": "Google Play'de yakında",
    },
    "ru": {
        "title": "Скачать приложение",
        "agc": "Скачать в AppGallery",
        "play": "Скоро в Google Play",
    },
    "fr": {
        "title": "Télécharger l'application",
        "agc": "Télécharger sur AppGallery",
        "play": "Bientôt sur Google Play",
    },
    "id": {
        "title": "Unduh aplikasinya",
        "agc": "Unduh di AppGallery",
        "play": "Segera hadir di Google Play",
    },
    "ms": {
        "title": "Muat turun aplikasi",
        "agc": "Muat turun di AppGallery",
        "play": "Akan datang di Google Play",
    },
    "bn": {
        "title": "অ্যাপটি ডাউনলোড করুন",
        "agc": "AppGallery থেকে ডাউনলোড করুন",
        "play": "শীঘ্রই Google Play-তে",
    },
    "ur": {
        "title": "ایپ ڈاؤن لوڈ کریں",
        "agc": "AppGallery سے ڈاؤن لوڈ کریں",
        "play": "Google Play پر جلد",
    },
}


def section(lang: str) -> str:
    t = TEXT[lang]
    return (
        f'<section class="stores" aria-label="{t["title"]}">'
        f"<h2>{t['title']}</h2>"
        f'<div class="stores-row">'
        f'<a class="store-item store-agc" href="{AGC_URL}" '
        f'target="_blank" rel="noopener noreferrer" dir="ltr" '
        f'aria-label="{t["agc"]}">{AGC_SVG}</a>'
        f'<div class="store-item store-play" aria-disabled="true">'
        f'<div class="store-badge" dir="ltr" aria-hidden="true">{PLAY_SVG}</div>'
        f'<p class="soon">{t["play"]}</p>'
        f"</div>"
        f"</div>"
        f"</section>"
    )
