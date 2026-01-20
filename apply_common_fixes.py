#!/usr/bin/env python3
"""
Script per applicare le sostituzioni comuni a tutti i file HTML rimanenti.
"""
import os
import re
from pathlib import Path

BASE_DIR = Path(__file__).parent

# Lista di tutti i file HTML da correggere (escludendo quelli già corretti)
FILES_TO_FIX = [
    # Magni
    'magni-rth-5-25.html', 'magni-rth-4-18.html', 'magni-rth-7-26.html', 'magni-rth-13-26.html',
    'magni-th-5-8-u.html', 'magni-th-5-24.html', 'magni-hth-16-10.html', 'magni-hth-50-14.html',
    'magni-ba20ert.html', 'magni-mjp-11-5.html', 'magni-es0607dc.html', 'magni-es0708dc.html',
    'magni-es0808ac.html', 'magni-es1218rt.html', 'magni-es1612acp.html', 'magni-dsi418rt.html',
    'magni-ds2223rt.html',
    # CMC
    'cmc-s13f.html', 'cmc-s15.html', 'cmc-s22hd.html', 'cmc-s25.html', 'cmc-s32.html', 'cmc-s41.html',
    # Wacker Neuson
    'wacker-neuson-803.html', 'wacker-neuson-et16.html', 'wacker-neuson-et18.html', 'wacker-neuson-et20.html',
    'wacker-neuson-et24.html', 'wacker-neuson-et35.html', 'wacker-neuson-et145.html', 'wacker-neuson-ez17.html',
    'wacker-neuson-ez53.html', 'wacker-neuson-ez80.html', 'wacker-neuson-ew65.html', 'wacker-neuson-ew100.html',
    # Airo e altri
    'airo-a13je.html', 'contatti.html', 'index.html',
]

# Mappatura immagini per file specifici
IMAGE_MAP = {
    'magni-rth-5-25.html': 'rth-5.25.png',
    'magni-rth-4-18.html': 'rth-4.18.png',
    'magni-rth-7-26.html': 'rth-7.26.png',
    'magni-rth-13-26.html': 'rth-13.26.png',
    'magni-th-5-8-u.html': 'th5.8U.png',
    'magni-th-5-24.html': 'th-5.24.png',
    'magni-hth-16-10.html': 'hth-16.10.png',
    'magni-hth-50-14.html': 'hth-50.14.png',
    'magni-ba20ert.html': 'ba20ert.png',
    'magni-mjp-11-5.html': 'mjp11.5.png',
    'magni-es0607dc.html': 'es0607dc.png',
    'magni-es0708dc.html': 'es0708dc.png',
    'magni-es0808ac.html': 'es0808ac.png',
    'magni-es1218rt.html': 'es1218rt.png',
    'magni-es1612acp.html': 'es1612acp.png',
    'magni-dsi418rt.html': 'ds1418brt.png',
    'magni-ds2223rt.html': 'ds2223rt.png',
    'cmc-s13f.html': 's13f.png',
    'cmc-s15.html': 's15.png',
    'cmc-s22hd.html': 's22hd.png',
    'cmc-s25.html': 's25.png',
    'cmc-s32.html': 's32.png',
    'cmc-s41.html': 's41.png',
    'wacker-neuson-803.html': 'l803.png',
    'wacker-neuson-et16.html': 'et16.png',
    'wacker-neuson-et18.html': 'et18.png',
    'wacker-neuson-et20.html': 'et20.png',
    'wacker-neuson-et24.html': 'et24.png',
    'wacker-neuson-et35.html': 'et35.png',
    'wacker-neuson-et145.html': 'et145.png',
    'wacker-neuson-ez17.html': 'ez17.png',
    'wacker-neuson-ez53.html': 'ez53.png',
    'wacker-neuson-ez80.html': 'ez80.png',
    'wacker-neuson-ew65.html': 'ew65.png',
    'wacker-neuson-ew100.html': 'ew100.png',
    'airo-a13je.html': 'a13je.png',
}

def fix_file(filepath):
    """Corregge i percorsi in un singolo file."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        changes = []
        
        # 1. vite.svg
        if '/vite.svg' in content:
            count = content.count('/vite.svg')
            content = content.replace('href="/vite.svg"', 'href="public/vite.svg"')
            if count > 0:
                changes.append(('vite.svg', count))
        
        # 2. logo-dibello-new.png
        if '/logo-dibello-new.png' in content:
            count = content.count('/logo-dibello-new.png')
            content = content.replace('src="/logo-dibello-new.png"', 'src="public/logo-dibello-new.png"')
            if count > 0:
                changes.append(('logo', count))
        
        # 3. Immagine prodotto specifica
        filename = filepath.name
        if filename in IMAGE_MAP:
            img_name = IMAGE_MAP[filename]
            pattern = f'src="/{img_name}"'
            replacement = f'src="public/{img_name}"'
            if pattern in content:
                count = content.count(pattern)
                content = content.replace(pattern, replacement)
                if count > 0:
                    changes.append((f'immagine {img_name}', count))
        
        if content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            return changes
        
        return []
    except Exception as e:
        print(f"Errore processando {filepath}: {e}")
        return []

def main():
    """Funzione principale."""
    total_changes = {}
    modified_files = []
    
    for filename in FILES_TO_FIX:
        filepath = BASE_DIR / filename
        if filepath.exists():
            changes = fix_file(filepath)
            if changes:
                modified_files.append((filename, changes))
                for change_type, count in changes:
                    total_changes[change_type] = total_changes.get(change_type, 0) + count
    
    # Report
    print(f"\n{'='*60}")
    print(f"REPORT CORREZIONE PERCORSI")
    print(f"{'='*60}\n")
    print(f"File modificati: {len(modified_files)}")
    print(f"\nTotale sostituzioni per tipo:")
    for change_type, count in sorted(total_changes.items()):
        print(f"  - {change_type}: {count}")
    
    print(f"\n{'='*60}")
    print(f"DETTAGLIO FILE MODIFICATI:")
    print(f"{'='*60}\n")
    for filename, changes in sorted(modified_files):
        print(f"{filename}:")
        for change_type, count in changes:
            print(f"  - {change_type}: {count} sostituzioni")
        print()
    
    print(f"{'='*60}\n")

if __name__ == '__main__':
    main()



