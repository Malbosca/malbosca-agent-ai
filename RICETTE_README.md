# 🍝 Pagina Ricette Malbosca

Una pagina web interattiva per proporre ricette ai clienti basate sui prodotti disponibili nel catalogo Malbosca.

## 📋 Caratteristiche

- **Design Responsive**: Ottimizzato per desktop, tablet e mobile
- **Filtri Dinamici**: Filtra per categoria (antipasti, primi, secondi, contorni, dolci)
- **Ricerca Intelligente**: Cerca ricette per nome, descrizione o prodotti
- **Filtro Prodotti**: Seleziona prodotti specifici per trovare ricette correlate
- **Modal Dettagliato**: Visualizza ingredienti completi, istruzioni passo-passo e suggerimenti
- **12 Ricette Autentiche**: Ricette italiane tradizionali con prodotti di qualità

## 🚀 Installazione e Utilizzo

### Apertura Locale

1. Apri il file `ricette.html` direttamente nel browser
2. Non richiede server web o dipendenze esterne
3. Tutti i file devono essere nella stessa cartella:
   - `ricette.html`
   - `styles.css`
   - `app.js`
   - `recipes-data.js`

### Integrazione nel Sito Web

```html
<!-- Includi i file nella tua pagina -->
<link rel="stylesheet" href="path/to/styles.css">
<script src="path/to/recipes-data.js"></script>
<script src="path/to/app.js"></script>
```

## 📁 Struttura File

```
malbosca-agent-ai/
├── ricette.html          # Pagina HTML principale
├── styles.css            # Stili CSS
├── app.js                # Logica JavaScript
├── recipes-data.js       # Database delle ricette
└── RICETTE_README.md     # Questa documentazione
```

## 🎨 Personalizzazione

### Colori del Brand

I colori possono essere modificati nel file `styles.css` nelle variabili CSS:

```css
:root {
    --primary-color: #8B4513;      /* Marrone principale */
    --primary-dark: #654321;       /* Marrone scuro */
    --secondary-color: #D4AF37;    /* Oro */
    --accent-color: #C41E3A;       /* Rosso accento */
    --background-color: #F8F5F0;   /* Sfondo crema */
}
```

### Aggiungere Nuove Ricette

Modifica il file `recipes-data.js` e aggiungi un nuovo oggetto all'array `recipesData`:

```javascript
{
    id: 13,
    name: "Nome Ricetta",
    category: "primi", // antipasti, primi, secondi, contorni, dolci
    description: "Breve descrizione della ricetta",
    icon: "🍝", // Emoji rappresentativa
    difficulty: "Facile", // Facile, Media, Difficile
    time: "30 min",
    servings: 4,
    products: ["Prodotto1", "Prodotto2"], // Devono corrispondere ai tuoi prodotti
    ingredients: [
        "Ingrediente 1 con quantità",
        "Ingrediente 2 con quantità"
    ],
    instructions: [
        "Passo 1 della preparazione",
        "Passo 2 della preparazione"
    ],
    tips: "Suggerimento opzionale dello chef"
}
```

### Aggiungere Immagini Reali

Attualmente le ricette usano emoji come placeholder. Per aggiungere immagini:

1. Sostituisci in `app.js` la sezione dell'immagine:

```javascript
// Da:
<div class="recipe-image">${recipe.icon}</div>

// A:
<img src="${recipe.image}" alt="${recipe.name}" class="recipe-image">
```

2. Aggiungi il campo `image` in ogni ricetta in `recipes-data.js`:

```javascript
{
    id: 1,
    image: "images/tagliere-salumi.jpg",
    // ... resto della ricetta
}
```

## 🔧 Funzionalità Avanzate

### API Integration

Per integrare con un backend o CMS:

```javascript
// In app.js, sostituisci recipesData con:
let recipesData = [];

async function loadRecipes() {
    const response = await fetch('/api/recipes');
    recipesData = await response.json();
    renderRecipes();
}
```

### Google Analytics

Aggiungi tracking per monitorare quali ricette sono più popolari:

```javascript
// In openRecipeModal function
function openRecipeModal(recipe) {
    // ... codice esistente ...

    // Google Analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', 'view_recipe', {
            'recipe_name': recipe.name,
            'recipe_category': recipe.category
        });
    }
}
```

## 📱 Responsive Design

La pagina è ottimizzata per:
- Desktop (> 1024px)
- Tablet (768px - 1024px)
- Mobile (< 768px)

## 🌐 SEO Optimization

Per migliorare il SEO, aggiungi nel `<head>` di `ricette.html`:

```html
<meta name="description" content="Scopri ricette autentiche italiane con prodotti selezionati Malbosca">
<meta name="keywords" content="ricette italiane, prodotti tipici, cucina tradizionale">
<meta property="og:title" content="Ricette Malbosca">
<meta property="og:description" content="Ricette autentiche con prodotti di qualità">
<meta property="og:image" content="url-immagine-preview.jpg">
```

## 🎯 Ricette Incluse

1. **Antipasti**
   - Tagliere di Salumi e Formaggi
   - Bruschette al Pomodoro
   - Caprese Gourmet

2. **Primi Piatti**
   - Pasta alla Carbonara
   - Risotto al Tartufo Nero
   - Parmigiana di Melanzane
   - Penne all'Arrabbiata
   - Polenta con Funghi Porcini

3. **Secondi Piatti**
   - Bistecca alla Fiorentina
   - Ossobuco alla Milanese

4. **Dolci**
   - Tiramisù Classico
   - Panna Cotta ai Frutti di Bosco

## 🔄 Aggiornamenti Futuri

Possibili miglioramenti:
- [ ] Sistema di rating delle ricette
- [ ] Funzione "Ricette salvate" (favoriti)
- [ ] Condivisione social media
- [ ] Stampa ricetta in formato PDF
- [ ] Video tutorial per ogni ricetta
- [ ] Calcolo automatico calorie e valori nutrizionali
- [ ] Lista della spesa automatica
- [ ] Suggerimenti abbinamento vini

## 📞 Supporto

Per domande o assistenza, contattare il team di sviluppo Malbosca.

## 📄 Licenza

© 2025 Malbosca. Tutti i diritti riservati.
