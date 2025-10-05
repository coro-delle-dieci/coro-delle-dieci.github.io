document.addEventListener('DOMContentLoaded', function() {
    const backToTopButton = document.getElementById('backToTop');
    const alfabetoNav = document.querySelector('.alfabeto-nav');
    
    // Funzione per controllare se l'alfabeto-nav è visibile
    function isAlfabetoNavVisible() {
        if (!alfabetoNav) return false;
        const rect = alfabetoNav.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
        );
    }
    
    // Funzione per gestire lo scroll
    function handleScroll() {
        if (window.scrollY === 0) {
            // Se sono proprio in cima → nascondi
            backToTopButton.classList.remove('visible');
        } else if (!isAlfabetoNavVisible()) {
            // Se alfabeto-nav non è visibile → mostra
            backToTopButton.classList.add('visible');
        } else {
            // Altrimenti nascondi
            backToTopButton.classList.remove('visible');
        }
    }
    
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});