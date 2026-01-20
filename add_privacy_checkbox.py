#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script per aggiungere checkbox privacy in tutti i form del sito
"""

import os
import re
from pathlib import Path

# HTML della checkbox privacy
PRIVACY_CHECKBOX_HTML = '''          <div class="privacy-consent">
            <label>
              <input type="checkbox" id="privacyConsent" required>
              Ho letto la <a href="privacy.html" target="_blank">Privacy Policy</a> e acconsento al trattamento dei miei dati personali.
            </label>
          </div>'''

PRIVACY_CHECKBOX_FOOTER_HTML = '''                <div class="privacy-consent">
                  <label>
                    <input type="checkbox" id="privacyConsentFooter" required>
                    Ho letto la <a href="privacy.html" target="_blank">Privacy Policy</a> e acconsento al trattamento dei miei dati personali.
                  </label>
                </div>'''

# CSS per privacy-consent
PRIVACY_CSS = '''      .privacy-consent {
        font-size: 14px;
        margin: 10px 0;
      }

      .privacy-consent label {
        display: flex;
        align-items: flex-start;
        gap: 8px;
        cursor: pointer;
        font-weight: 400;
        line-height: 1.5;
      }

      .privacy-consent input[type="checkbox"] {
        margin-top: 2px;
        flex-shrink: 0;
      }

      .privacy-consent a {
        color: inherit;
        text-decoration: underline;
      }

'''

def add_privacy_checkbox_to_file(filepath):
    """Aggiunge checkbox privacy a un file HTML"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        modified = False
        
        # Pattern per trovare i bottoni email prima dei quali aggiungere la checkbox
        patterns = [
            # Pattern principale: bottone email dopo textarea
            (r'(<textarea[^>]*>.*?</textarea>\s*)<button type="button" class="btn-preventivo-email js-email-preventivo"([^>]*)>Invia richiesta via Email</button>',
             r'\1' + PRIVACY_CHECKBOX_HTML + '\n          <button type="button" class="btn-preventivo-email js-email-preventivo"\2>Invia richiesta via Email</button>'),
            
            # Pattern footer: bottone email dopo textarea nel footer
            (r'(<textarea[^>]*id="messaggio-footer"[^>]*>.*?</textarea>\s*)<button type="button" class="btn-preventivo-email js-email-preventivo">Richiedi preventivo via Email</button>',
             r'\1' + PRIVACY_CHECKBOX_FOOTER_HTML + '\n                <button type="button" class="btn-preventivo-email js-email-preventivo">Richiedi preventivo via Email</button>'),
        ]
        
        # Applica i pattern
        for pattern, replacement in patterns:
            if re.search(pattern, content, re.DOTALL):
                if 'privacy-consent' not in content or 'privacyConsent' not in content:
                    content = re.sub(pattern, replacement, content, flags=re.DOTALL)
                    modified = True
        
        # Aggiungi CSS se non presente
        if '.privacy-consent' not in content and '.btn-preventivo-email:disabled' in content:
            content = re.sub(
                r'(\.btn-preventivo-email:disabled[^}]*\}\s*)',
                r'\1' + PRIVACY_CSS,
                content
            )
            modified = True
        
        if modified and content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        return False
    except Exception as e:
        print(f"Errore in {filepath}: {e}")
        return False

def main():
    """Esegue lo script su tutti i file HTML"""
    base_dir = Path(__file__).parent
    html_files = list(base_dir.glob('*.html'))
    
    modified_files = []
    for html_file in html_files:
        if html_file.name in ['index.html', 'contatti.html', 'piattaforme-autocarrate.html', 'pantografi-elettrici.html']:
            continue  # Già modificati manualmente
        
        if add_privacy_checkbox_to_file(html_file):
            modified_files.append(html_file.name)
            print(f"✅ Modificato: {html_file.name}")
    
    print(f"\n📊 Totale file modificati: {len(modified_files)}")
    if modified_files:
        print("File modificati:")
        for f in modified_files:
            print(f"  - {f}")

if __name__ == '__main__':
    main()
