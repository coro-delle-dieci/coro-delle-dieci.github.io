const sheetId = "1NYcf3upDR8YLuPX0dm__T1ArAZLXBIdNRBgzwC5GCa0";  // Sostituisci con il tuo ID corretto
const sheetUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json`;

async function caricaCanti() {
    try {
        const response = await fetch(sheetUrl);
        const text = await response.text();
        const json = JSON.parse(text.substring(47).slice(0, -2));

        let listaCanti = document.querySelector(".container section:nth-of-type(3)");
        listaCanti.innerHTML = "<h3>I canti di questa domenica</h3>";

        json.table.rows.forEach(row => {
            let titolo = row.c[0].v;
            let link = row.c[1] ? row.c[1].v : "#";  // Se il link non c'è, lascia "#"
            let div = document.createElement("div");
            div.classList.add("canto-link");
            div.innerHTML = `<a href="${link}">${titolo}</a>`;
            listaCanti.appendChild(div);
        });
    } catch (error) {
        console.error("Errore nel caricamento dei canti:", error);
    }
}

document.addEventListener("DOMContentLoaded", caricaCanti);