/**
 * Gestion du filtrage depuis la page d'accueil (index.html)
 */
document.addEventListener('DOMContentLoaded', () => {
    // On cible les éléments de recherche dans la Hero Section de l'index
    const heroSearchBtn = document.querySelector('.hero button');
    const heroInput = document.querySelector('.hero input[type="text"]');
    const heroSelect = document.querySelector('.hero select');

    if (heroSearchBtn) {
        heroSearchBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            const query = heroInput.value.trim();
            const city = heroSelect.value;
            
            // On construit l'URL de redirection avec les paramètres
            // Exemple: evenements.html?q=concert&city=Cotonou
            let targetUrl = 'evenements.html?';
            const params = new URLSearchParams();
            
            if (query) params.append('q', query);
            if (city && city !== 'Toutes les villes') {
                // On nettoie le nom de la ville (ex: "Cotonou (Bénin)" -> "Cotonou")
                const cleanCity = city.split(' (')[0];
                params.append('city', cleanCity);
            }
            
            window.location.href = targetUrl + params.toString();
        });
    }
});
