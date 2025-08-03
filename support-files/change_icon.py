import os

# Percorso della cartella
folder = './canti'

# Codice da sostituire (vecchio blocco)
old_block = '''<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
    <link rel="manifest" href="/site.webmanifest">'''

# Codice nuovo da inserire
new_block = '''<link rel="icon" type="image/png" sizes="32x32" href="../images/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="../images/favicon-16x16.png">
    <link rel="manifest" href="../images/site.webmanifest">
    <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#061a40">'''

# Scorri tutti i file nella cartella
for filename in os.listdir(folder):
    if filename.endswith(".html"):
        filepath = os.path.join(folder, filename)
        with open(filepath, "r", encoding="utf-8") as file:
            content = file.read()

        if old_block in content:
            content = content.replace(old_block, new_block)
            with open(filepath, "w", encoding="utf-8") as file:
                file.write(content)
            print(f"[✔] Modificato: {filename}")
        else:
            print(f"[–] Nessuna modifica: {filename}")
