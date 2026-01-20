#!/usr/bin/env python3
"""
Script per convertire percorsi assoluti in relativi in tutti i file HTML.
"""
import os
import re
from pathlib import Path

# Directory base
BASE_DIR = Path(__file__).parent

# Pattern di sostituzione: (pattern_regex, replacement)
REPLACEMENTS = [
    # Icone e logo comuni
    (r'href="/vite\.svg"', 'href="public/vite.svg"'),
    (r'src="/logo-dibello-new\.png"', 'src="public/logo-dibello-new.png"'),
    
    # Immagini PNG comuni (sostituzioni generiche)
    (r'src="/([a-zA-Z0-9\-_]+\.png)"', r'src="public/\1"'),
    
    # Link HTML (rimuovere slash iniziale)
    (r'href="/([a-zA-Z0-9\-_]+\.html)"', r'href="\1"'),
    
    # Link a partials
    (r'fetch\("/partials/', 'fetch("partials/'),
]

# File da escludere
EXCLUDE_PATTERNS = [
    'partials/',
    'global-',
    'node_modules/',
    '.git/',
]

def should_process_file(filepath):
    """Verifica se un file deve essere processato."""
    filepath_str = str(filepath)
    return not any(exclude in filepath_str for exclude in EXCLUDE_PATTERNS)

def fix_file(filepath):
    """Corregge i percorsi in un singolo file."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        changes = 0
        
        for pattern, replacement in REPLACEMENTS:
            new_content = re.sub(pattern, replacement, content)
            if new_content != content:
                count = len(re.findall(pattern, content))
                changes += count
                content = new_content
        
        if content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            return changes
        
        return 0
    except Exception as e:
        print(f"Errore processando {filepath}: {e}")
        return 0

def main():
    """Funzione principale."""
    html_files = list(BASE_DIR.glob('*.html'))
    html_files = [f for f in html_files if should_process_file(f)]
    
    total_changes = 0
    modified_files = []
    
    for html_file in html_files:
        changes = fix_file(html_file)
        if changes > 0:
            modified_files.append((html_file.name, changes))
            total_changes += changes
    
    # Report
    print(f"\n=== REPORT CORREZIONE PERCORSI ===\n")
    print(f"File processati: {len(html_files)}")
    print(f"File modificati: {len(modified_files)}")
    print(f"Totale sostituzioni: {total_changes}\n")
    
    if modified_files:
        print("File modificati:")
        for filename, count in sorted(modified_files):
            print(f"  - {filename}: {count} sostituzioni")
    
    print("\n=== COMPLETATO ===\n")

if __name__ == '__main__':
    main()



