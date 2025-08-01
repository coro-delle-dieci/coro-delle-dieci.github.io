document.addEventListener('DOMContentLoaded', () => {
    const songSelectors = document.getElementById('songSelectors');
    const dateInput = document.getElementById('domenica');
    const saveBtn = document.getElementById('saveBtn');
    const message = document.getElementById('adminMessage');
    const addSongBtn = document.querySelector('.add-song-btn');

    // Lista FISSA dei canti disponibili
    const availableSongs = [
        "Accogli Signore i nostri doni",
        "Acqua siamo noi",
        "Adesso è la pienezza",
        "Adeste fideles",
        "Agnello di Dio (Giorgi)",
        "Agnello di Dio (De Dominicis)",
        "Alleluia (celtica)",
        "Alleluia a colui che risuscitò",
        "Alleluia, canto per Cristo",
        "Alleluia, chi ascolta",
        "Alleluia, ed oggi ancora",
        "Alleluia, la nostra festa",
        "Alleluia, la tua parola",
        "Alleluia, lode cosmica",
        "Alleluia, ora Lui vive",
        "Alleluia, passeranno i cieli",
        "Alleluia, questa tua parola",
        "Alleluia, rendete grazie",
        "Alleluia, Signore sei venuto",
        "Altissimo",
        "Alzati e risplendi",
        "Amatevi l'un l'altro",
        "Andate per le strade",
        "Anima Christi",
        "Anima di Cristo",
        "Antica eterna danza",
        "Astro del ciel",
        "Ave Maria gratia plena",
        "Ave Maria ora pro nobis",
        "Benedici o Signore",
        "Benedirò il Signore",
        "Camminerò",
        "Cantiamo te",
        "Cantico dei redenti",
        "Che gioia ci hai dato",
        "Chi?",
        "Chiesa del risorto",
        "Come fuoco vivo",
        "Come Maria",
        "Come ti ama Dio",
        "Con gioia veniamo a te",
        "Cristo è risorto veramente",
        "Cristo vive in mezzo a noi",
        "Dall'aurora al tramonto",
        "Dolce sentire",
        "È bello lodarti",
        "E la strada si apre",
        "E sono solo un uomo",
        "È un giorno di festa",
        "Ecco il nostro sì",
        "Ecco l'acqua",
        "Ecco quel che abbiamo",
        "Evenu shalom",
        "Frutto della nostra terra",
        "Giovane donna",
        "Gloria (Buttazzo)",
        "Gloria (Giombini)",
        "Gloria (Mariano)",
        "Grandi cose",
        "Il pane del cammino",
        "Incontro a te",
        "Innalziamo lo sguardo",
        "Invochiamo la tua presenza",
        "Isaia 11",
        "La canzone di Luciano",
        "La preghiera di gesù e la nostra",
        "Laudato sii",
        "Le tue mani",
        "Lode e Gloria",
        "Lode e Gloria a te",
        "Madonna di Czestochowa",
        "Maranathà vieni Signor",
        "Mi indicherai",
        "Musica di festa",
        "Nel tuo silenzio",
        "Noi saremo il pane",
        "Noi veniamo a te",
        "Ogni mia parola",
        "Osanna al figlio di David",
        "Pace sia pace a voi",
        "Pane del cielo",
        "Pane di vita nuova",
        "Perché tu sei con me",
        "Popoli tutti acclamate",
        "Quale gioia",
        "Rallegriamoci",
        "Re dei re",
        "Re di Gloria",
        "Redentore delle genti",
        "Resta accanto a me",
        "Resta qui con noi",
        "Rimani tra noi",
        "Risuscitò",
        "Salve regina",
        "San francesco",
        "Santa Maria del cammino",
        "Santo (Bonfitto)",
        "Santo (Buttazzo)",
        "Santo (Gen)",
        "Santo (Giorgi)",
        "Santo (Rossi)",
        "Santo sei Tu",
        "Santo (Spoladore)",
        "Santo (Zaire)",
        "Santo (Zappalà)",
        "Scusa Signore",
        "Se m'accogli",
        "Segni del tuo amore",
        "Segni nuovi",
        "Sei venuto dal cielo",
        "Servire è regnare",
        "Servo per amore",
        "Sono qui a lodarti",
        "Spirito di Dio",
        "Su ali d'aquila",
        "Sulla tua parola Pietro vai",
        "Te al centro del mio cuore",
        "Ti darò un cuore nuovo",
        "Ti esalto Dio mio re",
        "Ti lodiamo e t'adoriamo",
        "Ti offriamo Signore",
        "Tu scendi dalle stelle",
        "Tu sei la mia vita",
        "Tu sei",
        "Tutta la terra attende",
        "Venite fedeli",
        "Verbum panis",
        "Vieni Santo Spirito di Dio",
        "Vivere la vita",
        "Vocazione",
    ];

    // Aggiungi il primo selettore all'avvio
    addNewSongSelector();

    // Funzione per creare un nuovo selettore di canti
    function addNewSongSelector() {
        const selectorDiv = document.createElement('div');
        selectorDiv.className = 'song-selector';
        
        const index = document.querySelectorAll('.song-selector').length;
        
        selectorDiv.innerHTML = `
            <label>Canto ${index + 1}:</label>
            <div class="select-container">
                <select class="song-select">
                    <option value="">-- Seleziona un canto --</option>
                    ${availableSongs.map(song => 
                        `<option value="${song}">${song}</option>`
                    ).join('')}
                </select>
                <button class="remove-song-btn" ${index === 0 ? 'disabled' : ''}>
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        songSelectors.appendChild(selectorDiv);
        
        // Scrolla fino all'ultimo elemento aggiunto
        selectorDiv.scrollIntoView({ behavior: 'smooth' });
        
        // Aggiorna lo stato del pulsante di rimozione per il primo elemento
        updateRemoveButtons();
    }

    // Pulsante per aggiungere nuovi selettori
    addSongBtn?.addEventListener('click', addNewSongSelector);

    // Gestione rimozione selettori
    songSelectors.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-song-btn') || 
            e.target.closest('.remove-song-btn')) {
            const btn = e.target.classList.contains('remove-song-btn') ? e.target : e.target.closest('.remove-song-btn');
            if (!btn.disabled) {
                e.target.closest('.song-selector').remove();
                updateSongNumbers();
                updateRemoveButtons();
            }
        }
    });

    // Rinumera i canti dopo cancellazione
    function updateSongNumbers() {
        document.querySelectorAll('.song-selector').forEach((selector, index) => {
            selector.querySelector('label').textContent = `Canto ${index + 1}:`;
        });
    }
    
    // Disabilita il pulsante di rimozione per il primo selettore
    function updateRemoveButtons() {
        const selectors = document.querySelectorAll('.song-selector');
        selectors.forEach((selector, index) => {
            const removeBtn = selector.querySelector('.remove-song-btn');
            if (removeBtn) {
                removeBtn.disabled = index === 0;
            }
        });
    }

    // Salvataggio semplice (puoi modificare cosa fa)
    saveBtn.addEventListener('click', () => {
        const date = dateInput.value.trim();
        if (!date) {
            showMessage('Inserisci la data della domenica', 'error');
            dateInput.focus();
            return;
        }

        const songs = [];
        const emptySelects = [];
        
        document.querySelectorAll('.song-select').forEach((select, index) => {
            if (select.value) {
                songs.push(select.value);
            } else {
                emptySelects.push(index + 1);
            }
        });

        if (songs.length === 0) {
            showMessage('Seleziona almeno un canto', 'error');
            return;
        }
        
        if (emptySelects.length > 0) {
            const confirmSave = confirm(`Attenzione: hai ${emptySelects.length} selettori vuoti (Canti: ${emptySelects.join(', ')}). Vuoi procedere comunque con il salvataggio?`);
            if (!confirmSave) return;
        }

        showMessage(`Canti per ${date} salvati! ${songs.join(', ')}`, 'success');
        
        // Qui puoi fare qualcosa con i dati, ad esempio:
        console.log('Data:', date);
        console.log('Canti selezionati:', songs);
        
        // Facoltativo: resetta il form dopo il salvataggio
        // resetForm();
    });

    // Funzione per resettare il form (opzionale)
    function resetForm() {
        dateInput.value = '';
        songSelectors.innerHTML = '';
        addNewSongSelector();
    }

    // Mostra messaggi all'utente
    function showMessage(text, type = 'info') {
        message.textContent = text;
        message.className = `message ${type}`;
        setTimeout(() => {
            message.textContent = '';
            message.className = 'message';
        }, 5000);
    }
});