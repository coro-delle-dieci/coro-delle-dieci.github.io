async function caricaCanti() {
    try {
        const res = await fetch("https://coro-delle-dieci.onrender.com/api/canti");
        const dati = await res.json();
        const container = document.getElementById("canti-domenica");
        const titolo = document.querySelector("h3");

        titolo.textContent = "I canti di " + dati.domenica;
        container.innerHTML = "";

        dati.data.forEach(canto => {
            let div = document.createElement("div");
            div.innerHTML = `<a href="${canto.link}" target="_blank">${canto.titolo}</a>`;
            container.appendChild(div);
        });
    } catch (e) {
        console.error("Errore nel caricamento dei canti:", e);
    }
}

document.addEventListener("DOMContentLoaded", caricaCanti);