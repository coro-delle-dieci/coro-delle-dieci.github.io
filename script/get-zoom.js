function applyZoomClass() {
  const zoom = Math.round((window.devicePixelRatio || 1) * 100);

  document.body.classList.remove('zoomed-in');

  if (zoom > 200) {
    document.body.classList.add('zoomed-in');
  }
}

window.addEventListener('DOMContentLoaded', applyZoomClass);

window.addEventListener('resize', applyZoomClass);