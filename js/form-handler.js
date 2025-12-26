// form-handler.js

// REMPLACEZ CETTE URL par l'URL récupérée à l'étape 2
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyB9YsGanP1XM_SfsKR_p7K5m9ULLBkU29LflQVw1qurrkRYDRfkvW4hm9d2JbBc7GSeA/exec";

document.getElementById('eventForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const submitBtn = this.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerText;
    
    // Changement d'état du bouton
    submitBtn.disabled = true;
    submitBtn.innerText = "Envoi en cours...";

    // Récupération des données du formulaire
    // Note : On utilise querySelector pour les champs sans ID
    const formData = {
        Nom: this.querySelector('input[placeholder*="Festival"]').value,
        Pays: document.getElementById('countrySelect').value,
        Ville: document.getElementById('citySelect').value,
        Categorie: this.querySelector('select:not(#countrySelect):not(#citySelect)').value,
        ImageID: this.querySelector('input[type="url"][placeholder*="votre-image"]').value,
        InfoURL: this.querySelector('input[type="url"][placeholder*="site-web"]').value || "N/A",
        Date: this.querySelector('input[type="date"]').value
    };

    // Envoi des données vers Google Sheets
    fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', // Mode nécessaire pour Google Apps Script
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => {
        alert("Félicitations ! Votre événement a été publié avec succès.");
        this.reset(); // Réinitialise le formulaire
        submitBtn.disabled = false;
        submitBtn.innerText = originalBtnText;
    })
    .catch(error => {
        console.error('Erreur:', error);
        alert("Une erreur est survenue lors de l'envoi.");
        submitBtn.disabled = false;
        submitBtn.innerText = originalBtnText;
    });
});
