(function() {
  'use strict';

  // CTA WhatsApp Globale
  // Evita duplicazioni: controlla se esiste già un bottone WhatsApp
  if (document.getElementById('whatsapp-cta')) {
    return;
  }

  // Crea il bottone WhatsApp floating
  const whatsappButton = document.createElement('a');
  whatsappButton.id = 'whatsapp-cta';
  whatsappButton.href = 'https://wa.me/393513888678?text=Ciao%2C%20vorrei%20un%20preventivo%20per%20il%20noleggio.';
  whatsappButton.className = 'whatsapp-cta-float';
  whatsappButton.target = '_blank';
  whatsappButton.rel = 'noopener noreferrer';
  whatsappButton.textContent = 'WhatsApp Preventivo';
  
  // Aggiungi il bottone al body
  document.body.appendChild(whatsappButton);
})();

// Gestione globale form Formspree per preventivi escavatori e tutte le schede prodotto
(function() {
  'use strict';

  /**
   * Estrae il nome del modello dall'H1 in modo intelligente
   * Esempio: "Noleggio Escavatore Gommato 10 t – Wacker Neuson EW100" -> "EW100"
   */
  function extractModelFromH1(h1Text) {
    if (!h1Text) return null;
    
    // Cerca pattern comuni: modello alla fine dopo trattino o spazio
    // Pattern: "Wacker Neuson EW100", "Magni BA20ERT", "Palfinger P130A", ecc.
    const patterns = [
      /(?:Wacker Neuson|Magni|Palfinger|AIRO|CMC)\s+([A-Z0-9]+(?:\s+[A-Z0-9]+)?)/i,
      /([A-Z]{2,}\d+[A-Z0-9]*)/, // Pattern generico: lettere maiuscole + numeri
      /([A-Z]\d+[A-Z0-9-]+)/, // Pattern: lettera + numeri + altro
    ];
    
    for (const pattern of patterns) {
      const match = h1Text.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }
    
    return null;
  }

  /**
   * Ottiene il nome della pagina in modo intelligente
   */
  function getPageLabel() {
    // 1. Prova a prendere il modello dal data-modello del bottone WhatsApp (più preciso)
    const whatsappButton = document.querySelector('.js-whatsapp-quote[data-modello]');
    if (whatsappButton) {
      const modello = whatsappButton.getAttribute('data-modello');
      if (modello && modello.trim() && !modello.includes('Richiesta generica')) {
        return modello.trim();
      }
    }
    
    // 2. Prova a estrarre dall'H1
    const h1 = document.querySelector('h1.page-title, h1, .page-title');
    if (h1 && h1.textContent.trim()) {
      const h1Text = h1.textContent.trim();
      
      // Per escavatori e schede prodotto, estrai il modello
      const modello = extractModelFromH1(h1Text);
      if (modello) {
        return modello;
      }
      
      // Altrimenti usa l'H1 completo
      return h1Text;
    }
    
    // 3. Usa il filename senza estensione
    const filename = window.location.pathname.split('/').pop() || '';
    if (filename) {
      const nameWithoutExt = filename.replace(/\.html$/, '');
      // Rimuovi prefissi comuni
      const cleanName = nameWithoutExt
        .replace(/^(wacker-neuson-|magni-|palfinger-|airo-|cmc-)/i, '')
        .replace(/-/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());
      return cleanName || nameWithoutExt;
    }
    
    // 4. Fallback
    return document.title || 'Pagina sconosciuta';
  }

  function initFormspreeForms() {
    const forms = document.querySelectorAll('.preventivo-form');
    
    forms.forEach(function(form) {
      // Imposta automaticamente il valore del campo hidden "Pagina" se non è già impostato
      const paginaInput = form.querySelector('input[name="Pagina"]');
      if (paginaInput && !paginaInput.value) {
        paginaInput.value = getPageLabel();
      }

      form.addEventListener('submit', async function(e) {
        e.preventDefault();
        const formStatus = form.querySelector('.form-status');
        const submitButton = form.querySelector('button[type="submit"]');
        
        if (!formStatus || !submitButton) return;
        
        // Validazione base
        const emailInput = form.querySelector('input[type="email"]');
        const textarea = form.querySelector('textarea');
        
        if (emailInput && !emailInput.value.trim()) {
          formStatus.textContent = '⚠️ Inserisci la tua email';
          formStatus.style.color = '#DC2626';
          emailInput.focus();
          return;
        }
        
        if (textarea && !textarea.value.trim()) {
          formStatus.textContent = '⚠️ Inserisci un messaggio';
          formStatus.style.color = '#DC2626';
          textarea.focus();
          return;
        }
        
        // Disabilita il pulsante durante l'invio
        submitButton.disabled = true;
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Invio in corso...';
        formStatus.textContent = '⏳ Invio in corso...';
        formStatus.style.color = '#666';
        
        // Aggiorna il campo Pagina prima dell'invio (per sicurezza)
        if (paginaInput && (!paginaInput.value || paginaInput.value === '')) {
          paginaInput.value = getPageLabel();
        }
        
        try {
          const formData = new FormData(form);
          const response = await fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: {
              'Accept': 'application/json'
            }
          });
          
          const data = await response.json();
          
          if (response.ok) {
            formStatus.textContent = '✅ Richiesta inviata correttamente';
            formStatus.style.color = '#059669';
            formStatus.style.fontWeight = '600';
            
            // Reset completo del form
            form.reset();
            
            // Scroll al messaggio di successo per visibilità
            formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            
            // Reset del messaggio dopo 5 secondi
            setTimeout(function() {
              if (formStatus.textContent.includes('✅')) {
                formStatus.textContent = '';
                formStatus.style.color = '';
                formStatus.style.fontWeight = '';
              }
            }, 5000);
          } else {
            // Gestione errori più dettagliata
            let errorMessage = '❌ Errore invio, riprova o scrivici su WhatsApp';
            
            if (data.errors && Array.isArray(data.errors)) {
              const firstError = data.errors[0];
              if (firstError && firstError.message) {
                errorMessage = '❌ ' + firstError.message;
              }
            } else if (data.error) {
              errorMessage = '❌ ' + data.error;
            }
            
            formStatus.textContent = errorMessage;
            formStatus.style.color = '#DC2626';
            formStatus.style.fontWeight = '500';
          }
        } catch (error) {
          console.error('Errore invio form:', error);
          formStatus.textContent = '❌ Errore di connessione. Controlla la tua connessione e riprova.';
          formStatus.style.color = '#DC2626';
          formStatus.style.fontWeight = '500';
        } finally {
          submitButton.disabled = false;
          submitButton.textContent = originalText;
        }
      });
    });
  }

  // Inizializza quando il DOM è pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFormspreeForms);
  } else {
    initFormspreeForms();
  }
})();





