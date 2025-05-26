import os

# Cartella da analizzare
directory = r"C:/Users/Scuola/Desktop/github/coro-delle-dieci.github.io/canti"

# Ciclo attraverso tutti i file nella cartella
for filename in os.listdir(directory):
    file_path = os.path.join(directory, filename)

    # Controlla che sia un file e abbia estensione .html o .htm (facoltativo)
    if os.path.isfile(file_path) and filename.endswith(('.html', '.htm')):
        with open(file_path, 'r', encoding='utf-8') as file:
            content = file.read()

        # Rimuove tutte le occorrenze di class="item"
        modified_content = content.replace('<a  href', '<a href')

        # Sovrascrive il file con il contenuto modificato
        with open(file_path, 'w', encoding='utf-8') as file:
            file.write(modified_content)

        print(f"Modificato: {filename}")

print("Fatto.")
