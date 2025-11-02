#!/usr/bin/env python3
"""
Script per analizzare i PDF scaricati ed estrarre gusto, sapore e colore
"""

import json
import os
import PyPDF2
from pathlib import Path

class PDFAnalyzer:
    def __init__(self, pdfs_folder='pdfs', urls_file='pdf_urls.json'):
        self.pdfs_folder = pdfs_folder
        self.urls_file = urls_file
        self.results = []

    def load_wine_data(self):
        """Carica i dati dei vini con gli URL"""
        with open(self.urls_file, 'r', encoding='utf-8') as f:
            return json.load(f)

    def extract_text_from_pdf(self, pdf_path):
        """Estrae il testo da un PDF"""
        try:
            with open(pdf_path, 'rb') as f:
                pdf_reader = PyPDF2.PdfReader(f)
                text = ""
                for page in pdf_reader.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n"
                return text
        except Exception as e:
            print(f"    ⚠ Errore nell'estrazione: {e}")
            return None

    def extract_wine_properties(self, text):
        """Estrae gusto, sapore e colore dal testo"""
        if not text:
            return None, None, None

        gusto = None
        sapore = None
        colore = None

        lines = [line.strip() for line in text.split('\n') if line.strip()]

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

    def analyze_all_pdfs(self):
        """Analizza tutti i PDF scaricati"""
        wine_data = self.load_wine_data()

        print("="*70)
        print("ANALISI PDF VINI")
        print("="*70)
        print(f"\nCartella PDF: {self.pdfs_folder}/")
        print(f"Vini da processare: {len(wine_data)}\n")

        if not os.path.exists(self.pdfs_folder):
            print(f"❌ Cartella '{self.pdfs_folder}/' non trovata!")
            print(f"\nCrea la cartella e scarica i PDF prima di eseguire questo script.")
            return

        for i, wine in enumerate(wine_data, 1):
            wine_id = wine['id']
            name = wine['name']
            region = wine['region']

            print(f"[{i}/{len(wine_data)}] {name} ({region})")

            # Cerca il PDF
            # Prova vari pattern di nome
            possible_names = [
                f"wine_{wine_id}.pdf",
                f"{wine_id}.pdf",
                f"scheda_denom.php_t=stc_q={wine_id}.pdf",
                f"{name.replace(' ', '_').replace('/', '-')}.pdf"
            ]

            pdf_path = None
            for pdf_name in possible_names:
                test_path = os.path.join(self.pdfs_folder, pdf_name)
                if os.path.exists(test_path):
                    pdf_path = test_path
                    break

            if not pdf_path:
                print(f"  ❌ PDF non trovato")
                self.results.append({
                    **wine,
                    'pdf_found': False,
                    'colore': None,
                    'gusto': None,
                    'sapore': None
                })
                continue

            print(f"  ✓ PDF trovato: {os.path.basename(pdf_path)}")

            # Estrai testo
            print(f"  📄 Estraendo testo...")
            text = self.extract_text_from_pdf(pdf_path)

            if text:
                print(f"  ✓ Estratti {len(text)} caratteri")

                # Estrai proprietà
                gusto, sapore, colore = self.extract_wine_properties(text)

                print(f"  🍷 Colore: {colore if colore else '❌ Non trovato'}")
                print(f"  👅 Gusto:  {gusto if gusto else '❌ Non trovato'}")
                print(f"  👄 Sapore: {sapore if sapore else '❌ Non trovato'}")

                self.results.append({
                    **wine,
                    'pdf_found': True,
                    'pdf_file': os.path.basename(pdf_path),
                    'colore': colore,
                    'gusto': gusto,
                    'sapore': sapore
                })
            else:
                print(f"  ❌ Impossibile estrarre testo")
                self.results.append({
                    **wine,
                    'pdf_found': True,
                    'pdf_file': os.path.basename(pdf_path),
                    'colore': None,
                    'gusto': None,
                    'sapore': None
                })

            print()

    def save_results(self, output_file='wine_catalog_final.json'):
        """Salva i risultati finali"""
        # JSON
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(self.results, f, ensure_ascii=False, indent=2)
        print(f"✓ Risultati salvati in: {output_file}")

        # CSV
        csv_file = output_file.replace('.json', '.csv')
        with open(csv_file, 'w', encoding='utf-8') as f:
            f.write("Nome,Regione,Colore,Gusto,Sapore,PDF URL\n")
            for wine in self.results:
                name = (wine.get('name', '') or '').replace('"', '""')
                region = (wine.get('region', '') or '').replace('"', '""')
                colore = (wine.get('colore', '') or '').replace('"', '""')
                gusto = (wine.get('gusto', '') or '').replace('"', '""')
                sapore = (wine.get('sapore', '') or '').replace('"', '""')
                pdf_url = wine.get('pdf_url', '') or ''
                f.write(f'"{name}","{region}","{colore}","{gusto}","{sapore}","{pdf_url}"\n')
        print(f"✓ Risultati salvati in: {csv_file}")

        # Statistiche
        print(f"\n{'='*70}")
        print("STATISTICHE FINALI:")
        print("="*70)
        print(f"Vini totali:       {len(self.results)}")
        print(f"PDF trovati:       {sum(1 for w in self.results if w.get('pdf_found'))}")
        print(f"Con colore:        {sum(1 for w in self.results if w.get('colore'))}")
        print(f"Con gusto:         {sum(1 for w in self.results if w.get('gusto'))}")
        print(f"Con sapore:        {sum(1 for w in self.results if w.get('sapore'))}")
        print(f"Dati completi:     {sum(1 for w in self.results if w.get('colore') and w.get('gusto') and w.get('sapore'))}")

    def run(self):
        """Esegue l'intero processo"""
        self.analyze_all_pdfs()
        if self.results:
            self.save_results()
            print(f"\n{'='*70}")
            print("✓ COMPLETATO!")
            print("="*70)
        else:
            print("\n❌ Nessun risultato da salvare")

if __name__ == "__main__":
    analyzer = PDFAnalyzer()
    analyzer.run()
