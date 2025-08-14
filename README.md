# Coro delle Dieci

![Coro delle dieci](https://github.com/user-attachments/assets/c2eccda9-a303-48bc-9503-7222b28d116a)


## Descrizione

**Coro delle Dieci** è il sito ufficiale del coro parrocchiale “Coro delle Dieci” (Parrocchia S. Vito e C.M. – Spinea).  
Permette di:
- Visualizzare il calendario delle prove (embed Google Calendar)  
- Caricare i canti della Messa domenicale direttamente da un Google Sheet  
- Scegliere e sperimentare diverse palette di colori utilizzando le apposite cartelle:
  - [verde (1)](./demo-palette1)
  - [viola](./demo-palette2)
  - [verde (2)](./demo-palette3)
  - [nero e rosa](./demo-palette4)
  - [blu - default](./index.html)
- Avere un layout responsive sia da desktop che da mobile  

## Funzionalità principali

1. **Homepage dinamica**  
   - Sezione “I canti di questa domenica” scritta attraverso JavaScript con sorgente nel foglio Google Sheets  
   - Embed del calendario delle prove con Google Calendar in modalità agenda
   - Sezione dedicata ai tempi forti (ad esempio Pasqua, Natale, Quaresima, etc…)
   - Sezione dei canti "Da imparare", che presto proveremo e canteremo, sempre in aggiornamento!

2. **Standard di collaborazione**  
   - `LICENSE` (MIT)  
   - Template per issue (`.github/ISSUE_TEMPLATE`), pull request e contributi  
   - `SECURITY.md` per la gestione responsabile delle vulnerabilità

***N.B.: Ogni pull request è assolutamente ben accetta, come ogni segnalazione o proposta di miglioramento!***

## Struttura del progetto
```text
/
├─ index.html                 ← Homepage con sezione canti + calendario  
├─ canti.html                 ← Elenco statico dei canti  
├─ calendario.html            ← Pagina dedicata al calendario  
├─ style.css                  ← Stile globale + variabili CSS per le palette  
├─ carica‑canti.js            ← JS che legge e carica i canti da Google Sheets  
├─ canti/                     ← Cartella con un file HTML per ogni canto
│    ├─ altissimo.html
|    ├─ camminero.html
│    └─ …
├─ canti-pdf/                 ← Cartella con un file PDF per ogni canto
│    ├─ altissimo.pdf
|    ├─ camminero.pdf
│    └─ …
├─ images/                    ← Cartella contenente immagini di diverso tipo
├─ admin/                     ← Contiene tutto ciò che è legato alla gestione riservata
│    ├─ login.html            ← Accesso agli amminisratori (prossimamente in funzione)
│    ├─ dashboad.html         ← Interfaccia protetta per gestire i canti, pannello di controllo 
│    └─ aggiungi-canto.html   ← Form per inserire nuovi canti
├─ system/                    ← Per pagine tecniche o di servizio
│    ├─ grazie.html           ← Pagina di conferma dopo un'azione
│    └─ docs/                 ← Documentazione e guide
│        └─ guida-scrittura-canti.html
└─ .github/
    ├─ ISSUE_TEMPLATE/
    │    ├─ bug_report.md
    │    ├─ feature_request.yml
    │    └─ idee_grafiche.yml
    ├─ PULL_REQUEST_TEMPLATE.md
    └─ SECURITY.md
```

## Prossimi aggiornamenti
1. **Gestione dei contenuti (admin)**  
   - Accesso protetto (username/password o OAuth Google)  
   - Interfaccia per aggiungere/modificare i canti della domenica con titolo e link

2. **Accesso per tutti i membri del coro**
   - Accesso protetto (username/password o OAuth Google)
   - Interfaccia per visualizzare audio e/o video riservati ai membri del coro (seconde voci, salmi cantati, etc…)


## Richiesta di inserimento di un nuovo canto ([aggiungi-canto.html](./admin/aggiungi-canto.html))
Per proporre l’aggiunta di un nuovo canto al sito, è disponibile un modulo online.
Quando un utente compila e invia il modulo, i dati vengono inviati automaticamente via email ai responsabili del coro tramite il servizio FormSubmit.

### Campi da compilare
Il modulo richiede i seguenti dati:  
1. Nome del canto (obbligatorio): inserire il titolo completo del canto.
2. Testo del canto (obbligatorio): copiare l’intero testo del canto così come deve comparire nel sito.
3. Link YouTube (facoltativo): inserire il link a un video YouTube del canto (utile per ascolto e apprendimento).
4. Numero sul libretto (facoltativo): specificare il numero corrispondente sul libretto dei canti.

### Come funziona l'invio
Quando il modulo viene inviato, il sistema genera un’email con oggetto:  
`Nuovo canto da inserire: [Nome canto]`  
Il corpo dell’email contiene tutti i dati inseriti dall’utente nei campi del modulo.  
Il servizio [FormSubmit](formsubmit.co/) recapita l’email direttamente all’indirizzo dei responsabili del coro.  
I responsabili verificano le informazioni e, se approvate, inseriscono il canto nel sito.

### Nota bene!
**Il sistema non consente l’inserimento diretto nel sito: tutte le richieste vengono verificate manualmente.**