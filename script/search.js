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
    
    // Controlla che gli elementi esistano prima di usarli
    if (searchResults && cantiContainer) {
        if (!query.trim()) {
            // Nessuna query, mostra lista normale
            searchResults.innerHTML = '';
            cantiContainer.classList.remove('search-active');
            if (alfabetoNav) alfabetoNav.classList.remove('search-active');
            if (searchInfo) searchInfo.innerHTML = 'Digita per cercare tra i 160 canti';
            return;
        }
    }
    
    const termini = query.toLowerCase().split(' ').filter(term => term.length > 2);
    const risultati = [];
    
    cantiData.forEach(canto => {
        let punteggio = 0;
        
        // Usa categorie se esiste, altrimenti categoria (per compatibilità)
        const categorie = canto.categorie || [canto.categoria || 'Generale'];
        const testoCompleto = (canto.titolo + ' ' + canto.testo + ' ' + categorie.join(' ')).toLowerCase();
        
        // Calcola punteggio di rilevanza
        termini.forEach(termine => {
            if (canto.titolo.toLowerCase().includes(termine)) punteggio += 10;
            if (canto.testo.toLowerCase().includes(termine)) punteggio += 5;
            
            // Cerca nelle categorie
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
    
    // Nascondi lista normale se gli elementi esistono
    if (cantiContainer) cantiContainer.classList.add('search-active');
    if (alfabetoNav) alfabetoNav.classList.add('search-active');
    if (searchInfo) searchInfo.innerHTML = `${risultati.length} canti trovati per "${query}"`;
}

// Mostra risultati della ricerca
function mostraRisultati(risultati, query) {
    const container = document.getElementById('searchResults');
    if (!container) return;
    
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

let searchTimeout;
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                cercaCanti(e.target.value);
            }, 300);
        });
        
        // Ricerca con Enter
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                clearTimeout(searchTimeout);
                cercaCanti(e.target.value);
            }
        });
        
        // Cancella ricerca con ESC
        searchInput.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                this.value = '';
                cercaCanti('');
            }
        });
    }
    
    caricaCanti();
});