(function() {
  'use strict';

  // Cerca l'H1 principale della pagina prodotto
  const pageTitle = document.querySelector('h1.page-title');
  
  // Se non c'è un H1 con classe page-title, esci
  if (!pageTitle) {
    return;
  }

  // Verifica se esiste già una sezione product-cta subito dopo l'H1
  const existingCta = pageTitle.nextElementSibling;
  const hasProductCta = existingCta && existingCta.classList && existingCta.classList.contains('product-cta');
  
  // Se esiste già una product-cta, verifica se ha già il bottone richiesto
  if (hasProductCta) {
    // Verifica se c'è già un bottone WhatsApp con il link corretto
    const existingButton = existingCta.querySelector('a[href*="wa.me"][href*="attrezzatura"]');
    if (existingButton && existingButton.textContent.includes('Richiedi preventivo WhatsApp')) {
      // Il bottone esiste già con testo e link corretti, esci
      return;
    }
    
    // Verifica se c'è già un bottone WhatsApp (anche con link diverso)
    const existingWhatsAppButtons = existingCta.querySelectorAll('a[href*="wa.me"]');
    if (existingWhatsAppButtons.length > 0) {
      // C'è già un bottone WhatsApp, modifichiamo il primo per avere il testo e link corretti
      const firstButton = existingWhatsAppButtons[0];
      firstButton.href = 'https://wa.me/393513888678?text=Ciao%2C%20vorrei%20un%20preventivo%20per%20il%20noleggio%20di%20questa%20attrezzatura.';
      firstButton.textContent = 'Richiedi preventivo WhatsApp';
      firstButton.className = 'product-cta-button primary';
      return;
    }
    
    // Aggiungi il bottone all'inizio della sezione esistente
    const whatsappButton = document.createElement('a');
    whatsappButton.href = 'https://wa.me/393513888678?text=Ciao%2C%20vorrei%20un%20preventivo%20per%20il%20noleggio%20di%20questa%20attrezzatura.';
    whatsappButton.className = 'product-cta-button primary';
    whatsappButton.target = '_blank';
    whatsappButton.textContent = 'Richiedi preventivo WhatsApp';
    existingCta.insertBefore(whatsappButton, existingCta.firstChild);
    return;
  }

  // Crea la sezione product-cta se non esiste
  const productCta = document.createElement('div');
  productCta.className = 'product-cta';
  
  // Crea il bottone WhatsApp
  const whatsappButton = document.createElement('a');
  whatsappButton.href = 'https://wa.me/393513888678?text=Ciao%2C%20vorrei%20un%20preventivo%20per%20il%20noleggio%20di%20questa%20attrezzatura.';
  whatsappButton.className = 'product-cta-button primary';
  whatsappButton.target = '_blank';
  whatsappButton.textContent = 'Richiedi preventivo WhatsApp';
  
  productCta.appendChild(whatsappButton);
  
  // Inserisci la sezione subito dopo l'H1
  pageTitle.parentNode.insertBefore(productCta, pageTitle.nextSibling);
})();

