#!/usr/bin/env python3
"""
Script per generare gli URL diretti di tutti i PDF dei vini
Una volta generati, l'utente può scaricarli dal browser (aggira protezioni anti-bot)
"""

import json

def generate_pdf_urls(json_file):
    """Genera gli URL diretti dei PDF basandosi sul pattern trovato"""

    # Carica i dati JSON
    with open(json_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    rows = data.get('rows', [])
    pdf_urls = []

    print("="*70)
    print("GENERAZIONE URL PDF VINI")
    print("="*70)
    print(f"\nTrovati {len(rows)} vini\n")

    for row in rows:
        wine_id = row.get('id')
        cell = row.get('cell', [])

        if len(cell) >= 2:
            # Estrai nome dal HTML
            html_link = cell[0]
            import re
            match = re.search(r'>([^<]+)<', html_link)
            name = match.group(1) if match else 'Unknown'

            region = cell[1]

            # Genera URL diretto del PDF
            pdf_url = f"http://catalogoviti.politicheagricole.it/scheda_denom.php?t=stc&q={wine_id}"

            pdf_urls.append({
                'id': wine_id,
                'name': name,
                'region': region,
                'pdf_url': pdf_url
            })

            print(f"✓ {name} ({region})")
            print(f"  {pdf_url}\n")

    return pdf_urls

def save_urls_list(pdf_urls, output_file='pdf_urls.json'):
    """Salva la lista degli URL in vari formati"""

    # JSON
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(pdf_urls, f, ensure_ascii=False, indent=2)
    print(f"\n✓ URLs salvati in: {output_file}")

    # Lista semplice TXT
    txt_file = output_file.replace('.json', '.txt')
    with open(txt_file, 'w', encoding='utf-8') as f:
        for wine in pdf_urls:
            f.write(f"{wine['pdf_url']}\n")
    print(f"✓ URLs salvati in: {txt_file}")

    # HTML con link cliccabili
    html_file = output_file.replace('.json', '.html')
    with open(html_file, 'w', encoding='utf-8') as f:
        f.write("""<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Catalogo Vini - PDF Links</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #8B0000; }
        .wine { margin: 15px 0; padding: 10px; border-left: 3px solid #8B0000; }
        .wine-name { font-weight: bold; font-size: 16px; }
        .wine-region { color: #666; font-style: italic; }
        a { color: #0066cc; text-decoration: none; }
        a:hover { text-decoration: underline; }
        .download-all {
            background: #8B0000;
            color: white;
            padding: 10px 20px;
            margin: 20px 0;
            display: inline-block;
            cursor: pointer;
            border-radius: 5px;
        }
    </style>
</head>
<body>
    <h1>🍷 Catalogo Vini DOP/IGP - Link PDF</h1>
    <p>Clicca sui link per scaricare i PDF individuali, oppure usa un download manager per scaricarli tutti.</p>
    <p><strong>Totale vini:</strong> """ + str(len(pdf_urls)) + """</p>

    <div id="wines">
""")

        for wine in pdf_urls:
            f.write(f"""
        <div class="wine">
            <div class="wine-name">{wine['name']}</div>
            <div class="wine-region">{wine['region']}</div>
            <a href="{wine['pdf_url']}" target="_blank" download="wine_{wine['id']}.pdf">
                📄 Scarica PDF (ID: {wine['id']})
            </a>
        </div>
""")

        f.write("""
    </div>
</body>
</html>
""")
    print(f"✓ HTML con links salvato in: {html_file}")

    print(f"\n{'='*70}")
    print("COMPLETATO!")
    print("="*70)
    print(f"\nOra puoi:")
    print(f"1. Aprire {html_file} nel browser e scaricare i PDF")
    print(f"2. Usare {txt_file} con un download manager")
    print(f"3. Salvare i PDF nella cartella 'pdfs/'")
    print(f"4. Eseguire: python analyze_pdfs.py")

if __name__ == "__main__":
    pdf_urls = generate_pdf_urls('dati_parziali_docg_page1.json')
    save_urls_list(pdf_urls)
