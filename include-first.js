document.addEventListener("DOMContentLoaded", function () {
    console.log("Caricamento include-first.js...");

    Promise.all([
        fetch("../header-first.html").then(response => response.text()),
        fetch("../footer.html").then(response => response.text())
    ]).then(([header, footer]) => {
        document.body.insertAdjacentHTML("afterbegin", header);
        document.body.insertAdjacentHTML("beforeend", footer);
        console.log("Header e Footer caricati.");
        setTimeout(updatePageTitle, 100);
    }).catch(error => console.error("Errore nel caricamento dell'header o del footer:", error));
});

function updatePageTitle() {
    console.log("Esecuzione updatePageTitle...");

    const pageTitles = {
        "index.html": "Coro delle Dieci",
        "canti.html": "Elenco Canti",
        "calendario.html": "Calendario degli appuntamenti",
        "contatti.html": "Contatti",
        "default": "Coro delle 10"
    };

    let currentPage = window.location.pathname.split("/").pop();
    let pageTitle = pageTitles[currentPage] || pageTitles["default"];

    let titleElement = document.getElementById("page-title");
    if (titleElement) {
        titleElement.textContent = pageTitle;
        console.log("Titolo aggiornato:", pageTitle);
    } else {
        console.error("Elemento con id 'page-title' non trovato! Ritentando...");
        setTimeout(updatePageTitle, 100);
    }
}