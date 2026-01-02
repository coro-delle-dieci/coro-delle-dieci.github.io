import os
import json
import re

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
            class_name = "verse"
            content = section
            
            # Controllo per i prefissi
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
                        '\t\t\t<p class="chorus">\n' +
                        '\n'.join(f'\t\t\t\t{line}<br>' for line in chorus_text.split('\n')) +
                        '\n\t\t\t</p>'
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
            extra_sections += f'        <b>{n1}</b> nel quaderno ad anelli (libretto della Minicorale)<br>\n'
        if n2:
            extra_sections += f'        <b>{n2}</b> nel libro dei canti dell\'assemblea<br>\n'
        extra_sections += '            </section>'
    
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
        <h1><a href="../">Coro delle Dieci</a></h1>
        
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
        <section class="song" data-tags="">
            <h2>{title}</h2>
{html_body}
        </section>
        
        <section class="details">{extra_sections}

            <section>
                <div class="download">
                    <a href="../pdf-testi/{filename}.pdf" download target="_blank" class="download-link">
                        <img class="ico" alt="canto.pdf" title="canto.pdf" src="../images/text-file.png">
                        <span>Scarica il testo in PDF</span>
                    </a>
                </div>
            </section>
        </section>
    </main>

    <footer>
        <p>&copy; 2025 Coro delle Dieci - <a class="privacy" href="../privacy">Privacy e note legali</a></p>
    </footer>

    <button id="autoScrollBtn" class="auto-scroll-btn">
        <span class="scroll-speed">OFF</span>
        <span class="scroll-icon">▼</span>
    </button>
    
    <script src="../script/get-zoom.js" defer></script>
    <script src="../script/auto-scroll.js" defer></script>
    <!--<script src="../script/contatore-visite.js"></script>-->
</body>
</html>'''

    # Path di destinazione fisso
    save_dir = "C:/Users/ficot/Desktop/coro-delle-dieci.github.io/canti"
    filename_html = filename + ".html"
    full_path = os.path.join(save_dir, filename_html)

    with open(full_path, 'w', encoding='utf-8') as file:
        file.write(html_template)

    print(f"✅ File HTML creato con successo: {full_path}")
    
    return filename, filename_html


def add_song_to_html_list(title, filename):
    """Aggiunge il canto alla lista in canti.html in ordine alfabetico"""
    html_file_path = "C:/Users/ficot/Desktop/coro-delle-dieci.github.io/canti.html"
    
    with open(html_file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Trova la lettera iniziale del titolo
    first_letter = title[0].upper()
    
    # Se la lettera non è A-Z, usa 'A' come default
    if not first_letter.isalpha():
        first_letter = 'A'
    
    # Trova il gruppo della lettera corrispondente
    letter_group_pattern = f'<div class="lettera-gruppo" id="{first_letter}">(.*?)</div>'
    match = re.search(letter_group_pattern, content, re.DOTALL)
    
    if not match:
        print(f"❌ Gruppo lettera '{first_letter}' non trovato in canti.html")
        return False
    
    letter_group = match.group(0)
    canto_links_section = match.group(1)
    
    # Crea il nuovo link
    new_link = f'<a href="canti/{filename}">{title}</a><br>'
    
    # Trova la sezione canto-link specifica
    canto_link_pattern = r'<div class="canto-link">(.*?)</div>'
    canto_link_match = re.search(canto_link_pattern, letter_group, re.DOTALL)
    
    if not canto_link_match:
        print("❌ Sezione canto-link non trovata")
        return False
    
    old_canto_link_content = canto_link_match.group(1)
    
    # Trova tutti i link esistenti con i loro href originali
    links_pattern = r'<a href="(canti/[^"]*)">([^<]*)</a><br>'
    existing_links = re.findall(links_pattern, old_canto_link_content)
    
    # Aggiungi il nuovo link alla lista
    existing_links.append((f"canti/{filename}", title))
    
    # Ordina per titolo (ignorando case)
    existing_links.sort(key=lambda x: x[1].lower())
    
    # Ricostruisci la sezione dei link mantenendo gli href originali
    new_links_content = '\n                        '.join([f'<a href="{href}">{text}</a><br>' for href, text in existing_links])
    
    # Sostituisci solo la sezione canto-link
    new_canto_link = f'<div class="canto-link">\n                        {new_links_content}\n                    </div>'
    new_letter_group = letter_group.replace(canto_link_match.group(0), new_canto_link)
    
    # Sostituisci nel contenuto totale
    new_content = content.replace(letter_group, new_letter_group)
    
    # Scrivi il file aggiornato
    with open(html_file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"✅ Canto aggiunto a canti.html nel gruppo '{first_letter}'")
    return True


def get_filename_for_title(title, all_titles, current_filename):
    """Restituisce il filename corretto per un titolo"""
    if title == all_titles[-1]:  # Se è l'ultimo titolo (quello appena aggiunto)
        return current_filename.replace('.html', '')
    
    # Per gli altri titoli, mantieni il filename esistente
    # Questa è una semplificazione - in un'implementazione completa dovresti avere una mappa titolo->filename
    return title.lower().replace(" ", "-").replace("'", "-").replace("è", "e").replace("ò", "o").replace("à", "a").replace("(", "").replace(")", "").replace("È", "e").replace("ì", "i").replace(",", "")


def add_song_to_json(title, filename, song_text):
    """Aggiunge il canto al file canti.json nella posizione alfabetica corretta"""
    json_file_path = "C:/Users/ficot/Desktop/coro-delle-dieci.github.io/canti.json"
    
    # Leggi tutto il file come testo per mantenere la formattazione
    with open(json_file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Carica anche come JSON per trovare la posizione corretta
    with open(json_file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Trova la posizione corretta per inserire il nuovo canto
    insert_index = 0
    for i, canto in enumerate(data["canti"]):
        if title.lower() < canto["titolo"].lower():
            insert_index = i
            break
        insert_index = i + 1  # Se è più grande di tutti, inserisci alla fine
    
    # Crea la stringa del nuovo canto con la stessa formattazione
    new_canto_string = f'''    {{   "titolo": "{title}",
        "id": {len(data["canti"]) + 1},
        "testo": {json.dumps(song_text.replace('\n', ' ').strip(), ensure_ascii=False)},
        "categorie": [],
        "url": "canti/{filename.replace('.html', '')}",
        "fileName": "{filename}"
    }}'''
    
    # Se inseriamo alla fine, gestiamo diversamente
    if insert_index == len(data["canti"]):
        # Trova l'ultimo canto e aggiungi una virgola
        last_canto_end = content.rfind('    }')
        if last_canto_end != -1:
            # Aggiungi virgola all'ultimo canto
            content = content[:last_canto_end + 5] + ',' + content[last_canto_end + 5:]
            # Inserisci il nuovo canto prima della chiusura dell'array
            closing_bracket_pos = content.rfind('  ]')
            new_content = content[:closing_bracket_pos] + '\n' + new_canto_string + '\n' + content[closing_bracket_pos:]
        else:
            print("❌ Impossibile trovare l'ultimo canto")
            return False
    else:
        # Trova il canto dopo cui inserire
        target_canto = data["canti"][insert_index]
        target_pattern = f'''    {{   "titolo": "{target_canto["titolo"]}",
        "id": {target_canto["id"]},
        "testo": {json.dumps(target_canto["testo"], ensure_ascii=False)},
        "categorie": {json.dumps(target_canto["categorie"], ensure_ascii=False)},
        "url": "{target_canto["url"]}",
        "fileName": "{target_canto["fileName"]}"
    }}'''
        
        # Aggiungi virgola al nuovo canto (poiché non è l'ultimo)
        new_canto_string += ','
        
        # Inserisci prima del canto target
        new_content = content.replace(target_pattern, new_canto_string + '\n' + target_pattern)
    
    # Scrivi il file con il nuovo canto
    with open(json_file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"✅ Canto aggiunto a canti.json nella posizione {insert_index + 1}")
    
    # Ora aggiorna solo gli ID (senza riordinare)
    update_json_ids()

def update_json_ids():
    """Aggiorna gli ID nel file JSON mantenendo la formattazione"""
    json_file_path = "C:/Users/ficot/Desktop/coro-delle-dieci.github.io/canti.json"
    
    with open(json_file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Aggiorna gli ID
    for i, canto in enumerate(data["canti"], start=1):
        canto["id"] = i
    
    # Ricostruisci il contenuto con la formattazione originale
    output_lines = []
    output_lines.append('{')
    output_lines.append('  "canti": [')
    
    for i, canto in enumerate(data["canti"]):
        canto_line = f'''    {{   "titolo": "{canto["titolo"]}",
        "id": {canto["id"]},
        "testo": {json.dumps(canto["testo"], ensure_ascii=False)},
        "categorie": {json.dumps(canto["categorie"], ensure_ascii=False)},
        "url": "{canto["url"]}",
        "fileName": "{canto["fileName"]}"
    }}{"," if i < len(data["canti"]) - 1 else ""}'''
        output_lines.append(canto_line)
    
    output_lines.append('  ]')
    output_lines.append('}')
    
    with open(json_file_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(output_lines))
    
    print("✅ ID aggiornati in canti.json")


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
    
    filename, filename_html = create_song_html(title, song_text, link if link else None, n1 if n1 else None, n2 if n2 else None)
    
    # Aggiungi il canto alla lista HTML
    add_song_to_html_list(title, filename)
    
    # Aggiungi il canto al JSON
    add_song_to_json(title, filename_html, song_text)


if __name__ == "__main__":
    main()