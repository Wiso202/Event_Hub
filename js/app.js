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
                    <p class="text-muted mt-4">Ne manquez pas cet événement exceptionnel. Pour plus d'informations ou pour réserver votre place, cliquez sur le bouton ci-dessous.</p>
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
/** * AJOUT DES FONCTIONNALITÉS WHATSAPP ET CALENDRIER 
 * (Ajouté à la fin sans modifier le code original ci-dessus)
 */

// On conserve une référence à la fonction originale définie plus haut dans ce fichier
const originalShowDetails = window.showDetails;

// On redéfinit showDetails pour y ajouter nos nouvelles fonctions
window.showDetails = function(index) {
    // 1. Appeler la fonction originale pour afficher la modale avec vos styles
    originalShowDetails(index);

    // 2. Récupérer les données de l'événement en cours
    const event = allEvents[index];
    const lang = localStorage.getItem('selectedLang') || 'fr';
    
    // 3. Préparer les liens dynamiques
    const eventTitle = encodeURIComponent(event.nom);
    const eventDate = event.date ? event.date.replace(/-/g, '') : "";
    const calendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${eventTitle}&dates=${eventDate}/${eventDate}&details=Retrouvez plus d'infos sur EventHub&location=${encodeURIComponent(event.ville)}`;
    
    const waText = encodeURIComponent(`${lang === 'fr' ? 'Regarde cet événement' : 'Check out this event'} : ${event.nom} à ${event.ville}. Plus d'infos ici : ${window.location.href}`);
    const waUrl = `https://api.whatsapp.com/send?text=${waText}`;

    // 4. Injection visuelle des boutons dans la modale déjà ouverte
    // On utilise un petit délai pour être sûr que le HTML original est bien injecté
    setTimeout(() => {
        const modalBodyContent = document.querySelector('#modalBody .col-md-7');
        
        if (modalBodyContent) {
            const buttonHtml = `
                <div class="d-flex gap-2 mt-3 pt-3 border-top" id="ext-actions">
                    <a href="${waUrl}" target="_blank" class="btn btn-success flex-grow-1 rounded-pill shadow-sm">
                        <i class="fa-brands fa-whatsapp me-2"></i>WhatsApp
                    </a>
                    <a href="${calendarUrl}" target="_blank" class="btn btn-outline-danger flex-grow-1 rounded-pill shadow-sm">
                        <i class="fa-solid fa-calendar-plus me-2"></i> ${lang === 'fr' ? 'Calendrier' : 'Calendar'}
                    </a>
                </div>
            `;
            // On ajoute les boutons à la fin de la section texte de la modale
            modalBodyContent.insertAdjacentHTML('beforeend', buttonHtml);
        }
    }, 200);
};









