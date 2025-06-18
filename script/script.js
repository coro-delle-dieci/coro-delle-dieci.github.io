fetch('https://nome-backend.onrender.com/api/canti')
  .then(response => response.json())
  .then(data => {
    document.getElementById("domenica").textContent = "Domenica: " + data.domenica;
    document.getElementById("canti").innerHTML = data.canti.map(c => `<li>${c}</li>`).join("");
  });