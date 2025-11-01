# Stato del Progetto: Estrazione Catalogo Vini DOP/IGP

## 📊 Avanzamento

### ✅ Completato
1. **Script creati e funzionanti:**
   - `extract_wine_catalog.py` - Script base con requests
   - `extract_wine_catalog_selenium.py` - Script con Selenium
   - `extract_wine_catalog_playwright.py` - Script con Playwright
   - `extract_from_saved_html.py` - Script per HTML salvato

2. **Scoperta della struttura dati:**
   - La pagina usa caricamento dinamico AJAX
   - I dati vengono da: `post3.php`
   - Formato: JSON con array di vini

3. **Primi dati raccolti:**
   - DOCG Pagina 1/3 (primi 30 vini su 74 totali)
   - File salvato: `dati_parziali_docg_page1.json`

### ⏳ Da Completare

1. **Raccolta dati completa:**
   - [ ] DOCG Pagina 2/3 (vini 31-60)
   - [ ] DOCG Pagina 3/3 (vini 61-74)
   - [ ] DOC (tutte le pagine)
   - [ ] IGT (tutte le pagine)

2. **Estrazione da denominazioni.php:**
   - Ogni vino ha una pagina: `denominazioni.php?codice=XXXX`
   - In quella pagina ci dovrebbe essere il link al PDF
   - Dal PDF estrarre: gusto, sapore, colore

3. **Processing finale:**
   - Unire tutti i dati
   - Scaricare e analizzare i PDF
   - Estrarre le proprietà organolettiche
   - Generare file finali JSON e CSV

---

## 🔄 Come Riprendere

### Prossimi Passi:

**1. Completa la raccolta dati AJAX**

Apri http://catalogoviti.politicheagricole.it/dopigp.php nel browser e:

#### Metodo A - Pagina per Pagina (Manuale):
- Premi F12 → tab Network
- Clicca pagina 2, copia risposta JSON di post3.php
- Clicca pagina 3, copia risposta JSON
- Clicca tab "DOC", copia tutte le pagine
- Clicca tab "IGT", copia tutte le pagine

#### Metodo B - Tutto in Una Volta (Console):
Esegui questo nella Console (F12 → Console):

```javascript
// DOCG (tutti)
fetch('http://catalogoviti.politicheagricole.it/post3.php', {
  method: 'POST',
  headers: {'Content-Type': 'application/x-www-form-urlencoded'},
  body: 'page=1&rp=100&sortname=nome&sortorder=asc&elencoden_sel=DOCG'
})
.then(r => r.json())
.then(data => console.log('DOCG:', JSON.stringify(data)))

// DOC (tutti)
fetch('http://catalogoviti.politicheagricole.it/post3.php', {
  method: 'POST',
  headers: {'Content-Type': 'application/x-www-form-urlencoded'},
  body: 'page=1&rp=1000&sortname=nome&sortorder=asc&elencoden_sel=DOC'
})
.then(r => r.json())
.then(data => console.log('DOC:', JSON.stringify(data)))

// IGT (tutti)
fetch('http://catalogoviti.politicheagricole.it/post3.php', {
  method: 'POST',
  headers: {'Content-Type': 'application/x-www-form-urlencoded'},
  body: 'page=1&rp=1000&sortname=nome&sortorder=asc&elencoden_sel=IGT'
})
.then(r => r.json())
.then(data => console.log('IGT:', JSON.stringify(data)))
```

Copia gli output e salvali in:
- `dati_completi_docg.json`
- `dati_completi_doc.json`
- `dati_completi_igt.json`

**2. Esegui lo script di processing**

Una volta raccolti tutti i dati JSON, eseguirò:
```bash
python process_wine_data.py
```

Questo script:
- Leggerà tutti i file JSON
- Per ogni vino, accederà a `denominazioni.php?codice=XXXX`
- Troverà il link al PDF
- Scaricherà e analizzerà il PDF
- Estrarrà gusto, sapore, colore
- Genererà i file finali

---

## 📁 File Creati

### Script Principali
- `extract_wine_catalog.py`
- `extract_wine_catalog_selenium.py`
- `extract_wine_catalog_playwright.py`
- `extract_from_saved_html.py`

### Configurazione
- `requirements.txt`

### Dati Parziali
- `dati_parziali_docg_page1.json` (30 vini DOCG)

### Documentazione
- `README.md` (istruzioni complete)
- `STATO_PROGETTO.md` (questo file)

---

## 🎯 Obiettivo Finale

Generare:
- `wine_catalog.json` - Tutti i vini con gusto, sapore, colore
- `wine_catalog.csv` - Formato CSV per Excel

Con struttura:
```json
{
  "name": "Nome Vino",
  "category": "DOCG/DOC/IGT",
  "region": "Regione",
  "pdf_url": "http://...",
  "colore": "rosso rubino",
  "gusto": "asciutto, armonico",
  "sapore": "gradevole, persistente"
}
```

---

**Data ultimo aggiornamento:** 2025-11-01
**Vini raccolti:** 30/~500+
**Completamento:** ~5%
