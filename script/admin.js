// Configurazioni
const CONFIG = {
    API_BASE_URL: 'https://coro-backend.onrender.com',
    MAX_SONGS: 10,
    DEBUG_MODE: false
};

// Elementi UI
const DOM = {
    songSelectors: document.getElementById('songSelectors'),
    dateInput: document.getElementById('domenica'),
    saveBtn: document.getElementById('saveBtn'),
    message: document.getElementById('adminMessage'),
    logoutBtn: document.getElementById('logout-btn')
};

// Stato applicazione
const AppState = {
    currentSongs: [],
    availableSongs: [],
    isLoading: false
};

// Inizializzazione
document.addEventListener('DOMContentLoaded', initApp);

async function initApp() {
    if (!checkAuth()) {
        redirectToLogin();
        return;
    }

    setupEventListeners();
    await loadData();
}

function setupEventListeners() {
    DOM.logoutBtn.addEventListener('click', logout);
    DOM.saveBtn.addEventListener('click', saveSongs);
}

async function loadData() {
    try {
        setLoading(true);
        
        const [currentSongs, availableSongs] = await Promise.all([
            fetchData(`${CONFIG.API_BASE_URL}/api/canti`),
            fetchData(`${CONFIG.API_BASE_URL}/api/songs-list`)
        ]);

        AppState.currentSongs = currentSongs;
        AppState.availableSongs = availableSongs.error ? [] : availableSongs;
        
        renderUI();
    } catch (error) {
        console.error('Load data error:', error);
        showMessage('Errore nel caricamento dei dati', 'error');
    } finally {
        setLoading(false);
    }
}

function renderUI() {
    renderDateInput();
    renderSongSelectors();
}

function renderDateInput() {
    if (AppState.currentSongs.domenica) {
        DOM.dateInput.value = AppState.currentSongs.domenica;
    }
}

function renderSongSelectors() {
    DOM.songSelectors.innerHTML = '';
    
    if (AppState.availableSongs.length === 0) {
        showNoSongsWarning();
        return;
    }

    const songsToRender = AppState.currentSongs.canti && AppState.currentSongs.canti.length > 0 
        ? AppState.currentSongs.canti 
        : Array(CONFIG.MAX_SONGS).fill('');

    songsToRender.slice(0, CONFIG.MAX_SONGS).forEach((song, index) => {
        DOM.songSelectors.appendChild(createSongSelector(song, index));
    });
}

function createSongSelector(selectedSong, index) {
    const wrapper = document.createElement('div');
    wrapper.className = 'song-selector';

    // Label
    const label = document.createElement('label');
    label.textContent = `Canto ${index + 1}:`;
    label.htmlFor = `song-${index}`;
    wrapper.appendChild(label);

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
        option.value = song;
        option.textContent = song;
        option.selected = song === selectedSong;
        select.appendChild(option);
    });

    wrapper.appendChild(select);

    // Input
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'song-input';
    input.placeholder = 'Inserisci nuovo canto';
    input.value = selectedSong && !AppState.availableSongs.includes(selectedSong) ? selectedSong : '';
    input.style.display = selectedSong && !AppState.availableSongs.includes(selectedSong) ? 'block' : 'none';

    // Events
    select.addEventListener('change', () => {
        input.style.display = select.value === '' ? 'block' : 'none';
        if (select.value !== '') input.value = '';
    });

    wrapper.appendChild(input);

    return wrapper;
}

function showNoSongsWarning() {
    const warning = document.createElement('div');
    warning.className = 'message warning';
    warning.innerHTML = `
        <p><strong>Attenzione:</strong> Nessun canto trovato nella cartella /canti</p>
        <p>Verifica che:</p>
        <ul>
            <li>La cartella esista sul server</li>
            <li>Contenga file HTML (es: canto-1.html)</li>
            <li>I file abbiano nomi corretti (solo lettere, numeri e trattini)</li>
        </ul>
    `;
    DOM.songSelectors.appendChild(warning);
}

async function saveSongs() {
    const date = DOM.dateInput.value.trim();
    if (!date) {
        showMessage('Inserisci la data della domenica', 'error');
        return;
    }

    const songs = collectSelectedSongs();
    if (songs.length === 0) {
        showMessage('Inserisci almeno un canto', 'error');
        return;
    }

    try {
        setLoading(true);
        
        const response = await fetch(`${CONFIG.API_BASE_URL}/api/canti`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': getAuthHeader()
            },
            body: JSON.stringify({
                domenica: date,
                canti: songs
            })
        });

        if (!response.ok) {
            throw new Error(await response.text());
        }

        showMessage('Canti salvati con successo!', 'success');
        await loadData(); // Ricarica i dati aggiornati
    } catch (error) {
        console.error('Save error:', error);
        showMessage(`Errore durante il salvataggio: ${error.message}`, 'error');
    } finally {
        setLoading(false);
    }
}

function collectSelectedSongs() {
    const songs = [];
    const selects = document.querySelectorAll('.song-select');
    const inputs = document.querySelectorAll('.song-input');

    selects.forEach((select, index) => {
        if (select.value) {
            songs.push(select.value);
        } else if (inputs[index]?.value.trim()) {
            songs.push(inputs[index].value.trim());
        }
    });

    return songs.filter(song => song.trim());
}

// Funzioni di utilità
async function fetchData(url) {
    if (CONFIG.DEBUG_MODE) {
        console.log(`Fetching: ${url}`);
        return mockFetch(url);
    }

    const response = await fetch(url, {
        credentials: 'include',
        headers: {
            'Accept': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
}

function setLoading(isLoading) {
    AppState.isLoading = isLoading;
    DOM.saveBtn.disabled = isLoading;
    if (isLoading) {
        DOM.saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Salvataggio...';
    } else {
        DOM.saveBtn.innerHTML = '<i class="fas fa-save"></i> Salva Modifiche';
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

function checkAuth() {
    const isAuthenticated = localStorage.getItem('auth') === 'true';
    if (!isAuthenticated) {
        console.warn('Utente non autenticato');
    }
    return isAuthenticated;
}

function redirectToLogin() {
    window.location.href = 'login.html';
}

function logout() {
    localStorage.removeItem('auth');
    localStorage.removeItem('username');
    redirectToLogin();
}

function getAuthHeader() {
    const username = localStorage.getItem('username');
    const password = getPasswordForUser(username);
    return 'Basic ' + btoa(`${username}:${password}`);
}

// Funzione mock per debug
function mockFetch(url) {
    console.warn('Modalità debug attiva - usando dati mock');
    
    if (url.includes('/api/canti')) {
        return {
            domenica: "1 gennaio 2023",
            canti: ["Canto di prova 1", "Canto di prova 2"]
        };
    }
    
    if (url.includes('/api/songs-list')) {
        return [
            "Canto di prova 1",
            "Canto di prova 2",
            "Alleluia",
            "Gloria",
            "Agnello di Dio"
        ];
    }
    
    return null;
}