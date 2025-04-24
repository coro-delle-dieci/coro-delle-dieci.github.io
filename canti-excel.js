const sheetId = "1NYcf3upDR8YLuPX0dm__T1ArAZLXBIdNRBgzwC5GCa0";
const sheetUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json`;

async function caricaCanti() {
    const oggi = new Date();
    const giornoCorrente = oggi.getDay(); // 0 = Domenica, 1 = Lunedì, ..., 6 = Sabato

    let listaCanti = document.getElementById("canti-domenica");

    if (giornoCorrente === 1) {
        // Se oggi è lunedì, svuota la lista e non caricare nulla
        if (listaCanti) {
            listaCanti.innerHTML = "<p>I canti sono stati rimossi per il nuovo ciclo settimanale.</p>";
        }
        return;
    }

    try {
        const response = await fetch(sheetUrl);
        const text = await response.text();
        const json = JSON.parse(text.substring(47).slice(0, -2));

        if (listaCanti) {
            listaCanti.innerHTML = "";  // Pulisce eventuali contenuti precedenti

            json.table.rows.forEach(row => {
                const titoloCell = row.c[0];
                const linkCell = row.c[1];

                // Salta righe vuote
                if (!titoloCell || !titoloCell.v) return;

                const titolo = titoloCell.v;
                const link = linkCell && linkCell.v ? linkCell.v : "#";

                const div = document.createElement("div");
                div.classList.add("canto-link");
                div.innerHTML = `<p class="canto-link"><a href="${link}" target="_blank">${titolo}</a></p>`;
                listaCanti.appendChild(div);
            });
        }
    } catch (error) {
        console.error("Errore nel caricamento dei canti:", error);
    }
}

function prossimaDomenica() {
    const oggi = new Date();
    const giornoCorrente = oggi.getDay();
    const giorniDaAggiungere = (7 - giornoCorrente + 0) % 7 || 7;
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