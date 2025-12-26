// app.js
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwGFIAdlb4lzJL0DUZZTVUopLNyXHh1f_aTT4EvUS1hT4MRv1raZOi3NdwWEn7fjg973A/exec";

async function loadEvents() {
    const grid = document.getElementById('eventsGrid');
    if (!grid) return;

    try {
        const response = await fetch(SCRIPT_URL);
        const events = await response.json();
        renderEvents(events);
    } catch (error) {
        console.error("Erreur de chargement:", error);
        grid.innerHTML = "<p class='text-center'>Erreur lors du chargement des données.</p>";
    }
}

function renderEvents(events) {
    const grid = document.getElementById('eventsGrid');
    
    grid.innerHTML = events.map(event => {
        // URL corrigée pour afficher l'image stockée sur Google Drive
        const imgSrc = event.ImageID 
            ? `https://drive.google.com/uc?export=view&id=${event.ImageID}` 
            : 'https://via.placeholder.com/400x250?text=No+Image';
        
        return `
            <div class="col-md-4 mb-4">
                <div class="card event-card h-100 shadow-sm border-0" style="border-radius: 15px; overflow: hidden;">
                    <img src="${imgSrc}" class="card-img-top" alt="${event.Nom}" style="height: 200px; object-fit: cover;">
                    <div class="card-body">
                        <span class="badge bg-primary mb-2">${event.Categorie}</span>
                        <h5 class="fw-bold">${event.Nom}</h5>
                        <p class="text-muted small mb-1"><i class="fas fa-map-marker-alt me-1"></i> ${event.Ville}, ${event.Pays.toUpperCase()}</p>
                        <p class="text-muted small"><i class="fas fa-calendar-alt me-1"></i> ${new Date(event.Date).toLocaleDateString()}</p>
                        ${event.InfoURL ? `<a href="${event.InfoURL}" target="_blank" class="btn btn-outline-primary btn-sm w-100 mt-2">S'inscrire</a>` : ''}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

document.addEventListener('DOMContentLoaded', loadEvents);nnerHTML = events.map(event => {
        // LIEN MAGIQUE POUR AFFICHER L'IMAGE DRIVE
        const imgSrc = event.ImageID ? `https://lh3.googleusercontent.com/d/${event.ImageID}` : 'img/default.jpg';
        
        return `
            <div class="col-md-4">
                <div class="card event-card h-100">
                    <div class="img-container">
                        <img src="${imgSrc}" alt="${event.Nom}">
                    </div>
                    <div class="card-body">
                        <h5>${event.Nom}</h5>
                        </div>
                </div>
            </div>
        `;
    }).join('');
}
function showDetails(index) {
    const event = allEvents[index];
    const modal = new bootstrap.Modal(document.getElementById('detailsModal'));
    
    // Mise à jour dynamique de la pop-up
    const modalBody = document.querySelector('#detailsModal .modal-body');
    modalBody.innerHTML = `
        <div class="row g-0">
            <div class="col-lg-5">
                <img src="${event.ImageURL}" class="h-100 w-100" style="object-fit: cover; min-height: 300px;">
            </div>
            <div class="col-lg-7 p-4 p-md-5">
                <div class="d-flex justify-content-between align-items-start mb-3">
                    <span class="badge bg-primary-subtle text-primary px-3 py-2">${event.Categorie}</span>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <h2 class="fw-bold text-dark mb-4">${event.Nom}</h2>
                <div class="space-y-3">
                    <p><i class="fa-solid fa-map-location-dot text-primary me-2"></i> <strong>Lieu:</strong> ${event.Ville}, ${event.Pays}</p>
                    <p><i class="fa-solid fa-calendar text-primary me-2"></i> <strong>Date:</strong> ${new Date(event.Date).toLocaleDateString('fr-FR')}</p>
                </div>
                ${event.InfoURL ? `<a href="${event.InfoURL}" target="_blank" class="btn btn-dark btn-lg w-100 rounded-pill mt-5 fw-bold shadow">Accéder aux infos</a>` : ''}
            </div>
        </div>
    `;
    modal.show();
}


document.addEventListener('DOMContentLoaded', fetchEvents);


