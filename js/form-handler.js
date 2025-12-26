// form-handler.js

// REMPLACEZ CETTE URL par l'URL récupérée à l'étape 2
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyB9YsGanP1XM_SfsKR_p7K5m9ULLBkU29LflQVw1qurrkRYDRfkvW4hm9d2JbBc7GSeA/exec";

document.getElementById('eventForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const form = this;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerText;
    
    submitBtn.disabled = true;
    submitBtn.innerText = "Envoi en cours...";

    // Récupération sécurisée par ID
    const formData = {
        Nom: document.getElementById('eventNom').value,
        Pays: document.getElementById('countrySelect').value,
        Ville: document.getElementById('citySelect').value,
        Categorie: document.getElementById('eventCategorie').value,
        ImageID: document.getElementById('eventImage').value,
        InfoURL: document.getElementById('eventInfoURL').value || "N/A",
        Date: document.getElementById('eventDate').value
    };

    fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    })
    .then(() => {
        displayMessage("Succès ! Votre événement a été publié avec succès.", "success");
        form.reset();
        submitBtn.disabled = false;
        submitBtn.innerText = originalBtnText;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    })
    .catch(error => {
        console.error('Erreur:', error);
        displayMessage("Une erreur est survenue lors de l'envoi.", "danger");
        submitBtn.disabled = false;
        submitBtn.innerText = originalBtnText;
    });
});

function displayMessage(message, type) {
    const formContainer = document.querySelector('.form-container');
    const existingAlert = document.querySelector('.alert-custom');
    if (existingAlert) existingAlert.remove();

    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show alert-custom shadow-sm`;
    alertDiv.role = 'alert';
    alertDiv.innerHTML = `
        <i class="fa-solid ${type === 'success' ? 'fa-circle-check' : 'fa-triangle-exclamation'} me-2"></i>
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

    formContainer.prepend(alertDiv);

    setTimeout(() => {
        if (alertDiv) {
            const bsAlert = new bootstrap.Alert(alertDiv);
            bsAlert.close();
        }
    }, 8000);
}
