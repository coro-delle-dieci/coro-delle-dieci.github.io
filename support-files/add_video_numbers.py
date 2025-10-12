def add_sections_to_html(file_path, link, n1, n2):
    with open(file_path, 'r', encoding='utf-8') as file:
        content = file.read()

    section_end_index = content.find('</section>')
    if section_end_index == -1:
        print("Errore: Tag </section> non trovato nel file HTML.")
        return

    new_section = '\n'

    if link:
        new_section += '''
        <section class="video-container">
            <iframe width="560" height="315" src="{}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
        </section>
        '''.format(link)

    if n1 or n2:
        new_section += '''
        <section>
            Puoi trovare questo canto al numero:<br>
        '''
        if n1:
            new_section += f'    <b>{n1}</b> nel quaderno ad anelli (libretto della Minicorale)<br>\n'
        if n2:
            new_section += f'\t\t    <b>{n2}</b> nel libro dei canti dell\'assemblea<br>'
        new_section += '''
        </section>'''

    updated_content = content[:section_end_index + len('</section>')] + new_section + content[section_end_index + len('</section>'):]

    with open(file_path, 'w', encoding='utf-8') as file:
        file.write(updated_content)

    print(f"Sezioni aggiunte con successo al file: {file_path}")

def main():
    file_path = "C:/Users/Scuola/Desktop/github/coro-delle-dieci.github.io/canti/" + input("Inserisci il percorso del file HTML: ") + ".html"

    link = input("Link: ").strip().replace("https://youtu.be/", "https://www.youtube.com/embed/")

    n1 = input("Numero nel l. minicorale: ").strip()
    n2 = input("Numero nel l. assemblea: ").strip()

    add_sections_to_html(file_path, link, n1, n2)

if __name__ == "__main__":
    main()