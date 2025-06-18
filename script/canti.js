// Aggiungi questa funzione per generare i link
function generateLink(title) {
    return title.toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[àèéìòù]/g, c => 'aeiouc'['àèéìòù'.indexOf(c)])
        .replace(/[^a-z0-9-]/g, '');
}

// Carica i canti dal backend Python
async function caricaCanti() {
    try {
        const response = await fetch('https://coro-backend.onrender.com/api/canti');
        const data = await response.json();

        let listaCanti = document.getElementById("canti-domenica");
        listaCanti.innerHTML = "";

        data.canti.forEach(titolo => {
            const link = generateLink(titolo);
            const div = document.createElement("div");
            div.innerHTML = `<a href="canti/${link}.html">${titolo}</a>`;
            listaCanti.appendChild(div);
        });

    } catch (error) {
        console.error("Errore:", error);
    }
}

function prossimaDomenica() {
    const oggi = new Date();
    const giornoCorrente = oggi.getDay();
    const giorniDaAggiungere = (7 - giornoCorrente + 0) % 7 || 7; // 0 = domenica
    const domenica = new Date(oggi);
    domenica.setDate(oggi.getDate() + giorniDaAggiungere);

    const opzioni = { day: 'numeric', month: 'long' };
    const formatter = new Intl.DateTimeFormat('it-IT', opzioni);
    return formatter.format(domenica);
}

document.addEventListener("DOMContentLoaded", () => {
    caricaCanti();
    const dataSpan = document.getElementById("data-domenica");
    if (dataSpan) {
        dataSpan.textContent = prossimaDomenica();
    }
});