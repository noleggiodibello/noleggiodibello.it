(function() {
  'use strict';

  // Carica il CSS globale se non è già caricato
  if (!document.querySelector('link[href="global-cta.css"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'global-cta.css';
    document.head.appendChild(link);
  }

  // Cerca il container root per la CTA globale
  const ctaRoot = document.getElementById('global-cta-root');
  
  // Se non esiste il container, esci (fail-safe)
  if (!ctaRoot) {
    return;
  }

  // Evita duplicati: controlla se esiste già contenuto nel container
  if (ctaRoot.querySelector('.global-wa-float')) {
    return;
  }

  // Carica e inserisce il contenuto di global-cta.html
  fetch('global-cta.html')
    .then(response => {
      if (!response.ok) {
        throw new Error('File non trovato');
      }
      return response.text();
    })
    .then(html => {
      // Crea un container temporaneo per il contenuto
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html.trim();
      
      // Inserisci il contenuto nel container root
      const ctaContainer = tempDiv.querySelector('#global-cta-container');
      if (ctaContainer) {
        // Sposta tutti i figli del container nel root
        while (ctaContainer.firstChild) {
          ctaRoot.appendChild(ctaContainer.firstChild);
        }
      }
    })
    .catch(error => {
      console.warn('Impossibile caricare global-cta.html:', error);
      // Fallback: crea il bottone direttamente se il file non è disponibile
      const waButton = document.createElement('a');
      waButton.href = 'https://wa.me/393513888678?text=Ciao%2C%20vorrei%20un%20preventivo%20per%20il%20noleggio.';
      waButton.className = 'global-wa-float';
      waButton.target = '_blank';
      waButton.rel = 'noopener noreferrer';
      waButton.innerHTML = '<span>💬</span><span>WhatsApp Preventivo</span>';
      ctaRoot.appendChild(waButton);
    });
})();
