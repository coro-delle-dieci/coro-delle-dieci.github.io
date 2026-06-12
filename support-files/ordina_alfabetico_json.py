import json
import unicodedata

def chiave_ordinamento(canto):
    # Normalizza: rimuove gli accenti solo per il confronto, senza toccare i dati
    titolo = canto["titolo"].lower()
    return unicodedata.normalize("NFD", titolo).encode("ascii", "ignore").decode("ascii")

# Apri il file
with open("canti.json", "r", encoding="utf-8") as f:
    data = json.load(f)

# Ordina alfabeticamente e aggiorna gli ID dei canti normali
data["canti"] = sorted(data.get("canti", []), key=chiave_ordinamento)
for i, canto in enumerate(data["canti"], start=1):
    canto["id"] = i

# Ordina alfabeticamente e aggiorna gli ID dei canoni Taizé
data["taize"] = sorted(data.get("taize", []), key=chiave_ordinamento)
for i, canto in enumerate(data["taize"], start=1):
    canto["id"] = i

# Scrivi tutto di nuovo, formattato in JSON leggibile
with open("canti.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"✅ canti.json aggiornato: {len(data['canti'])} canti e {len(data['taize'])} Taizé ordinati alfabeticamente e ID aggiornati")