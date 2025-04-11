def create_song_html(title, song_text):
    sections = song_text.split('\n\n')
    
    html_content = []
    chorus_text = None
    
    for section in sections:
        if section.strip() == "Rit.":
            if chorus_text:
                html_content.append(
                    '\t\t<p class="chorus">\n' +
                    '\n'.join(f'\t\t\t{line}<br>' for line in chorus_text.split('\n')) +
                    '\n\t\t</p>'
                )
        elif section.startswith('Rit.: '):
            chorus_text = section[6:].strip()
            html_content.append(
                '\t\t<p class="chorus">\n' +
                '\n'.join(f'\t\t\t{line}<br>' for line in chorus_text.split('\n')) +
                '\n\t\t</p>'
            )
        else:
            if section.strip().endswith(" Rit."):
                section = section[:-5].strip()
                html_content.append(
                    '\t\t\t<p class="verse">\n' +
                    '\n'.join(f'\t\t\t\t{line}<br>' for line in section.split('\n')) +
                    '\n\t\t\t</p>'
                )
                if chorus_text:
                    html_content.append(
                        '\t\t\t<p class="chorus">\n' +
                        '\n'.join(f'\t\t\t\t{line}<br>' for line in chorus_text.split('\n')) +
                        '\n\t\t\t</p>'
                    )
            else:
                html_content.append(
                    '\t\t\t<p class="verse">\n' +
                    '\n'.join(f'\t\t\t\t{line}<br>' for line in section.split('\n')) +
                    '\n\t\t\t</p>'
                )
    
    html_body = '\n'.join(html_content)
    
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
                <li><a href="../errore.html">Accedi</a></li>
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
    
    filename = title.lower().replace(" ", "-").replace("'", "-").replace("è", "e").replace("ò", "o").replace("à", "a").replace("(", "").replace(")", "").replace("È", "e").replace("ì", "i").replace(",", "") + ".html"
    
    with open(filename, 'w', encoding='utf-8') as file:
        file.write(html_template)

def main():
    title = input("Inserisci il titolo della canzone: ")
    print("Inserisci il testo della canzone (termina con una riga vuota e Ctrl+D su Unix/Linux/Mac o Ctrl+Z su Windows):")
    
    song_text = []
    try:
        while True:
            line = input()
            song_text.append(line)
    except EOFError:
        pass
    
    song_text = '\n'.join(song_text)
    
    create_song_html(title, song_text)
    print(f"File HTML '{title.lower().replace(' ', '-')}.html' creato con successo!")

if __name__ == "__main__":
    main()