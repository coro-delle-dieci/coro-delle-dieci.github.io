const sheetUrlTempi = `https://docs.google.com/spreadsheets/d/1NYcf3upDR8YLuPX0dm__T1ArAZLXBIdNRBgzwC5GCa0/gviz/tq?tqx=out:json`;

async function caricaCantiTempo() {
    try {
        const response = await fetch(sheetUrlTempi);
        const text = await response.text();
        const json = JSON.parse(text.substring(47).slice(0, -2));
        const rows = json.table.rows;
        
        const listaCanti = document.getElementById("canti-tempo");
        if (!listaCanti) {
            console.error("Elemento 'canti-tempo' non trovato");
            return;
        }

        listaCanti.innerHTML = "";
        let haCanti = false;

        // Itera su tutte le righe tranne l'intestazione
        for (let i = 1; i < rows.length; i++) {
            const row = rows[i];

            // Colonna H (indice 7) = testo del link
            // Colonna I (indice 8) = URL del link
            if (row.c && row.c[7]?.v && row.c[8]?.v) {
                haCanti = true;
                const testo = row.c[7].v;
                const url = row.c[8].v;

                const p = document.createElement("p");
                const link = document.createElement("a");
                link.href = url;
                link.textContent = testo;
                p.appendChild(link);
                listaCanti.appendChild(p);
            }
        }

        // Se non ci sono canti, mostra un messaggio
        if (!haCanti) {
            listaCanti.innerHTML = "<p>Nessun canto disponibile per questo tempo liturgico.</p>";
        }

    } catch (error) {
        console.error("Errore nel caricamento dei tempi forti:", error);
        const listaCanti = document.getElementById("canti-tempo");
        if (listaCanti) {
            listaCanti.innerHTML = "<p>Errore nel caricamento dei canti.</p>";
        }
    }
}

async function caricaTempo() {
    try {
        const response = await fetch(sheetUrlTempi);
        const text = await response.text();
        const json = JSON.parse(text.substring(47).slice(0, -2));
        const rows = json.table.rows;

        const tempoSpan = document.getElementById("tempo");
        if (!tempoSpan) {
            console.error("Elemento 'tempo' non trovato");
            return;
        }

        if (rows[0]?.c[7]?.v) {
            const tempo = rows[0].c[7].v;
            tempoSpan.textContent = tempo;
        } else {
            tempoSpan.textContent = "Tempo liturgico";
        }

    } catch (error) {
        console.error("Errore nel caricamento del tempo:", error);
        const tempoSpan = document.getElementById("tempo");
        if (tempoSpan) {
            tempoSpan.textContent = "Tempo liturgico";
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    caricaTempo();
    caricaCantiTempo();
});