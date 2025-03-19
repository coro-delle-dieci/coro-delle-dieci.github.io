const sheetId = "1NYcf3upDR8YLuPX0dm__T1ArAZLXBIdNRBgzwC5GCa0";  
const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json`;

async function caricaCanti() {
    const response = await fetch(url);
    const text = await response.text();
    const json = JSON.parse(text.substr(47).slice(0, -2));

    let lista = document.querySelector(".container section:nth-of-type(3)");
    lista.innerHTML = "<h3>I canti di questa domenica</h3>";

    json.table.rows.forEach(row => {
        let titolo = row.c[0].v;
        let link = row.c[1].v;
        let div = document.createElement("div");
        div.classList.add("canto-link");
        div.innerHTML = `<a href="${link}">${titolo}</a>`;
        lista.appendChild(div);
    });
}

caricaCanti();