document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const noResults = document.getElementById('noResults');
    const cantoLinks = document.querySelectorAll('.canto-link a');
    const letteraGruppi = document.querySelectorAll('.lettera-gruppo');
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        let hasResults = false;
        
        // Nascondi tutti i risultati prima della ricerca
        noResults.style.display = 'none';
        
        // Controlla ogni gruppo di lettere
        letteraGruppi.forEach(function(gruppo) {
            const lettera = gruppo.id;
            const cantoLinkDiv = gruppo.querySelector('.canto-link');
            const cantiInGruppo = cantoLinkDiv.querySelectorAll('a');
            let gruppoHasResults = false;
            
            // Controlla ogni canto nel gruppo
            cantiInGruppo.forEach(function(canto) {
                const cantoText = canto.textContent.toLowerCase();
                
                if (cantoText.includes(searchTerm)) {
                    canto.parentNode.classList.remove('hidden');
                    gruppoHasResults = true;
                    hasResults = true;
                } else {
                    canto.parentNode.classList.add('hidden');
                }
            });
            
            // Mostra/nascondi il gruppo di lettere in base ai risultati
            if (gruppoHasResults) {
                gruppo.classList.remove('hidden');
                gruppo.querySelector('h3').style.display = 'block';
            } else {
                gruppo.classList.add('hidden');
                gruppo.querySelector('h3').style.display = 'none';
            }
        });
        
        // Mostra messaggio se nessun risultato trovato
        if (!hasResults && searchTerm.length > 0) {
            noResults.style.display = 'block';
        }
    });
    
    // Resetta la ricerca quando si clicca su una lettera nell'alfabeto-nav
    document.querySelectorAll('.alfabeto-nav a').forEach(function(link) {
        link.addEventListener('click', function() {
            searchInput.value = '';
            noResults.style.display = 'none';
            
            letteraGruppi.forEach(function(gruppo) {
                gruppo.classList.remove('hidden');
                gruppo.querySelector('h3').style.display = 'block';
                
                const cantiInGruppo = gruppo.querySelectorAll('.canto-link a');
                cantiInGruppo.forEach(function(canto) {
                    canto.parentNode.classList.remove('hidden');
                });
            });
        });
    });
});