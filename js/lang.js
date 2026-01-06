// js/lang.js

const translations = {
    fr: {
        // Navbar & General
        navHome: "Accueil",
        navEvents: "Événements",
        navPublish: "Publier un Event",
        // Hero Index
        heroTitle: "Toute l'actualité événementielle au même endroit.",
        heroSubtitle: "Finie la dispersion sur les réseaux sociaux. Trouvez, filtrez et participez.",
        // Filtres (evenements.html)
        searchPlaceholder: "Rechercher un événement...",
        allCountries: "Tous les pays",
        allCategories: "Toutes les catégories",
        // Footer
        footerDesc: "La première plateforme de centralisation des événements en Afrique de l'Ouest. Simplifiez votre recherche, amplifiez votre visibilité.",
        navTitle: "Navigation",
        legalTitle: "Légal",
        legalTerms: "Conditions",
        legalPrivacy: "Confidentialité",
        newsletterTitle: "Newsletter",
        // Publier.html
        publishTitle: "Annoncez votre Événement",
        labelName: "Nom de l'événement",
        labelCountry: "Pays",
        labelCity: "Ville / Localité",
        labelCategory: "Catégorie",
        labelDate: "Date",
        btnSubmit: "Publier l'événement"
    },
    en: {
        // Navbar & General
        navHome: "Home",
        navEvents: "Events",
        navPublish: "Post an Event",
        // Hero Index
        heroTitle: "All event news in one place.",
        heroSubtitle: "No more social media clutter. Find, filter, and join.",
        // Filtres (evenements.html)
        searchPlaceholder: "Search for an event...",
        allCountries: "All countries",
        allCategories: "All categories",
        // Footer
        footerDesc: "The leading event centralization platform in West Africa. Simplify your search, boost your visibility.",
        navTitle: "Navigation",
        legalTitle: "Legal",
        legalTerms: "Terms",
        legalPrivacy: "Privacy",
        newsletterTitle: "Newsletter",
        // Publier.html
        publishTitle: "Announce your Event",
        labelName: "Event Name",
        labelCountry: "Country",
        labelCity: "City / Location",
        labelCategory: "Category",
        labelDate: "Date",
        btnSubmit: "Post Event"
    }
};

function switchLanguage(lang) {
    localStorage.setItem('selectedLang', lang);
    
    document.querySelectorAll('[data-key]').forEach(el => {
        const key = el.getAttribute('data-key');
        if (translations[lang][key]) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = translations[lang][key];
            } else {
                el.textContent = translations[lang][key];
            }
        }
    });

    // Mettre à jour les options par défaut des selects
    const countrySelect = document.getElementById('filterCountry');
    if (countrySelect) countrySelect.options[0].text = translations[lang].allCountries;
    
    const categorySelect = document.getElementById('filterCategory');
    if (categorySelect) categorySelect.options[0].text = translations[lang].allCategories;
}

document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('selectedLang') || 'fr';
    switchLanguage(savedLang);
});
