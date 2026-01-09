(function() {
  'use strict';

  // Evita duplicati: controlla se esiste già il bottone globale
  if (document.querySelector('.global-wa-cta')) {
    return;
  }

  // Carica e inserisce il contenuto di global-whatsapp-cta.html
  fetch('global-whatsapp-cta.html')
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
      const ctaElement = tempDiv.querySelector('.global-wa-cta');
      if (ctaElement) {
        document.body.appendChild(ctaElement);
      }
    })
    .catch(error => {
      console.warn('Impossibile caricare global-whatsapp-cta.html:', error);
      // Fallback: crea il bottone direttamente se il file non è disponibile
      const waButton = document.createElement('a');
      waButton.href = 'https://wa.me/393513888678?text=Ciao%2C%20vorrei%20un%20preventivo%20per%20il%20noleggio.';
      waButton.className = 'global-wa-cta';
      waButton.target = '_blank';
      waButton.rel = 'noopener noreferrer';
      waButton.innerHTML = '<span>💬</span><span>Richiedi preventivo WhatsApp</span>';
      document.body.appendChild(waButton);
    });
})();






