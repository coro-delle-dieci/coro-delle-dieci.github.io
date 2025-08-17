const sheetId = "1NYcf3upDR8YLuPX0dm__T1ArAZLXBIdNRBgzwC5GCa0";
const sheetUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json`;

function getLastMonday() {
    const oggi = new Date();
    const giorno = oggi.getDay(); // 0 = Domenica, 1 = Lunedì, ..., 6 = Sabato
    const diff = (giorno + 6) % 7;
    const lunedi = new Date(oggi);
    lunedi.setDate(oggi.getDate() - diff);
    lunedi.setHours(0, 0, 0, 0);
    return lunedi;
}

async function caricaCanti() {
    try {
        const response = await fetch(sheetUrl);
        const text = await response.text();
        const json = JSON.parse(text.substring(47).slice(0, -2));

        const rows = json.table.rows;
        const ultimaDataCell = rows[0].c[2]; // la data si trova nella terza colonna della prima riga

        if (!ultimaDataCell || !ultimaDataCell.v) {
            console.warn("Data di aggiornamento non trovata.");
            return;
        }

        const dataAggiornamento = new Date(ultimaDataCell.v);
        const ultimoLunedi = getLastMonday();

        const listaCanti = document.getElementById("canti-domenica");

        if (dataAggiornamento <= ultimoLunedi) {
            listaCanti.innerHTML = "<p>Nessun canto disponibile per questa settimana.</p>";
            return;
        }

        // Se è aggiornato, continua a mostrare i canti
        listaCanti.innerHTML = "";
        let haCanti = false; // flag per verificare se ci sono canti

        rows.slice(1).forEach(row => { // Salta la riga 0 che contiene la data
            const titoloCell = row.c[0];
            const linkCell = row.c[1];
            const contenutoCell = row.c[2]; // Colonna C

            if (!titoloCell || !titoloCell.v) return;

            haCanti = true; // trovato almeno un canto
            const titolo = titoloCell.v;
            const link = linkCell && linkCell.v ? linkCell.v : "#";
            const contenuto = contenutoCell && contenutoCell.v ? contenutoCell.v : "";

            const div = document.createElement("div");
            div.classList.add("canto-link");
            div.innerHTML = `
                <p class="canto-link">
                    <a href="${link}" target="_blank">
                        ${contenuto ? `${contenuto}: ` : ''}${titolo}
                    </a>
                </p>
            `;
            listaCanti.appendChild(div);
        });

        // Se non ha trovato canti, mostra messaggio
        if (!haCanti) {
            listaCanti.innerHTML = "<p>Nessun canto disponibile al momento.</p>";
        }

    } catch (error) {
        console.error("Errore nel caricamento dei canti:", error);
    }
}

function prossimaDomenica() {
    const oggi = new Date();
    const giornoCorrente = oggi.getDay(); // 0 = Domenica, 1 = Lunedì, ..., 6 = Sabato
    const giorniDaAggiungere = (7 - giornoCorrente) % 7;
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