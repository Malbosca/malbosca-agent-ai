#!/usr/bin/env python3
"""
Script per estrarre dati dal catalogo vini DOP/IGP usando Selenium
URL: http://catalogoviti.politicheagricole.it/dopigp.php
"""

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup
import json
import re
import time
import requests
import PyPDF2
import io

class WineCatalogExtractor:
    def __init__(self, base_url="http://catalogoviti.politicheagricole.it/dopigp.php"):
        self.base_url = base_url
        self.wines = []
        self.driver = None

    def setup_driver(self):
        """Configura il driver Selenium"""
        print("Configurando Selenium WebDriver...")
        chrome_options = Options()
        chrome_options.add_argument('--headless')
        chrome_options.add_argument('--no-sandbox')
        chrome_options.add_argument('--disable-dev-shm-usage')
        chrome_options.add_argument('--disable-gpu')
        chrome_options.add_argument('--window-size=1920,1080')
        chrome_options.add_argument('user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')

        try:
            self.driver = webdriver.Chrome(options=chrome_options)
            print("✓ WebDriver configurato")
            return True
        except Exception as e:
            print(f"✗ Errore nella configurazione del WebDriver: {e}")
            print("\nProva a installare ChromeDriver:")
            print("  Ubuntu/Debian: sudo apt-get install chromium-chromedriver")
            print("  O scaricalo da: https://chromedriver.chromium.org/")
            return False

    def fetch_catalog_page(self):
        """Scarica la pagina principale del catalogo usando Selenium"""
        print(f"Scaricando la pagina del catalogo: {self.base_url}")
        try:
            self.driver.get(self.base_url)
            # Aspetta che la pagina sia caricata
            time.sleep(3)

            # Aspetta che ci siano elementi nella pagina
            WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.TAG_NAME, "body"))
            )

            html_content = self.driver.page_source
            print(f"✓ Pagina scaricata con successo")
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

        # Cerca tutti i link ai PDF
        all_links = soup.find_all('a', href=True)

        for link in all_links:
            href = link.get('href', '')

            # Cerca link che contengono .pdf o scheda
            if '.pdf' in href.lower() or 'scheda' in href.lower():
                wine_name = link.get_text(strip=True)

                # Costruisci URL completo
                if href.startswith('http'):
                    pdf_url = href
                else:
                    # URL relativo
                    from urllib.parse import urljoin
                    pdf_url = urljoin(self.base_url, href)

                if wine_name:
                    self.wines.append({
                        'name': wine_name,
                        'pdf_url': pdf_url,
                        'gusto': None,
                        'sapore': None,
                        'colore': None
                    })
                    print(f"  - Trovato: {wine_name}")

        # Se non troviamo link PDF, cerchiamo altre strutture
        if not self.wines:
            print("\n⚠ Nessun link PDF trovato. Analizzo altre strutture...")

            # Cerca tabelle
            tables = soup.find_all('table')
            print(f"  Trovate {len(tables)} tabelle")

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
                                from urllib.parse import urljoin
                                full_url = urljoin(self.base_url, href)
                                self.wines.append({
                                    'name': wine_name,
                                    'pdf_url': full_url,
                                    'gusto': None,
                                    'sapore': None,
                                    'colore': None
                                })
                                print(f"  - Trovato (da tabella): {wine_name}")

        print(f"\n✓ Trovati {len(self.wines)} vini")
        return self.wines

    def extract_text_from_pdf(self, pdf_url):
        """Scarica ed estrae il testo da un PDF"""
        try:
            print(f"  Scaricando PDF: {pdf_url}")

            session = requests.Session()
            session.headers.update({
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
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

            print(f"  ✓ Estratte {len(text)} caratteri dal PDF")
            return text
        except Exception as e:
            print(f"  ✗ Errore nell'estrazione del PDF: {e}")
            return None

    def extract_wine_properties(self, text):
        """Estrae gusto, sapore e colore dal testo del PDF"""
        if not text:
            return None, None, None

        text_lower = text.lower()
        gusto = None
        sapore = None
        colore = None

        # Cerca sezioni nel testo
        lines = text.split('\n')

        for i, line in enumerate(lines):
            line_lower = line.lower().strip()

            # Cerca colore
            if 'colore' in line_lower and not colore:
                # Prendi la riga successiva o il testo dopo i due punti
                if ':' in line:
                    colore = line.split(':', 1)[1].strip()
                elif i + 1 < len(lines):
                    colore = lines[i + 1].strip()

            # Cerca gusto
            if 'gusto' in line_lower and not gusto:
                if ':' in line:
                    gusto = line.split(':', 1)[1].strip()
                elif i + 1 < len(lines):
                    gusto = lines[i + 1].strip()

            # Cerca sapore
            if 'sapore' in line_lower and not sapore:
                if ':' in line:
                    sapore = line.split(':', 1)[1].strip()
                elif i + 1 < len(lines):
                    sapore = lines[i + 1].strip()

        # Cerca pattern di colore comuni se non trovato
        if not colore:
            colore_patterns = ['rosso rubino', 'rosso granato', 'bianco paglierino',
                             'rosato', 'giallo paglierino', 'rosso intenso',
                             'bianco', 'rosso', 'ambrato']
            for pattern in colore_patterns:
                if pattern in text_lower:
                    colore = pattern
                    break

        return gusto, sapore, colore

    def process_all_wines(self):
        """Processa tutti i vini estraendo i dati dai PDF"""
        print(f"\nProcessando {len(self.wines)} vini...")

        for i, wine in enumerate(self.wines, 1):
            print(f"\n[{i}/{len(self.wines)}] {wine['name']}")

            # Estrai testo dal PDF
            text = self.extract_text_from_pdf(wine['pdf_url'])

            if text:
                # Salva il testo estratto per debug (primi 500 caratteri)
                wine['pdf_sample'] = text[:500]

                # Estrai proprietà
                gusto, sapore, colore = self.extract_wine_properties(text)
                wine['gusto'] = gusto
                wine['sapore'] = sapore
                wine['colore'] = colore

                print(f"  Colore: {colore}")
                print(f"  Gusto: {gusto}")
                print(f"  Sapore: {sapore}")

            # Pausa per non sovraccaricare il server
            time.sleep(0.5)

        return self.wines

    def save_results(self, filename='wine_catalog.json'):
        """Salva i risultati in formato JSON"""
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(self.wines, f, ensure_ascii=False, indent=2)
        print(f"\n✓ Risultati salvati in {filename}")

        # Salva anche in formato CSV
        csv_filename = filename.replace('.json', '.csv')
        with open(csv_filename, 'w', encoding='utf-8') as f:
            f.write("Nome,Colore,Gusto,Sapore,PDF URL\n")
            for wine in self.wines:
                name = wine.get('name', '').replace('"', '""')
                colore = wine.get('colore', '').replace('"', '""') if wine.get('colore') else ''
                gusto = wine.get('gusto', '').replace('"', '""') if wine.get('gusto') else ''
                sapore = wine.get('sapore', '').replace('"', '""') if wine.get('sapore') else ''
                pdf_url = wine.get('pdf_url', '')
                f.write(f'"{name}","{colore}","{gusto}","{sapore}","{pdf_url}"\n')
        print(f"✓ Risultati salvati anche in {csv_filename}")

    def cleanup(self):
        """Chiude il driver Selenium"""
        if self.driver:
            self.driver.quit()
            print("\n✓ WebDriver chiuso")

    def run(self):
        """Esegue l'intero processo di estrazione"""
        print("=" * 60)
        print("ESTRAZIONE DATI CATALOGO VINI DOP/IGP")
        print("=" * 60)

        try:
            # 1. Setup Selenium
            if not self.setup_driver():
                return

            # 2. Scarica la pagina
            html = self.fetch_catalog_page()
            if not html:
                print("Impossibile scaricare la pagina. Uscita.")
                return

            # 3. Estrai lista vini
            self.parse_wine_list(html)

            if not self.wines:
                print("\nNessun vino trovato. Controlla 'catalog_page.html'")
                return

            print(f"\n✓ Trovati {len(self.wines)} vini nel catalogo")

            # 4. Processa i PDF
            self.process_all_wines()

            # 5. Salva risultati
            self.save_results()

            print("\n" + "=" * 60)
            print("COMPLETATO!")
            print("=" * 60)

        finally:
            self.cleanup()


if __name__ == "__main__":
    extractor = WineCatalogExtractor()
    extractor.run()
