// filters.js
document.getElementById('searchInput')?.addEventListener('input', function(e) {
    const term = e.target.value.toLowerCase();
    const filtered = allEvents.filter(event => 
        event.Nom.toLowerCase().includes(term) || 
        event.Ville.toLowerCase().includes(term)
    );
    renderEvents(filtered);
});