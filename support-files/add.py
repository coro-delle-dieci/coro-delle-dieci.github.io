import os
import re

# Percorso della cartella
directory = r"C:/Users/ficot/Desktop/coro-delle-dieci.github.io/"

# Stringa da cercare e nuova stringa con cui sostituirla
elementi_da_aggiungere = '''<input type="checkbox" id="menu-toggle" class="menu-toggle">
        <label for="menu-toggle" class="menu-icon">
            <span></span>
            <span></span>
            <span></span>
        </label>
        <div class="overlay"></div>'''

sopra_cosa = '''<nav>'''

pattern = r'(\s*' + re.escape(sopra_cosa) + r')'
# Scorre tutti i file nella directory
for filename in os.listdir(directory):
    file_path = os.path.join(directory, filename)
    
    # Controlla se è un file HTML
    if os.path.isfile(file_path) and filename.endswith('.html'):
        with open(file_path, "r", encoding="utf-8") as file:
            contenuto = file.read()

        # Cerca il posto e aggiunge gli elementi prima di esso
        nuovo_contenuto = re.sub(pattern, elementi_da_aggiungere + r'\1', contenuto)

        if contenuto != nuovo_contenuto:
            with open(file_path, "w", encoding="utf-8") as file:
                file.write(nuovo_contenuto)
            print(f"Modificato: {filename}")
        else:
            print(f"Nessuna modifica: {filename}")