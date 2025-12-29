// Configuration des lieux (Pays et Villes)
const locations = {
    benin: ["Cotonou", "Porto-Novo", "Abomey-Calavi", "Ouidah", "Parakou", "Djougou", "Natitingou", "Kandi", "Bohicon", "Abomey", "Dassa-Zoumé", "Savalou"],
    togo: ["Lomé", "Tsévié", "Aného", "Atakpamé", "Kpalimé", "Sokodé", "Kara", "Dapaong"],
    ivoire: ["Abidjan (Cocody)", "Abidjan (Plateau)", "Yamoussoukro", "Bouaké", "San-Pédro", "Korhogo", "Man", "Daloa"],
    nigeria: ["Lagos", "Abuja", "Kano", "Ibadan", "Port Harcourt", "Benin City", "Kaduna", "Enugu"]
};

// Gestion de la sélection dynamique des villes
const countrySelect = document.getElementById('countrySelect');
const citySelect = document.getElementById('citySelect');

countrySelect.addEventListener('change', function() {
    const selectedCountry = this.value;
    citySelect.innerHTML = '<option value="" selected disabled>Choisir la ville...</option>';
    
    if (selectedCountry) {
        citySelect.disabled = false;
        locations[selectedCountry].forEach(city => {
            const option = document.createElement('option');
            option.value = city;
            option.textContent = city;
            citySelect.appendChild(option);
        });
    }
});

// LOGIQUE D'ENVOI VERS GOOGLE SHEETS
const SCRIPT_URL = "VOTRE_URL_APPLICATION_WEB_GOOGLE_SCRIPT"; // Collez ici l'URL obtenue lors du déploiement

document.getElementById('eventForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const msgDiv = document.getElementById('successMessage');
    const fileInput = document.getElementById('imageInput');
    const file = fileInput.files[0];
    
    // Désactiver le bouton pendant l'envoi
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Envoi en cours...';

    const reader = new FileReader();
    reader.onload = function() {
        const base64Data = reader.result.split(',')[1];
        
        const payload = {
            nom: document.getElementById('eventName').value,
            pays: countrySelect.value,
            ville: citySelect.value,
            categorie: document.getElementById('categorySelect').value,
            infoUrl: document.getElementById('infoUrl').value,
            date: document.getElementById('eventDate').value,
            imageFile: base64Data,
            imageName: file.name,
            imageType: file.type
        };

        fetch(SCRIPT_URL, {
            method: 'POST',
            body: JSON.stringify(payload)
        })
        .then(res => res.text())
        .then(response => {
            if(response === "Success") {
                // Afficher le message de réussite
                msgDiv.classList.remove('d-none');
                e.target.reset(); // Vider le formulaire
                citySelect.disabled = true;
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                alert("Erreur: " + response);
            }
        })
        .catch(error => {
            console.error(error);
            alert("Une erreur est survenue lors de l'envoi.");
        })
        .finally(() => {
            submitBtn.disabled = false;
            submitBtn.innerText = "Publier l'événement";
        });
    };
    
    reader.readAsDataURL(file);
});
