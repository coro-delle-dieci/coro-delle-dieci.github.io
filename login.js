const utentiAutorizzati = {
    "anna": "1234",
    "responsabile2": "password456"
};

document.getElementById("login-form").addEventListener("submit", function(event) {
    event.preventDefault();
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    if (utentiAutorizzati[username] && utentiAutorizzati[username] === password) {
        localStorage.setItem("user", username);
        window.location.href = "admin.html";
    } else {
        document.getElementById("login-error").textContent = "Username o password errati!";
    }
});