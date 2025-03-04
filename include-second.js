document.addEventListener("DOMContentLoaded", function () {
    console.log("Caricamento include-secondjs...");

    Promise.all([
        fetch("../../header-second.html").then(response => response.text()),
        fetch("../../footer.html").then(response => response.text())
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
        "accogli-signore-i-nostri-doni.html": "Accogli Signore i nostri doni",
        "acqua-siamo-noi.html": "Acqua siamo noi",
        "adesso-e-la-pienezza.html": "Adesso è la pienezza",
        "lode-e-gloria-a-te.html": "Lode e gloria a te",
        "lode-e-gloria.html": "Lode e gloria",
        "le-tue-mani.html": "Le tue mani",
        "mi-indicherai.html": "Mi indicherai",
        "musica-di-festa.html": "Musica di festa",
        "nel-tuo-silenzio.html": "Nel tuo silenzio",
        "ogni-mia-parola.html": "Ogni mia parola (Come la pioggia e la neve)",
        "pace-sia-pace-a-voi.html": "Pace sia, pace a voi",
        "pane-del-cielo.html": "Pane del cielo",
        "quale-gioia.html": "Quale gioia",
        "risuscito.html": "Risuscitò",
        "servire-e-regnare.html": "Servire è regnare",
        "ti-lodiamo-e-ti-adoriamo.html": "Ti lodiamo e ti adoriamo",
        "un-cuore-nuovo.html": "Un cuore nuovo",
        "verbum-panis.html": "Verbum panis",
        "vivere-la-vita.html": "Vivere la vita",
        "default": "Coro delle Dieci"
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