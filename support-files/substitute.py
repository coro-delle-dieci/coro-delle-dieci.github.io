import os

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
CANTI_DIR = os.path.join(SCRIPT_DIR, "..", "canti")

# Stringa da cercare e nuova stringa con cui sostituirla
stringa_da_sostituire = ' data-tags'
nuova_stringa = ''

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
    
    modificati = 0
    
    for filename in sorted(html_files):
        file_path = os.path.join(CANTI_DIR, filename)

        with open(file_path, "r", encoding="utf-8") as file:
            contenuto = file.read()

        nuovo_contenuto = contenuto.replace(stringa_da_sostituire, nuova_stringa)

        if contenuto != nuovo_contenuto:
            with open(file_path, "w", encoding="utf-8") as file:
                file.write(nuovo_contenuto)
            print(f"  [OK]   {filename}")
            modificati += 1
        else:
            print(f"  [SKIP] {filename}")

    print(f"\nFatto. {modificati} file modificati.")


if __name__ == "__main__":
    main()