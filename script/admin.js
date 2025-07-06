// Configurazioni
const API_BASE_URL = 'https://coro-backend.onrender.com';
const MAX_SONGS = 10;

// Elementi UI
const elements = {
    songSelectors: document.getElementById('songSelectors'),
    dateInput: document.getElementById('domenica'),
    saveBtn: document.getElementById('saveBtn'),
    message: document.getElementById('adminMessage'),
    logoutBtn: document.getElementById('logout-btn')
};

// Inizializzazione
document.addEventListener('DOMContentLoaded', initAdmin);

async function initAdmin() {
    if (!checkAuth()) {
        redirectToLogin();
        return;
    }

    try {
        elements.logoutBtn.addEventListener('click', logout);
        elements.saveBtn.addEventListener('click', saveSongs);

        const [currentSongs, availableSongs] = await Promise.all([
            fetchData(`${API_BASE_URL}/api/canti`),
            fetchData(`${API_BASE_URL}/api/songs-list`)
        ]);

        renderSongSelectors(currentSongs, availableSongs);
    } catch (error) {
        showMessage('Errore nel caricamento dei dati', 'error');
        console.error('Init error:', error);
    }
}

// Funzioni core
async function fetchData(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
}

function renderSongSelectors(currentData, availableSongs) {
    elements.songSelectors.innerHTML = '';
    elements.dateInput.value = currentData.domenica || '';

    currentData.canti.forEach((song, index) => {
        elements.songSelectors.appendChild(createSongSelector(song, index, availableSongs));
    });

    // Aggiungi selettori vuoti
    for (let i = currentData.canti.length; i < MAX_SONGS; i++) {
        elements.songSelectors.appendChild(createSongSelector('', i, availableSongs));
    }
}

function createSongSelector(selectedSong, index, availableSongs) {
    const wrapper = document.createElement('div');
    wrapper.className = 'song-selector';

    const label = document.createElement('label');
    label.textContent = `Canto ${index + 1}:`;
    label.htmlFor = `song-${index}`;

    const select = document.createElement('select');
    select.id = `song-${index}`;
    select.className = 'song-select';

    // Opzioni dropdown
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = availableSongs.length ? '-- Seleziona --' : '-- Nessun canto --';
    select.appendChild(defaultOption);

    availableSongs.forEach(song => {
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
    input.value = selectedSong && !availableSongs.includes(selectedSong) ? selectedSong : '';
    input.style.display = selectedSong && !availableSongs.includes(selectedSong) ? 'block' : 'none';

    // Event listeners
    select.addEventListener('change', () => {
        input.style.display = select.value === '' ? 'block' : 'none';
        if (select.value !== '') input.value = '';
    });

    wrapper.append(label, select, input);
    return wrapper;
}

// Funzioni autenticazione
function checkAuth() {
    return localStorage.getItem('auth') === 'true';
}

function redirectToLogin() {
    window.location.href = 'login.html';
}

function logout() {
    localStorage.removeItem('auth');
    redirectToLogin();
}

function getAuthHeader() {
    const username = localStorage.getItem('username');
    const password = getPasswordForUser(username);
    return 'Basic ' + btoa(`${username}:${password}`);
}

// Funzioni salvataggio
async function saveSongs() {
    const date = elements.dateInput.value.trim();
    if (!date) {
        showMessage('Inserisci la data della domenica', 'error');
        return;
    }

    const songs = collectSongs();
    if (songs.length === 0) {
        showMessage('Inserisci almeno un canto', 'error');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/canti`, {
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
    } catch (error) {
        showMessage('Errore durante il salvataggio', 'error');
        console.error('Save error:', error);
    }
}

function collectSongs() {
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

// Utilità
function showMessage(text, type = 'info') {
    elements.message.textContent = text;
    elements.message.className = `message ${type}`;
    setTimeout(() => elements.message.textContent = '', 5000);
}