#!/usr/bin/env python3
"""
Script per convertire TUTTI i percorsi assoluti in relativi in tutti i file HTML.
"""
import os
import re
from pathlib import Path

# Directory base
BASE_DIR = Path(__file__).parent

# File da escludere
EXCLUDE_PATTERNS = [
    'partials/',
    'global-cta.html',
    'global-whatsapp-cta.html',
    'node_modules/',
    '.git/',
    'fix_paths.py',
    'fix_all_paths.py',
]

def should_process_file(filepath):
    """Verifica se un file deve essere processato."""
    filepath_str = str(filepath)
    return not any(exclude in filepath_str for exclude in EXCLUDE_PATTERNS)

def file_exists(relative_path):
    """Verifica se un file esiste relativamente alla root."""
    full_path = BASE_DIR / relative_path
    return full_path.exists()

def fix_absolute_paths(content):
    """Corregge tutti i percorsi assoluti nel contenuto."""
    changes = []
    original_content = content
    
    # 1. Icone vite.svg
    pattern1 = r'href="/vite\.svg"'
    replacement1 = 'href="public/vite.svg"'
    if re.search(pattern1, content):
        count = len(re.findall(pattern1, content))
        content = re.sub(pattern1, replacement1, content)
        changes.append(('vite.svg', count))
    
    # 2. Logo
    pattern2 = r'src="/logo-dibello-new\.png"'
    replacement2 = 'src="public/logo-dibello-new.png"'
    if re.search(pattern2, content):
        count = len(re.findall(pattern2, content))
        content = re.sub(pattern2, replacement2, content)
        changes.append(('logo-dibello-new.png', count))
    
    # 3. Immagini PNG (tutte le immagini in public/)
    pattern3 = r'src="/([a-zA-Z0-9\-_.]+\.png)"'
    def replace_png(match):
        filename = match.group(1)
        # Verifica se il file esiste in public/
        if file_exists(f'public/{filename}'):
            return f'src="public/{filename}"'
        return match.group(0)  # Non cambiare se il file non esiste
    matches = list(re.finditer(pattern3, content))
    if matches:
        count = len(matches)
        content = re.sub(pattern3, replace_png, content)
        changes.append(('immagini PNG', count))
    
    # 4. Link HTML (rimuovere slash iniziale)
    pattern4 = r'href="/([a-zA-Z0-9\-_]+\.html)"'
    def replace_html(match):
        filename = match.group(1)
        # Verifica se il file esiste
        if file_exists(filename):
            return f'href="{filename}"'
        return match.group(0)
    matches = list(re.finditer(pattern4, content))
    if matches:
        count = len(matches)
        content = re.sub(pattern4, replace_html, content)
        changes.append(('link HTML', count))
    
    # 5. Link a partials
    pattern5 = r'fetch\("/partials/'
    replacement5 = 'fetch("partials/'
    if re.search(pattern5, content):
        count = len(re.findall(pattern5, content))
        content = re.sub(pattern5, replacement5, content)
        changes.append(('partials', count))
    
    # 6. CSS e JS globali (verificare che esistano)
    pattern6 = r'(href|src)="/(global[^"]+\.(css|js))"'
    def replace_global(match):
        attr = match.group(1)
        filename = match.group(2)
        if file_exists(filename):
            return f'{attr}="{filename}"'
        return match.group(0)
    matches = list(re.finditer(pattern6, content))
    if matches:
        count = len(matches)
        content = re.sub(pattern6, replace_global, content)
        changes.append(('CSS/JS globali', count))
    
    return content, changes

def fix_file(filepath):
    """Corregge i percorsi in un singolo file."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        new_content, changes = fix_absolute_paths(content)
        
        if new_content != content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            return changes
        
        return []
    except Exception as e:
        print(f"Errore processando {filepath}: {e}")
        return []

def main():
    """Funzione principale."""
    html_files = list(BASE_DIR.glob('*.html'))
    html_files = [f for f in html_files if should_process_file(f)]
    
    total_changes = {}
    modified_files = []
    
    for html_file in sorted(html_files):
        changes = fix_file(html_file)
        if changes:
            modified_files.append((html_file.name, changes))
            for change_type, count in changes:
                total_changes[change_type] = total_changes.get(change_type, 0) + count
    
    # Report
    print(f"\n{'='*60}")
    print(f"REPORT CORREZIONE PERCORSI ASSOLUTI")
    print(f"{'='*60}\n")
    print(f"File HTML trovati: {len(html_files)}")
    print(f"File modificati: {len(modified_files)}")
    print(f"\nTotale sostituzioni per tipo:")
    for change_type, count in sorted(total_changes.items()):
        print(f"  - {change_type}: {count}")
    
    print(f"\n{'='*60}")
    print(f"DETTAGLIO FILE MODIFICATI:")
    print(f"{'='*60}\n")
    if modified_files:
        for filename, changes in sorted(modified_files):
            print(f"{filename}:")
            for change_type, count in changes:
                print(f"  - {change_type}: {count} sostituzioni")
            print()
    else:
        print("Nessun file modificato.\n")
    
    # Verifica risorse mancanti
    print(f"{'='*60}")
    print(f"VERIFICA RISORSE:")
    print(f"{'='*60}\n")
    
    # Verifica CSS globali
    css_files = ['global.css', 'global-cta.css', 'global-whatsapp-cta.css', 'global-product-cta.css']
    print("File CSS globali:")
    for css_file in css_files:
        exists = file_exists(css_file)
        status = "✓" if exists else "✗ MANCANTE"
        print(f"  {status} {css_file}")
    
    # Verifica JS globali
    js_files = ['global.js', 'global-cta.js', 'global-cta-loader.js', 'global-whatsapp-cta.js', 'global-product-cta.js', 'global-nav.js']
    print("\nFile JS globali:")
    for js_file in js_files:
        exists = file_exists(js_file)
        status = "✓" if exists else "✗ MANCANTE"
        print(f"  {status} {js_file}")
    
    print(f"\n{'='*60}")
    print(f"COMPLETATO!")
    print(f"{'='*60}\n")

if __name__ == '__main__':
    main()



