// js/lang2.js

const translations = {
    fr: {
        // Navbar & General
        navHome: "Accueil",
        navEvents: "Événements",
        navPublish: "Publier un Event",
        // Hero
        publishTitle: "Annoncez votre Événement",
        // Formulaire
        labelName: "Nom de l'événement",
        labelCountry: "Pays",
        labelCity: "Ville / Localité",
        labelCategory: "Catégorie",
        labelDate: "Date",
        btnSubmit: "Publier l'événement",
        // Footer
        footerDesc: "La première plateforme de centralisation des événements en Afrique de l'Ouest. Simplifiez votre recherche, amplifiez votre visibilité.",
        navTitle: "Navigation",
        legalTitle: "Légal",
        legalTerms: "Conditions",
        legalPrivacy: "Confidentialité",
        newsletterTitle: "Newsletter"
    },
    en: {
        // Navbar & General
        navHome: "Home",
        navEvents: "Events",
        navPublish: "Post an Event",
        // Hero
        publishTitle: "Announce your Event",
        // Formulaire
        labelName: "Event Name",
        labelCountry: "Country",
        labelCity: "City / Location",
        labelCategory: "Category",
        labelDate: "Date",
        btnSubmit: "Post Event",
        // Footer
        footerDesc: "The leading platform for centralizing events in West Africa. Simplify your search, amplify your visibility.",
        navTitle: "Navigation",
        legalTitle: "Legal",
        legalTerms: "Terms",
        legalPrivacy: "Privacy",
        newsletterTitle: "Newsletter"
    }
};

// Données des villes pour la sélection dynamique
const cityData = {
    benin: ["Cotonou", "Porto-Novo", "Parakou", "Abomey-Calavi", "Ouidah"],
    togo: ["Lomé", "Kara", "Sokodé", "Kpalimé", "Atakpamé"],
    ivoire: ["Abidjan", "Yamoussoukro", "Bouaké", "San-Pédro", "Korhogo"],
    nigeria: ["Lagos", "Abuja", "Port Harcourt", "Ibadan", "Kano"]
};

/**
 * Change la langue de la page
 */
function switchLanguage(lang) {
    localStorage.setItem('selectedLang', lang);
    
    document.querySelectorAll('[data-key]').forEach(el => {
        const key = el.getAttribute('data-key');
        if (translations[lang][key]) {
            // Gestion des placeholders pour inputs/textareas
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = translations[lang][key];
            } else {
                el.textContent = translations[lang][key];
            }
        }
    });

    // Mise à jour du texte par défaut du select Ville si aucun pays n'est choisi
    const citySelect = document.getElementById('citySelect');
    if (citySelect && citySelect.disabled) {
        citySelect.options[0].text = lang === 'fr' ? "Sélectionnez d'abord un pays" : "Select a country first";
    }
}

/**
 * Gère la mise à jour dynamique des villes
 */
function setupCityFilter() {
    const countrySelect = document.getElementById('countrySelect');
    const citySelect = document.getElementById('citySelect');

    if (countrySelect && citySelect) {
        countrySelect.addEventListener('change', function() {
            const country = this.value;
            
            // Réinitialiser les villes
            citySelect.innerHTML = '';
            citySelect.disabled = false;

            // Ajouter l'option par défaut
            const defaultOpt = document.createElement('option');
            defaultOpt.value = "";
            defaultOpt.textContent = localStorage.getItem('selectedLang') === 'en' ? "Choose a city..." : "Choisir une ville...";
            citySelect.appendChild(defaultOpt);

            // Charger les villes correspondantes
            if (cityData[country]) {
                cityData[country].forEach(city => {
                    const opt = document.createElement('option');
                    opt.value = city.toLowerCase();
                    opt.textContent = city;
                    citySelect.appendChild(opt);
                });
            }
        });
    }
}

// Initialisation au chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('selectedLang') || 'fr';
    switchLanguage(savedLang);
    setupCityFilter();
});
