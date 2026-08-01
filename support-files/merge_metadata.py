#!/usr/bin/env python3
"""
Unisce i metadati grezzi (grezzi.txt) nel database canti.json.

Formato atteso di grezzi.txt: blocchi separati da righe vuote, ognuno:
    slug-del-canto
    <section class="song-metadata">...</section>

Il campo "metadata" (dizionario ordinato label -> value) viene aggiunto
a ogni canto in canti.json il cui "fileName" corrisponde a "slug.html".

Uso:
    python3 merge_metadata.py canti.json grezzi.txt canti_aggiornato.json
"""

# SPOSTARE QUESTO SCRIPT NELLA ROOT DEL PROGETTO PER ESEGUIRLO
# SPOSTARE ANCHE IL FILE grezzi.txt
# ESEGUIRLO CON IL COMANDO python merge_metadata.py canti.json grezzi.txt canti.json

import json
import re
import sys
from collections import OrderedDict

LABEL_RE = re.compile(
    r'<span class="metadata-label">\s*(.*?)\s*:?\s*</span>\s*'
    r'<span class="metadata-value">\s*(.*?)\s*</span>',
    re.DOTALL
)


def parse_grezzi(path):
    """Ritorna un dict: slug -> OrderedDict(label -> value)"""
    with open(path, encoding="utf-8") as f:
        raw = f.read()

    # Blocchi separati da una o piu' righe vuote
    blocks = re.split(r'\n\s*\n', raw.strip())

    result = {}
    for block in blocks:
        lines = block.strip().splitlines()
        if not lines:
            continue
        slug = lines[0].strip()
        html = "\n".join(lines[1:])

        pairs = LABEL_RE.findall(html)
        if not pairs:
            print(f"[!] Nessun metadato trovato per '{slug}', salto.", file=sys.stderr)
            continue

        metadata = OrderedDict()
        for label, value in pairs:
            # pulizia base: spazi multipli, entita' HTML comuni gia' nel testo
            label = re.sub(r'\s+', ' ', label).strip()
            value = re.sub(r'\s+', ' ', value).strip()
            metadata[label] = value

        result[slug] = metadata

    return result


def main():
    if len(sys.argv) != 4:
        print("Uso: python3 merge_metadata.py canti.json grezzi.txt canti_aggiornato.json")
        sys.exit(1)

    canti_path, grezzi_path, out_path = sys.argv[1:4]

    with open(canti_path, encoding="utf-8") as f:
        db = json.load(f)

    grezzi = parse_grezzi(grezzi_path)

    matched = 0
    unmatched_grezzi = set(grezzi.keys())

    for canto in db["canti"]:
        # slug ricavato dal fileName ("accogli-signore-i-nostri-doni.html" -> "accogli-signore-i-nostri-doni")
        file_name = canto.get("fileName", "")
        slug = file_name[:-5] if file_name.endswith(".html") else file_name

        if slug in grezzi:
            canto["metadata"] = grezzi[slug]
            matched += 1
            unmatched_grezzi.discard(slug)
        else:
            print(f"[!] Nessun metadato grezzo trovato per il canto '{canto.get('titolo')}' (slug: {slug})", file=sys.stderr)

    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(db, f, ensure_ascii=False, indent=2)

    print(f"\nFatto. Canti aggiornati: {matched}/{len(db['canti'])}")
    if unmatched_grezzi:
        print(f"Snippet grezzi non abbinati a nessun canto ({len(unmatched_grezzi)}): {', '.join(sorted(unmatched_grezzi))}", file=sys.stderr)


if __name__ == "__main__":
    main()