(function() {
  'use strict';

  // Evita duplicati: controlla se esiste già il container globale
  if (document.getElementById('global-cta-container')) {
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
      
      // Inserisci il contenuto nel body
      const ctaContainer = tempDiv.querySelector('#global-cta-container');
      if (ctaContainer) {
        document.body.appendChild(ctaContainer);
      }
    })
    .catch(error => {
      console.warn('Impossibile caricare global-cta.html:', error);
      // Fallback: crea i bottoni direttamente se il file non è disponibile
      const container = document.createElement('div');
      container.id = 'global-cta-container';
      
      const waButton = document.createElement('a');
      waButton.href = 'https://wa.me/393513888678?text=Ciao%2C%20vorrei%20un%20preventivo%20per%20il%20noleggio.';
      waButton.className = 'global-wa-float';
      waButton.target = '_blank';
      waButton.rel = 'noopener noreferrer';
      waButton.innerHTML = '<span>💬</span><span>WhatsApp Preventivo</span>';
      
      container.appendChild(waButton);
      document.body.appendChild(container);
    });
})();






