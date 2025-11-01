#!/usr/bin/env python3
"""
Script per estrarre dati dal catalogo vini DOP/IGP da un file HTML salvato
Usa questo script se hai salvato manualmente la pagina del catalogo
"""

import sys
import json
import re
import time
import requests
import PyPDF2
import io
from bs4 import BeautifulSoup
from urllib.parse import urljoin

class WineCatalogExtractor:
    def __init__(self, html_file, base_url="http://catalogoviti.politicheagricole.it"):
        self.html_file = html_file
        self.base_url = base_url
        self.wines = []

    def load_html(self):
        """Carica il file HTML"""
        print(f"Caricamento file HTML: {self.html_file}")
        try:
            with open(self.html_file, 'r', encoding='utf-8') as f:
                html = f.read()
            print(f"✓ File caricato ({len(html)} caratteri)")
            return html
        except Exception as e:
            print(f"✗ Errore nel caricamento del file: {e}")
            return None

    def parse_wine_list(self, html_content):
        """Estrae la lista dei vini dalla pagina HTML"""
        print("\nParsing della pagina HTML...")
        soup = BeautifulSoup(html_content, 'html.parser')

        # Salva una versione pretty per debug
        with open('parsed_catalog.html', 'w', encoding='utf-8') as f:
            f.write(soup.prettify()[:5000])  # Primi 5000 caratteri
        print("✓ Salvato campione in 'parsed_catalog.html'")

        # Cerca tutti i link
        all_links = soup.find_all('a', href=True)
        print(f"\nTrovati {len(all_links)} link totali")

        # Filtra link ai PDF o schede tecniche
        pdf_count = 0
        for link in all_links:
            href = link.get('href', '')
            wine_name = link.get_text(strip=True)

            # Cerca link che potrebbero essere PDF di vini
            is_wine_pdf = False

            if '.pdf' in href.lower():
                is_wine_pdf = True
                pdf_count += 1
            elif 'scheda' in href.lower() or 'disciplinare' in href.lower():
                is_wine_pdf = True

            if is_wine_pdf and wine_name:
                # Costruisci URL completo
                if href.startswith('http'):
                    full_url = href
                else:
                    full_url = urljoin(self.base_url, href)

                self.wines.append({
                    'name': wine_name,
                    'pdf_url': full_url,
                    'gusto': None,
                    'sapore': None,
                    'colore': None
                })
                print(f"  ✓ {wine_name}")

        print(f"\n✓ Trovati {len(self.wines)} vini (di cui {pdf_count} link PDF)")

        # Se non troviamo nulla, mostra info di debug
        if not self.wines:
            print("\n⚠ Nessun vino trovato. Esempi di link trovati:")
            for i, link in enumerate(all_links[:10]):
                print(f"  {i+1}. {link.get_text(strip=True)[:50]} -> {link.get('href', '')[:80]}")

        return self.wines

    def extract_text_from_pdf(self, pdf_url):
        """Scarica ed estrae il testo da un PDF"""
        try:
            session = requests.Session()
            session.headers.update({
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'application/pdf,*/*',
                'Referer': self.base_url
            })

            response = session.get(pdf_url, timeout=30)
            response.raise_for_status()

            # Leggi il PDF
            pdf_file = io.BytesIO(response.content)
            pdf_reader = PyPDF2.PdfReader(pdf_file)

            text = ""
            for page_num, page in enumerate(pdf_reader.pages):
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"

            return text
        except Exception as e:
            print(f"    ✗ Errore PDF: {e}")
            return None

    def extract_wine_properties(self, text):
        """Estrae gusto, sapore e colore dal testo del PDF"""
        if not text:
            return None, None, None

        gusto = None
        sapore = None
        colore = None

        # Dividi in righe
        lines = [line.strip() for line in text.split('\n') if line.strip()]

        # Cerca le informazioni
        for i, line in enumerate(lines):
            line_lower = line.lower()

            # COLORE
            if 'colore' in line_lower and not colore:
                # Cerca nella stessa riga dopo i due punti
                if ':' in line:
                    parts = line.split(':', 1)
                    if len(parts) > 1:
                        colore = parts[1].strip()
                # O nella riga successiva
                elif i + 1 < len(lines):
                    next_line = lines[i + 1]
                    # Controlla che non sia un'altra etichetta
                    if not any(keyword in next_line.lower() for keyword in ['caratteristiche', 'gusto', 'sapore', 'odore', 'titolo']):
                        colore = next_line

            # GUSTO
            if 'gusto' in line_lower and not gusto:
                if ':' in line:
                    parts = line.split(':', 1)
                    if len(parts) > 1:
                        gusto = parts[1].strip()
                elif i + 1 < len(lines):
                    next_line = lines[i + 1]
                    if not any(keyword in next_line.lower() for keyword in ['caratteristiche', 'colore', 'sapore', 'odore', 'titolo']):
                        gusto = next_line

            # SAPORE
            if 'sapore' in line_lower and not sapore:
                if ':' in line:
                    parts = line.split(':', 1)
                    if len(parts) > 1:
                        sapore = parts[1].strip()
                elif i + 1 < len(lines):
                    next_line = lines[i + 1]
                    if not any(keyword in next_line.lower() for keyword in ['caratteristiche', 'colore', 'gusto', 'odore', 'titolo']):
                        sapore = next_line

        # Pulizia dei risultati
        if colore and len(colore) > 200:
            colore = colore[:200] + "..."
        if gusto and len(gusto) > 200:
            gusto = gusto[:200] + "..."
        if sapore and len(sapore) > 200:
            sapore = sapore[:200] + "..."

        return gusto, sapore, colore

    def process_all_wines(self):
        """Processa tutti i vini estraendo i dati dai PDF"""
        print(f"\n{'='*60}")
        print(f"Processando {len(self.wines)} vini...")
        print(f"{'='*60}\n")

        for i, wine in enumerate(self.wines, 1):
            print(f"[{i}/{len(self.wines)}] {wine['name']}")

            # Estrai testo dal PDF
            text = self.extract_text_from_pdf(wine['pdf_url'])

            if text:
                # Estrai proprietà
                gusto, sapore, colore = self.extract_wine_properties(text)
                wine['gusto'] = gusto
                wine['sapore'] = sapore
                wine['colore'] = colore

                # Mostra risultati
                print(f"  Colore: {colore if colore else '❌ Non trovato'}")
                print(f"  Gusto:  {gusto if gusto else '❌ Non trovato'}")
                print(f"  Sapore: {sapore if sapore else '❌ Non trovato'}")
            else:
                print(f"  ✗ Impossibile estrarre dati dal PDF")

            # Pausa per non sovraccaricare il server
            time.sleep(0.5)
            print()

        return self.wines

    def save_results(self, filename='wine_catalog.json'):
        """Salva i risultati in formato JSON e CSV"""
        # JSON
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(self.wines, f, ensure_ascii=False, indent=2)
        print(f"✓ Risultati salvati in {filename}")

        # CSV
        csv_filename = filename.replace('.json', '.csv')
        with open(csv_filename, 'w', encoding='utf-8') as f:
            f.write("Nome,Colore,Gusto,Sapore,PDF URL\n")
            for wine in self.wines:
                name = (wine.get('name', '') or '').replace('"', '""')
                colore = (wine.get('colore', '') or '').replace('"', '""')
                gusto = (wine.get('gusto', '') or '').replace('"', '""')
                sapore = (wine.get('sapore', '') or '').replace('"', '""')
                pdf_url = wine.get('pdf_url', '') or ''
                f.write(f'"{name}","{colore}","{gusto}","{sapore}","{pdf_url}"\n')
        print(f"✓ Risultati salvati in {csv_filename}")

        # Statistiche
        print(f"\n{'='*60}")
        print("STATISTICHE:")
        print(f"{'='*60}")
        print(f"Vini totali:      {len(self.wines)}")
        print(f"Con colore:       {sum(1 for w in self.wines if w.get('colore'))}")
        print(f"Con gusto:        {sum(1 for w in self.wines if w.get('gusto'))}")
        print(f"Con sapore:       {sum(1 for w in self.wines if w.get('sapore'))}")

    def run(self):
        """Esegue l'intero processo di estrazione"""
        print("\n" + "=" * 60)
        print("ESTRAZIONE DATI CATALOGO VINI DOP/IGP")
        print("(da file HTML salvato)")
        print("=" * 60 + "\n")

        # 1. Carica HTML
        html = self.load_html()
        if not html:
            return

        # 2. Estrai lista vini
        self.parse_wine_list(html)

        if not self.wines:
            print("\n❌ Nessun vino trovato nel file HTML")
            print("\nControlla che il file contenga la pagina corretta del catalogo.")
            return

        # 3. Processa i PDF
        user_input = input(f"\nVuoi processare {len(self.wines)} PDF? (s/n): ")
        if user_input.lower() not in ['s', 'si', 'y', 'yes']:
            print("Operazione annullata")
            return

        self.process_all_wines()

        # 4. Salva risultati
        self.save_results()

        print("\n" + "=" * 60)
        print("✓ COMPLETATO!")
        print("=" * 60)


if __name__ == "__main__":
    if len(sys.argv) > 1:
        html_file = sys.argv[1]
    else:
        html_file = input("Inserisci il percorso del file HTML salvato: ")

    extractor = WineCatalogExtractor(html_file)
    extractor.run()
