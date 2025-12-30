const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzDNdnM2EowBfevbbwud2RlQSuFhuv157wLckILnVFNi4T2WqIODqMLdvEkYQyEBM7y/exec";

document.addEventListener('DOMContentLoaded', () => {
    fetchEvents();
});

async function fetchEvents() {
    const grid = document.getElementById('eventsGrid');
    grid.innerHTML = '<div class="text-center w-100"><div class="spinner-border text-primary"></div></div>';

    try {
        // Ajout de redirect: 'follow' pour s'assurer que le navigateur suit le lien de Google
        const response = await fetch(SCRIPT_URL, {
            method: 'GET',
            redirect: 'follow'
        });

        if (!response.ok) throw new Error('Erreur réseau');

        const events = await response.json();
        
        // ... (le reste de votre code pour filtrer et afficher) ...
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        const upcomingEvents = events.filter(event => {
            if (!event.Date) return false;
            const eventDate = new Date(event.Date);
            return eventDate >= now;
        });

        displayEvents(upcomingEvents);

    } catch (error) {
        console.error("Erreur lors de la récupération :", error);
        grid.innerHTML = '<p class="text-center text-danger">Erreur de connexion aux données. Vérifiez le déploiement du script.</p>';
    }
}

function displayEvents(events) {
    const grid = document.getElementById('eventsGrid');
    grid.innerHTML = ''; // On vide le loader

    if (events.length === 0) {
        grid.innerHTML = '<div class="col-12 text-center text-muted"><p>Aucun événement à venir pour le moment.</p></div>';
        return;
    }

    events.forEach((event, index) => {
        const dateFormatted = new Date(event.Date).toLocaleDateString('fr-FR', {
            day: 'numeric', month: 'long', year: 'numeric'
        });

        const cardHTML = `
            <div class="col-md-4" data-aos="fade-up" data-aos-delay="${index * 100}">
                <div class="card event-card h-100">
                    <div class="img-container">
                        <span class="category-badge shadow-sm">${event.Categorie}</span>
                        <img src="${event.ImageID}" alt="${event.Nom}" onerror="this.src='https://via.placeholder.com/800x500?text=Image+non+disponible'">
                    </div>
                    <div class="card-body p-4">
                        <h5 class="fw-bold mb-3">${event.Nom}</h5>
                        <div class="d-flex align-items-center mb-2 text-muted small">
                            <i class="fa-solid fa-location-dot text-primary me-2"></i>${event.Ville}, ${event.Pays}
                        </div>
                        <div class="d-flex align-items-center mb-4 text-muted small">
                            <i class="fa-solid fa-calendar text-primary me-2"></i>${dateFormatted}
                        </div>
                        <button class="btn btn-primary w-100 rounded-pill fw-bold py-2 shadow-sm" 
                                onclick="openModal('${encodeURIComponent(JSON.stringify(event))}')">
                            Voir Détails
                        </button>
                    </div>
                </div>
            </div>
        `;
        grid.innerHTML += cardHTML;
    });
}

// Fonction pour remplir et ouvrir le modal
function openModal(encodedEvent) {
    const event = JSON.parse(decodeURIComponent(encodedEvent));
    const modal = new bootstrap.Modal(document.getElementById('detailsModal'));
    
    const modalImg = document.querySelector('#detailsModal img');
    const modalTitle = document.querySelector('#detailsModal h2');
    const modalBadge = document.querySelector('#detailsModal .badge');
    const modalLocation = document.querySelector('#detailsModal .fa-map-location-dot').parentNode;
    const modalDate = document.querySelector('#detailsModal .fa-clock').parentNode;
    const modalInfoBtn = document.querySelector('#detailsModal a.btn-dark');

    modalImg.src = event.ImageID;
    modalTitle.innerText = event.Nom;
    modalBadge.innerText = event.Categorie;
    modalLocation.innerHTML = `<i class="fa-solid fa-map-location-dot text-primary me-2"></i> <strong>Lieu:</strong> ${event.Ville}, ${event.Pays}`;
    modalDate.innerHTML = `<i class="fa-solid fa-clock text-primary me-2"></i> <strong>Date:</strong> ${new Date(event.Date).toLocaleDateString('fr-FR')}`;
    
    if(event.InfoURL) {
        modalInfoBtn.href = event.InfoURL;
        modalInfoBtn.style.display = 'block';
    } else {
        modalInfoBtn.style.display = 'none';
    }

    modal.show();
}

