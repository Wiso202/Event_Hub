// js/maintenance.js

/**
 * Nettoie les événements expirés du localStorage ou de la vue actuelle
 */
function cleanupExpiredEvents() {
    // Obtenir la date du jour à minuit (pour inclure les événements d'aujourd'hui)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 1. Nettoyage de la variable globale allEvents (chargée depuis Google Sheets par app.js)
    if (typeof allEvents !== 'undefined' && allEvents.length > 0) {
        const initialCount = allEvents.length;
        
        // Filtrage : on ne garde que si la date est >= aujourd'hui
        allEvents = allEvents.filter(event => {
            if (!event.date) return true; // On garde si pas de date par sécurité
            const eventDate = new Date(event.date);
            return eventDate >= today;
        });

        if (allEvents.length !== initialCount) {
            console.log(`Maintenance : ${initialCount - allEvents.length} événement(s) passé(s) masqués.`);
            
            // Si nous sommes sur la page qui affiche les événements, on relance l'affichage
            if (typeof displayPage === 'function') {
                displayPage(1);
            }
        }
    }

    // 2. Nettoyage du localStorage (si vous stockez aussi des événements localement)
    let localEvents = JSON.parse(localStorage.getItem('events')) || [];
    if (localEvents.length > 0) {
        const activeLocalEvents = localEvents.filter(event => {
            if (!event.date) return true;
            const eventDate = new Date(event.date);
            return eventDate >= today;
        });

        if (activeLocalEvents.length !== localEvents.length) {
            localStorage.setItem('events', JSON.stringify(activeLocalEvents));
        }
    }
}

/**
 * On attend que l'application ait fini de charger les événements 
 * avant de lancer la maintenance.
 */
window.addEventListener('load', () => {
    // On laisse un petit délai pour s'assurer que fetchEvents() dans app.js est terminé
    setTimeout(cleanupExpiredEvents, 2000);
});
