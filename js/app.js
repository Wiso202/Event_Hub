// app.js
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz9zg5xZHCmkgxUORrnkesePvaCyYPglf6-h5KdSQnjTlSNHL7ijtCpsvR15t9EZodxLg/exec";
let allEvents = [];

async function fetchEvents() {
    const grid = document.getElementById('eventsGrid');
    if (!grid) return;

    try {
        const response = await fetch(SCRIPT_URL);
        allEvents = await response.json();
        renderEvents(allEvents);
    } catch (error) {
        grid.innerHTML = "<p class='text-center'>Erreur de chargement des données.</p>";
    }
}

// js/app.js - Dans votre boucle de rendu (renderEvents)
// Remplacez la source de l'image par ceci :

function renderEvents(events) {
    const grid = document.getElementById('eventsGrid');
    grid.innerHTML = events.map(event => {
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
