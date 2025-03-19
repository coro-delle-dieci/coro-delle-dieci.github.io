const sheetId = "1NYcf3upDR8YLuPX0dm__T1ArAZLXBIdNRBgzwC5GCa0";
const sheetUrl = `https://script.google.com/macros/s/AKfycbyWFoa_JKCfF0duFdQCVva0Q259GHcU19VglFE5iKnEf0zzIhdlbaHF8OrwAEkM7Ko/exec`;

async function caricaCanti() {
    const response = await fetch(`https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json`);
    const text = await response.text();
    const json = JSON.parse(text.substr(47).slice(0, -2));

    let select = document.getElementById("canti-list");
    select.innerHTML = "";

    json.table.rows.forEach(row => {
        let titolo = row.c[0].v;
        let option = document.createElement("option");
        option.value = titolo;
        option.textContent = titolo;
        select.appendChild(option);
    });
}

document.getElementById("salva").addEventListener("click", async function () {
    let titolo = document.getElementById("nuovo-titolo").value;
    let link = document.getElementById("nuovo-link").value;

    if (!titolo || !link) {
        alert("Compila tutti i campi!");
        return;
    }

    let response = await fetch(sheetUrl, {
        method: "POST",
        body: JSON.stringify({ titolo, link }),
        headers: { 
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
        }
    });

    let data = await response.text();
    console.log("Risposta del server:", data);

    if (response.ok) {
        alert("Canto aggiornato con successo!");
        caricaCanti();
    } else {
        alert("Errore nell'aggiornamento!");
    }
});

document.getElementById("logout").addEventListener("click", function () {
    localStorage.removeItem("user");
    window.location.href = "login.html";
});

caricaCanti();