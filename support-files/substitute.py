import os

# Percorso della cartella
directory = r"C:/Users/ficot/Desktop/coro-delle-dieci.github.io/system/docs"

# Stringa da cercare e nuova stringa con cui sostituirla
stringa_da_sostituire = '''    <script src="https://cdn.counter.dev/script.js" data-id="0b8a28a7-bd9e-4970-aa87-bd107e273a32" data-utcoffset="1"></script>
'''
nuova_stringa = ''''''

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