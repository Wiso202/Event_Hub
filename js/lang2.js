// js/lang2.js

const translations = {
    fr: {
        // Navbar
        navHome: "Accueil",
        navEvents: "Événements",
        navPublish: "Publier un Event",
        // Titre
        publishTitle: "Annoncez votre Événement",
        // Formulaire (via data-key)
        labelName: "Nom de l'événement",
        labelCountry: "Pays",
        labelCity: "Ville / Localité",
        labelCategory: "Catégorie",
        labelDate: "Date",
        btnSubmit: "Publier l'événement",
        // Nouveaux champs (traduits par détection de texte car pas de data-key)
        labelImage: "Affiche de l'événement (Image)",
        labelLink: "Lien d'inscription ou d'information (Optionnel)",
        linkHelp: "Laissez vide si vous n'avez pas de lien externe.",
        // Footer
        footerDesc: "La première plateforme de centralisation des événements en Afrique de l'Ouest. Simplifiez votre recherche, amplifiez votre visibilité.",
        navTitle: "Navigation",
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
        // Title
        publishTitle: "Announce your Event",
        // Form
        labelName: "Event Name",
        labelCountry: "Country",
        labelCity: "City / Location",
        labelCategory: "Category",
        labelDate: "Date",
        btnSubmit: "Publish Event",
        // New fields
        labelImage: "Event Poster (Image)",
        labelLink: "Registration or Info Link (Optional)",
        linkHelp: "Leave blank if you don't have an external link.",
        // Footer
        footerDesc: "The leading event platform in West Africa. Simplify your search, amplify your visibility.",
        navTitle: "Navigation",
        legalTitle: "Legal",
        legalTerms: "Terms",
        legalPrivacy: "Privacy",
        newsletterTitle: "Newsletter"
    }
};

function switchLanguage(lang) {
    localStorage.setItem('selectedLang', lang);
    
    // 1. Traduction des éléments avec data-key (ceux déjà marqués)
    document.querySelectorAll('[data-key]').forEach(el => {
        const key = el.getAttribute('data-key');
        if (translations[lang][key]) {
            el.textContent = translations[lang][key];
        }
    });

    // 2. Traduction manuelle des champs sans data-key (Image, Lien, Aide)
    // On cherche les labels par leur texte pour ne pas toucher au HTML
    const labels = document.querySelectorAll('label.form-label');
    labels.forEach(label => {
        if (label.textContent.includes("Affiche") || label.textContent.includes("Event Poster")) {
            label.textContent = translations[lang].labelImage;
        }
        if (label.textContent.includes("Lien d'inscription") || label.textContent.includes("Registration")) {
            label.textContent = translations[lang].labelLink;
        }
    });

    // Traduction du petit texte d'aide sous le lien
    const helpText = document.querySelector('.form-text');
    if (helpText) {
        helpText.textContent = translations[lang].linkHelp;
    }

    // Mise à jour du texte par défaut du select Ville
    const citySelect = document.getElementById('citySelect');
    if (citySelect && citySelect.disabled) {
        citySelect.options[0].text = lang === 'fr' ? "Sélectionnez d'abord un pays" : "Select a country first";
    }
}

// Logique des villes (inchangée)
const citiesByCountry = {
    benin: ["Cotonou", "Porto-Novo", "Parakou"],
    togo: ["Lomé", "Kara"],
    ivoire: ["Abidjan", "Yamoussoukro"],
    nigeria: ["Lagos", "Abuja"]
};

function initCityFilter() {
    const countrySelect = document.getElementById('countrySelect');
    const citySelect = document.getElementById('citySelect');
    if (!countrySelect || !citySelect) return;

    countrySelect.addEventListener('change', function() {
        const country = this.value;
        citySelect.innerHTML = '';
        citySelect.disabled = false;
        const defaultOpt = document.createElement('option');
        defaultOpt.value = "";
        defaultOpt.textContent = localStorage.getItem('selectedLang') === 'en' ? "Select a city" : "Choisir une ville";
        citySelect.appendChild(defaultOpt);

        if (citiesByCountry[country]) {
            citiesByCountry[country].forEach(city => {
                const opt = document.createElement('option');
                opt.value = city.toLowerCase();
                opt.textContent = city;
                citySelect.appendChild(opt);
            });
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('selectedLang') || 'fr';
    switchLanguage(savedLang);
    initCityFilter();
});
