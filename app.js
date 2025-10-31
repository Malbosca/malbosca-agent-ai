// Stato dell'applicazione
let currentCategory = 'all';
let selectedProducts = [];
let searchQuery = '';

// Inizializzazione
document.addEventListener('DOMContentLoaded', function() {
    initializeProductTags();
    initializeFilters();
    initializeSearch();
    initializeModal();
    renderRecipes();
});

// Generazione dinamica dei tag prodotti
function initializeProductTags() {
    const productTagsContainer = document.getElementById('productTags');

    allProducts.forEach(product => {
        const tag = document.createElement('div');
        tag.className = 'product-tag';
        tag.textContent = product;
        tag.dataset.product = product;

        tag.addEventListener('click', function() {
            this.classList.toggle('active');
            toggleProductFilter(product);
        });

        productTagsContainer.appendChild(tag);
    });
}

// Gestione filtri categoria
function initializeFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Rimuovi active da tutti i bottoni
            filterButtons.forEach(btn => btn.classList.remove('active'));

            // Aggiungi active al bottone cliccato
            this.classList.add('active');

            // Aggiorna categoria corrente
            currentCategory = this.dataset.category;

            // Renderizza le ricette filtrate
            renderRecipes();
        });
    });
}

// Gestione ricerca
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');

    searchInput.addEventListener('input', function(e) {
        searchQuery = e.target.value.toLowerCase();
        renderRecipes();
    });
}

// Toggle filtro prodotto
function toggleProductFilter(product) {
    const index = selectedProducts.indexOf(product);

    if (index > -1) {
        selectedProducts.splice(index, 1);
    } else {
        selectedProducts.push(product);
    }

    renderRecipes();
}

// Filtra ricette in base ai criteri
function filterRecipes() {
    return recipesData.filter(recipe => {
        // Filtro categoria
        const categoryMatch = currentCategory === 'all' || recipe.category === currentCategory;

        // Filtro prodotti (se ci sono prodotti selezionati, la ricetta deve contenerne almeno uno)
        const productsMatch = selectedProducts.length === 0 ||
            selectedProducts.some(product => recipe.products.includes(product));

        // Filtro ricerca
        const searchMatch = searchQuery === '' ||
            recipe.name.toLowerCase().includes(searchQuery) ||
            recipe.description.toLowerCase().includes(searchQuery) ||
            recipe.products.some(p => p.toLowerCase().includes(searchQuery));

        return categoryMatch && productsMatch && searchMatch;
    });
}

// Renderizza le ricette
function renderRecipes() {
    const recipesGrid = document.getElementById('recipesGrid');
    const recipeCount = document.getElementById('recipeCount');
    const filteredRecipes = filterRecipes();

    // Aggiorna contatore
    recipeCount.textContent = `${filteredRecipes.length} ricette trovate`;

    // Pulisci griglia
    recipesGrid.innerHTML = '';

    if (filteredRecipes.length === 0) {
        recipesGrid.innerHTML = `
            <div class="no-results">
                <h3>Nessuna ricetta trovata</h3>
                <p>Prova a modificare i filtri o la ricerca</p>
            </div>
        `;
        return;
    }

    // Crea card per ogni ricetta
    filteredRecipes.forEach(recipe => {
        const card = createRecipeCard(recipe);
        recipesGrid.appendChild(card);
    });
}

// Crea card ricetta
function createRecipeCard(recipe) {
    const card = document.createElement('div');
    card.className = 'recipe-card';
    card.dataset.recipeId = recipe.id;

    // Traduci categoria
    const categoryTranslations = {
        'antipasti': 'Antipasti',
        'primi': 'Primi Piatti',
        'secondi': 'Secondi Piatti',
        'contorni': 'Contorni',
        'dolci': 'Dolci'
    };

    const categoryLabel = categoryTranslations[recipe.category] || recipe.category;

    card.innerHTML = `
        <div class="recipe-image">${recipe.icon}</div>
        <div class="recipe-content">
            <span class="recipe-category">${categoryLabel}</span>
            <h3>${recipe.name}</h3>
            <p class="recipe-description">${recipe.description}</p>
            <div class="recipe-meta">
                <span>⏱️ ${recipe.time}</span>
                <span>👥 ${recipe.servings} persone</span>
                <span>📊 ${recipe.difficulty}</span>
            </div>
            <div class="recipe-products">
                ${recipe.products.map(product =>
                    `<span class="product-badge">${product}</span>`
                ).join('')}
            </div>
        </div>
    `;

    // Aggiungi evento click per aprire il modal
    card.addEventListener('click', () => openRecipeModal(recipe));

    return card;
}

// Gestione Modal
function initializeModal() {
    const modal = document.getElementById('recipeModal');
    const closeBtn = document.querySelector('.close');

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Chiudi con ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
        }
    });
}

// Apri modal con dettagli ricetta
function openRecipeModal(recipe) {
    const modal = document.getElementById('recipeModal');
    const modalBody = document.getElementById('modalBody');

    const categoryTranslations = {
        'antipasti': 'Antipasti',
        'primi': 'Primi Piatti',
        'secondi': 'Secondi Piatti',
        'contorni': 'Contorni',
        'dolci': 'Dolci'
    };

    const categoryLabel = categoryTranslations[recipe.category] || recipe.category;

    modalBody.innerHTML = `
        <div class="modal-header">
            <h2>${recipe.icon} ${recipe.name}</h2>
            <div style="display: flex; gap: 20px; margin-top: 15px; font-size: 0.95rem;">
                <span>⏱️ ${recipe.time}</span>
                <span>👥 ${recipe.servings} persone</span>
                <span>📊 ${recipe.difficulty}</span>
                <span>🍽️ ${categoryLabel}</span>
            </div>
        </div>

        <div class="modal-body">
            <div class="modal-section">
                <h3>📝 Ingredienti</h3>
                <ul class="ingredients-list">
                    ${recipe.ingredients.map(ingredient =>
                        `<li>${ingredient}</li>`
                    ).join('')}
                </ul>
            </div>

            <div class="modal-section">
                <h3>👨‍🍳 Preparazione</h3>
                <ol class="instructions-list">
                    ${recipe.instructions.map(instruction =>
                        `<li>${instruction}</li>`
                    ).join('')}
                </ol>
            </div>

            ${recipe.tips ? `
                <div class="modal-section">
                    <h3>💡 Suggerimento dello Chef</h3>
                    <p style="line-height: 1.8; color: var(--text-color);">${recipe.tips}</p>
                </div>
            ` : ''}

            <div class="modal-section">
                <h3>🛒 Prodotti Malbosca Utilizzati</h3>
                <div class="modal-products">
                    ${recipe.products.map(product =>
                        `<span class="modal-product-badge">${product}</span>`
                    ).join('')}
                </div>
            </div>
        </div>
    `;

    modal.style.display = 'block';

    // Scroll to top del modal
    modal.scrollTop = 0;
}

// Utility: Capitalizza prima lettera
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Debug: stampa stato corrente (per sviluppo)
function debugState() {
    console.log('Current State:', {
        category: currentCategory,
        products: selectedProducts,
        search: searchQuery,
        filteredCount: filterRecipes().length
    });
}
