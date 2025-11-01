#!/usr/bin/env python3
"""
Script per estrarre dati dal catalogo vini DOP/IGP usando Playwright
URL: http://catalogoviti.politicheagricole.it/dopigp.php
"""

from playwright.sync_api import sync_playwright, TimeoutError as PlaywrightTimeout
from bs4 import BeautifulSoup
import json
import time
import requests
import PyPDF2
import io
from urllib.parse import urljoin

class WineCatalogExtractor:
    def __init__(self, base_url="http://catalogoviti.politicheagricole.it/dopigp.php"):
        self.base_url = base_url
        self.wines = []

    def fetch_catalog_page(self):
        """Scarica la pagina principale del catalogo usando Playwright"""
        print(f"Scaricando la pagina del catalogo: {self.base_url}")

        try:
            with sync_playwright() as p:
                # Lancia il browser (Chromium headless)
                browser = p.chromium.launch(headless=True)
                context = browser.new_context(
                    user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                )
                page = context.new_page()

                # Vai alla pagina
                page.goto(self.base_url, wait_until='domcontentloaded', timeout=30000)

                # Aspetta che la pagina sia completamente caricata
                time.sleep(3)

                # Ottieni l'HTML
                html_content = page.content()

                browser.close()

                print(f"✓ Pagina scaricata con successo ({len(html_content)} caratteri)")
                return html_content

        except Exception as e:
            print(f"✗ Errore nel download della pagina: {e}")
            return None

    def parse_wine_list(self, html_content):
        """Estrae la lista dei vini dalla pagina HTML"""
        print("\nParsing della pagina HTML...")
        soup = BeautifulSoup(html_content, 'html.parser')

        # Salva l'HTML per debug
        with open('catalog_page.html', 'w', encoding='utf-8') as f:
            f.write(soup.prettify())
        print("✓ HTML salvato in 'catalog_page.html' per debug")

        # Cerca tutti i link
        all_links = soup.find_all('a', href=True)
        print(f"Trovati {len(all_links)} link totali")

        pdf_count = 0
        for link in all_links:
            href = link.get('href', '')
            wine_name = link.get_text(strip=True)

            # Cerca link che contengono .pdf o scheda
            if '.pdf' in href.lower() or 'scheda' in href.lower() or 'disciplinare' in href.lower():
                # Costruisci URL completo
                if href.startswith('http'):
                    pdf_url = href
                else:
                    pdf_url = urljoin(self.base_url, href)

                if wine_name and len(wine_name) > 2:
                    self.wines.append({
                        'name': wine_name,
                        'pdf_url': pdf_url,
                        'gusto': None,
                        'sapore': None,
                        'colore': None
                    })
                    pdf_count += 1
                    print(f"  ✓ {wine_name}")

        # Se non troviamo link PDF diretti, cerchiamo nelle tabelle
        if not self.wines:
            print("\n⚠ Nessun link PDF diretto trovato. Analizzo tabelle...")

            tables = soup.find_all('table')
            for table in tables:
                rows = table.find_all('tr')
                for row in rows:
                    cells = row.find_all(['td', 'th'])
                    for cell in cells:
                        links = cell.find_all('a', href=True)
                        for link in links:
                            wine_name = link.get_text(strip=True)
                            href = link.get('href', '')
                            if wine_name and href:
                                full_url = urljoin(self.base_url, href)
                                self.wines.append({
                                    'name': wine_name,
                                    'pdf_url': full_url,
                                    'gusto': None,
                                    'sapore': None,
                                    'colore': None
                                })
                                print(f"  ✓ {wine_name} (da tabella)")

        print(f"\n✓ Trovati {len(self.wines)} vini ({pdf_count} con PDF)")

        # Mostra i primi 5 per verifica
        if self.wines:
            print("\nPrimi 5 vini trovati:")
            for i, wine in enumerate(self.wines[:5], 1):
                print(f"  {i}. {wine['name']}")

        return self.wines

    def extract_text_from_pdf(self, pdf_url):
        """Scarica ed estrae il testo da un PDF"""
        try:
            session = requests.Session()
            session.headers.update({
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'application/pdf,*/*',
                'Referer': self.base_url
            })

            response = session.get(pdf_url, timeout=30)
            response.raise_for_status()

            # Leggi il PDF
            pdf_file = io.BytesIO(response.content)
            pdf_reader = PyPDF2.PdfReader(pdf_file)

            text = ""
            for page in pdf_reader.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"

            return text
        except Exception as e:
            print(f"    ✗ Errore PDF: {str(e)[:100]}")
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

    def process_all_wines(self, max_wines=None):
        """Processa tutti i vini estraendo i dati dai PDF"""
        wines_to_process = self.wines[:max_wines] if max_wines else self.wines

        print(f"\n{'='*60}")
        print(f"Processando {len(wines_to_process)} vini...")
        print(f"{'='*60}\n")

        for i, wine in enumerate(wines_to_process, 1):
            print(f"[{i}/{len(wines_to_process)}] {wine['name']}")

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
        print("(usando Playwright)")
        print("=" * 60 + "\n")

        # 1. Scarica la pagina
        html = self.fetch_catalog_page()
        if not html:
            print("\n❌ Impossibile scaricare la pagina. Uscita.")
            return

        # 2. Estrai lista vini
        self.parse_wine_list(html)

        if not self.wines:
            print("\n❌ Nessun vino trovato")
            print("Controlla 'catalog_page.html' per vedere la struttura della pagina")
            return

        # 3. Chiedi conferma
        print(f"\n✓ Trovati {len(self.wines)} vini nel catalogo")
        print("\nVuoi processare tutti i PDF? Questo potrebbe richiedere diversi minuti.")

        # Per esecuzione automatica, processa i primi 10 come test
        print("Processando i primi 10 vini come test...")

        # 4. Processa i PDF (primi 10 per test)
        self.process_all_wines(max_wines=10)

        # 5. Salva risultati
        self.save_results('wine_catalog_sample.json')

        print("\n" + "=" * 60)
        print("✓ COMPLETATO! (Sample di 10 vini)")
        print("=" * 60)
        print("\nPer processare TUTTI i vini, modifica lo script e rimuovi max_wines=10")


if __name__ == "__main__":
    extractor = WineCatalogExtractor()
    extractor.run()
