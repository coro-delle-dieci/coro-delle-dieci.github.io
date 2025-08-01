// Configurazioni
const CONFIG = {
    API_BASE_URL: 'https://coro-backend.onrender.com',
    MAX_SONGS: 15
};

// Elementi UI
const DOM = {
    songSelectors: document.getElementById('songSelectors'),
    dateInput: document.getElementById('domenica'),
    saveBtn: document.getElementById('saveBtn'),
    message: document.getElementById('adminMessage')
};

// Stato applicazione
const AppState = {
    currentSongs: { domenica: '', canti: [] },
    availableSongs: []
};

// Inizializzazione
document.addEventListener('DOMContentLoaded', async () => {
    setupEventListeners();
    await loadInitialData();
    renderUI();
});

function setupEventListeners() {
    DOM.saveBtn.addEventListener('click', saveSongs);
    
    DOM.songSelectors.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-song-btn')) {
            addNewSongSelector();
        }
        if (e.target.classList.contains('remove-song-btn')) {
            e.target.closest('.song-selector').remove();
            renumberSongSelectors();
        }
    });
    
    // Auto-format della data durante l'input
    DOM.dateInput.addEventListener('blur', formatDateInput);
}

async function loadInitialData() {
    showLoading(true);
    
    try {
        // Carica canti disponibili
        const [songsResponse, currentResponse] = await Promise.all([
            fetch(`${CONFIG.API_BASE_URL}/api/songs`),
            fetch(`${CONFIG.API_BASE_URL}/api/current`)
        ]);
        
        if (!songsResponse.ok) throw new Error('Errore nel caricamento dei canti disponibili');
        AppState.availableSongs = await songsResponse.json();
        
        if (currentResponse.ok) {
            AppState.currentSongs = await currentResponse.json();
        }
        
    } catch (error) {
        console.error('Errore nel caricamento dati:', error);
        showMessage(`Errore nel caricamento dei dati: ${error.message}`, 'error');
    } finally {
        showLoading(false);
    }
}

function renderUI() {
    renderDateInput();
    renderSongSelectors();
}

function renderDateInput() {
    DOM.dateInput.value = AppState.currentSongs.domenica || '';
}

function renderSongSelectors() {
    DOM.songSelectors.innerHTML = '';
    
    const header = document.createElement('div');
    header.className = 'songs-header';
    header.innerHTML = `
        <h3><i class="fas fa-list-ol"></i> Canti selezionati:</h3>
        <button class="add-song-btn" ${AppState.currentSongs.canti.length >= CONFIG.MAX_SONGS ? 'disabled' : ''}>
            <i class="fas fa-plus"></i> Aggiungi canto
        </button>
    `;
    DOM.songSelectors.appendChild(header);
    
    const container = document.createElement('div');
    container.id = 'songs-container';
    DOM.songSelectors.appendChild(container);
    
    AppState.currentSongs.canti.forEach((song, index) => {
        container.appendChild(createSongSelector(song, index));
    });
    
    if (AppState.currentSongs.canti.length === 0) {
        addNewSongSelector();
    }
}

function createSongSelector(selectedSong, index) {
    const wrapper = document.createElement('div');
    wrapper.className = 'song-selector';
    wrapper.dataset.index = index;

    const label = document.createElement('label');
    label.textContent = `Canto ${index + 1}:`;
    label.htmlFor = `song-${index}`;

    const selectContainer = document.createElement('div');
    selectContainer.className = 'select-container';

    const select = document.createElement('select');
    select.id = `song-${index}`;
    select.className = 'song-select';

    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = '-- Seleziona un canto --';
    select.appendChild(defaultOption);

    // Ordina i canti disponibili alfabeticamente
    const sortedSongs = [...AppState.availableSongs].sort((a, b) => a.titolo.localeCompare(b.titolo));
    
    sortedSongs.forEach(song => {
        const option = document.createElement('option');
        option.value = song.id;
        option.textContent = song.titolo;
        option.selected = song.id === selectedSong?.id;
        select.appendChild(option);
    });

    // Aggiungi opzione per nuovo canto
    const newSongOption = document.createElement('option');
    newSongOption.value = 'new';
    newSongOption.textContent = '-- Aggiungi nuovo canto --';
    select.appendChild(newSongOption);

    const inputGroup = document.createElement('div');
    inputGroup.className = 'input-group';
    inputGroup.style.display = 'none';

    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'song-input';
    input.placeholder = 'Titolo del nuovo canto';
    input.required = true;
    
    const linkInput = document.createElement('input');
    linkInput.type = 'text';
    linkInput.className = 'song-link-input';
    linkInput.placeholder = 'Link al canto (opzionale)';

    inputGroup.append(input, linkInput);

    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove-song-btn';
    removeBtn.innerHTML = '<i class="fas fa-trash"></i>';
    removeBtn.title = 'Rimuovi canto';

    select.addEventListener('change', (e) => {
        inputGroup.style.display = e.target.value === 'new' ? 'flex' : 'none';
        if (e.target.value !== 'new') {
            input.value = '';
            linkInput.value = '';
        }
    });

    // Se è un nuovo canto (non presente nella lista)
    if (selectedSong && !selectedSong.id && selectedSong.titolo) {
        select.value = 'new';
        inputGroup.style.display = 'flex';
        input.value = selectedSong.titolo;
        if (selectedSong.link) linkInput.value = selectedSong.link;
    }

    selectContainer.append(select, removeBtn);
    wrapper.append(label, selectContainer, inputGroup);
    return wrapper;
}

function addNewSongSelector() {
    const container = document.getElementById('songs-container');
    if (!container) return;
    
    const currentCount = container.querySelectorAll('.song-selector').length;
    if (currentCount >= CONFIG.MAX_SONGS) {
        showMessage(`Numero massimo di canti raggiunto (${CONFIG.MAX_SONGS})`, 'warning');
        return;
    }
    
    const index = currentCount;
    container.appendChild(createSongSelector(null, index));
    renumberSongSelectors();
    
    // Disabilita il pulsante se raggiunto il massimo
    const addBtn = document.querySelector('.add-song-btn');
    if (addBtn && currentCount + 1 >= CONFIG.MAX_SONGS) {
        addBtn.disabled = true;
    }
}

function renumberSongSelectors() {
    const selectors = document.querySelectorAll('.song-selector');
    selectors.forEach((selector, index) => {
        const label = selector.querySelector('label');
        if (label) label.textContent = `Canto ${index + 1}:`;
    });
    
    // Abilita il pulsante aggiungi se sotto il limite
    const addBtn = document.querySelector('.add-song-btn');
    if (addBtn && selectors.length < CONFIG.MAX_SONGS) {
        addBtn.disabled = false;
    }
}

function formatDateInput() {
    const dateStr = DOM.dateInput.value.trim();
    if (!dateStr) return;
    
    try {
        // Prova a formattare la data in un formato più leggibile
        const date = parseItalianDate(dateStr);
        if (date) {
            const formatted = formatItalianDate(date);
            DOM.dateInput.value = formatted;
        }
    } catch (e) {
        console.log("Formattazione data non riuscita, manterrà input utente");
    }
}

function parseItalianDate(dateStr) {
    const months = {
        'gennaio': 0, 'febbraio': 1, 'marzo': 2, 'aprile': 3,
        'maggio': 4, 'giugno': 5, 'luglio': 6, 'agosto': 7,
        'settembre': 8, 'ottobre': 9, 'novembre': 10, 'dicembre': 11
    };
    
    const parts = dateStr.toLowerCase().split(/\s+/);
    if (parts.length !== 3) return null;
    
    const day = parseInt(parts[0], 10);
    const month = months[parts[1]];
    const year = parseInt(parts[2], 10);
    
    if (isNaN(day)) return null;
    if (month === undefined) return null;
    if (isNaN(year)) return null;
    
    return new Date(year, month, day);
}

function formatItalianDate(date) {
    const months = [
        'gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno',
        'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'
    ];
    
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

function showLoading(show) {
    if (show) {
        DOM.songSelectors.innerHTML = `
            <div class="loading-state">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Caricamento canti in corso...</p>
            </div>
        `;
        DOM.saveBtn.disabled = true;
    } else {
        DOM.saveBtn.disabled = false;
    }
}

function showMessage(text, type = 'info') {
    DOM.message.textContent = text;
    DOM.message.className = `message ${type}`;
    setTimeout(() => {
        DOM.message.textContent = '';
        DOM.message.className = 'message';
    }, 5000);
}

async function saveSongs() {
    const dateStr = DOM.dateInput.value.trim();
    if (!dateStr) {
        showMessage('Inserisci la data della domenica', 'error');
        DOM.dateInput.focus();
        return;
    }
    
    const date = parseItalianDate(dateStr);
    if (!date || isNaN(date.getTime())) {
        showMessage('Formato data non valido (es: 25 dicembre 2023)', 'error');
        DOM.dateInput.focus();
        return;
    }
    
    // Verifica che sia una domenica
    if (date.getDay() !== 0) {
        showMessage('La data deve essere una domenica', 'error');
        DOM.dateInput.focus();
        return;
    }
    
    const songs = collectSelectedSongs();
    if (songs.length === 0) {
        showMessage('Inserisci almeno un canto', 'error');
        return;
    }

    try {
        showLoading(true);
        DOM.saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Salvataggio in corso...';
        
        const response = await fetch(`${CONFIG.API_BASE_URL}/api/save-songs`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                domenica: formatItalianDate(date),
                canti: songs
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Salvataggio fallito');
        }

        showMessage('Canti salvati con successo!', 'success');
        
        // Ricarica i dati aggiornati
        await loadInitialData();
        renderUI();

    } catch (error) {
        console.error('Save error:', error);
        showMessage(`Errore durante il salvataggio: ${error.message}`, 'error');
    } finally {
        showLoading(false);
        DOM.saveBtn.innerHTML = '<i class="fas fa-save"></i> Salva Modifiche';
    }
}

function collectSelectedSongs() {
    const songs = [];
    const selectors = document.querySelectorAll('.song-selector');

    selectors.forEach(selector => {
        const select = selector.querySelector('.song-select');
        const input = selector.querySelector('.song-input');
        const linkInput = selector.querySelector('.song-link-input');

        if (select.value === 'new' && input?.value.trim()) {
            songs.push({
                titolo: input.value.trim(),
                link: linkInput?.value.trim() || ''
            });
        } else if (select.value && select.value !== 'new') {
            songs.push({
                id: select.value,
                titolo: select.options[select.selectedIndex].text
            });
        }
    });

    return songs;
}