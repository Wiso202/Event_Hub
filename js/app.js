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

function renderEvents(events) {
    const grid = document.getElementById('eventsGrid');
    grid.innerHTML = events.map((event, index) => `
        <div class="col-md-4" data-aos="fade-up">
            <div class="card event-card h-100">
                <div class="img-container">
                    <span class="category-badge shadow-sm">${event.Categorie}</span>
                    <img src="${event.ImageURL}" alt="${event.Nom}">
                </div>
                <div class="card-body p-4">
                    <h5 class="fw-bold mb-3">${event.Nom}</h5>
                    <div class="d-flex align-items-center mb-2 text-muted small">
                        <i class="fa-solid fa-location-dot text-primary me-2"></i>${event.Ville}, ${event.Pays}
                    </div>
                    <div class="d-flex align-items-center mb-4 text-muted small">
                        <i class="fa-solid fa-calendar text-primary me-2"></i>${new Date(event.Date).toLocaleDateString('fr-FR')}
                    </div>
                    <button class="btn btn-primary w-100 rounded-pill fw-bold py-2 shadow-sm" 
                            onclick="showDetails(${index})">
                        Voir Détails
                    </button>
                </div>
            </div>
        </div>
    `).join('');
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