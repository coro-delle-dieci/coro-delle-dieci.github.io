def create_song_html(title, song_text):
    # Dividi il testo in strofe e ritornelli
    sections = song_text.split('\n\n')
    
    html_content = []
    chorus_text = None  # Memorizza il testo del ritornello
    
    for section in sections:
        if section.strip() == "Rit.":
            # Se la sezione è solo "Rit.", aggiungi il ritornello memorizzato
            if chorus_text:
                html_content.append(
                    '\t\t<p class="chorus">\n' +
                    '\n'.join(f'\t\t\t{line}<br>' for line in chorus_text.split('\n')) +
                    '\n\t\t</p>'
                )
        elif section.startswith('Rit.: '):
            # Se è un ritornello, memorizza il testo per usarlo successivamente
            chorus_text = section[6:].strip()  # Rimuovi "Rit.: " e spazi extra
            html_content.append(
                '\t\t<p class="chorus">\n' +
                '\n'.join(f'\t\t\t{line}<br>' for line in chorus_text.split('\n')) +
                '\n\t\t</p>'
            )
        else:
            # Se è una strofa, verifica se termina con "Rit."
            if section.strip().endswith(" Rit."):
                # Rimuovi " Rit." dalla fine della strofa
                section = section[:-5].strip()
                html_content.append(
                    '\t\t\t<p class="verse">\n' +
                    '\n'.join(f'\t\t\t\t{line}<br>' for line in section.split('\n')) +
                    '\n\t\t\t</p>'
                )
                # Aggiungi il ritornello memorizzato, se esiste
                if chorus_text:
                    html_content.append(
                        '\t\t\t<p class="chorus">\n' +
                        '\n'.join(f'\t\t\t\t{line}<br>' for line in chorus_text.split('\n')) +
                        '\n\t\t\t</p>'
                    )
            else:
                # Altrimenti, è una strofa normale
                html_content.append(
                    '\t\t\t<p class="verse">\n' +
                    '\n'.join(f'\t\t\t\t{line}<br>' for line in section.split('\n')) +
                    '\n\t\t\t</p>'
                )
    
    # Unisci tutto il contenuto HTML
    html_body = '\n'.join(html_content)
    
    # Costruisci il file HTML completo
    html_template = f'''<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title}</title>
    <link rel="stylesheet" href="../style.css">
</head>
<body>
    <header>
        <h1 id="page-title">Coro delle Dieci</h1>
        <nav>
            <ul>
                <li><a href="../index.html">Home</a></li>
                <li><a href="../canti.html">Canti</a></li>
                <li><a href="../calendario.html">Calendario</a></li>
            </ul>
        </nav>
    </header>
    <main class="container">
        <section data-tags="">
            <h2>{title}</h2>
{html_body}
        </section>
    </main>

    <footer>
        <p>&copy; 2025 Coro delle Dieci - Parrocchia S. Vito e C.M. - Spinea (VE)</p>
    </footer>
</body>
</html>'''
    
    # Genera il nome del file
    filename = title.lower().replace(" ", "-").replace("'", "-").replace("è", "e").replace("ò", "o").replace("à", "a").replace("(", "").replace(")", "").replace("È", "e").replace("ì", "i").replace(",", "") + ".html"
    
    # Scrivi il file HTML
    with open(filename, 'w', encoding='utf-8') as file:
        file.write(html_template)

def main():
    # Input dell'utente
    title = input("Inserisci il titolo della canzone: ")
    print("Inserisci il testo della canzone (termina con una riga vuota e Ctrl+D su Unix/Linux/Mac o Ctrl+Z su Windows):")
    
    # Leggi il testo della canzone
    song_text = []
    try:
        while True:
            line = input()
            song_text.append(line)
    except EOFError:
        pass
    
    # Unisci le righe in un'unica stringa
    song_text = '\n'.join(song_text)
    
    # Crea il file HTML
    create_song_html(title, song_text)
    print(f"File HTML '{title.lower().replace(' ', '-')}.html' creato con successo!")

if __name__ == "__main__":
    main()