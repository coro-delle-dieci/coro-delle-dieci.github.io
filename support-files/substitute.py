import os
import argparse

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))

# Stringa da cercare e nuova stringa con cui sostituirla
stringa_da_sostituire = 'Privacy e note legali'
nuova_stringa = 'Privacy'


def chiedi_cartella():
    """Chiede la cartella all'utente, con SCRIPT_DIR come default se si preme Invio."""
    risposta = input(f"Cartella su cui lavorare [{SCRIPT_DIR}]: ").strip()
    return risposta if risposta else SCRIPT_DIR


def main():
    parser = argparse.ArgumentParser(description="Sostituisce una stringa in tutti i file .html di una cartella.")
    parser.add_argument(
        "cartella",
        nargs="?",
        default=None,
        help="Percorso della cartella da elaborare (relativo o assoluto). Se omesso, viene chiesto a runtime.",
    )
    args = parser.parse_args()

    cartella = args.cartella if args.cartella else chiedi_cartella()
    CANTI_DIR = os.path.abspath(cartella)

    if not os.path.isdir(CANTI_DIR):
        print(f"Errore: cartella '{CANTI_DIR}' non trovata.")
        return

    html_files = [f for f in os.listdir(CANTI_DIR) if f.endswith(".html")]

    if not html_files:
        print(f"Nessun file .html trovato in '{CANTI_DIR}'.")
        return

    print(f"Trovati {len(html_files)} file in '{CANTI_DIR}':\n")
    
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