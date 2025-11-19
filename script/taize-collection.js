// Gestione della raccolta Taizé
document.addEventListener('DOMContentLoaded', function() {
    const taizeSongs = document.querySelectorAll('.taize-song');
    const videoIframeDesktop = document.querySelector('.taize-video-sidebar iframe');
    const videoPlaceholderDesktop = document.querySelector('.video-placeholder');
    
    // Dati video per ogni canone
    const videoData = {
        'ubi-caritas': 'https://www.youtube.com/embed/MYfyoRi3t8I',
        'magnificat': 'https://www.youtube.com/embed/ijHz0HfRt10',
        'laudate-omnes-gentes': '',
        'veni-sancte-spiritus': '',
        'nada-te-turbe': '',
        'bless-the-lord': ''
    };
    
    // Gestione click sui canoni
    taizeSongs.forEach(song => {
        song.addEventListener('click', function() {
            const songId = this.id;
            const videoUrl = videoData[songId];
            
            if (!videoUrl) return;
            
            // Rimuovi classe active da tutti e nascondi video mobile
            taizeSongs.forEach(s => {
                s.classList.remove('active');
                const mobileVideo = s.querySelector('.taize-mobile-video iframe');
                const mobilePlaceholder = s.querySelector('.video-placeholder-mobile');
                if (mobileVideo) {
                    mobileVideo.style.display = 'none';
                    mobileVideo.src = '';
                }
                if (mobilePlaceholder) {
                    mobilePlaceholder.style.display = 'flex';
                }
            });
            
            // Aggiungi classe active a quello cliccato
            this.classList.add('active');
            
            // Aggiorna video desktop (se visibile)
            if (window.innerWidth > 968) {
                videoPlaceholderDesktop.style.display = 'none';
                videoIframeDesktop.style.display = 'block';
                videoIframeDesktop.src = videoUrl;
            } else {
                // Aggiorna video mobile
                const mobileVideo = this.querySelector('.taize-mobile-video iframe');
                const mobilePlaceholder = this.querySelector('.video-placeholder-mobile');
                if (mobileVideo && mobilePlaceholder) {
                    mobilePlaceholder.style.display = 'none';
                    mobileVideo.style.display = 'block';
                    mobileVideo.src = videoUrl;
                }
            }
        });
    });
    
    // Gestione resize per mantenere la coerenza
    window.addEventListener('resize', function() {
        const activeSong = document.querySelector('.taize-song.active');
        if (activeSong && window.innerWidth <= 968) {
            // Su mobile, assicurati che il video mobile sia visibile
            const mobileVideo = activeSong.querySelector('.taize-mobile-video iframe');
            const mobilePlaceholder = activeSong.querySelector('.video-placeholder-mobile');
            if (mobileVideo && mobileVideo.src) {
                mobilePlaceholder.style.display = 'none';
                mobileVideo.style.display = 'block';
            }
        }
    });
    
    // Attiva il primo canone di default
    if (taizeSongs.length > 0) {
        taizeSongs[0].click();
    }
});