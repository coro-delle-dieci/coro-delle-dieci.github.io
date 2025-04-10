import os

canti_folder = "C:/Users/Scuola/Desktop/github/coro-delle-dieci.github.io/canti"

html_file = "C:/Users/Scuola/Desktop/github/coro-delle-dieci.github.io/canti.html"

special_words = {"gesù", "cristo", "dio", "signore", "signor", "santo", "spirito", "maria", "madonna", "czestochowa", "lui", "pietro"}

def format_canto_name(name):
    """
    Formatta il nome del canto:
    1. Sostituisce i trattini (-) con spazi.
    2. Capitalizza solo la prima lettera del titolo.
    3. Capitalizza le parole speciali (Gesù, Cristo, Dio) se presenti.
    """
    name = name.replace("-", " ").replace("l-a", "l'a").replace("l-e", "l'e").replace("l-i", "l'i").replace("l-o", "l'o").replace("l-u", "l'u").replace("m-a", "m'a")
    
    name = name[0].upper() + name[1:]
    
    words = name.split()
    for i, word in enumerate(words):
        if word.lower() in special_words:
            words[i] = word.capitalize()
    name = " ".join(words)
    
    return name

canti_files = [f for f in os.listdir(canti_folder) if os.path.isfile(os.path.join(canti_folder, f))]

canti_files.sort()

canti_links = []
for file in canti_files:
    nome_canto = os.path.splitext(file)[0]
    nome_canto = format_canto_name(nome_canto)
    link = f'<a href="canti/{file}">{nome_canto}</a><br>'
    canti_links.append(link)

canti_links_html = '\n'.join(canti_links)

with open(html_file, 'r', encoding='utf-8') as file:
    html_content = file.read()

start_marker = '<p class="canto-link">'
end_marker = '</p>'
start_index = html_content.find(start_marker)
end_index = html_content.find(end_marker, start_index)

if start_index == -1 or end_index == -1:
    print("Errore: Marcatori non trovati nel file HTML.")
else:
    new_html_content = (
        html_content[:start_index + len(start_marker)] +
        '\n' + canti_links_html + '\n' +
        html_content[end_index:]
    )

    with open(html_file, 'w', encoding='utf-8') as file:
        file.write(new_html_content)

    print("Lista dei canti aggiornata con successo!")