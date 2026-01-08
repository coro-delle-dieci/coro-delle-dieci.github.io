import json

# Apri il file
with open("canti.json", "r", encoding="utf-8") as f:
    data = json.load(f)

# Aggiorna gli ID dei canti normali
for i, canto in enumerate(data.get("canti", []), start=1):
    canto["id"] = i

# Aggiorna gli ID dei canoni Taizé
for i, canto in enumerate(data.get("taize", []), start=1):
    canto["id"] = i

# Scrivi tutto di nuovo, formattato in JSON leggibile
with open("canti.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("✅ canti.json aggiornato: ID dei canti e dei Taizé aggiornati")