import os
import re

# Nuovo blocco da sostituire
nuovo_blocco = '''<li><a class="item" href="index/">Home</a></li>
<li><a class="item" href="canti/">Canti</a></li>
<li><a class="item" href="calendario/">Calendario</a></li>
<li><a class="item" href="error/">Accedi</a></li>'''

# Pattern per trovare il blocco vecchio, indipendentemente dall'indentazione
pattern_blocco = re.compile(
    r'(?P<indent>\s*)<li><a href="\.\./index/">Home</a></li>\s*'
    r'(?P=indent)<li><a href="\.\./canti/">Canti</a></li>\s*'
    r'(?P=indent)<li><a href="\.\./calendario/">Calendario</a></li>\s*'
    r'(?P=indent)<li><a href="\.\./contatti/">Contatti</a></li>',
    re.MULTILINE
)

# Scansiona tutti i file HTML nella cartella corrente
for filename in os.listdir():
    if filename.endswith(".html"):
        with open(filename, "r", encoding="utf-8") as file:
            content = file.read()

        # Cerca e sostituisce il blocco, preservando l'indentazione originale
        def sostituisci_blocco(match):
            indent = match.group("indent")
            nuovo_blocco_indentato = '\n'.join(indent + riga for riga in nuovo_blocco.split('\n'))
            return nuovo_blocco_indentato

        nuovo_contenuto = pattern_blocco.sub(sostituisci_blocco, content)

        with open(filename, "w", encoding="utf-8") as file:
            file.write(nuovo_contenuto)

print("✅ Menu aggiornato con successo in tutti i file HTML!")