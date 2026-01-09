/**
 * Global Email Quote Handler
 * Gestisce i pulsanti "Preventivo via Email" con email precompilata
 */
(function() {
  'use strict';

  const EMAIL_ADDRESS = 'noleggiodibello@gmail.com';

  /**
   * Genera il corpo email precompilato
   * @param {string} categoria - Categoria macchina (obbligatorio)
   * @param {string} modello - Modello macchina (opzionale)
   * @returns {string} Corpo email formattato
   */
  function generateEmailBody(categoria, modello) {
    let body = 'Ciao, vorrei un preventivo per il noleggio.\n\n';
    
    // Macchina (obbligatorio)
    body += `Macchina: ${categoria}\n`;
    
    // Modello (solo se presente)
    if (modello && modello.trim()) {
      body += `Modello: ${modello}\n`;
    }
    
    // Campi da compilare
    body += '\n';
    body += 'Data inizio: \n';
    body += 'Data fine: \n';
    body += 'Durata: \n';
    body += 'Note: \n';
    
    return body;
  }

  /**
   * Genera l'oggetto email
   * @param {string} categoria - Categoria macchina
   * @param {string} modello - Modello macchina (opzionale)
   * @returns {string} Oggetto email
   */
  function generateEmailSubject(categoria, modello) {
    let subject = `Preventivo ${categoria}`;
    if (modello && modello.trim()) {
      subject += ` ${modello}`;
    }
    return subject;
  }

  /**
   * Gestisce il click sui pulsanti Email
   */
  function handleEmailClick(event) {
    event.preventDefault();
    
    const link = event.currentTarget;
    const categoria = link.getAttribute('data-categoria');
    const modello = link.getAttribute('data-modello') || '';
    
    // Verifica che la categoria sia presente
    if (!categoria || !categoria.trim()) {
      console.error('Errore: data-categoria mancante');
      return;
    }
    
    // Genera oggetto e corpo email
    const subject = generateEmailSubject(categoria.trim(), modello.trim());
    const body = generateEmailBody(categoria.trim(), modello.trim());
    
    // Codifica per URL
    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(body);
    
    // Costruisce l'URL mailto
    const mailtoUrl = `mailto:${EMAIL_ADDRESS}?subject=${encodedSubject}&body=${encodedBody}`;
    
    // Apre il client email
    window.location.href = mailtoUrl;
  }

  /**
   * Inizializza i listener per i pulsanti Email
   */
  function init() {
    // Trova tutti i link con classe js-email-quote
    const links = document.querySelectorAll('.js-email-quote');
    
    // Aggiungi listener a ciascun link
    links.forEach(link => {
      link.addEventListener('click', handleEmailClick);
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


