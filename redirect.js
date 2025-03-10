document.addEventListener("DOMContentLoaded", function () {
    if (window.location.pathname.endsWith("/")) {
        let newPath = window.location.pathname + "index.html";
        window.location.replace(newPath);
    }
});