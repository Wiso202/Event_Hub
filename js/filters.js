// js/filters.js

/**
 * Cette fonction intercepte les données, les filtre, 
 * et met à jour les variables globales de app.js
 */
function applyFilters() {
    // 1. Récupération des valeurs des filtres
    const searchVal = document.getElementById('searchInput').value.toLowerCase();
    const countryVal = document.getElementById('filterCountry').value.toLowerCase();
    const categoryVal = document.getElementById('filterCategory').value.toLowerCase();

    // 2. Filtrage de la liste globale 'allEvents' (définie dans app.js)
    // On crée une version filtrée que l'on va passer temporairement à l'affichage
    const filteredResults = allEvents.filter(event => {
        const matchesName = event.nom.toLowerCase().includes(searchVal);
        const matchesCountry = countryVal === "" || event.pays.toLowerCase() === countryVal;
        const matchesCategory = categoryVal === "" || event.categorie === categoryVal;

        return matchesName && matchesCountry && matchesCategory;
    });

    // 3. Astuce pour forcer l'affichage sans modifier app.js :
    // On sauvegarde temporairement la liste complète
    const backupAllEvents = allEvents;
    
    // On remplace allEvents par les résultats filtrés pour que displayPage les utilise
    allEvents = filteredResults;
    
    // On réinitialise à la page 1 et on affiche
    displayPage(1);
    
    // On restaure la liste complète dans la variable globale pour les prochains filtres
    allEvents = backupAllEvents;
}

/**
 * Initialisation des écouteurs sur la barre de recherche et les selects
 */
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const filterCountry = document.getElementById('filterCountry');
    const filterCategory = document.getElementById('filterCategory');

    if (searchInput) searchInput.addEventListener('input', applyFilters);
    if (filterCountry) filterCountry.addEventListener('change', applyFilters);
    if (filterCategory) filterCategory.addEventListener('change', applyFilters);
});
