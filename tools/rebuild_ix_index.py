#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Rebuild ai/ix/{prefix}.json so it matches ai/engine.js.

Live index format (do not switch to [surah, ayah]):
  {
    "folded_or_arabic_key": [[sourceId, globalAyahIndex], ...]
  }
globalAyahIndex is the flattened ayah index (0..6235), the same number app.js
stores as `i`. sourceId is the position of that text in ai/src.json.

Latin keys are fold()'d (ə→e, ı→i, ö→o, ü→u, ş→s, ç→c, ğ→g) and then peeled
with the same suffix list as engine.js peelWord(). Arabic keys are arNorm()'d,
including the Osmanic skeletons (صلوة→صلاة, حيوة→حياة, ربوا→ربا, …).

The checked-in ix/ already contains full surface forms for every language.
Query-time peeling in engine.js matches those forms by prefix, so a full
rebuild is optional. Use this script when verse text changes:

  python3 tools/rebuild_ix_index.py --src ai/src.json --out ai/ix
  python3 tools/rebuild_ix_index.py --check
"""

from __future__ import annotations

import argparse
import json
import os
import re
from collections import defaultdict

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TOTAL = 6236
AR_DIAC = re.compile(r"[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED\u0640]")
SUFFIX_LONG = re.compile(
    r"(larindan|lerinden|larina|lerine|larini|lerini|lardan|lerden|larda|lerde|"
    r"larin|lerin|lara|lere|lari|leri|mizdan|mizden|nizdan|nizden|mizin|nizin|"
    r"daki|deki|acaq|ecek|maq|mek|dan|den|nin|nun|lar|ler)$"
)
SUFFIX_SHORT = re.compile(r"(miz|muz|niz|nuz|mis|mus|da|de|le|la|ye|ya|in|un|si|su)$")
AZ_STEM = {
    "sebr": "sebir",
    "sabir": "sebir",
    "hokm": "hokum",
    "emr": "emir",
    "nefs": "nefis",
    "zulm": "zulum",
    "zulum": "zulum",
    "valideynler": "valideyn",
    "bagislama": "bagisla",
    "bagislanma": "bagisla",
    "bagislayan": "bagisla",
}
STOP_AZ = set()


def fold(s: str) -> str:
    return (
        s.replace("İ", "i")
        .replace("I", "ı")
        .lower()
        .replace("ə", "e")
        .replace("ı", "i")
        .replace("ö", "o")
        .replace("ó", "o")
        .replace("ü", "u")
        .replace("ú", "u")
        .replace("ş", "s")
        .replace("ç", "c")
        .replace("ğ", "g")
        .replace("â", "a")
        .replace("î", "i")
        .replace("û", "u")
    )


def ar_norm(s: str) -> str:
    s = AR_DIAC.sub("", s)
    s = re.sub(r"[أإآٱ]", "ا", s)
    s = (
        s.replace("صلوة", "صلاة")
        .replace("زكوة", "زكاة")
        .replace("حيوة", "حياة")
        .replace("غدوة", "غداة")
        .replace("ربوا", "ربا")
        .replace("مشكوة", "مشكاة")
        .replace("نجوة", "نجاة")
        .replace("ى", "ي")
        .replace("ة", "ه")
        .replace("ؤ", "و")
        .replace("ئ", "ي")
        .replace("\u0621", "")
    )
    return s


def peel_word(w: str) -> str:
    if re.search(r"[\u0600-\u06FF]", w):
        return w
    s = fold(w).strip()
    if s in AZ_STEM or len(s) <= 3:
        return AZ_STEM.get(s, s)
    for _ in range(3):
        if s in AZ_STEM:
            return AZ_STEM[s]
        stripped = SUFFIX_LONG.sub("", s)
        if not (len(stripped) >= 3 and stripped != s) and len(s) >= 5:
            short = SUFFIX_SHORT.sub("", s)
            if len(short) >= 4 and short != s:
                stripped = short
        if len(stripped) >= 3 and stripped != s:
            s = stripped
        else:
            break
    if len(s) >= 6:
        one = re.sub(r"[aeiu]$", "", s)
        if len(one) >= 5 and one != s:
            s = one
    return AZ_STEM.get(s, s)


def load_stop() -> set:
    # Keep in step with STOP.az in ai/engine.js
    raw = (
        "ve və bir bu da de də haqqinda haqqında haqda aye ayə ayet sura surə sure "
        "nece necə ne nə nedir nədir hansi hansı her hər niye niyə harada harda ku ki "
        "ucun üçün etmek etmək eden edən edenler edənlər edenlerin edənlərin eder edər "
        "olmaq olan olanlar olanların vermek vermək veren verən deyen deyən demek demək"
    )
    return {fold(w) for w in raw.split()}


def index_verses(rows, out_dir: str) -> int:
    """rows: iterable of (source_id, global_index, text)."""
    os.makedirs(out_dir, exist_ok=True)
    buckets = defaultdict(lambda: defaultdict(set))
    stop = load_stop()
    for src, i, text in rows:
        if not text:
            continue
        if re.search(r"[\u0600-\u06FF]", text) and not re.search(r"[A-Za-zƏəİıÖöÜüŞşÇçĞğ]", text):
            norm = ar_norm(text)
            for raw in re.split(r"[^\u0600-\u06FF]+", norm):
                if len(raw) < 2:
                    continue
                buckets[raw[:2]][raw].add((src, i))
                if raw.startswith("ال") and len(raw) > 4:
                    stem = raw[2:]
                    buckets[stem[:2]][stem].add((src, i))
            continue
        for raw in re.split(r"[^\wəğıöşüçƏĞIİÖŞÜÇ]+", text, flags=re.UNICODE):
            w = fold(raw)
            if len(w) < 2 or w in stop:
                continue
            stem = peel_word(w)
            if len(stem) < 2 or stem in stop:
                continue
            buckets[stem[:2]][stem].add((src, i))
            if w != stem:
                buckets[w[:2]][w].add((src, i))
    for prefix, terms in buckets.items():
        safe = prefix.replace("/", "_")
        payload = {term: sorted(list(p) for p in pairs) for term, pairs in terms.items()}
        with open(os.path.join(out_dir, safe + ".json"), "w", encoding="utf-8") as f:
            json.dump(payload, f, ensure_ascii=False, separators=(",", ":"))
    return len(buckets)


def rows_from_src(src_path: str):
    src = json.load(open(src_path, encoding="utf-8"))
    base = os.path.dirname(src_path)
    # ai/{lang}.json holds the five core texts. Other languages live in the
    # already-built ix/ and are not duplicated as flat arrays.
    lang_file = {"ar": "ar.json", "az": "az.json", "en": "en.json", "ru": "ru.json", "tr": "tr.json"}
    for sid, row in enumerate(src):
        code = row.get("l")
        fn = lang_file.get(code)
        if not fn:
            continue
        path = os.path.join(base, fn)
        if not os.path.exists(path):
            continue
        verses = json.load(open(path, encoding="utf-8"))
        if not isinstance(verses, list):
            continue
        for i, text in enumerate(verses):
            yield sid, i, text or ""


def check() -> None:
    cases = {
        "valideynlərə": "valideyn",
        "valideynə": "valideyn",
        "vaxtları": "vaxt",
        "namazın": "namaz",
        "mükafatı": "mukafat",
        "səbir": "sebir",
        "səbr": "sebir",
        "edənlərin": "eden",
        "qiblə": "qible",
        "yaxşılıq": "yaxsiliq",
    }
    for raw, want in cases.items():
        got = peel_word(raw)
        if got != want:
            raise SystemExit(f"peel {raw} → {got}, want {want}")
    norm = ar_norm("ٱلصَّلَوٰةَ وَٱلزَّكَوٰةَ وَٱلْحَيَوٰةَ وَٱلرِّبَوٰا")
    for piece in ("صلاه", "زكاه", "حياه", "ربا"):
        if piece not in norm:
            raise SystemExit(f"ar_norm missing {piece} in {norm}")
    az_path = os.path.join(ROOT, "ai", "az.json")
    meta_path = os.path.join(ROOT, "ai", "meta.json")
    if os.path.exists(az_path) and os.path.exists(meta_path):
        az = json.load(open(az_path, encoding="utf-8"))
        counts = json.load(open(meta_path, encoding="utf-8"))["counts"]

        def index_of(s, a):
            i = 0
            for n in range(1, s):
                i += counts[n - 1]
            return i + a - 1

        i = index_of(2, 83)
        stems = {peel_word(fold(w)) for w in re.split(r"[^\wəğıöşüçƏĞIİÖŞÜÇ]+", az[i]) if w}
        if "valideyn" not in stems:
            raise SystemExit("2:83 did not peel to valideyn: " + " ".join(sorted(stems)[:12]))
    print("check ok")


def main() -> None:
    p = argparse.ArgumentParser()
    p.add_argument("--src", default=os.path.join(ROOT, "ai", "src.json"))
    p.add_argument("--out", default="")
    p.add_argument("--check", action="store_true")
    args = p.parse_args()
    if args.check or not args.out:
        check()
        if not args.out:
            return
    n = index_verses(rows_from_src(args.src), args.out)
    print(f"wrote {n} prefix files to {args.out}")


if __name__ == "__main__":
    main()
