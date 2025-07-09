// Configurazioni
const CONFIG = {
    API_BASE_URL: 'https://coro-backend.onrender.com',
    MAX_SONGS: 10
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
    currentSongs: { domenica: '', canti: [] },
    availableSongs: []
};

// Inizializzazione
document.addEventListener('DOMContentLoaded', async () => {
    if (!checkAuth()) {
        redirectToLogin();
        return;
    }

    setupEventListeners();
    await loadInitialData();
    renderUI();
});

function setupEventListeners() {
    DOM.logoutBtn.addEventListener('click', logout);
    DOM.saveBtn.addEventListener('click', saveSongs);
}

async function loadInitialData() {
    // Dati mock per test
    AppState.currentSongs = {
        domenica: "24 dicembre 2023",
        canti: ["Alleluia", "Gloria"]
    };
    
    AppState.availableSongs = [
        "Alleluia",
        "Gloria",
        "Agnello di Dio",
        "Canto di Natale"
    ];
    
    await new Promise(resolve => setTimeout(resolve, 500)); // Simula ritardo
}

function renderUI() {
    renderDateInput();
    renderSongSelectors();
}

function renderDateInput() {
    DOM.dateInput.value = AppState.currentSongs.domenica || '';
}

function renderSongSelectors() {
    // Pulisci il container
    DOM.songSelectors.innerHTML = '';

    // Mostra errore se nessun canto disponibile
    if (AppState.availableSongs.length === 0) {
        const errorBox = document.createElement('div');
        errorBox.className = 'message error';
        errorBox.innerHTML = `
            <p><strong>Attenzione:</strong> Nessun canto disponibile</p>
            <p>Verifica che:</p>
            <ul>
                <li>Il backend sia online</li>
                <li>La cartella /canti contenga file HTML</li>
                <li>I nomi dei file siano corretti</li>
            </ul>
        `;
        DOM.songSelectors.appendChild(errorBox);
        return;
    }

    // Crea i selettori per ogni canto
    const songsToShow = AppState.currentSongs.canti.length > 0 
        ? AppState.currentSongs.canti 
        : Array(CONFIG.MAX_SONGS).fill('');

    songsToShow.forEach((song, index) => {
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

    // Input per nuovo canto
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'song-input';
    input.placeholder = 'Inserisci nuovo canto';
    input.value = selectedSong && !AppState.availableSongs.includes(selectedSong) ? selectedSong : '';
    input.style.display = selectedSong && !AppState.availableSongs.includes(selectedSong) ? 'block' : 'none';

    // Event listeners
    select.addEventListener('change', () => {
        input.style.display = select.value === '' ? 'block' : 'none';
        if (select.value !== '') input.value = '';
    });

    // Costruisci il DOM
    wrapper.append(label, select, input);
    return wrapper;
}

// Funzioni di supporto
async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || 'Errore nel server');
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
    return localStorage.getItem('auth') === 'true';
}

function redirectToLogin() {
    window.location.href = 'login.html';
}

function logout() {
    localStorage.removeItem('auth');
    localStorage.removeItem('username');
    redirectToLogin();
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
        showLoading(true);
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

        if (!response.ok) throw new Error('Salvataggio fallito');
        
        showMessage('Canti salvati con successo!', 'success');
        await loadInitialData(); // Ricarica i dati
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
    const selects = document.querySelectorAll('.song-select');
    const inputs = document.querySelectorAll('.song-input');

    selects.forEach((select, index) => {
        if (select.value) {
            songs.push(select.value);
        } else if (inputs[index]?.value.trim()) {
            songs.push(inputs[index].value.trim());
        }
    });

    return songs;
}

function getAuthHeader() {
    const username = localStorage.getItem('username');
    const password = getPasswordForUser(username);
    return 'Basic ' + btoa(`${username}:${password}`);
}