import os

# Percorso della cartella
directory = r"C:/Users/ficot/Desktop/coro-delle-dieci.github.io/demo-palette4"

# Stringa da cercare e nuova stringa con cui sostituirla
stringa_da_sostituire = '''<li><a href="index/">Home</a></li>
                <li><a href="canti/">Canti</a></li>
                <li><a href="calendario/">Calendario</a></li>'''
nuova_stringa = '''<li><a href="index/">Home</a></li>
                <li><a href="canti/">Canti</a></li>
                <li><a href="calendario/">Calendario</a></li>
                <li><a href="../admin/aggiungi-canto/">Area riservata</a></li>'''

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