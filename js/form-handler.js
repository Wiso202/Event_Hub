// form-handler.js

// REMPLACEZ CETTE URL par l'URL récupérée à l'étape 2
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyB9YsGanP1XM_SfsKR_p7K5m9ULLBkU29LflQVw1qurrkRYDRfkvW4hm9d2JbBc7GSeA/exec";

document.getElementById('eventForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const form = this;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerText;
    
    // Désactiver le bouton pendant l'envoi
    submitBtn.disabled = true;
    submitBtn.innerText = "Envoi en cours...";

    // Collecte des données
    const formData = {
        Nom: form.querySelector('input[placeholder*="Festival"]').value,
        Pays: document.getElementById('countrySelect').value,
        Ville: document.getElementById('citySelect').value,
        Categorie: form.querySelector('select:not(#countrySelect):not(#citySelect)').value,
        ImageID: form.querySelector('input[type="url"][placeholder*="votre-image"]').value,
        InfoURL: form.querySelector('input[type="url"][placeholder*="site-web"]').value || "N/A",
        Date: form.querySelector('input[type="date"]').value
    };

    // Envoi des données
    fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    })
    .then(() => {
        // Message de succès stylé
        displayMessage("Succès ! Votre événement a été publié avec succès et sera visible après modération.", "success");
        form.reset();
        
        // Réinitialisation du bouton et scroll vers le haut du formulaire
        submitBtn.disabled = false;
        submitBtn.innerText = originalBtnText;
        form.scrollIntoView({ behavior: 'smooth', block: 'center' });
    })
    .catch(error => {
        console.error('Erreur:', error);
        displayMessage("Désolé, une erreur est survenue. Veuillez réessayer plus tard.", "danger");
        submitBtn.disabled = false;
        submitBtn.innerText = originalBtnText;
    });
});

/**
 * Fonction pour afficher un message stylé en haut du formulaire
 * @param {string} message - Le texte à afficher
 * @param {string} type - 'success' ou 'danger' (classes Bootstrap)
 */
function displayMessage(message, type) {
    const formContainer = document.querySelector('.form-container');
    
    // Supprimer une ancienne alerte si elle existe
    const existingAlert = document.querySelector('.alert-custom');
    if (existingAlert) existingAlert.remove();

    // Création de l'élément d'alerte
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show alert-custom shadow-sm`;
    alertDiv.role = 'alert';
    alertDiv.innerHTML = `
        <i class="fa-solid ${type === 'success' ? 'fa-circle-check' : 'fa-triangle-exclamation'} me-2"></i>
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

    // Insertion au début du container du formulaire
    formContainer.prepend(alertDiv);

    // Auto-suppression après 8 secondes
    setTimeout(() => {
        if (alertDiv) {
            const bsAlert = new bootstrap.Alert(alertDiv);
            bsAlert.close();
        }
    }, 8000);
}
