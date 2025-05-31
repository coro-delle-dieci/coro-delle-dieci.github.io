'''
import os
import re

pattern = re.compile(r'(<li><a href="\.\./)(\w+)\.html(">)')

for filename in os.listdir():
    if filename.endswith(".html"):
        with open(filename, "r", encoding="utf-8") as file:
            content = file.read()
        
        new_content = pattern.sub(r'\1\2/\3', content)

        with open(filename, "w", encoding="utf-8") as file:
            file.write(new_content)

print("✅ Sostituzione completata in tutti i file HTML!")
'''

import os

# Percorso alla cartella contenente i file
directory = r"C:/Users/Scuola/Desktop/github/coro-delle-dieci.github.io/canti"

# Riga da rimuovere (attenzione agli spazi!)
riga_da_rimuovere = '<li><a href="../errore.html">Accedi</a></li>'

# Itera su tutti i file nella cartella
for filename in os.listdir(directory):
    file_path = os.path.join(directory, filename)

    # Controlla che sia un file (non una sottocartella)
    if os.path.isfile(file_path):
        with open(file_path, "r", encoding="utf-8") as file:
            lines = file.readlines()

        # Rimuove le righe che corrispondono esattamente a quella da eliminare (ignorando spazi iniziali/finali)
        new_lines = [line for line in lines if riga_da_rimuovere.strip() not in line.strip()]

        # Sovrascrive il file solo se è stato modificato
        if len(lines) != len(new_lines):
            with open(file_path, "w", encoding="utf-8") as file:
                file.writelines(new_lines)
            print(f"Modificato: {filename}")
        else:
            print(f"Nessuna modifica: {filename}")
