fetch("https://script.google.com/macros/s/AKfycbzv44Agy-nzo-d4vxYzVuLyer_ZTZ8Jr8xus-2IO5qUes49uxfQrKQDkXNtdN-9ME1o-w/exec")
    .then(response => response.text())
    .then(data => {
        console.log("Numero di visite totali:", data);
    })
    .catch(error => {
        console.error("Errore nel recupero del contatore:", error);
    });