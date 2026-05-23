import os
import re

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
CANTI_DIR = os.path.join(SCRIPT_DIR, "..", "canti")


def update_file(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # Pattern per trovare la sezione download
    # Cattura il path del PDF per riusarlo
    pattern = r'(<section>\s*<div class="download">\s*<a href="([^"]+)" target="_blank" class="download-link">\s*)<img class="ico" height="32px" width="32px" height="32px" width="32px" alt="canto\.pdf" title="canto\.pdf" src="\.\./images/text-file\.png">(\s*<span>Scarica il testo in PDF</span>\s*</a>\s*</div>\s*</section>)'
    
    replacement = r'\1<img class="ico" height="32px" width="32px" height="32px" width="32px" alt="canto.pdf"\n                            title="canto.pdf" src="../images/text-file.png">\3'
    
    new_content = re.sub(pattern, replacement, content, flags=re.DOTALL)

    if new_content == content:
        print(f"  [SKIP] Nessuna modifica necessaria: {os.path.basename(filepath)}")
        return

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(new_content)

    print(f"  [OK]   {os.path.basename(filepath)}")


def main():
    if not os.path.isdir(CANTI_DIR):
        print(f"Errore: cartella '{CANTI_DIR}' non trovata.")
        print("Esegui lo script da support-files/ (o verifica la struttura delle cartelle).")
        return

    html_files = [f for f in os.listdir(CANTI_DIR) if f.endswith(".html")]

    if not html_files:
        print(f"Nessun file .html trovato in '{CANTI_DIR}'.")
        return

    print(f"Trovati {len(html_files)} file in 'canti/':\n")
    
    for filename in sorted(html_files):
        update_file(os.path.join(CANTI_DIR, filename))

    print(f"\nFatto.")


if __name__ == "__main__":
    main()