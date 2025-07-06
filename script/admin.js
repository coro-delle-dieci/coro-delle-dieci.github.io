// admin.js - Gestione Amministrativa Coro delle Dieci
document.addEventListener('DOMContentLoaded', async () => {
    // Verifica autenticazione
    if (!checkAuth()) {
        redirectToLogin();
        return;
    }

    try {
        // Carica dati iniziali
        const [currentSongs, availableSongs] = await Promise.all([
            fetchCanti(),
            fetchAvailableSongs()
        ]);
        
        // Renderizza l'interfaccia
        renderAdminInterface(currentSongs, availableSongs);
        
        // Aggiungi pulsante logout
        addLogoutButton();
        
    } catch (error) {
        showError('Errore nel caricamento dei dati');
        console.error('Errore inizializzazione:', error);
    }
});

// Funzioni core
async function fetchCanti() {
    const response = await fetch('https://coro-backend.onrender.com/api/canti');
    if (!response.ok) throw new Error('Errore caricamento canti');
    return await response.json();
}

async function fetchAvailableSongs() {
    const response = await fetch('https://coro-backend.onrender.com/api/songs-list');
    if (!response.ok) throw new Error('Errore caricamento lista canti');
    return await response.json();
}

function renderAdminInterface(currentData, availableSongs) {
    // Imposta la data corrente
    const dateInput = document.getElementById('domenica');
    if (dateInput) {
        dateInput.value = currentData.domenica || '';
    }

    // Renderizza i selettori dei canti
    const container = document.getElementById('songSelectors');
    container.innerHTML = '';

    currentData.canti.forEach((song, index) => {
        container.appendChild(createSongSelector(song, index, availableSongs));
    });

    // Aggiungi selettori vuoti fino a 10
    for (let i = currentData.canti.length; i < 10; i++) {
        container.appendChild(createSongSelector('', i, availableSongs));
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
    
    // Opzione vuota
    const emptyOption = document.createElement('option');
    emptyOption.value = '';
    emptyOption.textContent = '-- Seleziona un canto --';
    select.appendChild(emptyOption);
    
    // Popola con canti disponibili
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
    
    // Mostra/nascondi input
    select.addEventListener('change', function() {
        input.style.display = this.value === '' ? 'block' : 'none';
        if (this.value !== '') input.value = '';
    });

    wrapper.appendChild(label);
    wrapper.appendChild(select);
    wrapper.appendChild(input);
    
    return wrapper;
}

// Funzioni di autenticazione
function checkAuth() {
    return localStorage.getItem('auth') === 'true';
}

function redirectToLogin() {
    window.location.href = 'login.html';
}

function addLogoutButton() {
    const header = document.querySelector('header');
    if (!header) return;
    
    const logoutBtn = document.createElement('button');
    logoutBtn.id = 'logout-btn';
    logoutBtn.textContent = 'Logout';
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('auth');
        redirectToLogin();
    });
    
    header.appendChild(logoutBtn);
}

function getAuthHeader() {
    const username = localStorage.getItem('username');
    const password = getPasswordForUser(username); // Da credentials.js
    return 'Basic ' + btoa(`${username}:${password}`);
}

// Funzioni per il salvataggio
document.getElementById('saveBtn')?.addEventListener('click', saveSongs);

async function saveSongs() {
    const dateInput = document.getElementById('domenica');
    if (!dateInput || !dateInput.value.trim()) {
        showError('Inserisci la data della domenica');
        return;
    }

    const songs = collectSelectedSongs();
    if (songs.length === 0) {
        showError('Inserisci almeno un canto');
        return;
    }

    try {
        const response = await fetch('https://coro-backend.onrender.com/api/canti', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': getAuthHeader()
            },
            body: JSON.stringify({
                domenica: dateInput.value.trim(),
                canti: songs
            })
        });

        if (!response.ok) throw new Error('Errore nel salvataggio');
        
        showSuccess('Canti salvati con successo!');
        
    } catch (error) {
        showError('Errore durante il salvataggio');
        console.error('Errore salvataggio:', error);
    }
}

function collectSelectedSongs() {
    const songs = [];
    const selects = document.querySelectorAll('.song-select');
    const inputs = document.querySelectorAll('.song-input');
    
    selects.forEach((select, index) => {
        if (select.value !== '') {
            songs.push(select.value);
        } else if (inputs[index]?.value.trim()) {
            songs.push(inputs[index].value.trim());
        }
    });
    
    return songs;
}

// Funzioni di utilità
function showError(message) {
    const msgElement = document.getElementById('adminMessage');
    if (msgElement) {
        msgElement.textContent = message;
        msgElement.className = 'error';
        setTimeout(() => msgElement.textContent = '', 5000);
    }
}

function showSuccess(message) {
    const msgElement = document.getElementById('adminMessage');
    if (msgElement) {
        msgElement.textContent = message;
        msgElement.className = 'success';
        setTimeout(() => msgElement.textContent = '', 5000);
    }
}