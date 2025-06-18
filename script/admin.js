const backendUrl = 'https://coro-backend.onrender.com/api/canti'; // cambia con il tuo vero URL

// Carica i canti esistenti
fetch(backendUrl)
    .then(response => response.json())
    .then(data => {
        document.getElementById('domenica').value = data.domenica;

        const songSelectors = document.getElementById('songSelectors');
        songSelectors.innerHTML = '';

        // Per ogni canto già presente, crea un campo input
        data.canti.forEach((canto, index) => {
            const input = document.createElement('input');
            input.type = 'text';
            input.value = canto;
            input.placeholder = `Canto ${index + 1}`;
            input.classList.add('songInput');
            songSelectors.appendChild(input);
            songSelectors.appendChild(document.createElement('br'));
        });

        // Se ci sono meno di 10 canti, aggiungi input vuoti
        for (let i = data.canti.length; i < 10; i++) {
            const input = document.createElement('input');
            input.type = 'text';
            input.placeholder = `Canto ${i + 1}`;
            input.classList.add('songInput');
            songSelectors.appendChild(input);
            songSelectors.appendChild(document.createElement('br'));
        }
    })
    .catch(error => {
        console.error('Errore nel caricamento dei canti:', error);
        document.getElementById('adminMessage').textContent = 'Errore nel caricamento dei dati.';
    });

// Funzione per salvare i canti
function saveSongs() {
    const domenica = document.getElementById('domenica').value;
    const inputs = document.querySelectorAll('.songInput');
    const canti = [];

    inputs.forEach(input => {
        if (input.value.trim() !== '') {
            canti.push(input.value.trim());
        }
    });

    const data = { domenica, canti };

    fetch(backendUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // Sostituisci "admin" e "password" con le credenziali reali o variabili protette
            'Authorization': 'Basic ' + btoa('admin:password')
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.ok) {
            document.getElementById('adminMessage').textContent = 'Canti aggiornati con successo!';
        } else {
            throw new Error('Errore nell\'aggiornamento');
        }
    })
    .catch(error => {
        console.error('Errore nel salvataggio dei canti:', error);
        document.getElementById('adminMessage').textContent = 'Errore durante il salvataggio.';
    });
}