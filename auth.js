const utentiAutorizzati = ["annafic8@gmail.com", "ficotto.2008@gmail.com"];

function onGoogleLogin(response) {
    const user = decodeJwtResponse(response.credential);
    
    if (utentiAutorizzati.includes(user.email)) {
        localStorage.setItem("user", user.email);
        window.location.href = "admin.html";
    } else {
        alert("Non sei autorizzato a modificare i canti!");
    }
}

// **Decodifica il token JWT di Google**
function decodeJwtResponse(token) {
    let base64Url = token.split('.')[1]; 
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

// **Gestione del logout**
document.getElementById("logout").addEventListener("click", function () {
    localStorage.removeItem("user");
    window.location.href = "index.html";
});