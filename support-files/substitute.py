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

'''
import os

directory = r"C:/Users/Scuola/Desktop/github/coro-delle-dieci.github.io/canti"

riga_da_rimuovere = '<li><a href="../errore.html">Accedi</a></li>'

for filename in os.listdir(directory):
    file_path = os.path.join(directory, filename)

    if os.path.isfile(file_path):
        with open(file_path, "r", encoding="utf-8") as file:
            lines = file.readlines()

        new_lines = [line for line in lines if riga_da_rimuovere.strip() not in line.strip()]

        if len(lines) != len(new_lines):
            with open(file_path, "w", encoding="utf-8") as file:
                file.writelines(new_lines)
            print(f"Modificato: {filename}")
        else:
            print(f"Nessuna modifica: {filename}")
'''


import os

# Percorso della cartella
directory = r"C:/Users/ficot/Desktop/coro-delle-dieci.github.io/canti"

# Stringa da cercare e nuova stringa con cui sostituirla
stringa_da_sostituire = '''<li><a href="../index.html">Home</a></li>
                <li><a href="../canti.html">Canti</a></li>
                <li><a href="../calendario.html">Calendario</a></li>'''
nuova_stringa = '''<li><a href="../index">Home</a></li>
                <li><a href="../canti">Canti</a></li>
                <li><a href="../calendario">Calendario</a></li>'''

# Scorre tutti i file nella directory
for filename in os.listdir(directory):
    file_path = os.path.join(directory, filename)

    if os.path.isfile(file_path):
        with open(file_path, "r", encoding="utf-8") as file:
            contenuto = file.read()

        nuovo_contenuto = contenuto.replace(stringa_da_sostituire, nuova_stringa)

        if contenuto != nuovo_contenuto:
            with open(file_path, "w", encoding="utf-8") as file:
                file.write(nuovo_contenuto)
            print(f"Modificato: {filename}")
        else:
            print(f"Nessuna modifica: {filename}")