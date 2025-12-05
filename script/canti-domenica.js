const sheetId = "1NYcf3upDR8YLuPX0dm__T1ArAZLXBIdNRBgzwC5GCa0";
const sheetUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json`;

function formattaDataCompleta(data) {
    const opzioni = { weekday: 'long', day: 'numeric', month: 'long' };
    return new Intl.DateTimeFormat('it-IT', opzioni).format(data);
}

function prossimaDomenica() {
    const oggi = new Date();
    const giorno = oggi.getDay();
    const diff = (7 - giorno) % 7;
    const domenica = new Date(oggi);
    domenica.setDate(oggi.getDate() + diff);

    const opzioni = { day: 'numeric', month: 'long' };
    return "domenica " + new Intl.DateTimeFormat('it-IT', opzioni).format(domenica);
}

async function caricaCanti() {
    try {
        const response = await fetch(sheetUrl);
        const text = await response.text();

        const json = JSON.parse(text.substring(47).slice(0, -2));

        const rows = json.table.rows;

        if (!rows || rows.length === 0) {
            console.error("Il foglio è vuoto.");
            return;
        }

        // La data è nella prima riga, colonna C (indice 2)
        const riga0 = rows[0];
        
        if (!riga0 || !riga0.c) {
            console.error("La riga 0 non esiste o è vuota");
            return;
        }

        const dataCell = riga0.c[2]; // Colonna C
        if (!dataCell || !dataCell.v) {
            console.error("La cella della data è vuota:", dataCell);
            return;
        }

        const dataFoglio = new Date(dataCell.v);
        const oggi = new Date();
        oggi.setHours(0, 0, 0, 0);

        const titoloElem = document.getElementById("data");
        const listaCanti = document.getElementById("canti-domenica");

        // CASO 1: data vecchia → NO canti
        if (dataFoglio < oggi) {
            titoloElem.textContent = prossimaDomenica();
            listaCanti.innerHTML = "<p>Nessun canto disponibile per questa settimana.</p>";
            return;
        }

        // CASO 2: data valida → mostrare canti
        titoloElem.textContent = formattaDataCompleta(dataFoglio);

        listaCanti.innerHTML = "";
        let haCanti = false;

        // Scorre tutte le righe tranne la prima
        rows.slice(1).forEach(row => {
            if (!row.c || row.c.length < 3) return;

            const titoloCell = row.c[0];      // Colonna A
            const linkCell = row.c[1];        // Colonna B
            const indicazioneCell = row.c[2]; // Colonna C

            // Salta le righe dove il titolo è vuoto
            if (!titoloCell || !titoloCell.v || titoloCell.v.trim() === "") {
                return;
            }

            // Filtra le righe che sembrano URL o istruzioni, non titoli di canti
            const titolo = titoloCell.v.trim();
            if (titolo.startsWith("http") || titolo.toLowerCase().includes("inserire")) {
                return;
            }

            const link = linkCell?.v || "#";
            const indicazione = indicazioneCell?.v || "";

            // Salta le righe dove l'indicazione è vuota (non sono canti)
            if (!indicazione || indicazione.trim() === "") {
                return;
            }

            haCanti = true;

            const p = document.createElement("p");
            p.classList.add("canto-link");
            p.innerHTML = `
                <a href="${link}">
                    ${indicazione ? `<b>${indicazione}:</b> ` : ""}${titolo}
                </a>
            `;
            listaCanti.appendChild(p);
        });

        if (!haCanti) {
            listaCanti.innerHTML = "<p>Nessun canto disponibile al momento.</p>";
        }

    } catch (error) {
        console.error("Errore nel caricamento dei canti:", error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    caricaCanti();
});