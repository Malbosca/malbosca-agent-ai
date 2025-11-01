# malbosca-agent-ai
AI Agent per generazione automatica contenuti social Malbosca

## Estrattore Catalogo Vini DOP/IGP

Script per estrarre dati dal catalogo nazionale dei vini DOP/IGP italiano.

### Obiettivo

Estrarre da http://catalogoviti.politicheagricole.it/dopigp.php:
- Tutti i nomi dei vini presenti nel catalogo
- Per ogni vino: **gusto**, **sapore** e **colore** dai PDF allegati

### Output

Gli script generano due file:
- `wine_catalog.json` - Dati in formato JSON
- `wine_catalog.csv` - Dati in formato CSV (facile da aprire in Excel)

### Installazione Dipendenze

```bash
pip install -r requirements.txt
```

### Metodo 1: Script Automatico con Selenium (Consigliato)

Usa un browser headless per bypassare le protezioni anti-bot.

#### Prerequisiti

Installa ChromeDriver:

**Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install chromium-chromedriver
```

**macOS:**
```bash
brew install chromedriver
```

**Windows:**
Scarica da https://chromedriver.chromium.org/

#### Esecuzione

```bash
python extract_wine_catalog_selenium.py
```

Lo script:
1. ✓ Apre la pagina del catalogo con Selenium
2. ✓ Estrae tutti i link ai vini e ai PDF
3. ✓ Scarica ogni PDF
4. ✓ Estrae gusto, sapore e colore da ogni PDF
5. ✓ Salva i risultati in JSON e CSV

### Metodo 2: Script da HTML Salvato (Alternativo)

Se il metodo automatico non funziona, usa questo approccio:

#### Passaggi

1. **Salva manualmente la pagina del catalogo:**
   - Apri http://catalogoviti.politicheagricole.it/dopigp.php nel browser
   - Clicca con il tasto destro → "Salva con nome..."
   - Salva come `catalogo_vini.html`

2. **Esegui lo script:**
   ```bash
   python extract_from_saved_html.py catalogo_vini.html
   ```

   Oppure senza argomenti (ti chiederà il percorso):
   ```bash
   python extract_from_saved_html.py
   ```

### Metodo 3: Script Base (Più Semplice, Può Fallire)

Tentativo diretto senza browser:

```bash
python extract_wine_catalog.py
```

**Nota:** Potrebbe fallire con errore 403 a causa delle protezioni del sito.

### Struttura Output

#### JSON (`wine_catalog.json`)
```json
[
  {
    "name": "Chianti DOCG",
    "pdf_url": "http://...",
    "colore": "rosso rubino",
    "gusto": "asciutto, armonico",
    "sapore": "gradevole, persistente"
  }
]
```

#### CSV (`wine_catalog.csv`)
```csv
Nome,Colore,Gusto,Sapore,PDF URL
"Chianti DOCG","rosso rubino","asciutto, armonico","gradevole, persistente","http://..."
```

### File Generati

- `catalog_page.html` - Copia della pagina per debug
- `parsed_catalog.html` - Versione parsata per debug
- `wine_catalog.json` - Risultati in JSON
- `wine_catalog.csv` - Risultati in CSV

### Risoluzione Problemi

**Errore 403 Forbidden:** Il sito blocca le richieste automatiche. Usa il Metodo 1 (Selenium) o Metodo 2 (HTML salvato).

**ChromeDriver non trovato:** Installa ChromeDriver seguendo le istruzioni sopra.

**Nessun vino trovato:** Controlla `catalog_page.html` per verificare se la pagina è stata scaricata correttamente.
