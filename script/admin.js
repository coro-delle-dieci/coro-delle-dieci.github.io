// admin.js - Gestione Amministrativa Coro delle Dieci

// Configurazioni
const BACKEND_URL = 'https://coro-backend.onrender.com/api/canti';
const MAX_SONGS = 10;

// Elementi UI
let songSelectors = document.getElementById('songSelectors');
let adminMessage = document.getElementById('adminMessage');
let saveButton = document.querySelector('button');

// Inizializzazione
document.addEventListener('DOMContentLoaded', () => {
    // Verifica autenticazione
    if (!isAuthenticated()) {
        redirectToLogin();
        return;
    }

    // Carica i canti
    loadSongs();
    
    // Configura pulsante salva
    if (saveButton) {
        saveButton.addEventListener('click', saveSongs);
    }
});

// Funzioni principali
async function loadSongs() {
    try {
        const response = await fetch(BACKEND_URL);
        
        if (!response.ok) {
            throw new Error(`Errore HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        renderSongInputs(data);
        
    } catch (error) {
        console.error('Errore nel caricamento dei canti:', error);
        showMessage('Errore nel caricamento dei dati.', 'error');
    }
}

async function saveSongs() {
    const domenica = document.getElementById('domenica').value.trim();
    const inputs = document.querySelectorAll('.songInput');
    const canti = Array.from(inputs)
        .map(input => input.value.trim())
        .filter(canto => canto !== '');

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

// Funzioni di supporto
function renderSongInputs(data) {
    if (!songSelectors) return;

    // Pulisci il contenuto
    songSelectors.innerHTML = '';

    // Imposta la data
    document.getElementById('domenica').value = data.domenica || '';

    // Crea input per i canti esistenti
    data.canti.forEach((canto, index) => {
        addSongInput(canto, index);
    });

    // Aggiungi input vuoti fino a MAX_SONGS
    for (let i = data.canti.length; i < MAX_SONGS; i++) {
        addSongInput('', i);
    }
}

function addSongInput(value, index) {
    const container = document.createElement('div');
    container.className = 'song-input-container';

    const label = document.createElement('label');
    label.textContent = `Canto ${index + 1}:`;
    label.htmlFor = `song-${index}`;

    const input = document.createElement('input');
    input.type = 'text';
    input.value = value;
    input.id = `song-${index}`;
    input.className = 'songInput';
    input.placeholder = `Titolo del canto ${index + 1}`;

    container.appendChild(label);
    container.appendChild(input);
    songSelectors.appendChild(container);
}

function isAuthenticated() {
    return localStorage.getItem('auth') === 'true';
}

function redirectToLogin() {
    window.location.href = 'login.html';
}

function getAuthHeader() {
    const username = localStorage.getItem('username');
    // Nota: In un'applicazione reale, non dovresti memorizzare la password nel localStorage
    // Questo è solo per dimostrazione. Una soluzione migliore sarebbe usare sessioni server-side o JWT
    const password = getPasswordForUser(username);
    return 'Basic ' + btoa(`${username}:${password}`);
}

function showMessage(message, type = 'info') {
    if (!adminMessage) return;
    
    adminMessage.textContent = message;
    adminMessage.className = type;
    
    // Nascondi il messaggio dopo 5 secondi
    setTimeout(() => {
        adminMessage.textContent = '';
        adminMessage.className = '';
    }, 5000);
}

// Funzione da implementare in un file separato (credentials.js)
function getPasswordForUser(username) {
    // Questo dovrebbe essere sostituito con una chiamata sicura al server
    // o con una mappatura crittografata lato client
    const userPasswords = {
        'admin1': 'password1',
        'admin2': 'password2',
        'admin3': 'password3'
    };
    return userPasswords[username] || '';
}