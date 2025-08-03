import os
import re

# Percorso fisso della cartella
FOLDER_PATH = os.path.join(os.path.dirname(__file__), '../canti-pdf')

# Mappatura dei nomi
SONG_MAPPING = {
    1: "accoli-signore-i-nostri-doni",
    2: "acqua-siamo-noi",
    3: "adesso-e-la-pienezza",
    4: "adeste-fideles",
    5: "alleluia-celtica",
    6: "alleluia-canto-per-cristo",
    7: "alleluia-chi-ascolta",
    8: "alleluia-ed-oggi-ancora",
    9: "alleluia-la-nostra-festa",
    10: "alleluia-la-tua-parola",
    11: "alleluia-ora-lui-vive",
    12: "alleluia-passeranno-i-cieli",
    13: "alleluia-questa-tua-parola",
    14: "alleluia-signore-sei-venuto",
    15: "altissimo",
    16: "alzati-e-risplendi",
    17: "amatevi-lun-laltro",
    18: "andate-per-le-strade",
    19: "anima-di-cristo",
    20: "astro-del-ciel",
    21: "ave-maria",
    22: "ave-maria-gratia-plena",
    23: "ave-maria-ora-pro-nobis",
    24: "benedici-o-signore",
    25: "benediro-il-signore",
    26: "camminero",
    27: "cantiamo-te",
    28: "cantico-dei-redenti",
    29: "che-gioia-ci-hai-dato",
    30: "chi",
    31: "come-fuoco-vivo",
    32: "come-maria",
    33: "come-ti-ama-dio",
    34: "con-gioia-veniamo-a-te",
    35: "cristo-e-risorto-veramente",
    36: "cristo-vive-in-mezzo-a-noi",
    37: "dallaurora-al-tramonto",
    38: "dolce-sentire",
    39: "e-bello-lodarti",
    40: "e-la-strada-si-apre",
    41: "e-solo-un-uomo",
    42: "e-un-giorno-di-festa",
    43: "ecco-lacqua",
    44: "ecco-il-nostro-si",
    45: "ecco-quel-che-abbiamo",
    46: "evenu-shalom",
    47: "frutto-della-nostra-della-terra",
    48: "giovane-donna",
    49: "gloria-butazzo",
    50: "gloria-giombini",
    51: "gloria-mariano",
    52: "grandi-cose",
    53: "il-pane-del-cammino",
    54: "incontro-a-te",
    55: "innalziamo-lo-sguardo",
    56: "invochiamo-la-tua-presenza",
    57: "isaia-11",
    58: "la-preghiera-di-gesu-e-la-nostra",
    59: "laudato-sii",
    60: "lode-e-gloria",
    61: "lode-e-gloria-a-te",
    62: "madonna-di-czestochowa",
    63: "maranatha-vieni-signor",
    64: "mi-indicherai",
    65: "musica-di-festa",
    66: "nel-tuo-silenzio",
    67: "noi-veniamo-a-te",
    68: "ogni-mia-parola",
    69: "pace-sia-pace-a-voi",
    70: "pane-del-cielo",
    71: "pane-di-vita-nuova",
    72: "popoli-tutti-acclamate",
    73: "quale-gioia",
    74: "rallegriamoci",
    75: "re-di-gloria",
    76: "resta-accanto-a-me",
    77: "rimani-tra-noi",
    78: "risuscito",
    79: "salve-regina",
    80: "san-francesco",
    81: "santa-maria-del-cammino",
    82: "santo-bonfitto",
    83: "santo-butazzo",
    84: "santo-gen",
    85: "santo-rossi",
    86: "santo-spoladore",
    87: "santo-zaire-osanna-eh",
    88: "santo-zappala",
    89: "santo-sei-tu",
    90: "scusa-signore",
    91: "se-maccogli",
    92: "segni-del-tuo-amore",
    93: "segni-nuovi",
    94: "sei-venuto-dal-cielo",
    95: "servire-e-regnare",
    96: "servo-per-amore",
    97: "sono-qui-a-lodarti",
    98: "spirito-di-dio",
    99: "su-ali-daquila",
    100: "sulla-tua-parola-pietro-vai",
    101: "te-al-centro-del-mio-cuore",
    102: "ti-esalto-dio-mio-re",
    103: "ti-lodiamo-e-tadoriamo",
    104: "ti-offriamo-signore",
    105: "tu-scendi-dalle-stelle",
    106: "tu-sei-soffiera-soffiera",
    107: "tu-sei-la-mia-vita",
    108: "tutta-la-terra-attende",
    109: "un-cuore-nuovo",
    110: "venite-fedeli",
    111: "verbum-panis",
    112: "vieni-santo-spirito-di-dio",
    113: "vivere-la-vita",
    114: "vocazione"
}

def clean_filename(name):
    """Pulisce il nome del file secondo le specifiche"""
    name = name.lower()
    name = re.sub(r'[\(\)\'’\.,;:!?]', '', name)  # Rimuove punteggiatura
    name = re.sub(r'\s+', '-', name)               # Sostituisce spazi con trattini
    return name

def rename_pdf_files():
    """Rinomina i file PDF nella cartella specificata"""
    if not os.path.exists(FOLDER_PATH):
        print(f"Errore: La cartella {FOLDER_PATH} non esiste!")
        return
    
    print(f"Elaborazione files in: {FOLDER_PATH}")
    
    for filename in os.listdir(FOLDER_PATH):
        if filename.lower().endswith('.pdf'):
            try:
                # Estrai il numero dal nome del file (senza estensione)
                file_num = int(os.path.splitext(filename)[0])
                
                # Verifica se il numero è nella mappatura
                if file_num in SONG_MAPPING:
                    new_name = f"{SONG_MAPPING[file_num]}.pdf"
                    old_path = os.path.join(FOLDER_PATH, filename)
                    new_path = os.path.join(FOLDER_PATH, new_name)
                    
                    # Rinomina il file
                    os.rename(old_path, new_path)
                    print(f"Rinominato: {filename:>10} -> {new_name}")
                else:
                    print(f"Attenzione: Nessun mapping per il numero {file_num}")
                    
            except ValueError:
                print(f"Saltato: {filename} (non è un file numerico)")
            except Exception as e:
                print(f"Errore elaborando {filename}: {str(e)}")

if __name__ == "__main__":
    print("=== Rinomina PDF dei canti ===")
    rename_pdf_files()
    print("Operazione completata!")