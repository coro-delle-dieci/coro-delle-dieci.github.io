document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("search-input");
    const cantiSections = document.querySelectorAll("section");

    searchInput.addEventListener("input", function () {
        const query = searchInput.value.toLowerCase();
        
        cantiSections.forEach(section => {
            const tags = section.getAttribute("data-tags");
            if (tags && tags.toLowerCase().includes(query)) {
                section.style.display = "block";
            } else {
                section.style.display = "none";
            }
        });
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("search-input");
    const canti = document.querySelectorAll(".canto");

    searchInput.addEventListener("input", function () {
        const query = searchInput.value.toLowerCase();

        canti.forEach(canto => {
            const titolo = canto.querySelector("h2").textContent.toLowerCase();
            const testo = canto.textContent.toLowerCase();
            const tags = canto.getAttribute("data-tags") ? canto.getAttribute("data-tags").toLowerCase() : "";
            
            if (titolo.includes(query) || testo.includes(query) || tags.includes(query)) {
                canto.style.display = "block";
            } else {
                canto.style.display = "none";
            }
        });
    });
});