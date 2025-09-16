// Script per gestire la visibilità del pulsante
document.addEventListener('DOMContentLoaded', function() {
    const backToTopButton = document.getElementById('backToTop');
    const alfabetoNav = document.querySelector('.alfabeto-nav');
    
    // Funzione per controllare se l'alfabeto-nav è visibile
    function isAlfabetoNavVisible() {
        const rect = alfabetoNav.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
        );
    }
    
    // Funzione per gestire lo scroll
    function handleScroll() {
        if (!isAlfabetoNavVisible()) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    }
    
    // Aggiungi l'event listener per lo scroll
    window.addEventListener('scroll', handleScroll);
    
    // Controlla anche al caricamento iniziale
    handleScroll();
    
    // Funzione per tornare all'inizio
    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});