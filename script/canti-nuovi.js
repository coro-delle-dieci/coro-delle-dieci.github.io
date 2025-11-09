const sheetUrlNuovi = `https://docs.google.com/spreadsheets/d/1NYcf3upDR8YLuPX0dm__T1ArAZLXBIdNRBgzwC5GCa0/gviz/tq?tqx=out:json`;

async function caricaCantiNuovi() {
    try {
        const response = await fetch(sheetUrlNuovi);
        const text = await response.text();
        const json = JSON.parse(text.substring(47).slice(0, -2));

        const rows = json.table.rows;
        const listaCanti = document.getElementById("canti-nuovi");
        const sezioneNuovi = document.getElementById("sezione-nuovi-canti");

        if (!listaCanti || !sezioneNuovi) {
            console.error("Elemento 'canti-nuovi' o 'sezione-nuovi-canti' non trovato");
            return;
        }

        listaCanti.innerHTML = "";
        let haCanti = false;

        // Itera su tutte le righe tranne l'intestazione
        for (let i = 1; i < rows.length; i++) {
            const row = rows[i];

            // Colonna E (indice 4) = testo del link
            // Colonna F (indice 5) = URL del link
            if (row.c && row.c[4]?.v && row.c[5]?.v) {
                haCanti = true;
                const testo = row.c[4].v;
                const url = row.c[5].v;

                const p = document.createElement("p");
                p.classList.add("canto-link");

                const link = document.createElement("a");
                link.href = url;
                link.textContent = testo;

                p.appendChild(link);
                listaCanti.appendChild(p);
            }
        }

        // Mostra la sezione solo se ci sono canti
        sezioneNuovi.style.display = haCanti ? "block" : "none";

    } catch (error) {
        console.error("Errore nel caricamento dei canti nuovi:", error);
        const sezioneNuovi = document.getElementById("sezione-nuovi-canti");
        if (sezioneNuovi) sezioneNuovi.style.display = "none";
    }
}

document.addEventListener("DOMContentLoaded", caricaCantiNuovi);