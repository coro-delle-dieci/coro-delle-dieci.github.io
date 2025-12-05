const sheetId = "1NYcf3upDR8YLuPX0dm__T1ArAZLXBIdNRBgzwC5GCa0";
const sheetUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json`;

function formattaDataCompleta(data) {
    const opzioni = { weekday: 'long', day: 'numeric', month: 'long' };
    return new Intl.DateTimeFormat('it-IT', opzioni).format(data);
}

function prossimaDomenica() {
    const oggi = new Date();
    const giorno = oggi.getDay(); // 0 domenica
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
        const dataCell = rows[0].c[2];

        if (!dataCell || !dataCell.v) {
            console.warn("Data non trovata nel foglio.");
            return;
        }

        const dataFoglio = new Date(dataCell.v);
        const oggi = new Date();
        oggi.setHours(0, 0, 0, 0);

        const titoloElem = document.getElementById("titolo-canti");
        const listaCanti = document.getElementById("canti-domenica");

        // Caso 1: data foglio più vecchia di oggi → non mostrare canti
        if (dataFoglio < oggi) {
            titoloElem.textContent = "I canti di " + prossimaDomenica();
            listaCanti.innerHTML = "<p>Nessun canto disponibile per questa settimana.</p>";
            return;
        }

        // Caso 2: data foglio = oggi o successiva → mostrare canti
        const dataFormattata = formattaDataCompleta(dataFoglio);
        titoloElem.textContent = "I canti di " + dataFormattata;

        listaCanti.innerHTML = "";
        let haCanti = false;

        rows.slice(1).forEach(row => {
            const titoloCell = row.c[0];
            const linkCell = row.c[1];
            const indicazioneCell = row.c[2];

            if (!titoloCell || !titoloCell.v) return;

            const titolo = titoloCell.v;
            const link = linkCell?.v || "#";
            const indicazione = indicazioneCell?.v || "";

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