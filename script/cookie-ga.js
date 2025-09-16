(function() {
  // Controlla se l'utente ha già scelto
  var consent = localStorage.getItem('cookiesAccepted');
  if (consent === 'true') {
    loadGA();
    document.getElementById('cookie-banner').style.display = 'none';
  } else if (consent === 'false') {
    document.getElementById('cookie-banner').style.display = 'none';
  }

  // Funzione per accettare i cookie
  window.acceptCookies = function() {
    localStorage.setItem('cookiesAccepted', 'true');
    document.getElementById('cookie-banner').style.display = 'none';
    loadGA();
  };

  // Funzione per rifiutare i cookie
  window.rejectCookies = function() {
    localStorage.setItem('cookiesAccepted', 'false');
    document.getElementById('cookie-banner').style.display = 'none';
  };

  // Funzione per caricare Google Analytics
  function loadGA() {
    var gaScript = document.createElement('script');
    gaScript.src = "https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX";
    gaScript.async = true;
    document.head.appendChild(gaScript);

    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXXXX');
  }
})();