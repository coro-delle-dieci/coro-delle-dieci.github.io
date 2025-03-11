def add_sections_to_html(file_path, link, n1, n2):
    # Leggi il contenuto del file HTML
    with open(file_path, 'r', encoding='utf-8') as file:
        content = file.read()

    # Trova la posizione di </section>
    section_end_index = content.find('</section>')
    if section_end_index == -1:
        print("Errore: Tag </section> non trovato nel file HTML.")
        return

    # Costruisci la nuova sezione da aggiungere
    new_section = '\n'

    # Aggiungi il video YouTube se il link è fornito
    if link:
        new_section += '''
        <section class="video-container">
            <iframe width="560" height="315" src="{}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
        </section>
        '''.format(link)

    # Aggiungi la sezione dei numeri se almeno uno dei due è fornito
    if n1 or n2:
        new_section += '''
        <section>
            Puoi trovare questo canto al numero:<br>
        '''
        if n1:
            new_section += f'    <b>{n1}</b> nel quaderno ad anelli (libretto della Minicorale)<br>\n'
        if n2:
            new_section += f'    <b>{n2}</b> nel libro dei canti dell\'assemblea<br>\n'
        new_section += '''
        </section>
        '''

    # Inserisci la nuova sezione dopo </section>
    updated_content = content[:section_end_index + len('</section>')] + new_section + content[section_end_index + len('</section>'):]

    # Scrivi il contenuto aggiornato nel file
    with open(file_path, 'w', encoding='utf-8') as file:
        file.write(updated_content)

    print(f"Sezioni aggiunte con successo al file: {file_path}")

def main():
    # Chiedi all'utente il percorso del file HTML
    file_path = "C:/Users/Scuola/Desktop/github/coro-delle-dieci.github.io/canti/" + input("Inserisci il percorso del file HTML: ") + ".html"

    # Chiedi all'utente il link del video YouTube
    link = input("Link: ").strip().replace("https://youtu.be/", "https://www.youtube.com/embed/")

    # Chiedi all'utente i numeri n1 e n2
    n1 = input("Numero nel l. minicorale: ").strip()
    n2 = input("Numero nel l. assemblea: ").strip()

    # Aggiungi le sezioni al file HTML
    add_sections_to_html(file_path, link, n1, n2)

if __name__ == "__main__":
    main()