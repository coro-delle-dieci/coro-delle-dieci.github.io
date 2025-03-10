import os
import re

# Pattern per trovare i link con .html
pattern = re.compile(r'(<li><a href="\.\./)(\w+)\.html(">)')

# Scansiona tutti i file HTML nella cartella corrente
for filename in os.listdir():
    if filename.endswith(".html"):
        with open(filename, "r", encoding="utf-8") as file:
            content = file.read()
        
        # Sostituisce i link .html con la versione senza .html
        new_content = pattern.sub(r'\1\2/\3', content)

        # Scrive le modifiche nel file
        with open(filename, "w", encoding="utf-8") as file:
            file.write(new_content)

print("✅ Sostituzione completata in tutti i file HTML!")