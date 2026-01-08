

// --- FONCTIONNALITÉ 3 : Filtres Aujourd'hui / Week-end ---
window.filterByTime = function(range) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let filtered = [];

    if (range === 'all') {
        filtered = [...allEvents];
    } else if (range === 'today') {
        filtered = allEvents.filter(event => {
            const d = new Date(event.date);
            d.setHours(0,0,0,0);
            return d.getTime() === today.getTime();
        });
    } else if (range === 'weekend') {
        const saturday = new Date(today);
        saturday.setDate(today.getDate() + (6 - today.getDay()));
        const sunday = new Date(saturday);
        sunday.setDate(saturday.getDate() + 1);

        filtered = allEvents.filter(event => {
            const d = new Date(event.date);
            return d >= saturday && d <= sunday;
        });
    }

    const grid = document.getElementById('eventsGrid');
    if (filtered.length === 0) {
        grid.innerHTML = `<div class="text-center py-5 w-100"><h3>${localStorage.getItem('selectedLang') === 'en' ? 'No events found' : 'Aucun événement trouvé'}</h3></div>`;
        document.getElementById('pagination').innerHTML = '';
    } else {
        // Astuce pour utiliser la pagination de app.js sans modifier allEvents globalement
        const originalAllEvents = [...allEvents];
        allEvents.length = 0; // Vide proprement
        filtered.forEach(e => allEvents.push(e)); // Remplit avec le filtre
        displayPage(1);
        
        // On remet les originaux après un court délai pour que les filtres de recherche marchent encore
        setTimeout(() => {
            allEvents.length = 0;
            originalAllEvents.forEach(e => allEvents.push(e));
        }, 500);
    }
};
