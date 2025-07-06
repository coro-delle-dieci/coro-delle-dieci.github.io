const API_URL = 'https://coro-backend.onrender.com/api';
let availableSongs = [];

document.addEventListener('DOMContentLoaded', async () => {
    if (!localStorage.getItem('auth')) {
        alert('Effettua il login prima');
        window.location.href = 'login.html';
        return;
    }

    try {
        // Carica dati iniziali
        const [current, songs] = await Promise.all([
            fetchData(`${API_URL}/canti`),
            fetchData(`${API_URL}/songs-list`)
        ]);
        
        availableSongs = songs.error ? [] : songs;
        renderInterface(current.error ? {} : current);
        
    } catch (error) {
        showMessage('Errore di connessione', 'error');
    }
});

// Funzioni core
async function fetchData(url) {
    try {
        const res = await fetch(url);
        return await res.json();
    } catch (error) {
        return { error: 'Network error' };
    }
}

function renderInterface(data) {
    document.getElementById('date').value = data.domenica || '';
    
    const container = document.getElementById('songs-container');
    container.innerHTML = '';
    
    const songs = data.canti || [];
    const maxSongs = Math.max(songs.length, 5);
    
    for (let i = 0; i < maxSongs; i++) {
        const row = document.createElement('div');
        row.className = 'song-row';
        
        row.innerHTML = `
            <span>Canto ${i+1}:</span>
            <select id="song-${i}">
                <option value="">-- Seleziona --</option>
                ${availableSongs.map(s => 
                    `<option value="${s}" ${s === songs[i] ? 'selected' : ''}>${s}</option>`
                ).join('')}
            </select>
            <input type="text" id="custom-${i}" placeholder="Nuovo canto" 
                   value="${songs[i] && !availableSongs.includes(songs[i]) ? songs[i] : ''}"
                   style="${songs[i] && !availableSongs.includes(songs[i]) ? '' : 'display:none'}">
        `;
        
        container.appendChild(row);
        
        // Gestione cambio selezione
        document.getElementById(`song-${i}`).addEventListener('change', function() {
            const input = document.getElementById(`custom-${i}`);
            input.style.display = this.value ? 'none' : 'block';
            if (this.value) input.value = '';
        });
    }
    
    document.getElementById('save').onclick = saveData;
}

async function saveData() {
    const date = document.getElementById('date').value.trim();
    if (!date) {
        showMessage('Inserisci la data', 'error');
        return;
    }

    const songs = [];
    const rows = document.querySelectorAll('.song-row');
    
    rows.forEach((_, i) => {
        const select = document.getElementById(`song-${i}`);
        const input = document.getElementById(`custom-${i}`);
        
        if (select.value) {
            songs.push(select.value);
        } else if (input.value.trim()) {
            songs.push(input.value.trim());
        }
    });
    
    if (songs.length === 0) {
        showMessage('Inserisci almeno un canto', 'error');
        return;
    }

    try {
        const res = await fetch(`${API_URL}/canti`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + btoa('admin:password') // Sostituisci
            },
            body: JSON.stringify({
                domenica: date,
                canti: songs
            })
        });
        
        const result = await res.json();
        showMessage(result.error || 'Salvato con successo!', result.error ? 'error' : 'success');
    } catch (error) {
        showMessage('Errore nel salvataggio', 'error');
    }
}

function showMessage(text, type) {
    const msg = document.getElementById('message');
    msg.textContent = text;
    msg.className = type;
    setTimeout(() => msg.textContent = '', 3000);
}