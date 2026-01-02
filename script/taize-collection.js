// Gestione della raccolta Taizé
document.addEventListener('DOMContentLoaded', function() {
    const taizeSongs = document.querySelectorAll('.taize-song');
    const videoIframeDesktop = document.querySelector('.taize-video-sidebar iframe');
    const videoPlaceholderDesktop = document.querySelector('.taize-video-sidebar .video-placeholder');
    const detailsSection = document.querySelector('.details');
    
    // Dati video per ogni canone
    const videoData = {
        'adoramus-te-domine': 'https://www.youtube-nocookie.com/embed/kOGN__V2Jyw',
        'bless-the-lord': 'https://www.youtube-nocookie.com/embed/3y_2ZStGV58',
        'dona-la-pace': 'https://www.youtube-nocookie.com/embed/PWbi0Fz8_0Q',
        'il-signore-e-la-mia-forza': 'https://www.youtube-nocookie.com/embed/0u920dwDucc',
        'jubilate-servite': 'https://www.youtube-nocookie.com/embed/ri2lolcTu2c',
        'laudate-omnes-gentes': 'https://www.youtube-nocookie.com/embed/nYBfHdbf-6M',
        'magnificat': 'https://www.youtube-nocookie.com/embed/ijHz0HfRt10',
        'misericordias-domini': 'https://www.youtube-nocookie.com/embed/9O0bbMusa3U',
        'nada-te-turbe': 'https://www.youtube-nocookie.com/embed/CfFm72k-6DE',
        'niente-ti-turbi': "https://www.youtube-nocookie.com/embed/989DyIWvRRo",
        'tui-amoris-ignem': 'https://www.youtube-nocookie.com/embed/s1EW-43E_Hk',
        'ubi-caritas': 'https://www.youtube-nocookie.com/embed/MYfyoRi3t8I',
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
            
            // Aggiorna video in base al dispositivo
            if (window.innerWidth > 968) {
                // Desktop: mostra video nella sidebar
                if (videoPlaceholderDesktop) {
                    videoPlaceholderDesktop.style.display = 'none';
                }
                if (videoIframeDesktop) {
                    videoIframeDesktop.style.display = 'block';
                    videoIframeDesktop.src = videoUrl;
                }
            } else {
                // Mobile: nascondi sidebar e mostra video inline
                if (videoPlaceholderDesktop) {
                    videoPlaceholderDesktop.style.display = 'none';
                }
                if (videoIframeDesktop) {
                    videoIframeDesktop.style.display = 'none';
                }
                
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
        if (!activeSong) return;
        
        const songId = activeSong.id;
        const videoUrl = videoData[songId];
        
        if (window.innerWidth <= 968) {
            // Su mobile: nascondi sidebar e gestisci video mobile
            if (videoPlaceholderDesktop) {
                videoPlaceholderDesktop.style.display = 'none';
            }
            if (videoIframeDesktop) {
                videoIframeDesktop.style.display = 'none';
            }
            
            const mobileVideo = activeSong.querySelector('.taize-mobile-video iframe');
            const mobilePlaceholder = activeSong.querySelector('.video-placeholder-mobile');
            if (mobileVideo && videoUrl) {
                mobilePlaceholder.style.display = 'none';
                mobileVideo.style.display = 'block';
                mobileVideo.src = videoUrl;
            }
        } else {
            // Su desktop: mostra sidebar e nascondi video mobile
            if (videoPlaceholderDesktop) {
                videoPlaceholderDesktop.style.display = 'flex';
            }
            if (videoIframeDesktop && videoUrl) {
                videoIframeDesktop.style.display = 'block';
                videoIframeDesktop.src = videoUrl;
            }
            
            const mobileVideo = activeSong.querySelector('.taize-mobile-video iframe');
            const mobilePlaceholder = activeSong.querySelector('.video-placeholder-mobile');
            if (mobileVideo) {
                mobileVideo.style.display = 'none';
                mobileVideo.src = '';
            }
            if (mobilePlaceholder) {
                mobilePlaceholder.style.display = 'flex';
            }
        }
    });
    
    // Inizializzazione
    function initializeLayout() {
        if (window.innerWidth <= 968) {
            // Su mobile: nascondi sidebar
            if (videoPlaceholderDesktop) {
                videoPlaceholderDesktop.style.display = 'none';
            }
            if (videoIframeDesktop) {
                videoIframeDesktop.style.display = 'none';
            }
        }
        
        // Attiva il primo canone di default
        if (taizeSongs.length > 0) {
            taizeSongs[0].click();
        }
    }
    
    initializeLayout();
});