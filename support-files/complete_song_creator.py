import os

def create_song_html(title, song_text, link=None, n1=None, n2=None):
    sections = song_text.split('\n\n')
    
    html_content = []
    chorus_text = None
    
    for section in sections:
        if section.strip() == "Rit.":
            if chorus_text:
                html_content.append(
                    '\t\t\t<p class="chorus">\n' +
                    '\n'.join(f'\t\t\t\t{line}<br>' for line in chorus_text.split('\n')) +
                    '\n\t\t\t</p>'
                )
        elif section.startswith('Rit.: '):
            chorus_text = section[6:].strip()
            html_content.append(
                '\t\t\t<p class="chorus">\n' +
                '\n'.join(f'\t\t\t\t{line}<br>' for line in chorus_text.split('\n')) +
                '\n\t\t\t</p>'
            )
        else:
            # Nuova logica per gestire intro/outro/bridge
            class_name = "verse"
            content = section
            
            # Controllo per i nuovi prefissi
            if section.startswith("Intro: "):
                class_name = "intro"
                content = section[7:].strip()
            elif section.startswith("Outro: "):
                class_name = "outro"
                content = section[7:].strip()
            elif section.startswith("Bridge: "):
                class_name = "bridge"
                content = section[8:].strip()
            
            if content.endswith(" Rit."):
                content = content[:-5].strip()
                html_content.append(
                    f'\t\t\t<p class="{class_name}">\n' +
                    '\n'.join(f'\t\t\t\t{line}<br>' for line in content.split('\n')) +
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
                    f'\t\t\t<p class="{class_name}">\n' +
                    '\n'.join(f'\t\t\t\t{line}<br>' for line in content.split('\n')) +
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
            extra_sections += f'    <b>{n2}</b> nel libro dei canti dell\'assemblea<br>\n'
        extra_sections += '        </section>'
    
    filename = title.lower().replace(" ", "-").replace("'", "-").replace("è", "e").replace("ò", "o").replace("à", "a").replace("(", "").replace(")", "").replace("È", "e").replace("ì", "i").replace(",", "")
    html_template = f'''<!DOCTYPE html>
<html lang="it">
<head>

    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title}</title>
    <link rel="stylesheet" href="../style/style.css">
    <link rel="stylesheet" href="../style/canti.css">
    <link rel="apple-touch-icon" sizes="180x180" href="../images/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="../images/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="../images/favicon-16x16.png">
    <link rel="manifest" href="../images/site.webmanifest">
    <link rel="mask-icon" href="../images/safari-pinned-tab.svg" color="#061a40">
    <meta name="msapplication-TileColor" content="#061a40">
    <meta name="theme-color" content="#061a40">
</head>
<body>
    <header>
        <h1>Coro delle Dieci</h1>
        <input type="checkbox" id="menu-toggle" class="menu-toggle">
        <label for="menu-toggle" class="menu-icon">
            <span></span>
            <span></span>
            <span></span>
        </label>
        <div class="overlay"></div>
        <nav>
            <ul>
                <li><a href="..">Home</a></li>
                <li><a href="../canti">Canti</a></li>
                <li><a href="../calendario">Calendario</a></li>
                <li><a href="../admin/aggiungi-canto">Area riservata</a></li>
            </ul>
        </nav>
    </header>
    <main>
        <section data-tags="">
            <h2>{title}</h2>
{html_body}
        </section>{extra_sections}

        <section>
            <div class="download">
                <a href="../pdf-testi/{filename}.pdf" download target="_blank" class="download-link">
                    <img class="ico" alt="canto.pdf" title="canto.pdf" src="../images/text-file.png">
                    <span>Scarica il testo in PDF</span>
                </a>
            </div>
        </section>
    </main>

    <footer>
        <p>&copy; <span id="anno"></span> Coro delle Dieci - <a class="privacy" href="privacy.html">Privacy e note legali</a></p>
    </footer>

    <script src="../script/anno.js"></script>
</body>
</html>'''

    # Path di destinazione fisso
    save_dir = "C:/Users/ficot/Desktop/coro-delle-dieci.github.io/canti"
    filename_html = filename + ".html"
    full_path = os.path.join(save_dir, filename_html)

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