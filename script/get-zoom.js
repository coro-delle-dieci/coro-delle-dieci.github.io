function applyZoomClass() {
  // Controlla se è un dispositivo mobile
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  // Se è mobile, esci dalla funzione senza fare nulla
  if (isMobile) {
    return;
  }
  
  const zoom = Math.round((window.devicePixelRatio || 1) * 100);

  document.body.classList.remove('zoomed-in');

  if (zoom > 200) {
    document.body.classList.add('zoomed-in');
  }
}

window.addEventListener('DOMContentLoaded', applyZoomClass);
window.addEventListener('resize', applyZoomClass);