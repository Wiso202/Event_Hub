const translations = {
    fr: {
        // Navbar
        navHome: "Accueil",
        navEvents: "Événements",
        navPublish: "Publier un Event",
        
        // Header
        discoverEventsTitle: "Découvrez les Événements",
        discoverEventsSubtitle: "Trouvez l'inspiration pour votre prochaine sortie.",
        
        // Filtres
        searchPlaceholder: "Rechercher un événement...",
        allCountries: "Tous les pays",
        allCategories: "Toutes les catégories",
        
        // Catégories (Select et Badges)
        catBusiness: "Corporate & Business",
        catPrivate: "Événements Privés",
        catCulture: "Culture & Divertissement",
        catSports: "Sports",
        catCharity: "Caritatif",
        
        // Carte & Modal
        btnDetails: "Voir Détails",
        modalLocation: "Lieu:",
        modalTime: "Heure:",
        modalDesc: "Vivez une expérience musicale unique réunissant les meilleurs artistes de la sous-région dans un cadre festif.",
        btnRegister: "S'inscrire / Plus d'infos",
        
        // Footer
        footerDesc: "La première plateforme de centralisation des événements en Afrique de l'Ouest. Simplifiez votre recherche, amplifiez votre visibilité.",
        navTitle: "Navigation",
        navCategories: "Catégories",
        navZones: "Zones",
        legalTitle: "Légal",
        legalTerms: "Conditions",
        legalPrivacy: "Confidentialité",
        newsletterTitle: "Newsletter"
    },
    en: {
        // Navbar
        navHome: "Home",
        navEvents: "Events",
        navPublish: "Post an Event",
        
        // Header
        discoverEventsTitle: "Discover Events",
        discoverEventsSubtitle: "Find inspiration for your next outing.",
        
        // Filters
        searchPlaceholder: "Search for an event...",
        allCountries: "All countries",
        allCategories: "All categories",
        
        // Categories
        catBusiness: "Corporate & Business",
        catPrivate: "Private Events",
        catCulture: "Culture & Entertainment",
        catSports: "Sports",
        catCharity: "Charity",
        
        // Card & Modal
        btnDetails: "View Details",
        modalLocation: "Location:",
        modalTime: "Time:",
        modalDesc: "Experience a unique musical gathering featuring the region's best artists in a festive atmosphere.",
        btnRegister: "Register / More Info",
        
        // Footer
        footerDesc: "The leading event centralization platform in West Africa. Simplify your search, boost your visibility.",
        navTitle: "Navigation",
        navCategories: "Categories",
        navZones: "Zones",
        legalTitle: "Legal",
        legalTerms: "Terms",
        legalPrivacy: "Privacy",
        newsletterTitle: "Newsletter"
    }
};
// Ajoutez ces clés dans votre objet translations de lang.js


function switchLanguage(lang) {
    localStorage.setItem('selectedLang', lang);
    
    document.querySelectorAll('[data-key]').forEach(el => {
        const key = el.getAttribute('data-key');
        if (translations[lang][key]) {
            if (el.tagName === 'INPUT') {
                el.placeholder = translations[lang][key];
            } else {
                // Utilise innerHTML pour garder le <span> stylisé du titre si besoin
                if (key === 'discoverEventsTitle') {
                    // Cas particulier pour le titre avec span
                    const spanColor = lang === 'fr' ? 'Événements' : 'Events';
                    el.innerHTML = lang === 'fr' ? `Découvrez les <span class="text-primary">${spanColor}</span>` : `Discover <span class="text-primary">${spanColor}</span>`;
                } else {
                    el.textContent = translations[lang][key];
                }
            }
        }
    });
}

// Charger la langue au démarrage
document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('selectedLang') || 'fr';
    switchLanguage(savedLang);
});
