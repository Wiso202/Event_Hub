// js/filters.js

function applyFilters() {
    const searchVal = document.getElementById('searchInput').value.toLowerCase().trim();
    const countryVal = document.getElementById('filterCountry').value.toLowerCase().trim();
    const categoryVal = document.getElementById('filterCategory').value.trim(); // Pas de toLowerCase ici si vos options HTML sont identiques aux données

    const filteredResults = allEvents.filter(event => {
        const matchesName = event.nom.toLowerCase().includes(searchVal);
        const matchesCountry = countryVal === "" || event.pays.toLowerCase() === countryVal;
        
        // Comparaison stricte pour la catégorie
        const matchesCategory = categoryVal === "" || event.categorie === categoryVal;

        return matchesName && matchesCountry && matchesCategory;
    });

    const grid = document.getElementById('eventsGrid');
    if (filteredResults.length === 0) {
        grid.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fa-solid fa-magnifying-glass fs-1 text-muted mb-3"></i>
                <h3 class="fw-bold">Aucun résultat trouvé</h3>
                <button class="btn btn-outline-primary rounded-pill mt-3" onclick="resetFilters()">Réinitialiser</button>
            </div>`;
        document.getElementById('pagination').innerHTML = '';
    } else {
        const backupAllEvents = allEvents;
        allEvents = filteredResults;
        displayPage(1);
        allEvents = backupAllEvents;
    }
}
function showLegal(type) {
    const title = type === 'terms' ? "Conditions Générales d'Utilisation" : "Politique de Confidentialité";
    const content = type === 'terms' ? 
        "En utilisant EventHub, vous acceptez de publier des informations véridiques sur vos événements. Flexitech se réserve le droit de supprimer tout contenu inapproprié ou frauduleux. L'utilisation du service est gratuite pour les utilisateurs, mais la responsabilité des événements organisés incombe exclusivement aux organisateurs déclarés." :
        "Vos données (email, nom) sont collectées uniquement pour le bon fonctionnement d'EventHub et pour vous envoyer notre newsletter si vous y avez souscrit. Flexitech s'engage à ne jamais vendre vos données à des tiers. Conformément aux lois en vigueur, vous disposez d'un droit d'accès et de suppression de vos informations sur simple demande par mail.";

    alert(title + "\n\n" + content); // Version simple. Vous pouvez aussi créer un Modal Bootstrap pour un rendu plus pro.
}
