import os
import re

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
CANTI_DIR = os.path.join(SCRIPT_DIR, "..", "canti")

NEW_HEAD_TEMPLATE = """<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title}</title>

    <link rel="icon" href="../images/favicon.ico" sizes="any">
    <link rel="icon" type="image/png" sizes="32x32" href="../images/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="../images/favicon-16x16.png">
    <link rel="apple-touch-icon" href="../images/apple-touch-icon.png">
    <link rel="manifest" href="../images/site.webmanifest">

    <meta name="msapplication-TileColor" content="#061a40">
    <meta name="theme-color" content="#061a40">

    <link rel="stylesheet" href="../style/style.css">
    <link rel="stylesheet" href="../style/canti.css">

    <script src="https://cdn.counter.dev/script.js" data-id="0b8a28a7-bd9e-4970-aa87-bd107e273a32"
        data-utcoffset="1"></script>
</head>"""


def update_file(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # Estrai il titolo
    title_match = re.search(r"<title>(.*?)</title>", content, re.IGNORECASE | re.DOTALL)
    if not title_match:
        print(f"  [SKIP] Nessun <title> trovato in {filepath}")
        return

    title = title_match.group(1).strip()

    # Sostituisci l'intero blocco <head>...</head>
    new_head = NEW_HEAD_TEMPLATE.format(title=title)
    new_content = re.sub(
        r"<head>.*?</head>",
        new_head,
        content,
        count=1,
        flags=re.DOTALL | re.IGNORECASE,
    )

    if new_content == content:
        print(f"  [SKIP] Nessuna modifica necessaria: {filepath}")
        return

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(new_content)

    print(f"  [OK]   {filepath}  →  \"{title}\"")


def main():
    if not os.path.isdir(CANTI_DIR):
        print(f"Errore: cartella '{CANTI_DIR}' non trovata.")
        print("Esegui lo script dalla root del sito (la stessa cartella che contiene canti/).")
        return

    html_files = [f for f in os.listdir(CANTI_DIR) if f.endswith(".html")]

    if not html_files:
        print(f"Nessun file .html trovato in '{CANTI_DIR}'.")
        return

    print(f"Trovati {len(html_files)} file in '{CANTI_DIR}/':\n")
    for filename in sorted(html_files):
        update_file(os.path.join(CANTI_DIR, filename))

    print(f"\nFatto.")


if __name__ == "__main__":
    main()