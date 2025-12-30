const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzWYHDVEVHkuc2x1XDHNxwJ9Y_yr_SbpWApNhFdf6CUkWgngv1PbKabwx4e-VtFwL0n/exec";


document.addEventListener('DOMContentLoaded', () => {
    fetchEvents();
});

async function fetchEvents() {
    const grid = document.getElementById('eventsGrid');
    
    try {
        const response = await fetch(SCRIPT_URL);
        const events = await response.json();

        // Nettoyer la grille (enlever le contenu statique)
        grid.innerHTML = '';

        events.forEach((event, index) => {
            const card = document.createElement('div');
            card.className = 'col-md-4';
            card.setAttribute('data-aos', 'fade-up');
            
            // Formatage de la date si nécessaire
            const eventDate = new Date(event.date).toLocaleDateString('fr-FR', {
                day: 'numeric', month: 'long', year: 'numeric'
            });

            card.innerHTML = `
                <div class="card event-card h-100">
                    <div class="img-container">
                        <span class="category-badge shadow-sm">${event.categorie}</span>
                        <img src="${event.imageUrl}" alt="${event.nom}">
                    </div>
                    <div class="card-body p-4">
                        <h5 class="fw-bold mb-3">${event.nom}</h5>
                        <div class="d-flex align-items-center mb-2 text-muted small">
                            <i class="fa-solid fa-location-dot text-primary me-2"></i>${event.ville}, ${event.pays}
                        </div>
                        <div class="d-flex align-items-center mb-4 text-muted small">
                            <i class="fa-solid fa-calendar text-primary me-2"></i>${eventDate}
                        </div>
                        <button class="btn btn-primary w-100 rounded-pill fw-bold py-2 shadow-sm" 
                                onclick="showDetails(${JSON.stringify(event).replace(/"/g, '&quot;')})">
                            Voir Détails
                        </button>
                    </div>
                </div>
            `;
            grid.appendChild(card);
        });
        
        // Relancer l'animation AOS pour les nouveaux éléments
        AOS.refresh();

    } catch (error) {
        console.error('Erreur lors de la récupération:', error);
        grid.innerHTML = '<p class="text-center">Erreur lors du chargement des événements.</p>';
    }
}

// Fonction pour remplir le modal dynamiquement
function showDetails(event) {
    const modalBody = document.querySelector('#detailsModal .modal-body');
    const eventDate = new Date(event.date).toLocaleDateString('fr-FR', {
        day: 'numeric', month: 'long', year: 'numeric'
    });

    modalBody.innerHTML = `
        <div class="row g-0">
            <div class="col-lg-5">
                <img src="${event.imageUrl}" class="h-100 w-100" style="object-fit: cover; min-height: 300px;">
            </div>
            <div class="col-lg-7 p-4 p-md-5">
                <div class="d-flex justify-content-between align-items-start mb-3">
                    <span class="badge bg-primary-subtle text-primary px-3 py-2">${event.categorie}</span>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <h2 class="fw-bold text-dark mb-4">${event.nom}</h2>
                <div class="space-y-3">
                    <p><i class="fa-solid fa-map-location-dot text-primary me-2"></i> <strong>Lieu:</strong> ${event.ville}, ${event.pays}</p>
                    <p><i class="fa-solid fa-calendar text-primary me-2"></i> <strong>Date:</strong> ${eventDate}</p>
                    <p class="text-muted small mt-4">Rejoignez-nous pour cet événement exceptionnel. Plus de détails via le bouton ci-dessous.</p>
                </div>
                <a href="${event.infoUrl}" target="_blank" class="btn btn-dark btn-lg w-100 rounded-pill mt-5 fw-bold shadow">
                    <i class="fa-solid fa-paper-plane me-2"></i>S'inscrire / Plus d'infos
                </a>
            </div>
        </div>
    `;
    
    const myModal = new bootstrap.Modal(document.getElementById('detailsModal'));
    myModal.show();
}


