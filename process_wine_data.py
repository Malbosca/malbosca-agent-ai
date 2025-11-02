#!/usr/bin/env python3
"""
Script per processare i dati JSON del catalogo vini e estrarre informazioni dai PDF
"""

import json
import requests
import re
import time
import PyPDF2
import io
from bs4 import BeautifulSoup
from urllib.parse import urljoin

class WineDataProcessor:
    def __init__(self, json_file, base_url="http://catalogoviti.politicheagricole.it"):
        self.json_file = json_file
        self.base_url = base_url
        self.wines = []

        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'it-IT,it;q=0.9',
            'Referer': base_url
        })

    def load_json_data(self):
        """Carica i dati dal file JSON"""
        print(f"Caricamento dati da: {self.json_file}")
        try:
            with open(self.json_file, 'r', encoding='utf-8') as f:
                data = json.load(f)

            print(f"✓ Caricati {len(data.get('rows', []))} vini")
            return data
        except Exception as e:
            print(f"✗ Errore nel caricamento: {e}")
            return None

    def parse_wine_data(self, json_data):
        """Estrae nome, codice e regione dai dati JSON"""
        rows = json_data.get('rows', [])

        for row in rows:
            wine_id = row.get('id')
            cell = row.get('cell', [])

            if len(cell) >= 2:
                # Estrai nome e codice dall'HTML
                html_link = cell[0]
                region = cell[1]

                # Parse HTML per estrarre nome e codice
                match = re.search(r'codice=(\d+)>([^<]+)<', html_link)
                if match:
                    code = match.group(1)
                    name = match.group(2)

                    self.wines.append({
                        'id': wine_id,
                        'code': code,
                        'name': name,
                        'region': region,
                        'denominazione_url': f"{self.base_url}/denominazioni.php?codice={code}",
                        'pdf_url': None,
                        'colore': None,
                        'gusto': None,
                        'sapore': None
                    })

        print(f"✓ Parsati {len(self.wines)} vini")
        return self.wines

    def get_pdf_url(self, denominazione_url):
        """Accede alla pagina del vino e cerca il link al PDF"""
        try:
            response = self.session.get(denominazione_url, timeout=15)
            response.raise_for_status()

            soup = BeautifulSoup(response.text, 'html.parser')

            # Cerca link al PDF - vari pattern possibili
            pdf_links = soup.find_all('a', href=re.compile(r'\.pdf$', re.I))

            if pdf_links:
                pdf_href = pdf_links[0].get('href')
                pdf_url = urljoin(self.base_url, pdf_href)
                return pdf_url

            # Cerca anche nei form o button
            pdf_forms = soup.find_all('form', action=re.compile(r'\.pdf$', re.I))
            if pdf_forms:
                pdf_action = pdf_forms[0].get('action')
                return urljoin(self.base_url, pdf_action)

            return None

        except Exception as e:
            print(f"    ⚠ Errore nell'accesso alla pagina: {str(e)[:50]}")
            return None

    def extract_text_from_pdf(self, pdf_url):
        """Scarica ed estrae il testo da un PDF"""
        try:
            response = self.session.get(pdf_url, timeout=30)
            response.raise_for_status()

            pdf_file = io.BytesIO(response.content)
            pdf_reader = PyPDF2.PdfReader(pdf_file)

            text = ""
            for page in pdf_reader.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"

            return text
        except Exception as e:
            print(f"    ⚠ Errore PDF: {str(e)[:50]}")
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
                if ':' in line:
                    parts = line.split(':', 1)
                    if len(parts) > 1 and len(parts[1].strip()) > 0:
                        colore = parts[1].strip()
                elif i + 1 < len(lines):
                    next_line = lines[i + 1]
                    if not any(kw in next_line.lower() for kw in ['caratteristiche', 'gusto', 'sapore', 'odore', 'titolo', 'gradazione']):
                        colore = next_line

            # GUSTO
            if 'gusto' in line_lower and not gusto:
                if ':' in line:
                    parts = line.split(':', 1)
                    if len(parts) > 1 and len(parts[1].strip()) > 0:
                        gusto = parts[1].strip()
                elif i + 1 < len(lines):
                    next_line = lines[i + 1]
                    if not any(kw in next_line.lower() for kw in ['caratteristiche', 'colore', 'sapore', 'odore', 'titolo', 'gradazione']):
                        gusto = next_line

            # SAPORE
            if 'sapore' in line_lower and not sapore:
                if ':' in line:
                    parts = line.split(':', 1)
                    if len(parts) > 1 and len(parts[1].strip()) > 0:
                        sapore = parts[1].strip()
                elif i + 1 < len(lines):
                    next_line = lines[i + 1]
                    if not any(kw in next_line.lower() for kw in ['caratteristiche', 'colore', 'gusto', 'odore', 'titolo', 'gradazione']):
                        sapore = next_line

        # Limita lunghezza
        if colore and len(colore) > 200:
            colore = colore[:200] + "..."
        if gusto and len(gusto) > 200:
            gusto = gusto[:200] + "..."
        if sapore and len(sapore) > 200:
            sapore = sapore[:200] + "..."

        return gusto, sapore, colore

    def process_wines(self, max_wines=None):
        """Processa tutti i vini"""
        wines_to_process = self.wines[:max_wines] if max_wines else self.wines

        print(f"\n{'='*70}")
        print(f"Processando {len(wines_to_process)} vini...")
        print(f"{'='*70}\n")

        for i, wine in enumerate(wines_to_process, 1):
            print(f"[{i}/{len(wines_to_process)}] {wine['name']} ({wine['region']})")

            # 1. Ottieni URL del PDF
            print(f"  🔍 Cercando PDF...")
            pdf_url = self.get_pdf_url(wine['denominazione_url'])

            if pdf_url:
                wine['pdf_url'] = pdf_url
                print(f"  ✓ PDF trovato: {pdf_url}")

                # 2. Estrai testo dal PDF
                print(f"  📄 Estraendo testo dal PDF...")
                text = self.extract_text_from_pdf(pdf_url)

                if text:
                    print(f"  ✓ Estratto testo ({len(text)} caratteri)")

                    # 3. Estrai proprietà
                    gusto, sapore, colore = self.extract_wine_properties(text)
                    wine['gusto'] = gusto
                    wine['sapore'] = sapore
                    wine['colore'] = colore

                    # Mostra risultati
                    print(f"  🍷 Colore: {colore if colore else '❌ Non trovato'}")
                    print(f"  👅 Gusto:  {gusto if gusto else '❌ Non trovato'}")
                    print(f"  👄 Sapore: {sapore if sapore else '❌ Non trovato'}")
            else:
                print(f"  ❌ PDF non trovato")

            print()

            # Pausa per non sovraccaricare il server
            time.sleep(1)

        return self.wines

    def save_results(self, output_file='wine_catalog_results.json'):
        """Salva i risultati in formato JSON e CSV"""
        # JSON
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(self.wines, f, ensure_ascii=False, indent=2)
        print(f"✓ Risultati salvati in {output_file}")

        # CSV
        csv_file = output_file.replace('.json', '.csv')
        with open(csv_file, 'w', encoding='utf-8') as f:
            f.write("Nome,Categoria,Regione,Colore,Gusto,Sapore,PDF URL\n")
            for wine in self.wines:
                name = (wine.get('name', '') or '').replace('"', '""')
                region = (wine.get('region', '') or '').replace('"', '""')
                colore = (wine.get('colore', '') or '').replace('"', '""')
                gusto = (wine.get('gusto', '') or '').replace('"', '""')
                sapore = (wine.get('sapore', '') or '').replace('"', '""')
                pdf_url = wine.get('pdf_url', '') or ''
                f.write(f'"{name}","DOCG","{region}","{colore}","{gusto}","{sapore}","{pdf_url}"\n')
        print(f"✓ Risultati salvati in {csv_file}")

        # Statistiche
        print(f"\n{'='*70}")
        print("STATISTICHE:")
        print(f"{'='*70}")
        print(f"Vini totali:      {len(self.wines)}")
        print(f"Con PDF trovato:  {sum(1 for w in self.wines if w.get('pdf_url'))}")
        print(f"Con colore:       {sum(1 for w in self.wines if w.get('colore'))}")
        print(f"Con gusto:        {sum(1 for w in self.wines if w.get('gusto'))}")
        print(f"Con sapore:       {sum(1 for w in self.wines if w.get('sapore'))}")

    def run(self, max_wines=10):
        """Esegue l'intero processo"""
        print("\n" + "="*70)
        print("PROCESSING WINE DATA FROM JSON")
        print("="*70 + "\n")

        # 1. Carica JSON
        data = self.load_json_data()
        if not data:
            return

        # 2. Parse wine data
        self.parse_wine_data(data)

        if not self.wines:
            print("❌ Nessun vino trovato nei dati JSON")
            return

        # 3. Processa i vini (limitato per test)
        print(f"\n⚠ MODALITÀ TEST: Processando solo i primi {max_wines} vini")
        print("Per processare tutti i vini, esegui: processor.run(max_wines=None)")

        self.process_wines(max_wines=max_wines)

        # 4. Salva risultati
        self.save_results()

        print("\n" + "="*70)
        print("✓ COMPLETATO!")
        print("="*70)


if __name__ == "__main__":
    processor = WineDataProcessor('dati_parziali_docg_page1.json')
    processor.run(max_wines=5)  # Test con primi 5 vini
