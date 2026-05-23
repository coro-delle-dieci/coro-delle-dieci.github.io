import os
import re

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
CANTI_DIR = os.path.join(SCRIPT_DIR, "..", "canti")

NEW_HEADER = """<header>
        <h1><a href="../">Coro delle Dieci</a></h1>
        <input type="checkbox" id="menu-toggle" class="menu-toggle">
        <label for="menu-toggle" class="menu-icon">
            <span></span>
            <span></span>
            <span></span>
        </label>
        <div class="overlay"></div>
        <nav>
            <ul>
                <li><a href="..">Home</a></li>
                <li><a href="../canti">Canti</a></li>
                <li><a href="../calendario">Calendario</a></li>
                <li><a href="../admin/aggiungi-canto">Area riservata</a></li>
            </ul>
        </nav>
    </header>"""


def update_file(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # Sostituisci l'intero blocco <header>...</header>
    new_content = re.sub(
        r"<header>.*?</header>",
        NEW_HEADER,
        content,
        count=1,
        flags=re.DOTALL | re.IGNORECASE,
    )

    if new_content == content:
        print(f"  [SKIP] Nessuna modifica necessaria: {filepath}")
        return

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(new_content)

    print(f"  [OK]   {filepath}")


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