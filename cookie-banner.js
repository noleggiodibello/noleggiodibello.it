(function() {
  'use strict';

  // Controlla se il consenso è già stato dato
  function hasConsent() {
    return localStorage.getItem('cookieConsent') !== null;
  }

  // Salva il consenso
  function saveConsent(accepted) {
    localStorage.setItem('cookieConsent', accepted ? 'accepted' : 'rejected');
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
  }

  // Crea il banner cookie
  function createCookieBanner() {
    // Crea il contenitore del banner
    const banner = document.createElement('div');
    banner.id = 'cookie-banner';
    banner.style.cssText = `
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: #ffffff;
      border-top: 2px solid #DC2626;
      box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.15);
      padding: 20px;
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 20px;
      max-width: 1400px;
      margin: 0 auto;
    `;

    // Contenuto del banner
    const content = document.createElement('div');
    content.style.cssText = `
      flex: 1;
      min-width: 250px;
    `;

    const text = document.createElement('p');
    text.style.cssText = `
      margin: 0;
      color: #1a1a1a;
      font-size: 0.95rem;
      line-height: 1.6;
    `;
    text.innerHTML = 'Questo sito utilizza <strong>esclusivamente cookie tecnici</strong> necessari per il corretto funzionamento. Per maggiori informazioni, consulta la nostra ';
    
    const privacyLink = document.createElement('a');
    privacyLink.href = 'privacy-policy.html';
    privacyLink.textContent = 'Privacy Policy';
    privacyLink.style.cssText = 'color: #DC2626; text-decoration: underline;';
    
    text.appendChild(privacyLink);
    text.appendChild(document.createTextNode(' e la '));
    
    const cookieLink = document.createElement('a');
    cookieLink.href = 'cookie-policy.html';
    cookieLink.textContent = 'Cookie Policy';
    cookieLink.style.cssText = 'color: #DC2626; text-decoration: underline;';
    
    text.appendChild(cookieLink);
    text.appendChild(document.createTextNode('.'));

    content.appendChild(text);
    banner.appendChild(content);

    // Contenitore pulsanti
    const buttonsContainer = document.createElement('div');
    buttonsContainer.style.cssText = `
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    `;

    // Pulsante Rifiuta
    const rejectButton = document.createElement('button');
    rejectButton.textContent = 'Rifiuta';
    rejectButton.style.cssText = `
      background: transparent;
      color: #1a1a1a;
      border: 1.5px solid #1a1a1a;
      padding: 10px 24px;
      border-radius: 8px;
      font-size: 0.95rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    `;
    rejectButton.addEventListener('mouseenter', function() {
      this.style.background = '#f5f5f5';
    });
    rejectButton.addEventListener('mouseleave', function() {
      this.style.background = 'transparent';
    });
    rejectButton.addEventListener('click', function() {
      saveConsent(false);
      hideBanner();
    });

    // Pulsante Accetta
    const acceptButton = document.createElement('button');
    acceptButton.textContent = 'Accetta';
    acceptButton.style.cssText = `
      background: #DC2626;
      color: white;
      border: none;
      padding: 10px 24px;
      border-radius: 8px;
      font-size: 0.95rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    `;
    acceptButton.addEventListener('mouseenter', function() {
      this.style.background = '#b91c1c';
    });
    acceptButton.addEventListener('mouseleave', function() {
      this.style.background = '#DC2626';
    });
    acceptButton.addEventListener('click', function() {
      saveConsent(true);
      hideBanner();
    });

    buttonsContainer.appendChild(rejectButton);
    buttonsContainer.appendChild(acceptButton);
    banner.appendChild(buttonsContainer);

    // Aggiungi il banner al body
    document.body.appendChild(banner);

    // Stile responsive
    const style = document.createElement('style');
    style.textContent = `
      @media (max-width: 768px) {
        #cookie-banner {
          flex-direction: column;
          align-items: stretch;
          padding: 16px;
        }
        #cookie-banner > div:first-child {
          margin-bottom: 12px;
        }
        #cookie-banner button {
          flex: 1;
          min-width: 120px;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Nasconde il banner
  function hideBanner() {
    const banner = document.getElementById('cookie-banner');
    if (banner) {
      banner.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      banner.style.opacity = '0';
      banner.style.transform = 'translateY(100%)';
      setTimeout(function() {
        banner.remove();
      }, 300);
    }
  }

  // Inizializza il banner
  function initCookieBanner() {
    if (!hasConsent()) {
      // Piccolo delay per assicurarsi che il DOM sia caricato
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createCookieBanner);
      } else {
        createCookieBanner();
      }
    }
  }

  // Avvia il banner
  initCookieBanner();
})();


