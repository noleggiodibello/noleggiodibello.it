(function() {
  'use strict';

  // Gestisce lo scroll smooth quando si arriva con #categorie nell'URL
  function handleHashScroll() {
    if (window.location.hash === '#categorie') {
      const categorieSection = document.getElementById('categorie');
      if (categorieSection) {
        // Piccolo delay per assicurarsi che la pagina sia caricata
        setTimeout(() => {
          categorieSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  }

  // Gestisce il click sui link Servizi quando si è già in index.html
  function handleServiziClick() {
    const serviziLinks = document.querySelectorAll('a[href*="#categorie"], a[href*="index.html#categorie"]');
    
    serviziLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        // Se il link punta a index.html#categorie o #categorie
        if (href && href.includes('#categorie')) {
          // Se siamo già in index.html (o nella root)
          const currentPath = window.location.pathname;
          const isIndexPage = currentPath === '/' || 
                              currentPath === '/index.html' || 
                              currentPath.endsWith('/index.html') ||
                              currentPath.endsWith('/');
          
          if (isIndexPage) {
            e.preventDefault();
            const categorieSection = document.getElementById('categorie');
            if (categorieSection) {
              categorieSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
              // Aggiorna l'URL senza ricaricare
              window.history.pushState(null, '', '#categorie');
            }
          }
          // Se non siamo in index.html, il link normale porterà alla pagina corretta
        }
      });
    });
  }

  // Esegui al caricamento della pagina
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      handleHashScroll();
      handleServiziClick();
    });
  } else {
    handleHashScroll();
    handleServiziClick();
  }

  // Gestisci anche quando l'hash cambia dinamicamente
  window.addEventListener('hashchange', handleHashScroll);
})();

