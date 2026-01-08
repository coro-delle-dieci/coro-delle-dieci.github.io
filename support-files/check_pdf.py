import os

# Percorsi delle cartelle
html_folder = "canti"
pdf_folder = "pdf-testi"

# Ottieni i nomi dei file senza estensione
html_files = {os.path.splitext(f)[0] for f in os.listdir(html_folder) if f.endswith(".html")}
pdf_files = {os.path.splitext(f)[0] for f in os.listdir(pdf_folder) if f.endswith(".pdf")}

# Trova i nomi presenti in html ma non in pdf
missing_pdfs = sorted(html_files - pdf_files)

# Stampa i risultati
if missing_pdfs:
    print("File HTML senza corrispondente PDF:")
    for name in missing_pdfs:
        print(name)
else:
    print("Tutti i file HTML hanno un corrispondente PDF.")