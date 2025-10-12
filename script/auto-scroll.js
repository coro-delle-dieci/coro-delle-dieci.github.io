document.addEventListener('DOMContentLoaded', function() {
    const autoScrollBtn = document.getElementById('autoScrollBtn');
    
    if (!autoScrollBtn) {
        console.error('Auto scroll button not found');
        return;
    }

    const speedText = autoScrollBtn.querySelector('.scroll-speed');
    const scrollIcon = autoScrollBtn.querySelector('.scroll-icon');
    
    let scrollInterval = null;
    let currentSpeed = 0;
    let isAutoScrolling = false;
    
    // MODIFICARE QUESTI VALORI PER CAMBIARE LE VELOCITÀ
    const speedValues = [0, 0.22, 0.40, 0.70];
    
    function startScrolling() {
        stopScrolling();
        
        if (currentSpeed > 0) {
            console.log('Starting auto-scroll with speed:', currentSpeed);
            isAutoScrolling = true;
            
            scrollInterval = setInterval(() => {
                const scrollAmount = speedValues[currentSpeed];
                
                window.scrollBy({
                    top: scrollAmount,
                    behavior: 'auto'
                });
                
                const isAtBottom = (window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 10;
                
                if (isAtBottom) {
                    console.log('Reached bottom, stopping scroll');
                    stopScrolling();
                    resetSpeed();
                }
            }, 32);
            
            autoScrollBtn.classList.add('active');
        } else {
            autoScrollBtn.classList.remove('active');
        }
    }
    
    function stopScrolling() {
        if (scrollInterval) {
            clearInterval(scrollInterval);
            scrollInterval = null;
        }
        isAutoScrolling = false;
        autoScrollBtn.classList.remove('active');
    }
    
    function resetSpeed() {
        currentSpeed = 0;
        updateButtonText();
        stopScrolling();
    }
    
    function updateButtonText() {
        speedText.textContent = currentSpeed === 0 ? 'OFF' : currentSpeed + 'x';
    }
    
    function cycleSpeed() {
        currentSpeed = (currentSpeed + 1) % 4;
        console.log('Speed changed to:', currentSpeed);
        updateButtonText();
        startScrolling();
    }
    
    autoScrollBtn.addEventListener('click', cycleSpeed);
    
    function handleUserScroll() {
        if (isAutoScrolling) {
            console.log('User interrupted auto-scroll');
            stopScrolling();
            resetSpeed();
        }
    }
    
    window.addEventListener('wheel', handleUserScroll, { passive: true });
    window.addEventListener('touchmove', handleUserScroll, { passive: true });
    
    window.addEventListener('keydown', (e) => {
        if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', ' '].includes(e.key)) {
            handleUserScroll();
        }
    });
    
    let lastScrollTop = window.scrollY;
    function checkManualScroll() {
        const scrollTop = window.scrollY;
        if (Math.abs(scrollTop - lastScrollTop) > 5 && !isAutoScrolling) {
            handleUserScroll();
        }
        lastScrollTop = scrollTop;
    }
    
    window.addEventListener('scroll', checkManualScroll, { passive: true });
    
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.attributeName === 'class') {
                if (!document.body.classList.contains('zoomed-in')) {
                    console.log('Zoom mode exited, resetting scroll');
                    resetSpeed();
                }
            }
        });
    });
    
    observer.observe(document.body, {
        attributes: true
    });
    
    console.log('Auto-scroll script loaded successfully');
});