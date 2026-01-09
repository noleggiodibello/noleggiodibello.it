/**
 * Global WhatsApp Quote Handler
 * Gestisce i pulsanti "Richiedi preventivo WhatsApp" con messaggio precompilato
 */
(function() {
  'use strict';

  const WHATSAPP_NUMBER = '393513888678';

  /**
   * Genera il messaggio WhatsApp precompilato
   * @param {string} categoria - Categoria macchina (obbligatorio)
   * @param {string} modello - Modello macchina (opzionale)
   * @returns {string} Messaggio formattato
   */
  function generateWhatsAppMessage(categoria, modello) {
    let message = 'Ciao, vorrei un preventivo per il noleggio.\n\n';
    
    // Macchina (obbligatorio)
    message += `Macchina: ${categoria}\n`;
    
    // Modello (solo se presente)
    if (modello && modello.trim()) {
      message += `Modello: ${modello}\n`;
    }
    
    // Campi da compilare
    message += '\n';
    message += 'Data inizio: \n';
    message += 'Data fine: \n';
    message += 'Durata: \n';
    message += 'Note: \n';
    
    return message;
  }

  /**
   * Gestisce il click sui pulsanti WhatsApp
   */
  function handleWhatsAppClick(event) {
    event.preventDefault();
    
    const button = event.currentTarget;
    const categoria = button.getAttribute('data-categoria');
    const modello = button.getAttribute('data-modello') || '';
    
    // Verifica che la categoria sia presente
    if (!categoria || !categoria.trim()) {
      console.error('Errore: data-categoria mancante');
      return;
    }
    
    // Genera il messaggio
    const message = generateWhatsAppMessage(categoria.trim(), modello.trim());
    
    // Codifica il messaggio per URL
    const encodedMessage = encodeURIComponent(message);
    
    // Costruisce l'URL WhatsApp
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    
    // Apre WhatsApp in una nuova finestra
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  }

  /**
   * Inizializza i listener per i pulsanti WhatsApp
   */
  function init() {
    // Trova tutti i pulsanti con classe js-whatsapp-quote
    const buttons = document.querySelectorAll('.js-whatsapp-quote');
    
    // Aggiungi listener a ciascun pulsante
    buttons.forEach(button => {
      button.addEventListener('click', handleWhatsAppClick);
    });
  }

  // Inizializza quando il DOM è pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // DOM già caricato
    init();
  }
})();



