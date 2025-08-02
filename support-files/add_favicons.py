import os
import re

# Percorso base del progetto (un livello sopra la cartella corrente)
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))

# Configurazione favicon
favicon_config = [
    '<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">',
    '<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">',
    '<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">',
    '<link rel="manifest" href="/site.webmanifest">',
    '<link rel="mask-icon" href="/safari-pinned-tab.svg" color="#061a40">',
    '<meta name="msapplication-TileColor" content="#061a40">',
    '<meta name="theme-color" content="#061a40">'
]
favicon_tags = '\n    '.join(favicon_config)

# Trova tutti i file HTML nel progetto
html_files = []
for root, dirs, files in os.walk(project_root):
    # Salta la cartella .git
    if '.git' in dirs:
        dirs.remove('.git')
    
    for file in files:
        if file.endswith('.html'):
            html_files.append(os.path.join(root, file))

# Processa ogni file HTML
for file_path in html_files:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Controlla se le favicon sono già presenti
    if 'apple-touch-icon' in content:
        print(f"⏩ Favicon già presenti in {os.path.relpath(file_path, project_root)}")
        continue

    # Trova la posizione del tag </title>
    title_end = content.find('</title>')
    if title_end == -1:
        print(f"⚠️ Impossibile trovare </title> in {os.path.relpath(file_path, project_root)}")
        continue

    # Inserisci le favicon dopo il tag </title>
    insert_position = title_end + len('</title>')
    new_content = content[:insert_position] + '\n    ' + favicon_tags + content[insert_position:]

    # Salva le modifiche
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
        print(f"✅ Favicon aggiunte a {os.path.relpath(file_path, project_root)}")

print("\nOperazione completata!")
print(f"File modificati: {len(html_files)}")