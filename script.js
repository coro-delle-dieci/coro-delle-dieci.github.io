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