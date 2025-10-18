# Coro delle Dieci
>Cantare, suonare, comporre, dirigere, fare musica nella Chiesa sono tra le cose più belle a gloria di Dio. È un privilegio, un dono di Dio esprimere l’arte musicale e aiutare la partecipazione ai divini misteri.  
*Papa Francesco*

## Panoramica
Il sito è sviluppato per il ***Coro delle Dieci*** e include:
- Homepage con canti della domenica, nuovi canti, tempi forti e calendario
- Lista completa dei canti organizzata alfabeticamente
- Sistema di ricerca avanzato nei testi e nei titoli dei canti, oltre che nelle categorie
- Modalità presentazione per proiezione durante le funzioni o le prove
- Area amministrativa per aggiungere nuovi canti
- Calendario delle prove integrato con Google Calendar

## Contenuti musicali
### Statistiche dei canti
- **160+ canti** disponibili

- **Categorie principali**:
    - ***Liturgia* cantata**: *Acclamazione al Vangelo* - Alleluia, *Agnello di Dio*, *Aspersione*, *Atto penitenziale* - Kyrie, *Gloria*, *Santo*

    - **Momenti liturgici**: *Comunione*, *Congedo*, *Ingresso*, *Lavanda dei piedi*, *Offertorio*, *Pace*
    
    - **Tempi liturgici** (*Avvento*, *Cristo Re*, *Domenica delle Palme*, *Natale*, *Pasqua*, *Quaresima*, *Santi*)
    
    - **Altri momenti e temi di preghiera**: *Adorazione* Eucaristica, *Bambini*, *Beatitudini*, *Giubileo*, *GMG*, *Maria*, *Matrimonio*, *Missione*, *Perdono*, *Ringraziamento*, *Scout*, *Spirito Santo*, *Vocazione*

- **Formati disponibili**: Testi (scritti per il sito in HTML e in PDF), spartiti (in PDF), video YouTube

- **Numerazione** secondo il libretto "*Cantiamo al Signore*" e il quadernino ad anelli della "*Minicorale*"


### Struttura dei canti
Ogni canto include:
- testo in formato con strofe, ritornelli, intro/outro e bridge
- video YouTube integrato (se disponibile)
- download PDF del testo ed eventuali spartiti
- riferimento al numero utilizzato nel libretto del coro

## Tecnologie utilizzate
### Frontend
- **HTML5** semantico
- **CSS3**
- **JavaScript** Vanilla

### Integrazioni
- **Google Sheets** per i canti della domenica, i nuovi canti e i tempi forti
- **Google Calendar** per il calendario degli "appuntamenti" con le animazioni delle Sante Messe e le prove in oratorio
- **FormSubmit** per l'invio e la richiesta di nuovi canti
- **YouTube Embed** per i video

## Struttura del progetto
```text
/
├── index.html                 # Homepage
├── canti.html                # Lista completa canti
├── calendario.html           # Calendario prove
├── privacy.html              # Privacy e note legali
├── admin/
│   └── aggiungi-canto.html   # Form aggiunta canti
├── canti/                    # Pagine singoli canti (160+ file)
├── style/                    # Fogli di stile
│   ├── style.css             # Stili base
│   ├── home.css              # Stili homepage
│   ├── canti.css             # Stili pagine canti
│   ├── canti-lista.css       # Stili lista canti
│   ├── search.css            # Stili ricerca
│   ├── form.css              # Stili form
│   └── calendario.css        # Stili calendario
├── script/                   # JavaScript
│   ├── anno.js               # Aggiornamento anno
│   ├── canti-domenica.js     # Caricamento canti domenica
│   ├── canti-nuovi.js        # Caricamento nuovi canti
│   ├── canti-tempi-forti.js  # Canti tempi liturgici
│   ├── search.js             # Sistema ricerca
│   ├── auto-scroll.js        # Scrolling automatico
│   ├── up-button.js          # Pulsante torna su
│   └── get-zoom.js           # Rilevamento zoom
├── images/                   # Risorse grafiche
├── pdf-testi/                # PDF testi canti
├── pdf-spartiti/             # PDF spartiti
└── system/
│   ├─ grazie.html            # Ringraziamento dopo l'invio di un canto
│   └── docs/
│       └── guida-scrittura-canti.html  # Guida formattazione
└─ .github/
    ├─ ISSUE_TEMPLATE/
    │    ├─ bug_report.md
    │    ├─ feature_request.yml
    │    └─ idee_grafiche.yml
    ├─ PULL_REQUEST_TEMPLATE.md
    └─ SECURITY.md
```

## Funzionalità principali
### Sistema di ricerca
- Ricerca full-text nei titoli e nei testi dei canti
- Filtraggio per categorie liturgiche
- Highlight dei termini trovati
- Ricerca in tempo reale

### Design responsive
- Layout adattivo per mobile, tablet e desktop
- Menu hamburger per dispositivi mobili
- Ottimizzazione per proiezione (modalità zoom)

### Aggiornamenti dinamici
- **Canti della domenica** caricati da Google Sheets
- **Nuovi canti** e **Tempi forti** aggiunti automaticamente da Google Sheets
- **Calendario** sincronizzato con Google Calendar

### Modalità presentazione
- Scrolling automatico a diverse velocità
- Interfaccia semplificata e pulita per la proiezione
- Nascondimento elementi non essenziali

## Richiesta di inserimento di un nuovo canto
Per proporre l’aggiunta di un nuovo canto al sito, è disponibile [una pagina](coro-delle-dieci.github.io/admin/aggiungi-canto) nel sito.
Quando un utente compila e invia il modulo, i dati vengono inviati automaticamente via email ai responsabili del coro tramite il servizio FormSubmit.

### Campi da compilare
Il modulo richiede i seguenti dati:  
1. Nome del canto (obbligatorio): inserire il titolo completo del canto.
2. Testo del canto (obbligatorio): copiare l’intero testo del canto così come deve comparire nel sito.
3. Link YouTube (facoltativo): inserire il link a un video YouTube del canto (utile per ascolto e apprendimento).
4. Numero sul libretto (facoltativo): specificare il numero corrispondente sui libretti dei canti.

### Come funziona l'invio
Quando il modulo viene inviato, il sistema genera un’email con oggetto:  
`Nuovo canto da inserire: [Nome canto]`  
Il corpo dell’email contiene tutti i dati inseriti dall’utente nei campi del modulo.  
Il servizio [FormSubmit](formsubmit.co/) recapita l’email direttamente all’indirizzo dei responsabili del coro.  
I responsabili verificano le informazioni e, se approvate, inseriscono il canto nel sito.

### Nota bene!
**Il sistema non consente l’inserimento diretto nel sito: tutte le richieste vengono verificate manualmente.**

## Contatti e Supporto
Email: coro10.sanvito@gmail.com  

## Licenza
Sito sviluppato per uso pastorale senza scopo di lucro. I diritti dei testi e delle musiche appartengono ai rispettivi autori ed editori.


##
>La musica sacra svolge anche un altro compito, quello di saldare insieme la storia cristiana: nella Liturgia risuonano il canto gregoriano, la polifonia, la musica popolare e quella contemporanea. È come se in quel momento a lodare Dio ci fossero tutte le generazioni passate e presenti, ognuna con la propria sensibilità. Non solo, ma la musica sacra – e la musica in genere – crea ponti, avvicina le persone, anche le più lontane; non conosce barriere di nazionalità, di etnia, di colore della pelle, ma coinvolge tutti in un linguaggio superiore, e riesce sempre a mettere in sintonia persone e gruppi di provenienze anche molto differenti. La musica sacra riduce le distanze anche con quei fratelli che a volte sentiamo non vicini. Per questo in ogni parrocchia il gruppo di canto è un gruppo dove si respira disponibilità e aiuto reciproco.  
*Papa Francesco*