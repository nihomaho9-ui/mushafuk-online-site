#!/usr/bin/env python3
"""Generate Mushafuk.online privacy policy pages in every target language.

Run from the repo root or from this file:  python3 tools/gen_privacy.py
Writes:
  privacy.html              (Arabic, also handles ?lang= and #lang redirects)
  <lang>/privacy.html       for every other language
  updates sitemap-main.xml privacy <url> entries

Does not deploy or push.
"""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = Path(__file__).with_name("privacy_i18n.json")
BASE = "https://mushafuk.online"

# Languages that have a full local chrome (quran, tafsir, translations, about, faq, terms, sources)
FULL_CHROME = {"ar", "az", "en", "ru", "tr"}
# Languages that have a local about.html but not the rest of the chrome
ABOUT_ONLY = {"bn", "fr", "id", "ms", "ur"}

# Extra hreflang tags besides the primary code
HREFLANG_EXTRA = {
    "en": ["en-US", "en-GB"],
    "es": ["es-ES", "es-419"],
    "pt": ["pt-BR", "pt-PT"],
    "zh": ["zh-CN", "zh-Hans"],
}

# Aliases accepted by /privacy.html?lang= and #hash
LANG_ALIASES = {
    "zh-cn": "zh",
    "zh-hans": "zh",
    "zh-tw": "zh",
    "zh-hk": "zh",
    "zh-hant": "zh",
    "pt-br": "pt",
    "pt-pt": "pt",
    "en-us": "en",
    "en-gb": "en",
    "es-es": "es",
    "es-419": "es",
    "az-az": "az",
    "de-de": "de",
    "fr-fr": "fr",
    "hi-in": "hi",
    "ja-jp": "ja",
    "nl-nl": "nl",
    "ru-ru": "ru",
    "tr-tr": "tr",
    "id-id": "id",
    "ms-my": "ms",
    "bn-bd": "bn",
    "ckb": "ku",
    "kur": "ku",
}

STYLE = """
.page-hero{background:linear-gradient(165deg,#0f4d3a 0%,#0b3a2c 58%,#16382c 100%);color:#fbf7ee;text-align:center;padding:3.1rem 1.2rem 2.3rem;border-bottom:4px solid #b8923a}
.page-hero h1{color:#fff;margin:0 0 .55rem;font-size:clamp(2rem,4.4vw,3.05rem)}
.page-hero p{max-width:40rem;margin:.35rem auto;color:#e6dcc4;font-size:1.05rem}
.kicker{letter-spacing:.16em;text-transform:uppercase;font-size:.72rem;color:#e0c27a;font-weight:700;margin:0 0 .45rem}
.sheet{max-width:860px;margin:0 auto;padding:1.4rem 1rem 4rem}
.q{background:#fff;border:1px solid #ece3cd;border-inline-start:4px solid #b8923a;border-radius:16px;padding:1.05rem 1.2rem 1.1rem;margin:0 0 .85rem;box-shadow:0 10px 26px rgba(15,77,58,.05)}
.q h2{margin:0 0 .55rem;font-size:1.22rem;color:#0b3a2c}
.q p{margin:.32rem 0;color:#3e352b}
.q a{color:#0f4d3a;font-weight:650;text-decoration:underline;text-underline-offset:.14em}
footer nav{margin-bottom:.25rem}
.langs .lmenu{max-height:min(70vh,28rem);overflow:auto;min-width:13.5rem}
.langs .lmenu a{text-align:start;padding:.28rem .65rem!important;white-space:nowrap}
""".strip()


def url_for(code: str) -> str:
    return f"{BASE}/privacy.html" if code == "ar" else f"{BASE}/{code}/privacy.html"


def path_for(code: str) -> Path:
    return ROOT / "privacy.html" if code == "ar" else ROOT / code / "privacy.html"


def prefix(code: str) -> str:
    """Relative prefix from this privacy page to the site root."""
    return "" if code == "ar" else "../"


def href_chrome(code: str, name: str) -> str:
    """Relative or root-absolute href for a chrome page from this language's privacy page."""
    if name in {"quran", "translations"}:
        suffix = f"{name}/"
    elif name == "tafsir":
        suffix = "tafsir.html"
    else:
        suffix = f"{name}.html"
    if code in FULL_CHROME:
        return suffix  # same folder (root for ar, /xx/ for others)
    if name == "about" and code in ABOUT_ONLY:
        return "about.html"
    # fall back to English
    if code == "ar":
        return f"en/{suffix}"
    return f"../en/{suffix}"


def footer_href(code: str, name: str) -> str:
    if name == "privacy":
        return "/privacy.html" if code == "ar" else f"/{code}/privacy.html"
    if code in FULL_CHROME:
        return f"/{name}.html" if code == "ar" else f"/{code}/{name}.html"
    return f"/en/{name}.html"


def alternate_tags(order: list[str]) -> str:
    parts = []
    for code in order:
        parts.append(f'<link rel="alternate" hreflang="{code}" href="{url_for(code)}">')
        for extra in HREFLANG_EXTRA.get(code, []):
            parts.append(f'<link rel="alternate" hreflang="{extra}" href="{url_for(code)}">')
    parts.append(f'<link rel="alternate" hreflang="x-default" href="{url_for("en")}">')
    return "".join(parts)


def lang_menu(current: str, langs: list[dict]) -> str:
    pre = prefix(current)
    items = []
    for L in langs:
        code = L["code"]
        href = f"{pre}privacy.html" if code == "ar" else f"{pre}{code}/privacy.html"
        on = " class=on" if code == current else ""
        items.append(f'<a href="{href}" hreflang="{code}"{on}>{L["label"]}</a>')
    return "".join(items)


def paras(lines: list[str]) -> str:
    return "".join(f"<p>{p}</p>" for p in lines)


def redirect_script(order: list[str]) -> str:
    mapping = {c: (f"/{c}/privacy.html" if c != "ar" else "/privacy.html") for c in order}
    mapping.update({alias: mapping[dest] for alias, dest in LANG_ALIASES.items() if dest in mapping})
    # compact JSON
    data = json.dumps(mapping, ensure_ascii=False, separators=(",", ":"))
    return (
        "<script>(function(){var m=" + data + ";"
        "var q=(new URLSearchParams(location.search).get('lang')||'');"
        "var h=(location.hash||'').replace('#','');"
        "var want=(q||h).toLowerCase().replace('_','-');"
        "if(!want)return;"
        "if(!m[want]&&want.indexOf('-')>-1)want=want.split('-')[0];"
        "var dest=m[want]||'/en/privacy.html';"
        "if(dest!==location.pathname)location.replace(dest);})();</script>"
    )


def render(L: dict, langs: list[dict], order: list[str]) -> str:
    code = L["code"]
    pre = prefix(code)
    nav_quran = href_chrome(code, "quran")
    nav_tafsir = href_chrome(code, "tafsir")
    nav_tr = href_chrome(code, "translations")
    nav_about = href_chrome(code, "about")
    canonical = url_for(code)
    html_lang = L.get("html_lang", code)
    direction = L["dir"]
    btn = L["btn"]

    terms = footer_href(code, "terms")
    sources = footer_href(code, "sources")
    faq = footer_href(code, "faq")
    privacy = footer_href(code, "privacy")

    contact = (
        f'<article class="q"><h2>{L["contact_h"]}</h2>'
        f'<p>{L["contact_name"]}</p>'
        f'<p>{L["email_label"]}: <a href="mailto:nibrascode@gmail.com">nibrascode@gmail.com</a>.</p>'
        f'<p>{L["site_label"]}: <a href="https://nibrascode.com">nibrascode.com</a>.</p>'
        f'<p><a href="{terms}">{L["terms_label"]}</a></p>'
        f'<p><a href="{sources}">{L["sources_label"]}</a></p>'
        f"</article>"
    )

    main = "".join([
        f'<article class="q"><h2>{L["not_collect_h"]}</h2>{paras(L["not_collect"])}</article>',
        f'<article class="q"><h2>{L["stats_h"]}</h2>{paras(L["stats"])}</article>',
        f'<article class="q"><h2>{L["device_h"]}</h2>{paras(L["device"])}</article>',
        f'<article class="q"><h2>{L["search_h"]}</h2>{paras(L["search"])}</article>',
        f'<article class="q"><h2>{L["internet_h"]}</h2>{paras(L["internet"])}</article>',
        f'<article class="q"><h2>{L["app_h"]}</h2>{paras(L["app"])}</article>',
        f'<article class="q"><h2>{L["children_h"]}</h2>{paras(L["children"])}</article>',
        contact,
    ])

    redir = redirect_script(order) if code == "ar" else ""

    return f"""<!doctype html>
<html lang="{html_lang}" dir="{direction}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{L["title"]}</title>
<meta name="description" content="{L["description"]}">
<link rel="canonical" href="{canonical}">
{alternate_tags(order)}
<meta property="og:title" content="{L["title"]}">
<meta property="og:description" content="{L["description"]}">
<meta property="og:url" content="{canonical}">
<meta property="og:image" content="{BASE}/share.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="{pre}icon.png">
<link rel="stylesheet" href="{pre}site.css?v=8">
<style>
{STYLE}
</style>
{redir}
</head>
<body>
<header class="nav"><div class="in"><a class="logo" href="./" dir="ltr"><img src="{pre}icon.png" alt="">Mushafuk<span>.online</span></a><nav><a href="{nav_quran}">{L["nav_quran"]}</a><a href="{nav_tafsir}">{L["nav_tafsir"]}</a><a href="{nav_tr}">{L["nav_tr"]}</a><a href="{nav_about}">{L["nav_about"]}</a><span class="langs"><button type="button" class="lbtn" aria-haspopup="true" aria-expanded="false">🌐 {btn} ▾</button><span class="lmenu">{lang_menu(code, langs)}</span></span></nav></div></header>
<section class="page-hero"><p class="kicker">{L["kicker"]}</p><h1>{L["h1"]}</h1><p>{L["updated"]}</p><p>{L["intro1"]}</p><p>{L["intro2"]}</p></section>
<main class="sheet">{main}</main>
<footer><nav><a href="{faq}">{L["nav_questions"]}</a><a href="{sources}">{L["sources_label"]}</a><a href="{privacy}">{L["nav_privacy"]}</a><a href="{terms}">{L["terms_label"]}</a></nav><p>© 2026 Mushafuk.online</p></footer>
<script src="{pre}site.js?v=7"></script>
</body>
</html>
"""


REQUIRED = [
    "code", "html_lang", "dir", "label", "btn", "title", "description", "kicker", "h1",
    "updated", "intro1", "intro2",
    "nav_quran", "nav_tafsir", "nav_tr", "nav_about", "nav_questions", "nav_privacy",
    "not_collect_h", "not_collect", "stats_h", "stats", "device_h", "device",
    "search_h", "search", "internet_h", "internet", "app_h", "app",
    "children_h", "children", "contact_h", "contact_name",
    "email_label", "site_label", "terms_label", "sources_label",
]


def validate(langs: list[dict]) -> None:
    seen = set()
    for L in langs:
        code = L["code"]
        if code in seen:
            raise SystemExit(f"duplicate language {code}")
        seen.add(code)
        missing = [k for k in REQUIRED if k not in L]
        if missing:
            raise SystemExit(f"{code}: missing keys {missing}")
        for list_key in ("not_collect", "stats", "device", "search", "internet", "app", "children"):
            if not isinstance(L[list_key], list) or not L[list_key]:
                raise SystemExit(f"{code}: {list_key} must be a non-empty list")
            if any(("<" in p or ">" in p) and "href" not in p for p in L[list_key]):
                # allow no raw tags in paragraphs except we don't use tags there
                if re.search(r"</?[a-zA-Z]", " ".join(L[list_key])):
                    raise SystemExit(f"{code}: unexpected HTML in {list_key}")
    # length check against English
    en = next(L for L in langs if L["code"] == "en")
    for L in langs:
        for list_key in ("not_collect", "stats", "device", "search", "internet", "app", "children"):
            if len(L[list_key]) != len(en[list_key]):
                raise SystemExit(
                    f"{L['code']}: {list_key} has {len(L[list_key])} paras, English has {len(en[list_key])}"
                )


def update_sitemap(order: list[str]) -> None:
    path = ROOT / "sitemap-main.xml"
    text = path.read_text(encoding="utf-8")
    # Remove existing privacy <url> blocks, then insert a complete set before </urlset> or after last kept block.
    text2, n = re.subn(
        r"<url><loc>https://mushafuk\.online/(?:[a-z]{2}/)?privacy\.html</loc><lastmod>[^<]*</lastmod></url>\n?",
        "",
        text,
    )
    block = "".join(
        f"<url><loc>{url_for(code)}</loc><lastmod>2026-11-24</lastmod></url>\n" for code in order
    )
    if "</urlset>" not in text2:
        raise SystemExit("sitemap-main.xml: missing </urlset>")
    text2 = text2.replace("</urlset>", block + "</urlset>")
    path.write_text(text2, encoding="utf-8")
    print(f"sitemap-main.xml: replaced {n} privacy URLs with {len(order)}")


def patch_interface_footers() -> None:
    """Point existing interface-language about/index footers at the new local privacy page."""
    for code in sorted(ABOUT_ONLY):
        for name in ("about.html", "index.html"):
            p = ROOT / code / name
            if not p.exists():
                continue
            t = p.read_text(encoding="utf-8")
            new = t.replace('href="/en/privacy.html"', f'href="/{code}/privacy.html"')
            if new != t:
                p.write_text(new, encoding="utf-8")
                print(f"updated footer in {code}/{name}")
    gen = ROOT / "tools" / "gen_home.py"
    if gen.exists():
        t = gen.read_text(encoding="utf-8")
        mapping = {
            '("/en/privacy.html", "Confidentialité")': '("/fr/privacy.html", "Confidentialité")',
            '("/en/privacy.html", "Privasi")': None,  # id and ms both use Privasi — handled below
            '("/en/privacy.html", "গোপনীয়তা")': '("/bn/privacy.html", "গোপনীয়তা")',
            '("/en/privacy.html", "رازداری")': '("/ur/privacy.html", "رازداری")',
        }
        new = t
        # Indonesian is first Privasi (around line 227), Malay second (around 360). Use line context.
        new = new.replace('("/en/privacy.html", "Confidentialité")', '("/fr/privacy.html", "Confidentialité")')
        new = new.replace('("/en/privacy.html", "গোপনীয়তা")', '("/bn/privacy.html", "গোপনীয়তা")')
        new = new.replace('("/en/privacy.html", "رازداری")', '("/ur/privacy.html", "رازداری")')
        # replace the two Privasi occurrences in order: id then ms, by unique nearby context if needed
        # Count occurrences
        if new.count('("/en/privacy.html", "Privasi")') == 2:
            new = new.replace('("/en/privacy.html", "Privasi")', '("/id/privacy.html", "Privasi")', 1)
            new = new.replace('("/en/privacy.html", "Privasi")', '("/ms/privacy.html", "Privasi")', 1)
        if new != t:
            gen.write_text(new, encoding="utf-8")
            print("updated tools/gen_home.py footer targets")


def main() -> None:
    langs: list[dict] = json.loads(DATA.read_text(encoding="utf-8"))
    validate(langs)
    order = [L["code"] for L in langs]
    written = []
    for L in langs:
        dest = path_for(L["code"])
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_text(render(L, langs, order), encoding="utf-8")
        written.append(str(dest.relative_to(ROOT)))
    update_sitemap(order)
    patch_interface_footers()
    print("wrote", len(written), "pages:")
    for w in written:
        print(" ", w)


if __name__ == "__main__":
    main()
