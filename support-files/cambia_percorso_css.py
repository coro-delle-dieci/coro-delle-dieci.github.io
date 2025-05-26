import os

# Percorso della cartella contenente i file HTML
cartella = 'C:/Users/Scuola/Desktop/github/coro-delle-dieci.github.io/canti'

# Scorri tutti i file nella cartella
for nome_file in os.listdir(cartella):
    if nome_file.endswith('.html'):
        percorso_file = os.path.join(cartella, nome_file)

        with open(percorso_file, 'r', encoding='utf-8') as file:
            contenuto = file.read()

        # Sostituzione del collegamento a style.css
        contenuto_modificato = contenuto.replace(
            "../style.css", "../style/style.css"
        )

        # Aggiunta di canti.css solo se non già presente
        link_canti_css = '<link rel="stylesheet" href="../style/canti.css">'
        if link_canti_css not in contenuto_modificato:
            # Inserisce il nuovo link subito dopo il primo tag <link ...>
            index = contenuto_modificato.find('<link')
            if index != -1:
                fine_link = contenuto_modificato.find('>', index) + 1
                contenuto_modificato = (
                    contenuto_modificato[:fine_link]
                    + '\n    ' + link_canti_css
                    + contenuto_modificato[fine_link:]
                )

        # Sovrascrive il file con il contenuto aggiornato
        with open(percorso_file, 'w', encoding='utf-8') as file:
            file.write(contenuto_modificato)

print("Modifica completata.")