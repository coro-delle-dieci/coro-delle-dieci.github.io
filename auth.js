const utentiAutorizzati = ["annafic8@gmail.com", "ficotto.2008@gmail.com"];

function onGoogleLogin(response) {
    const token = response.credential;
    fetch("https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=" + token)
    .then(res => res.json())
    .then(user => {
        if (utentiAutorizzati.includes(user.email)) {
            localStorage.setItem("user", user.email);
            window.location.href = "admin.html";
        } else {
            alert("Non sei autorizzato a modificare i canti!");
        }
    })
    .catch(error => console.error("Errore:", error));
}

document.getElementById("logout").addEventListener("click", function () {
    localStorage.removeItem("user");
    window.location.href = "index.html";
});