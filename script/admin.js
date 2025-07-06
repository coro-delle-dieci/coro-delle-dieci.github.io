// admin.js - Gestione Amministrativa Coro delle Dieci con selezione canti

// Configurazioni
const BACKEND_URL = 'https://coro-backend.onrender.com/api/canti';
const SONGS_API_URL = '/api/songs-list'; // Endpoint per la lista dei canti esistenti
const MAX_SONGS = 10;

// Elementi UI
let songSelectors = document.getElementById('songSelectors');
let adminMessage = document.getElementById('adminMessage');
let saveButton = document.querySelector('button');

// Inizializzazione
document.addEventListener('DOMContentLoaded', async () => {
    if (!isAuthenticated()) {
        redirectToLogin();
        return;
    }

    try {
        // Carica sia i canti esistenti che quelli disponibili
        const [currentSongs, availableSongs] = await Promise.all([
            fetch(BACKEND_URL).then(res => res.json()),
            fetch(SONGS_API_URL).then(res => res.json())
        ]);
        
        renderSongSelectors(currentSongs, availableSongs);
        
    } catch (error) {
        console.error('Errore nel caricamento:', error);
        showMessage('Errore nel caricamento dei dati.', 'error');
    }
});

// Funzioni principali
function renderSongSelectors(currentData, availableSongs) {
    if (!songSelectors) return;

    // Pulisci il contenuto
    songSelectors.innerHTML = '';

    // Imposta la data
    document.getElementById('domenica').value = currentData.domenica || '';

    // Crea select per i canti esistenti
    currentData.canti.forEach((canto, index) => {
        addSongSelector(canto, index, availableSongs);
    });

    // Aggiungi select vuote fino a MAX_SONGS
    for (let i = currentData.canti.length; i < MAX_SONGS; i++) {
        addSongSelector('', i, availableSongs);
    }
}

function addSongSelector(selectedSong, index, availableSongs) {
    const container = document.createElement('div');
    container.className = 'song-selector-container';

    const label = document.createElement('label');
    label.textContent = `Canto ${index + 1}:`;
    label.htmlFor = `song-select-${index}`;

    const select = document.createElement('select');
    select.id = `song-select-${index}`;
    select.className = 'songSelect';
    
    // Aggiungi opzione vuota
    const emptyOption = document.createElement('option');
    emptyOption.value = '';
    emptyOption.textContent = '-- Seleziona un canto --';
    select.appendChild(emptyOption);
    
    // Popola con i canti disponibili
    availableSongs.forEach(song => {
        const option = document.createElement('option');
        option.value = song;
        option.textContent = song;
        option.selected = song === selectedSong;
        select.appendChild(option);
    });
    
    // Aggiungi input per nuovo canto
    const newSongInput = document.createElement('input');
    newSongInput.type = 'text';
    newSongInput.placeholder = 'Oppure inserisci nuovo canto';
    newSongInput.className = 'newSongInput';
    newSongInput.style.display = 'none';
    newSongInput.value = selectedSong && !availableSongs.includes(selectedSong) ? selectedSong : '';
    
    // Mostra input se selezionato "altro"
    select.addEventListener('change', function() {
        newSongInput.style.display = this.value === '' ? 'block' : 'none';
    });

    container.appendChild(label);
    container.appendChild(select);
    container.appendChild(newSongInput);
    songSelectors.appendChild(container);
}

async function saveSongs() {
    const domenica = document.getElementById('domenica').value.trim();
    const selects = document.querySelectorAll('.songSelect');
    const inputs = document.querySelectorAll('.newSongInput');
    
    const canti = Array.from(selects).map((select, index) => {
        if (select.value !== '') {
            return select.value;
        } else {
            return inputs[index].value.trim();
        }
    }).filter(canto => canto !== '');

    if (!domenica) {
        showMessage('Inserisci la data della domenica.', 'error');
        return;
    }

    if (canti.length === 0) {
        showMessage('Inserisci almeno un canto.', 'error');
        return;
    }

    const data = { domenica, canti };

    try {
        const response = await fetch(BACKEND_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': getAuthHeader()
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`Errore HTTP: ${response.status}`);
        }

        showMessage('Canti aggiornati con successo!', 'success');
        
    } catch (error) {
        console.error('Errore nel salvataggio:', error);
        showMessage('Errore durante il salvataggio.', 'error');
    }
}

// Funzioni di supporto (rimangono uguali alle precedenti)
function isAuthenticated() {
    return localStorage.getItem('auth') === 'true';
}

function redirectToLogin() {
    window.location.href = 'login.html';
}

function getAuthHeader() {
    const username = localStorage.getItem('username');
    const password = getPasswordForUser(username);
    return 'Basic ' + btoa(`${username}:${password}`);
}

function showMessage(message, type = 'info') {
    if (!adminMessage) return;
    
    adminMessage.textContent = message;
    adminMessage.className = type;
    
    setTimeout(() => {
        adminMessage.textContent = '';
        adminMessage.className = '';
    }, 5000);
}