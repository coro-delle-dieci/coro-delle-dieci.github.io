const sheetId = "1NYcf3upDR8YLuPX0dm__T1ArAZLXBIdNRBgzwC5GCa0";  // Sostituisci con l'ID corretto
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

document.addEventListener("DOMContentLoaded", caricaCanti);
