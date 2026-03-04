import os
import json
import re

# --- Funzioni di base per creare HTML del canto ---
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

    # Sezioni extra
    extra_sections = ''
    if link:
        extra_sections += f'''
            <section class="video-container">
                <iframe width="560" height="315" src="{link}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
            </section>
        '''
    if n1 or n2:
        extra_sections += '''
            <section>Puoi trovare questo canto al numero:<br>'''
        if n1:
            extra_sections += f'        <b>{n1}</b> nel quaderno ad anelli (libretto della Minicorale)<br>\n'
        if n2:
            extra_sections += f'        <b>{n2}</b> nel libro dei canti dell\'assemblea<br>\n'
        extra_sections += '</section>'

    # Creazione filename
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

        <section class="details">
        
            {extra_sections}

            <section>
                <div class="download">
                    <a href="../pdf-testi/{filename}.pdf" target="_blank" class="download-link">
                        <img class="ico" height="32px" width="32px" alt="canto.pdf" title="canto.pdf" src="../images/text-file.png">
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
</body>
</html>'''

    # Salva il file
    save_dir = r"./canti"
    full_path = os.path.join(save_dir, f"{filename}.html")
    with open(full_path, 'w', encoding='utf-8') as file:
        file.write(html_template)
    print(f"✅ File HTML creato: {full_path}")
    return filename, f"{filename}.html"


def add_song_to_html_list(title, filename):
    """Aggiunge il canto alla lista in canti.html in ordine alfabetico"""
    html_file_path = "./canti.html"
    
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

# --- Aggiornamento JSON con canti e Taizé ---
def update_json_ids(data):
    for i, canto in enumerate(data.get("canti", []), start=1):
        canto["id"] = i
    for i, canto in enumerate(data.get("taize", []), start=1):
        canto["id"] = i
    return data

def add_song_to_json(title, filename_html, song_text):
    json_file_path = r"./canti.json"
    
    with open(json_file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    new_canto = {
        "titolo": title,
        "id": len(data["canti"]) + 1,  # temporaneo, verrà aggiornato
        "testo": song_text,
        "categorie": [],
        "url": f"canti/{filename_html.replace('.html','')}",
        "fileName": filename_html
    }
    
    # Inserimento alfabetico tra i canti normali
    inserted = False
    for i, canto in enumerate(data["canti"]):
        if title.lower() < canto["titolo"].lower():
            data["canti"].insert(i, new_canto)
            inserted = True
            break
    if not inserted:
        data["canti"].append(new_canto)
    
    # Aggiorna ID di canti e taize
    data = update_json_ids(data)
    
    # Salva JSON
    with open(json_file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"✅ Canto aggiunto a canti.json")


# --- Funzione principale ---
def main():
    title = input("Inserisci il titolo della canzone: ").strip()
    print("Inserisci il testo della canzone (termina con riga vuota + Ctrl+D / Ctrl+Z):")
    song_lines = []
    try:
        while True:
            line = input()
            song_lines.append(line)
    except EOFError:
        pass
    song_text = '\n'.join(song_lines)

    link = input("Link YouTube (opzionale): ").strip()
    if link:
        link = link.replace("https://youtu.be/", "https://www.youtube-nocookie.com/embed/")
    
    n1 = input("Numero Minicorale (opzionale): ").strip() or None
    n2 = input("Numero libro assemblea (opzionale): ").strip() or None

    filename, filename_html = create_song_html(title, song_text, link, n1, n2)
    
    # Qui potresti chiamare add_song_to_html_list(title, filename) se vuoi aggiornare canti.html
    add_song_to_json(title, filename_html, song_text)


if __name__ == "__main__":
    main()