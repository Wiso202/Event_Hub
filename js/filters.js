// js/filters.js

function applyFilters() {
    // 1. Récupération des valeurs des éléments de filtrage
    const searchInput = document.getElementById('searchInput');
    const filterCountry = document.getElementById('filterCountry');
    const filterCategory = document.getElementById('filterCategory');

    // Sécurité au cas où les éléments n'existent pas sur la page
    if (!searchInput || !filterCountry || !filterCategory) return;

    const searchVal = searchInput.value.toLowerCase();
    const countryVal = filterCountry.value.toLowerCase();
    const categoryVal = filterCategory.value; // On garde la casse pour la catégorie

    // 2. Filtrage (allEvents est la variable globale définie dans votre app.js)
    const filteredResults = allEvents.filter(event => {
        // Vérification par Nom ou Ville
        const matchesSearch = event.Nom.toLowerCase().includes(searchVal) || 
                             event.Ville.toLowerCase().includes(searchVal);
        
        // Vérification par Pays
        const matchesCountry = countryVal === "" || (event.Pays && event.Pays.toLowerCase() === countryVal);
        
        // Vérification par Catégorie
        const matchesCategory = categoryVal === "" || event.Categorie === categoryVal;

        return matchesSearch && matchesCountry && matchesCategory;
    });

    // 3. Gestion de l'affichage
    const grid = document.getElementById('eventsGrid');
    if (!grid) return;

    if (filteredResults.length === 0) {
        // Message si aucun résultat
        grid.innerHTML = `
            <div class="col-12 text-center py-5" data-aos="fade-up">
                <i class="fa-solid fa-magnifying-glass fs-1 text-muted mb-3"></i>
                <h3 class="fw-bold">Aucun résultat trouvé</h3>
                <p class="text-muted">Essayez de modifier vos critères de recherche ou de choisir un autre pays.</p>
                <button class="btn btn-primary rounded-pill mt-3" onclick="resetFilters()">
                    <i class="fa-solid fa-rotate-left me-2"></i>Réinitialiser les filtres
                </button>
            </div>`;
        
        // Cacher la pagination si elle existe
        const pagination = document.getElementById('pagination');
        if (pagination) pagination.innerHTML = ''; 
    } else {
        // On utilise la technique du backup pour ne pas écraser définitivement allEvents
        const backupAllEvents = allEvents;
        allEvents = filteredResults;
        
        // On appelle la fonction de rendu (venant de app.js)
        if (typeof displayPage === "function") {
            displayPage(1); 
        } else if (typeof renderEvents === "function") {
            renderEvents(allEvents);
        }
        
        // On restaure la liste complète en mémoire
        allEvents = backupAllEvents;
    }
}

/**
 * Réinitialise tous les champs de recherche
 */
function resetFilters() {
    const searchInput = document.getElementById('searchInput');
    const filterCountry = document.getElementById('filterCountry');
    const filterCategory = document.getElementById('filterCategory');

    if (searchInput) searchInput.value = '';
    if (filterCountry) filterCountry.value = '';
    if (filterCategory) filterCategory.value = '';
    
    applyFilters();
}

/**
 * Initialisation des écouteurs d'événements au chargement du DOM
 */
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const filterCountry = document.getElementById('filterCountry');
    const filterCategory = document.getElementById('filterCategory');

    // Ajout des écouteurs "Input" pour la recherche et "Change" pour les sélections
    if (searchInput) searchInput.addEventListener('input', applyFilters);
    if (filterCountry) filterCountry.addEventListener('change', applyFilters);
    if (filterCategory) filterCategory.addEventListener('change', applyFilters);
});

function showLegal(type) {
    const title = type === 'terms' ? "Conditions Générales d'Utilisation" : "Politique de Confidentialité";
    const content = type === 'terms' ? 
        "En utilisant EventHub, vous acceptez de publier des informations véridiques sur vos événements. Flexitech se réserve le droit de supprimer tout contenu inapproprié ou frauduleux. L'utilisation du service est gratuite pour les utilisateurs, mais la responsabilité des événements organisés incombe exclusivement aux organisateurs déclarés." :
        "Vos données (email, nom) sont collectées uniquement pour le bon fonctionnement d'EventHub et pour vous envoyer notre newsletter si vous y avez souscrit. Flexitech s'engage à ne jamais vendre vos données à des tiers. Conformément aux lois en vigueur, vous disposez d'un droit d'accès et de suppression de vos informations sur simple demande par mail.";

    alert(title + "\n\n" + content); // Version simple. Vous pouvez aussi créer un Modal Bootstrap pour un rendu plus pro.
}

// --- Code pour la Newsletter (à ajouter à la fin de filters.js) ---
document.addEventListener('DOMContentLoaded', () => {
    const newsBtn = document.querySelector('footer .btn-primary');
    const newsInput = document.querySelector('footer input[type="text"]');

    if (newsBtn && newsInput) {
        newsBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const email = newsInput.value.trim();
            
            if (email && email.includes('@')) {
                // Animation de succès
                this.innerHTML = '<i class="fa fa-check"></i>';
                this.classList.replace('btn-primary', 'btn-success');
                this.disabled = true;
                newsInput.disabled = true;
                
                alert("Félicitations ! Flexitech vous enverra les prochains événements de l'EventHub.");
                console.log("Inscription Newsletter pour :", email);
            } else {
                alert("Oups ! Veuillez entrer une adresse email valide.");
                newsInput.focus();
            }
        });
    }
});




