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
    
    // Pulsante per aggiungere nuovi canti
    DOM.songSelectors.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-song-btn')) {
            addNewSongSelector();
        }
        if (e.target.classList.contains('remove-song-btn')) {
            e.target.closest('.song-selector').remove();
            renumberSongSelectors();
        }
    });
}

async function loadInitialData() {
    showLoading(true);
    
    try {
        // Carica canti disponibili
        const songsResponse = await fetch(`${CONFIG.API_BASE_URL}/api/songs`);
        AppState.availableSongs = await songsResponse.json();
        
        // Carica canti correnti
        const currentResponse = await fetch(`${CONFIG.API_BASE_URL}/api/current`);
        
        if (currentResponse.ok) {
            AppState.currentSongs = await currentResponse.json();
        }
        
    } catch (error) {
        console.error('Errore nel caricamento dati:', error);
        showMessage('Errore nel caricamento dei dati', 'error');
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
    
    // Header con pulsante aggiunta
    const header = document.createElement('div');
    header.className = 'songs-header';
    header.innerHTML = `
        <h3><i class="fas fa-list-ol"></i> Canti selezionati:</h3>
        <button class="add-song-btn">
            <i class="fas fa-plus"></i> Aggiungi canto
        </button>
    `;
    DOM.songSelectors.appendChild(header);
    
    // Container canti
    const container = document.createElement('div');
    container.id = 'songs-container';
    DOM.songSelectors.appendChild(container);
    
    // Renderizza i canti esistenti
    AppState.currentSongs.canti.forEach((song, index) => {
        container.appendChild(createSongSelector(song, index));
    });
    
    // Se non ci sono canti, aggiungi un selettore vuoto
    if (AppState.currentSongs.canti.length === 0) {
        addNewSongSelector();
    }
}

function createSongSelector(selectedSong, index) {
    const wrapper = document.createElement('div');
    wrapper.className = 'song-selector';
    wrapper.dataset.index = index;

    // Label
    const label = document.createElement('label');
    label.textContent = `Canto ${index + 1}:`;
    label.htmlFor = `song-${index}`;

    // Select container
    const selectContainer = document.createElement('div');
    selectContainer.className = 'select-container';

    // Select
    const select = document.createElement('select');
    select.id = `song-${index}`;
    select.className = 'song-select';

    // Default option
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = '-- Seleziona un canto --';
    select.appendChild(defaultOption);

    // Available songs
    AppState.availableSongs.forEach(song => {
        const option = document.createElement('option');
        option.value = song.id;
        option.textContent = song.titolo;
        option.selected = song.id === selectedSong?.id;
        select.appendChild(option);
    });

    // Input per nuovo canto
    const inputGroup = document.createElement('div');
    inputGroup.className = 'input-group';
    inputGroup.style.display = 'none';

    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'song-input';
    input.placeholder = 'Titolo del nuovo canto';
    
    const linkInput = document.createElement('input');
    linkInput.type = 'text';
    linkInput.className = 'song-link-input';
    linkInput.placeholder = 'Link al canto (opzionale)';

    inputGroup.append(input, linkInput);

    // Pulsante rimuovi
    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove-song-btn';
    removeBtn.innerHTML = '<i class="fas fa-trash"></i>';
    removeBtn.title = 'Rimuovi canto';

    // Event listeners
    select.addEventListener('change', () => {
        inputGroup.style.display = select.value === '' ? 'flex' : 'none';
        if (select.value !== '') {
            input.value = '';
            linkInput.value = '';
        }
    });

    // Costruisci il DOM
    selectContainer.append(select, removeBtn);
    wrapper.append(label, selectContainer, inputGroup);
    return wrapper;
}

function addNewSongSelector() {
    const container = document.getElementById('songs-container');
    if (!container) return;
    
    const index = container.querySelectorAll('.song-selector').length;
    container.appendChild(createSongSelector(null, index));
    renumberSongSelectors();
}

function renumberSongSelectors() {
    const selectors = document.querySelectorAll('.song-selector');
    selectors.forEach((selector, index) => {
        const label = selector.querySelector('label');
        if (label) label.textContent = `Canto ${index + 1}:`;
    });
}

// Funzioni di supporto
async function fetchData(url, options = {}) {
    try {
        const response = await fetch(url, options);
        
        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Errore nel server');
        }
        
        return await response.json();
    } catch (error) {
        console.error(`Fetch error [${url}]:`, error);
        throw error;
    }
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
    const date = DOM.dateInput.value.trim();
    if (!date) {
        showMessage('Inserisci la data della domenica', 'error');
        return;
    }
    
    if (!isValidDate(date)) {
        showMessage('Formato data non valido (es: 25 dicembre 2023)', 'error');
        return;
    }

    const songs = collectSelectedSongs();
    if (songs.length === 0) {
        showMessage('Inserisci almeno un canto', 'error');
        return;
    }

    try {
        showLoading(true);
        
        const response = await fetch(`${CONFIG.API_BASE_URL}/api/save-songs`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                domenica: date,
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
    }
}

function collectSelectedSongs() {
    const songs = [];
    const selectors = document.querySelectorAll('.song-selector');

    selectors.forEach(selector => {
        const select = selector.querySelector('.song-select');
        const input = selector.querySelector('.song-input');
        const linkInput = selector.querySelector('.song-link-input');

        if (select.value) {
            songs.push({
                id: select.value,
                titolo: select.options[select.selectedIndex].text
            });
        } else if (input?.value.trim()) {
            songs.push({
                titolo: input.value.trim(),
                link: linkInput?.value.trim() || ''
            });
        }
    });

    return songs;
}

function isValidDate(dateString) {
    // Verifica formato "25 dicembre 2023"
    const pattern = /^\d{1,2}\s+[a-z]+\s+\d{4}$/i;
    return pattern.test(dateString);
}