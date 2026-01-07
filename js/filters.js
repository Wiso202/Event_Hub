// js/filters.js

function applyFilters() {
    // 1. Récupération des valeurs
    const searchVal = document.getElementById('searchInput').value.toLowerCase();
    const countryVal = document.getElementById('filterCountry').value.toLowerCase();
    const categoryVal = document.getElementById('filterCategory').value.toLowerCase();

    // 2. Filtrage (allEvents est défini dans votre app.js)
    const filteredResults = allEvents.filter(event => {
        const matchesName = event.nom.toLowerCase().includes(searchVal);
        const matchesCountry = countryVal === "" || event.pays.toLowerCase() === countryVal;
        const matchesCategory = categoryVal === "" || event.categorie.toLowerCase() === categoryVal;
        return matchesName && matchesCountry && matchesCategory;
    });

    // 3. Gestion de l'affichage "Aucun résultat"
    const grid = document.getElementById('eventsGrid');
    if (filteredResults.length === 0) {
        grid.innerHTML = `
            <div class="col-12 text-center py-5" data-aos="fade-up">
                <i class="fa-solid fa-magnifying-glass fs-1 text-muted mb-3"></i>
                <h3 class="fw-bold">Aucun résultat trouvé</h3>
                <p class="text-muted">Essayez de modifier vos critères de recherche ou de choisir un autre pays.</p>
                <button class="btn btn-outline-primary rounded-pill mt-3" onclick="resetFilters()">Réinitialiser les filtres</button>
            </div>`;
        document.getElementById('pagination').innerHTML = ''; // Cache la pagination
    } else {
        // On utilise la même astuce : sauvegarde, affichage, puis restauration
        const backupAllEvents = allEvents;
        allEvents = filteredResults;
        displayPage(1); // Appel de la fonction originale de app.js
        allEvents = backupAllEvents;
    }
}

// Fonction pour vider les filtres rapidement
function resetFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('filterCountry').value = '';
    document.getElementById('filterCategory').value = '';
    applyFilters();
}

// Initialisation des écouteurs
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const filterCountry = document.getElementById('filterCountry');
    const filterCategory = document.getElementById('filterCategory');

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







