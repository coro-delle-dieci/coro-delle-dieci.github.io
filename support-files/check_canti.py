import json
import os

# Percorsi
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
JSON_PATH = os.path.join(BASE_DIR, "canti.json")
CANTI_DIR = os.path.join(BASE_DIR, "canti")

# Carica il JSON
with open(JSON_PATH, "r", encoding="utf-8") as f:
    data = json.load(f)

# File dichiarati nel JSON (solo canti normali, ignora Taizé)
json_files = {
    canto["fileName"]
    for canto in data.get("canti", [])
    if "fileName" in canto
}

# File realmente presenti nella cartella /canti
folder_files = {
    f for f in os.listdir(CANTI_DIR)
    if os.path.isfile(os.path.join(CANTI_DIR, f))
}

# Confronti
missing_files = json_files - folder_files
extra_files = folder_files - json_files

print("=== RISULTATO CONTROLLO CANTI ===\n")

if missing_files:
    print("❌ File presenti nel JSON ma NON nella cartella /canti:")
    for f in sorted(missing_files):
        print(" -", f)
else:
    print("✅ Nessun file mancante nella cartella /canti")

print()

if extra_files:
    print("⚠️ File presenti nella cartella /canti ma NON nel JSON:")
    for f in sorted(extra_files):
        print(" -", f)
else:
    print("✅ Nessun file extra nella cartella /canti")