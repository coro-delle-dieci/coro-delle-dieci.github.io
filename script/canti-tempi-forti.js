async function caricaCantiTempo() {
    try {
        const response = await fetch(sheetUrlNuovi);
        const text = await response.text();
        const json = JSON.parse(text.substring(47).slice(0, -2));

        const rows = json.table.rows;
        const listaCanti = document.getElementById("canti-tempo");
        const sectionTempiForti = document.getElementById("tempi-forti");

        if (!listaCanti || !sectionTempiForti) {
            console.error("Elemento 'canti-tempo' o 'tempi-forti' non trovato");
            return;
        }

        listaCanti.innerHTML = "";
        let haCanti = false;

        // Itera su tutte le righe tranne l'intestazione
        for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            
            // Colonna H (indice 7) = testo del link
            // Colonna I (indice 8) = URL del link
            if (row.c && row.c[7] && row.c[7].v && row.c[8] && row.c[8].v) {
                haCanti = true;
                const testo = row.c[7].v; // Colonna H
                const url = row.c[8].v;   // Colonna I

                const p = document.createElement("p");
                p.classList.add("canto-link");
                
                const link = document.createElement("a");
                link.href = url;
                link.textContent = testo;
                
                p.appendChild(link);
                listaCanti.appendChild(p);
            }
        }

        // Nasconde la sezione se non ci sono canti
        if (!haCanti) {
            sectionTempiForti.style.display = "none";
        } else {
            sectionTempiForti.style.display = "block";
        }

    } catch (error) {
        console.error("Errore nel caricamento dei tempi forti:", error);
        const sectionTempiForti = document.getElementById("tempi-forti");
        if (sectionTempiForti) {
            sectionTempiForti.style.display = "none";
        }
    }
}

async function caricaTempo() {
    try {
        const response = await fetch(sheetUrlNuovi);
        const text = await response.text();
        const json = JSON.parse(text.substring(47).slice(0, -2));

        const rows = json.table.rows;
        
        // La prima riga (indice 0) e colonna H (indice 7)
        if (rows[0] && rows[0].c && rows[0].c[7] && rows[0].c[7].v) {
            const tempo = rows[0].c[7].v;
            const tempoSpan = document.getElementById("tempo");
            if (tempoSpan) {
                tempoSpan.textContent = tempo;
            }
        }

    } catch (error) {
        console.error("Errore nel caricamento del tempo:", error);
    }
}

document.addEventListener("DOMContentLoaded", caricaTempo);
document.addEventListener("DOMContentLoaded", caricaCantiTempo);