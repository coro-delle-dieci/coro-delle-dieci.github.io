const sheetUrlNuovi = `https://docs.google.com/spreadsheets/d/1NYcf3upDR8YLuPX0dm__T1ArAZLXBIdNRBgzwC5GCa0/gviz/tq?tqx=out:json`;

async function caricaCantiNuovi() {
    try {
        const response = await fetch(sheetUrlNuovi);
        const text = await response.text();
        const json = JSON.parse(text.substring(47).slice(0, -2));

        const rows = json.table.rows;
        const listaCanti = document.getElementById("canti-nuovi");

        if (!listaCanti) {
            console.error("Elemento 'canti-nuovi' non trovato");
            return;
        }

        listaCanti.innerHTML = "";
        let haCanti = false;

        // Itera su tutte le righe tranne l'intestazione
        for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            
            // Colonna E (indice 4) = testo del link
            // Colonna F (indice 5) = URL del link
            if (row.c && row.c[4] && row.c[4].v && row.c[5] && row.c[5].v) {
                haCanti = true;
                const testo = row.c[4].v; // Colonna E
                const url = row.c[5].v;   // Colonna F

                const p = document.createElement("p");
                p.classList.add("canto-link");
                
                const link = document.createElement("a");
                link.href = url;
                link.textContent = testo;
                
                p.appendChild(link);
                listaCanti.appendChild(p);
            }
        }

        if (!haCanti) {
            listaCanti.innerHTML = "<p>Nessun canto disponibile al momento.</p>";
        }

    } catch (error) {
        console.error("Errore nel caricamento dei canti nuovi:", error);
        const listaCanti = document.getElementById("canti-nuovi");
        if (listaCanti) {
            listaCanti.innerHTML = "<p>Errore nel caricamento dei canti.</p>";
        }
    }
}

document.addEventListener("DOMContentLoaded", caricaCantiNuovi);