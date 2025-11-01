#!/usr/bin/env python3
"""
Script per estrarre dati dal catalogo vini DOP/IGP
URL: http://catalogoviti.politicheagricole.it/dopigp.php
"""

import requests
from bs4 import BeautifulSoup
import json
import re
import os
import time
from urllib.parse import urljoin
import PyPDF2
import io

class WineCatalogExtractor:
    def __init__(self, base_url="http://catalogoviti.politicheagricole.it/dopigp.php"):
        self.base_url = base_url
        self.session = requests.Session()
        # Headers per evitare blocchi 403
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'it-IT,it;q=0.9,en-US;q=0.8,en;q=0.7',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1'
        })
        self.wines = []

    def fetch_catalog_page(self):
        """Scarica la pagina principale del catalogo"""
        print(f"Scaricando la pagina del catalogo: {self.base_url}")
        try:
            response = self.session.get(self.base_url, timeout=30)
            response.raise_for_status()
            print(f"✓ Pagina scaricata con successo (status code: {response.status_code})")
            return response.text
        except requests.exceptions.RequestException as e:
            print(f"✗ Errore nel download della pagina: {e}")
            return None

    def parse_wine_list(self, html_content):
        """Estrae la lista dei vini dalla pagina HTML"""
        print("\nParsing della pagina HTML...")
        soup = BeautifulSoup(html_content, 'html.parser')

        # Cerca tutti i link ai PDF o alle schede dei vini
        # La struttura esatta dipende dalla pagina, quindi cerchiamo vari pattern

        # Pattern 1: Link diretti ai PDF
        pdf_links = soup.find_all('a', href=re.compile(r'\.pdf$', re.I))

        # Pattern 2: Tabelle con nomi di vini
        wine_rows = soup.find_all('tr')

        # Pattern 3: Liste di vini
        wine_items = soup.find_all(['li', 'div'], class_=re.compile(r'wine|vino|prodotto', re.I))

        print(f"Trovati {len(pdf_links)} link PDF")
        print(f"Trovate {len(wine_rows)} righe di tabella")
        print(f"Trovati {len(wine_items)} elementi vino")

        # Estrai informazioni dai link PDF
        for link in pdf_links:
            wine_name = link.get_text(strip=True)
            pdf_url = urljoin(self.base_url, link.get('href'))

            if wine_name:
                self.wines.append({
                    'name': wine_name,
                    'pdf_url': pdf_url,
                    'gusto': None,
                    'sapore': None,
                    'colore': None
                })

        # Se non troviamo link PDF diretti, salviamo l'HTML per debug
        if not self.wines:
            with open('catalog_debug.html', 'w', encoding='utf-8') as f:
                f.write(html_content)
            print("\n⚠ Nessun vino trovato con i pattern standard.")
            print("HTML salvato in 'catalog_debug.html' per analisi manuale")

            # Stampa un campione della struttura HTML
            print("\n--- Campione della struttura HTML ---")
            print(soup.prettify()[:2000])

        return self.wines

    def extract_text_from_pdf(self, pdf_url):
        """Scarica ed estrae il testo da un PDF"""
        try:
            print(f"  Scaricando PDF: {pdf_url}")
            response = self.session.get(pdf_url, timeout=30)
            response.raise_for_status()

            # Leggi il PDF
            pdf_file = io.BytesIO(response.content)
            pdf_reader = PyPDF2.PdfReader(pdf_file)

            text = ""
            for page in pdf_reader.pages:
                text += page.extract_text() + "\n"

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

        # Pattern per cercare gusto
        gusto_patterns = [
            r'gusto[:\s]+([^\n\.]+)',
            r'al gusto[:\s]+([^\n\.]+)',
            r'caratteristiche gustative[:\s]+([^\n\.]+)'
        ]

        for pattern in gusto_patterns:
            match = re.search(pattern, text_lower)
            if match:
                gusto = match.group(1).strip()
                break

        # Pattern per cercare sapore
        sapore_patterns = [
            r'sapore[:\s]+([^\n\.]+)',
            r'al sapore[:\s]+([^\n\.]+)',
            r'profilo gustativo[:\s]+([^\n\.]+)'
        ]

        for pattern in sapore_patterns:
            match = re.search(pattern, text_lower)
            if match:
                sapore = match.group(1).strip()
                break

        # Pattern per cercare colore
        colore_patterns = [
            r'colore[:\s]+([^\n\.]+)',
            r'di colore[:\s]+([^\n\.]+)',
            r'caratteristiche visive[:\s]+([^\n\.]+)',
            r'rosso|bianco|rosato|ambrato|paglierino|rubino|granato'
        ]

        for pattern in colore_patterns:
            match = re.search(pattern, text_lower)
            if match:
                if '|' in pattern:  # È un pattern di match diretto
                    colore = match.group(0).strip()
                else:
                    colore = match.group(1).strip()
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
                # Estrai proprietà
                gusto, sapore, colore = self.extract_wine_properties(text)
                wine['gusto'] = gusto
                wine['sapore'] = sapore
                wine['colore'] = colore

                print(f"  ✓ Colore: {colore}")
                print(f"  ✓ Gusto: {gusto}")
                print(f"  ✓ Sapore: {sapore}")

            # Pausa per non sovraccaricare il server
            time.sleep(1)

        return self.wines

    def save_results(self, filename='wine_catalog.json'):
        """Salva i risultati in formato JSON"""
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(self.wines, f, ensure_ascii=False, indent=2)
        print(f"\n✓ Risultati salvati in {filename}")

        # Salva anche in formato CSV per facilità di lettura
        csv_filename = filename.replace('.json', '.csv')
        with open(csv_filename, 'w', encoding='utf-8') as f:
            f.write("Nome,Colore,Gusto,Sapore,PDF URL\n")
            for wine in self.wines:
                f.write(f'"{wine["name"]}","{wine.get("colore", "")}","{wine.get("gusto", "")}","{wine.get("sapore", "")}","{wine["pdf_url"]}"\n')
        print(f"✓ Risultati salvati anche in {csv_filename}")

    def run(self):
        """Esegue l'intero processo di estrazione"""
        print("=" * 60)
        print("ESTRAZIONE DATI CATALOGO VINI DOP/IGP")
        print("=" * 60)

        # 1. Scarica la pagina
        html = self.fetch_catalog_page()
        if not html:
            print("Impossibile scaricare la pagina. Uscita.")
            return

        # 2. Estrai lista vini
        self.parse_wine_list(html)

        if not self.wines:
            print("\nNessun vino trovato. Verifica la struttura della pagina.")
            return

        print(f"\n✓ Trovati {len(self.wines)} vini nel catalogo")

        # 3. Processa i PDF
        self.process_all_wines()

        # 4. Salva risultati
        self.save_results()

        print("\n" + "=" * 60)
        print("COMPLETATO!")
        print("=" * 60)


if __name__ == "__main__":
    extractor = WineCatalogExtractor()
    extractor.run()
