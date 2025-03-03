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
        "adesso-e-la-pienezza": "Adesso è la pienezza",
        "lode-e-gloria-a-te": "Lode e gloria a te",
        "lode-e-gloria": "Lode e gloria",
        "quale-gioia": "Quale gioia",
        "risuscito": "Risuscitò",
        "servire-e-regnare": "Servire è regnare",
        "ti-lodiamo-e-ti-adoriamo": "Ti lodiamo e ti adoriamo",
        "un-cuore-nuovo": "Un cuore nuovo",
        "verbum-panis": "Verbum panis",
        "vivere-la-vita": "Vivere la vita",
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