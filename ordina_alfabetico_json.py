import json
import locale

# Usa l'ordinamento italiano (case-insensitive, ignora accenti)
locale.setlocale(locale.LC_ALL, '')

def chiave_ordinamento(canto):
    return canto["titolo"].lower()

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
