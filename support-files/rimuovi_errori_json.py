import json

with open(r"./canti.json", "r", encoding="utf-8") as f:
    data = json.load(f)

nuovi_canti = []

for canto in data["canti"]:
    # inverti i campi
    nuovo = {
        "titolo": canto["titolo"],
        "id": canto["id"],
        "testo": canto["testo"],
        "categorie": canto["categorie"],
        "url": canto["url"],
        "fileName": canto["fileName"]
    }
    nuovi_canti.append(nuovo)

# Generazione del testo con "titolo" sulla stessa riga della {
righe = []
for c in nuovi_canti:
    blocco = (
        '{ "titolo": ' + json.dumps(c["titolo"], ensure_ascii=False) + ',\n'
        f'  "id": {c["id"]},\n'
        f'  "testo": {json.dumps(c["testo"], ensure_ascii=False)},\n'
        f'  "categorie": {json.dumps(c["categorie"], ensure_ascii=False)},\n'
        f'  "url": {json.dumps(c["url"], ensure_ascii=False)},\n'
        f'  "fileName": {json.dumps(c["fileName"], ensure_ascii=False)}\n'
        '},'
    )
    righe.append(blocco)

# Salva il risultato
with open("canti_invertiti.json", "w", encoding="utf-8") as f:
    f.write('[\n' + "\n".join(righe) + '\n]')
