import pyperclip

def aggiungi_backslash(file_input, file_output):
    with open(file_input, 'r', encoding='utf-8') as f_in:
        righe = f_in.readlines()

    righe_modificate = []
    for i in range(len(righe)):
        riga_corrente = righe[i].rstrip('\n')  # Rimuove solo il newline
        riga_successiva_vuota = i + 1 < len(righe) and righe[i + 1].strip() == ''

        # Se la riga è vuota o seguita da una riga vuota, la lasciamo invariata
        if riga_corrente.strip() == '' or riga_successiva_vuota:
            righe_modificate.append(riga_corrente)
        else:
            righe_modificate.append(riga_corrente + "\\" + "\\")

    # Scrive il risultato su un nuovo file
    with open(file_output, 'w', encoding='utf-8') as f_out:
        for riga in righe_modificate:
            f_out.write(riga + '\n')

    # Copia il contenuto del file di output negli appunti
    with open(file_output, 'r', encoding='utf-8') as f_out:
        contenuto = f_out.read()
        pyperclip.copy(contenuto)
        print("Contenuto copiato negli appunti.")


# Esempio di utilizzo
input_file = 'C:/Users/Scuola/Desktop/github/coro-delle-dieci.github.io/support-files/input.txt'
output_file = 'C:/Users/Scuola/Desktop/github/coro-delle-dieci.github.io/support-files/output.txt'
aggiungi_backslash(input_file, output_file)