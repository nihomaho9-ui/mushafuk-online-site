#!/usr/bin/env python3
"""Homepage AppGallery + Google Play (coming soon) badge markup."""

from __future__ import annotations

AGC_URL = "https://appgallery.huawei.com/app/C119644671"

# Official store-badge colours: black badges, thin grey border, white wordmarks.
# AppGallery uses the red rounded-square bag mark; Play uses the 4-colour triangle.

AGC_SVG = """\
<svg class="store-svg" viewBox="0 0 180 54" width="180" height="54" aria-hidden="true" focusable="false">
  <rect width="180" height="54" rx="8" fill="#000"/>
  <rect x="0.5" y="0.5" width="179" height="53" rx="7.5" fill="none" stroke="#A6A6A6" stroke-width="1"/>
  <g transform="translate(9 11)">
    <rect width="32" height="32" rx="7.2" fill="#E60012"/>
    <path fill="#fff" d="M9.2 13.1h13.6l-1 12.15a2.5 2.5 0 0 1-2.48 2.25h-6.64a2.5 2.5 0 0 1-2.48-2.25Z"/>
    <path fill="none" stroke="#fff" stroke-width="1.7" stroke-linecap="round" d="M13.15 13.1V10.2c0-2.15 1.25-3.5 2.85-3.5s2.85 1.35 2.85 3.5v2.9"/>
  </g>
  <text x="48" y="21" fill="#fff" font-family="Arial,Helvetica,sans-serif" font-size="8" font-weight="600" letter-spacing="0.7">EXPLORE IT ON</text>
  <text x="48" y="40" fill="#fff" font-family="Arial,Helvetica,sans-serif" font-size="16" font-weight="700">AppGallery</text>
</svg>"""

PLAY_SVG = """\
<svg class="store-svg" viewBox="0 0 180 54" width="180" height="54" aria-hidden="true" focusable="false">
  <rect width="180" height="54" rx="8" fill="#000"/>
  <rect x="0.5" y="0.5" width="179" height="53" rx="7.5" fill="none" stroke="#A6A6A6" stroke-width="1"/>
  <g transform="translate(9.5 11)">
    <defs>
      <clipPath id="mushafuk-gp-shape">
        <path d="M3.4 2.55C2.35 1.95 1.5 2.4 1.5 3.7v24.6c0 1.3.85 1.75 1.9 1.15L29.7 17.15c1-.55 1-1.75 0-2.3Z"/>
      </clipPath>
    </defs>
    <g clip-path="url(#mushafuk-gp-shape)">
      <path fill="#00D3F8" d="M1.5 3.2 20.6 11.7 11 16 1.5 16Z"/>
      <path fill="#00E676" d="M1.5 16 11 16 20.6 20.3 1.5 28.8Z"/>
      <path fill="#FFD400" d="M11 16 20.6 11.7 30.6 16Z"/>
      <path fill="#FF3A44" d="M11 16 30.6 16 20.6 20.3Z"/>
    </g>
  </g>
  <text x="46" y="21" fill="#fff" font-family="Arial,Helvetica,sans-serif" font-size="8" font-weight="600" letter-spacing="0.8">GET IT ON</text>
  <text x="46" y="40" fill="#fff" font-family="Arial,Helvetica,sans-serif" font-size="16" font-weight="700">Google Play</text>
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
