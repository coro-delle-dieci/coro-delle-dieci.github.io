const sheetId = "1NYcf3upDR8YLuPX0dm__T1ArAZLXBIdNRBgzwC5GCa0";
const sheetUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json`;

async function caricaCantiNuovi() {
    try {
        const response = await fetch(sheetUrl);
        const text = await response.text();
        const json = JSON.parse(text.substring(47).slice(0, -2));

        const rows = json.table.rows;
        const listaCanti = document.getElementById("canti-nuovi");

        listaCanti.innerHTML = "";
        let haCanti = false;

        rows.slice(1).forEach(row => {
            const titoloCell = row.c[5]; // Colonna F (indice 5)

            if (!titoloCell || !titoloCell.v) return;

            haCanti = true;
            const titolo = titoloCell.v;

            const p = document.createElement("p");
            p.classList.add("canto-link");
            p.textContent = titolo;
            listaCanti.appendChild(p);
        });

        if (!haCanti) {
            listaCanti.innerHTML = "<p>Nessun canto disponibile al momento.</p>";
        }

    } catch (error) {
        console.error("Errore nel caricamento dei canti nuovi:", error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    caricaCantiNuovi();
});