import os

def create_song_html(title, song_text, link=None, n1=None, n2=None):
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
                        '\t\t\t\t<p class="chorus">\n' +
                        '\n'.join(f'\t\t\t\t{line}<br>' for line in chorus_text.split('\n')) +
                        '\n\t\t\t\t</p>'
                    )
            else:
                html_content.append(
                    '\t\t\t<p class="verse">\n' +
                    '\n'.join(f'\t\t\t\t{line}<br>' for line in section.split('\n')) +
                    '\n\t\t\t</p>'
                )
    
    html_body = '\n'.join(html_content)

    # Sezioni aggiuntive (video e numeri nei libretti)
    extra_sections = ''
    
    if link:
        extra_sections += f'''
        <section class="video-container">
            <iframe width="560" height="315" src="{link}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
        </section>
        '''
    if n1 or n2:
        extra_sections += '''
        <section>
            Puoi trovare questo canto al numero:<br>
        '''
        if n1:
            extra_sections += f'    <b>{n1}</b> nel quaderno ad anelli (libretto della Minicorale)<br>\n'
        if n2:
            extra_sections += f'            <b>{n2}</b> nel libro dei canti dell\'assemblea<br>\n'
        extra_sections += '        </section>'
    
    html_template = f'''<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title}</title>
    <link rel="stylesheet" href="../style/style.css">
</head>
<body>
    <header>
        <h1>Coro delle Dieci</h1>
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
        </section>{extra_sections}
    </main>

    <footer>
        <p>&copy; 2025 Coro delle Dieci - Parrocchia S. Vito e C.M. - Spinea (VE)</p>
    </footer>
</body>
</html>'''

    # Path di destinazione fisso
    save_dir = "C:/Users/Scuola/Desktop/github/coro-delle-dieci.github.io/canti"
    filename = title.lower().replace(" ", "-").replace("'", "-").replace("è", "e").replace("ò", "o").replace("à", "a").replace("(", "").replace(")", "").replace("È", "e").replace("ì", "i").replace(",", "") + ".html"
    full_path = os.path.join(save_dir, filename)

    with open(full_path, 'w', encoding='utf-8') as file:
        file.write(html_template)

    print(f"✅ File HTML creato con successo: {full_path}")


def main():
    title = input("Inserisci il titolo della canzone: ").strip()

    print("\nInserisci il testo della canzone (termina con una riga vuota e Ctrl+D su Unix/Linux/Mac o Ctrl+Z su Windows):")
    song_text = []
    try:
        while True:
            line = input()
            song_text.append(line)
    except EOFError:
        pass
    song_text = '\n'.join(song_text)

    print("\n--- Sezioni Aggiuntive (opzionali) ---")
    link = input("Link al video YouTube (lascia vuoto se non presente): ").strip()
    if link:
        link = link.replace("https://youtu.be/", "https://www.youtube.com/embed/")
    
    n1 = input("Numero nel libretto della Minicorale (opzionale): ").strip()
    n2 = input("Numero nel libro dell'assemblea (opzionale): ").strip()
    
    create_song_html(title, song_text, link if link else None, n1 if n1 else None, n2 if n2 else None)

if __name__ == "__main__":
    main()