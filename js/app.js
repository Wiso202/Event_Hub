const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzWYHDVEVHkuc2x1XDHNxwJ9Y_yr_SbpWApNhFdf6CUkWgngv1PbKabwx4e-VtFwL0n/exec";

// Variables d'état pour la pagination
let allEvents = [];
let currentPage = 1;
const itemsPerPage = 6;

/**
 * Initialisation au chargement du DOM
 */
document.addEventListener('DOMContentLoaded', () => {
    fetchEvents();
});

/**
 * Récupère les données depuis Google Sheets via Apps Script
 */
async function fetchEvents() {
    const grid = document.getElementById('eventsGrid');
    grid.innerHTML = `
        <div class="col-12 text-center py-5">
            <div class="spinner-border text-primary" role="status"></div>
            <p class="mt-2">Chargement des événements...</p>
        </div>`;

    try {
        const response = await fetch(SCRIPT_URL, { 
            method: 'GET',
            redirect: 'follow' 
        });

        if (!response.ok) throw new Error('Erreur réseau');

        allEvents = await response.json();
        
        if (allEvents.length === 0) {
            grid.innerHTML = '<p class="text-center w-100">Aucun événement disponible pour le moment.</p>';
        } else {
            displayPage(1);
        }

    } catch (error) {
        console.error('Erreur lors de la récupération:', error);
        grid.innerHTML = `
            <div class="col-12 text-center text-danger py-5">
                <i class="fa-solid fa-triangle-exclamation fs-1 mb-3"></i>
                <p>Impossible de charger les événements. Vérifiez votre connexion ou l'URL du script.</p>
            </div>`;
    }
}

/**
 * Formate l'URL Google Drive pour un affichage direct dans le navigateur 
 */
function formatDriveUrl(url) {
    if (!url) return 'https://via.placeholder.com/800x500?text=Image+Indisponible';
    
    // Remplace le lien de visualisation par le lien de contenu direct (serveur lh3)
    // Cela corrige les erreurs d'affichage et de CORS pour les images 
    return url.replace('drive.google.com/uc?export=view&id=', 'lh3.googleusercontent.com/d/');
}

/**
 * Affiche une page spécifique d'événements
 */
function displayPage(page) {
    currentPage = page;
    const grid = document.getElementById('eventsGrid');
    grid.innerHTML = '';

    // Calcul des éléments à afficher
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedItems = allEvents.slice(startIndex, endIndex);

    paginatedItems.forEach((event) => {
        const card = document.createElement('div');
        card.className = 'col-md-4';
        card.setAttribute('data-aos', 'fade-up');
        
        const cleanImageUrl = formatDriveUrl(event.imageUrl);
        const eventDate = formatDate(event.date);

        // Construction de la carte avec les données mappées (Nom, Ville, Pays, Categorie) 
        card.innerHTML = `
            <div class="card event-card h-100">
                <div class="img-container">
                    <span class="category-badge shadow-sm">${event.categorie}</span>
                    <img src="${cleanImageUrl}" alt="${event.nom}" onerror="this.src='https://via.placeholder.com/800x500?text=Erreur+Image'">
                </div>
                <div class="card-body p-4">
                    <h5 class="fw-bold mb-3">${event.nom}</h5>
                    <div class="d-flex align-items-center mb-2 text-muted small">
                        <i class="fa-solid fa-location-dot text-primary me-2"></i>${event.ville}, ${event.pays}
                    </div>
                    <div class="d-flex align-items-center mb-4 text-muted small">
                        <i class="fa-solid fa-calendar text-primary me-2"></i>${eventDate}
                    </div>
                    <button class="btn btn-outline-primary w-100 rounded-pill" onclick="showDetails(${index})" data-key="btnDetails">Voir détails</button>
                   </div>
            </div>
        `;
        grid.appendChild(card);
    });

    renderPagination();
    AOS.refresh();
}

/**
 * Génère les contrôles de pagination
 */
function renderPagination() {
    const container = document.getElementById('pagination');
    if (!container) return;

    const totalPages = Math.ceil(allEvents.length / itemsPerPage);
    if (totalPages <= 1) {
        container.innerHTML = '';
        return;
    }

    container.innerHTML = `
        <nav aria-label="Page navigation">
            <ul class="pagination pagination-lg justify-content-center">
                <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                    <button class="page-link rounded-start-pill px-4" onclick="displayPage(${currentPage - 1})">Précédent</button>
                </li>
                <li class="page-item disabled">
                    <span class="page-link bg-light text-dark fw-bold">Page ${currentPage} / ${totalPages}</span>
                </li>
                <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                    <button class="page-link rounded-end-pill px-4" onclick="displayPage(${currentPage + 1})">Suivant</button>
                </li>
            </ul>
        </nav>
    `;
}

/**
 * Remplit et affiche le modal de détails
 */
function showDetails(index) {
    const event = allEvents[index];
    const lang = localStorage.getItem('selectedLang') || 'fr';

    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = `
        <div class="row g-4">
            <div class="col-md-5">
                <img src="${event.image}" class="img-fluid rounded-4 shadow-sm">
            </div>
            <div class="col-md-7">
                <h2 class="fw-bold">${event.nom}</h2>
                <p><strong>${lang === 'fr' ? 'Lieu' : 'Location'}:</strong> ${event.ville}, ${event.pays}</p>
                <p><strong>${lang === 'fr' ? 'Catégorie' : 'Category'}:</strong> ${event.categorie}</p>
                <p class="mt-3">${event.description || ''}</p>
                <a href="${event.infoUrl}" target="_blank" class="btn btn-primary w-100 rounded-pill mt-4">
                    ${lang === 'fr' ? "S'inscrire" : "Register"}
                </a>
            </div>
        </div>
    `;
    new bootstrap.Modal(document.getElementById('detailsModal')).show();
}

/**
 * Utilitaire pour formater proprement la date 
 */
function formatDate(dateStr) {
    if (!dateStr) return "Date non précisée";
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}








