// Sistema di ricerca
let cantiData = [];

// Carica i dati dei canti
async function caricaCanti() {
    try {
        const response = await fetch('../canti.json');
        const data = await response.json();
        cantiData = data.canti;
        console.log(`Caricati ${cantiData.length} canti per la ricerca`);
    } catch (error) {
        console.error('Errore nel caricamento canti:', error);
    }
}

// Funzione di ricerca
function cercaCanti(query) {
    const searchResults = document.getElementById('searchResults');
    const cantiContainer = document.getElementById('cantiContainer');
    const alfabetoNav = document.getElementById('alfabetoNav');
    const searchInfo = document.getElementById('searchInfo');
    
    if (!query.trim()) {
        // Nessuna query, mostra lista normale
        searchResults.innerHTML = '';
        cantiContainer.classList.remove('search-active');
        alfabetoNav.classList.remove('search-active');
        searchInfo.innerHTML = 'Digita per cercare tra i 160 canti';
        return;
    }
    
    const termini = query.toLowerCase().split(' ').filter(term => term.length > 0);
    const risultati = [];
    
    cantiData.forEach(canto => {
        let punteggio = 0;
        const categorie = canto.categorie
        const testoCompleto = (canto.titolo + ' ' + canto.testo + ' ' + categorie.join(' ')).toLowerCase();
        
        // Calcola punteggio di rilevanza
        termini.forEach(termine => {
            if (canto.titolo.toLowerCase().includes(termine)) punteggio += 10;
            if (canto.testo.toLowerCase().includes(termine)) punteggio += 5;
            if (categorie.some(cat => cat.toLowerCase().includes(termine))) {
                punteggio += 3;
            }
        });
        
        if (punteggio > 0) {
            risultati.push({ 
                ...canto, 
                punteggio,
                // Mostra TUTTE le categorie
                tutteLeCategorie: categorie.join(', ')
            });
        }
    });
    
    // Ordina per punteggio
    risultati.sort((a, b) => b.punteggio - a.punteggio);
    
    // Mostra risultati
    mostraRisultati(risultati, query);
    
    // Nascondi lista normale
    cantiContainer.classList.add('search-active');
    alfabetoNav.classList.add('search-active');
    searchInfo.innerHTML = `${risultati.length} canti trovati per "${query}"`;
}

// Mostra risultati della ricerca
function mostraRisultati(risultati, query) {
    const container = document.getElementById('searchResults');
    const termini = query.toLowerCase().split(' ').filter(term => term.length > 2);
    
    if (risultati.length === 0) {
        container.innerHTML = '<div class="no-results">Nessun canto trovato. Prova con termini diversi.</div>';
        return;
    }
    
    container.innerHTML = risultati.map(canto => {
        let titoloEvidenziato = canto.titolo;
        termini.forEach(termine => {
            const regex = new RegExp(`(${termine})`, 'gi');
            titoloEvidenziato = titoloEvidenziato.replace(regex, '<span class="highlight">$1</span>');
        });
        
        let anteprima = canto.testo ? (canto.testo.substring(0, 120) + '...') : '';
        if (anteprima) {
            termini.forEach(termine => {
                const regex = new RegExp(`(${termine})`, 'gi');
                anteprima = anteprima.replace(regex, '<span class="highlight">$1</span>');
            });
        }

        // Usa TUTTE le categorie separate da virgola
        const categorieTesto = canto.tutteLeCategorie || 'Altro';
        
        return `
            <div class="search-result-item" onclick="window.location.href='${canto.url}'">
                <div class="search-result-title">${titoloEvidenziato}</div>
                <div class="search-result-preview">${anteprima}</div>
                <span class="search-result-category">${categorieTesto}</span>
            </div>
        `;
    }).join('');
}

// Event listeners per la ricerca
let searchTimeout;
document.getElementById('searchInput').addEventListener('input', function(e) {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        cercaCanti(e.target.value);
    }, 300);
});

// Ricerca con Enter
document.getElementById('searchInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        clearTimeout(searchTimeout);
        cercaCanti(e.target.value);
    }
});

// Cancella ricerca con ESC
document.getElementById('searchInput').addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        this.value = '';
        cercaCanti('');
    }
});

document.addEventListener('DOMContentLoaded', function() {
    caricaCanti();
});