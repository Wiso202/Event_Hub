/**
 * Extension pour app.js - Ajoute WhatsApp et Calendrier 
 * sans modifier le fichier original.
 */
(function() {
    // On sauvegarde la fonction originale
    const originalShowDetails = window.showDetails;

    // On remplace la fonction globale par notre version enrichie
    window.showDetails = function(index) {
        // 1. Exécuter d'abord la fonction originale de app.js (ouvre la modale)
        originalShowDetails(index);

        // 2. Récupérer les données de l'événement
        const event = allEvents[index];
        const lang = localStorage.getItem('selectedLang') || 'fr';
        
        // 3. Préparer les liens
        const eventTitle = encodeURIComponent(event.nom);
        const eventDate = event.date ? event.date.replace(/-/g, '') : "";
        const calendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${eventTitle}&dates=${eventDate}/${eventDate}&details=Retrouvez plus d'infos sur EventHub&location=${encodeURIComponent(event.ville)}`;
        
        const waText = encodeURIComponent(`${lang === 'fr' ? 'Regarde cet événement' : 'Check out this event'} : ${event.nom} à ${event.ville}. Plus d'infos ici : ${window.location.href}`);
        const waUrl = `https://api.whatsapp.com/send?text=${waText}`;

        // 4. Injecter les boutons dans le HTML généré par app.js
        // On attend 150ms pour être sûr que la modale est dessinée dans le DOM
        setTimeout(() => {
            const modalBody = document.querySelector('#modalBody .col-md-7');
            if (modalBody && !document.getElementById('extension-btns')) {
                const btnContainer = document.createElement('div');
                btnContainer.id = 'extension-btns';
                btnContainer.className = 'd-flex gap-2 mt-4 pt-3 border-top';
                btnContainer.innerHTML = `
                    <a href="${waUrl}" target="_blank" class="btn btn-success flex-grow-1 rounded-pill">
                        <i class="fa-brands fa-whatsapp me-2"></i>WhatsApp
                    </a>
                    <a href="${calendarUrl}" target="_blank" class="btn btn-outline-danger flex-grow-1 rounded-pill">
                        <i class="fa-solid fa-calendar-plus me-2"></i> ${lang === 'fr' ? 'Calendrier' : 'Calendar'}
                    </a>
                `;
                modalBody.appendChild(btnContainer);
            }
        }, 150);
    };
})();
