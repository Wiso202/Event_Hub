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
                        <button class="btn btn-primary w-100 rounded-pill fw-bold py-2 shadow-sm" 
                                onclick='showDetails(${JSON.stringify(event).replace(/'/g, "&apos;")})'>
                            Voir Détails
                        </button>
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
function showDetails(event) {
    const modalContent = document.querySelector('#detailsModal .modal-body');
    const cleanImageUrl = formatDriveUrl(event.imageUrl);
    const eventDate = formatDate(event.date);

    // Préparation du lien WhatsApp
    const whatsappMsg = encodeURIComponent(`Salut ! Regarde cet événement : ${event.nom} à ${event.ville}. Plus d'infos ici : ${event.infoUrl}`);
    const whatsappUrl = `https://wa.me/?text=${whatsappMsg}`;

    modalContent.innerHTML = `
        <div class="row g-0">
            <div class="col-lg-5">
                <img src="${cleanImageUrl}" class="h-100 w-100" style="object-fit: cover; min-height: 350px;" onerror="this.src='https://via.placeholder.com/800x500?text=Image+Indisponible'">
            </div>
            <div class="col-lg-7 p-4 p-md-5">
                <div class="d-flex justify-content-between align-items-start mb-3">
                    <span class="badge bg-primary-subtle text-primary px-3 py-2">${event.categorie}</span>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <h2 class="fw-bold text-dark mb-4">${event.nom}</h2>
                <div class="space-y-3">
                    <p><i class="fa-solid fa-map-location-dot text-primary me-2"></i> <strong>Lieu :</strong> ${event.ville}, ${event.pays}</p>
                    <p><i class="fa-solid fa-calendar text-primary me-2"></i> <strong>Date :</strong> ${eventDate}</p>
                    <p class="text-muted mt-4">Ne manquez pas cet événement exceptionnel.</p>
                </div>
                
                <div class="mt-4 d-flex gap-2">
                    <button onclick='addToCalendar(${JSON.stringify(event).replace(/'/g, "&apos;")})' class="btn btn-outline-primary rounded-pill flex-grow-1">
                        <i class="fa-solid fa-calendar-plus me-2"></i>Agenda
                    </button>
                    <a href="${whatsappUrl}" target="_blank" class="btn btn-outline-success rounded-pill flex-grow-1">
                        <i class="fa-brands fa-whatsapp me-2"></i>Partager
                    </a>
                </div>

                <a href="${event.infoUrl}" target="_blank" class="btn btn-dark btn-lg w-100 rounded-pill mt-3 fw-bold shadow">
                    <i class="fa-solid fa-paper-plane me-2"></i>S'inscrire / Plus d'infos
                </a>
            </div>
        </div>
    `;

    const myModal = new bootstrap.Modal(document.getElementById('detailsModal'));
    myModal.show();
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
/**
 * Génère un lien Google Calendar et ouvre un nouvel onglet
 */
function addToCalendar(event) {
    const startDate = new Date(event.date).toISOString().replace(/-|:|\.\d\d\d/g, "");
    const title = encodeURIComponent(event.nom);
    const location = encodeURIComponent(`${event.ville}, ${event.pays}`);
    const details = encodeURIComponent(`Retrouvez plus d'informations ici : ${event.infoUrl}`);
    
    // Format Google Calendar : dates=YYYYMMDDTHHMMSSZ/YYYYMMDDTHHMMSSZ
    const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDate}/${startDate}&details=${details}&location=${location}&sf=true&output=xml`;
    
    window.open(googleCalendarUrl, '_blank');
}











