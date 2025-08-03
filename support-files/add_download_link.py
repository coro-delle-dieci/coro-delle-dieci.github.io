import os
import re

# Percorso della cartella contenente i file HTML
folder_path = os.path.join(os.path.dirname(__file__), '../canti')

# Template del codice da inserire (con placeholder {pagina})
insert_code = """
        <section>
            <div class="download">
                <a href="../canti-pdf/{pagina}.pdf" download target="_blank" class="download-link">
                    <img class="ico" alt="canto.pdf" title="canto.pdf" src="../images/iconapdf.png">
                    <span>Scarica il canto in PDF</span>
                </a>
            </div>
        </section>
"""

# Itera tutti i file nella cartella
for filename in os.listdir(folder_path):
    if filename.endswith('.html'):
        file_path = os.path.join(folder_path, filename)
        
        with open(file_path, 'r', encoding='utf-8') as file:
            content = file.read()

        # Genera il codice specifico per questa pagina
        page_name = os.path.splitext(filename)[0]
        specific_code = insert_code.replace('{pagina}', page_name)
        
        # Effettua la sostituzione usando espressioni regolari
        new_content = re.sub(
            r'(?=</main>)', 
            specific_code, 
            content,
            flags=re.IGNORECASE
        )
        
        # Scrivi il nuovo contenuto solo se è stato effettuato un cambiamento
        if new_content != content:
            with open(file_path, 'w', encoding='utf-8') as file:
                file.write(new_content)
            print(f'Aggiornato: {filename}')
        else:
            print(f'Nessun tag </main> trovato in: {filename}')

print("Operazione completata!")