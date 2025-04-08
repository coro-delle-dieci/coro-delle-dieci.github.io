const sheetId = "1NYcf3upDR8YLuPX0dm__T1ArAZLXBIdNRBgzwC5GCa0";
const sheetUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json`;

async function caricaCanti() {
    try {
        const response = await fetch(sheetUrl);
        const text = await response.text();
        const json = JSON.parse(text.substring(47).slice(0, -2));

        let listaCanti = document.getElementById("canti-domenica");
        listaCanti.innerHTML = "";  // Pulisce eventuali contenuti precedenti

        json.table.rows.forEach(row => {
            let titolo = row.c[0].v;
            let link = row.c[1] ? row.c[1].v : "#";
            let div = document.createElement("div");
            div.classList.add("canto-link");
            div.innerHTML = `<a href="${link}" target="_blank">${titolo}</a>`;
            listaCanti.appendChild(div);
        });
    } catch (error) {
        console.error("Errore nel caricamento dei canti:", error);
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