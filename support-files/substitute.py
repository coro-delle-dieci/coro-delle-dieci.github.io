import os

# Percorso della cartella
directory = r"C:/Users/ficot/Desktop/coro-delle-dieci.github.io/system/docs"

# Stringa da cercare e nuova stringa con cui sostituirla
stringa_da_sostituire = '''<footer>
        <p>&copy; <span id="anno"></span> Coro delle Dieci - Parrocchia S. Vito e C.M. - Spinea (VE)</p>
        
        <p class="disclamer">I testi e gli spartiti dei canti sono proprietà dei rispettivi autori ed editori. 
        Sono riportati solo a fini liturgici e pastorali, senza scopo di lucro.
    </footer>'''
nuova_stringa = '''<footer>
        <p>&copy; <span id="anno"></span> Coro delle Dieci - <a class="privacy" href="privacy.html">Privacy e note legali</a></p>
    </footer>'''

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