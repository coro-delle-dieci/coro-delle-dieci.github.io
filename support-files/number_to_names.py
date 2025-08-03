# Questo script rinomina i file in una directory in base a una mappatura predefinita dai codici numerici agli slug descrittivi.
# Utilizza la libreria unidecode per gestire caratteri non ASCII e fornisce un'opzione dry-run per visualizzare in anteprima le modifiche senza apportarle.

import os
import re
import argparse

try:
    from unidecode import unidecode
except ImportError:
    raise ImportError("Please install unidecode: pip install unidecode")

# Table of titles with their corresponding numbers
TABLE = '''
ACCOGLI SIGNORE I NOSTRI DONI	1
ACQUA SIAMO NOI	2
ADESSO È LA PIENEZZA	3
ADESTE FIDELES	4
ALLELUIA (CELTICA)	5
ALLELUIA, CANTO PER CRISTO	6
ALLELUIA, CHI ASCOLTA	7
ALLELUIA, ED OGGI ANCORA	8
ALLELUIA, LA NOSTRA FESTA	9
ALLELUIA, LA TUA PAROLA	10
ALLELUIA, ORA LUI VIVE	11
ALLELUIA, PASSERANNO I CIELI	12
ALLELUIA, QUESTA TUA PAROLA	13
ALLELUIA, SIGNORE SEI VENUTO	14
ALTISSIMO	15
ALZATI E RISPLENDI	16
AMATEVI L’UN L’ALTRO	17
ANDATE PER LE STRADE	18
ANIMA DI CRISTO	19
ASTRO DEL CIEL	20
AVE MARIA	21
AVE MARIA, GRATIA PLENA	22
AVE MARIA, ORA PRO NOBIS	23
BENEDICI, O SIGNORE	24
BENEDIRÒ IL SIGNORE	25
CAMMINERÒ	26
CANTIAMO TE	27
CANTICO DEI REDENTI	28
CHE GIOIA CI HAI DATO	29
CHI?	30
COME FUOCO VIVO	31
COME MARIA	32
COME TI AMA DIO	33
CON GIOIA VENIAMO A TE	34
CRISTO È RISORTO VERAMENTE	35
CRISTO VIVE IN MEZZO A NOI	36
DALL’AURORA AL TRAMONTO	37
DOLCE SENTIRE	38
È BELLO LODARTI	39
E LA STRADA SI APRE	40
E SOLO UN UOMO	41
È UN GIORNO DI FESTA	42
ECCO L’ACQUA	43
ECCO IL NOSTRO SÌ	44
ECCO QUEL CHE ABBIAMO	45
EVENU SHALOM	46
FRUTTO DELLA NOSTRA DELLA TERRA	47
GIOVANE DONNA	48
GLORIA (BUTTAZZO)	49
GLORIA (GIOMBINI)	50
GLORIA (MARIANO)	51
GRANDI COSE	52
IL PANE DEL CAMMINO	53
INCONTRO A TE	54
INNALZIAMO LO SGUARDO	55
INVOCHIAMO LA TUA PRESENZA	56
ISAIA 11	57
LA PREGHIERA DI GESÙ E LA NOSTRA	58
LAUDATO SII	59
LODE E GLORIA	60
LODE E GLORIA A TE	61
MADONNA DI CZESTOCHOWA	62
MARANATHÀ, VIENI SIGNOR	63
MI INDICHERAI	64
MUSICA DI FESTA	65
NEL TUO SILENZIO	66
NOI VENIAMO A TE	67
OGNI MIA PAROLA	68
PACE SIA, PACE A VOI	69
PANE DEL CIELO	70
PANE DI VITA NUOVA	71
POPOLI TUTTI ACCLAMATE	72
QUALE GIOIA	73
RALLEGRIAMOCI	74
RE DI GLORIA	75
RESTA ACCANTO A ME	76
RIMANI TRA NOI	77
RISUSCITÒ	78
SALVE REGINA	79
SAN FRANCESCO	80
SANTA MARIA DEL CAMMINO	81
SANTO (BONFITTO)	82
SANTO (BUTTAZZO)	83
SANTO (GEN)	84
SANTO (ROSSI)	85
SANTO (SPOLADORE)	86
SANTO (ZAIRE) - OSANNA EH!	87
SANTO (ZAPPALÀ)	88
SANTO SEI TU	89
SCUSA, SIGNORE	90
SE M’ACCOGLI	91
SEGNI DEL TUO AMORE	92
SEGNI NUOVI	93
SEI VENUTO DAL CIELO	94
SERVIRE È REGNARE	95
SERVO PER AMORE	96
SONO QUI A LODARTI	97
SPIRITO DI DIO	98
SU ALI D'AQUILA	99
SULLA TUA PAROLA (PIETRO VAI)	100
TE AL CENTRO DEL MIO CUORE	101
TI ESALTO DIO MIO RE	102
TI LODIAMO E T’ADORIAMO	103
TI OFFRIAMO SIGNORE	104
TU SCENDI DALLE STELLE	105
TU SEI (SOFFIERÀ, SOFFIERÀ)	106
TU SEI LA MIA VITA	107
TUTTA LA TERRA ATTENDE	108
UN CUORE NUOVO	109
VENITE FEDELI	110
VERBUM PANIS	111
VIENI SANTO SPIRITO DI DIO	112
VIVERE LA VITA	113
VOCAZIONE	114
'''

def slugify(text):
    """
    Convert text to a slug: lowercase, ascii, replace non-alphanumeric with hyphens.
    """
    text = unidecode(text)
    text = text.lower()
    # replace any sequence of non-alphanumeric characters with single hyphen
    text = re.sub(r"[^a-z0-9]+", "-", text)
    text = text.strip("-")
    return text

# Build mapping from padded number to slugified title
mapping = {}
for line in TABLE.strip().splitlines():
    title, num = line.rsplit("\t", 1)
    key = f"{int(num):03d}"
    mapping[key] = slugify(title)


def rename_files(directory, dry_run=False):
    for fname in os.listdir(directory):
        name, ext = os.path.splitext(fname)
        if name in mapping:
            new_name = mapping[name] + ext.lower()
            src = os.path.join(directory, fname)
            dst = os.path.join(directory, new_name)
            if dry_run:
                print(f"Would rename: {fname} -> {new_name}")
            else:
                print(f"Renaming: {fname} -> {new_name}")
                os.rename(src, dst)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Rename files from numeric codes to descriptive slugs.")
    parser.add_argument("directory", nargs="?", default=".", help="Target directory (default: current)")
    parser.add_argument("--dry-run", action="store_true", help="Show changes without renaming")
    args = parser.parse_args()
    rename_files(args.directory, dry_run=args.dry_run)
