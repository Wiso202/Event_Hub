document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.getElementById('heroSearchBtn');
    const searchInput = document.getElementById('heroSearchInput');
    const citySelect = document.getElementById('heroCitySelect');

    if (searchBtn) {
        searchBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const query = searchInput.value.trim();
            const city = citySelect.value;
            
            const params = new URLSearchParams();
            if (query) params.append('q', query);
            if (city && city !== 'Toutes les villes') {
                // Extrait "Cotonou" de "Cotonou (Bénin)"
                params.append('city', city.split(' (')[0]); 
            }
            
            window.location.href = `evenements.html?${params.toString()}`;
        });
    }
});
