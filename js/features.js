/**
 * js/features.js - Ajout des fonctionnalités 1, 2 et 3
 * S'exécute sans modifier app.js
 */

// --- FONCTIONNALITÉ 1 & 2 : WhatsApp & Calendrier ---
const originalShowDetails = window.showDetails;

window.showDetails = function(index) {
    const event = allEvents[index];
    const lang = localStorage.getItem('selectedLang') || 'fr';
    
    // 1. Préparation du lien Calendrier
    const eventTitle = encodeURIComponent(event.nom);
    const eventDate = event.date ? event.date.replace(/-/g, '') : "";
    const calendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${eventTitle}&dates=${eventDate}/${eventDate}&details=Retrouvez plus d'infos sur EventHub&location=${encodeURIComponent(event.ville)}`;

    // 2. Préparation du lien WhatsApp
    const waText = encodeURIComponent(`${lang === 'fr' ? 'Regarde cet événement' : 'Check out this event'} : ${event.nom} à ${event.ville}. Plus d'infos ici : ${window.location.href}`);
    const waUrl = `https://api.whatsapp.com/send?text=${waText}`;

    // On laisse d'abord app.js ouvrir la modale
    originalShowDetails(index);

    // On injecte nos boutons après un micro-délai pour que le HTML de app.js soit là
    setTimeout(() => {
        const modalBody = document.querySelector('#modalBody .col-md-7');
        if (modalBody) {
            const extraButtons = `
                <div class="d-flex gap-2 mt-3">
                    <a href="${waUrl}" target="_blank" class="btn btn-success flex-grow-1 rounded-pill">
                        <i class="fa-brands fa-whatsapp me-2"></i>WhatsApp
                    </a>
                    <a href="${calendarUrl}" target="_blank" class="btn btn-outline-danger flex-grow-1 rounded-pill">
                        <i class="fa-solid fa-calendar-plus me-2"></i> ${lang === 'fr' ? 'Calendrier' : 'Calendar'}
                    </a>
                </div>
            `;
            modalBody.insertAdjacentHTML('beforeend', extraButtons);
        }
    }, 100);
};

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
