#!/usr/bin/env python3
"""
Script per aggiornare tutti i file HTML:
- Sostituisce i riferimenti CSS global-*.css con global.css
- Rimuove i riferimenti JS global-*.js e li sostituisce con global.js
- Rimuove il div #global-cta-root
"""

import os
import re
from pathlib import Path

# Directory del progetto
base_dir = Path(__file__).parent

# Pattern per trovare i file HTML (escludendo global-*.html)
html_files = [f for f in base_dir.glob("*.html") if not f.name.startswith("global-")]

print(f"Trovati {len(html_files)} file HTML da aggiornare\n")

for html_file in html_files:
    try:
        with open(html_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        changes = []
        
        # 1. Rimuovere tutti i link CSS global-*.css e sostituire con global.css
        # Pattern: <link rel="stylesheet" href="global-*.css">
        css_pattern = r'<link\s+rel=["\']stylesheet["\']\s+href=["\']global-[^"\']+\.css["\']\s*>'
        css_matches = re.findall(css_pattern, content)
        if css_matches:
            # Rimuovi tutti i link CSS global-*.css
            content = re.sub(css_pattern, '', content)
            # Aggiungi global.css se non esiste già
            if 'href="global.css"' not in content and 'href=\'global.css\'' not in content:
                # Trova la posizione dopo l'ultimo <link> o dopo <meta name="viewport">
                viewport_match = re.search(r'(<meta\s+name=["\']viewport["\'][^>]*>)', content)
                if viewport_match:
                    insert_pos = viewport_match.end()
                    content = content[:insert_pos] + '\n    <link rel="stylesheet" href="global.css">' + content[insert_pos:]
                    changes.append("Aggiunto link a global.css")
                else:
                    # Se non c'è viewport, cerca dopo <title>
                    title_match = re.search(r'(</title>)', content)
                    if title_match:
                        insert_pos = title_match.end()
                        content = content[:insert_pos] + '\n    <link rel="stylesheet" href="global.css">' + content[insert_pos:]
                        changes.append("Aggiunto link a global.css")
            else:
                changes.append("Rimossi link CSS global-*.css")
        
        # 2. Rimuovere tutti gli script global-*.js e il div #global-cta-root
        # Pattern per script: <script src="global-*.js">
        js_pattern = r'<script\s+src=["\']global-[^"\']+\.js["\'][^>]*></script>'
        js_matches = re.findall(js_pattern, content)
        if js_matches:
            content = re.sub(js_pattern, '', content)
            changes.append("Rimossi script global-*.js")
        
        # Pattern per div #global-cta-root
        cta_root_pattern = r'<div\s+id=["\']global-cta-root["\'][^>]*></div>'
        if re.search(cta_root_pattern, content):
            content = re.sub(cta_root_pattern, '', content)
            changes.append("Rimosso div #global-cta-root")
        
        # Rimuovere commenti vuoti o commenti "GLOBAL CTA"
        content = re.sub(r'<!--\s*GLOBAL CTA\s*-->', '', content)
        content = re.sub(r'<!--\s*-->', '', content)
        
        # 3. Aggiungere global.js prima di </body> se non esiste già
        if 'src="global.js"' not in content and 'src=\'global.js\'' not in content:
            body_close = content.rfind('</body>')
            if body_close != -1:
                # Rimuovi eventuali spazi/righe vuote prima di </body>
                before_body = content[:body_close].rstrip()
                # Aggiungi global.js
                content = before_body + '\n    <script src="global.js"></script>\n  </body>'
                changes.append("Aggiunto script global.js")
        
        # Scrivi il file solo se ci sono state modifiche
        if content != original_content:
            with open(html_file, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"✅ {html_file.name}: {', '.join(changes)}")
        else:
            print(f"⏭️  {html_file.name}: nessuna modifica necessaria")
            
    except Exception as e:
        print(f"❌ Errore in {html_file.name}: {e}")

print(f"\n✅ Aggiornamento completato!")





