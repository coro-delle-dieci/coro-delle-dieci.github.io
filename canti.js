async function caricaCanti() {
    const url = "https://coro-delle-dieci.onrender.com/admin"; // Cambia con il tuo URL Render

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Errore nel caricamento dei dati");

        const dati = await response.json();
        const canti = dati.domenica_successiva;

        const listaCanti = document.getElementById("canti-domenica");
        listaCanti.innerHTML = "";

        // Mostra la data della prossima domenica nel titolo
        const titolo = document.getElementById("titolo-canti");
        titolo.innerText = `I canti di domenica ${prossimaDomenica()}`;

        canti.forEach(canto => {
            const div = document.createElement("div");
            div.classList.add("canto-link");
            div.innerHTML = `<a href="${canto.link}" target="_blank">${canto.titolo}</a>`;
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

document.addEventListener("DOMContentLoaded", caricaCanti);