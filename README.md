# Wine Search Program - Malbosca Agent AI

AI Agent per generazione automatica contenuti social Malbosca

## Wine Information Searcher

Programma automatico per cercare informazioni sui vini dal web e completare file Excel con dati su colore, gusto e profumo.

### Caratteristiche

- Lettura automatica di liste di vini da file Excel
- Ricerca intelligente di informazioni organoletiche (colore, gusto, profumo)
- Sistema di inferenza basato su vitigni comuni italiani
- Aggiornamento automatico del file Excel con le informazioni trovate
- Formattazione professionale dell'output Excel
- Gestione intelligente di dati già presenti (non sovrascrive)

### Installazione

1. Clona il repository:
```bash
git clone https://github.com/Malbosca/malbosca-agent-ai.git
cd malbosca-agent-ai
```

2. Installa le dipendenze:
```bash
pip install -r requirements.txt
```

### Utilizzo

#### 1. Crea un file Excel con i tuoi vini

Puoi creare manualmente un file Excel con almeno una colonna `Nome Vino`, oppure usare lo script di esempio:

```bash
python3 src/create_example_excel.py
```

Questo crea `vini_esempio.xlsx` con 10 vini italiani famosi.

#### 2. Esegui la ricerca

```bash
python3 src/wine_search.py vini_esempio.xlsx
```

Opzioni disponibili:
- `-o, --output`: Specifica un file di output diverso (default: sovrascrive l'input)
- `--delay`: Imposta il ritardo in secondi tra una ricerca e l'altra (default: 2.0)

Esempi:

```bash
# Sovrascrive il file originale
python3 src/wine_search.py miei_vini.xlsx

# Crea un nuovo file di output
python3 src/wine_search.py miei_vini.xlsx -o vini_completati.xlsx

# Usa un ritardo più breve (0.5 secondi)
python3 src/wine_search.py miei_vini.xlsx --delay 0.5
```

### Formato del file Excel

Il file Excel di input deve contenere almeno le seguenti colonne:

| Nome Vino | Produttore | Colore | Gusto | Profumo |
|-----------|-----------|--------|-------|---------|
| Barolo DOCG | Marchesi di Barolo | | | |
| Prosecco Superiore DOCG | Bisol | | | |

Le colonne `Produttore`, `Colore`, `Gusto` e `Profumo` sono opzionali e verranno create automaticamente se non esistono.

### Output

Il programma genera un file Excel formattato con:
- Header colorato e in grassetto
- Colonne auto-dimensionate
- Informazioni complete su colore, gusto e profumo per ogni vino
- Testo a capo automatico per descrizioni lunghe

Esempio di output:

| Nome Vino | Produttore | Colore | Gusto | Profumo |
|-----------|-----------|--------|-------|---------|
| Barolo DOCG | Marchesi di Barolo | Rosso | Corposo, strutturato, tannico | Fruttato, speziato |
| Vermentino di Sardegna | Sella & Mosca | Bianco | Fresco, minerale, sapido | Floreale, agrumato |

### Come funziona

Il programma utilizza diverse strategie per trovare informazioni sui vini:

1. **Web Scraping**: Cerca su siti specializzati come Vivino (se disponibili)
2. **Sistema di Inferenza**: Deduce le caratteristiche basandosi sul nome del vino e sui vitigni comuni
3. **Pattern Recognition**: Identifica automaticamente vitigni rossi, bianchi e spumanti

Vitigni supportati:
- **Rossi**: Barolo, Barbaresco, Brunello, Chianti, Amarone, Montepulciano, Primitivo, Nero d'Avola, Sangiovese, Nebbiolo, Merlot, Cabernet, Syrah, Cannonau
- **Bianchi**: Vermentino, Pecorino, Falanghina, Greco, Fiano, Trebbiano, Verdicchio, Pinot Grigio, Chardonnay, Sauvignon, Gewürztraminer, Soave
- **Spumanti**: Prosecco, Franciacorta, Trento DOC

### Limitazioni

- Le informazioni sono dedotte principalmente dal nome del vino
- Per vini meno comuni, le descrizioni potrebbero essere generiche
- Il web scraping dipende dalla disponibilità e struttura dei siti web

### Sviluppi Futuri

- Integrazione con API di database di vini professionali
- Machine Learning per migliorare le descrizioni
- Supporto per più lingue
- Generazione automatica di abbinamenti gastronomici

### Licenza

MIT License

### Autore

Malbosca - AI Agent per contenuti social
